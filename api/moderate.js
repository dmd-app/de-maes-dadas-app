import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'aldeia@demaesdadas.com.br';

const getServiceSupabase = () => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ysyevqmpzrixfbezpams.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  return createClient(url, serviceKey);
};

export default async function handler(req, res) {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return res.status(500).json({ error: 'Service role not configured' });
  }

  // ─── GET: Magic links from email (approve/reject) ─────
  if (req.method === 'GET') {
    const { action: qAction, id, type, token } = req.query || {};
    const expectedToken = process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 16);

    if (!expectedToken || token !== expectedToken) {
      return res.status(403).send('<html><body style="font-family:sans-serif;text-align:center;padding:60px;"><h2 style="color:#ef4444;">Acesso negado</h2><p>Token invalido.</p></body></html>');
    }

    if ((qAction === 'quick_approve' || qAction === 'quick_reject') && id && type) {
      const table = type === 'comment' ? 'comments' : 'posts';
      const newStatus = qAction === 'quick_approve' ? 'approved' : 'rejected';
      const label = qAction === 'quick_approve' ? 'aprovado' : 'rejeitado';
      const color = qAction === 'quick_approve' ? '#10b981' : '#ef4444';

      const { error } = await supabase.from(table).update({ status: newStatus }).eq('id', id);

      if (error) {
        return res.status(500).send(`<html><body style="font-family:sans-serif;text-align:center;padding:60px;"><h2 style="color:#ef4444;">Erro</h2><p>${error.message}</p></body></html>`);
      }

      return res.status(200).send(`
        <html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#FFF5F9;">
          <div style="max-width:400px;margin:0 auto;background:white;border-radius:20px;padding:40px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
            <div style="width:60px;height:60px;border-radius:50%;background:${color};margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
              <span style="font-size:28px;color:white;">${qAction === 'quick_approve' ? '&#10003;' : '&#10007;'}</span>
            </div>
            <h2 style="color:#1f2937;">Conteudo ${label}!</h2>
            <p style="color:#6b7280;">Pode fechar esta janela.</p>
          </div>
        </body></html>
      `);
    }

    return res.status(400).send('<html><body><p>Acao invalida.</p></body></html>');
  }

  // ─── POST: API actions ─────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.body;

  try {
    // ─── LIST PENDING (Admin only) ─────────────────────────
    if (action === 'list_pending') {
      const { adminEmail } = req.body;
      if (adminEmail !== ADMIN_EMAIL) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      // Fetch pending posts
      const { data: pendingPosts, error: postsErr } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (postsErr) {
        return res.status(500).json({ error: postsErr.message });
      }

      // Fetch pending comments
      const { data: pendingComments, error: commentsErr } = await supabase
        .from('comments')
        .select('*, posts!inner(body, category)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (commentsErr) {
        return res.status(500).json({ error: commentsErr.message });
      }

      return res.status(200).json({
        posts: (pendingPosts || []).map(p => ({
          id: p.id,
          type: 'post',
          author: p.author_name,
          category: p.category,
          body: p.body,
          userId: p.user_id,
          createdAt: p.created_at,
        })),
        comments: (pendingComments || []).map(c => ({
          id: c.id,
          type: 'comment',
          author: c.author_name,
          body: c.body,
          postBody: c.posts?.body?.substring(0, 80) || '',
          postCategory: c.posts?.category || '',
          postId: c.post_id,
          userId: c.user_id,
          createdAt: c.created_at,
        })),
      });

    // ─── APPROVE ──────────────────────────────────────────
    } else if (action === 'approve') {
      const { id, type, adminEmail } = req.body;
      if (adminEmail !== ADMIN_EMAIL) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const table = type === 'comment' ? 'comments' : 'posts';
      const { error } = await supabase
        .from(table)
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });

    // ─── REJECT ───────────────────────────────────────────
    } else if (action === 'reject') {
      const { id, type, adminEmail } = req.body;
      if (adminEmail !== ADMIN_EMAIL) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const table = type === 'comment' ? 'comments' : 'posts';
      const { error } = await supabase
        .from(table)
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });

    // ─── SEND MODERATION EMAIL ────────────────────────────
    } else if (action === 'notify_admin') {
      const { contentType, author, body: contentBody, contentId } = req.body;

      const apiKey = process.env.BREVO_API_KEY;
      if (!apiKey) {
        console.error('[moderate] BREVO_API_KEY not configured');
        return res.status(200).json({ success: true, emailSkipped: true });
      }

      // Fetch verified sender
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
        console.error('[moderate] Failed to fetch senders:', e.message);
      }

      const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'https://aldeiademaesdadas.com.br';

      const approveUrl = `${baseUrl}/api/moderate?action=quick_approve&id=${contentId}&type=${contentType}&token=${process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 16)}`;
      const rejectUrl = `${baseUrl}/api/moderate?action=quick_reject&id=${contentId}&type=${contentType}&token=${process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 16)}`;

      const typeLabel = contentType === 'comment' ? 'Comentario' : 'Post';
      const preview = (contentBody || '').substring(0, 200);

      const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#FFF5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <h2 style="color:#1E3A8A;font-size:20px;margin:0;">Guardia da Aldeia</h2>
      <p style="color:#FF66C4;font-size:13px;margin:4px 0 0;">Novo conteudo para moderar</p>
    </div>
    <div style="background:white;border-radius:20px;padding:32px 24px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
      <p style="color:#6b7280;font-size:13px;margin:0 0 4px;">Tipo: <strong style="color:#1f2937;">${typeLabel}</strong></p>
      <p style="color:#6b7280;font-size:13px;margin:0 0 16px;">Autora: <strong style="color:#1f2937;">${author || 'Anonima'}</strong></p>
      <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="color:#374151;font-size:14px;line-height:1.6;margin:0;">${preview}</p>
      </div>
      <div style="text-align:center;">
        <a href="${approveUrl}" style="display:inline-block;background:#10b981;color:white;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 32px;border-radius:10px;margin-right:12px;">Aprovar</a>
        <a href="${rejectUrl}" style="display:inline-block;background:#ef4444;color:white;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 32px;border-radius:10px;">Rejeitar</a>
      </div>
    </div>
    <p style="text-align:center;color:#d1d5db;font-size:11px;margin-top:20px;">
      Ou abra a aba Admin no app para moderar.
    </p>
  </div>
</body>
</html>`;

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: ADMIN_EMAIL, name: 'Guardia da Aldeia' }],
          subject: `[Moderacao] Novo ${typeLabel} de ${author || 'Anonima'}`,
          htmlContent,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('[moderate] Email send error:', JSON.stringify(err));
      }

      return res.status(200).json({ success: true });

    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (err) {
    console.error('[moderate] API error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


