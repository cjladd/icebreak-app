import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';

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

/** GET /api/users/:handle — public profile + their posts */
router.get('/:handle', async (req, res, next) => {
  try {
    const [[user]] = await pool.execute(
      'SELECT id, handle, display_name, bio, avatar_url, created_at FROM users WHERE handle = ?',
      [req.params.handle.toLowerCase()]
    );
    if (!user) return res.status(404).json({ error: 'User not found' });

    const [posts] = await pool.execute(
      `SELECT p.*,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count
       FROM posts p
       WHERE p.user_id = ? AND p.is_anonymous = 0
       ORDER BY p.created_at DESC
       LIMIT 50`,
      [user.id]
    );
    res.json({ user, posts });
  } catch (e) { next(e); }
});

export default router;
