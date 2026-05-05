import { useEffect, useState } from 'react';
import Composer from '../components/Composer.jsx';
import PostCard from '../components/PostCard.jsx';
import IcebreakerPrompt from '../components/IcebreakerPrompt.jsx';
import { api } from '../lib/api.js';

export default function Friendly() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('recent'); // 'recent' | 'top' | 'icebreakers'

  // Prefill bridge between IcebreakerPrompt and Composer. Bumping the key
  // signals "user picked a new prompt" — Composer copies the title into its
  // input field. The counter (rather than the title alone) lets the same
  // prompt re-fill the box on repeated clicks.
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
    api.get('/posts?mode=friendly')
      .then((data) => setPosts(data.posts ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header — title + tagline + description + decorative chips, with the
          FRIENDS mode tag pinned to the top-right corner (matches Party's overall
          rhythm but keeps Zainab's mode-tag treatment). */}
      <header className="card" style={styles.header}>
        <div style={{ flex: 1 }}>
          <h1 style={styles.title}>👋 Friendly Mode</h1>
          <p style={styles.tagline}>Meet people. No pressure.</p>
          <p style={styles.description}>
            Casual prompts to break the ice and meet new people.
          </p>
          <div style={styles.chips}>
            <span className="tag">👋 New Here</span>
            <span className="tag">🎮 Hobbies</span>
            <span className="tag">📺 Pop Culture</span>
            <span className="tag">☕ Daily Life</span>
            <span className="tag">🎯 Goals</span>
          </div>
        </div>
        <span className="tag" style={styles.modeTag}>FRIENDS</span>
      </header>

      {/* Curated icebreaker prompt — clicking "Use this" prefills the composer below */}
      <IcebreakerPrompt mode="friendly" onUsePrompt={handleUsePrompt} />

      {/* Composer */}
      <Composer
        mode="friendly"
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

      {/* Posts */}
      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading...</p>}
      {!loading && visiblePosts.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>No posts yet — be the first!</p>
      )}
      {visiblePosts.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}

const styles = {
  header: {
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'space-between',
    // flex-start so the corner mode tag stays anchored at the top once the
    // header gets taller from the description + chips.
    alignItems: 'flex-start',
    gap: 12,
  },
  // Bare h1 (no explicit fontSize) so it matches Party's natural browser size.
  title: {
    margin: 0,
    color: 'var(--accent)',
  },
  tagline: {
    margin: '6px 0 10px',
    color: 'var(--text-muted)',
    fontSize: 14,
  },
  description: {
    margin: '0 0 10px',
    color: 'var(--text-muted)',
    fontSize: 13,
  },
  chips: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  modeTag: {
    fontSize: 12,
    padding: '5px 12px',
    letterSpacing: '0.08em',
    flexShrink: 0,
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
