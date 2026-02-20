import { createClient } from '@supabase/supabase-js';

const getServiceSupabase = () => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ysyevqmpzrixfbezpams.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  return createClient(url, serviceKey);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { postId, commentText, commenterName } = req.body;

  if (!postId || !commentText) {
    return res.status(400).json({ error: 'postId and commentText are required' });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return res.status(500).json({ error: 'Service role not configured' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'BREVO_API_KEY not configured' });
  }

  try {
    // 1. Fetch the post to get the author's user_id
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('user_id, author_name, body')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      console.error('[notify-reply] Post not found:', postError);
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.user_id) {
      // Anonymous post - no email to notify
      return res.status(200).json({ success: true, skipped: true, reason: 'Anonymous post author' });
    }

    // 2. Look up the author's email from the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, username')
      .eq('id', post.user_id)
      .single();

    if (userError || !userData?.email) {
      console.error('[notify-reply] User email not found:', userError);
      return res.status(200).json({ success: true, skipped: true, reason: 'Author email not found' });
    }

    const authorEmail = userData.email;
    const authorName = userData.username || post.author_name || 'Mami';
    const postPreview = post.body?.substring(0, 80) || '';

    // 3. Fetch verified sender from Brevo
    let senderEmail = 'noreply@demaesdadas.com';
    let senderName = 'De Maes Dadas';
    try {
      const sendersRes = await fetch('https://api.brevo.com/v3/senders', {
        headers: { 'accept': 'application/json', 'api-key': apiKey },
      });
      if (sendersRes.ok) {
        const sendersData = await sendersRes.json();
        const activeSender = sendersData.senders?.find(s => s.active);
        if (activeSender) {
          senderEmail = activeSender.email;
          senderName = activeSender.name || 'De Maes Dadas';
        }
      }
    } catch (e) {
      console.error('[notify-reply] Failed to fetch senders:', e.message);
    }

    // 4. Build warm, inviting email
    const commentPreview = commentText.substring(0, 120);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F0F4FF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h2 style="color:#FF66C4;font-size:22px;margin:0;">De M\u00e3es Dadas</h2>
      <p style="color:#B946FF;font-size:13px;margin:4px 0 0;">Aldeia Digital</p>
    </div>
    <div style="background:white;border-radius:24px;padding:40px 28px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
      <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#FF66C4,#B946FF);margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:28px;color:white;">&#128172;</span>
      </div>
      <h1 style="color:#1f2937;font-size:20px;margin:0 0 8px;">Algu\u00e9m da aldeia te respondeu!</h1>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 20px;">
        Oi, <strong>${authorName}</strong>! Uma m\u00e3e da aldeia deixou uma mensagem no seu post.
        Voc\u00ea n\u00e3o est\u00e1 sozinha \u2014 a aldeia est\u00e1 aqui por voc\u00ea.
      </p>

      <!-- Post preview -->
      <div style="background:#F0F4FF;border-radius:16px;padding:16px;margin:0 0 16px;text-align:left;">
        <p style="color:#9ca3af;font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.5px;">Seu post</p>
        <p style="color:#6b7280;font-size:13px;line-height:1.5;margin:0;font-style:italic;">"${postPreview}${postPreview.length >= 80 ? '...' : ''}"</p>
      </div>

      <!-- Comment preview -->
      <div style="background:#F0F9FF;border-radius:16px;padding:16px;margin:0 0 24px;text-align:left;border-left:3px solid #60A5FA;">
        <p style="color:#9ca3af;font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.5px;">${commenterName || 'Uma m\u00e3e'} respondeu</p>
        <p style="color:#374151;font-size:14px;line-height:1.6;margin:0;">"${commentPreview}${commentPreview.length >= 120 ? '...' : ''}"</p>
      </div>

      <a href="https://demaesdadas.com.br" style="display:inline-block;background:linear-gradient(135deg,#FF66C4,#B946FF);color:white;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 40px;border-radius:12px;">
        Voltar para a Aldeia
      </a>
    </div>
    <p style="text-align:center;color:#d1d5db;font-size:11px;margin-top:24px;">
      De M\u00e3es Dadas &mdash; Aldeia Digital<br/>Ningu\u00e9m deveria maternar sozinha.
    </p>
  </div>
</body>
</html>`;

    // 5. Send via Brevo SMTP API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: authorEmail, name: authorName }],
        subject: 'Algu\u00e9m da aldeia te respondeu! \uD83D\uDCAC',
        htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[notify-reply] Brevo SMTP error:', JSON.stringify(errorData));
      return res.status(response.status).json({ error: errorData.message || 'Failed to send email' });
    }

    console.log('[notify-reply] Email sent to:', authorEmail, 'for post:', postId);
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('[notify-reply] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
