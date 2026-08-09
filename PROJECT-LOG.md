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

## Day 3 — Project Setup & Foundation
- Installed Live Server VS Code extension (only new tool needed — no framework CLI/package manager required for vanilla JS).
- Built the full static UI in `index.html` and `style.css` per Day 2's wireframes and color palette: header, input section, empty state, 3 result cards with dummy content, history panel with 2 sample entries.
- Verified Hello World checkpoint: zero console errors, confirmed responsive at both desktop and 375px mobile widths, history panel correctly stacks on mobile.
- Confirmed trunk-based Git workflow (direct commits to `main`) as the right fit for a solo 10-day capstone.
- Committed and pushed: "Day 3: build full static UI (input, results, quiz, history panel) - responsive layout verified"
- Reconciled generic Day 3 checklist items (routing/auth/DB/package manager) against our actual architecture — all correctly N/A per Day 2 decisions.
- Generated: `SETUP.md`, `ENVIRONMENT.md`, updated `PROJECT-STRUCTURE.md`, `DAY3-SUMMARY.md`.

**Handoff to Day 4:** Full HTML/CSS structure is built and verified. Attach JavaScript directly to existing element `id`s — no markup changes needed. Build mock data flow per `SCHEMA.md`'s data shape, then quiz interactivity using the already-existing `.selected`/`.correct`/`.incorrect` CSS classes.

## Day 5 — Claude API Integration → Swapped to Google Gemini API
- **Deliberate architecture change (approved before implementation):** switched AI provider from Anthropic Claude API to Google Gemini API. Reason: Gemini's free tier requires no credit card and never expires, while Anthropic's free trial requires phone verification, may require a card, and expires after a short window. For a zero-budget student capstone, this was the lower-risk choice. Confirmed via live web search before deciding. Full reasoning documented in updated `ARCHITECTURE.md`.
- Created a Google AI Studio account and generated a free-tier Gemini API key.
- **Security incident, handled correctly:** an API key was briefly visible in a shared screenshot during setup. Rotated immediately (old key deleted, new key generated) before writing any code — no exposure in committed code or the live app.
- Set up `.env` (local key storage) and `.gitignore` (excludes `.env` from Git), verified via `git status` before committing.
- Built `api/summarize.js` — the serverless function that validates input, builds a structured JSON prompt, and calls the Gemini API.
- Installed Node.js (already present) and the Vercel CLI; authenticated via GitHub login.
- **Debugged a real issue:** initial model name (`gemini-2.5-flash`) returned 404 for this account. Diagnosed via direct `ListModels` API query rather than guesswork, found the correct available model (`gemini-3.5-flash`), fixed with a one-line change.
- **Debugged a real Git issue:** resolved a leftover unfinished merge from Day 4 before continuing (`git commit -m "Merge remote changes"`).
- **Debugged a real Vercel config issue:** `vercel dev` initially guessed the wrong project type ("Vite"), causing a failed dev command. Fixed by adding `vercel.json` with explicit `"framework": null`.
- Updated `script.js` to call the real `/api/summarize` endpoint (replacing Day 4's mock `setTimeout`), including error display for failed requests.
- Verified end-to-end with real, varied input text — confirmed responses are freshly generated (not cached/mocked), quiz interactivity and answer-reveal work correctly with real data.
- Verified error handling by deliberately breaking the API key temporarily, confirmed a friendly error message displays (no crash, no blank screen), then restored the correct key and re-verified success.
- Minor Vercel project naming mismatch occurred (linked as "studyflow" instead of "studybuddy-ai") — cosmetic only, no functional impact, can be renamed anytime in Vercel dashboard settings.
- Generated: updated `ARCHITECTURE.md`, `API.md`, `ENVIRONMENT.md`.

**Handoff to Day 6:** Core AI integration is fully working and tested locally via `vercel dev`. Day 6 adds the LocalStorage history feature (save/reopen/delete sessions) and performs the first production deployment. When deploying, remember: (1) set `GEMINI_API_KEY` in Vercel's dashboard environment variables — it only exists locally right now, (2) the Vercel project is named "studyflow" not "studybuddy-ai" — rename in Settings if desired, purely cosmetic, (3) `vercel.json` with `"framework": null` must stay in the repo for deployment to work correctly, same reason as local dev.

## Day 6 — Complete MVP: History Feature + First Production Deployment
- Built full `localStorage` history system in `script.js`: auto-save on generate, render list with preview title + date, click-to-reopen, per-item delete, clear-all with confirmation, empty-state message.
- Wired the History toggle button (☰) to actually show/hide the panel.
- Added the required footer: "Built with Claude as part of the AB Talks 60-Day Claude AI Challenge."
- **Incident discovered and fully resolved:** the Day 5 "studyflow" Vercel project link turned out to be a different, pre-existing, unrelated project (not one created for this capstone). Production deployment briefly overwrote that project's live site with StudyBuddy AI content.
  - Root cause: `vercel dev`'s "Search all projects" prompt on Day 5 matched an old project by name coincidence, and it was selected without realizing it wasn't newly created.
  - Fix: created a new, correctly-named `studybuddy-ai` Vercel project from scratch, set `GEMINI_API_KEY` there, redeployed successfully.
  - Original "studyflow" project restored via Vercel's "Promote to Production" on its last good (pre-incident) deployment — fully recovered, zero data loss, confirmed working again at its original URL.
- **Production deployment successful and verified:** live app tested end-to-end at https://studybuddy-ai-sandy.vercel.app — real Gemini API calls, history save/reopen, footer all confirmed working outside localhost.
- Generated: updated `ENVIRONMENT.md` (documents the incident and correct URLs).

**Handoff to Day 7:** MVP is complete and live. All core features (generate, quiz, history) work in production, not just locally. Day 7 is UI/UX polish only — no new features, no architecture changes. Known minor items for Day 7: error message currently reuses the empty-state element (could get its own styled element); loading spinner/results overlap seen once on Day 4/6 (root-caused and fixed, monitor for recurrence). Live URL for all future testing: https://studybuddy-ai-sandy.vercel.app
