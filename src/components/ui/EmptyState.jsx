export default function EmptyState({ icon = '🏏', title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      {subtitle && <p className="text-sm text-text-secondary mb-6">{subtitle}</p>}
      {action}
    </div>
  );
}
