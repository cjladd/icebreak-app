import { Router } from 'express';
import { pool } from '../db/pool.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

/** GET /api/comments?post_id=123 */
router.get('/', async (req, res, next) => {
  try {
    const postId = req.query.post_id;
    if (!postId) return res.status(400).json({ error: 'post_id required' });
    const [rows] = await pool.execute(
      `SELECT c.*,
              CASE WHEN c.is_anonymous = 1 THEN NULL ELSE u.handle END AS author_handle
       FROM comments c
       LEFT JOIN users u ON u.id = c.user_id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [postId]
    );
    res.json({ comments: rows });
  } catch (e) { next(e); }
});

/** POST /api/comments — anonymous allowed */
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { post_id, body, is_anonymous, parent_comment_id } = req.body ?? {};
    if (!post_id) return res.status(400).json({ error: 'post_id required' });
    if (!body?.trim()) return res.status(400).json({ error: 'body required' });

    const userId = req.user?.id ?? null;
    const anon = is_anonymous || !userId ? 1 : 0;

    const [result] = await pool.execute(
      'INSERT INTO comments (post_id, user_id, body, is_anonymous, parent_comment_id) VALUES (?, ?, ?, ?, ?)',
      [post_id, userId, body.trim(), anon, parent_comment_id ?? null]
    );
    const [[comment]] = await pool.execute(
      `SELECT c.*, CASE WHEN c.is_anonymous = 1 THEN NULL ELSE u.handle END AS author_handle
       FROM comments c LEFT JOIN users u ON u.id = c.user_id
       WHERE c.id = ?`,
      [result.insertId]
    );
    res.status(201).json(comment);
  } catch (e) { next(e); }
});

/** DELETE /api/comments/:id — only the author can delete */
router.delete('/:id', optionalAuth, async (req, res, next) => {
  try {
    const [[comment]] = await pool.execute(
      'SELECT * FROM comments WHERE id = ?',
      [req.params.id]
    );
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    // anonymous comments can't be deleted (no ownership to verify)
    if (comment.is_anonymous || !comment.user_id) {
      return res.status(403).json({ error: 'Cannot delete anonymous comments' });
    }
    if (!req.user || req.user.id !== comment.user_id) {
      return res.status(403).json({ error: 'Not your comment' });
    }

    await pool.execute('DELETE FROM comments WHERE id = ?', [req.params.id]);
    res.json({ deleted: true });
  } catch (e) { next(e); }
});

export default router;
