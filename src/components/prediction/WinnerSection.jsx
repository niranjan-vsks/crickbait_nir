import { CheckCircle, Trophy } from 'lucide-react';
import { getTeamColor } from '../../utils/teamConfig';
import { POINTS } from '../../utils/constants';

export default function WinnerSection({ match, winner, onSelect, locked }) {
  const teams = [match.team1, match.team2];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-[#dfe2f3] flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#f97316]" />
          Match Winner
        </h2>
        <span className="font-mono text-sm font-bold text-[#f97316]">+{POINTS.WINNER_BASE} pts</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {teams.map((team) => {
          const isSelected = winner === team;
          const color = getTeamColor(team);
          return (
            <button
              key={team}
              onClick={() => !locked && onSelect(team)}
              disabled={locked}
              className={`relative rounded-xl p-6 text-center transition-all ${
                isSelected
                  ? 'bg-[#1b1f2c] border-2 border-[#f97316]'
                  : 'bg-[#171b28] border border-[#313442] hover:bg-[#1b1f2c]'
              } ${locked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              style={isSelected ? { boxShadow: '0 0 15px rgba(249,115,22,0.15)' } : {}}
            >
              {/* team color accent bar */}
              <div
                className="absolute inset-x-0 top-0 h-1 rounded-t-xl opacity-60"
                style={{ background: `linear-gradient(to right, ${color}, ${color}cc)` }}
              />

              {/* team logo placeholder */}
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#262a37] border-2 flex items-center justify-center font-bold text-lg"
                style={{ borderColor: color, color }}
              >
                {team}
              </div>

              <h3 className="text-[20px] font-bold text-[#dfe2f3] mb-2">{team}</h3>

              {isSelected ? (
                <div className="text-[#f97316] flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Selected
                </div>
              ) : (
                <div className="text-[12px] font-bold uppercase tracking-wider text-[#e0c0b1]">
                  Select
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
