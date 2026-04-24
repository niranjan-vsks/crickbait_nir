export default function MatchStatus({ status, isDLS }) {
  if (status === 'live') {
    return (
      <div className="flex items-center gap-1 bg-green-live/10 text-green-live px-2 py-1 rounded-sm border border-green-live/20 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
        <div className="w-1.5 h-1.5 rounded-full bg-green-live animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest">LIVE</span>
      </div>
    );
  }
  if (status === 'completed' || status === 'dls') {
    return (
      <span className="text-[10px] font-bold uppercase tracking-widest text-grey-muted bg-[#171b28] px-2 py-1 rounded-sm border border-[#313442]">
        {isDLS ? 'DLS' : 'COMPLETED'}
      </span>
    );
  }
  if (status === 'abandoned' || status === 'no_result') {
    return (
      <span className="text-[10px] font-bold uppercase tracking-widest text-grey-muted bg-[#171b28] px-2 py-1 rounded-sm border border-[#313442]">
        VOID
      </span>
    );
  }
  return null;
}
