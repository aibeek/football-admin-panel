import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const primaryTabs = [
  { to: '/', label: 'Scores' },
  { to: '/news', label: 'News' },
];

const isScoresSection = (pathname: string) => !pathname.startsWith('/news');

export default function MobileLayout() {
  const location = useLocation();

  return (
    <div className="mobile-shell-page min-h-screen">
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-[#001a24] shadow-shell">
        <header className="sticky top-0 z-30 border-b border-white/5 bg-[#001f2b]">
          <div className="px-4 pb-3 pt-[calc(0.85rem+env(safe-area-inset-top))]">
            <div className="flex items-center justify-between gap-3">
              <Link to="/" className="flex min-w-0 items-center gap-3">
                <div className="relative h-9 w-9 rounded-full bg-[#042733]">
                  <span className="absolute left-1 top-3 h-2 w-2 rounded-full bg-white" />
                  <span className="absolute left-2 top-5 h-2 w-2 rounded-full bg-white" />
                  <span className="absolute left-4 top-6 h-2 w-2 rounded-full bg-white" />
                  <span className="absolute left-5 top-2 h-5 w-3 -rotate-[55deg] rounded-full bg-accent-pink" />
                  <span className="absolute left-4 top-2 h-2 w-6 rotate-[10deg] rounded-full bg-gold" />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-display text-[1.35rem] font-bold uppercase tracking-[0.04em] text-white">
                    Sport Empire
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  to="/matches"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#082733] text-white/80 transition hover:bg-[#0c3140] hover:text-white"
                  aria-label="Open board"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-[1.8]" fill="none">
                    <path d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" stroke="currentColor" strokeLinecap="round" />
                  </svg>
                </Link>
                <Link
                  to="/settings"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#082733] text-white/80 transition hover:bg-[#0c3140] hover:text-white"
                  aria-label="Open settings"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-[1.8]" fill="none">
                    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <nav className="grid grid-cols-2">
            {primaryTabs.map((tab) => {
              const active = tab.to === '/news' ? location.pathname.startsWith('/news') : isScoresSection(location.pathname);

              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.to === '/'}
                  className={[
                    'flex items-center justify-center gap-2 border-b-4 px-4 py-3 text-sm font-extrabold uppercase tracking-[0.05em] transition',
                    active
                      ? 'border-accent-pink bg-[#001823] text-white'
                      : 'border-transparent bg-[#01202b] text-white/72 hover:text-white',
                  ].join(' ')}
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center">
                    {tab.to === '/' ? (
                      <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-[1.8]" fill="none">
                        <path
                          d="M5 4.75h14A1.25 1.25 0 0 1 20.25 6v12A1.25 1.25 0 0 1 19 19.25H5A1.25 1.25 0 0 1 3.75 18V6A1.25 1.25 0 0 1 5 4.75Zm0 0v14.5m4-10h7m-7 4h7m-7 4h4"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-[1.8]" fill="none">
                        <path
                          d="M6 5.25h12A1.75 1.75 0 0 1 19.75 7v10A1.75 1.75 0 0 1 18 18.75H6A1.75 1.75 0 0 1 4.25 17V7A1.75 1.75 0 0 1 6 5.25Zm2 3.25h8M8 12h8M8 15.5h5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  {tab.label}
                </NavLink>
              );
            })}
          </nav>
        </header>

        <main className="px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
