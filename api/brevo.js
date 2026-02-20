import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ysyevqmpzrixfbezpams.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  return createClient(url, serviceKey);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Brevo API key not configured' });
  }

  const { action, email, name, attributes, listIds } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    if (action === 'create_contact') {
      // Create or update a contact in Brevo
      const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          email,
          attributes: {
            FIRSTNAME: name || '',
            SOURCE: 'app_demaesdadas',
            ...attributes,
          },
          listIds: listIds || [2],
          updateEnabled: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // "duplicate_parameter" means contact already exists, which is fine with updateEnabled
        if (errorData.code === 'duplicate_parameter') {
          return res.status(200).json({ success: true, message: 'Contact already exists' });
        }
        console.error('Brevo API error:', errorData);
        return res.status(response.status).json({ error: errorData.message || 'Brevo API error' });
      }

      return res.status(200).json({ success: true });

    } else if (action === 'send_event') {
      // Track an event for the contact (e.g., post created, coming soon interest)
      const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          email,
          attributes: {
            ...attributes,
          },
          updateEnabled: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.code === 'duplicate_parameter') {
          return res.status(200).json({ success: true });
        }
        console.error('Brevo API error:', errorData);
        return res.status(response.status).json({ error: errorData.message || 'Brevo API error' });
      }

      return res.status(200).json({ success: true });

    } else if (action === 'notify_coming_soon') {
      const { feature, userId } = req.body;

      // 1. Save to Supabase database
      const supabase = getSupabase();
      if (supabase) {
        const insertData = { email, feature: feature || 'general' };
        if (userId) insertData.user_id = userId;
        const { error: dbError } = await supabase
          .from('coming_soon_notifications')
          .upsert(insertData, { onConflict: 'email,feature' });
        if (dbError) {
          console.error('Supabase insert error:', dbError);
        }
      }

      // 2. Add contact to Brevo CRM list
      const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          email,
          attributes: {
            SOURCE: 'coming_soon_notify',
            COMING_SOON_INTEREST: true,
            COMING_SOON_FEATURE: feature || 'general',
          },
          listIds: listIds || [3],
          updateEnabled: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.code === 'duplicate_parameter') {
          return res.status(200).json({ success: true });
        }
        console.error('Brevo API error:', errorData);
        return res.status(response.status).json({ error: errorData.message || 'Brevo API error' });
      }

      return res.status(200).json({ success: true });

    } else if (action === 'send_confirmation_email') {
      const { confirmToken, userName, baseUrl } = req.body;
      if (!confirmToken || !baseUrl) {
        return res.status(400).json({ error: 'confirmToken and baseUrl are required' });
      }

      const confirmLink = `${baseUrl}/confirm?token=${encodeURIComponent(confirmToken)}&email=${encodeURIComponent(email)}`;
      const displayName = userName || 'Mami';

      const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#FFF5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h2 style="color:#FF66C4;font-size:22px;margin:0;">De M\u00e3es Dadas</h2>
      <p style="color:#B946FF;font-size:13px;margin:4px 0 0;">Aldeia Digital</p>
    </div>
    <div style="background:white;border-radius:24px;padding:40px 28px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
      <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#FF66C4,#B946FF);margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:28px;color:white;">&#9993;</span>
      </div>
      <h1 style="color:#1f2937;font-size:20px;margin:0 0 8px;">Ol\u00e1, ${displayName}!</h1>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 28px;">
        Bem-vinda \u00e0 Aldeia! Para ativar todas as funcionalidades da sua conta, confirme o seu email clicando no bot\u00e3o abaixo.
      </p>
      <a href="${confirmLink}" style="display:inline-block;background:linear-gradient(135deg,#FF66C4,#B946FF);color:white;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 40px;border-radius:12px;">
        Confirmar meu email
      </a>
      <p style="color:#9ca3af;font-size:12px;line-height:1.5;margin:24px 0 0;">
        Se o bot\u00e3o n\u00e3o funcionar, copie e cole este link no seu navegador:<br/>
        <a href="${confirmLink}" style="color:#FF66C4;word-break:break-all;font-size:11px;">${confirmLink}</a>
      </p>
    </div>
    <p style="text-align:center;color:#d1d5db;font-size:11px;margin-top:24px;">
      De M\u00e3es Dadas &mdash; Aldeia Digital<br/>Ningu\u00e9m deveria maternar sozinha.
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
          sender: { name: 'De Maes Dadas', email: 'noreply@demaesdadas.com' },
          to: [{ email, name: displayName }],
          subject: 'Confirme o seu email - De M\u00e3es Dadas',
          htmlContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Brevo SMTP API error:', errorData);
        return res.status(response.status).json({ error: errorData.message || 'Failed to send confirmation email' });
      }

      return res.status(200).json({ success: true });

    } else if (action === 'send_reset_code_email') {
      const { resetCode, userName } = req.body;
      if (!resetCode) {
        return res.status(400).json({ error: 'resetCode is required' });
      }

      const displayName = userName || 'Mami';

      const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#FFF5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h2 style="color:#FF66C4;font-size:22px;margin:0;">De M\u00e3es Dadas</h2>
      <p style="color:#B946FF;font-size:13px;margin:4px 0 0;">Aldeia Digital</p>
    </div>
    <div style="background:white;border-radius:24px;padding:40px 28px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
      <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#FF66C4,#B946FF);margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:28px;color:white;">&#128274;</span>
      </div>
      <h1 style="color:#1f2937;font-size:20px;margin:0 0 8px;">Recuperar senha</h1>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 24px;">
        Ol\u00e1, ${displayName}! Use o c\u00f3digo abaixo para redefinir a sua senha. O c\u00f3digo expira em 30 minutos.
      </p>
      <div style="background:#FFF5F9;border:2px dashed #FF66C4;border-radius:16px;padding:20px;margin:0 auto 24px;">
        <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1f2937;">${resetCode}</span>
      </div>
      <p style="color:#9ca3af;font-size:12px;line-height:1.5;margin:0;">
        Se n\u00e3o pediu para redefinir a sua senha, ignore este email. A sua conta continua segura.
      </p>
    </div>
    <p style="text-align:center;color:#d1d5db;font-size:11px;margin-top:24px;">
      De M\u00e3es Dadas &mdash; Aldeia Digital<br/>Ningu\u00e9m deveria maternar sozinha.
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
          sender: { name: 'De Maes Dadas', email: 'noreply@demaesdadas.com' },
          to: [{ email, name: displayName }],
          subject: 'C\u00f3digo de recupera\u00e7\u00e3o - De M\u00e3es Dadas',
          htmlContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Brevo SMTP API error:', errorData);
        return res.status(response.status).json({ error: errorData.message || 'Failed to send reset email' });
      }

      return res.status(200).json({ success: true });

    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (err) {
    console.error('Brevo integration error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
