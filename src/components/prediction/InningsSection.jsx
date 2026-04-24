import { Minus, Plus } from 'lucide-react';
import { POINTS, INNINGS_RANGE } from '../../utils/constants';

const STEP = 5;
const HISTORICAL_AVG = 168;

export default function InningsSection({ score, onChange, locked }) {
  const clamp = (v) => Math.max(INNINGS_RANGE.MIN, Math.min(INNINGS_RANGE.MAX, v));
  const pct =
    ((score - INNINGS_RANGE.MIN) / (INNINGS_RANGE.MAX - INNINGS_RANGE.MIN)) * 100;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-[#dfe2f3]">
          1st Innings Score
        </h2>
        <span className="font-mono text-sm font-bold text-[#f97316]">+{POINTS.INNINGS_EXACT} pts</span>
      </div>

      <div className="bg-[#171b28] border border-[#313442] rounded-xl p-6 text-center">
        <p className="text-[12px] font-bold uppercase tracking-wider text-[#e0c0b1] mb-6">
          Historical Average: {HISTORICAL_AVG}
        </p>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => onChange(clamp(score - STEP))}
            disabled={locked || score <= INNINGS_RANGE.MIN}
            className="w-12 h-12 rounded-full border border-[#313442] bg-[#1b1f2c] flex items-center justify-center hover:bg-[#262a37] transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus className="w-5 h-5 text-[#dfe2f3]" />
          </button>

          <div className="font-mono text-[32px] font-extrabold text-[#dfe2f3] w-24 text-center">
            {score}
          </div>

          <button
            onClick={() => onChange(clamp(score + STEP))}
            disabled={locked || score >= INNINGS_RANGE.MAX}
            className="w-12 h-12 rounded-full border border-[#313442] bg-[#1b1f2c] flex items-center justify-center hover:bg-[#262a37] transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5 text-[#dfe2f3]" />
          </button>
        </div>

        <div className="mt-6 flex justify-between items-center px-4 max-w-xs mx-auto gap-4">
          <span className="font-mono text-xs text-[#e0c0b1]">{INNINGS_RANGE.MIN}</span>
          <div className="flex-1 h-1.5 bg-[#313442] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#f97316] rounded-full transition-all duration-200"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-xs text-[#e0c0b1]">{INNINGS_RANGE.MAX}</span>
        </div>
      </div>
    </section>
  );
}
