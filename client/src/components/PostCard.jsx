import { Link } from 'react-router-dom';

/**
 * Placeholder PostCard. Erick will polish the final version with reactions bar,
 * avatar, proper typography. Shared across all mode pages — don't style it
 * mode-specifically; colors come from the CSS variables on <body>.
 */
export default function PostCard({ post }) {
  return (
    <article className="card" style={{ marginBottom: 12 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          @{post.author_handle ?? 'anon'} · {timeAgo(post.created_at)}
        </span>
        {post.category_tag && <span className="tag">{post.category_tag}</span>}
      </header>
      <Link to={`/thread/${post.id}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>
        <h3 style={{ margin: '4px 0 6px', fontSize: 16 }}>{post.title}</h3>
        {post.body && <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>{post.body}</p>}
      </Link>
      <footer style={{ display: 'flex', gap: 16, marginTop: 12, color: 'var(--text-muted)', fontSize: 13 }}>
        <span>♥ {post.like_count ?? 0}</span>
        <span>💬 {post.comment_count ?? 0}</span>
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
