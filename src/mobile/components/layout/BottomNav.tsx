import { NavLink } from 'react-router-dom';

const items = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <path
        d="M3.75 9.75 12 3l8.25 6.75V20.25a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.5h-4.5v4.5a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75V9.75Z"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    to: '/news',
    label: 'News',
    icon: (
      <path
        d="M5.25 5.25h10.5A2.25 2.25 0 0 1 18 7.5v9.75A2.25 2.25 0 0 1 15.75 19.5H8.25A3.75 3.75 0 0 1 4.5 15.75V6A.75.75 0 0 1 5.25 5.25Zm0 0v10.5A2.25 2.25 0 0 0 7.5 18h8.25"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    to: '/matches',
    label: 'Matches',
    icon: (
      <path
        d="M7.5 3.75h9A3.75 3.75 0 0 1 20.25 7.5v9A3.75 3.75 0 0 1 16.5 20.25h-9A3.75 3.75 0 0 1 3.75 16.5v-9A3.75 3.75 0 0 1 7.5 3.75Zm0 5.25h9m-4.5-5.25v16.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    to: '/favorites',
    label: 'Saved',
    icon: (
      <path
        d="M12 20.25s-6.75-4.318-6.75-10.125A4.125 4.125 0 0 1 12 7.058a4.125 4.125 0 0 1 6.75 3.067C18.75 15.932 12 20.25 12 20.25Z"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <path
        d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 border-t border-white/10 bg-darkest-bg/95 px-2 pb-[calc(0.8rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              [
                'flex flex-col items-center justify-center rounded-[1.2rem] border px-2 py-2 text-[11px] font-semibold transition',
                isActive
                  ? 'border-gold/20 bg-gold/10 text-gold shadow-card'
                  : 'border-transparent text-ink/45 hover:bg-white/5 hover:text-ink/70',
              ].join(' ')
            }
          >
            <svg viewBox="0 0 24 24" className="mb-1 h-5 w-5 stroke-[1.6]">
              {item.icon}
            </svg>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
