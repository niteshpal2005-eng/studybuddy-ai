# StudyBuddy AI

**Paste any notes, article, or chapter — get an instant AI-generated summary, key takeaways, and a self-test quiz.**

Built as a 10-day solo capstone for the **AB Talks 60-Day Claude AI Challenge**, taken from zero code to a live, publicly deployed product.

🔗 **Live app:** https://studybuddy-ai-sandy.vercel.app

---

## What it does

Students and self-learners are often handed large amounts of reading material with limited time to process it. StudyBuddy AI turns any pasted text into:

- 📝 A concise **summary** (3-5 sentences)
- 🔑 **Key takeaways** (4-6 bullet points)
- ❓ A **self-test quiz** (3-5 multiple-choice questions) to check real understanding

No login, no account, no setup — paste text and go. Past sessions are saved automatically in your browser so you can revisit them anytime.

## Features

- ⚡ Instant AI-powered summaries via the Google Gemini API
- 🧠 Auto-generated multiple-choice quizzes with instant, colorblind-safe answer feedback
- 🕘 Local session history — save, reopen, and delete past summaries (no server-side storage of your data)
- 📱 Fully responsive — works on desktop and mobile
- ♿ Accessible — keyboard navigation, screen-reader support, WCAG AA color contrast
- 🔒 Privacy-conscious — your pasted text never touches a database, only your own browser's local storage

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (no framework) |
| Backend | Vercel Serverless Function (Node.js) |
| AI | Google Gemini API (`gemini-3.5-flash`) |
| Storage | Browser `localStorage` (no database) |
| Hosting | Vercel |

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full system design and reasoning behind these choices.

## Running Locally

```bash
git clone https://github.com/niteshpal2005-eng/studybuddy-ai.git
cd studybuddy-ai
```

Create a `.env` file in the project root:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free API key at [aistudio.google.com](https://aistudio.google.com) — no credit card required.

Install the Vercel CLI and run locally:
```bash
npm install -g vercel
vercel dev
```

Visit `http://localhost:3000`.

Full setup instructions: [`SETUP.md`](./SETUP.md)

## Project Documentation

This project was built with a full software development lifecycle, and every stage is documented:

- [`PRD`](./StudyBuddyAI_PRD.docx) — Product requirements and scope
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — System design and data flow
- [`SCHEMA.md`](./SCHEMA.md) — Data structure (localStorage-based)
- [`API.md`](./API.md) — API endpoint specification
- [`UI-WIREFRAMES.md`](./UI-WIREFRAMES.md) — UI/UX design decisions
- [`TESTING.md`](./TESTING.md) — QA process and findings
- [`PROJECT-LOG.md`](./PROJECT-LOG.md) — Full day-by-day build log

## License

MIT — see [`LICENSE`](./LICENSE) for details.

## Acknowledgments

Built with Claude as part of the AB Talks 60-Day Claude AI Challenge.
