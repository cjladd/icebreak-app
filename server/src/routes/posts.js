import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();
const MODES = new Set(['friendly', 'romantic', 'party']);

/** GET /api/posts?mode=friendly&sort=new|popular */
router.get('/', async (req, res, next) => {
  try {
    const mode = req.query.mode;
    const sort = req.query.sort === 'popular' ? 'popular' : 'new';
    const params = [];
    let where = '';
    if (mode && MODES.has(mode)) { where = 'WHERE p.mode = ?'; params.push(mode); }

    const orderBy = sort === 'popular' ? 'like_count DESC, p.created_at DESC' : 'p.created_at DESC';

    const [rows] = await pool.execute(
      `SELECT p.*,
              CASE WHEN p.is_anonymous = 1 THEN NULL ELSE u.handle END AS author_handle,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count
       FROM posts p
       LEFT JOIN users u ON u.id = p.user_id
       ${where}
       ORDER BY ${orderBy}
       LIMIT 50`,
      params
    );
    res.json({ posts: rows });
  } catch (e) { next(e); }
});

/** GET /api/posts/:id */
router.get('/:id', async (req, res, next) => {
  try {
    const [[post]] = await pool.execute(
      `SELECT p.*,
              CASE WHEN p.is_anonymous = 1 THEN NULL ELSE u.handle END AS author_handle,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count
       FROM posts p
       LEFT JOIN users u ON u.id = p.user_id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (e) { next(e); }
});

/** POST /api/posts  — anonymous allowed */
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { mode, title, body, category_tag, is_anonymous } = req.body ?? {};
    if (!mode || !MODES.has(mode)) return res.status(400).json({ error: 'mode must be friendly, romantic, or party' });
    if (!title?.trim()) return res.status(400).json({ error: 'title is required' });

    const userId = req.user?.id ?? null;
    const anon = is_anonymous || !userId ? 1 : 0;

    const [result] = await pool.execute(
      'INSERT INTO posts (user_id, mode, title, body, category_tag, is_anonymous) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, mode, title.trim(), body ?? null, category_tag ?? null, anon]
    );
    const [[post]] = await pool.execute('SELECT * FROM posts WHERE id = ?', [result.insertId]);
    res.status(201).json({ ...post, like_count: 0, comment_count: 0 });
  } catch (e) { next(e); }
});

/** POST /api/posts/:id/like — toggle like (requires auth) */
router.post('/:id/like', requireAuth, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const [existing] = await pool.execute(
      'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, req.user.id]
    );
    if (existing.length) {
      await pool.execute('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [postId, req.user.id]);
      res.json({ liked: false });
    } else {
      await pool.execute('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [postId, req.user.id]);
      res.json({ liked: true });
    }
  } catch (e) { next(e); }
});

export default router;
