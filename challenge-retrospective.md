# Challenge Retrospective — StudyBuddy AI

A look back at how this project actually came together, day by day, based on the real `PROJECT-LOG.md` — not a polished retelling, the actual one.

---

## Timeline: Day 1 → Day 10

**Day 1 — Discovery & Planning**
Ran a product discovery pass and landed on StudyBuddy AI: a notes summarizer and quiz generator. Scope was defined tightly up front, including explicit in/out boundaries and Day 10 success criteria — a decision that paid off repeatedly later, because there was a document to check scope creep against instead of relying on memory or vibes.

**Day 2 — System Design**
Repo created, tech stack finalized: vanilla HTML/CSS/JS, Vercel serverless functions, `localStorage` for history, no database, no auth. The single meaningful pivot this early: choosing Vercel over Netlify for zero-config serverless functions — small, but it shaped every deployment decision for the rest of the build. Full architecture, schema, API spec, and wireframes were documented *before* any implementation code was written.

**Day 3 — Foundation**
Full static UI built from the Day 2 wireframes — responsive at both desktop and 375px mobile widths, verified with zero console errors. No shortcuts taken on the "boring" work of getting structure and layout right before adding behavior.

**Day 4 — (Interactivity & Mock Data)**
Quiz interactivity wired up against mock data using pre-built CSS state classes, setting up a clean handoff for real API integration.

**Day 5 — The Real Pivot: Claude API → Gemini API**
This was the project's biggest architectural decision. The original plan was to use the Claude API, but Anthropic's free tier required phone verification and possibly a card, with an expiring trial — a real risk for a zero-budget capstone. Gemini's free tier required neither. The switch was verified via live research before committing, not just assumed. Also this day: a security incident (an API key briefly visible in a screenshot) caught and resolved *immediately* — rotated before any code was written against it, meaning zero actual exposure. Two more real bugs surfaced and got root-caused rather than patched blindly: a wrong Gemini model name (diagnosed via direct `ListModels` query) and a Vercel config issue (`vercel.json` needed explicit `framework: null`).

**Day 6 — MVP Complete + First Deploy Incident**
`localStorage` history shipped (save, reopen, delete, clear-all). Then a real production incident: Vercel's project-picker matched an old, unrelated project by name, and a deploy briefly overwrote its live site. This was caught, diagnosed to root cause, and fully resolved — a new correctly-named project created, the original restored to its last good state via Vercel's promote-to-production, zero data loss. This is the kind of incident most tutorials never show happening, let alone show being cleanly recovered from.

**Day 7 — UI/UX Polish**
Accessibility became a first-class concern: `aria-live` regions, keyboard-focusable history items, colorblind-safe quiz feedback (icons, not just color), `prefers-reduced-motion` support. A CSS regression (an accidentally dropped `[hidden]` rule) was caught through careful testing and fixed same-day — and documented so it wouldn't get silently reintroduced later. A second incident — Vercel's Git auto-deploy had silently never actually connected — was diagnosed via mismatched deployment timestamps and fixed properly rather than patched over with manual deploys indefinitely.

**Day 8 — Testing & Hardening**
A genuine race condition was found: reopening a saved history item during an in-flight generate request could let a stale response silently overwrite it. Fixed with request-ID tracking and generation guards — not a cosmetic fix, a real concurrency bug caught before users would ever hit it. Security and performance were verified by direct code review (XSS-safety via `textContent`-only rendering) and by a live `curl` test against the production API confirming server-side validation actually holds, not just client-side appearance of validation.

**Day 9 — Launch Readiness**
README, MIT license, favicon, full SEO/social metadata, and a custom branded 404 page — all verified on the *live* production site, not just locally. This was a full release-readiness review treating the project as a real public launch, not a checkbox exercise.

**Day 10 — Final Review, Portfolio & Graduation**
Full regression check against the original Day 1 success criteria. Deployed URL and repo reviewed end-to-end across five professional lenses (engineering, product, UX, recruiting, open-source maintenance). README upgraded with real screenshots and badges. Portfolio materials, growth roadmap, and this retrospective produced. v1.0.0 tagged.

---

