import { useEffect, useState } from 'react';
import Composer from '../components/Composer.jsx';
import PostCard from '../components/PostCard.jsx';
import { api } from '../lib/api.js';

export default function Friendly() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('feed'); // 'feed' | 'icebreakers'

  useEffect(() => {
    api.get('/posts?mode=friendly')
      .then((data) => setPosts(data.posts ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <header className="card" style={styles.header}>
        <div>
          <h1 style={styles.title}>Friendly Mode</h1>
          <p style={styles.tagline}>Meet people. No pressure.</p>
        </div>
        <span className="tag" style={styles.modeTag}>FRIENDS</span>
      </header>

      {/* Composer */}
      <Composer mode="friendly" onPosted={(p) => setPosts((xs) => [p, ...xs])} />

      {/* Feed / Icebreakers tab toggle */}
      <div style={styles.tabs}>
        <button
          style={tab === 'feed' ? { ...styles.tab, ...styles.tabActive } : styles.tab}
          onClick={() => setTab('feed')}
        >
          FEED
        </button>
        <button
          style={tab === 'icebreakers' ? { ...styles.tab, ...styles.tabActive } : styles.tab}
          onClick={() => setTab('icebreakers')}
        >
          ICEBREAKERS
        </button>
      </div>

      {/* Posts */}
      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading...</p>}
      {!loading && posts.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>No posts yet — be the first!</p>
      )}
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}

const styles = {
  header: {
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    color: 'var(--accent)',
    fontSize: 26,
    fontWeight: 700,
  },
  tagline: {
    margin: '6px 0 0',
    color: 'var(--text-muted)',
    fontSize: 14,
  },
  modeTag: {
    fontSize: 12,
    padding: '5px 12px',
    letterSpacing: '0.08em',
  },
  tabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    padding: '8px 18px',
    borderRadius: 999,
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontWeight: 600,
    fontSize: 12,
    cursor: 'pointer',
    letterSpacing: '0.06em',
    fontFamily: 'inherit',
  },
  tabActive: {
    background: 'var(--accent)',
    color: 'var(--accent-on)',
    border: '1px solid var(--accent)',
  },
};
