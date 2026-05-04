import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { isLoggedIn, getUser } from '../lib/auth.js';

export default function Thread() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [reply, setReply] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyError, setReplyError] = useState(null);

  const loggedIn = isLoggedIn();
  const user = getUser();
  const userInitial = isAnon ? '?' : (user?.handle?.[0] ?? '?').toUpperCase();

  useEffect(() => {
    Promise.all([
      api.get(`/posts/${id}`),
      api.get(`/comments?post_id=${id}`),
    ])
      .then(([postData, commentData]) => {
        setPost(postData);
        setComments(commentData.comments ?? []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function submitReply(e) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSubmitting(true);
    setReplyError(null);
    try {
      const comment = await api.post('/comments', {
        post_id: Number(id),
        body: reply.trim(),
        is_anonymous: isAnon,
      });
      setComments(cs => [...cs, comment]);
      setReply('');
    } catch (err) {
      setReplyError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteComment(commentId) {
    try {
      await api.del(`/comments/${commentId}`);
      setComments(cs => cs.filter(c => c.id !== commentId));
    } catch (err) {
      alert(err.message);
    }
  }

  /** Toggle like on the main post. Same optimistic-update pattern as PostCard:
   *  flip immediately, reconcile with the server's response, roll back on error. */
  async function toggleLike() {
    if (!loggedIn) {
      navigate('/auth');
      return;
    }
    // Snapshot the pre-click state so we can roll back cleanly if the request fails.
    const wasLiked = Boolean(post.liked_by_me);
    const nextLiked = !wasLiked;
    const delta = nextLiked ? 1 : -1;

    setPost(p => ({ ...p, liked_by_me: nextLiked ? 1 : 0, like_count: (p.like_count ?? 0) + delta }));

    try {
      const { liked: serverLiked } = await api.post(`/posts/${post.id}/like`, {});
      // Reconcile if the server's view differs from our optimistic guess.
      if (serverLiked !== nextLiked) {
        setPost(p => ({
          ...p,
          liked_by_me: serverLiked ? 1 : 0,
          like_count: (p.like_count ?? 0) + (serverLiked ? 1 : -1) - delta,
        }));
      }
    } catch (err) {
      // Roll back to the original state.
      setPost(p => ({ ...p, liked_by_me: wasLiked ? 1 : 0, like_count: (p.like_count ?? 0) - delta }));
      console.error('like failed:', err.message);
    }
  }

  if (loading) return <p style={{ color: 'var(--text-muted)', padding: 24 }}>Loading...</p>;
  if (notFound || !post) return <p style={{ color: 'var(--text-muted)', padding: 24 }}>Post not found.</p>;

  const postHandle = post.is_anonymous ? 'anon' : (post.author_handle ?? 'anon');
  const postInitial = postHandle === 'anon' ? '?' : postHandle[0].toUpperCase();
  const liked = Boolean(post.liked_by_me);

  return (
    <div>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>

      {/* full post */}
      <article className="card" style={{ marginBottom: 16 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div style={styles.authorRow}>
            <div style={{ ...styles.avatar, width: 40, height: 40, fontSize: 16 }}>{postInitial}</div>
            <div>
              <span style={styles.handle}>@{postHandle}</span>
              <div style={styles.time}>{timeAgo(post.created_at)}</div>
            </div>
          </div>
          {post.category_tag && <span className="tag">{post.category_tag}</span>}
        </header>

        <h2 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 700 }}>{post.title}</h2>
        {post.body && <p style={{ margin: '0 0 14px', color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6 }}>{post.body}</p>}

        <footer style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 12, borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 13 }}>
          {/* Like toggle — filled heart + accent color when the viewer has liked this post */}
          <button
            onClick={toggleLike}
            aria-pressed={liked}
            aria-label={liked ? 'Unlike post' : 'Like post'}
            style={{ ...styles.likeBtn, color: liked ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>{liked ? '♥' : '♡'}</span>
            <span>{post.like_count ?? 0}</span>
          </button>
          <span>💬 {comments.length}</span>
          <span style={{ marginLeft: 'auto', cursor: 'pointer' }}>↗ Share</span>
        </footer>
      </article>

      {/* reply box */}
      <form className="card" onSubmit={submitReply} style={{ marginBottom: 20 }}>
        <div style={styles.composerRow}>
          <div style={{ ...styles.avatar, background: 'var(--accent)', color: 'var(--accent-on)', opacity: isAnon ? 0.45 : 1 }}>
            {userInitial}
          </div>
          <input
            type="text"
            placeholder="Write a reply..."
            value={reply}
            onChange={e => setReply(e.target.value)}
            style={styles.input}
          />
          {loggedIn && (
            <button type="button" onClick={() => setIsAnon(a => !a)} style={styles.iconBtn} title={isAnon ? 'Posting anonymously' : 'Post as yourself'}>
              {isAnon ? 'anon' : 'you'}
            </button>
          )}
          <button type="submit" className="btn" disabled={submitting || !reply.trim()} style={{ flexShrink: 0 }}>
            {submitting ? '...' : 'Reply'}
          </button>
        </div>
        {replyError && <p style={{ color: '#f87171', fontSize: 13, margin: '8px 0 0' }}>{replyError}</p>}
      </form>

      {/* comments */}
      <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 12px' }}>
        {comments.length} {comments.length === 1 ? 'reply' : 'replies'}
      </p>

      {comments.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>No replies yet — start the conversation!</p>
      )}

      {comments.map(c => {
        const cHandle = c.is_anonymous ? 'anon' : (c.author_handle ?? 'anon');
        const cInitial = cHandle === 'anon' ? '?' : cHandle[0].toUpperCase();
        const isOwner = loggedIn && !c.is_anonymous && c.author_handle === user?.handle;

        return (
          <article key={c.id} className="card" style={{ marginBottom: 10 }}>
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={styles.authorRow}>
                <div style={{ ...styles.avatar, width: 32, height: 32, fontSize: 13 }}>{cInitial}</div>
                <div>
                  <span style={styles.handle}>@{cHandle}</span>
                  <div style={styles.time}>{timeAgo(c.created_at)}</div>
                </div>
              </div>
              {isOwner && (
                <button onClick={() => deleteComment(c.id)} style={styles.deleteBtn}>
                  Delete
                </button>
              )}
            </header>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{c.body}</p>
          </article>
        );
      })}
    </div>
  );
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const styles = {
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 14,
    cursor: 'pointer',
    padding: '0 0 16px',
    display: 'block',
  },
  authorRow: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'var(--accent-soft)',
    color: 'var(--accent)',
    fontWeight: 700,
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  handle: { color: 'var(--text)', fontSize: 14, fontWeight: 600 },
  time: { color: 'var(--text-muted)', fontSize: 12, marginTop: 2 },
  // Mimics the static stat spans (no border/background) so the button looks
  // like part of the footer row, not a heavy CTA.
  likeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 13,
  },
  composerRow: { display: 'flex', alignItems: 'center', gap: 10 },
  input: {
    flex: 1,
    background: 'var(--bg)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: 999,
    padding: '10px 16px',
    fontFamily: 'inherit',
    fontSize: 14,
    outline: 'none',
  },
  iconBtn: {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    cursor: 'pointer',
    flexShrink: 0,
  },
  deleteBtn: {
    marginLeft: 'auto',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 12,
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: 6,
  },
};
