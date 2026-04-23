import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';

const router = Router();
const SALT_ROUNDS = 10;

function sign(user) {
  return jwt.sign({ id: user.id, handle: user.handle }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function sanitize(user) {
  return { id: user.id, email: user.email, handle: user.handle, display_name: user.display_name, avatar_url: user.avatar_url };
}

router.post('/register', async (req, res, next) => {
  try {
    const { email, handle, password } = req.body ?? {};
    if (!email || !handle || !password) return res.status(400).json({ error: 'email, handle, and password are required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    try {
      const [result] = await pool.execute(
        'INSERT INTO users (email, handle, password_hash) VALUES (?, ?, ?)',
        [email.toLowerCase(), handle.toLowerCase(), password_hash]
      );
      const [[user]] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
      res.status(201).json({ token: sign(user), user: sanitize(user) });
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email or handle already taken' });
      throw e;
    }
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const [[user]] = await pool.execute('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ token: sign(user), user: sanitize(user) });
  } catch (e) { next(e); }
});

export default router;
