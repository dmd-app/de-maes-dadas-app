import { createClient } from '@supabase/supabase-js';

const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeWV2cW1wenJpeGZiZXpwYW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzM3NTAsImV4cCI6MjA4NTcwOTc1MH0.SfPKida2v1puJCdyXXychpgRxV2IrADSVhesw8uRwtg';

const getSupabase = (accessToken) => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ysyevqmpzrixfbezpams.supabase.co';
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // For authenticated operations, use anon key + user token (RLS applies)
  if (accessToken && anonKey) {
    return createClient(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
  }
  // Fallback to service role (no RLS)
  if (serviceKey) {
    return createClient(url, serviceKey);
  }
  return null;
};

// Service-role client for admin operations (counters, etc.)
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
  const accessToken = req.headers.authorization?.replace('Bearer ', '') || null;
  const supabase = getSupabase(accessToken);
  const serviceSupabase = getServiceSupabase();

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    // ─── LIST POSTS ──────────────────────────────────────────
    if (action === 'list') {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('[posts] list error:', error);
        return res.status(500).json({ error: error.message });
      }

      // For each post, fetch comments and check if current user liked it
      const enriched = await Promise.all(posts.map(async (post) => {
        // Fetch comments for this post
        const { data: comments } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', post.id)
          .eq('status', 'active')
          .order('created_at', { ascending: true });

        // Check if current user liked this post
        let liked = false;
        if (accessToken) {
          const { data: likeRow } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', post.id)
            .maybeSingle();
          liked = !!likeRow;
        }

        // Check which comments user liked
        const enrichedComments = await Promise.all((comments || []).map(async (c) => {
          let commentLiked = false;
          if (accessToken) {
            const { data: cLike } = await supabase
              .from('comment_likes')
              .select('id')
              .eq('comment_id', c.id)
              .maybeSingle();
            commentLiked = !!cLike;
          }
          return {
            id: c.id,
            author: c.author_name,
            text: c.body,
            likes: c.likes_count,
            liked: commentLiked,
            time: formatTimeAgo(c.created_at),
            parentCommentId: c.parent_comment_id,
            userId: c.user_id,
            replies: [],
          };
        }));

        // Build nested replies
        const topLevel = [];
        const byId = {};
        enrichedComments.forEach(c => { byId[c.id] = c; });
        enrichedComments.forEach(c => {
          if (c.parentCommentId && byId[c.parentCommentId]) {
            byId[c.parentCommentId].replies.push(c);
          } else {
            topLevel.push(c);
          }
        });

        return {
          id: post.id,
          userId: post.user_id,
          category: post.category,
          categoryColor: mapCategoryColor(post.category, post.category_color),
          author: post.author_name,
          time: formatTimeAgo(post.created_at),
          title: post.title || '',
          desc: post.body,
          likes: post.likes_count,
          comments: post.comments_count,
          liked,
          commentsList: topLevel,
          status: post.status,
        };
      }));

      return res.status(200).json({ posts: enriched });

    // ─── CREATE POST ─────────────────────────────────────────
    } else if (action === 'create') {
      const { body, category, categoryColor, authorName, userId } = req.body;
      if (!body) {
        return res.status(400).json({ error: 'body is required' });
      }

      const { data: post, error } = await (serviceSupabase || supabase)
        .from('posts')
        .insert({
          user_id: userId || null,
          author_name: authorName || 'Anonima',
          category: category || 'Desabafo',
          category_color: categoryColor || '#FF66C4',
          body,
          title: '',
        })
        .select()
        .single();

      if (error) {
        console.error('[posts] create error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        success: true,
        post: {
          id: post.id,
          userId: post.user_id,
          category: post.category,
          categoryColor: mapCategoryColor(post.category, post.category_color),
          author: post.author_name,
          time: 'agora',
          title: post.title || '',
          desc: post.body,
          likes: 0,
          comments: 0,
          liked: false,
          commentsList: [],
          status: post.status,
        },
      });

    // ─── LIKE / UNLIKE POST ─────────────────────────────────
    } else if (action === 'toggle_like') {
      const { postId, userId } = req.body;
      if (!postId || !userId) {
        return res.status(400).json({ error: 'postId and userId required' });
      }

      const sb = serviceSupabase || supabase;

      // Check if already liked
      const { data: existing } = await sb
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        // Unlike
        await sb.from('post_likes').delete().eq('id', existing.id);
        await sb.rpc('decrement_post_likes', { p_post_id: postId });
        return res.status(200).json({ liked: false });
      } else {
        // Like
        await sb.from('post_likes').insert({ post_id: postId, user_id: userId });
        await sb.rpc('increment_post_likes', { p_post_id: postId });
        return res.status(200).json({ liked: true });
      }

    // ─── ADD COMMENT ─────────────────────────────────────────
    } else if (action === 'add_comment') {
      const { postId, body, authorName, userId, parentCommentId } = req.body;
      if (!postId || !body) {
        return res.status(400).json({ error: 'postId and body required' });
      }

      const sb = serviceSupabase || supabase;

      const { data: comment, error } = await sb
        .from('comments')
        .insert({
          post_id: postId,
          user_id: userId || null,
          parent_comment_id: parentCommentId || null,
          author_name: authorName || 'Anonima',
          body,
        })
        .select()
        .single();

      if (error) {
        console.error('[posts] add_comment error:', error);
        return res.status(500).json({ error: error.message });
      }

      // Increment comment count on post
      await sb.rpc('increment_post_comments', { p_post_id: postId });

      return res.status(200).json({
        success: true,
        comment: {
          id: comment.id,
          author: comment.author_name,
          text: comment.body,
          likes: 0,
          liked: false,
          time: 'agora',
          parentCommentId: comment.parent_comment_id,
          userId: comment.user_id,
          replies: [],
        },
      });

    // ─── LIKE / UNLIKE COMMENT ───────────────────────────────
    } else if (action === 'toggle_comment_like') {
      const { commentId, userId } = req.body;
      if (!commentId || !userId) {
        return res.status(400).json({ error: 'commentId and userId required' });
      }

      const sb = serviceSupabase || supabase;

      const { data: existing } = await sb
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        await sb.from('comment_likes').delete().eq('id', existing.id);
        await sb.rpc('decrement_comment_likes', { p_comment_id: commentId });
        return res.status(200).json({ liked: false });
      } else {
        await sb.from('comment_likes').insert({ comment_id: commentId, user_id: userId });
        await sb.rpc('increment_comment_likes', { p_comment_id: commentId });
        return res.status(200).json({ liked: true });
      }

    // ─── DELETE POST ─────────────────────────────────────────
    } else if (action === 'delete') {
      const { postId, userId } = req.body;
      if (!postId || !userId) {
        return res.status(400).json({ error: 'postId and userId required' });
      }

      const sb = serviceSupabase || supabase;

      const { error } = await sb
        .from('posts')
        .update({ status: 'removed' })
        .eq('id', postId)
        .eq('user_id', userId);

      if (error) {
        console.error('[posts] delete error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });

    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (err) {
    console.error('[posts] API error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// ─── HELPERS ───────────────────────────────────────────────

function formatTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atras`;
  const days = Math.floor(hours / 24);
  return `${days}d atras`;
}

function mapCategoryColor(category, hexColor) {
  const colorMap = {
    'Desabafo': 'bg-[#FF66C4] text-white',
    'Maternidade Solo': 'bg-soft-blue text-white',
    'Sono': 'bg-indigo-400 text-white',
    'Volta ao Trabalho': 'bg-emerald-500 text-white',
    'Vitoria': 'bg-emerald-400 text-white',
    'Dica': 'bg-blue-400 text-white',
    'Pergunta': 'bg-purple-400 text-white',
    'Geral': 'bg-gray-400 text-white',
  };
  return colorMap[category] || `bg-[${hexColor || '#FF66C4'}] text-white`;
}
