import { API_STATUS_MAP, MATCH_STATUSES } from './constants.js';

/**
 * Maps cricketdata.org API match status string to our internal status enum.
 */
export function mapApiStatus(apiStatus) {
  if (!apiStatus) return MATCH_STATUSES.UPCOMING;
  if (API_STATUS_MAP[apiStatus]) return API_STATUS_MAP[apiStatus];
  if (apiStatus.toLowerCase().includes('won')) return MATCH_STATUSES.COMPLETED;
  return MATCH_STATUSES.UPCOMING;
}

/**
 * Maps cricketdata.org /currentMatches item to our match shape.
 * Does NOT write to Firestore — just transforms the API response.
 */
export function mapApiMatchToFirestore(apiMatch) {
  const teams = apiMatch.teams ?? [];
  const teamInfo = apiMatch.teamInfo ?? [];

  const findShortName = (full) =>
    teamInfo.find((t) => t.name === full)?.shortname ?? full;

  return {
    apiMatchId: apiMatch.id,
    team1: findShortName(teams[0] ?? ''),
    team2: findShortName(teams[1] ?? ''),
    team1Full: teams[0] ?? '',
    team2Full: teams[1] ?? '',
    venue: apiMatch.venue ?? '',
    startTime: apiMatch.dateTimeGMT ? new Date(apiMatch.dateTimeGMT) : null,
    status: mapApiStatus(apiMatch.status),
    isDLS: false,
    playing11Team1: [],
    playing11Team2: [],
    result: null,
    scoringTriggered: false,
    scoringTriggeredAt: null,
  };
}

/**
 * Maps a scorecard API response to our playerStats shape.
 * { playerName: { runs: number, wickets: number } }
 */
export function mapScorecardToPlayerStats(scorecard) {
  const stats = {};

  const batting = scorecard?.batting ?? [];
  for (const b of batting) {
    const name = b.batsman ?? b.batsmanName;
    if (!name) continue;
    stats[name] = { runs: b.r ?? 0, wickets: 0 };
  }

  const bowling = scorecard?.bowling ?? [];
  for (const b of bowling) {
    const name = b.bowler ?? b.bowlerName;
    if (!name) continue;
    if (stats[name]) {
      stats[name].wickets = b.w ?? 0;
    } else {
      stats[name] = { runs: 0, wickets: b.w ?? 0 };
    }
  }

  return stats;
}

/**
 * Extracts live score display string from currentMatches score array.
 */
export function mapApiLiveScore(apiMatch) {
  const scores = apiMatch.score ?? [];
  return scores.map((s) => ({
    inning: s.inning,
    runs: s.r ?? 0,
    wickets: s.w ?? 0,
    overs: s.o ?? 0,
  }));
}
