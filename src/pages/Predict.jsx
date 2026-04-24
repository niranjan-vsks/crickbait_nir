import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Save, CheckCircle } from 'lucide-react';
import { useMatch } from '../hooks/useMatch';
import { useLockState } from '../hooks/useLockState';
import { usePrediction } from '../hooks/usePrediction';
import { useToast } from '../components/ui/Toast';
import { POINTS, INNINGS_RANGE } from '../utils/constants';
import AppShell from '../components/layout/AppShell';
import WinnerSection from '../components/prediction/WinnerSection';
import POTMSection from '../components/prediction/POTMSection';
import InningsSection from '../components/prediction/InningsSection';
import PlayerMilestonesSection from '../components/prediction/PlayerMilestonesSection';
import CountdownTimer from '../components/ui/CountdownTimer';
import { Skeleton } from '../components/ui/Skeleton';

function computePotential(draft) {
  let pts = 0;
  if (draft.winner) pts += POINTS.WINNER_BASE;
  if (draft.potm?.trim()) pts += POINTS.POTM;
  if (draft.firstInningsScore != null) pts += POINTS.INNINGS_EXACT;
  pts += draft.playerPredictions.length * POINTS.PLAYER_RUNS;
  return pts;
}

export default function Predict() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { match, loading: matchLoading } = useMatch(matchId);
  const lock = useLockState(match);
  const { draft, updateDraft, loading: predLoading, saving, saved, error, savePrediction } =
    usePrediction(matchId);
  const { show } = useToast();

  async function handleSave() {
    if (!match) return;
    const err = await savePrediction(match);
    if (!err) show('Predictions saved!', 'success');
    else show('Failed to save. Try again.', 'error');
  }

  if (matchLoading || predLoading) return <PredictSkeleton />;
  if (!match) return <AppShell><div className="flex items-center justify-center h-64 text-[#e0c0b1]">Match not found.</div></AppShell>;

  const isCompletelyLocked = lock?.isAllLocked;
  const isWinnerOnlyLocked = lock?.isWinnerLocked && !lock?.isAllLocked;
  const startMs = match.startTime?.toMillis?.() ?? 0;
  const winnerLockMs = lock?.winnerLockTime?.getTime?.() ?? 0;

  return (
    <AppShell>
      <div className="max-w-lg mx-auto px-4 pt-4 pb-28 space-y-8">
        {/* Back + Header */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-[#1b1f2c] border border-[#313442] flex items-center justify-center text-[#e0c0b1] hover:text-[#dfe2f3] transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-center flex-1">
            {/* Lock countdown / locked banner */}
            {!isCompletelyLocked && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1b1f2c] rounded-full border border-[#313442] mb-2">
                <span className="w-2 h-2 rounded-full bg-[#4ae176] animate-pulse shrink-0" />
                {isWinnerOnlyLocked ? (
                  <span className="text-[12px] font-bold text-[#e0c0b1] uppercase tracking-wider">
                    Winner locked — {' '}
                    <CountdownTimer
                      targetTime={startMs - 5 * 60 * 1000}
                      className="text-[#ffc640]"
                    />{' '}
                    to full lock
                  </span>
                ) : (
                  <span className="text-[12px] font-bold text-[#e0c0b1] uppercase tracking-wider">
                    Locking in{' '}
                    <CountdownTimer
                      targetTime={winnerLockMs}
                      className="text-[#ffc640]"
                    />
                  </span>
                )}
              </div>
            )}
            {isCompletelyLocked && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#93000a]/20 rounded-full border border-[#ffb4ab]/20 mb-2">
                <Lock className="w-3 h-3 text-[#ffb4ab]" />
                <span className="text-[12px] font-bold text-[#ffb4ab] uppercase tracking-wider">
                  Predictions Locked
                </span>
              </div>
            )}
            <h1 className="text-2xl font-black text-[#dfe2f3] tracking-tight">
              {match.team1} vs {match.team2}
            </h1>
            <p className="font-mono text-xs text-[#e0c0b1] mt-1">
              Match {match.matchNumber} • {match.venue}
            </p>
          </div>
        </div>

        {/* Section A — Winner (locked at T-35min) */}
        <WinnerSection
          match={match}
          winner={draft.winner}
          onSelect={(team) => updateDraft({ winner: team })}
          locked={!!lock?.isWinnerLocked}
        />

        {/* Section B — POTM (locked at T-5min) */}
        <POTMSection
          potm={draft.potm}
          onChange={(v) => updateDraft({ potm: v })}
          locked={!!isCompletelyLocked}
        />

        {/* Section C — 1st Innings Score (locked at T-5min) */}
        <InningsSection
          score={draft.firstInningsScore ?? INNINGS_RANGE.MIN}
          onChange={(v) => updateDraft({ firstInningsScore: v })}
          locked={!!isCompletelyLocked}
        />

        {/* Section D — Player Milestones (locked at T-5min) */}
        <PlayerMilestonesSection
          players={draft.playerPredictions}
          onChange={(v) => updateDraft({ playerPredictions: v })}
          locked={!!isCompletelyLocked}
        />
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-[4.5rem] left-0 right-0 z-40 bg-[#313442]/90 backdrop-blur-xl border-t border-[#313442] p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#e0c0b1]">
              Total Potential
            </p>
            <p className="font-mono text-2xl font-extrabold text-[#f97316] leading-none">
              {computePotential(draft)} pts
            </p>
          </div>

          {isCompletelyLocked ? (
            <div className="flex items-center gap-2 text-[#e0c0b1] text-sm font-bold uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              Locked
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none sm:w-auto bg-[#f97316] text-[#582200] font-bold text-sm uppercase tracking-wider py-3 px-8 rounded-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ boxShadow: '0 0 15px rgba(249,115,22,0.3)' }}
            >
              {saving ? (
                'Saving...'
              ) : saved ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Predictions
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function PredictSkeleton() {
  return (
    <AppShell>
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    </AppShell>
  );
}
