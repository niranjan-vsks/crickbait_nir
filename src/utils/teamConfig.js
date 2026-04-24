export const TEAM_CONFIG = {
  MI:   { full: 'Mumbai Indians',              color: '#004BA0' },
  CSK:  { full: 'Chennai Super Kings',         color: '#F9CD05' },
  RCB:  { full: 'Royal Challengers Bengaluru', color: '#EC1C24' },
  KKR:  { full: 'Kolkata Knight Riders',       color: '#3A225D' },
  DC:   { full: 'Delhi Capitals',              color: '#0078BC' },
  PBKS: { full: 'Punjab Kings',                color: '#ED1F27' },
  RR:   { full: 'Rajasthan Royals',            color: '#254AA5' },
  SRH:  { full: 'Sunrisers Hyderabad',         color: '#F7A721' },
  GT:   { full: 'Gujarat Titans',              color: '#1C4B9B' },
  LSG:  { full: 'Lucknow Super Giants',        color: '#A4CFEF' },
};

export function getTeamColor(teamCode) {
  return TEAM_CONFIG[teamCode]?.color ?? '#6B7280';
}

export function getTeamFullName(teamCode) {
  return TEAM_CONFIG[teamCode]?.full ?? teamCode;
}
