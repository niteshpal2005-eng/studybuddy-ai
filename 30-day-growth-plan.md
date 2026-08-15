# 30-Day Growth Plan — StudyBuddy AI

A day-by-day roadmap taking StudyBuddy AI from its v1.0.0 MVP toward the 3-month milestone in `future-scope.md`. Each day builds on the previous one and assumes ~30–60 minutes of focused work. Use alongside `daily-build-prompt.md` — just change the day number each time.

This plan is scoped specifically to StudyBuddy AI's actual stack (vanilla JS, Vercel serverless, Gemini API, `localStorage`) — no framework migrations, no infrastructure changes not already justified by `future-scope.md`.

---

### Week 1 — Resilience & Input Flexibility

- **Day 1:** Add a model fallback chain in `api/summarize.js` (try `gemini-3.5-flash`, fall back to a secondary model on 404/error) — closes the risk flagged in `TESTING.md`.
- **Day 2:** Add basic IP-based rate limiting to `/api/summarize` (Vercel Edge Config or a simple in-memory + timestamp check to start).
- **Day 3:** Add `pdf.js` client-side and a file-drop zone next to the textarea; extract text from an uploaded PDF into the existing input flow.
- **Day 4:** Add support for `.docx` upload (client-side extraction via `mammoth.js` or similar), reusing the same input pipeline as Day 3.
- **Day 5:** Add a visible "Extracting text..." state for file uploads, distinct from the existing "Generating..." state, so users get feedback during extraction, not just generation.
- **Day 6:** Write unit tests for `api/summarize.js`'s input validation logic (empty input, over-limit input, malformed requests) — first piece of the automated test suite named as a gap in `TESTING.md`.
- **Day 7:** Regression pass: confirm PDF upload, `.docx` upload, and manual paste all still produce correct summaries and quizzes; update `TESTING.md` with the new coverage.

### Week 2 — Quiz Depth & Export

- **Day 8:** Add a difficulty/length selector (e.g. 3 / 5 / 8 questions) that adjusts the Gemini prompt parameters.
- **Day 9:** Add a "conceptual vs recall" quiz-style toggle, again as a prompt parameter — no new UI complexity beyond one control.
- **Day 10:** Add "Copy summary as Markdown" button next to results.
- **Day 11:** Add "Download as PDF" for a generated summary (client-side PDF generation, e.g. `jsPDF`).
- **Day 12:** Add per-question "why this is correct" explanation text to the quiz reveal state (already have the data shape from Gemini's response — surface it in the UI).
- **Day 13:** Accessibility re-audit of all Week 2 additions — confirm new buttons/controls meet the same WCAG AA bar set on the original Day 7.
- **Day 14:** Regression + deploy: full end-to-end test of new quiz and export features on production, update `PROJECT-LOG.md`-style entry documenting this week's additions.

### Week 3 — Test Coverage & Reliability

- **Day 15:** Set up Playwright (or Cypress) in the repo; write first e2e test: paste text → generate → see summary.
- **Day 16:** Add e2e test: generate → answer quiz → reveal answers → verify correct/incorrect states render.
- **Day 17:** Add e2e test: save to history → reopen → verify content matches → delete → verify removal.
- **Day 18:** Add e2e test: simulate offline/online transition and confirm the existing toast feedback still fires correctly.
- **Day 19:** Wire the e2e suite into a GitHub Actions workflow that runs on every push to `main`.
- **Day 20:** Fix whatever the new automated suite finds (there's usually at least one thing manual testing missed) — document any real bugs found the same way Day 8's race condition was documented.
- **Day 21:** Update `TESTING.md` to reflect the new automated coverage; remove "no automated tests" from the known-limitations list.

### Week 4 — Sharing & Groundwork for Accounts

- **Day 22:** Design the shareable-link data shape (what a public, read-only summary view needs) — architecture doc first, matching the Day 2 discipline of the original build.
- **Day 23:** Add a "Share" button that generates a public link for a summary (requires minimal server-side storage — a good moment to introduce a lightweight KV store like Vercel KV, scoped only to shared items, not full accounts yet).
- **Day 24:** Build the public read-only view page for shared summaries (no editing, no history panel — just the summary/takeaways/quiz).
- **Day 25:** Add expiry to shared links (e.g. 30 days) to keep the KV store bounded and avoid unbounded storage growth.
- **Day 26:** Security review of the new sharing feature: confirm shared links can't leak private history, confirm rate limiting covers the new endpoint too.
- **Day 27:** Update `README.md`, `ARCHITECTURE.md`, and `SCHEMA.md` to reflect the new sharing feature and lightweight storage layer.
- **Day 28:** Full regression across the entire app — original MVP flow, Week 1–3 additions, and new sharing feature — on production.
- **Day 29:** Write a short "30 days later" changelog/blog-style post for the README or a `CHANGELOG.md`, documenting what shipped this month in the same honest, specific style as the original `PROJECT-LOG.md`.
- **Day 30:** Tag `v1.1.0`, update GitHub topics/description if scope has meaningfully shifted, and set the next 30-day milestone based on where the 6-month plan in `future-scope.md` (accounts + cloud sync) actually stands.

---

**Note:** if any day's milestone turns out to be bigger than expected (this happened for real on Days 5–8 of the original build), it's fine to split it across two days rather than rush it. The original 10-day sprint's discipline — documenting the actual decision, not just the plan — matters more than hitting the day number exactly.
