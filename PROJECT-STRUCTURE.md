# PROJECT-STRUCTURE.md — StudyBuddy AI

**Status:** Finalized Day 2

## Folder Structure

```
studybuddy-ai/
├── index.html              # Single-page app shell (all UI states live here)
├── style.css                # All styling: layout, palette, responsive rules, animations
├── script.js                # All client-side logic: DOM, API calls, localStorage, quiz logic
├── api/
│   └── summarize.js         # Vercel serverless function — the only server-side code (Day 5)
├── assets/
│   └── favicon.ico          # Added Day 9 (production polish)
├── .gitignore                # Excludes .env / API keys from version control (Day 5)
├── README.md                 # Project description + live demo link (Day 9)
├── TESTING.md                 # Manual test checklist and results (Day 8)
└── PROJECT-LOG.md             # Running daily log (created today, Day 2)
```

## Responsibility of Each Piece

| Path | Responsibility |
|---|---|
| `index.html` | The entire UI markup — input area, results area, history panel. No templating, no build step. |
| `style.css` | All visual design: CSS custom properties for the color palette, responsive layout, animations, empty/loading states. |
| `script.js` | All interactivity: DOM selection, event listeners, the `fetch('/api/summarize')` call, render functions, `localStorage` read/write, quiz logic. |
| `api/summarize.js` | The only code that ever touches the Claude API key. Validates input, builds the prompt, calls Claude, returns clean JSON or a structured error. |
| `assets/` | Static files — currently just the favicon. No image-heavy UI in this project, so this folder stays minimal by design. |
| `.gitignore` | Prevents `.env` or any file containing the API key from ever being committed. |
| `README.md` | What a visitor to the GitHub repo sees first — project description, features, live link. |
| `TESTING.md` | Written manual QA checklist from Day 8, kept as documentation of what was tested. |
| `PROJECT-LOG.md` | Daily log of what was built, decided, and changed — useful both for you and for continuity if a new AI conversation picks up mid-project. |

## Where Future Code Will Live

- **Day 3** adds full markup/styling to `index.html` and `style.css` (no new files).
- **Day 4** adds all interactivity to `script.js` using mock data (no new files).
- **Day 5** creates `api/summarize.js` and `.gitignore`, and updates `script.js` to call the real endpoint.
- **Day 6** adds history logic to `script.js` (no new files) and performs first deployment (no new files, just hosting configuration).
- **Day 7** polish — edits only to existing `style.css`/`script.js`/`index.html`.
- **Day 8** adds `TESTING.md`.
- **Day 9** adds `assets/favicon.ico` and `README.md`, edits `index.html` for meta tags.
- **Day 10** no new files — final verification and submission only.

## Why This Structure Was Chosen

1. **Flat over nested** — with 3 core frontend files and 1 backend file, subfolders like `src/`, `components/`, or `utils/` would add navigation overhead with zero benefit at this scale.
2. **`api/` is a Vercel platform convention**, not an arbitrary choice — any file placed there is automatically exposed as a serverless endpoint at the matching path, with zero routing configuration.
3. **No build step** — vanilla HTML/CSS/JS runs directly in the browser, matching the developer's current skill level and removing an entire category of tooling problems (bundler config, transpilation errors) that would slow down a 10-day beginner timeline.
4. **Documentation files live at the root** (`README.md`, `TESTING.md`, `PROJECT-LOG.md`) because that's where GitHub expects them for maximum visibility.
