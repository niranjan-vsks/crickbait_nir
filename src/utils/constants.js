export const POINTS = {
  WINNER_BASE: 10,
  LOYALTY_TAX: -2,
  COURAGE_BONUS: 4,
  POTM: 15,
  INNINGS_EXACT: 20,
  INNINGS_CLOSE: 10,
  INNINGS_FAR: 5,
  PLAYER_RUNS: 10,
  PLAYER_WICKETS: 10,
};

export const MARGINS = {
  INNINGS_CLOSE: 5,
  INNINGS_FAR: 10,
  PLAYER_RUNS: 5,
  PLAYER_WICKETS: 0,
};

export const LOCK_OFFSETS = {
  WINNER_MINS: 35,
  ALL_MINS: 5,
};

export const INNINGS_RANGE = { MIN: 140, MAX: 220 };
export const MAX_PLAYER_PREDICTIONS = 3;

export const IPL_TEAMS = [
  'MI', 'CSK', 'RCB', 'KKR', 'DC',
  'PBKS', 'RR', 'SRH', 'GT', 'LSG',
];

export const MATCH_STATUSES = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
  DLS: 'dls',
  NO_RESULT: 'no_result',
};

export const API_STATUS_MAP = {
  'Match not started': 'upcoming',
  'In Progress': 'live',
  'No Result': 'no_result',
  'Abandoned': 'abandoned',
};
