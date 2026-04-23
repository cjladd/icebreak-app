import { useParams } from 'react-router-dom';

/**
 * THREAD / POST DETAIL page — owned by Herrick.
 *
 * From mockup: full post, reactions row (emoji counts), side stats panel
 * (views, replies, shares, reactions), replies list with Top/New/Anon tabs,
 * reply composer.
 *
 * Minimum to ship:
 *  - GET /api/posts/:id — render post
 *  - GET /api/posts/:id/comments — render replies
 *  - POST /api/posts/:id/comments — add a reply (supports anonymous)
 */
export default function Thread() {
  const { id } = useParams();

  return (
    <div>
      <h1>Thread #{id}</h1>
      <p style={{ color: 'var(--text-muted)' }}>Build me out</p>
    </div>
  );
}
