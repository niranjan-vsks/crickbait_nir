import { describe, it, expect } from 'vitest';
import { computePoints } from './scoringEngine.js';

// Helpers
const makeMatch = (status = 'completed', team1 = 'MI', team2 = 'CSK') => ({
  status, team1, team2,
});

const makeResult = (overrides = {}) => ({
  winner: 'MI',
  potm: 'Rohit Sharma',
  firstInningsScore: 180,
  playerStats: {
    'Rohit Sharma':   { runs: 85, wickets: 0 },
    'Jasprit Bumrah': { runs: 2,  wickets: 3 },
  },
  ...overrides,
});

const makePrediction = (overrides = {}) => ({
  winner: 'MI',
  potm: 'Rohit Sharma',
  firstInningsScore: 180,
  playerPredictions: [],
  ...overrides,
});

describe('computePoints', () => {
  it('returns null when result is null', () => {
    expect(computePoints(makePrediction(), null, null, makeMatch())).toBeNull();
  });

  it('awards 10pts for correct winner — no fav team', () => {
    const bp = computePoints(makePrediction(), makeResult(), null, makeMatch());
    expect(bp.winner).toBe(10);
    expect(bp.loyaltyTax).toBe(0);
    expect(bp.courageBonus).toBe(0);
  });

  it('loyalty tax: 8pts when user picks their fav team and wins', () => {
    const bp = computePoints(makePrediction({ winner: 'MI' }), makeResult({ winner: 'MI' }), 'MI', makeMatch());
    expect(bp.winner).toBe(10);
    expect(bp.loyaltyTax).toBe(-2);
    expect(bp.courageBonus).toBe(0);
    expect(bp.total).toBe(10 + (-2) + 15 + 20); // winner + tax + potm + innings
  });

  it('courage bonus: 14pts when user picks against their fav team', () => {
    const bp = computePoints(makePrediction({ winner: 'CSK' }), makeResult({ winner: 'CSK' }), 'MI', makeMatch('completed', 'MI', 'CSK'));
    expect(bp.winner).toBe(10);
    expect(bp.loyaltyTax).toBe(0);
    expect(bp.courageBonus).toBe(4);
  });

  it('no loyalty/courage bonus when fav team not playing', () => {
    const bp = computePoints(makePrediction(), makeResult(), 'RCB', makeMatch('completed', 'MI', 'CSK'));
    expect(bp.loyaltyTax).toBe(0);
    expect(bp.courageBonus).toBe(0);
  });

  it('awards 0 for wrong winner', () => {
    const bp = computePoints(makePrediction({ winner: 'CSK' }), makeResult({ winner: 'MI' }), null, makeMatch());
    expect(bp.winner).toBe(0);
  });

  it('awards 15pts for correct POTM', () => {
    const bp = computePoints(makePrediction(), makeResult(), null, makeMatch());
    expect(bp.potm).toBe(15);
  });

  it('awards 0 for wrong POTM', () => {
    const bp = computePoints(makePrediction({ potm: 'Bumrah' }), makeResult(), null, makeMatch());
    expect(bp.potm).toBe(0);
  });

  it('POTM is case-insensitive', () => {
    const bp = computePoints(
      makePrediction({ potm: 'rohit sharma' }),
      makeResult({ potm: 'Rohit Sharma' }),
      null,
      makeMatch()
    );
    expect(bp.potm).toBe(15);
  });

  it('innings: 20pts for exact score', () => {
    const bp = computePoints(makePrediction({ firstInningsScore: 180 }), makeResult({ firstInningsScore: 180 }), null, makeMatch());
    expect(bp.innings).toBe(20);
  });

  it('innings: 10pts for ±5 (diff = 3)', () => {
    const bp = computePoints(makePrediction({ firstInningsScore: 183 }), makeResult({ firstInningsScore: 180 }), null, makeMatch());
    expect(bp.innings).toBe(10);
  });

  it('innings: 10pts for ±5 boundary (diff = 5)', () => {
    const bp = computePoints(makePrediction({ firstInningsScore: 185 }), makeResult({ firstInningsScore: 180 }), null, makeMatch());
    expect(bp.innings).toBe(10);
  });

  it('innings: 5pts for ±10 (diff = 8)', () => {
    const bp = computePoints(makePrediction({ firstInningsScore: 188 }), makeResult({ firstInningsScore: 180 }), null, makeMatch());
    expect(bp.innings).toBe(5);
  });

  it('innings: 5pts for ±10 boundary (diff = 10)', () => {
    const bp = computePoints(makePrediction({ firstInningsScore: 190 }), makeResult({ firstInningsScore: 180 }), null, makeMatch());
    expect(bp.innings).toBe(5);
  });

  it('innings: 0pts when diff > 10', () => {
    const bp = computePoints(makePrediction({ firstInningsScore: 200 }), makeResult({ firstInningsScore: 180 }), null, makeMatch());
    expect(bp.innings).toBe(0);
  });

  it('player runs: 10pts when within ±5', () => {
    const bp = computePoints(
      makePrediction({ playerPredictions: [{ playerName: 'Rohit Sharma', predictedRuns: 83, predictedWickets: null }] }),
      makeResult(),
      null,
      makeMatch()
    );
    expect(bp.players[0]).toBe(10);
  });

  it('player runs: 0pts when outside ±5', () => {
    const bp = computePoints(
      makePrediction({ playerPredictions: [{ playerName: 'Rohit Sharma', predictedRuns: 70, predictedWickets: null }] }),
      makeResult(),
      null,
      makeMatch()
    );
    expect(bp.players[0]).toBe(0);
  });

  it('player wickets: 10pts for exact match', () => {
    const bp = computePoints(
      makePrediction({ playerPredictions: [{ playerName: 'Jasprit Bumrah', predictedRuns: null, predictedWickets: 3 }] }),
      makeResult(),
      null,
      makeMatch()
    );
    expect(bp.players[0]).toBe(10);
  });

  it('player wickets: 0pts for wrong count', () => {
    const bp = computePoints(
      makePrediction({ playerPredictions: [{ playerName: 'Jasprit Bumrah', predictedRuns: null, predictedWickets: 2 }] }),
      makeResult(),
      null,
      makeMatch()
    );
    expect(bp.players[0]).toBe(0);
  });

  it('player DNB (not in playerStats): 0pts, not an error', () => {
    const bp = computePoints(
      makePrediction({ playerPredictions: [{ playerName: 'Unknown Player', predictedRuns: 50, predictedWickets: null }] }),
      makeResult(),
      null,
      makeMatch()
    );
    expect(bp.players[0]).toBe(0);
  });

  it('DLS match: only winner + POTM count', () => {
    const dlsMatch = makeMatch('dls');
    const bp = computePoints(makePrediction(), makeResult(), null, dlsMatch);
    expect(bp.winner).toBe(10);
    expect(bp.potm).toBe(15);
    expect(bp.innings).toBe(0);
    expect(bp.players).toHaveLength(0);
  });

  it('abandoned match: all 0pts, voided = true', () => {
    const bp = computePoints(makePrediction(), makeResult(), null, makeMatch('abandoned'));
    expect(bp.voided).toBe(true);
    expect(bp.total).toBe(0);
  });

  it('no_result match: all 0pts, voided = true', () => {
    const bp = computePoints(makePrediction(), makeResult(), null, makeMatch('no_result'));
    expect(bp.voided).toBe(true);
    expect(bp.total).toBe(0);
  });

  it('total is never negative', () => {
    // Only loyalty tax applied (wrong potm, wrong innings, correct winner with tax)
    const bp = computePoints(
      makePrediction({ potm: 'Wrong Player', firstInningsScore: 220, playerPredictions: [] }),
      makeResult(),
      'MI',
      makeMatch()
    );
    // winner 10 - tax 2 = 8, potm 0, innings 0 → 8
    expect(bp.total).toBeGreaterThanOrEqual(0);
  });

  it('player with both runs and wickets correct: 20pts', () => {
    const bp = computePoints(
      makePrediction({
        playerPredictions: [{
          playerName: 'Jasprit Bumrah',
          predictedRuns: 2,
          predictedWickets: 3,
        }],
      }),
      makeResult(),
      null,
      makeMatch()
    );
    expect(bp.players[0]).toBe(20);
  });

  it('full correct prediction (no fav team) scores correctly', () => {
    const bp = computePoints(makePrediction(), makeResult(), null, makeMatch());
    expect(bp.winner).toBe(10);
    expect(bp.potm).toBe(15);
    expect(bp.innings).toBe(20);
    expect(bp.total).toBe(45);
  });
});
