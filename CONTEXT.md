# Crickbait Context

## Stack
React 19 + Vite + Tailwind CSS + Firebase (Auth + Firestore + Hosting)
No backend server — Firebase is the realtime database.

## Design Files Location
src/designs/stitch_crickbait_ipl_prediction_league/
  login_splash_1/ login_splash_2/           → Login screen variants
  profile_setup_1/ profile_setup_2/         → Profile setup variants
  matches_dashboard_1/ _2/ _3/              → Home screen variants
  prediction_form_1/ prediction_form_2/     → Predict screen variants
  live_prediction_feed_1/ _2/               → Live feed variants
  leaderboard_1/ _2/ _3/                   → Leaderboard variants
  admin_panel_1/ _2/ _3/                   → Admin panel variants
  h2h_challenge/                            → H2H screen
  stadium_pulse/                            → Background texture reference

Each folder: screen.png (visual reference) + code.html (exact CSS values)
Rule: Read screen.png first, extract CSS from code.html, build to pixel-match at 375px.

## Environment
.env exists with all required keys. Never hardcode — always import.meta.env.VITE_*
Required: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID,
VITE_FIREBASE_APP_ID, VITE_CRICKET_API_KEY

## Critical Utility Files (single source of truth)
- src/utils/lockUtils.js     — ALL lock/time logic lives here only
- src/utils/scoringEngine.js — ALL points calculation lives here only
- src/utils/apiMapper.js     — ALL cricketdata.org API parsing lives here only
- src/utils/constants.js     — ALL magic numbers live here only
- src/utils/teamConfig.js    — ALL team metadata lives here only

## Firestore Collections
- users/{uid}
- matches/{matchId}
- predictions/{matchId}/userPredictions/{uid}
- reactions/{matchId}/predictionReactions/{uid}
- h2h/{challengeId}
- leaderboard/season
- config/app

## Lock Logic (T = match startTime stored in Firestore)
Winner lock: T - 35 minutes
All lock:    T - 5 minutes
These are ALWAYS computed from match.startTime — never hardcoded.

## Scoring Points Reference
Winner correct: 10pts | Loyalty tax: -2pts | Courage bonus: +4pts
POTM correct: 15pts
Innings exact: 20pts | ±5 runs: 10pts | ±10 runs: 5pts
Player runs (±5 margin): 10pts | Player wickets (exact): 10pts
DLS match: only winner + POTM count
Abandoned/No Result: all 0pts, no penalty

## Completed Phases
[ ] Phase 1 — Foundation (scaffold + utilities)
[ ] Phase 2 — Auth + Profile
[ ] Phase 3 — Match Dashboard + Shell
[ ] Phase 4 — Prediction Form
[ ] Phase 5 — Live Feed
[ ] Phase 6 — Leaderboard
[ ] Phase 7 — Admin Panel
[ ] Phase 8 — H2H Challenge
[ ] Phase 9 — PWA + Deploy

## Active Edge Cases Handled
(populated during build)
