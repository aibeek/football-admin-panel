import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import EmptyState from '@/mobile/components/ui/EmptyState';
import LoadingBlock from '@/mobile/components/ui/LoadingBlock';
import PageHeader from '@/mobile/components/ui/PageHeader';
import MatchCard from '@/mobile/features/matches/MatchCard';
import { groupMatchesByTournament } from '@/mobile/features/matches/groupMatches';
import { formatScoreboardDate, shiftDate, toIsoDate } from '@/mobile/lib/format';
import { useMatchFeedStore } from '@/mobile/store/matchFeedStore';
import type { MatchItem, MatchStatusFilter } from '@/mobile/types/matches';

const filters: Array<{ label: string; value: MatchStatusFilter }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Live', value: 'IN_PROGRESS' },
  { label: 'Finished', value: 'COMPLETED' },
  { label: 'Scheduled', value: 'PENDING' },
];

const filterMatches = (items: MatchItem[], query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => {
    const title = item.tournament?.name?.toLowerCase() || '';
    const teams = item.participants.map((participant) => participant.teamName.toLowerCase()).join(' ');
    const venue = item.reservation?.playground?.name?.toLowerCase() || '';
    return [title, teams, venue].some((value) => value.includes(normalizedQuery));
  });
};

export default function MatchesPage() {
  const { items, loading, error, page, totalPages, loadInitial, loadMore } = useMatchFeedStore();
  const [status, setStatus] = useState<MatchStatusFilter>('ALL');
  const [dayOffset, setDayOffset] = useState(0);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const currentDate = useMemo(() => shiftDate(new Date(), dayOffset), [dayOffset]);
  const currentIsoDate = useMemo(() => toIsoDate(currentDate), [currentDate]);

  useEffect(() => {
    void loadInitial(status, currentIsoDate);
  }, [currentIsoDate, loadInitial, status]);

  const groupedMatches = useMemo(
    () => groupMatchesByTournament(filterMatches(items, deferredQuery)),
    [deferredQuery, items],
  );

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Board"
        title="Match center"
        subtitle="Extended scoreboard with search and date navigation."
      />

      <label className="block rounded-xl border border-white/6 bg-[#042634] px-4 py-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Search</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tournament, team or venue"
          className="mt-2 w-full border-none bg-transparent p-0 text-sm text-white outline-none"
        />
      </label>

      <div className="flex gap-2 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.label}
            type="button"
            onClick={() => setStatus(filter.value)}
            className={[
              'rounded-xl px-4 py-2 text-[0.78rem] font-extrabold uppercase tracking-[0.04em] transition',
              status === filter.value
                ? 'bg-accent-pink text-white'
                : 'bg-[#083042] text-white/80 hover:bg-[#0c3950]',
            ].join(' ')}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[42px,1fr,42px] gap-2">
        <button
          type="button"
          onClick={() => setDayOffset((value) => value - 1)}
          className="flex h-10 items-center justify-center rounded-xl bg-[#042634] text-white/80 transition hover:bg-[#083042] hover:text-white"
          aria-label="Previous day"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-[1.8]" fill="none">
            <path d="m14 7-5 5 5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#042634] text-sm font-extrabold uppercase tracking-[0.06em] text-white">
          <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-[1.8]" fill="none">
            <path
              d="M7 4.75v2.5M17 4.75v2.5M4.75 8.5h14.5M6 6.75h12A1.25 1.25 0 0 1 19.25 8v10A1.25 1.25 0 0 1 18 19.25H6A1.25 1.25 0 0 1 4.75 18V8A1.25 1.25 0 0 1 6 6.75Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {formatScoreboardDate(currentDate)}
        </div>

        <button
          type="button"
          onClick={() => setDayOffset((value) => value + 1)}
          className="flex h-10 items-center justify-center rounded-xl bg-[#042634] text-white/80 transition hover:bg-[#083042] hover:text-white"
          aria-label="Next day"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-[1.8]" fill="none">
            <path d="m10 7 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {loading && items.length === 0 ? <LoadingBlock lines={5} /> : null}

      {error ? (
        <div className="rounded-xl border border-accent-pink/25 bg-accent-pink/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {!loading && groupedMatches.length === 0 ? (
        <EmptyState
          title="No results"
          description="Nothing matches the current search and status combination."
        />
      ) : null}

      <div className="space-y-3">
        {groupedMatches.map((group) => (
          <section key={group.key} className="overflow-hidden rounded-2xl border border-white/6 bg-[#03212e]">
            <div className="bg-[#0a3551] px-3 py-2.5">
              <p className="truncate text-[0.92rem] font-bold text-white">{group.title}</p>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-white/60">{group.subtitle}</p>
            </div>

            <div className="divide-y divide-white/6">
              {group.items.map((item) => (
                <MatchCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {page + 1 < totalPages ? (
        <button
          type="button"
          onClick={() => void loadMore()}
          className="w-full rounded-xl bg-[#083042] px-4 py-3 text-sm font-extrabold uppercase tracking-[0.04em] text-white transition hover:bg-[#0c3950]"
        >
          {loading ? 'Loading...' : 'More matches'}
        </button>
      ) : null}
    </div>
  );
}
