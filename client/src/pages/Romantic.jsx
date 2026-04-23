import { useEffect, useState } from 'react';
import Composer from '../components/Composer.jsx';
import PostCard from '../components/PostCard.jsx';
import { api } from '../lib/api.js';

/**
 * ROMANTIC MODE — owned by Charles.
 *
 * Full creative liberty within the pink theme tokens (--accent: #ec4899).
 * Match Erick's mockup or riff off it.
 *
 * Minimum to ship:
 *  - Mode header with tagline ("Intentions clear. Vibes intact." or your own)
 *  - Feed from GET /api/posts?mode=romantic
 *  - Composer to POST
 *
 * Stretch: Feed / Icebreakers tab toggle.
 */
export default function Romantic() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts?mode=romantic')
      .then((data) => setPosts(data.posts ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <header className="card" style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, color: 'var(--accent)' }}>💘 Romantic Mode</h1>
        <p style={{ margin: '6px 0 0', color: 'var(--text-muted)' }}>
          Intentions clear. Vibes intact.
        </p>
      </header>

      <Composer mode="romantic" onPosted={(p) => setPosts((xs) => [p, ...xs])} />

      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading...</p>}
      {!loading && posts.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>No posts yet — be the first!</p>
      )}
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}
