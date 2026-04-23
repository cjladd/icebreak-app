import { useState } from 'react';
import { api } from '../lib/api.js';
import { isLoggedIn } from '../lib/auth.js';

/**
 * Placeholder post composer. Category autofills from `mode` prop (the page you're on),
 * but the user can override. Erick will polish the final overlay/modal version.
 */
export default function Composer({ mode, onPosted }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [postAs, setPostAs] = useState(isLoggedIn() ? 'account' : 'anon');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
        is_anonymous: postAs === 'anon'
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
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
      />
      <textarea
        placeholder="Details (optional)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        style={{ ...inputStyle, resize: 'vertical' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          <input
            type="checkbox"
            checked={postAs === 'anon'}
            onChange={(e) => setPostAs(e.target.checked ? 'anon' : 'account')}
            style={{ marginRight: 6 }}
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
  fontFamily: 'inherit'
};
