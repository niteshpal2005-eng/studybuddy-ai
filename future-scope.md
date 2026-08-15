# Future Scope — StudyBuddy AI

This document outlines a realistic evolution path for StudyBuddy AI beyond its v1.0.0 capstone release, grounded in the actual architecture and constraints established during the 10-day build (vanilla JS frontend, Vercel serverless backend, Gemini API, `localStorage`-only persistence, no auth, no database).

---

## 3 Months: Strengthen the Core Loop

Focus: make the existing single feature (summarize + quiz) more robust and more useful, without expanding scope.

- **PDF and file upload support** — let users drop a PDF or `.docx` instead of copy-pasting; extract text client-side (e.g. `pdf.js`) before sending to `/api/summarize`. No backend architecture change needed.
- **Adjustable quiz difficulty/length** — expose a simple control (3 vs 5 vs 8 questions; recall vs conceptual) as a prompt parameter to Gemini, rather than a fixed hardcoded format.
- **Model resilience** — replace the currently hardcoded `gemini-3.5-flash` model string with a small fallback chain, so a future model deprecation degrades gracefully instead of breaking the endpoint outright. This directly closes the gap flagged in `TESTING.md`.
- **Basic rate limiting** on `/api/summarize` — currently unprotected per `TESTING.md`; even a simple IP-based limiter (e.g. Vercel Edge Config or Upstash Redis) prevents abuse of the free Gemini quota.
- **Export options** — "Copy as Markdown" / "Download as PDF" for a generated summary, so results survive outside the browser session.

## 6 Months: Cross-Device Continuity

Focus: solve the single biggest limitation of the current architecture — history that's trapped in one browser.

- **Optional accounts** — introduce lightweight auth (e.g. magic-link email via a provider like Clerk or Supabase Auth) as strictly opt-in. Anonymous `localStorage`-only mode stays fully supported; this is additive, not a replacement.
- **Cloud sync for history** — once accounts exist, migrate saved sessions to a real database (Postgres via Supabase or Vercel Postgres) for signed-in users, keeping the current `SCHEMA.md` shape as the source of truth for the data model so the migration is mostly a storage-layer swap, not a redesign.
- **Shareable summary links** — generate a public, read-only link for a given summary/quiz, useful for study groups or teachers sharing prepared material.
- **Automated test suite** — the one gap explicitly named in `TESTING.md`. Add unit tests for the serverless function's validation logic and a small Playwright/Cypress suite covering the generate → quiz → reveal flow, so future changes don't rely on manual regression testing alone.

## 12 Months: From Tool to Study Companion

Focus: move from "summarize what I paste" to an ongoing study relationship with the material.

- **Spaced-repetition quiz recall** — instead of a one-off quiz, resurface questions from past sessions on a spaced schedule (a lightweight Anki-style algorithm), turning saved history into an active review system rather than a passive archive.
- **Multi-document study sets** — group several related summaries (e.g. all chapters of one textbook) into a single study set with a combined quiz drawing from all of them.
- **Usage-based tiering** — if adoption justifies it, introduce a free tier (current behavior) plus a paid tier covering heavier usage, longer inputs, or GPT-4-class model access, funding actual Gemini API costs at scale.
- **Teacher/classroom mode** — allow an educator to assign a reading, and see aggregate (anonymized) quiz performance across a class — a natural extension of the existing quiz engine, requiring accounts and light multi-user permissions from the 6-month milestone.

---

## What Stays Constant

Regardless of which of the above gets built, three architectural decisions made during the original 10-day sprint should remain non-negotiable:
1. **Anonymous use must always remain possible** — accounts and cloud sync are additive, never a requirement to use the core feature.
2. **Privacy-first data handling** — pasted study text should never be logged or retained server-side beyond the single request/response cycle, consistent with the original privacy design.
3. **Accessibility is not optional** — every new feature should meet the same WCAG AA bar established in the Day 7 accessibility pass, not regress it.
