import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Timer } from 'lucide-react';
import { useLockState } from '../../hooks/useLockState';
import { getTeamColor } from '../../utils/teamConfig';
import WinProbBar from './WinProbBar';
import CountdownTimer from '../ui/CountdownTimer';

function TeamLogo({ team, size = 'sm' }) {
  const color = getTeamColor(team);
  return (
    <div
      className={`rounded-full bg-[#262a37] flex items-center justify-center font-bold ${
        size === 'lg' ? 'w-16 h-16 border-2 text-sm' : 'w-10 h-10 border text-xs'
      }`}
      style={{ borderColor: color, color }}
    >
      {team}
    </div>
  );
}

function Divider() {
  return (
    <div
      className="my-1 h-px"
      style={{
        backgroundImage:
          'linear-gradient(to right, transparent, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.2) 80%, transparent)',
      }}
    />
  );
}

export default function MatchCard({ match, predCount = 0, totalPreds = 5 }) {
  const navigate = useNavigate();
  const lock = useLockState(match);
  const startMs = match.startTime?.toMillis?.() ?? 0;

  const isLive = lock.isMatchLive;
  const isCompleted = lock.isCompleted;
  const isVoid = lock.isVoid;
  const isLocked = lock.isAllLocked || lock.isWinnerLocked;
  const isOpen = !isLive && !isCompleted && !isVoid && !isLocked;

  function handleNavigate() {
    navigate(`/predict/${match.id}`);
  }

  return (
    <article
      className={`bg-[#171b28] border border-[#313442] rounded-xl overflow-hidden shadow-xl shadow-black/40 relative${
        isLocked && !isLive ? ' opacity-80' : ''
      }`}
    >
      {isLive && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#f97316]/10 to-transparent pointer-events-none" />
      )}

      <div className="p-4 relative z-10 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#e0c0b1]">
              Match {match.matchNumber}
            </span>
            <span className="text-[#e0c0b1]/50 text-xs">•</span>
            <span className="text-sm text-[#e0c0b1] truncate max-w-[140px]">{match.venue}</span>
          </div>

          {isLive && (
            <div
              className="flex items-center gap-1 bg-[#4ae176]/10 text-[#4ae176] px-2 py-1 rounded-sm border border-[#4ae176]/20 shrink-0"
              style={{ boxShadow: '0 0 15px rgba(74,225,118,0.3)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#4ae176] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">LIVE</span>
            </div>
          )}

          {!isLive && isLocked && !isCompleted && !isVoid && (
            <div className="flex items-center gap-1 text-[#ffb4ab] bg-[#93000a]/20 px-2 py-0.5 rounded-sm border border-[#ffb4ab]/20 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest">LOCKED</span>
              <Lock className="w-3 h-3" />
            </div>
          )}

          {isOpen && startMs > 0 && (
            <div className="flex items-center gap-1 text-[#ffc640] shrink-0">
              <Timer className="w-3.5 h-3.5" />
              <CountdownTimer
                targetTime={startMs}
                className="font-mono text-sm font-bold text-[#ffc640]"
              />
            </div>
          )}

          {(isCompleted || isVoid) && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] bg-[#171b28] px-2 py-1 rounded-sm border border-[#313442] shrink-0">
              {isVoid ? 'VOID' : lock.isDLS ? 'DLS' : 'COMPLETED'}
            </span>
          )}
        </div>

        {/* Teams — hero layout for live, compact for others */}
        {isLive ? (
          <div className="flex items-center justify-between py-2">
            <div className="flex flex-col items-center gap-2 flex-1">
              <TeamLogo team={match.team1} size="lg" />
              <span className="text-[20px] font-bold text-[#dfe2f3]">{match.team1}</span>
              <div className="font-mono text-[32px] font-extrabold text-[#dfe2f3] mt-1 leading-none">
                {match.score1 || '—'}
              </div>
              {match.overs1 && (
                <div className="font-mono text-xs font-bold text-[#e0c0b1]">
                  {match.overs1} Ov
                </div>
              )}
            </div>
            <div className="flex flex-col items-center justify-center px-4 shrink-0">
              <span className="text-2xl font-black italic text-[#dfe2f3]/30">VS</span>
              {match.target && (
                <span className="font-mono text-sm font-bold text-[#ffb690] mt-2">
                  Target: {match.target}
                </span>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <TeamLogo team={match.team2} size="lg" />
              <span className="text-[20px] font-bold text-[#dfe2f3]">{match.team2}</span>
              <div className="font-mono text-[32px] font-extrabold text-[#dfe2f3]/50 mt-1 leading-none">
                {match.score2 || '—'}
              </div>
              {match.overs2 && (
                <div className="font-mono text-xs font-bold text-[#e0c0b1]">
                  {match.overs2} Ov
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3 flex-1">
              <TeamLogo team={match.team1} size="sm" />
              <span className="text-base font-bold text-[#dfe2f3]">{match.team1}</span>
            </div>
            <span className="font-mono font-bold text-[#dfe2f3]/30 text-xs px-2">VS</span>
            <div className="flex items-center gap-3 flex-1 justify-end">
              <span className="text-base font-bold text-[#dfe2f3]">{match.team2}</span>
              <TeamLogo team={match.team2} size="sm" />
            </div>
          </div>
        )}

        <Divider />

        {/* Footer varies by state */}
        {isLive && (
          <div className="flex items-center gap-4 bg-[#1b1f2c] p-3 rounded-lg border border-white/5">
            <div className="flex-1 min-w-0">
              <WinProbBar
                team1={match.team1}
                team2={match.team2}
                team1Pct={match.winProbTeam1 ?? 50}
              />
            </div>
            <button
              onClick={handleNavigate}
              className="shrink-0 bg-[#f97316] text-[#582200] font-bold text-[11px] px-4 py-2 rounded-lg flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all uppercase"
              style={{ boxShadow: '0 0 15px rgba(249,115,22,0.4)' }}
            >
              IN-PLAY PREDICT
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isOpen && (
          <div className="flex justify-between items-center bg-[#1b1f2c]/50 p-2 rounded-lg border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-[#f97316] flex items-center justify-center text-[#f97316] text-[10px] font-bold shrink-0">
                {predCount}/{totalPreds}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#e0c0b1]">
                PREDICTIONS MADE
              </span>
            </div>
            <button
              onClick={handleNavigate}
              className="text-[#ffb690] font-bold text-[12px] flex items-center gap-1 hover:text-[#f97316] transition-colors shrink-0"
            >
              PREDICT <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isLocked && !isLive && !isCompleted && !isVoid && (
          <div className="flex justify-between items-center bg-[#1b1f2c]/30 p-2 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-6 h-6 rounded-full border border-[#e0c0b1] flex items-center justify-center text-[#e0c0b1] text-[10px] font-bold shrink-0">
                {predCount}/{totalPreds}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#e0c0b1]">
                PREDICTIONS LOCKED
              </span>
            </div>
            <button
              onClick={handleNavigate}
              className="text-[#e0c0b1] font-bold text-[12px] flex items-center gap-1 opacity-50 cursor-not-allowed shrink-0"
            >
              VIEW <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isCompleted && (
          <div className="flex justify-between items-center bg-[#1b1f2c]/30 p-2 rounded-lg border border-white/5">
            <span className="text-[11px] text-[#dfe2f3]/70 font-medium flex-1 mr-4 truncate">
              {match.result || 'Result unavailable'}
            </span>
            <button
              onClick={handleNavigate}
              className="shrink-0 text-[#e0c0b1] font-bold text-[12px] flex items-center gap-1 hover:text-[#ffb690] transition-colors"
            >
              VIEW <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isVoid && (
          <div className="flex items-center justify-center p-2">
            <span className="text-[11px] text-[#6B7280]">Match abandoned — no result</span>
          </div>
        )}
      </div>
    </article>
  );
}
