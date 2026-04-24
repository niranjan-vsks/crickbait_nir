import { NavLink, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Radio, Trophy, User } from 'lucide-react';
import { useMatches } from '../../hooks/useMatches';

const TABS = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/predict', icon: TrendingUp, label: 'Predict' },
  { to: '/live', icon: Radio, label: 'Live' },
  { to: '/ranks', icon: Trophy, label: 'Ranks' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const { live } = useMatches();
  const hasLive = live.length > 0;
  const { pathname } = useLocation();

  function isTabActive(to) {
    if (to === '/predict') return pathname.startsWith('/predict');
    if (to === '/home') return pathname === '/home' || pathname === '/';
    return pathname === to;
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-2 pb-4 px-2 bg-[#020617]/90 backdrop-blur-2xl rounded-t-2xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      {TABS.map(({ to, icon: Icon, label }) => {
        const active = isTabActive(to);
        return (
          <NavLink
            key={to}
            to={to}
            className={`flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-all duration-200 ${
              active
                ? 'text-[#f97316] drop-shadow-[0_0_10px_rgba(249,115,22,0.4)] scale-110'
                : 'text-slate-500 hover:bg-white/5'
            }`}
          >
            <div className="relative mb-1">
              <Icon
                className="w-6 h-6"
                strokeWidth={active ? 2.5 : 1.5}
                fill={active ? 'currentColor' : 'none'}
              />
              {label === 'Live' && hasLive && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#4ae176] animate-pulse" />
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
