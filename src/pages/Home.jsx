import { useState } from 'react';
import { useMatches } from '../hooks/useMatches';
import AppShell from '../components/layout/AppShell';
import MatchCard from '../components/match/MatchCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const TABS = ['UPCOMING', 'LIVE', 'COMPLETED'];

export default function Home() {
  const [activeTab, setActiveTab] = useState('UPCOMING');
  const { live, upcoming, completed, loading } = useMatches();

  const displayMatches =
    activeTab === 'UPCOMING'
      ? upcoming
      : activeTab === 'LIVE'
      ? live
      : completed;

  return (
    <AppShell>
      <div className="px-4 max-w-2xl mx-auto flex flex-col gap-4 pt-5">
        {/* Tabs */}
        <div
          className="flex gap-2 overflow-x-auto py-2 border-b border-white/5 mb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-[#f97316] text-[#582200] shadow-[0_0_10px_rgba(249,115,22,0.3)]'
                  : 'bg-[#1b1f2c] text-[#e0c0b1] border border-white/5 hover:bg-white/5'
              }`}
            >
              {tab}
              {tab === 'LIVE' && live.length > 0 && (
                <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-[#4ae176] animate-pulse align-middle" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : displayMatches.length === 0 ? (
          <EmptyState
            title={`No ${activeTab.toLowerCase()} matches`}
            subtitle={
              activeTab === 'LIVE'
                ? 'No matches in progress right now'
                : activeTab === 'COMPLETED'
                ? 'No completed matches yet'
                : 'Check back soon for upcoming matches'
            }
          />
        ) : (
          <div className="flex flex-col gap-4 pb-4">
            {displayMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
