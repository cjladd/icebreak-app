-- Optional dev seed data — load AFTER schema.sql.
-- Curated icebreaker-style prompts so the feed reflects the app's purpose
-- (give people questions to ask) rather than generic social posts.
-- Two posts per mode, all anonymous so no user account is required to seed.
USE vibe;

INSERT INTO posts (user_id, mode, title, body, category_tag, is_anonymous) VALUES
  -- FRIENDLY: low-stakes, getting-to-know-you
  (NULL, 'friendly', 'What''s a hobby you''ve picked up in the last year?',
   'Curious what other people are getting into right now. Drop yours below + how you got started.',
   'ICEBREAKER', 1),
  (NULL, 'friendly', 'Coffee, tea, or neither — and why?',
   'I''m a tea person who pretends to like coffee in social settings. What about you?',
   'ICEBREAKER', 1),

  -- ROMANTIC: dating-conversation prompts
  (NULL, 'romantic', 'What''s your love language, and how do you know?',
   'Bonus points if you have a story that made you realize it.',
   'ICEBREAKER', 1),
  (NULL, 'romantic', 'Hot take: dinner dates are overrated for a first meet.',
   'Coffee walk >>> sitting across a table for 2 hours. Change my mind.',
   'HOT TAKE', 1),

  -- PARTY: group-vibes prompts
  (NULL, 'party',    'Wildest spontaneous trip you''ve ever said yes to?',
   'No filter, no judgment. The more chaotic the better.',
   'ICEBREAKER', 1),
  (NULL, 'party',    'Go-to karaoke song, no shame?',
   'Drop yours. I''ll start: Mr. Brightside (yes, I know).',
   'ICEBREAKER', 1);
