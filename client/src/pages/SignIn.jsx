import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { setSession } from '../lib/auth.js';

export default function SignIn() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { token, user } = await api.post('/auth/login', { email, password });
      setSession(token, user);
      nav('/friendly');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h1 style={{ textAlign: 'center', color: 'var(--accent)' }}>vibe.</h1>
      <form className="card" onSubmit={submit}>
        <h2 style={{ marginTop: 0 }}>Sign in</h2>
        <label style={labelStyle}>EMAIL</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <label style={labelStyle}>PASSWORD</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        {error && <p style={{ color: '#f87171', fontSize: 13 }}>{error}</p>}
        <button type="submit" className="btn" style={{ width: '100%', marginTop: 8 }} disabled={busy}>
          {busy ? '...' : 'Sign In →'}
        </button>
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13 }}>
          <Link to="/create-account">Create an account</Link> · <Link to="/friendly">Continue without account</Link>
        </p>
      </form>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.1em', marginTop: 12 };
const inputStyle = {
  display: 'block', width: '100%', background: 'var(--bg)', color: 'var(--text)',
  border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', marginTop: 4,
  fontFamily: 'inherit'
};
