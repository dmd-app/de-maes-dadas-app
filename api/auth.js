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

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const { action } = req.body;

  try {
    // --- SIGNUP ---
    if (action === 'signup') {
      const { email, password, username, confirmToken } = req.body;
      console.log('[auth] Signup attempt - email:', email, 'username:', username);
      if (!email || !password || !username) {
        return res.status(400).json({ error: 'email, password e username obrigatórios' });
      }

      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { username },
        email_confirm: false,
      });

      if (error) {
        if (error.message?.includes('already been registered') || error.message?.includes('already exists')) {
          return res.status(409).json({ error: 'Este email já está registado.' });
        }
        console.error('Signup error:', error);
        return res.status(400).json({ error: error.message });
      }

      // The DB trigger handle_new_user auto-creates a profile row.
      // Update it with the username the user chose.
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', data.user.id);
      if (profileError) {
        console.error('[auth] Profile update error:', profileError);
      }

      // Save confirmation token to dedicated table
      if (confirmToken) {
        const { error: tokenError } = await supabase
          .from('email_confirm_tokens')
          .upsert({ email, token: confirmToken, user_id: data.user.id }, { onConflict: 'email' });
        if (tokenError) {
          console.error('[auth] Failed to save confirm token:', tokenError);
        }
      }

      return res.status(200).json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          username,
        },
      });

    // --- LOGIN ---
    } else if (action === 'login') {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha obrigatórios' });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message?.includes('Invalid login credentials')) {
          return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }
        console.error('Login error:', error);
        return res.status(400).json({ error: error.message });
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', data.user.id)
        .single();

      return res.status(200).json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          username: profile?.username || data.user.user_metadata?.username || data.user.email.split('@')[0],
          avatar_url: profile?.avatar_url || null,
          emailConfirmed: !!data.user.email_confirmed_at,
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      });

    // --- CONFIRM EMAIL (verify token server-side via DB table) ---
    } else if (action === 'confirm_email') {
      const { userId, email: confirmEmail, token } = req.body;

      // Token + email: verify via email_confirm_tokens table (works cross-device)
      if (token && confirmEmail) {
        // Look up token in dedicated table
        const { data: tokenRow, error: tokenError } = await supabase
          .from('email_confirm_tokens')
          .select('*')
          .eq('email', confirmEmail)
          .eq('token', token)
          .single();

        if (tokenError || !tokenRow) {
          console.error('[auth] Token lookup failed:', tokenError?.message || 'no match');
          return res.status(400).json({ error: 'Link de confirmacao invalido ou expirado.' });
        }

        // Token is valid - confirm the user's email in Supabase Auth
        const targetUserId = tokenRow.user_id;
        if (!targetUserId) {
          return res.status(400).json({ error: 'Utilizador nao encontrado.' });
        }

        // Get user info for response
        const { data: userData, error: getUserError } = await supabase.auth.admin.getUserById(targetUserId);
        if (getUserError) {
          console.error('[auth] Get user error:', getUserError);
          return res.status(500).json({ error: 'Erro interno' });
        }

        if (userData.user.email_confirmed_at) {
          // Already confirmed - clean up token and return success
          await supabase.from('email_confirm_tokens').delete().eq('email', confirmEmail);
          return res.status(200).json({ 
            success: true, 
            alreadyConfirmed: true, 
            user: { id: userData.user.id, email: userData.user.email, username: userData.user.user_metadata?.username } 
          });
        }

        const { error: updateError } = await supabase.auth.admin.updateUserById(targetUserId, {
          email_confirm: true,
        });

        if (updateError) {
          console.error('[auth] Confirm email error:', updateError);
          return res.status(400).json({ error: updateError.message });
        }

        // Clean up used token
        await supabase.from('email_confirm_tokens').delete().eq('email', confirmEmail);

        // Generate a magic link to auto-login the user after confirmation
        const { data: linkData } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: confirmEmail,
        });
        
        // Fetch profile for username
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', targetUserId)
          .single();

        return res.status(200).json({ 
          success: true, 
          user: { 
            id: userData.user.id, 
            email: userData.user.email, 
            username: profile?.username || userData.user.user_metadata?.username,
          },
        });
      }

      // Legacy: confirm by userId only (same device)
      if (!userId) {
        return res.status(400).json({ error: 'userId ou token+email obrigatorio' });
      }

      const { error } = await supabase.auth.admin.updateUserById(userId, {
        email_confirm: true,
      });

      if (error) {
        console.error('[auth] Confirm email error:', error);
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ success: true });

    // --- CHECK EMAIL STATUS (polling from pending page) ---
    } else if (action === 'check_email_status') {
      const { email: checkEmail } = req.body;
      if (!checkEmail) {
        return res.status(400).json({ error: 'email obrigatorio' });
      }

      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        return res.status(500).json({ error: 'Erro interno' });
      }

      const user = users.users.find(u => u.email === checkEmail);
      if (!user) {
        return res.status(404).json({ error: 'Utilizador nao encontrado' });
      }

      return res.status(200).json({
        confirmed: !!user.email_confirmed_at,
        user: {
          id: user.id,
          email: user.email,
          username: user.user_metadata?.username,
        },
      });

    // --- SAVE CONFIRM TOKEN (for resend) ---
    } else if (action === 'save_confirm_token') {
      const { email: tokenEmail, token } = req.body;
      if (!tokenEmail || !token) {
        return res.status(400).json({ error: 'email e token obrigatorios' });
      }

      // Find the user to get user_id
      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      let targetUserId = null;
      if (!listError && users?.users) {
        const user = users.users.find(u => u.email === tokenEmail);
        if (user) targetUserId = user.id;
      }

      const { error: upsertError } = await supabase
        .from('email_confirm_tokens')
        .upsert(
          { email: tokenEmail, token, user_id: targetUserId },
          { onConflict: 'email' }
        );

      if (upsertError) {
        console.error('[auth] Failed to save confirm token:', upsertError);
        return res.status(500).json({ error: 'Erro ao salvar token' });
      }

      return res.status(200).json({ success: true });

    // --- REQUEST PASSWORD RESET ---
    } else if (action === 'request_reset') {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email obrigatório' });
      }

      // Check if user exists
      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        console.error('List users error:', listError);
        return res.status(500).json({ error: 'Erro interno' });
      }

      const user = users.users.find(u => u.email === email);
      if (!user) {
        // Don't reveal that email doesn't exist (security)
        return res.status(200).json({ success: true });
      }

      // Generate a reset token (6-digit code)
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 min

      // Store the reset code in user metadata
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...user.user_metadata,
          reset_code: resetCode,
          reset_code_expires_at: expiresAt,
        },
      });

      if (updateError) {
        console.error('Update user error:', updateError);
        return res.status(500).json({ error: 'Erro ao gerar código' });
      }

      return res.status(200).json({
        success: true,
        resetCode,
        userName: user.user_metadata?.username || 'Mami',
      });

    // --- VERIFY RESET CODE ---
    } else if (action === 'verify_reset_code') {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ error: 'Email e código obrigatórios' });
      }

      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        return res.status(500).json({ error: 'Erro interno' });
      }

      const user = users.users.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ error: 'Código inválido.' });
      }

      const storedCode = user.user_metadata?.reset_code;
      const expiresAt = user.user_metadata?.reset_code_expires_at;

      if (!storedCode || storedCode !== code) {
        return res.status(400).json({ error: 'Código inválido.' });
      }

      if (expiresAt && new Date(expiresAt) < new Date()) {
        return res.status(400).json({ error: 'Código expirado. Peça um novo.' });
      }

      return res.status(200).json({ success: true, userId: user.id });

    // --- RESET PASSWORD ---
    } else if (action === 'reset_password') {
      const { email, code, newPassword } = req.body;
      if (!email || !code || !newPassword) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
      }

      // Verify code again
      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        return res.status(500).json({ error: 'Erro interno' });
      }

      const user = users.users.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ error: 'Código inválido.' });
      }

      const storedCode = user.user_metadata?.reset_code;
      const expiresAt = user.user_metadata?.reset_code_expires_at;

      if (!storedCode || storedCode !== code) {
        return res.status(400).json({ error: 'Código inválido.' });
      }
      if (expiresAt && new Date(expiresAt) < new Date()) {
        return res.status(400).json({ error: 'Código expirado.' });
      }

      // Update password and clear reset code
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        password: newPassword,
        user_metadata: {
          ...user.user_metadata,
          reset_code: null,
          reset_code_expires_at: null,
        },
      });

      if (updateError) {
        console.error('Reset password error:', updateError);
        return res.status(500).json({ error: 'Erro ao atualizar senha' });
      }

      return res.status(200).json({ success: true });

    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (err) {
    console.error('Auth API error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
