import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { getUser } from '../lib/auth.js';
import PostCard from '../components/PostCard.jsx';

const AVATAR_PALETTE = [
  { bg: '#6d28d9', fg: '#ede9fe' },
  { bg: '#be185d', fg: '#fce7f3' },
  { bg: '#15803d', fg: '#dcfce7' },
  { bg: '#b45309', fg: '#fef3c7' },
  { bg: '#0e7490', fg: '#cffafe' },
  { bg: '#7c3aed', fg: '#f5f3ff' },
  { bg: '#dc2626', fg: '#fee2e2' },
  { bg: '#1d4ed8', fg: '#dbeafe' },
];

function avatarColor(handle) {
  let h = 0;
  for (let i = 0; i < handle.length; i++) h = handle.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}

export default function Profile() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingBio, setEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState('');
  const [bioSaving, setBioSaving] = useState(false);

  useEffect(() => {
    if (!handle) {
      const me = getUser();
      if (me?.handle) navigate(`/profile/${me.handle}`, { replace: true });
      else navigate('/auth', { replace: true });
      return;
    }

    setLoading(true);
    setError(null);

    api.get(`/users/${handle}`)
      .then(({ user, posts }) => {
        setProfile(user);
        setPosts(posts);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [handle, navigate]);

  const isOwner = getUser()?.handle === handle;

  function startEditBio() {
    setBioValue(profile.bio ?? '');
    setEditingBio(true);
  }

  async function saveBio() {
    setBioSaving(true);
    try {
      const { bio } = await api.patch('/users/me', { bio: bioValue.trim() || null });
      setProfile(p => ({ ...p, bio }));
      setEditingBio(false);
    } finally {
      setBioSaving(false);
    }
  }

  if (loading) return <p style={s.muted}>Loading...</p>;

  if (error) return (
    <div className="card" style={{ padding: 24, textAlign: 'center' }}>
      <p style={s.muted}>@{handle} not found.</p>
    </div>
  );

  if (!profile) return null;

  const initial = (profile.display_name ?? profile.handle)[0].toUpperCase();
  const color = avatarColor(profile.handle);

  return (
    <div>
      <div className="card" style={s.header}>
        <div style={{ ...s.avatar, background: color.bg, color: color.fg }}>
          {initial}
        </div>

        <div style={s.info}>
          <div style={s.nameRow}>
            <span style={s.displayName}>{profile.display_name ?? profile.handle}</span>
            <span className="tag">MEMBER</span>
          </div>
          <div style={s.handle}>@{profile.handle}</div>
          {editingBio ? (
            <div style={{ marginTop: 8 }}>
              <textarea
                value={bioValue}
                onChange={e => setBioValue(e.target.value)}
                rows={3}
                maxLength={300}
                placeholder="Write a short bio..."
                style={s.bioInput}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <button className="btn" onClick={saveBio} disabled={bioSaving} style={{ fontSize: 12, padding: '5px 14px' }}>
                  {bioSaving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditingBio(false)} style={s.cancelBtn}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {profile.bio
                ? <p style={s.bio}>{profile.bio}</p>
                : isOwner && <p style={{ ...s.bio, fontStyle: 'italic' }}>No bio yet.</p>
              }
              {isOwner && !editingBio && (
                <button onClick={startEditBio} style={s.editBioBtn}>
                  {profile.bio ? 'Edit bio' : '+ Add bio'}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div style={s.feedHeader}>
        <span style={s.feedLabel}>POSTS</span>
        <span style={s.feedCount}>{posts.length}</span>
      </div>

      {posts.length === 0
        ? <p style={s.muted}>No posts yet.</p>
        : posts.map(post => <PostCard key={post.id} post={post} />)
      }
    </div>
  );
}

const s = {
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 20,
    marginBottom: 28,
    padding: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 14,
    fontWeight: 700,
    fontSize: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    letterSpacing: '-0.02em',
  },
  info: { flex: 1, minWidth: 0 },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  displayName: { fontSize: 22, fontWeight: 700, color: 'var(--text)' },
  handle: { color: 'var(--text-muted)', fontSize: 14, marginBottom: 8 },
  bio: { margin: 0, color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.5 },
  feedHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '1px solid var(--border)',
  },
  feedLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--accent)',
  },
  feedCount: { color: 'var(--text-muted)', fontSize: 13 },
  muted: { color: 'var(--text-muted)', fontSize: 14, padding: '8px 0' },
  bioInput: {
    display: 'block',
    width: '100%',
    background: 'var(--bg)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '8px 10px',
    fontFamily: 'inherit',
    fontSize: 14,
    resize: 'vertical',
    boxSizing: 'border-box',
    outline: 'none',
  },
  editBioBtn: {
    marginTop: 6,
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 999,
    color: 'var(--text-muted)',
    fontSize: 12,
    padding: '4px 12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 600,
    letterSpacing: '0.04em',
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 999,
    color: 'var(--text-muted)',
    fontSize: 12,
    padding: '5px 14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};
