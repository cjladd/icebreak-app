import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { isLoggedIn, getUser, clearSession } from '../lib/auth.js';

export default function ModeNav() {
  const loggedIn = isLoggedIn();
  const user = getUser();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const initial = (user?.handle?.[0] ?? 'U').toUpperCase();

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>vibe.</Link>

      <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 999, border: '1px solid var(--border)', background: 'var(--bg)' }}>
        <NavLink to="/friendly" style={modeLink}>Friendly</NavLink>
        <NavLink to="/romantic" style={modeLink}>Romantic</NavLink>
        <NavLink to="/party" style={modeLink}>Party</NavLink>
      </div>

      <div style={{ marginLeft: 'auto' }}>
        {loggedIn ? (
          <div style={{ position: 'relative' }} ref={dropRef}>
            <button onClick={() => setDropOpen(o => !o)} style={styles.avatar} aria-label="Profile menu">
              {initial}
            </button>

            {dropOpen && (
              <div style={styles.dropdown}>
                <span style={{ padding: '8px 10px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                  @{user?.handle}
                </span>
                <div style={{ height: 1, background: 'var(--border)', margin: '2px 0' }} />
                <Link to={`/profile/${user?.handle}`} style={styles.dropItem} onClick={() => setDropOpen(false)}>
                  Profile
                </Link>
                <button style={styles.dropItem} onClick={() => { clearSession(); window.location.reload(); }}>
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth" className="btn">Sign in</Link>
        )}
      </div>
    </nav>
  );
}

const modeLink = ({ isActive }) => ({
  padding: '7px 16px',
  borderRadius: 999,
  color: isActive ? 'var(--accent-on)' : 'var(--text-muted)',
  background: isActive ? 'var(--accent)' : 'transparent',
  fontWeight: 600,
  textDecoration: 'none',
  fontSize: 14,
  whiteSpace: 'nowrap',
});

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '10px 24px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-card)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontSize: 22,
    fontWeight: 700,
    fontStyle: 'italic',
    color: 'var(--accent)',
    textDecoration: 'none',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: 'var(--accent)',
    color: 'var(--accent-on)',
    border: 'none',
    fontWeight: 700,
    fontSize: 16,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '6px',
    minWidth: 160,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    zIndex: 200,
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
  // used for both the Profile link and Log out button
  dropItem: {
    padding: '9px 10px',
    borderRadius: 8,
    color: 'var(--text)',
    textDecoration: 'none',
    fontSize: 14,
    display: 'block',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    width: '100%',
  },
};
