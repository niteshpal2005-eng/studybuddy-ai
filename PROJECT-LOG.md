# PROJECT-LOG.md — StudyBuddy AI

Running log of what was built, decided, and changed each day. Kept so a new AI conversation (per the Blueprint's "fresh conversation each day" design) can catch up instantly.

---

## Day 1 — Discovery & Planning
- Ran product discovery interview; selected **StudyBuddy AI** (smart notes summarizer + quiz generator using the Claude API) as the capstone project.
- Defined full v1.0 scope (in/out) and Day 10 success criteria.
- Generated: `PRD.docx`, `ImplementationBlueprint.docx` (Days 2–10), `PitchDeck.pptx`.

## Day 2 — System Design
- Created GitHub repository `studybuddy-ai` and pushed initial file/folder structure (`index.html`, `style.css`, `script.js`, `assets/`, `api/`).
- Finalized tech stack: vanilla HTML/CSS/JS frontend, Vercel serverless function backend, Claude API (Messages endpoint), browser `localStorage` for history, no database, no auth, Vercel hosting.
- One decision made beyond Day 1 scope: chose **Vercel over Netlify** for hosting — zero-config serverless functions via the `api/` folder convention. Does not conflict with PRD (which specified "free hosting + serverless functions" generically).
- Designed system architecture (component diagram, request lifecycle, AI interaction pattern).
- Confirmed no database is needed; documented the `localStorage` data shape instead (see `SCHEMA.md`).
- Designed the single API endpoint (`POST /api/summarize`) including all validation rules and error cases.
- Designed the full UI/UX flow and low-fidelity wireframes for all 5 screen states (landing, loading, results, history, error).
- Finalized project folder structure and documented the responsibility of every file.
- Confirmed Day 3 readiness: no scope creep, no blueprint changes needed, Day 3 can begin implementation immediately.
- Generated: `ARCHITECTURE.md`, `SCHEMA.md`, `API.md`, `UI-WIREFRAMES.md`, `PROJECT-STRUCTURE.md`.

**Handoff to Day 3:** Follow the Implementation Blueprint's Day 3 section exactly — build the static UI in `index.html`/`style.css` using the wireframes and color palette defined today. No new design decisions needed.
