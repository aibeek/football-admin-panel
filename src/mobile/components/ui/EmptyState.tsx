interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#042330] px-4 py-8 text-center">
      <p className="font-display text-lg font-bold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#9db2bd]">{description}</p>
    </div>
  );
}
