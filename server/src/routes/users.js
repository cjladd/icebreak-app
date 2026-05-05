import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

/** GET /api/users/me — current logged-in user */
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const [[user]] = await pool.execute(
      'SELECT id, email, handle, display_name, bio, avatar_url, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (e) { next(e); }
});

/** GET /api/users/:handle — public profile + their posts.
 *  optionalAuth so we can stamp liked_by_me on each post (drives the heart state
 *  for a viewer browsing someone else's profile). */
router.get('/:handle', optionalAuth, async (req, res, next) => {
  try {
    const [[user]] = await pool.execute(
      'SELECT id, handle, display_name, bio, avatar_url, created_at FROM users WHERE handle = ?',
      [req.params.handle.toLowerCase()]
    );
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 0 means "no viewer / never matches" — same pattern as posts.js.
    const viewerId = req.user?.id ?? 0;

    // Returning author_handle keeps PostCard rendering consistent with the rest
    // of the app (otherwise it'd fall back to "anon" for every post on the feed).
    // The WHERE filters out anonymous posts already, so we can safely return
    // the profile owner's handle for every row.
    const [posts] = await pool.execute(
      `SELECT p.*,
              ? AS author_handle,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count,
              EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ?) AS liked_by_me
       FROM posts p
       WHERE p.user_id = ? AND p.is_anonymous = 0
       ORDER BY p.created_at DESC
       LIMIT 50`,
      [user.handle, viewerId, user.id]
    );
    res.json({ user, posts });
  } catch (e) { next(e); }
});

/** PATCH /api/users/me — update bio for the logged-in user */
router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const bio = req.body.bio ?? null;
    await pool.execute(
      'UPDATE users SET bio = ? WHERE id = ?',
      [bio, req.user.id]
    );
    res.json({ bio });
  } catch (e) { next(e); }
});

export default router;
