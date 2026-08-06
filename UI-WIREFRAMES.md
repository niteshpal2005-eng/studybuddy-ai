# UI-WIREFRAMES.md — StudyBuddy AI

**Status:** Finalized Day 2 · **Implementation:** Day 3 of the Implementation Blueprint

## 1. Design Decisions

| Decision | Value |
|---|---|
| Primary color | `#2C5F2D` (forest green) — "focus/study" feel |
| Secondary color | `#97BC62` (moss green) |
| Background | `#F5F5F5` (soft cream) |
| Heading font | Poppins (Google Fonts) |
| Body font | system-ui |
| Layout | Single page, no routing, max-width 800px centered container |
| Responsive breakpoint | 600px (history panel stacks below main content on mobile) |

## 2. Why Single-Page, No Navigation

There is exactly one core task (paste → generate → review), so introducing routes or multiple pages would add complexity with no user benefit. Navigation is limited to a single History panel toggle.

## 3. Screen States (not separate pages — one page, multiple UI states)

### State A — Landing / Empty
```
┌─────────────────────────────────────────────┐
│  StudyBuddy AI            [☰ History]        │
├─────────────────────────────────────────────┤
│   ┌───────────────────────────────────────┐ │
│   │ Paste your notes, article, or          │ │
│   │ chapter here...                        │ │
│   └───────────────────────────────────────┘ │
│   0/6000 chars              [ Generate ⚡ ]  │
├─────────────────────────────────────────────┤
│  "Your summary, key points, and quiz         │
│   will appear here"                          │
└─────────────────────────────────────────────┘
```
**Purpose:** Orient a first-time user with zero instructions (NFR Usability requirement).

### State B — Loading
```
┌─────────────────────────────────────────────┐
│                 [ ⟳ spinner ]                │
│           Generating your summary...          │
└─────────────────────────────────────────────┘
```
**Purpose:** Sets expectations during the 10–15s API call so the app never appears frozen.

### State C — Results
```
┌─────────────────────────────────────────────┐
│  SUMMARY                                     │
│  [3-5 sentence AI summary]                   │
├─────────────────────────────────────────────┤
│  KEY TAKEAWAYS                               │
│  • point 1   • point 2   • point 3...        │
├─────────────────────────────────────────────┤
│  QUIZ                                        │
│  Q1: [question]                              │
│  ○ A   ○ B   ○ C   ○ D                       │
│  ...                     [ Show Answers ]    │
└─────────────────────────────────────────────┘
```
**Purpose:** Delivers the entire value proposition in one view, no scrolling on desktop.

### State D — History Panel (slide-out)
```
┌───────────────────────┐
│ History        [Clear] │
├───────────────────────┤
│ "Water cycle chapter"  │
│ Aug 6, 2026      [🗑]  │
├───────────────────────┤
│ "Chapter 3 notes"      │
│ Aug 5, 2026      [🗑]  │
└───────────────────────┘
```
**Purpose:** Satisfies FR-8/9/10 (save, view, delete history) without a second page.

### State E — Error
```
┌─────────────────────────────────────────────┐
│  ⚠ Something went wrong generating your      │
│    summary. Please try again.                │
└─────────────────────────────────────────────┘
```
**Purpose:** Never leaves the user staring at a blank/broken screen (NFR Reliability requirement).

## 4. Mobile Layout (< 600px)

- History panel moves from a side panel to a stacked section below the main content.
- Padding reduced, font sizes unchanged (readability preserved).
- Tap targets minimum 44px height (accessibility requirement, addressed Day 7).

## 5. User Flow Diagram

Landing → Text entered (Generate enabled) → Loading → Results shown → Quiz attempted/answers revealed, with results also auto-saving into History at every successful generation. History can be opened from any state via the header toggle.

## 6. Navigation Map

There is no multi-page navigation. The only navigational element is the History panel toggle, which slides a panel in/out without changing the URL or page state — deliberately simple per the PRD's no-routing, no-accounts scope.
