import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { setSession } from '../lib/auth.js';

export default function CreateAccount() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setBusy(true);
    try {
      const { token, user } = await api.post('/auth/register', { email, handle, password });
      setSession(token, user);
      nav('/friendly');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.page}>
      <Link to="/auth" style={styles.brand}>vibe.</Link>
      <p style={styles.brandSub}>create your account</p>

      <form className="card" onSubmit={submit} style={styles.form}>
        <h2 style={styles.formTitle}>Get started</h2>

        <label style={styles.label}>EMAIL</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>HANDLE</label>
        <div style={styles.handleWrap}>
          <span style={styles.handleAt}>@</span>
          <input
            type="text"
            required
            placeholder="yourhandle"
            value={handle}
            onChange={(e) => setHandle(e.target.value.replace(/^@/, '').replace(/\s/g, ''))}
            style={{ ...styles.input, paddingLeft: 28 }}
          />
        </div>

        <label style={styles.label}>PASSWORD</label>
        <input
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Min 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          type="submit"
          className="btn"
          style={styles.submitBtn}
          disabled={busy}
        >
          {busy ? 'Creating account...' : 'Create Account →'}
        </button>

        <div style={styles.divider} />

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/signin" style={styles.link}>Sign in</Link>
        </p>
        <p style={styles.footer}>
          <Link to="/friendly" style={styles.mutedLink}>Continue without account</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 420,
    margin: '48px auto 80px',
    padding: '0 16px',
    textAlign: 'center',
  },
  brand: {
    fontSize: 40,
    fontWeight: 700,
    fontStyle: 'italic',
    color: 'var(--accent)',
    letterSpacing: '-1px',
    display: 'block',
    textDecoration: 'none',
    lineHeight: 1,
  },
  brandSub: {
    color: 'var(--text-muted)',
    fontSize: 14,
    margin: '6px 0 24px',
  },
  form: { textAlign: 'left' },
  formTitle: { margin: '0 0 18px', fontSize: 20, fontWeight: 700 },
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    display: 'block',
    width: '100%',
    background: 'var(--bg)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '11px 14px',
    fontFamily: 'inherit',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  handleWrap: {
    position: 'relative',
  },
  handleAt: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    fontSize: 14,
    pointerEvents: 'none',
  },
  error: {
    color: '#f87171',
    fontSize: 13,
    margin: '10px 0 0',
    padding: '8px 12px',
    background: 'rgba(248,113,113,0.08)',
    borderRadius: 8,
  },
  submitBtn: {
    display: 'block',
    width: '100%',
    marginTop: 20,
    padding: '13px',
    fontSize: 15,
  },
  divider: {
    height: 1,
    background: 'var(--border)',
    margin: '18px 0',
  },
  footer: {
    margin: '0 0 6px',
    fontSize: 13,
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
  link: { color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 },
  mutedLink: { color: 'var(--text-muted)', textDecoration: 'none' },
};
