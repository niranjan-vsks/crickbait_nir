import { LOCK_OFFSETS, MATCH_STATUSES } from './constants.js';

/**
 * Derives full lock state from a match document.
 * Pure function — no Firestore reads, no side effects.
 * @param {object} match - Firestore match document with startTime (Firestore Timestamp)
 * @returns {object} lock state
 */
export function getMatchLockState(match) {
  const now = new Date();
  const start = match.startTime?.toDate ? match.startTime.toDate() : new Date(match.startTime);
  const winnerLockTime = new Date(start.getTime() - LOCK_OFFSETS.WINNER_MINS * 60 * 1000);
  const allLockTime    = new Date(start.getTime() - LOCK_OFFSETS.ALL_MINS    * 60 * 1000);

  const isCompleted = [
    MATCH_STATUSES.COMPLETED,
    MATCH_STATUSES.ABANDONED,
    MATCH_STATUSES.NO_RESULT,
    MATCH_STATUSES.DLS,
  ].includes(match.status);

  const isVoid = [
    MATCH_STATUSES.ABANDONED,
    MATCH_STATUSES.NO_RESULT,
  ].includes(match.status);

  return {
    isWinnerLocked:  now >= winnerLockTime || isCompleted,
    isAllLocked:     now >= allLockTime    || isCompleted,
    isMatchLive:     match.status === MATCH_STATUSES.LIVE,
    isCompleted,
    isVoid,
    isDLS:           match.status === MATCH_STATUSES.DLS,
    isPredictable:   !isVoid && !isCompleted,
    winnerLockTime,
    allLockTime,
    minutesToWinnerLock: Math.max(0, Math.floor((winnerLockTime - now) / 60000)),
    minutesToAllLock:    Math.max(0, Math.floor((allLockTime    - now) / 60000)),
  };
}
