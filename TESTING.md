# TESTING.md — StudyBuddy AI

**Status:** Created Day 8 — manual QA pass before public launch.

## Testing Approach

Reviewed the application as a Senior QA Engineer, Security Reviewer, and Performance Engineer would before approving a public release. Focus: bugs, edge cases, error handling, security, accessibility, and production-readiness — not new features.

## Findings & Resolutions

| # | Area | Finding | Severity | Resolution |
|---|---|---|---|---|
| 1 | Race condition | Reopening a history item while a Generate request is in-flight could let a stale API response overwrite the reopened session | Medium | Fixed — request-ID tracking discards stale responses; history interactions blocked while busy (`isGenerating` guard on delete/clear/reopen functions) |
| 2 | Input hardening | No hard `maxlength` on the textarea — only soft-blocked via disabled button | Low | Fixed — added `maxlength="6000"` HTML attribute |
| 3 | Offline handling | No proactive offline detection, only reactive (after a failed request) | Low | Fixed — added `online`/`offline` event listeners with toast feedback |
| 4 | XSS / injection | Reviewed all render functions | — | **Pass** — confirmed all dynamic content uses `textContent`, never `innerHTML` with untrusted data |
| 5 | Duplicate-request spam | Reviewed rapid Generate clicking | — | **Pass** — confirmed button disables synchronously on click, before any async work begins |
| 6 | `localStorage` quota | Reviewed 20-entry history cap against typical entry size | — | **Pass** — worst case ~150KB total, well under browser's 5-10MB limit |
| 7 | Color contrast | Checked all text/background color pairs against WCAG AA | — | **Pass** — all pairs exceed 4.5:1 minimum contrast ratio |
| 8 | Server-side validation | Tested via direct `curl` request bypassing the browser entirely | — | **Pass** — confirmed live production API correctly rejects invalid input (too-short text) with a proper `400` error, proving the server doesn't just trust client-side checks |

## Manual Test Checklist (executed Day 8)

- [x] Empty input — Generate button stays disabled
- [x] Input under 50 characters — Generate button stays disabled
- [x] Input at exactly 50 characters — Generate button enables
- [x] Input at 6000-character hard cap — textarea stops accepting further input
- [x] Full generate flow — real Gemini API call, summary/key points/quiz render correctly
- [x] Quiz answer selection and reveal — correct/incorrect states show both color AND ✓/✗ icon
- [x] History save, reopen, delete, clear all — all functioning correctly
- [x] Deliberately invalid API key — friendly error shown, no crash (tested Day 5, re-confirmed still working)
- [x] Direct API call with invalid payload (bypassing UI) — server-side validation correctly rejects it
- [x] Responsive layout at 273px (narrower than typical mobile) — no breakage
- [x] Keyboard-only navigation — focus rings visible, history items reachable via Tab + Enter/Space
- [x] Live production site (not just localhost) — full flow re-verified working end-to-end

## Known Limitations (acceptable for this project's scope, documented not hidden)

- **No rate limiting on the API endpoint.** A determined user could send many direct requests bypassing the UI. For a free-tier hobby/capstone project with no payment processing or sensitive data, this is an accepted risk rather than a launch blocker — implementing rate limiting would require persistent storage (e.g., Redis), which is out of scope for this project's free-tier, database-free architecture.
- **AI model name is hardcoded** (`gemini-3.5-flash`). If Google deprecates this model in the future (as happened with `gemini-2.0-flash` in June 2026, discovered during Day 5 research), the app will start failing until the model name is updated. Documented in `ENVIRONMENT.md` as a monitored risk.
- **No automated test suite.** All testing is manual, appropriate for this project's scope and timeline. A future iteration could add automated tests if the project continued past v1.0.

## Browsers/Devices Tested

- Chrome (desktop) — primary development and testing browser
- Chrome DevTools device emulation — mobile widths down to 273px
- Production site tested on live URL, not just localhost

*(Cross-browser testing on Firefox/Safari recommended before final submission if time allows — not blocking, as the app uses only standard, well-supported web APIs with no Chrome-specific features.)*
