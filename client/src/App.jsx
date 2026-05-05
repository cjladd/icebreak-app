import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ModeNav from './components/ModeNav.jsx';
import Friendly from './pages/Friendly.jsx';
import Romantic from './pages/Romantic.jsx';
import Party from './pages/Party.jsx';
import Profile from './pages/Profile.jsx';
import AuthLanding from './pages/AuthLanding.jsx';
import SignIn from './pages/SignIn.jsx';
import CreateAccount from './pages/CreateAccount.jsx';
import Thread from './pages/Thread.jsx';
import Popular from './pages/Popular.jsx';

const MODE_BY_PATH = {
  '/friendly': 'friendly',
  '/romantic': 'romantic',
  '/party': 'party',
  '/popular': 'friendly',
};

function resolveMode(pathname) {
  if (MODE_BY_PATH[pathname]) return MODE_BY_PATH[pathname];
  if (pathname.startsWith('/profile') || pathname.startsWith('/thread')) return 'neutral';
  return 'neutral';
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    document.body.dataset.mode = resolveMode(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <ModeNav />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/friendly" replace />} />
          <Route path="/friendly" element={<Friendly />} />
          <Route path="/romantic" element={<Romantic />} />
          <Route path="/party" element={<Party />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/profile/:handle?" element={<Profile />} />
          <Route path="/thread/:id" element={<Thread />} />
          <Route path="/auth" element={<AuthLanding />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="*" element={<p style={{ padding: 24 }}>404 — not found</p>} />
        </Routes>
      </main>
    </>
  );
}
