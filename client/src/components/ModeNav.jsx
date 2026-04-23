import { NavLink, Link } from 'react-router-dom';
import { isLoggedIn, getUser, clearSession } from '../lib/auth.js';

/**
 * Placeholder nav — Erick owns the polished version (mode toggle pill, profile dropdown).
 * This gets the routing working so everyone can develop in parallel.
 */
export default function ModeNav() {
  const loggedIn = isLoggedIn();
  const user = getUser();

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>vibe.</Link>

      <div style={styles.modes}>
        <NavLink to="/friendly" style={modeLinkStyle}>Friendly</NavLink>
        <NavLink to="/romantic" style={modeLinkStyle}>Romantic</NavLink>
        <NavLink to="/party" style={modeLinkStyle}>Party</NavLink>
      </div>

      <div style={styles.auth}>
        {loggedIn ? (
          <>
            <Link to={`/profile/${user?.handle ?? ''}`} style={styles.authLink}>
              @{user?.handle ?? 'me'}
            </Link>
            <button className="btn btn--ghost" onClick={() => { clearSession(); window.location.reload(); }}>
              Log out
            </button>
          </>
        ) : (
          <Link to="/auth" className="btn">Sign in</Link>
        )}
      </div>
    </nav>
  );
}

const modeLinkStyle = ({ isActive }) => ({
  padding: '6px 14px',
  borderRadius: 999,
  color: isActive ? 'var(--accent-on)' : 'var(--text-muted)',
  background: isActive ? 'var(--accent)' : 'transparent',
  fontWeight: 600,
  textDecoration: 'none'
});

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '12px 24px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-card)'
  },
  brand: { fontSize: 22, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' },
  modes: { display: 'flex', gap: 4, marginLeft: 16 },
  auth: { marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' },
  authLink: { color: 'var(--text)', fontSize: 14 }
};
