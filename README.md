# AI Sprint — Level 1 Basic
### 28-Day AI Skills Challenge App

A self-hostable web app with AI chat coaching for each lesson day.

**Features:**
- 28-day AI skills curriculum with lessons, tasks, and tools
- User accounts (email + password)
- Each user brings their own AI API key (DeepSeek, Mistral, Groq, OpenAI, or any OpenAI-compatible API)
- AI Coach chat on every lesson day — streaming responses, starter questions
- Progress tracking with completion percentage
- Dark mode, mobile responsive
- Dedicated FAQ page with setup guides

---

## Quick Deploy on Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign up for free
2. Click **New Project → Deploy from GitHub repo**
3. Upload or connect this project folder
4. In Railway, go to **Variables** and add:
   ```
   NODE_ENV=production
   SESSION_SECRET=any-random-secret-string-here
   PORT=5000
   ```
5. Railway will auto-build and deploy — you'll get a live URL

**Note:** No API key needed on the server! Each user provides their own key via Settings.

---

## Quick Deploy on Render

1. Go to [render.com](https://render.com) and sign up
2. Click **New → Web Service**
3. Connect your repo or upload files
4. Set **Build Command:** `npm install && npm run build`
5. Set **Start Command:** `node dist/index.cjs`
6. Add environment variables:
   ```
   NODE_ENV=production
   SESSION_SECRET=any-random-secret-string-here
   ```

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Build for production
npm run build

# Start production server
NODE_ENV=production node dist/index.cjs
```

App runs at: http://localhost:5000

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | Set to `production` for hosting |
| `SESSION_SECRET` | Recommended | Secret for session cookies. If not set, uses a default (fine for testing). |
| `PORT` | No | Defaults to 5000 |

---

## How API Keys Work

Each user provides their own AI API key via the in-app Settings page. The server stores keys in the SQLite database and uses them for that user's chat requests. This means:

- **You (the host) pay nothing for AI** — each user funds their own usage
- **Users can choose their provider** — DeepSeek, Mistral, Groq, OpenAI, or custom
- **Users can remove their key anytime** from Settings
- **The FAQ page** explains everything step-by-step

### Recommended Providers for Hong Kong Users
- **DeepSeek** — cheapest, works in HK
- **Mistral** — EU-based, works in HK
- **Groq** — free tier, works in HK

---

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express.js + SQLite (via Drizzle ORM)
- **Auth:** Session-based (express-session)
- **AI:** User-provided API key (any OpenAI-compatible)
- **Progress:** Saved per-user in SQLite database


