import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
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
      orderBy('savedAt', 'desc'),
      limit(20)
    );

    const unsub = onSnapshot(q, (snap) => {
      setPredictions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return unsub;
  }, [matchId]);

  return { predictions, loading };
}
