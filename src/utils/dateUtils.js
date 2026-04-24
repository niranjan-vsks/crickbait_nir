/**
 * Converts a Date or Firestore Timestamp to IST display string.
 * Format: "Thu, 24 Apr · 7:30 PM IST"
 */
export function formatMatchTime(timestamp) {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }) + ' IST';
}

/**
 * Returns relative time string: "2 min ago", "5 hours ago", "just now"
 */
export function timeAgo(timestamp) {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Formats countdown HH:MM:SS or "Xm" short form.
 */
export function formatCountdown(ms, short = false) {
  if (ms <= 0) return '0:00';
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (short) {
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Converts a JS Date to IST local time string for <input type="datetime-local">.
 */
export function toISTDatetimeLocal(date) {
  const d = date?.toDate ? date.toDate() : new Date(date);
  const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 16);
}

/**
 * Converts a datetime-local IST string to UTC Date.
 */
export function fromISTDatetimeLocal(localString) {
  const ist = new Date(localString);
  return new Date(ist.getTime() - 5.5 * 60 * 60 * 1000);
}
