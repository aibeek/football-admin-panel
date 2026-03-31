import { formatKickoffTime } from '@/mobile/lib/format';
import type { MatchItem } from '@/mobile/types/matches';

interface MatchCardProps {
  item: MatchItem;
}

const statusBadge: Record<MatchItem['status'], string> = {
  PENDING: 'border-white/15 text-white/80',
  IN_PROGRESS: 'border-accent-pink bg-accent-pink text-white',
  COMPLETED: 'border-white/10 bg-white/5 text-white/70',
  CANCELLED: 'border-white/10 bg-white/5 text-red-200',
};

const statusLabel: Record<MatchItem['status'], string> = {
  PENDING: 'Preview',
  IN_PROGRESS: 'Live',
  COMPLETED: 'FT',
  CANCELLED: 'Off',
};

export default function MatchCard({ item }: MatchCardProps) {
  const [homeTeam, awayTeam] = item.participants.slice(0, 2);

  return (
    <div className="grid grid-cols-[18px,1fr,62px] items-center gap-3 px-3 py-3">
      <button
        type="button"
        className="flex h-5 w-5 items-center justify-center rounded-full text-white/55 transition hover:text-white"
        aria-label="Save match"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-[1.8]" fill="none">
          <path
            d="m12 19.5-5.25 2.75 1-5.83L3.5 12l5.88-.85L12 6l2.62 5.15L20.5 12l-4.25 4.42 1 5.83L12 19.5Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[0.95rem] font-semibold leading-5 text-white">
              {homeTeam?.teamName || 'Team pending'}
            </p>
            <p className="mt-1 truncate text-[0.95rem] font-semibold leading-5 text-[#d9e3e9]">
              {awayTeam?.teamName || 'Opponent pending'}
            </p>
          </div>
        </div>
      </div>

      <div className="text-right">
        <p className="text-[0.9rem] font-medium text-[#b8c9d3]">{formatKickoffTime(item.startTime)}</p>
        <span
          className={[
            'mt-1 inline-flex min-w-[3.2rem] justify-center rounded-md border px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.08em]',
            statusBadge[item.status],
          ].join(' ')}
        >
          {statusLabel[item.status]}
        </span>
      </div>
    </div>
  );
}
