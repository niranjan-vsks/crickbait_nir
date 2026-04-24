export default function Avatar({ photoURL, displayName, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };
  const dim = sizes[size] ?? sizes.md;
  const initial = (displayName || '?').charAt(0).toUpperCase();

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={displayName || 'avatar'}
        className={`${dim} rounded-full object-cover border border-white/10 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${dim} rounded-full bg-orange/20 border border-orange/40 flex items-center justify-center font-bold text-orange ${className}`}
    >
      {initial}
    </div>
  );
}
