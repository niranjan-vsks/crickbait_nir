import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase';

export function useLiveFeed(matchId) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) {
      setPredictions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'predictions'),
      where('matchId', '==', matchId),
      limit(20)
    );

    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => {
        const aTime = a.savedAt?.toDate?.()?.getTime() ?? 0;
        const bTime = b.savedAt?.toDate?.()?.getTime() ?? 0;
        return bTime - aTime;
      });
      setPredictions(docs);
      setLoading(false);
    });

    return unsub;
  }, [matchId]);

  return { predictions, loading };
}
