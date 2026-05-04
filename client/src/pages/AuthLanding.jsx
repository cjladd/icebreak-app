import { Link } from 'react-router-dom';

export default function AuthLanding() {
  return (
    <div style={styles.page}>

      {/* Brand */}
      <div style={styles.brand}>vibe.</div>
      <p style={styles.tagline}>meet people. no pressure.</p>

      {/* Mode preview pills */}
      <div style={styles.modePills}>
        <span style={{ ...styles.pill, background: 'rgba(94,234,212,0.12)', color: '#5eead4' }}>Friendly</span>
        <span style={{ ...styles.pill, background: 'rgba(236,72,153,0.12)', color: '#ec4899' }}>Romantic</span>
        <span style={{ ...styles.pill, background: 'rgba(250,204,21,0.12)', color: '#facc15' }}>Party</span>
      </div>

      {/* Main CTA */}
      <div className="card" style={styles.card}>
        <h2 style={styles.cardTitle}>Join the community</h2>
        <p style={styles.cardSub}>
          Build a profile. Post across 3 modes. Connect with people for real.
        </p>
        <Link to="/create-account" className="btn" style={styles.btnPrimary}>
          Create Free Account →
        </Link>
        <Link to="/signin" className="btn btn--ghost" style={styles.btnGhost}>
          Sign In
        </Link>
      </div>

      {/* No account option */}
      <div style={styles.dividerRow}>
        <div style={styles.dividerLine} />
        <span style={styles.dividerText}>or continue without an account</span>
        <div style={styles.dividerLine} />
      </div>

      <div style={styles.anonGrid}>
        <Link to="/friendly" style={styles.anonCard}>
          <strong style={styles.anonLabel}>Browse</strong>
          <p style={styles.anonDesc}>Read posts, explore the feed</p>
        </Link>
        <Link to="/friendly" style={styles.anonCard}>
          <strong style={styles.anonLabel}>Post Anon</strong>
          <p style={styles.anonDesc}>Drop a post without an account</p>
        </Link>
      </div>

    </div>
  );
}

const styles = {
  page: {
    maxWidth: 440,
    margin: '48px auto 80px',
    textAlign: 'center',
    padding: '0 16px',
  },
  brand: {
    fontSize: 52,
    fontWeight: 700,
    fontStyle: 'italic',
    color: 'var(--accent)',
    letterSpacing: '-1px',
    lineHeight: 1,
  },
  tagline: {
    color: 'var(--text-muted)',
    fontSize: 15,
    margin: '8px 0 24px',
  },
  modePills: {
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
  },
  pill: {
    padding: '6px 14px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
  },
  card: {
    textAlign: 'left',
    marginBottom: 20,
  },
  cardTitle: {
    margin: '0 0 6px',
    fontSize: 20,
    fontWeight: 700,
  },
  cardSub: {
    color: 'var(--text-muted)',
    fontSize: 14,
    margin: '0 0 18px',
    lineHeight: 1.5,
  },
  btnPrimary: {
    display: 'block',
    textAlign: 'center',
    marginBottom: 8,
    padding: '12px 16px',
    fontSize: 15,
  },
  btnGhost: {
    display: 'block',
    textAlign: 'center',
    padding: '12px 16px',
    fontSize: 15,
  },
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: 'var(--border)',
  },
  dividerText: {
    color: 'var(--text-muted)',
    fontSize: 12,
    whiteSpace: 'nowrap',
  },
  anonGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  anonCard: {
    display: 'block',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    padding: '16px',
    textDecoration: 'none',
    color: 'var(--text)',
    textAlign: 'left',
  },
  anonIcon: { fontSize: 22, display: 'block', marginBottom: 8 },
  anonLabel: { display: 'block', fontSize: 14, marginBottom: 4 },
  anonDesc: { margin: 0, color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.4 },
};
