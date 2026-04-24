import { useState, useEffect } from 'react';
import { formatCountdown } from '../../utils/dateUtils';

export default function CountdownTimer({ targetTime, className = '', short = false }) {
  const [ms, setMs] = useState(() => targetTime - Date.now());

  useEffect(() => {
    setMs(targetTime - Date.now());
    const interval = setInterval(() => {
      setMs(targetTime - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  if (ms <= 0) return null;
  return <span className={className}>{formatCountdown(ms, short)}</span>;
}
