import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';

export default function TopBar() {
  const { user, firestoreUser } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/50">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar
            photoURL={user?.photoURL}
            displayName={firestoreUser?.displayName || user?.displayName}
            size="md"
          />
          <div className="absolute -bottom-2 -right-2 bg-[#f97316] text-[#582200] font-bold text-[10px] px-1.5 py-0.5 rounded-sm shadow-sm border border-[#0a0e1a] whitespace-nowrap">
            {firestoreUser?.totalPoints ?? 0} pts
          </div>
        </div>
        <Link to="/home">
          <h1
            className="text-2xl font-black italic tracking-tighter text-[#f97316] uppercase"
            style={{ textShadow: '0 0 8px rgba(249,115,22,0.6)' }}
          >
            CRICKBAIT
          </h1>
        </Link>
      </div>
      <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-[#f97316]">
        <Bell className="w-5 h-5" />
      </button>
    </header>
  );
}
