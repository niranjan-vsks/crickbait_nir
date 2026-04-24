import { useState } from 'react';
import { Trophy, Medal } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAuth } from '../hooks/useAuth';
import { getTeamColor } from '../utils/teamConfig';

const TABS = ['SEASON', 'MATCH', 'STATS'];

function InitialsAvatar({ displayName, teamColor, size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
  };
  const initial = (displayName || '?').charAt(0).toUpperCase();
  const dim = sizes[size] ?? sizes.md;

  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{
        backgroundColor: `${teamColor}22`,
        border: `2px solid ${teamColor}`,
      }}
    >
      {initial}
    </div>
  );
}

const RANK_BADGES = ['🥇', '🥈', '🥉'];

function PodiumCard({ user, rank, isCurrentUser }) {
  const teamColor = getTeamColor(user.favouriteTeam);
  const isFirst = rank === 1;

  return (
    <div
      className={`flex flex-col items-center gap-2 flex-1 rounded-xl p-3 border transition-all ${
        isFirst
          ? 'bg-[#ffc640]/5 border-[#ffc640]/30 shadow-[0_0_20px_rgba(255,198,64,0.4)]'
          : 'bg-[#1b1f2c] border-[#313442]'
      } ${isFirst ? 'py-5' : 'py-3'}`}
    >
      <span className="text-2xl">{RANK_BADGES[rank - 1]}</span>
      <InitialsAvatar
        displayName={user.displayName}
        teamColor={teamColor}
        size={isFirst ? 'lg' : 'md'}
      />
      <div className="text-center min-w-0 w-full">
        <p
          className="text-xs font-bold text-[#dfe2f3] truncate"
          title={user.displayName}
        >
          {isCurrentUser ? (
            <span>
              {user.displayName}{' '}
              <span className="text-[#f97316] text-[9px] font-black">YOU</span>
            </span>
          ) : (
            user.displayName
          )}
        </p>
        <p
          className={`text-sm font-black font-mono mt-0.5 ${
            isFirst ? 'text-[#ffc640]' : 'text-[#dfe2f3]'
          }`}
        >
          {user.totalPoints ?? 0}
          <span className="text-[9px] font-normal text-[#6B7280] ml-0.5">pts</span>
        </p>
      </div>
    </div>
  );
}

function RankedRow({ user, rank, isCurrentUser }) {
  const teamColor = getTeamColor(user.favouriteTeam);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
        isCurrentUser
          ? 'bg-[#f97316]/5 border-[#f97316]/20'
          : 'bg-[#171b28] border-[#313442]'
      }`}
    >
      <span className="text-sm font-bold text-[#6B7280] w-6 text-center flex-shrink-0">
        {rank}
      </span>
      <InitialsAvatar displayName={user.displayName} teamColor={teamColor} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-semibold text-[#dfe2f3] truncate">
            {user.displayName}
          </span>
          {isCurrentUser && (
            <span className="text-[9px] font-black text-[#f97316] bg-[#f97316]/10 border border-[#f97316]/30 px-1.5 py-0.5 rounded-full flex-shrink-0">
              YOU
            </span>
          )}
        </div>
        {user.favouriteTeam && (
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
            style={{ color: teamColor, backgroundColor: `${teamColor}18` }}
          >
            {user.favouriteTeam}
          </span>
        )}
      </div>
      <span className="text-sm font-black font-mono text-[#dfe2f3] flex-shrink-0">
        {user.totalPoints ?? 0}
        <span className="text-[10px] font-normal text-[#6B7280] ml-0.5">pts</span>
      </span>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="px-4 pt-4 space-y-3">
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className={`flex-1 rounded-xl ${i === 1 ? 'h-40' : 'h-32'}`} />
        ))}
      </div>
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('SEASON');
  const { users, loading } = useLeaderboard();
  const { user } = useAuth();

  const currentUserIndex = users.findIndex((u) => u.id === user?.uid);
  const currentUserRank = currentUserIndex !== -1 ? currentUserIndex + 1 : null;
  const currentUserData = currentUserIndex !== -1 ? users[currentUserIndex] : null;

  const podium = users.slice(0, 3);
  const ranked = users.slice(3);

  const showOwnRankChip =
    currentUserRank !== null && currentUserRank > 3 && currentUserData;

  return (
    <AppShell>
      <div className="px-4 pt-4 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={18} className="text-[#ffc640]" />
          <h1 className="text-lg font-black uppercase tracking-widest text-[#dfe2f3]">
            Leaderboard
          </h1>
        </div>
        <p className="text-xs text-[#6B7280] mb-4">IPL Season {new Date().getFullYear()}</p>

        {showOwnRankChip && (
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 bg-[#262a37] border border-[#313442] rounded-full px-4 py-1.5">
              <Medal size={12} className="text-[#f97316]" />
              <span className="text-xs font-bold text-[#dfe2f3]">
                Your rank:{' '}
                <span className="text-[#f97316]">#{currentUserRank}</span>
                {' · '}
                <span className="text-[#ffc640]">{currentUserData.totalPoints ?? 0} pts</span>
              </span>
            </div>
          </div>
        )}

        <div className="flex bg-[#1b1f2c] border border-[#313442] rounded-xl p-1 mb-5 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-[#262a37] text-[#dfe2f3]'
                  : 'text-[#6B7280] hover:text-[#dfe2f3]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab !== 'SEASON' ? (
          <EmptyState
            icon="🔜"
            title="Coming Soon"
            subtitle={`${activeTab === 'MATCH' ? 'Per-match rankings' : 'Player stats'} will be available soon`}
          />
        ) : loading ? (
          <LeaderboardSkeleton />
        ) : users.length === 0 ? (
          <EmptyState
            icon="🏆"
            title="No rankings yet"
            subtitle="Predictions will appear here once matches begin"
          />
        ) : (
          <>
            {podium.length > 0 && (
              <div className="flex gap-2 items-end mb-4">
                {podium[1] && (
                  <PodiumCard
                    user={podium[1]}
                    rank={2}
                    isCurrentUser={podium[1].id === user?.uid}
                  />
                )}
                {podium[0] && (
                  <PodiumCard
                    user={podium[0]}
                    rank={1}
                    isCurrentUser={podium[0].id === user?.uid}
                  />
                )}
                {podium[2] && (
                  <PodiumCard
                    user={podium[2]}
                    rank={3}
                    isCurrentUser={podium[2].id === user?.uid}
                  />
                )}
              </div>
            )}

            {ranked.length > 0 && (
              <div className="space-y-2">
                {ranked.map((u, i) => (
                  <RankedRow
                    key={u.id}
                    user={u}
                    rank={i + 4}
                    isCurrentUser={u.id === user?.uid}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
