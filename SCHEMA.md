# SCHEMA.md — StudyBuddy AI

**Status:** Finalized Day 2 · **Storage:** Browser `localStorage` only — no server-side database

## 1. Why This Isn't a Traditional Database Schema

The PRD explicitly excludes user accounts and cloud sync (v1.0 Out-of-Scope). All persistence happens client-side, in the user's own browser, as a single JSON array under one `localStorage` key. This file documents that data shape with the same rigor a real schema would get, since it's still the single source of truth for how data is structured.

## 2. Storage Key

```
Key:   studybuddy_history
Value: JSON-stringified array of HistoryEntry objects
Cap:   20 entries max (oldest auto-removed when exceeded)
```

## 3. `HistoryEntry` Object

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string (UUID) | Yes | Generated client-side at save time |
| `createdAt` | string (ISO-8601) | Yes | Used for display date and sort order |
| `inputPreview` | string | Yes | First ~40 characters of the original pasted text, for the History list title |
| `inputText` | string | Yes | Full original pasted text (so a session can be fully reloaded) |
| `summary` | string | Yes | AI-generated summary |
| `keyPoints` | array of strings | Yes | 4–6 bullet takeaways |
| `quiz` | array of `QuizQuestion` | Yes | 3–5 questions |

## 4. `QuizQuestion` Object

| Field | Type | Required | Notes |
|---|---|---|---|
| `question` | string | Yes | The quiz question text |
| `options` | array of 4 strings | Yes | Multiple-choice options |
| `correctIndex` | number (0–3) | Yes | Index into `options` of the correct answer |

## 5. Example Record

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "createdAt": "2026-08-06T09:15:00.000Z",
  "inputPreview": "The water cycle describes how water moves...",
  "inputText": "The water cycle describes how water moves through Earth's systems via evaporation, condensation...",
  "summary": "This text explains the water cycle, covering evaporation, condensation, and precipitation as the three core stages that move water through Earth's systems.",
  "keyPoints": [
    "Evaporation turns liquid water into vapor using solar energy",
    "Condensation forms clouds as vapor cools",
    "Precipitation returns water to the earth's surface",
    "The cycle is continuous and drives Earth's climate system"
  ],
  "quiz": [
    {
      "question": "What process forms clouds?",
      "options": ["Evaporation", "Condensation", "Precipitation", "Erosion"],
      "correctIndex": 1
    }
  ]
}
```

## 6. Constraints & Validation

- `inputText` length: 50–6000 characters (enforced both client-side and in the serverless function).
- `keyPoints`: 4–6 items enforced via the Claude prompt; UI should not break if the count varies slightly.
- `quiz`: 3–5 questions, each with exactly 4 options, enforced via the Claude prompt.
- `correctIndex` must be validated as `0 ≤ correctIndex ≤ 3` before rendering, to guard against malformed AI output.
- Total history capped at 20 entries — oldest entry (by `createdAt`) is dropped first when the cap is exceeded, preventing `QuotaExceededError`.

## 7. Relationships

There are no relational links — this is a flat array, not a relational schema. Each `HistoryEntry` is fully self-contained (denormalized) so a session can be deleted or reloaded independently with no cascading effects.

## 8. Validated Against PRD User Stories

| PRD Requirement | Satisfied By |
|---|---|
| FR-8: Save session to history | Push new `HistoryEntry` to array, write to `localStorage` |
| FR-9: View history, reopen session | Read array, render list, reload entry into results view |
| FR-10: Delete one / clear all | Filter array by `id` / clear key entirely |
| NFR Data Privacy: no server storage | Confirmed — this schema never leaves the browser |

## 9. Future Scope Note

If v2.0 introduces accounts (see PRD Future Scope), this exact JSON shape maps directly onto a `sessions` table with a `user_id` foreign key — no redesign needed, just a lift-and-shift into a real database.
