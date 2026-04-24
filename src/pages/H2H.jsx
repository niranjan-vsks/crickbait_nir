import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import BottomNav from '../components/layout/BottomNav';
import { useAuth } from '../hooks/useAuth';
import { useMatches } from '../hooks/useMatches';
import { Skeleton } from '../components/ui/Skeleton';
import { ArrowLeft, Swords, CheckCircle, XCircle } from 'lucide-react';

const LABEL_CLS = 'block text-[10px] font-bold uppercase tracking-widest text-[#e0c0b1] mb-1';
const INPUT_CLS =
  'w-full bg-[#1b1f2c] border border-[#313442] rounded-lg px-3 py-2 text-[#dfe2f3] text-sm focus:outline-none focus:border-[#f97316] transition-colors';

function PickRow({ label, mine, theirs, scored, myPts, theirPts }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-start py-2 border-b border-[#313442] last:border-b-0">
      <div className="text-right">
        <span className="text-sm font-semibold text-[#dfe2f3] break-words">{mine ?? '—'}</span>
        {scored && myPts != null && (
          <div className={`text-[10px] font-bold mt-0.5 ${myPts > 0 ? 'text-[#4ae176]' : 'text-[#6B7280]'}`}>
            {myPts > 0 ? `+${myPts}` : '0'} pts
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-1 pt-0.5">
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280] whitespace-nowrap">{label}</span>
        {scored && (
          <div className="flex gap-1">
            {myPts > 0
              ? <CheckCircle className="w-3 h-3 text-[#4ae176]" />
              : <XCircle className="w-3 h-3 text-[#313442]" />}
            {theirPts > 0
              ? <CheckCircle className="w-3 h-3 text-[#4ae176]" />
              : <XCircle className="w-3 h-3 text-[#313442]" />}
          </div>
        )}
      </div>
      <div className="text-left">
        <span className="text-sm font-semibold text-[#dfe2f3] break-words">{theirs ?? '—'}</span>
        {scored && theirPts != null && (
          <div className={`text-[10px] font-bold mt-0.5 ${theirPts > 0 ? 'text-[#4ae176]' : 'text-[#6B7280]'}`}>
            {theirPts > 0 ? `+${theirPts}` : '0'} pts
          </div>
        )}
      </div>
    </div>
  );
}

export default function H2H() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { completed, loading: matchesLoading } = useMatches();

  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [opponentId, setOpponentId] = useState('');
  const [comparing, setComparing] = useState(false);
  const [myPred, setMyPred] = useState(null);
  const [theirPred, setTheirPred] = useState(null);
  const [comparedMatch, setComparedMatch] = useState(null);
  const [error, setError] = useState('');

  async function handleCompare() {
    if (!selectedMatchId || !opponentId.trim()) {
      setError('Select a match and enter opponent UID');
      return;
    }
    if (opponentId.trim() === user.uid) {
      setError('Cannot compare with yourself');
      return;
    }
    setError('');
    setComparing(true);
    setMyPred(null);
    setTheirPred(null);
    setComparedMatch(null);

    try {
      const [mySnap, theirSnap, matchSnap] = await Promise.all([
        getDoc(doc(db, 'predictions', `${user.uid}_${selectedMatchId}`)),
        getDoc(doc(db, 'predictions', `${opponentId.trim()}_${selectedMatchId}`)),
        getDoc(doc(db, 'matches', selectedMatchId)),
      ]);

      setMyPred(mySnap.exists() ? mySnap.data() : null);
      setTheirPred(theirSnap.exists() ? theirSnap.data() : null);
      setComparedMatch(matchSnap.exists() ? { id: matchSnap.id, ...matchSnap.data() } : null);

      if (!mySnap.exists() && !theirSnap.exists()) {
        setError('No predictions found for either player in this match');
      }
    } catch (err) {
      setError('Failed to fetch predictions: ' + err.message);
    } finally {
      setComparing(false);
    }
  }

  const isScored = comparedMatch?.scored ?? false;
  const myBreakdown = myPred?.pointsBreakdown ?? null;
  const theirBreakdown = theirPred?.pointsBreakdown ?? null;
  const myTotal = myPred?.pointsEarned ?? null;
  const theirTotal = theirPred?.pointsEarned ?? null;

  return (
    <div className="min-h-screen bg-[#0f131f] pb-24">
      <header className="fixed top-0 w-full z-50 bg-[#0a0e1a]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 h-16 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-[#f97316] active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-black text-lg text-white uppercase italic tracking-widest flex items-center gap-2">
            <Swords className="w-5 h-5 text-[#f97316]" />
            H2H Challenge
          </h1>
        </div>
      </header>

      <main className="pt-20 px-4 max-w-2xl mx-auto space-y-6">
        <section className="bg-[#1b1f2c] border border-[#313442] rounded-xl p-4 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-[#f97316]/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-base font-black text-[#dfe2f3] uppercase">Select a Match</h2>

          {matchesLoading ? (
            <Skeleton className="h-10 w-full rounded-lg" />
          ) : (
            <div>
              <label className={LABEL_CLS}>Completed Match</label>
              <select
                value={selectedMatchId}
                onChange={(e) => {
                  setSelectedMatchId(e.target.value);
                  setMyPred(null);
                  setTheirPred(null);
                  setComparedMatch(null);
                  setError('');
                }}
                className={INPUT_CLS}
              >
                <option value="">— Choose a match —</option>
                {completed.map((m) => (
                  <option key={m.id} value={m.id}>
                    #{m.matchNumber} · {m.team1} vs {m.team2}
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        <section className="bg-[#1b1f2c] border border-[#313442] rounded-xl p-4 space-y-4">
          <h2 className="text-base font-black text-[#dfe2f3] uppercase">Enter Opponent UID</h2>
          <div>
            <label className={LABEL_CLS}>Opponent's User ID</label>
            <input
              type="text"
              value={opponentId}
              onChange={(e) => setOpponentId(e.target.value)}
              placeholder="Paste their UID here"
              className={INPUT_CLS}
            />
          </div>

          {error && (
            <p className="text-[#ffb4ab] text-xs font-semibold">{error}</p>
          )}

          <button
            onClick={handleCompare}
            disabled={comparing || !selectedMatchId || !opponentId.trim()}
            className="w-full bg-[#f97316] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#ea6c0e] transition-colors disabled:opacity-40 text-sm"
          >
            {comparing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Swords className="w-4 h-4" />
            )}
            Compare
          </button>
        </section>

        {(myPred || theirPred) && comparedMatch && (
          <section className="bg-[#171b28] border border-[#313442] rounded-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#f97316] to-[#ffc640]" />

            <div className="p-4 border-b border-[#313442]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">
                Match #{comparedMatch.matchNumber} · {comparedMatch.team1} vs {comparedMatch.team2}
              </p>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                <div className="text-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#f97316] mb-1">YOU</div>
                  {isScored && myTotal != null && (
                    <div className="text-xl font-black text-[#f97316]">{myTotal} pts</div>
                  )}
                  {!myPred && (
                    <div className="text-[11px] text-[#6B7280]">No prediction</div>
                  )}
                </div>
                <div className="text-[#6B7280] font-black text-lg">VS</div>
                <div className="text-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#e0c0b1] mb-1">OPPONENT</div>
                  {isScored && theirTotal != null && (
                    <div className="text-xl font-black text-[#ffc640]">{theirTotal} pts</div>
                  )}
                  {!theirPred && (
                    <div className="text-[11px] text-[#6B7280]">No prediction</div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 py-2">
              <PickRow
                label="Winner"
                mine={myPred?.winner}
                theirs={theirPred?.winner}
                scored={isScored}
                myPts={myBreakdown?.winner}
                theirPts={theirBreakdown?.winner}
              />
              <PickRow
                label="POTM"
                mine={myPred?.potm}
                theirs={theirPred?.potm}
                scored={isScored}
                myPts={myBreakdown?.potm}
                theirPts={theirBreakdown?.potm}
              />
              <PickRow
                label="Innings"
                mine={myPred?.firstInningsScore != null ? String(myPred.firstInningsScore) : null}
                theirs={theirPred?.firstInningsScore != null ? String(theirPred.firstInningsScore) : null}
                scored={isScored}
                myPts={myBreakdown?.innings}
                theirPts={theirBreakdown?.innings}
              />

              {(myPred?.playerPredictions?.length > 0 || theirPred?.playerPredictions?.length > 0) && (
                <div className="pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">
                    Player Picks
                  </p>
                  {Array.from({
                    length: Math.max(
                      myPred?.playerPredictions?.length ?? 0,
                      theirPred?.playerPredictions?.length ?? 0
                    ),
                  }).map((_, i) => {
                    const myPp = myPred?.playerPredictions?.[i];
                    const theirPp = theirPred?.playerPredictions?.[i];
                    const myPpPts = isScored && myBreakdown?.players?.[i] != null
                      ? myBreakdown.players[i]
                      : null;
                    const theirPpPts = isScored && theirBreakdown?.players?.[i] != null
                      ? theirBreakdown.players[i]
                      : null;
                    return (
                      <PickRow
                        key={i}
                        label={`Player ${i + 1}`}
                        mine={myPp ? `${myPp.playerName} (${myPp.predictedRuns ?? '?'}r ${myPp.predictedWickets ?? '?'}w)` : null}
                        theirs={theirPp ? `${theirPp.playerName} (${theirPp.predictedRuns ?? '?'}r ${theirPp.predictedWickets ?? '?'}w)` : null}
                        scored={isScored}
                        myPts={myPpPts}
                        theirPts={theirPpPts}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {!isScored && (
              <div className="px-4 pb-4">
                <p className="text-center text-[10px] text-[#6B7280] uppercase tracking-widest">
                  Match not scored yet — points will appear after scoring
                </p>
              </div>
            )}
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
