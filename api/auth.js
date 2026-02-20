import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

// Simple password hashing using PBKDF2 (no bcrypt needed for serverless)
function hashPassword(password, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash: `${salt}:${hash}`, salt };
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, email, username, password } = req.body;

  if (!action) {
    return res.status(400).json({ error: 'Action is required' });
  }

  try {
    // --- SIGNUP ---
    if (action === 'signup') {
      if (!email || !username || !password) {
        return res.status(400).json({ error: 'Email, nome e senha são obrigatórios' });
      }

      // Check if email already exists
      const { data: existing, error: lookupError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (lookupError) {
        console.error('Supabase lookup error:', lookupError);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

      if (existing) {
        return res.status(409).json({ error: 'Este email já está cadastrado. Faça login.' });
      }

      // Hash password
      const { hash } = hashPassword(password);

      // Insert new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email: email.toLowerCase().trim(),
          username: username.trim(),
          password_hash: hash,
          accepted_terms: true,
          terms_accepted_at: new Date().toISOString(),
        })
        .select('id, email, username, created_at')
        .single();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        if (insertError.code === '23505') {
          return res.status(409).json({ error: 'Este email já está cadastrado. Faça login.' });
        }
        return res.status(500).json({ error: 'Erro ao criar conta' });
      }

      return res.status(201).json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.username,
        },
      });

    // --- LOGIN ---
    } else if (action === 'login') {
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const identifier = email.toLowerCase().trim();

      // Find user by email or username
      const { data: user, error: lookupError } = await supabase
        .from('users')
        .select('id, email, username, password_hash')
        .or(`email.eq.${identifier},username.eq.${identifier}`)
        .maybeSingle();

      if (lookupError) {
        console.error('Supabase lookup error:', lookupError);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Verify password
      const isValid = verifyPassword(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Update last login
      await supabase
        .from('users')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', user.id);

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.username,
        },
      });

    // --- CHECK EMAIL ---
    } else if (action === 'check_email') {
      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
      }

      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      return res.status(200).json({ exists: !!existing });

    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
