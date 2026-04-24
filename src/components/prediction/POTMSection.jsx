import { Star, Search } from 'lucide-react';
import { POINTS } from '../../utils/constants';

export default function POTMSection({ potm, onChange, locked }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-[#dfe2f3] flex items-center gap-2">
          <Star className="w-5 h-5 text-[#ffc640]" />
          Player of the Match
        </h2>
        <span className="font-mono text-sm font-bold text-[#f97316]">+{POINTS.POTM} pts</span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e0c0b1]" />
        <input
          type="text"
          value={potm ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={locked}
          placeholder="Enter player name..."
          className="w-full bg-[#1b1f2c] border border-[#313442] rounded-lg pl-10 pr-4 py-3 text-[#dfe2f3] text-sm placeholder:text-[#e0c0b1]/60 focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>
    </section>
  );
}
