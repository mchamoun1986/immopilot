interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-xl border-2 border-dashed border-[var(--gris-border)] bg-[var(--gris-fond)] p-12 text-center">
      <div className="mb-4 text-5xl">{icon}</div>
      <p className="mb-2 text-base font-semibold text-gray-700">{title}</p>
      <p className="mb-6 text-sm text-gray-500">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-xl bg-[var(--bleu-action)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
