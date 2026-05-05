import { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { isLoggedIn } from '../lib/auth.js';

/**
 * Prefill behavior: pages can pass `prefillTitle` along with a `prefillKey`
 * counter (the parent increments it each time the user fires a prefill action,
 * e.g. clicking "Use this prompt" on IcebreakerPrompt). When the key changes
 * we copy `prefillTitle` into the title field. We watch the counter rather
 * than the value itself so re-clicking the same prompt still works even if
 * the user had already typed over it.
 */

const MODE_TAGS = {
  friendly: [
    { label: '🧊 Icebreaker', value: 'ICEBREAKER' },
    { label: '👋 New Here', value: 'NEW HERE' },
    { label: '🎮 Hobbies', value: 'HOBBIES' },
    { label: '📺 Pop Culture', value: 'POP CULTURE' },
    { label: '☕ Daily Life', value: 'DAILY LIFE' },
    { label: '🎯 Goals', value: 'GOALS' },
  ],
  romantic: [
    { label: '🧊 Icebreaker', value: 'ICEBREAKER' },
    { label: '💞 First Date', value: 'FIRST DATE' },
    { label: '💌 Long Distance', value: 'LONG DISTANCE' },
    { label: '🌹 Hot Take', value: 'HOT TAKE' },
    { label: '💘 Crush', value: 'CRUSH' },
    { label: '🚩 Red Flags', value: 'RED FLAGS' },
  ],
  party: [
    { label: '🧊 Icebreaker', value: 'ICEBREAKER' },
    { label: '🎉 Night Out', value: 'NIGHT OUT' },
    { label: '🍻 Drinks', value: 'DRINKS' },
    { label: '🎶 Music', value: 'MUSIC' },
    { label: '🚗 Road Trip', value: 'ROAD TRIP' },
    { label: '🕺 Group Plans', value: 'GROUP PLANS' },
  ],
};

export default function Composer({ mode, onPosted, prefillTitle = '', prefillKey = 0 }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const [tag, setTag] = useState(null); // null | 'ICEBREAKER' | 'HOT TAKE'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loggedIn = isLoggedIn();

  // Apply prefill whenever the parent bumps the key. Skip the initial mount
  // (key === 0) so we don't clobber an empty field on first render.
  useEffect(() => {
    if (prefillKey > 0 && prefillTitle) {
      setTitle(prefillTitle);
      setTag('ICEBREAKER');
    }
  }, [prefillKey, prefillTitle]);

  async function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const post = await api.post('/posts', {
        mode,
        title: title.trim(),
        body: body.trim() || null,
        category_tag: tag,
        is_anonymous: isAnon,
      });
      setTitle('');
      setBody('');
      setTag(null);
      onPosted?.(post);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card" onSubmit={submit} style={{ marginBottom: 16 }}>
      <input
        type="text"
        placeholder={`Post something in ${mode} mode...`}
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={inputStyle}
      />
      <textarea
        placeholder="Details (optional)"
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={2}
        style={{ ...inputStyle, resize: 'vertical' }}
      />

      {/* Tag chips — click to select, click again to deselect */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {(MODE_TAGS[mode] ?? []).map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTag(tag === value ? null : value)}
            style={tag === value ? { ...chipStyle, ...chipActiveStyle } : chipStyle}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isAnon}
            onChange={e => setIsAnon(e.target.checked)}
          />
          Post anonymously
        </label>
        <button type="submit" className="btn" disabled={submitting || !title.trim()}>
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </div>
      {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{error}</p>}
    </form>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  background: 'var(--bg)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '10px 12px',
  marginBottom: 8,
  fontFamily: 'inherit',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

const chipStyle = {
  padding: '4px 10px',
  borderRadius: 999,
  border: '1px solid var(--border)',
  background: 'transparent',
  color: 'var(--text-muted)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.06em',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const chipActiveStyle = {
  background: 'var(--accent)',
  color: 'var(--accent-on)',
  border: '1px solid var(--accent)',
};
