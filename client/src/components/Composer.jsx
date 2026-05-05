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
export default function Composer({ mode, onPosted, prefillTitle = '', prefillKey = 0 }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loggedIn = isLoggedIn();

  // Apply prefill whenever the parent bumps the key. Skip the initial mount
  // (key === 0) so we don't clobber an empty field on first render.
  useEffect(() => {
    if (prefillKey > 0 && prefillTitle) {
      setTitle(prefillTitle);
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
        is_anonymous: isAnon,
      });
      setTitle('');
      setBody('');
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
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
