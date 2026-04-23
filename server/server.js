import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRouter from './src/routes/auth.js';
import postsRouter from './src/routes/posts.js';
import usersRouter from './src/routes/users.js';
import commentsRouter from './src/routes/comments.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/comments', commentsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`vibe server listening on :${PORT}`);
});
