import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, firestoreUser, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already signed in
  useEffect(() => {
    if (!loading && user && firestoreUser !== undefined) {
      if (firestoreUser?.profileComplete) {
        navigate('/home', { replace: true });
      } else if (firestoreUser !== null) {
        // Doc exists but profileComplete is false — go to setup
        navigate('/profile-setup', { replace: true });
      }
      // firestoreUser === null means no Firestore doc yet (brand new user)
      // They'll be redirected to /profile-setup via ProfileGate after sign-in
    }
  }, [user, firestoreUser, loading, navigate]);

  async function handleSignIn() {
    setError('');
    setSigningIn(true);
    try {
      await signInWithGoogle();
      // Navigation handled by useEffect above once firestoreUser resolves
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Sign in failed. Please try again.');
      }
    } finally {
      setSigningIn(false);
    }
  }

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background pitch texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-full h-px bg-[#584237] -skew-y-12" />
        <div className="absolute top-2/4 left-0 w-full h-px bg-[#584237] -skew-y-12" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-[#584237] -skew-y-12" />
        <div className="absolute left-1/4 top-0 w-px h-full border-l border-dashed border-[#584237] skew-x-12 opacity-50" />
        <div className="absolute right-1/4 top-0 w-px h-full border-r border-dashed border-[#584237] skew-x-12 opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange rounded-full blur-[150px] opacity-10" />
      </div>

      {/* Main content */}
      <main className="w-full max-w-sm px-4 flex flex-col items-center gap-8 z-10">
        {/* Logo + branding */}
        <div className="flex flex-col items-center text-center gap-4">
          {/* Logo circle */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange to-[#9d4300] p-[3px] shadow-[0_0_30px_rgba(249,115,22,0.4)]">
            <div className="w-full h-full rounded-full bg-base flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-2 border-2 border-orange rounded-full" />
              <CricketIcon className="w-10 h-10 text-orange relative z-10" />
            </div>
          </div>

          {/* Wordmark */}
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange to-gold drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]">
            CRICKBAIT
          </h1>

          {/* Taglines */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm text-grey-muted tracking-widest uppercase font-semibold">
              Made for the serious non-serious cricket fan
            </p>
            <p className="text-base text-text-secondary italic">
              Predict. Gloat. Repeat.
            </p>
          </div>
        </div>

        {/* Google sign-in */}
        <div className="w-full mt-4">
          {error && (
            <p className="text-red-locked text-sm text-center mb-3">{error}</p>
          )}
          <button
            onClick={handleSignIn}
            disabled={signingIn}
            className="w-full flex items-center justify-center bg-[#dfe2f3] text-[#0f131f] font-bold text-base py-4 px-6 rounded-full shadow-lg shadow-black/50 hover:bg-white transition-colors duration-200 disabled:opacity-70"
          >
            {signingIn ? (
              <span className="w-5 h-5 border-2 border-[#0f131f]/30 border-t-[#0f131f] rounded-full animate-spin mr-2" />
            ) : (
              <GoogleSvg className="w-6 h-6 mr-3" />
            )}
            {signingIn ? 'Signing in…' : 'Continue with Google'}
          </button>
        </div>
      </main>
    </div>
  );
}

function CricketIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.5 2.5 L18.5 2.5 L18.5 16 Q18.5 18 16.5 18 L7.5 18 Q5.5 18 5.5 16 Z" opacity="0.15"/>
      <rect x="9" y="1" width="6" height="15" rx="3" />
      <rect x="7" y="16" width="10" height="4" rx="2" />
      <rect x="9" y="20" width="6" height="3" rx="1.5" />
    </svg>
  );
}

function GoogleSvg({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-base flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-surface border-t-orange rounded-full animate-spin" />
    </div>
  );
}
