import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { MATCH_STATUSES } from '../utils/constants';

export function useMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'matches'), orderBy('startTime', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setMatches(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const live = matches.filter((m) => m.status === MATCH_STATUSES.LIVE);
  const upcoming = matches.filter((m) => m.status === MATCH_STATUSES.UPCOMING);
  const completed = matches.filter((m) =>
    [
      MATCH_STATUSES.COMPLETED,
      MATCH_STATUSES.ABANDONED,
      MATCH_STATUSES.NO_RESULT,
      MATCH_STATUSES.DLS,
    ].includes(m.status)
  );

  // Sort: live first, then upcoming by startTime ASC, then completed DESC
  const sorted = [
    ...live,
    ...upcoming,
    ...completed.slice().reverse(),
  ];

  return { matches: sorted, live, upcoming, completed, loading };
}
