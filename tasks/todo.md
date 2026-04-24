# Crickbait — Build Checklist

## PHASE 0 — Setup
- [x] CONTEXT.md created
- [x] tasks/todo.md created
- [x] tasks/lessons.md created

## PHASE 1 — Foundation ✅
### Agent A: Scaffold
- [x] package.json (Vite + React + Tailwind + Firebase + deps)
- [x] vite.config.js
- [x] tailwind.config.js (all design tokens)
- [x] postcss.config.js
- [x] index.html (Inter font, dark bg, viewport meta)
- [x] src/main.jsx
- [x] src/App.jsx (React Router, all routes as stubs)
- [x] src/firebase.js (init app, auth, db, messaging, offline persistence)
- [x] All page stubs: Login, ProfileSetup, Home, Predict, Live, Leaderboard, Profile, H2H, Admin, NotFound
- [x] Route guards: ProtectedRoute, AdminRoute, ProfileGate
- [x] .gitignore
- [x] .env.example
- [x] firebase.json
- [x] .firebaserc
- [x] firestore.rules
- [x] firestore.indexes.json
- [x] npm install

### Agent B: Utilities (parallel with Agent A)
- [x] src/utils/constants.js
- [x] src/utils/teamConfig.js
- [x] src/utils/lockUtils.js
- [x] src/utils/scoringEngine.js
- [x] src/utils/apiMapper.js
- [x] src/utils/dateUtils.js
- [x] src/utils/logger.js
- [x] src/utils/scoringEngine.test.js

### Phase 1 Quality Gate
- [x] npm run test — 26/26 passed
- [x] npm run build — 0 errors, 54 modules, 233kB JS
- [x] git commit: "feat: phase 1 complete — scaffold + utilities + tests"

## PHASE 2 — Auth + Profile ✅
- [x] useAuth.js hook (re-export from AuthContext)
- [x] AuthProvider wrapping App (src/context/AuthContext.jsx)
- [x] Login.jsx — pixel-match login_splash design, Google sign-in
- [x] ProfileSetup.jsx — pixel-match profile_setup design, team picker
- [x] ProfileGate.jsx — redirects if !profileComplete
- [x] ProtectedRoute.jsx — redirects to /login if not authed
- [x] Firestore user doc creation on ProfileSetup submit (setDoc create)
- [x] Build: 75 modules, 0 errors
- [x] git commit: "feat: phase 2 complete — auth + profile"

## PHASE 3 — Match Dashboard + Shell
- [ ] AppShell.jsx (bottom nav + top bar)
- [ ] BottomNav.jsx
- [ ] TopBar.jsx (avatar + points pill + logo + bell)
- [ ] useMatches.js (onSnapshot, sorted)
- [ ] useLockState.js (60s interval)
- [ ] CountdownTimer.jsx
- [ ] MatchCard.jsx (all 6 states)
- [ ] MatchStatus.jsx
- [ ] WinProbBar.jsx
- [ ] Home.jsx (3 tabs, real-time)
- [ ] UI components: EmptyState, Skeleton, Toast, Avatar
- [ ] Test: all MatchCard states at 375px
- [ ] git commit: "feat: phase 3 complete — dashboard + shell"

## PHASE 4 — Prediction Form
- [ ] Define hook interface (savePrediction signature)
- [ ] Agent A: WinnerSection, POTMSection, InningsSection, PlayerMilestone, PlayerPicker, LockCountdown, Predict.jsx
- [ ] Agent B: usePrediction.js, Firestore write + lock validation, auto-save, Toast
- [ ] Integration test: full prediction submission
- [ ] git commit: "feat: phase 4 complete — prediction form"

## PHASE 5 — Live Feed
- [ ] useLiveScore.js (API poll, rate-limit safe, 5min)
- [ ] LiveScoreHeader.jsx
- [ ] PredictionCard.jsx (2×2 grid)
- [ ] EmojiReactions.jsx (🔥👀💀)
- [ ] Pre-lock vs post-lock visibility
- [ ] Filter pills (All | Winner | POTM | Scores | Players)
- [ ] Live.jsx
- [ ] Test: visibility before/after lock
- [ ] git commit: "feat: phase 5 complete — live feed"

## PHASE 6 — Leaderboard
- [ ] useLeaderboard.js (onSnapshot)
- [ ] PodiumTop3.jsx
- [ ] LeaderboardRow.jsx (rank change)
- [ ] CategoryStats.jsx
- [ ] Leaderboard.jsx (3 tabs, dynamic year, "You" row pinned)
- [ ] Test: current user always visible
- [ ] git commit: "feat: phase 6 complete — leaderboard"

## PHASE 7 — Admin Panel
- [ ] AdminRoute.jsx
- [ ] Admin.jsx (5 tabs: DASH|MATCH|USERS|SCORING|SET)
- [ ] CreateMatchForm.jsx (manual + API fetch)
- [ ] ResultEntryForm.jsx (winner + POTM + DLS/abandoned)
- [ ] FixtureTable.jsx
- [ ] UserRoleTable.jsx
- [ ] SyncAPIButton.jsx
- [ ] SystemLog.jsx
- [ ] useAdmin.js
- [ ] Scoring trigger subagent: full batch write flow
- [ ] H2H resolution on scoring
- [ ] Test: scoring flow end to end
- [ ] git commit: "feat: phase 7 complete — admin panel"

## PHASE 8 — H2H Challenge
- [ ] useH2H.js
- [ ] ChallengeCard.jsx
- [ ] RivalryInsight.jsx
- [ ] FrequentRivals.jsx
- [ ] H2H.jsx (search + create + active + insight)
- [ ] Challenge creation with stake validation
- [ ] Accept/decline flow
- [ ] Hook into Phase 7 scoring trigger
- [ ] git commit: "feat: phase 8 complete — h2h"

## PHASE 9 — PWA + Polish + Deploy
- [ ] Agent A: vite-plugin-pwa full config + service worker + offline banner
- [ ] Agent B: useNotifications.js + FCM + Toast handler
- [ ] NotFound.jsx (404, cricket themed)
- [ ] Error boundaries on all pages
- [ ] Loading skeletons on all data-fetched screens
- [ ] Profile.jsx (stats, history, accuracy per category)
- [ ] Deploy firestore rules: firebase deploy --only firestore:rules
- [ ] npm run build — zero errors
- [ ] Lighthouse PWA score > 90
- [ ] firebase deploy
- [ ] git commit: "feat: phase 9 complete — pwa deployed"
