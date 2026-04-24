import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  writeBatch,
  runTransaction,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase';
import { computePoints } from './scoringEngine';

// 250 users × 2 batch ops each = 500 — exactly at Firestore's hard limit
const BATCH_SIZE = 250;

export async function triggerScoring(match) {
  const matchRef = doc(db, 'matches', match.id);

  // Atomically claim scoring — prevents concurrent double-runs
  let claimed = false;
  await runTransaction(db, async (txn) => {
    const snap = await txn.get(matchRef);
    if (snap.data()?.scored) return;
    txn.update(matchRef, { scored: true, scoredAt: serverTimestamp() });
    claimed = true;
  });
  if (!claimed) return 0;

  const predictionsRef = collection(db, 'predictions');
  const q = query(predictionsRef, where('matchId', '==', match.id));
  const snap = await getDocs(q);

  if (snap.empty) return 0;

  const docs = snap.docs;
  const chunks = [];
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    chunks.push(docs.slice(i, i + BATCH_SIZE));
  }

  let count = 0;

  for (const chunk of chunks) {
    const batch = writeBatch(db);

    for (const predDoc of chunk) {
      const predData = predDoc.data();
      const userRef = doc(db, 'users', predData.userId);
      const userSnap = await getDoc(userRef);
      const favTeam = userSnap.exists() ? userSnap.data().favouriteTeam : null;

      const breakdown = computePoints(predData, match.result, favTeam, match);
      if (!breakdown) continue;

      batch.update(predDoc.ref, {
        pointsBreakdown: breakdown,
        pointsEarned: breakdown.total,
        scored: true,
      });

      // increment() is concurrent-safe — no stale read + write race
      batch.update(userRef, {
        totalPoints: increment(breakdown.total),
        matchesParticipated: increment(1),
      });

      count++;
    }

    await batch.commit();
  }

  return count;
}
