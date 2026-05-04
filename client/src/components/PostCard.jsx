import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { isLoggedIn } from '../lib/auth.js';

export default function PostCard({ post }) {
  const handle = post.is_anonymous ? 'anon' : (post.author_handle ?? 'anon');
  const initial = handle === 'anon' ? '?' : handle[0].toUpperCase();
  const navigate = useNavigate();

  // Local mirror of like state so we can update the heart instantly on click
  // (optimistic UI) without waiting for the network round-trip.
  // Initialised from the post payload — `liked_by_me` is 0/1 from MySQL.
  const [liked, setLiked] = useState(Boolean(post.liked_by_me));
  const [likeCount, setLikeCount] = useState(post.like_count ?? 0);
  const [busy, setBusy] = useState(false);

  async function toggleLike(e) {
    // The card title/body is wrapped in <Link>, so this button needs to stop
    // the click from also navigating to the thread page.
    e.preventDefault();
    e.stopPropagation();

    // Likes require an account — bounce guests to the sign-in flow.
    if (!isLoggedIn()) {
      navigate('/auth');
      return;
    }
    if (busy) return;

    // Optimistic flip — assume success, revert on error.
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount(c => c + (nextLiked ? 1 : -1));
    setBusy(true);

    try {
      const { liked: serverLiked } = await api.post(`/posts/${post.id}/like`, {});
      // Server is the source of truth — if it disagrees with our optimistic
      // guess (rare race), reconcile to the server's answer.
      if (serverLiked !== nextLiked) {
        setLiked(serverLiked);
        setLikeCount(c => c + (serverLiked ? 1 : -1) - (nextLiked ? 1 : -1));
      }
    } catch (err) {
      // Roll back the optimistic update on failure.
      setLiked(liked);
      setLikeCount(c => c + (nextLiked ? -1 : 1));
      console.error('like failed:', err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="card" style={styles.card}>
      <header style={styles.header}>
        <div style={styles.authorRow}>
          <div style={styles.avatar}>{initial}</div>
          <div>
            <span style={styles.handle}>@{handle}</span>
            <div style={styles.time}>{timeAgo(post.created_at)}</div>
          </div>
        </div>
        {post.category_tag && <span className="tag">{post.category_tag}</span>}
      </header>

      <Link to={`/thread/${post.id}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>
        <h3 style={styles.title}>{post.title}</h3>
        {post.body && <p style={styles.body}>{post.body}</p>}
      </Link>

      <footer style={styles.footer}>
        <button
          onClick={toggleLike}
          disabled={busy}
          aria-pressed={liked}
          aria-label={liked ? 'Unlike post' : 'Like post'}
          style={{ ...styles.likeBtn, color: liked ? 'var(--accent)' : 'var(--text-muted)' }}
        >
          {/* Filled heart when liked, outline heart otherwise */}
          <span style={{ fontSize: 16, lineHeight: 1 }}>{liked ? '♥' : '♡'}</span>
          <span>{likeCount}</span>
        </button>
        <span style={styles.stat}>💬 {post.comment_count ?? 0}</span>
        <span style={styles.share}>↗ Share</span>
      </footer>
    </article>
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
  card: { marginBottom: 12 },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
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
  time: { color: 'var(--text-muted)', fontSize: 12, marginTop: 1 },
  title: { margin: '0 0 6px', fontSize: 16, fontWeight: 700, lineHeight: 1.3 },
  body: { margin: 0, color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.5 },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginTop: 14,
    color: 'var(--text-muted)',
    fontSize: 13,
  },
  stat: { display: 'flex', alignItems: 'center', gap: 4 },
  // The like button mimics the static stat row visually so it doesn't look
  // out-of-place — no border/background, just a clickable heart + count.
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
  share: { marginLeft: 'auto', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13 },
};
