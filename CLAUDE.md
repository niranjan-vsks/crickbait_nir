# CLAUDE.md — Crickbait
> IPL Prediction League PWA | React 19 + Vite + Tailwind + Firebase

---

## ⚡ START HERE — Design Source of Truth

All screen designs and their generated HTML/CSS code are in:
  src/designs/

Structure:
  src/designs/
    login_splash/         → screen.png + code.html
    profile_setup/        → screen.png + code.html
    matches_dashboard/    → screen.png + code.html
    prediction_form/      → screen.png + code.html
    live_prediction_feed/ → screen.png + code.html
    leaderboard/          → screen.png + code.html
    admin_panel/          → screen.png + code.html
    h2h_challenge/        → screen.png + code.html

Rules for using design files:
  1. Read screen.png visually first — understand layout, spacing, states
  2. Read code.html for exact CSS values: colors, font sizes, border-radius, shadows
  3. Extract design tokens — do NOT copy the HTML structure directly (it's not React)
  4. Every component must pixel-match its screen.png at 375px mobile width
  5. When in doubt about a value: check code.html, not memory

Design tokens are already extracted into tailwind.config.js in Phase 1.
After that, always use Tailwind classes — never inline styles.

---

## Subagent Strategy — When to Spawn, When Not To

### SPAWN subagents for these parallel workstreams:

Phase 1 (Foundation):
  Agent A: Project scaffold + Tailwind config + Firebase init + Router stubs
  Agent B: Write + unit test scoringEngine.js (all edge cases) simultaneously
  → These are 100% independent. Run in parallel.

Phase 4 (Predictions):
  Agent A: UI components (WinnerSection, POTMSection, InningsSection, PlayerPicker)
  Agent B: usePrediction hook + Firestore write logic + lock enforcement
  → Merge after both complete. Agent A depends on hook interface from Agent B.
  → Define the hook interface first, then spawn both.

Phase 7 (Admin):
  Agent A: Admin UI (forms, tables, toggles, system log)
  Agent B: Scoring trigger — scoringEngine integration + leaderboard rewrite
  → Scoring trigger is complex enough to keep isolated.

Phase 9 (PWA):
  Agent A: vite-plugin-pwa config + service worker + offline banner
  Agent B: FCM push notifications setup
  → Fully independent.

### DO NOT spawn subagents for:
  - Auth flow (linear, sequential, no parallelism)
  - Lock logic (single file, single responsibility)
  - API mapper (one integration, keep in one context)
  - Any phase where Agent B needs output from Agent A to start

### Subagent handoff protocol:
  Before spawning: define the exact interface (function signatures, Firestore paths)
  After merging: run integration check — do the pieces actually connect?
  Always: update CONTEXT.md after merge to reflect combined state

---

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- Before touching any component: re-read lockUtils.js and scoringEngine.js first
- If something goes sideways, STOP and re-plan — do not patch over bad foundations
- Write detailed specs to tasks/todo.md before writing a single line of code
- For Firebase writes: plan the exact document path + payload before coding

### 2. Self-Improvement Loop
- After ANY correction: update tasks/lessons.md immediately with the pattern
- Special lesson categories for this project:
  - LOCK_LOGIC: anything related to time-based prediction locking
  - SCORING: anything related to points calculation
  - FIRESTORE: schema violations, security rule gaps
  - API: cricketdata.org response mapping issues
  - DESIGN: pixel mismatch between component and screen.png
- Review lessons.md at the start of every new session

### 3. Verification Before Done
- Never mark a task complete without proving it works
- For scoring: run scoringEngine unit tests — all must pass before marking done
- For lock logic: manually test at T-36min, T-34min, T-6min, T-4min boundaries
- For UI: open screen.png side by side — do they match at 375px?
- For Firestore writes: verify in Firebase console schema matches CONTEXT.md
- Ask: "Would this break if the match were abandoned? DLS? DNB player?"

### 4. Demand Elegance
- Lock logic lives ONLY in lockUtils.js — if you find date math inline anywhere, refactor it
- Scoring logic lives ONLY in scoringEngine.js — no inline arithmetic in components
- API parsing lives ONLY in apiMapper.js — components never touch raw API responses
- Before presenting: "Is there a hardcoded value here? If yes, extract to constants.js"

### 5. Autonomous Bug Fixing
- When given a bug: diagnose via logs/Firestore console first, then fix
- Lock-related bugs: always check system clock vs Firestore timestamp conversion first
- Scoring bugs: always check edge case matrix in scoringEngine before assuming a bug
- Design bugs: always re-read the relevant screen.png before changing CSS

---

## Task Management

1. **Plan First** — Write plan to `tasks/todo.md` with checkable items per phase
2. **Verify Plan** — For Firestore schema changes or scoring logic changes,
   check in before implementing — these are hard to undo
3. **Track Progress** — Mark `[x]` as you go, one checkbox per component/hook/util
4. **Explain Changes** — After each phase, write a 3-line summary:
   what was built | what Firestore paths it touches | what edge cases are handled
5. **Document Results** — Add review section to tasks/todo.md after each phase
6. **Capture Lessons** — Update tasks/lessons.md after every correction

---

## Core Principles

- **Simplicity First** — Minimal code. If lockUtils.js solves it in 5 lines, don't write 20.
- **No Laziness** — Find root causes. No status === "completed" || status === "done" hacks.
- **Minimal Impact** — Only touch what's necessary.
  A bug in scoring must not require changes to the UI layer.

---

## Project-Specific Non-Negotiables

### The Zero Hardcode Rule