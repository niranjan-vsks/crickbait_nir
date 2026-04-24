import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Radio, TrendingUp, Pin, Users } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import WinProbBar from '../components/match/WinProbBar';
import { useMatches } from '../hooks/useMatches';
import { useAuth } from '../hooks/useAuth';
import { useLiveFeed } from '../hooks/useLiveFeed';

function LiveScoreTicker({ match, onPredict }) {
  const hasTarget = !!match.target;

  return (
    <div className="bg-[#1b1f2c] rounded-xl p-4 border border-[#313442] mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ae176] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ae176]" />
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#4ae176]">Live Now</span>
        </div>
        <span className="text-xs text-[#6B7280]">
          Match #{match.matchNumber} · {match.venue}
        </span>
      </div>

      <p className="text-xs font-semibold text-[#dfe2f3] mb-3 text-center">
        {match.team1} vs {match.team2}
      </p>

      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col items-start">
          <span className="text-2xl font-black font-mono text-[#dfe2f3]">
            {match.score1 || '—'}
          </span>
          {match.overs1 && (
            <span className="text-[10px] text-[#6B7280]">{match.overs1} ov</span>
          )}
          <span className="text-xs font-bold text-[#e0c0b1] mt-0.5">{match.team1}</span>
        </div>

        {hasTarget && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-[#6B7280]">Target</span>
            <span className="text-lg font-black font-mono text-[#ffc640]">{match.target}</span>
          </div>
        )}

        <div className="flex flex-col items-end">
          <span className="text-2xl font-black font-mono text-[#dfe2f3]">
            {match.score2 || '—'}
          </span>
          {match.overs2 && (
            <span className="text-[10px] text-[#6B7280]">{match.overs2} ov</span>
          )}
          <span className="text-xs font-bold text-[#e0c0b1] mt-0.5">{match.team2}</span>
        </div>
      </div>

      {match.crr && (
        <div className="flex items-center gap-1.5 justify-center mb-3">
          <TrendingUp size={12} className="text-[#6B7280]" />
          <span className="text-[11px] text-[#6B7280]">CRR {match.crr}</span>
        </div>
      )}

      <div className="mb-4">
        <WinProbBar
          team1={match.team1}
          team2={match.team2}
          team1Pct={match.winProbTeam1 ?? 50}
        />
      </div>

      <button
        onClick={onPredict}
        className="w-full bg-[#f97316] hover:bg-[#ea6a0a] active:scale-95 transition-all text-white font-bold text-sm py-2.5 rounded-xl tracking-wide"
      >
        IN-PLAY PREDICT
      </button>
    </div>
  );
}

function PinnedPredictionCard({ prediction }) {
  return (
    <div className="bg-[#171b28] border border-[#f97316]/50 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-1.5 mb-3">
        <Pin size={12} className="text-[#f97316]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#f97316]">
          Pinned — Your Prediction
        </span>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280]">Winner</span>
          <span className="text-sm font-bold text-[#dfe2f3]">{prediction.winner || '—'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280]">POTM</span>
          <span className="text-sm font-bold text-[#dfe2f3]">{prediction.potm || '—'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280]">1st Innings</span>
          <span className="text-sm font-bold text-[#dfe2f3]">
            {prediction.firstInningsScore || '—'}
          </span>
        </div>
      </div>
    </div>
  );
}

function FeedCard({ prediction }) {
  const displayName = prediction.displayName || 'Anonymous';
  const initial = displayName.charAt(0).toUpperCase();

  let timeAgo = '';
  if (prediction.savedAt) {
    try {
      const date =
        typeof prediction.savedAt.toDate === 'function'
          ? prediction.savedAt.toDate()
          : new Date(prediction.savedAt);
      timeAgo = formatDistanceToNow(date, { addSuffix: true });
    } catch {
      timeAgo = '';
    }
  }

  return (
    <div className="bg-[#171b28] border border-[#313442] rounded-xl p-3.5 flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-[#f97316]/20 border border-[#f97316]/40 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-[#f97316]">{initial}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-semibold text-[#dfe2f3] truncate">{displayName}</span>
          {timeAgo && (
            <span className="text-[10px] text-[#6B7280] ml-2 flex-shrink-0">{timeAgo}</span>
          )}
        </div>
        <div className="flex gap-3 flex-wrap">
          <span className="text-[11px] text-[#6B7280]">
            Winner: <span className="text-[#e0c0b1] font-semibold">{prediction.winner || '—'}</span>
          </span>
          {prediction.potm && (
            <span className="text-[11px] text-[#6B7280]">
              POTM: <span className="text-[#e0c0b1] font-semibold">{prediction.potm}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function LivePageSkeleton() {
  return (
    <div className="px-4 pt-4 space-y-3">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-4 w-40 rounded" />
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function Live() {
  const navigate = useNavigate();
  const { live, loading: matchLoading } = useMatches();
  const { user } = useAuth();

  const liveMatch = live[0] ?? null;
  const { predictions, loading: feedLoading } = useLiveFeed(liveMatch?.id);

  const ownPrediction = predictions.find((p) => p.userId === user?.uid) ?? null;
  const communityFeed = predictions.filter((p) => p.userId !== user?.uid);

  if (matchLoading) {
    return (
      <AppShell>
        <LivePageSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-4 pt-4 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <Radio size={18} className="text-[#f97316]" />
          <h1 className="text-lg font-black uppercase tracking-widest text-[#dfe2f3]">Live Feed</h1>
        </div>

        {!liveMatch ? (
          <EmptyState
            icon="📡"
            title="No live matches"
            subtitle="Check back when a match is in progress"
          />
        ) : (
          <>
            <LiveScoreTicker
              match={liveMatch}
              onPredict={() => navigate(`/predict/${liveMatch.id}`)}
            />

            {ownPrediction && <PinnedPredictionCard prediction={ownPrediction} />}

            {feedLoading ? (
              <div className="space-y-3 mt-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3 mt-2">
                  <Users size={14} className="text-[#6B7280]" />
                  <span className="text-xs text-[#6B7280]">
                    {communityFeed.length}{' '}
                    {communityFeed.length === 1 ? 'prediction' : 'predictions'} submitted
                  </span>
                </div>

                {communityFeed.length === 0 ? (
                  <EmptyState
                    icon="🤫"
                    title="No community predictions yet"
                    subtitle="Be the first to predict this match"
                  />
                ) : (
                  <div className="space-y-2.5">
                    {communityFeed.map((pred) => (
                      <FeedCard key={pred.id} prediction={pred} />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
