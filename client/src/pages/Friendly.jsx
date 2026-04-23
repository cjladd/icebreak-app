import { useEffect, useState } from 'react';
import Composer from '../components/Composer.jsx';
import PostCard from '../components/PostCard.jsx';
import { api } from '../lib/api.js';

/**
 * FRIENDLY MODE — owned by Zainab.
 *
 * Full creative liberty on visual design within the teal theme tokens
 * (--accent: #5eead4). Feel free to override layout, add an illustrated header,
 * custom tabs, whatever. Use <PostCard> and <Composer> but you can
 * style wrappers around them.
 *
 * Minimum to ship:
 *  - Distinct mode header with tagline ("Meet people. No pressure." or your own)
 *  - Feed fetching from GET /api/posts?mode=friendly
 *  - Composer to POST a new friendly-mode post
 *
 * Stretch: Feed / Icebreakers tab toggle, category chips for filtering.
 */
export default function Friendly() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts?mode=friendly')
      .then((data) => setPosts(data.posts ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <header className="card" style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, color: 'var(--accent)' }}>👋 Friendly Mode</h1>
        <p style={{ margin: '6px 0 0', color: 'var(--text-muted)' }}>
          Meet people. No pressure.
        </p>
      </header>

      <Composer mode="friendly" onPosted={(p) => setPosts((xs) => [p, ...xs])} />

      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading...</p>}
      {!loading && posts.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>No posts yet — be the first!</p>
      )}
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}
