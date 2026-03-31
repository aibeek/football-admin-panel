import { Link } from 'react-router-dom';
import PageHeader from '@/mobile/components/ui/PageHeader';
import { getRuntimeLabel, getRuntimeUserName } from '@/mobile/lib/telegram';
import { useAuthStore } from '@/mobile/store/authStore';
import { useShellStore } from '@/mobile/store/shellStore';

export default function ProfilePage() {
  const runtime = useShellStore((state) => state.runtime);
  const { status, user, error, loginWithTelegram, logout, clearError } = useAuthStore();
  const fullName = user
    ? [user.firstname, user.lastname].filter(Boolean).join(' ').trim() || user.telegramUsername || `User #${user.id}`
    : getRuntimeUserName(runtime.user);
  const avatarUrl = user?.telegramPhotoUrl || user?.profilePictureUrl || runtime.user?.photo_url || null;
  const initials =
    fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((chunk) => chunk[0]?.toUpperCase())
      .join('') || 'SE';
  const modeLabel =
    status === 'authenticated' ? 'Authenticated' : runtime.user ? 'Telegram runtime' : 'Public preview';
  const accountRows =
    status === 'authenticated' && user
      ? [
          { label: 'User ID', value: String(user.id) },
          { label: 'Telegram', value: user.telegramUsername || (user.telegramId ? `#${user.telegramId}` : 'not linked') },
          { label: 'Phone', value: user.phone || 'not linked' },
          { label: 'Roles', value: user.roles.length > 0 ? user.roles.join(', ') : 'no roles' },
        ]
      : [
          { label: 'Source', value: getRuntimeLabel(runtime) },
          { label: 'Viewer', value: fullName },
          { label: 'Platform', value: runtime.platformName },
          { label: 'Mode', value: modeLabel },
        ];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Settings"
        title="Settings & access"
        subtitle="Telegram login, runtime state and admin access now sit inside the same Sport Empire mobile shell."
      />

      {error ? (
        <div className="rounded-[1.5rem] border border-accent-pink/20 bg-accent-pink/10 px-4 py-3 text-sm text-rose-100">
          <div className="flex items-start justify-between gap-3">
            <span>{error}</span>
            <button type="button" onClick={clearError} className="font-bold text-white">
              x
            </button>
          </div>
        </div>
      ) : null}

      <section className="overflow-hidden rounded-[1.9rem] border border-gold/15 bg-hero p-5 shadow-card">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="h-16 w-16 rounded-[1.4rem] border border-gold/20 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-gold/20 bg-gold/10 font-display text-lg font-bold text-gold">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/70">Identity</p>
            <h3 className="mt-2 truncate font-display text-2xl font-bold text-white">{fullName}</h3>
            <p className="mt-2 text-sm text-ink/70">
              {status === 'authenticated' ? 'Telegram session active' : getRuntimeLabel(runtime)}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">Platform</p>
            <p className="mt-2 text-lg font-bold text-white">{runtime.platformName}</p>
          </div>
          <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">Mode</p>
            <p className="mt-2 text-lg font-bold text-white">{modeLabel}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-card-bg/80 p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold/70">Account snapshot</p>
        <div className="mt-4 grid gap-3">
          {accountRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-white/10 bg-darkest-bg/35 px-4 py-3 text-sm"
            >
              <span className="text-ink/55">{row.label}</span>
              <span className="text-right font-semibold text-white">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {status !== 'authenticated' ? (
        <section className="rounded-[1.75rem] border border-gold/15 bg-darkest-bg/80 p-5 shadow-card">
          <p className="font-display text-lg font-bold text-white">Telegram login</p>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            If the screen is opened inside Telegram, the client can create a backend session from Mini App init data and unlock personalized flows.
          </p>
          <button
            type="button"
            onClick={() => void loginWithTelegram()}
            disabled={status === 'loading'}
            className="mt-4 rounded-[1.2rem] bg-gold px-4 py-3 text-sm font-bold text-darkest-bg transition hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'loading' ? 'Connecting...' : 'Connect Telegram'}
          </button>
        </section>
      ) : (
        <section className="rounded-[1.75rem] border border-white/10 bg-card-bg/80 p-5 shadow-card">
          <p className="font-display text-lg font-bold text-white">Session active</p>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            The token is already stored locally and the profile was loaded from the protected backend endpoint.
          </p>
          <button
            type="button"
            onClick={logout}
            className="mt-4 rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            Sign out
          </button>
        </section>
      )}

      <section className="rounded-[1.75rem] border border-white/10 bg-card-bg/80 p-5 shadow-card">
        <p className="font-display text-lg font-bold text-white">Actions</p>
        <div className="mt-4 grid gap-3">
          <Link
            to="/dashboard"
            className="rounded-[1.2rem] border border-gold/20 bg-gold/10 px-4 py-3 text-sm font-bold text-gold transition hover:bg-gold/15"
          >
            Open admin panel
          </Link>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-darkest-bg/80 p-5 shadow-card">
        <p className="font-display text-lg font-bold text-white">What comes next</p>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Favorites, join match, my reservations, club memberships and personal notification settings can now be built on top of this shell.
        </p>
      </section>
    </div>
  );
}
