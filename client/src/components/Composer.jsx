import { useState } from 'react';
import { api } from '../lib/api.js';
import { isLoggedIn, getUser } from '../lib/auth.js';

export default function Composer({ mode, onPosted }) {
  const [title, setTitle] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const user = getUser();
  const loggedIn = isLoggedIn();
  const initial = isAnon ? '?' : (user?.handle?.[0] ?? '?').toUpperCase();

  async function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const post = await api.post('/posts', {
        mode,
        title: title.trim(),
        is_anonymous: isAnon,
      });
      setTitle('');
      onPosted?.(post);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card" onSubmit={submit} style={styles.form}>
      <div style={styles.row}>
        <div style={{ ...styles.avatar, opacity: isAnon ? 0.45 : 1 }}>
          {initial}
        </div>

        <input
          type="text"
          placeholder={`Post something in ${mode} mode...`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        {loggedIn && (
          <button
            type="button"
            onClick={() => setIsAnon((a) => !a)}
            style={styles.anonBtn}
            title={isAnon ? 'Posting anonymously — click to use your handle' : 'Post as yourself — click to go anonymous'}
          >
            {isAnon ? 'anon' : 'you'}
          </button>
        )}

        <button
          type="submit"
          className="btn"
          disabled={submitting || !title.trim()}
          style={styles.postBtn}
        >
          {submitting ? '...' : 'Post'}
        </button>
      </div>

      {error && (
        <p style={{ color: '#f87171', fontSize: 13, margin: '8px 0 0' }}>{error}</p>
      )}
    </form>
  );
}

const styles = {
  form: { marginBottom: 16 },
  row: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'var(--accent)',
    color: 'var(--accent-on)',
    fontWeight: 700,
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'opacity 200ms',
  },
  input: {
    flex: 1,
    background: 'var(--bg)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: 999,
    padding: '10px 16px',
    fontFamily: 'inherit',
    fontSize: 14,
    outline: 'none',
  },
  anonBtn: {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    cursor: 'pointer',
    flexShrink: 0,
  },
  postBtn: {
    flexShrink: 0,
    borderRadius: 10,
    padding: '10px 18px',
  },
};
