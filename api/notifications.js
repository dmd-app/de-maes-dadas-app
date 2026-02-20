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

  const { action } = req.body;
  const supabase = getServiceSupabase();
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    // --- LIST notifications for a user ---
    if (action === 'list') {
      const { userId, limit: lim = 50 } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId obrigatorio' });

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(lim);

      if (error) {
        console.error('[notifications] list error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ notifications: data || [] });

    // --- COUNT unread ---
    } else if (action === 'unread_count') {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId obrigatorio' });

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        console.error('[notifications] count error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ count: count || 0 });

    // --- MARK one as read ---
    } else if (action === 'mark_read') {
      const { notificationId, userId } = req.body;
      if (!notificationId || !userId) return res.status(400).json({ error: 'notificationId e userId obrigatorios' });

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) {
        console.error('[notifications] mark_read error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });

    // --- MARK ALL as read ---
    } else if (action === 'mark_all_read') {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId obrigatorio' });

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        console.error('[notifications] mark_all_read error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });

    } else {
      return res.status(400).json({ error: `Acao desconhecida: ${action}` });
    }
  } catch (err) {
    console.error('[notifications] Unexpected error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
