import { useEffect, useState } from 'react';
import Composer from '../components/Composer.jsx';
import PostCard from '../components/PostCard.jsx';
import IcebreakerPrompt from '../components/IcebreakerPrompt.jsx';
import { api } from '../lib/api.js';

/**
 * PARTY MODE — owned by Herrick.
 */
export default function Party() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('recent'); // 'recent' | 'top' | 'icebreakers'

  // Prefill bridge — IcebreakerPrompt's "Use this" button drops the question
  // into Composer's title field via this key counter.
  const [prefillTitle, setPrefillTitle] = useState('');
  const [prefillKey, setPrefillKey] = useState(0);

  function handleUsePrompt(prompt) {
    setPrefillTitle(prompt);
    setPrefillKey(k => k + 1);
  }

  const visiblePosts = tab === 'icebreakers'
    ? posts.filter(p => p.category_tag === 'ICEBREAKER')
    : tab === 'top'
    ? [...posts].sort((a, b) => (b.like_count ?? 0) - (a.like_count ?? 0))
    : posts; // 'recent' — already date-sorted from server

  useEffect(() => {
    api.get('/posts?mode=party')
      .then((data) => setPosts(data.posts ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <header className="card" style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, color: 'var(--accent)' }}>⚡ Party Mode</h1>

        <p style={{ margin: '6px 0 10px', color: 'var(--text-muted)' }}>
          Find your crew. Make a memory.
        </p>
        
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
          Trending IRL plans, group vibes, and spontaneous ideas.
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="tag">🎉 Night Out</span>
          <span className="tag">🍻 Drinks</span>
          <span className="tag">🎶 Music</span>
          <span className="tag">🚗 Road Trip</span>
          <span className="tag">🕺 Group Plans</span>
        </div>
      </header>

      {/* Curated party prompt — clicking "Use this" prefills the composer below */}
      <IcebreakerPrompt mode="party" onUsePrompt={handleUsePrompt} />

      <Composer
        mode="party"
        onPosted={(p) => setPosts((xs) => [p, ...xs])}
        prefillTitle={prefillTitle}
        prefillKey={prefillKey}
      />

      {/* Sort / filter tabs */}
      <div style={styles.tabs}>
        <button
          style={tab === 'recent' ? { ...styles.tab, ...styles.tabActive } : styles.tab}
          onClick={() => setTab('recent')}
        >
          RECENT
        </button>
        <button
          style={tab === 'top' ? { ...styles.tab, ...styles.tabActive } : styles.tab}
          onClick={() => setTab('top')}
        >
          TOP
        </button>
        <button
          style={tab === 'icebreakers' ? { ...styles.tab, ...styles.tabActive } : styles.tab}
          onClick={() => setTab('icebreakers')}
        >
          ICEBREAKERS
        </button>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading...</p>}

      {!loading && visiblePosts.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>No posts yet — be the first!</p>
      )}

      {visiblePosts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}

const styles = {
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
