# ARCHITECTURE.md — StudyBuddy AI

**Status:** Finalized Day 2 · **Source of truth:** PRD.docx, ImplementationBlueprint.docx (Day 1)

## 1. Overview

StudyBuddy AI is a static frontend + single serverless function architecture. There is no traditional backend server and no database — this is a deliberate simplicity decision that matches the PRD's scope (no accounts, no cloud sync) and the developer's beginner skill level.

## 2. Tech Stack

| Layer | Choice | Reasoning |
|---|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript | Matches existing skill level; no framework learning curve |
| Backend | Vercel Serverless Function (Node.js) | Keeps the Claude API key server-side only; zero-config with Vercel |
| Database | None (browser `localStorage`) | Out of scope per PRD; simpler, private, free |
| Authentication | None | Out of scope per PRD |
| AI Model/API | Claude API — Messages endpoint | Core requirement; strong structured-JSON output |
| Hosting | Vercel (free tier) | Auto-deploys static + serverless from GitHub push |
| Fonts | Google Fonts (Poppins + system-ui) | Free, fast, no licensing concerns |
| Version Control | Git + GitHub | Industry standard, free |

## 3. Component Diagram

```
┌────────────────────┐        ┌──────────────────────┐
│   Browser (client)  │◄──────►│      localStorage      │
│  index.html+script.js│       │  session history        │
└─────────┬───────────┘        └──────────────────────┘
          │ POST /api/summarize
          ▼
┌──────────────────────────┐
│ Vercel serverless function │
│      api/summarize.js       │
└─────────┬───────────────────┘
          │ Structured JSON prompt
          ▼
┌──────────────────────────┐
│        Claude API          │
│    Messages endpoint        │
└──────────────────────────┘
```

## 4. Request Lifecycle

1. User pastes text in the browser and clicks **Generate**.
2. Client-side validation checks length (50–6000 characters). If invalid, request is blocked before any network call.
3. Browser sends `POST /api/summarize` with `{ text: "..." }`.
4. The Vercel serverless function re-validates input server-side (never trusts the client alone).
5. The function builds a structured prompt instructing Claude to return only valid JSON with `summary`, `keyPoints`, and `quiz`.
6. The function calls the Claude API (Messages endpoint) with that prompt.
7. Claude's response is parsed; if parsing fails, a friendly `500` error is returned instead of crashing.
8. On success, the function returns clean JSON to the browser.
9. The browser renders the results and saves the full session to `localStorage` under the key `studybuddy_history`.
10. Revisiting a past session (via the History panel) reads directly from `localStorage` — no new API call.

## 5. AI Interaction

- Single call per generation — no multi-turn conversation, no streaming (simplifies both implementation and error handling).
- Prompt explicitly instructs: *"Respond with ONLY valid JSON, no markdown formatting, no code fences, no extra commentary."*
- Expected response shape:
  ```json
  {
    "summary": "string",
    "keyPoints": ["string", "..."],
    "quiz": [{ "question": "string", "options": ["a","b","c","d"], "correctIndex": 0 }]
  }
  ```
- Timeout: if Claude takes longer than 20 seconds, the function returns a `504` and the UI shows a friendly retry message.

## 6. External Services

| Service | Purpose | Tier |
|---|---|---|
| Anthropic Claude API | Generates summary/key points/quiz | Free trial credits |
| Vercel | Hosts static site + serverless function | Free tier |
| GitHub | Version control, triggers auto-deploy | Free |
| Google Fonts | Typography | Free |

## 7. Why No Database

Every user story in the PRD (save, view, delete, clear history) is satisfiable with a single JSON array in `localStorage`. Adding a real database would introduce hosting cost, auth complexity, and privacy surface area with zero benefit to v1.0's defined scope. This is documented explicitly so it is never mistaken for an oversight — see SCHEMA.md for the full data shape.
