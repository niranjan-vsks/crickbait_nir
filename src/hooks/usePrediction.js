import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';
import { getMatchLockState } from '../utils/lockUtils';

const DEFAULT_DRAFT = {
  winner: null,
  potm: null,
  firstInningsScore: 160,
  playerPredictions: [],
};

export function usePrediction(matchId) {
  const { user, firestoreUser } = useAuth();
  const [draft, setDraft] = useState(DEFAULT_DRAFT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const docId = user && matchId ? `${user.uid}_${matchId}` : null;

  useEffect(() => {
    if (!docId) { setLoading(false); return; }
    getDoc(doc(db, 'predictions', docId))
      .then((snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setDraft({
            winner: d.winner ?? null,
            potm: d.potm ?? null,
            firstInningsScore: d.firstInningsScore ?? 160,
            playerPredictions: d.playerPredictions ?? [],
          });
        }
      })
      .finally(() => setLoading(false));
  }, [docId]);

  function updateDraft(partial) {
    setDraft((prev) => ({ ...prev, ...partial }));
    setSaved(false);
  }

  async function savePrediction(match) {
    if (!docId || !user || !match) return;
    const lock = getMatchLockState(match);
    if (lock.isAllLocked) return;

    const payload = {
      userId: user.uid,
      matchId,
      displayName: firestoreUser?.displayName || user.displayName || null,
      photoURL: user.photoURL || null,
      potm: draft.potm,
      firstInningsScore: draft.firstInningsScore,
      playerPredictions: draft.playerPredictions,
      savedAt: serverTimestamp(),
    };

    // Only write winner if still unlocked — merge: true leaves the field
    // unchanged on Firestore if we don't include it
    if (!lock.isWinnerLocked) {
      payload.winner = draft.winner;
    }

    setSaving(true);
    setError(null);
    try {
      await setDoc(doc(db, 'predictions', docId), payload, { merge: true });
      setSaved(true);
      return null;
    } catch (e) {
      setError(e.message);
      return e.message;
    } finally {
      setSaving(false);
    }
  }

  return { draft, updateDraft, loading, saving, saved, error, savePrediction };
}
