# API.md — StudyBuddy AI

**Status:** Finalized Day 2 · **Implementation:** Day 5 of the Implementation Blueprint

## Overview

v1.0 has exactly **one** API endpoint. It exists solely to keep the Anthropic API key server-side. There is no authentication layer, no user-specific data, and no other backend routes.

---

## `POST /api/summarize`

### Purpose
Accepts raw pasted text and returns an AI-generated summary, key takeaways, and a short quiz.

### Authentication
None. No user accounts exist in v1.0.

### Request

**Headers**
```
Content-Type: application/json
```

**Body**
```json
{
  "text": "string — the raw pasted notes/article/chapter"
}
```

### Request Validation

| Rule | Enforced |
|---|---|
| `text` must be a non-empty string | Client-side + server-side |
| Trimmed length ≥ 50 characters | Client-side + server-side |
| Trimmed length ≤ 6000 characters | Client-side + server-side |

Server-side validation is mandatory even though the client also checks — the client check is only a UX convenience, not a security boundary.

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

### Error Responses

| Status | Trigger | Body |
|---|---|---|
| `400 Bad Request` | Text missing, too short, or too long | `{ "error": "Text must be between 50 and 6000 characters." }` |
| `502 Bad Gateway` | Claude API call itself fails (network, auth, rate limit) | `{ "error": "AI service is temporarily unavailable. Please try again." }` |
| `500 Internal Server Error` | Claude responded but output wasn't valid parseable JSON | `{ "error": "Something went wrong generating your summary. Please try again." }` |
| `504 Gateway Timeout` | No response within 20 seconds | `{ "error": "This is taking longer than expected. Please try again." }` |

### Example Request (client-side fetch)

```javascript
const response = await fetch('/api/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: userInput.value })
});

if (!response.ok) {
  const { error } = await response.json();
  showErrorToast(error);
  return;
}

const data = await response.json();
renderResults(data);
```

### Notes for Day 5 Implementation

- The Claude prompt must explicitly instruct: *"Respond with ONLY valid JSON, no markdown formatting, no code fences, no extra commentary."*
- Always wrap `JSON.parse()` of Claude's response in a `try/catch` — this is what separates the `500` case from a successful `200`.
- The `ANTHROPIC_API_KEY` must be read from a server-side environment variable — never hardcoded, never sent to the client.
