import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  writeBatch,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { computePoints } from './scoringEngine';

const BATCH_SIZE = 400;

export async function triggerScoring(match) {
  const predictionsRef = collection(db, 'predictions');
  const q = query(predictionsRef, where('matchId', '==', match.id));
  const snap = await getDocs(q);

  if (snap.empty) {
    await updateDoc(doc(db, 'matches', match.id), {
      scored: true,
      scoredAt: serverTimestamp(),
    });
    return 0;
  }

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
      const existingPts = userSnap.exists() ? (userSnap.data().totalPoints ?? 0) : 0;

      const breakdown = computePoints(predData, match.result, favTeam, match);
      if (!breakdown) continue;

      batch.update(predDoc.ref, {
        pointsBreakdown: breakdown,
        pointsEarned: breakdown.total,
        scored: true,
      });

      batch.update(userRef, {
        totalPoints: existingPts + breakdown.total,
      });

      count++;
    }

    await batch.commit();
  }

  await updateDoc(doc(db, 'matches', match.id), {
    scored: true,
    scoredAt: serverTimestamp(),
  });

  return count;
}
