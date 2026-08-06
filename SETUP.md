# SETUP.md — StudyBuddy AI

**Status:** Finalized Day 3

## Prerequisites

| Tool | Required? | Why |
|---|---|---|
| VS Code | Yes | Code editor used throughout the project |
| Git | Yes | Version control, already configured Day 1 |
| GitHub account | Yes | Hosts the repository, already configured Day 1 |
| **Live Server** (VS Code extension) | Yes — installed Day 3 | Local preview with auto-refresh; no build tool exists in this project, so this is the only "dev server" needed |
| Node.js / npm | **Not yet** | Only needed starting Day 5–6 for the Vercel CLI. Not required for today's static HTML/CSS/JS work. |

## One-Time Setup (already completed)

1. GitHub repository `studybuddy-ai` created (Day 1).
2. Repository cloned locally (Day 1).
3. Initial project structure created: `index.html`, `style.css`, `script.js`, `assets/`, `api/` (Day 1).
4. Live Server extension installed in VS Code (Day 3).

## Running the Project Locally

1. Open the `studybuddy-ai` folder in VS Code.
2. Right-click `index.html` in the Explorer panel.
3. Click **Open with Live Server**.
4. A browser tab opens automatically at `http://127.0.0.1:5500/index.html`.
5. Any time you save a file (`Ctrl+S`), the browser auto-refreshes.

## Verifying Everything Works

- Open DevTools (`F12`) → **Console** tab. You should see:
  ```
  StudyBuddy AI — script.js loaded. Ready for Day 4 logic.
  ```
  with no red error messages.
- Resize the browser window (or use DevTools' device toolbar) down to ~375px width and confirm the History panel stacks below the main content instead of sitting beside it.

## No Environment Variables Yet

No `.env` file or secrets are needed until Day 5 (Claude API key). See `ENVIRONMENT.md` for what's coming and why nothing is configured yet.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Blank white page | Confirm the file was actually saved (unsaved-changes dot on the VS Code tab) and Live Server was restarted/refreshed |
| Console shows 404 for style.css or script.js | Check filenames match exactly (case-sensitive) between `index.html`'s `<link>`/`<script>` tags and the actual files |
| Fonts not loading | Confirm you have an internet connection — Google Fonts is loaded from a CDN, not bundled locally |
