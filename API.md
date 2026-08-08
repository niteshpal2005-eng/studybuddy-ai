# API.md — StudyBuddy AI

**Status:** Updated Day 5 — implementation complete and verified. AI provider is Google Gemini (see `ARCHITECTURE.md` for why).

## `POST /api/summarize`

### Purpose
Accepts raw pasted text and returns an AI-generated summary, key takeaways, and a short quiz, via the Google Gemini API.

### Authentication
None — no user accounts in v1.0.

### Request

```
Content-Type: application/json

{
  "text": "string — the raw pasted notes/article/chapter"
}
```

### Request Validation (implemented, both layers)

| Rule | Enforced |
|---|---|
| `text` must be a non-empty string | Client-side + server-side |
| Trimmed length ≥ 50 characters | Client-side + server-side |
| Trimmed length ≤ 6000 characters | Client-side + server-side |

### Success Response — `200 OK`

```json
{
  "summary": "string (3-5 sentences)",
  "keyPoints": ["string", "string", "string", "string"],
  "quiz": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0
    }
  ]
}
```

### Error Responses (all implemented and tested Day 5)

| Status | Trigger | Body | Verified? |
|---|---|---|---|
| `400 Bad Request` | Text missing, too short, or too long | `{ "error": "Text must be between 50 and 6000 characters." }` | ✅ |
| `502 Bad Gateway` | Gemini API call fails (network, invalid key, rate limit) | `{ "error": "AI service is temporarily unavailable. Please try again." }` | ✅ tested with deliberately broken key |
| `500 Internal Server Error` | Gemini responded but output wasn't valid parseable JSON, or had unexpected shape | `{ "error": "Something went wrong generating your summary. Please try again." }` | Logic implemented, not directly forced-tested (would require crafting a malformed AI response) |
| `504 Gateway Timeout` | No response within 20 seconds | `{ "error": "This is taking longer than expected. Please try again." }` | Logic implemented, not forced-tested (Gemini responded quickly in all Day 5 tests) |

## Implementation Notes (from Day 5)

- **Model used:** `gemini-3.5-flash`, called via `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={API_KEY}`.
- **Important lesson:** model availability varies per API key/account. Always verify available models via the `ListModels` endpoint (`GET /v1beta/models?key={API_KEY}`) rather than assuming a model name works — `gemini-2.5-flash` returned a 404 for this project's key even though it's documented as generally available.
- `generationConfig.responseMimeType: "application/json"` is set on the request, which — combined with the prompt's explicit JSON-only instruction — made Gemini's output reliably parseable in all Day 5 testing.
- The API key is read from `process.env.GEMINI_API_KEY`, set locally via `.env` (excluded from Git via `.gitignore`) and will be set in Vercel's dashboard for production on Day 6.

### Example Request (client-side fetch, as implemented in `script.js`)

```javascript
const response = await fetch('/api/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: userInput.value })
});

const data = await response.json();

if (!response.ok) {
  showError(data.error);
} else {
  renderResults(data);
}
```