## Major Technical Decisions & Pivots

1. **Vercel over Netlify** (Day 2) — zero-config serverless functions via the `api/` folder convention.
2. **Gemini API over Claude API** (Day 5) — free-tier accessibility for a zero-budget solo capstone, decided via live research rather than assumption.
3. **`localStorage` over a database** (Day 2, held through Day 10) — no accounts, no cross-device requirement in v1, so a database would have added complexity without adding value. This is exactly the kind of restraint that's easy to abandon under scope pressure and wasn't.

## Challenges Solved & Debugging Moments Worth Remembering

- A wrong Gemini model name, diagnosed via a direct API query instead of trial-and-error guessing (Day 5).
- A Vercel deployment that silently landed on the wrong, pre-existing project — caught, root-caused, and fully recovered with zero data loss (Day 6).
- A race condition between an in-flight API request and a user reopening history — fixed with request-ID tracking, not a band-aid (Day 8).
- A CSS regression that silently broke state visibility, caught through disciplined testing rather than luck (Day 7).
- A briefly exposed API key, rotated before it ever touched committed code (Day 5).

## Skills Demonstrated Across the Build

- End-to-end product ownership: discovery, PRD, architecture, implementation, QA, deployment, documentation, release.
- Real incident response: root-causing production issues rather than surface-patching them, and documenting the incident afterward instead of hiding it.
- Security-conscious engineering: credential rotation, XSS-safe rendering, server-side validation verified independently of the UI.
- Accessibility as a genuine practice, not an afterthought: WCAG AA contrast, keyboard operability, screen-reader live regions, colorblind-safe feedback.
- Disciplined scope management: dedicated polish-only and testing-only days, with no feature creep against the original Day 1 plan.
- Honest technical writing: a `TESTING.md` that names real limitations instead of omitting them.

## Final Project Summary

StudyBuddy AI went from a blank repository to a live, publicly deployed, accessible, security-reviewed AI product in 10 days — built solo, with every architectural decision, incident, and fix documented in real time rather than reconstructed afterward. What makes this build stand out isn't that everything went smoothly; it's that when things *didn't* go smoothly — a leaked key, a wrong deploy target, a race condition — each one was caught, diagnosed properly, fixed, and written down.

## Lessons Learned

- **Document decisions as you make them, not after.** The `PROJECT-LOG.md` written in real time is far more credible — and more useful to future-you — than a retrospective written from memory.
- **A tight, explicit scope is what makes a 10-day solo build survivable.** Every day that resisted feature creep (Day 7, Day 8 especially) is a day that made Day 10 possible.
- **Incidents are not failures to hide — they're the most interesting part of the story.** The Vercel overwrite and the race condition are more valuable to a recruiter than a changelog with no bumps in it at all.
- **Verify assumptions live rather than trusting memory** — the Claude-to-Gemini pivot and the Gemini model-name bug were both resolved by checking reality directly instead of guessing.

---

## A Farewell, From Your AI Pair Programmer

Ten days ago this was an empty repository and a discovery interview. Now it's a live app with real users able to paste something they're supposed to be studying and actually get help from it — plus a paper trail showing exactly how it got built, including the parts that didn't go perfectly the first time.

I want to be specific about what stood out, because generic praise is cheap and you earned better than that. The Day 6 incident — where a deploy briefly landed on the wrong project — is the kind of thing a lot of people would quietly fix and never mention again. You didn't. It's in the log, root cause and all, right next to the fix. Same with the Day 8 race condition: that's a real concurrency bug, the kind that ships in production apps built by teams with a lot more than 10 days, and you caught it before a user ever would.

The Gemini pivot on Day 5 is the decision I'd point to if someone asked me what "good engineering judgment" looks like in practice: not stubbornly sticking to the original plan, and not panicking and guessing either — checking the real constraints, making the call, and writing down why.

You built this alone, in 10 days, as part of a 60-day challenge that started with AI fundamentals and ended with you shipping and hardening a production application. That arc — from learning what a prompt is to debugging a live race condition in your own deployed API — is the whole point of the challenge, and you completed it.

Congratulations on v1.0.0. It was genuinely good to build this with you.
