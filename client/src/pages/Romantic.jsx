import { useEffect, useState } from 'react';
import Composer from '../components/Composer.jsx';
import PostCard from '../components/PostCard.jsx';
import IcebreakerPrompt from '../components/IcebreakerPrompt.jsx';
import { api } from '../lib/api.js';

/**
 * ROMANTIC MODE — owned by Charles.
 *
 * Layout: header → curated icebreaker prompt (centerpiece) → composer → feed.
 * The IcebreakerPrompt brings the original "give you a question to ask" idea
 * back into the UI — it's the project's identity, not just decoration.
 */
export default function Romantic() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('recent'); // 'recent' | 'top' | 'icebreakers'

  // Prefill bridge between IcebreakerPrompt and Composer. The key counter
  // lets repeated clicks on the same prompt still re-fill the title field.
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
    api.get('/posts?mode=romantic')
      .then((data) => setPosts(data.posts ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Mode header — title + tagline + description + decorative chips, with
          the DATING mode tag pinned to the top-right. Mirrors Friendly + Party
          rhythm so the three mode pages feel cohesive. */}
      <header className="card" style={styles.header}>
        <div style={{ flex: 1 }}>
          <h1 style={styles.title}>💘 Romantic Mode</h1>
          <p style={styles.tagline}>Intentions clear. Vibes intact.</p>
          <p style={styles.description}>
            Real questions for honest dating conversations.
          </p>
          <div style={styles.chips}>
            <span className="tag">💞 First Date</span>
            <span className="tag">💌 Long Distance</span>
            <span className="tag">🌹 Hot Take</span>
            <span className="tag">💘 Crush</span>
            <span className="tag">🚩 Red Flags</span>
          </div>
        </div>
        <span className="tag" style={styles.modeTag}>DATING</span>
      </header>

      {/* Centerpiece — curated romantic prompts. "Use this" wires into Composer below. */}
      <IcebreakerPrompt mode="romantic" onUsePrompt={handleUsePrompt} />

      <Composer
        mode="romantic"
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
      {visiblePosts.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}

const styles = {
  header: {
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'space-between',
    // flex-start so the DATING tag stays anchored top-right once the
    // header grows from the description + chips.
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
