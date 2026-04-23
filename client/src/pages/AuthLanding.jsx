import { Link } from 'react-router-dom';

/**
 * AUTH LANDING — "Join the community" page from Erick's mockup.
 * Owned by Zainab (pairs with SignIn + CreateAccount).
 */
export default function AuthLanding() {
  return (
    <div style={{ maxWidth: 480, margin: '40px auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: 48, margin: 0, color: 'var(--accent)' }}>vibe</h1>
      <p style={{ color: 'var(--text-muted)' }}>meet people. no pressure.</p>

      <div className="card" style={{ marginTop: 24, textAlign: 'left' }}>
        <h2 style={{ marginTop: 0 }}>Join the community</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Build a profile. Get matched. Connect across 3 modes.
        </p>
        <Link to="/create-account" className="btn" style={{ display: 'block', textAlign: 'center', marginTop: 12 }}>
          Create Free Account →
        </Link>
        <Link to="/signin" className="btn btn--ghost" style={{ display: 'block', textAlign: 'center', marginTop: 8 }}>
          Already have an account? Sign In
        </Link>
      </div>

      <div style={{ marginTop: 16, color: 'var(--text-muted)', fontSize: 13 }}>
        — no account needed —
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
        <Link to="/friendly" className="card" style={{ color: 'var(--text)' }}>
          <strong>Browse</strong>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '4px 0 0' }}>
            Read posts, explore the feed.
          </p>
        </Link>
        <Link to="/friendly" className="card" style={{ color: 'var(--text)' }}>
          <strong>Post Anon</strong>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '4px 0 0' }}>
            Drop a post without an account.
          </p>
        </Link>
      </div>
    </div>
  );
}
