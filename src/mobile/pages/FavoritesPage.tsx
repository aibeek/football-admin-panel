import EmptyState from '@/mobile/components/ui/EmptyState';
import PageHeader from '@/mobile/components/ui/PageHeader';
import { useAuthStore } from '@/mobile/store/authStore';

const nextItems = [
  'Telegram auth endpoint and session bootstrap',
  'Saved entities grouped by type',
  'Bookmark actions on matches, clubs and stories',
];

export default function FavoritesPage() {
  const authStatus = useAuthStore((state) => state.status);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Saved"
        title="Saved items"
        subtitle="This block is still a functional placeholder, but it now matches the same Sport Empire visual language as the rest of the mobile app."
      />

      <div className="rounded-[1.75rem] border border-gold/15 bg-hero p-5 text-ink shadow-card">
        <p className="font-display text-lg font-bold text-white">Next delivery slice</p>
        <div className="mt-4 space-y-3">
          {nextItems.map((item, index) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6"
            >
              <span className="font-display text-sm font-bold text-gold">{String(index + 1).padStart(2, '0')}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-card-bg/80 p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold/70">Readiness</p>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Auth is already present, so the next step here is wiring real saved entities instead of static placeholders.
        </p>
      </div>

      {authStatus === 'authenticated' ? (
        <EmptyState
          title="Session is ready"
          description="The user is already authenticated. This screen can be connected to the real favorites API without rebuilding the mobile shell."
        />
      ) : (
        <EmptyState
          title="Authorization required"
          description="Open the app inside Telegram Mini App and complete Telegram login. After that this screen can switch to the live favorites flow."
        />
      )}
    </div>
  );
}
