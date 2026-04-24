import { useState } from 'react';
import { X } from 'lucide-react';

const RUN_THRESHOLDS = [25, 30, 40, 50, 75, 100];
const WICKET_THRESHOLDS = [1, 2, 3];

export default function PlayerPicker({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('runs');
  const [threshold, setThreshold] = useState(30);

  const thresholds = type === 'runs' ? RUN_THRESHOLDS : WICKET_THRESHOLDS;

  function handleTypeSwitch(t) {
    setType(t);
    setThreshold(t === 'runs' ? 30 : 2);
  }

  function handleAdd() {
    if (!name.trim()) return;
    onAdd({
      playerName: name.trim(),
      predictedRuns: type === 'runs' ? threshold : null,
      predictedWickets: type === 'wickets' ? threshold : null,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-[#171b28] border border-[#313442] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h3 className="text-[18px] font-bold text-[#dfe2f3]">Add Player Prediction</h3>
          <button onClick={onClose} className="text-[#e0c0b1] hover:text-[#dfe2f3] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#e0c0b1]">
            Player Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. MS Dhoni"
            autoFocus
            className="w-full bg-[#1b1f2c] border border-[#313442] rounded-lg px-4 py-3 text-[#dfe2f3] text-sm placeholder:text-[#e0c0b1]/60 focus:outline-none focus:border-[#f97316] transition-colors"
          />
        </div>

        {/* Type toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#e0c0b1]">
            Milestone Type
          </label>
          <div className="flex gap-2 bg-[#1b1f2c] rounded-lg p-1">
            {['runs', 'wickets'].map((t) => (
              <button
                key={t}
                onClick={() => handleTypeSwitch(t)}
                className={`flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  type === t
                    ? 'bg-[#f97316] text-[#582200]'
                    : 'text-[#e0c0b1] hover:text-[#dfe2f3]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Threshold */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#e0c0b1]">
            Threshold
          </label>
          <div className="flex gap-2 flex-wrap">
            {thresholds.map((t) => (
              <button
                key={t}
                onClick={() => setThreshold(t)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  threshold === t
                    ? 'bg-[#f97316] text-[#582200]'
                    : 'bg-[#1b1f2c] border border-[#313442] text-[#e0c0b1] hover:border-[#f97316]'
                }`}
              >
                {t}+ {type === 'runs' ? 'Runs' : 'Wkts'}
              </button>
            ))}
          </div>
        </div>

        {/* Add button */}
        <button
          onClick={handleAdd}
          disabled={!name.trim()}
          className="w-full py-3 bg-[#f97316] text-[#582200] font-bold text-sm uppercase tracking-wider rounded-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ boxShadow: name.trim() ? '0 0 15px rgba(249,115,22,0.3)' : undefined }}
        >
          Add Prediction
        </button>
      </div>
    </div>
  );
}
