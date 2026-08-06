# ENVIRONMENT.md — StudyBuddy AI

**Status:** Finalized Day 3 · No environment variables are active yet — this documents what exists today and what's coming.

## Current State (Day 3)

No environment variables, secrets, or `.env` files exist yet. The project runs entirely client-side with no server-side code, so there is nothing to configure.

## Tools Installed

| Tool | Purpose | Installed |
|---|---|---|
| Git | Version control | Day 1 |
| VS Code | Code editor | Day 1 (pre-existing) |
| Live Server (VS Code extension) | Local dev preview with auto-refresh | Day 3 |

## Planned — Not Yet Configured

| Variable / Tool | Purpose | When it's added |
|---|---|---|
| `ANTHROPIC_API_KEY` | Authenticates server-side calls to the Claude API | Day 5 |
| `.env` (local) | Holds the API key locally during development, excluded from Git via `.gitignore` | Day 5 |
| Vercel dashboard environment variable | Holds the same API key in production, set via Vercel's project settings, never committed to code | Day 6 |
| Node.js / npm | Needed only to run the Vercel CLI locally for testing the serverless function before deploying | Day 5–6 |
| Vercel CLI | Local testing of `api/summarize.js` before deployment | Day 5–6 |

## Why Nothing Is Configured Yet

The architecture (finalized Day 2) deliberately has zero environment variables until the Claude API integration begins on Day 5. Introducing them earlier would mean holding secrets with nothing yet using them — unnecessary risk for zero benefit. This file will be updated on Day 5 with the actual variable names, where they're set, and how to verify they're working.

## Security Note (for Day 5 onward)

- The API key will **never** be hardcoded in any `.js` file.
- The API key will **never** be committed to Git — `.gitignore` will explicitly exclude `.env` before the key is ever created.
- The API key will only exist in two places: your local `.env` file (untracked by Git) and the Vercel dashboard's environment variable settings (production).
