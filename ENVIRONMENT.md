# ENVIRONMENT.md — StudyBuddy AI

**Status:** Updated Day 5 — environment variables are now active.

## Active Environment Variables

| Variable | Purpose | Where it's set |
|---|---|---|
| `GEMINI_API_KEY` | Authenticates server-side calls to the Google Gemini API | Local: `.env` file (untracked by Git). Production: Vercel dashboard (to be set Day 6). |

## Tools Installed (Day 1 → Day 5)

| Tool | Purpose | Installed |
|---|---|---|
| Git | Version control | Day 1 |
| VS Code | Code editor | Day 1 (pre-existing) |
| Live Server (VS Code extension) | Local preview for static files (HTML/CSS only — cannot run serverless functions) | Day 3 |
| Node.js | Required to run the Vercel CLI | Day 5 (already present, v24.18.0) |
| Vercel CLI (`vercel`) | Runs the serverless function locally via `vercel dev`, and will deploy to production on Day 6 | Day 5 |

## Local Setup Instructions

1. Create a free Google account if you don't have one.
2. Go to `aistudio.google.com` → **Get API key** → **Create API key** → copy it.
3. In the project root, create a file named `.env` (already done) with:
   ```
   GEMINI_API_KEY=your_actual_key_here
   ```
4. Confirm `.gitignore` contains `.env` (already done) so the key is never committed.
5. Run `vercel dev` (not Live Server) to test locally — this is the only way to run `api/summarize.js`, since it needs a server, not just static file serving.

## Why Gemini Instead of Claude

Documented in full in `ARCHITECTURE.md` — short version: Gemini's free tier has no credit card requirement and no expiration date, while Anthropic's free trial credit requires phone verification, may require a card, and expires. For a zero-budget student capstone, this was the safer choice. This was a deliberate Day 5 architecture decision, approved before implementation began.

## Security Practices Followed

- `GEMINI_API_KEY` is never hardcoded in any `.js` file — read only via `process.env.GEMINI_API_KEY`.
- `.env` is excluded from Git via `.gitignore`, verified via `git status` before the first commit containing it.
- **Incident note:** during setup, an API key was briefly shown in a screenshot shared during development. It was immediately rotated (old key deleted, new key generated) before any code was written using it — no exposure occurred in committed code or the live app.
- Production deployment (Day 6) will set `GEMINI_API_KEY` directly in Vercel's dashboard environment variables — never in code.

## Local Dev Server Note

`vercel dev` requires logging into a free Vercel account (via GitHub, in this project's case) the first time it runs. This is the same account used for Day 6's deployment — no separate signup needed later.
