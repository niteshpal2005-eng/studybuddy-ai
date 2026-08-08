# ARCHITECTURE.md — StudyBuddy AI

**Status:** Updated Day 5 (originally created Day 2) — **AI provider changed from Claude API to Google Gemini API.**

## Why This Changed

The original Day 2 architecture specified the Anthropic Claude API. On Day 5, this was deliberately swapped to **Google Gemini API (via Google AI Studio)** for one reason: Gemini offers a genuinely permanent free tier with no credit card and no expiration, while Anthropic's free trial requires phone verification, may require a card for identity verification, and expires after a short window. For a student capstone project with zero budget, this is a meaningfully lower-risk choice. Everything else about the architecture — the serverless proxy pattern, the JSON prompt design, the request lifecycle — is unchanged.

**Model in use:** `gemini-3.5-flash` (confirmed available on this project's free-tier API key via direct ListModels query on Day 5 — some other model names like `gemini-2.5-flash` returned 404 for this account, so always verify via ListModels rather than assuming a model name is available).

## 1. Overview

StudyBuddy AI is a static frontend + single serverless function architecture. There is no traditional backend server and no database.

## 2. Tech Stack

| Layer | Choice | Reasoning |
|---|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript | Matches existing skill level; no framework learning curve |
| Backend | Vercel Serverless Function (Node.js) | Keeps the Gemini API key server-side only; zero-config with Vercel |
| Database | None (browser `localStorage`) | Out of scope per PRD; simpler, private, free |
| Authentication | None | Out of scope per PRD |
| AI Model/API | **Google Gemini API — `gemini-3.5-flash` via `generateContent`** | Genuinely free, permanent, no card required; strong structured-JSON output |
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
│      Google Gemini API      │
│   gemini-3.5-flash model     │
└──────────────────────────┘
```

## 4. Request Lifecycle

1. User pastes text in the browser and clicks **Generate**.
2. Client-side validation checks length (50–6000 characters).
3. Browser sends `POST /api/summarize` with `{ text: "..." }`.
4. The Vercel serverless function re-validates input server-side.
5. The function builds a structured prompt instructing Gemini to return only valid JSON with `summary`, `keyPoints`, and `quiz`, using `responseMimeType: "application/json"` to further enforce clean output.
6. The function calls the Gemini API (`generateContent` endpoint) with a 20-second timeout.
7. Gemini's response is parsed; if parsing fails or the shape is unexpected, a friendly `500` error is returned instead of crashing.
8. On success, the function returns clean JSON to the browser.
9. The browser renders the results and saves the full session to `localStorage`.

## 5. AI Interaction

- Single call per generation — no multi-turn conversation, no streaming.
- Prompt explicitly instructs: *"Respond with ONLY valid JSON, no markdown formatting, no code fences, no backticks, no extra commentary."*
- `generationConfig.responseMimeType: "application/json"` is also set in the API request itself, giving a second layer of enforcement beyond the prompt wording.
- Expected response shape (unchanged from Day 2's design):
  ```json
  {
    "summary": "string",
    "keyPoints": ["string", "..."],
    "quiz": [{ "question": "string", "options": ["a","b","c","d"], "correctIndex": 0 }]
  }
  ```
- Timeout: 20 seconds, returns `504` with a friendly retry message.

## 6. External Services

| Service | Purpose | Tier |
|---|---|---|
| Google Gemini API (AI Studio) | Generates summary/key points/quiz | Free tier — no card, no expiration |
| Vercel | Hosts static site + serverless function | Free tier |
| GitHub | Version control, triggers auto-deploy | Free |
| Google Fonts | Typography | Free |

## 7. Known Trade-off — Data Usage on Free Tier

Google's free tier may use submitted prompts/outputs to improve their models (disclosed in their terms). This is a reasonable trade-off for a zero-cost student capstone project, but is documented here for transparency — if this were a production product handling sensitive user data, upgrading to a paid tier (which doesn't train on data) would be the right call. Not a concern for this project's intended use (public notes/articles/textbook text).

## 8. Why No Database

Unchanged from Day 2 — every user story is satisfiable with `localStorage`. See `SCHEMA.md`.
