import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { IPL_TEAMS } from '../utils/constants';

export default function ProfileSetup() {
  const { user, firestoreUser, loading } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Already complete → go home
  useEffect(() => {
    if (!loading && firestoreUser?.profileComplete) {
      navigate('/home', { replace: true });
    }
  }, [firestoreUser, loading, navigate]);

  const isValid = displayName.trim().length > 0 && selectedTeam !== '';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || submitting || !user) return;

    setSubmitting(true);
    setError('');
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        photoURL: user.photoURL || null,
        displayName: displayName.trim(),
        favouriteTeam: selectedTeam,
        isAdmin: false,
        totalPoints: 0,
        matchesParticipated: 0,
        accuracyByCategory: {
          winner:  { correct: 0, total: 0 },
          potm:    { correct: 0, total: 0 },
          innings: { correct: 0, total: 0 },
          runs:    { correct: 0, total: 0 },
          wickets: { correct: 0, total: 0 },
        },
        fcmToken: null,
        profileComplete: true,
        createdAt: serverTimestamp(),
      });
      navigate('/home', { replace: true });
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-surface border-t-orange rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base text-text-primary">
      {/* Top bar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/50">
        <div className="flex items-center gap-3">
          <Avatar photoURL={user?.photoURL} displayName={user?.displayName} size="sm" />
          <h1 className="text-xl font-black italic tracking-tighter text-orange drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] uppercase">
            CRICKBAIT
          </h1>
        </div>
        <button className="text-text-secondary hover:text-orange transition-colors p-1">
          <BellIcon className="w-6 h-6" />
        </button>
      </header>

      {/* Main */}
      <main className="pt-20 pb-24 px-4 flex items-start justify-center min-h-screen">
        <div className="w-full max-w-sm">
          <div className="bg-[#171b28] border border-[#313442] rounded-xl p-6 shadow-2xl shadow-black">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black tracking-tight text-text-primary mb-2">
                Set Your Identity
              </h2>
              <p className="text-sm text-text-secondary">
                You can't change this later. Choose wisely.
              </p>
            </div>

            {/* Warning banner */}
            <div className="bg-[#1b1f2c] flex items-start gap-3 p-3 rounded-lg border border-[#262a37] mb-6">
              <InfoIcon className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <p className="text-sm text-text-primary">
                Your favourite team affects your Winner prediction points.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Display Name */}
              <div className="mb-6">
                <label
                  htmlFor="displayName"
                  className="block text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value.slice(0, 20))}
                  placeholder="e.g. MasterBlaster"
                  maxLength={20}
                  className="w-full bg-[#0f131f] border border-[#313442] rounded-lg px-4 py-3 text-sm font-mono text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange transition-colors"
                />
                <p className="text-xs text-text-secondary mt-1 text-right">
                  {displayName.length}/20
                </p>
              </div>

              {/* Team picker */}
              <div className="mb-8">
                <label className="block text-xs font-semibold uppercase tracking-widest text-text-secondary mb-4">
                  Pick Your IPL Team
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {IPL_TEAMS.map((team) => {
                    const isSelected = selectedTeam === team;
                    return (
                      <button
                        key={team}
                        type="button"
                        onClick={() => setSelectedTeam(team)}
                        className="flex flex-col items-center relative"
                      >
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange rounded-full flex items-center justify-center z-10 shadow-[0_0_8px_rgba(249,115,22,0.6)]">
                            <CheckIcon className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#0f131f] border-2 border-orange shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                              : 'bg-[#0f131f] border border-[#313442] hover:border-orange/50'
                          }`}
                        >
                          <span
                            className={`text-xs font-bold ${
                              isSelected ? 'text-orange' : 'text-text-secondary'
                            }`}
                          >
                            {team}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <p className="text-red-locked text-sm text-center mb-4">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!isValid || submitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LockIcon className="w-5 h-5" />
                )}
                {submitting ? 'Saving…' : 'Lock It In'}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Bottom nav — decorative during setup, no navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-2 pb-4 px-2 bg-[#0a0e1a]/90 backdrop-blur-2xl border-t border-white/5">
        {[
          { label: 'Home', icon: HomeIcon },
          { label: 'Predict', icon: ChartIcon },
          { label: 'Live', icon: RadioIcon },
          { label: 'Ranks', icon: TrophyIcon },
          { label: 'Profile', icon: PersonIcon, active: true },
        ].map(({ label, icon: Icon, active }) => (
          <div
            key={label}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${
              active ? 'text-orange drop-shadow-[0_0_10px_rgba(249,115,22,0.4)] scale-110' : 'text-text-secondary'
            }`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}

// ── Inline icon components ──────────────────────────────────────────────────

function Avatar({ photoURL, displayName, size = 'sm' }) {
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  if (photoURL) {
    return <img src={photoURL} alt="avatar" className={`${dim} rounded-full object-cover`} />;
  }
  const initials = (displayName || '?').charAt(0).toUpperCase();
  return (
    <div className={`${dim} rounded-full bg-orange/20 border border-orange/40 flex items-center justify-center text-orange font-bold text-sm`}>
      {initials}
    </div>
  );
}

function InfoIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  );
}

function BellIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
    </svg>
  );
}

function HomeIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  );
}

function ChartIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
    </svg>
  );
}

function RadioIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 4C7 4 3 8 3 13h2c0-3.87 3.13-7 7-7s7 3.13 7 7h2c0-5-4-9-9-9zM12 8c-2.76 0-5 2.24-5 5h2c0-1.65 1.35-3 3-3s3 1.35 3 3h2c0-2.76-2.24-5-5-5zm0 5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  );
}

function TrophyIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
    </svg>
  );
}

function PersonIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  );
}
