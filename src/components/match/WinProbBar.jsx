import { getTeamColor } from '../../utils/teamConfig';

export default function WinProbBar({ team1, team2, team1Pct = 50 }) {
  const team2Pct = 100 - team1Pct;
  const color1 = getTeamColor(team1);
  const color2 = getTeamColor(team2);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-text-secondary">
        <span className="font-mono">{team1} {team1Pct}%</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">WIN PROBABILITY</span>
        <span className="font-mono">{team2Pct}% {team2}</span>
      </div>
      <div className="h-1.5 bg-[#313442] rounded-full overflow-hidden flex">
        <div
          className="h-full transition-all duration-1000"
          style={{ width: `${team1Pct}%`, backgroundColor: color1 }}
        />
        <div
          className="h-full transition-all duration-1000"
          style={{ width: `${team2Pct}%`, backgroundColor: color2 }}
        />
      </div>
    </div>
  );
}
