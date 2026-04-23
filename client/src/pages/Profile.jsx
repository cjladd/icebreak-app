import { useParams } from 'react-router-dom';

/**
 * PROFILE PAGE — TBD owner (likely Erick — it's the most design-heavy).
 *
 * Features from mockup:
 *  - Avatar + handle + member badge + Connect/Message buttons
 *  - "Currently:" status line
 *  - About me / Now playing / Interests / Mode activity sidebar
 *  - Post feed filterable by mode + tag
 *
 * Minimum to ship: avatar, handle, and user's posts from GET /api/users/:handle
 */
export default function Profile() {
  const { handle } = useParams();

  return (
    <div>
      <h1>@{handle ?? 'me'}</h1>
      <p style={{ color: 'var(--text-muted)' }}>Profile page — build me out</p>
    </div>
  );
}
