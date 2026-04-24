import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import AppShell from '../components/layout/AppShell';
import Avatar from '../components/ui/Avatar';
import { Skeleton } from '../components/ui/Skeleton';
import { useAuth } from '../hooks/useAuth';
import { getTeamColor } from '../utils/teamConfig';
import { LogOut, Edit2, Star, TrendingUp, Hash } from 'lucide-react';

function StatCard({ label, value }) {
  return (
    <div className="flex-1 bg-[#1b1f2c] border border-[#313442] rounded-xl p-3 flex flex-col items-center gap-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#e0c0b1]">{label}</span>
      <span className="text-lg font-black text-[#dfe2f3]">{value}</span>
    </div>
  );
}

function PredictionRow({ pred }) {
  const date = pred.savedAt?.toDate?.()?.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  }) ?? '—';

  return (
    <div className="bg-[#1b1f2c] border border-[#313442] rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
          {pred.matchId}
        </span>
        <span className="text-[10px] text-[#6B7280]">{date}</span>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {pred.winner && (
          <span className="text-xs font-semibold text-[#dfe2f3]">
            Winner: <span className="text-[#f97316]">{pred.winner}</span>
          </span>
        )}
        {pred.potm && (
          <span className="text-xs font-semibold text-[#dfe2f3]">
            POTM: <span className="text-[#ffc640]">{pred.potm}</span>
          </span>
        )}
        {pred.scored && pred.pointsEarned != null && (
          <span className="ml-auto text-xs font-black text-[#4ae176]">
            +{pred.pointsEarned} pts
          </span>
        )}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, firestoreUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [predCount, setPredCount] = useState(null);
  const [loadingPreds, setLoadingPreds] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchPredictions() {
      setLoadingPreds(true);
      try {
        const q = query(
          collection(db, 'predictions'),
          where('userId', '==', user.uid),
          orderBy('savedAt', 'desc'),
          limit(10)
        );
        const snap = await getDocs(q);
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPredictions(docs);

        const countQ = query(
          collection(db, 'predictions'),
          where('userId', '==', user.uid)
        );
        const countSnap = await getDocs(countQ);
        setPredCount(countSnap.size);
      } catch {
        setPredictions([]);
        setPredCount(0);
      } finally {
        setLoadingPreds(false);
      }
    }

    fetchPredictions();
  }, [user]);

  async function handleSignOut() {
    await signOut();
    navigate('/login', { replace: true });
  }

  const favTeam = firestoreUser?.favouriteTeam;
  const teamColor = favTeam ? getTeamColor(favTeam) : '#f97316';

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 space-y-6">
        <div className="flex flex-col items-center gap-3 pt-2">
          <div
            className="rounded-full p-[3px]"
            style={{ boxShadow: `0 0 20px ${teamColor}66`, background: `${teamColor}33` }}
          >
            <Avatar
              photoURL={firestoreUser?.photoURL ?? user?.photoURL}
              displayName={firestoreUser?.displayName ?? user?.displayName}
              size="lg"
              className="ring-2 ring-[#f97316]/60"
            />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-black text-[#dfe2f3]">
              {firestoreUser?.displayName ?? user?.displayName ?? 'Crickbait Fan'}
            </h1>
            {favTeam && (
              <span
                className="inline-block mt-1 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-widest text-white"
                style={{ backgroundColor: teamColor }}
              >
                {favTeam}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#f97316]">
              {firestoreUser?.totalPoints ?? 0}
            </span>
            <span className="text-sm font-bold text-[#e0c0b1] uppercase tracking-widest">pts</span>
          </div>

          <button
            onClick={() => navigate('/profile-setup')}
            className="flex items-center gap-1.5 text-[#6B7280] text-[11px] font-bold uppercase tracking-widest hover:text-[#dfe2f3] transition-colors"
          >
            <Edit2 className="w-3 h-3" /> Edit Profile
          </button>
        </div>

        <div className="flex gap-3">
          <StatCard label="Points" value={firestoreUser?.totalPoints ?? 0} />
          <StatCard label="Rank" value="—" />
          <StatCard label="Predictions" value={predCount ?? '—'} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#f97316]" />
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#e0c0b1]">
              Recent Predictions
            </h2>
          </div>

          {loadingPreds ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : predictions.length === 0 ? (
            <div className="bg-[#171b28] border border-[#313442] rounded-xl p-8 text-center">
              <Hash className="w-8 h-8 text-[#6B7280] mx-auto mb-2" />
              <p className="text-sm text-[#6B7280]">No predictions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {predictions.map((pred) => (
                <PredictionRow key={pred.id} pred={pred} />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/20 text-[#ffb4ab] text-sm font-bold hover:bg-[#93000a]/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </AppShell>
  );
}
