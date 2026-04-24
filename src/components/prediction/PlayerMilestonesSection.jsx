import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { POINTS, MAX_PLAYER_PREDICTIONS } from '../../utils/constants';
import PlayerPicker from './PlayerPicker';

function chipLabel(pp) {
  if (pp.predictedRuns != null) return `${pp.playerName} • ${pp.predictedRuns}+ Runs`;
  if (pp.predictedWickets != null) return `${pp.playerName} • ${pp.predictedWickets}+ Wkts`;
  return pp.playerName;
}

export default function PlayerMilestonesSection({ players, onChange, locked }) {
  const [showPicker, setShowPicker] = useState(false);

  function handleAdd(pp) {
    if (players.length >= MAX_PLAYER_PREDICTIONS) return;
    onChange([...players, pp]);
    setShowPicker(false);
  }

  function handleRemove(idx) {
    onChange(players.filter((_, i) => i !== idx));
  }

  const canAdd = !locked && players.length < MAX_PLAYER_PREDICTIONS;

  return (
    <section className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-[#dfe2f3]">
          Player Milestones
        </h2>
        <span className="font-mono text-sm font-bold text-[#f97316]">
          +{POINTS.PLAYER_RUNS} pts each
        </span>
      </div>

      {/* Player chips */}
      {players.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {players.map((pp, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 bg-[#1b1f2c] border border-[#313442] rounded-full py-1.5 pl-3 pr-2"
            >
              <span className="font-mono text-xs text-[#dfe2f3]">{chipLabel(pp)}</span>
              {!locked && (
                <button
                  onClick={() => handleRemove(idx)}
                  className="text-[#e0c0b1] hover:text-[#ffb4ab] transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      {canAdd && (
        <button
          onClick={() => setShowPicker(true)}
          className="w-full py-4 border-2 border-dashed border-[#313442] rounded-xl text-[#e0c0b1] hover:text-[#f97316] hover:border-[#f97316] transition-colors flex items-center justify-center gap-2 text-[12px] font-bold uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          ADD PLAYER PREDICTION
          <span className="text-[#6B7280]">({players.length}/{MAX_PLAYER_PREDICTIONS})</span>
        </button>
      )}

      {locked && players.length === 0 && (
        <p className="text-[12px] text-[#6B7280] text-center py-2">No player predictions made</p>
      )}

      {showPicker && (
        <PlayerPicker onAdd={handleAdd} onClose={() => setShowPicker(false)} />
      )}
    </section>
  );
}
