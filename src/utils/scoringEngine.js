import { POINTS, MARGINS, MATCH_STATUSES } from './constants.js';

/**
 * Computes full points breakdown for a prediction against a result.
 * Pure function — no Firestore reads, no side effects.
 * @param {object} prediction  - userPrediction Firestore doc
 * @param {object} result      - match.result object
 * @param {string} userFavTeam - user's favourite team code (may be null)
 * @param {object} match       - match Firestore doc (for status + teams)
 * @returns {object|null} breakdown, or null if result not available
 */
export function computePoints(prediction, result, userFavTeam, match) {
  if (!result) return null;

  const matchStatus = match.status;
  const isVoid = [MATCH_STATUSES.ABANDONED, MATCH_STATUSES.NO_RESULT].includes(matchStatus);
  const isDLS  = matchStatus === MATCH_STATUSES.DLS;

  const breakdown = {
    winner: 0,
    potm: 0,
    innings: 0,
    players: [],
    loyaltyTax: 0,
    courageBonus: 0,
    total: 0,
    voided: false,
  };

  if (isVoid) {
    return { ...breakdown, voided: true };
  }

  // WINNER
  if (prediction.winner && result.winner) {
    const isCorrect = prediction.winner === result.winner;
    const favTeamPlaying =
      userFavTeam && (match.team1 === userFavTeam || match.team2 === userFavTeam);
    const pickedFav = prediction.winner === userFavTeam;

    if (isCorrect) {
      breakdown.winner = POINTS.WINNER_BASE;
      if (favTeamPlaying && pickedFav) {
        breakdown.loyaltyTax = POINTS.LOYALTY_TAX;
      } else if (favTeamPlaying && !pickedFav) {
        breakdown.courageBonus = POINTS.COURAGE_BONUS;
      }
    }
  }

  // POTM — counts in DLS too
  if (prediction.potm && result.potm) {
    if (prediction.potm.toLowerCase() === result.potm.toLowerCase()) {
      breakdown.potm = POINTS.POTM;
    }
  }

  // FIRST INNINGS SCORE — void in DLS
  if (!isDLS && prediction.firstInningsScore != null && result.firstInningsScore != null) {
    const diff = Math.abs(prediction.firstInningsScore - result.firstInningsScore);
    if      (diff === 0)                    breakdown.innings = POINTS.INNINGS_EXACT;
    else if (diff <= MARGINS.INNINGS_CLOSE) breakdown.innings = POINTS.INNINGS_CLOSE;
    else if (diff <= MARGINS.INNINGS_FAR)   breakdown.innings = POINTS.INNINGS_FAR;
  }

  // PLAYER PREDICTIONS — void in DLS
  if (!isDLS && Array.isArray(prediction.playerPredictions)) {
    for (const pp of prediction.playerPredictions) {
      const actual = result.playerStats?.[pp.playerName];
      let pts = 0;

      if (actual) {
        if (pp.predictedRuns != null && actual.runs != null) {
          if (Math.abs(pp.predictedRuns - actual.runs) <= MARGINS.PLAYER_RUNS) {
            pts += POINTS.PLAYER_RUNS;
          }
        }
        if (pp.predictedWickets != null && actual.wickets != null) {
          if (pp.predictedWickets === actual.wickets) {
            pts += POINTS.PLAYER_WICKETS;
          }
        }
      }
      // DNB (not in playerStats) → 0 pts, which is already the default
      breakdown.players.push(pts);
    }
  }

  // TOTAL — never negative
  breakdown.total = Math.max(
    0,
    breakdown.winner +
    breakdown.loyaltyTax +
    breakdown.courageBonus +
    breakdown.potm +
    breakdown.innings +
    breakdown.players.reduce((a, b) => a + b, 0)
  );

  return breakdown;
}
