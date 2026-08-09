# ENVIRONMENT.md — StudyBuddy AI

**Status:** Updated Day 6 — now deployed to production.

## Active Environment Variables

| Variable | Purpose | Where it's set |
|---|---|---|
| `GEMINI_API_KEY` | Authenticates server-side calls to the Google Gemini API | Local: `.env` file (untracked by Git). **Production: Vercel dashboard → studybuddy-ai project → Settings → Environment Variables (confirmed working Day 6).** |

## Live URLs

| Environment | URL |
|---|---|
| **Production (live app)** | https://studybuddy-ai-sandy.vercel.app |
| Local development | http://localhost:3000 (via `vercel dev`) |

## Tools Installed (Day 1 → Day 6)

| Tool | Purpose | Installed |
|---|---|---|
| Git | Version control | Day 1 |
| VS Code | Code editor | Day 1 (pre-existing) |
| Live Server (VS Code extension) | Local preview for static files only | Day 3 |
| Node.js | Required to run the Vercel CLI | Day 5 (already present) |
| Vercel CLI (`vercel`) | Local dev server + production deployment | Day 5 |
| Vercel account | Hosting provider | Day 5 (via GitHub login) |

## Important Note — Vercel Project Linking (Day 6 Incident)

During Day 5 setup, `vercel dev`'s interactive prompts accidentally linked this project to a **different, pre-existing Vercel project** ("studyflow") instead of creating a new one. This was discovered and fully corrected on Day 6:

1. The correct, dedicated `studybuddy-ai` Vercel project was created.
2. `GEMINI_API_KEY` was set on the correct project.
3. Production deployment was redone on the correct project.
4. The original "studyflow" project's deployment (which had been temporarily overwritten) was rolled back to its own prior working version via Vercel's "Promote to Production" on its last good deployment.

**Lesson for future days:** when running `vercel link` or `vercel dev` for the first time, always double-check the project name shown before confirming — don't assume "Search all projects" will only show projects created for this session.

## Local Setup Instructions (unchanged from Day 5)

1. `.env` in project root contains `GEMINI_API_KEY=your_key_here`.
2. `.gitignore` excludes `.env` from Git — verified via `git status` before every commit.
3. Run `vercel dev` (not Live Server) for local testing — Live Server cannot run the serverless function.

## Security Practices Followed

- `GEMINI_API_KEY` never hardcoded, read only via `process.env.GEMINI_API_KEY`.
- `.env` never committed (verified repeatedly via `git status`).
- Production key set directly in Vercel's dashboard, marked "Sensitive" (masked in the UI).
- Earlier key exposure incident (Day 5) was handled correctly — key rotated immediately, no exposure in committed code or the live app.
