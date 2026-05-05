import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard.jsx';
import { api } from '../lib/api.js';

/**
 * POPULAR / TRENDING — owned by Herrick
 */
export default function Popular() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts?sort=popular')
      .then((data) => setPosts(data.posts ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <header className="card" style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, color: 'var(--accent)' }}>🔥 Popular</h1>
        <p style={{ margin: '6px 0 0', color: 'var(--text-muted)' }}>
          Trending posts across all modes
        </p>
      </header>

      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading...</p>}

      {!loading && posts.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>
          Nothing trending yet — check back soon!
        </p>
      )}

      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}
