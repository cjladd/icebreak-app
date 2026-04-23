# vibe

Social app for conversation questions / icebreakers with three mode themes (Friendly, Romantic, Party). Class project for Web Tech — Spring 2026.

## Team
- **Charles Ladd** — repo + backend (Express + MySQL + auth) + Romantic mode page
- **Erick Sauceda** — design lead, shared components, Profile page *(TBD — leaving space)*
- **Zainab Khoshnaw** — Friendly mode page + Auth pages wire-up
- **Herrick Vasck** — Party mode page + Thread/reply page

## Stack
- **Frontend:** React (Vite) + plain CSS
- **Backend:** Node.js + Express
- **Database:** MySQL
- **Auth:** bcrypt-hashed passwords + JWT

## Unique feature (for rubric)
The 3-mode theme switcher (Friendly / Romantic / Party) satisfies the "Dark Mode / Theme Switcher" unique-feature requirement. No extra scope needed.

## Getting started

```bash
# one-time: install everything
npm run install:all

# dev: run client + server together
npm run dev

# or separately
npm --prefix client run dev     # Vite on http://localhost:5173
npm --prefix server run dev     # Express on http://localhost:3001
```

### MySQL setup
1. Install MySQL locally (or use XAMPP).
2. Create the database and load the schema:
   ```bash
   mysql -u root -p < db/schema.sql
   ```
3. Copy `server/.env.example` to `server/.env` and fill in your credentials.

## Layout
```
vibe/
  client/         React app (Vite)
  server/         Express API
  db/             schema.sql + seed data
  docs/
    api-contract.md       endpoint reference
```

## Workflow
1. Pull, create a branch (`zainab/friendly-page`, `herrick/party-page`, etc.)
2. Work on your assigned page/feature (see Slack for your brief)
3. Open a PR when ready — Charles reviews and merges

Keep PRs scoped to your lane to minimize merge pain. Shared primitives (nav, post card, composer) live in `client/src/components/` — Erick owns those.
