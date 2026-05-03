import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const handle = post.is_anonymous ? 'anon' : (post.author_handle ?? 'anon');
  const initial = handle === 'anon' ? '?' : handle[0].toUpperCase();

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
        <span style={styles.stat}>♡ {post.like_count ?? 0}</span>
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
  share: { marginLeft: 'auto', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13 },
};
