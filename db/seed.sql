-- Optional dev seed data — load AFTER schema.sql.
-- Creates a couple of anonymous posts per mode so the UI has something to render.
USE vibe;

INSERT INTO posts (user_id, mode, title, body, category_tag, is_anonymous) VALUES
  (NULL, 'friendly', 'Anyone down to hit a local art market this weekend?', 'Looking for people who appreciate thrifting + good coffee. No weirdos.', 'IRL HANGOUT', 1),
  (NULL, 'friendly', 'Finished rewatching Neon Genesis. Send help.', 'Or just talk to me about it. Either one.', 'POP CULTURE', 1),
  (NULL, 'romantic', 'Hot take: dinner dates are overrated for a first meet.', 'Coffee walk >>> sitting across a table for 2 hours. Change my mind.', 'HOT TAKE', 1),
  (NULL, 'romantic', 'What''s a ''small'' thing that actually matters a lot to you?', 'Mine: how someone treats service workers. You can''t hide that.', 'ICEBREAKER', 1),
  (NULL, 'party',    'Rooftop bar crawl — looking for 4 more', 'Starting at The Twelve Thirty. DM if you''re actually down, no flakers.', 'IRL EVENT', 1),
  (NULL, 'party',    'Anyone doing Bonnaroo this year?', 'Solo ticket, want to link with a group. Low-maintenance, high-energy.', 'FESTIVAL', 1);
