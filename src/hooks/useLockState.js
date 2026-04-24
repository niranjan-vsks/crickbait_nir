import { useState, useEffect } from 'react';
import { getMatchLockState } from '../utils/lockUtils';

export function useLockState(match) {
  const [lockState, setLockState] = useState(() =>
    match ? getMatchLockState(match) : null
  );

  const startSeconds = match?.startTime?.seconds;
  const status = match?.status;

  useEffect(() => {
    if (!match?.startTime) return;
    const update = () => setLockState(getMatchLockState(match));
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startSeconds, status]);

  return lockState;
}
