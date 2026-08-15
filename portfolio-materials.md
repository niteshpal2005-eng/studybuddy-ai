# StudyBuddy AI — Portfolio Materials

---

## Project Description (long — for portfolio site / LinkedIn project section)

**StudyBuddy AI** is a full-stack AI study tool that turns any pasted notes, article, or chapter into a concise summary, key takeaways, and a self-generated multiple-choice quiz — built solo over a 10-day sprint, from requirements through a production v1.0.0 release.

The app runs on a vanilla HTML/CSS/JS frontend with a Vercel serverless backend calling the Google Gemini API, and uses browser `localStorage` for session history instead of a database — a deliberate architectural choice that kept the app zero-cost and zero-auth while still supporting a full save/reopen/delete history feature. Every stage of the build is documented in a public day-by-day project log, including real production incidents (a Vercel deployment mix-up that briefly overwrote an unrelated project, a race condition in the history-reopen flow, an exposed API key that was caught and rotated before it ever reached committed code) and how each was diagnosed and resolved.

The finished product is fully accessible (WCAG AA contrast, keyboard-operable history panel, screen-reader live regions, colorblind-safe quiz feedback), production-hardened (server-side input validation confirmed via direct `curl` testing, XSS-safe rendering, request-ID tracking to prevent stale API responses from overwriting active sessions), and deployed live with a custom 404 page, full SEO/social metadata, and an MIT license.

**Live app:** https://studybuddy-ai-sandy.vercel.app
**Repo:** https://github.com/niteshpal2005-eng/studybuddy-ai

---

## Project Description (short — for resume header / portfolio card)

AI-powered study tool that summarizes notes and generates self-test quizzes via the Google Gemini API. Solo-built in 10 days: vanilla JS frontend, Vercel serverless backend, full accessibility and security hardening, publicly documented build log.

---

## Resume Bullet Points

Pick 3–4 depending on the role you're applying for. Swap wording to match the job description's language where it fits.

**For a Frontend / Full-Stack role:**
- Designed and built StudyBuddy AI, a full-stack AI study tool, solo, over a 10-day sprint — from requirements gathering through a production v1.0.0 release, using vanilla JavaScript, a Vercel serverless backend, and the Google Gemini API
- Implemented WCAG AA-compliant accessibility across the app, including keyboard-operable UI components, screen-reader live regions, and colorblind-safe visual feedback
- Diagnosed and fixed a production race condition where reopening a saved session during an in-flight API request could silently overwrite it, using request-ID tracking and generation guards
- Verified server-side security boundaries via direct API testing (`curl`), confirming input validation held even when bypassing the browser client entirely

**For a role emphasizing AI/product work:**
- Built an end-to-end AI product (StudyBuddy AI) integrating the Google Gemini API to generate structured summaries and adaptive multiple-choice quizzes from arbitrary user-pasted text
- Made and documented a deliberate AI-provider architecture change mid-build (Claude API → Gemini API) after live cost/access research, prioritizing a zero-budget, no-credit-card constraint
- Owned the full product lifecycle solo: PRD, system architecture, UI wireframes, implementation, QA, deployment, and public release documentation

**For a role emphasizing engineering rigor / ownership:**
- Shipped and maintained a live production web app with zero database, zero authentication overhead, and a fully documented incident history — including a self-diagnosed and resolved accidental production deployment overwrite
- Conducted a full security and performance review before public launch (XSS-safety audit, `localStorage` quota-safety, WCAG contrast audit) and documented known limitations honestly rather than omitting them

---

## Interview Talking Points

Use these as anchors — tell them as short stories, not lists. Interviewers remember specifics, not adjectives.

**"Tell me about a bug you're proud of fixing."**
> On Day 8, I found a race condition: if a user reopened an old saved session while a new summary was still generating, the old API response could land *after* the reopen and silently overwrite what they were looking at — with no error, just wrong data on screen. I fixed it by giving every generate request an incrementing ID and discarding any response that isn't from the most recent request, plus disabling delete/clear/reopen actions while a request is in flight. It's the kind of bug that never shows up in casual testing but would absolutely happen in real use.

**"Tell me about a technical decision you made and why."**
> I originally planned to use the Claude API for the AI backend, since that's what the whole 60-day challenge was built around. But when I actually went to set it up, I found Anthropic's free tier needed phone verification and could require a card, while Google's Gemini free tier needed neither and doesn't expire. For a zero-budget solo project, that was the lower-risk call, so I switched — verified it with live research first, then documented the reasoning in my architecture doc so future-me (or anyone reading the repo) understands *why*, not just *what*.

**"Tell me about a mistake you made and how you handled it."**
> During setup I accidentally exposed my Gemini API key in a shared screenshot. I caught it immediately, deleted the key, generated a new one, and only then wrote any code against it — so the exposed key was never actually used in anything, committed anywhere, or reachable. Separately, on a later day, a Vercel CLI prompt matched my new project to an old, unrelated project by name and I deployed to the wrong place without noticing at first. I diagnosed it, created the correctly-named project, redeployed, and restored the original project's last good state with zero data loss. Both incidents are logged in my project history rather than hidden — I think that's more useful to show than pretending nothing went wrong.

**"How do you think about scope and MVP?"**
> I gave myself one explicit no-new-features day (Day 7 was UI polish only, Day 8 was testing only) and stuck to it. It's tempting to keep adding — PDF upload, multiple quiz difficulty levels, user accounts — but the actual MVP is: paste text, get a summary and a quiz, save your history. Everything else went into a documented 30-day post-launch roadmap instead of getting crammed into the sprint.

**"Walk me through your architecture."**
> Vanilla HTML/CSS/JS frontend, one serverless function on Vercel (`/api/summarize`) that validates input and calls Gemini, and browser `localStorage` for history — deliberately no database, no auth. That's not a limitation so much as a fit-for-purpose choice: the app has no accounts and no cross-device sync requirement in v1, so a database would've added complexity without adding value. If I extended it toward multi-device sync, that's exactly where I'd introduce one.

---

## Demo Script (60–90 seconds, live or recorded)

> "This is StudyBuddy AI — I built it solo over 10 days as the capstone for a 60-day AI development challenge.
>
> The idea is simple: students get handed way more reading than they have time to actually process. So — [paste sample text] — I paste in some notes or an article, hit Generate, and in a few seconds I get a concise summary, key takeaways, and a self-test quiz to check whether I actually understood it. [click through a quiz question, reveal the answer] Answers are colorblind-safe — checkmark and cross, not just color — and everything's screen-reader accessible.
>
> No login, no account — sessions save automatically to my browser's local history, so I can reopen or delete past ones. [show history panel]
>
> Under the hood it's a vanilla JS frontend, a Vercel serverless function calling the Google Gemini API, and zero database — deliberately, to keep it free and simple. It's fully deployed, tested, and documented — the whole day-by-day build log, including the real bugs I hit and fixed, is public in the repo."

---

## Screenshot / Demo Media Suggestions

Already captured and added to the README:
- ✅ Empty input state
- ✅ Summary + key takeaways
- ✅ Quiz (unanswered)
- ✅ Quiz with answers revealed

Additional media worth capturing if you want to go further:
- A short (15–20s) screen recording of the full flow (paste → generate → quiz → reveal) as a GIF for the top of the README — this converts browsers into "oh this actually works" faster than static screenshots
- A mobile-width screenshot (375px), since you specifically verified and documented responsive behavior — worth showing, not just claiming
- The history panel with a couple of saved sessions visible
