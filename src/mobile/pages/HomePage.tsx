import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '@/mobile/api/http';
import { playgroundsApi } from '@/mobile/api/playgrounds';
import { sportClubsApi } from '@/mobile/api/sportClubs';
import { tournamentsApi } from '@/mobile/api/tournaments';
import EmptyState from '@/mobile/components/ui/EmptyState';
import LoadingBlock from '@/mobile/components/ui/LoadingBlock';
import ContentSpotlightCard from '@/mobile/features/discover/ContentSpotlightCard';
import ContentSpotlightSection from '@/mobile/features/discover/ContentSpotlightSection';
import MatchCard from '@/mobile/features/matches/MatchCard';
import { groupMatchesByTournament } from '@/mobile/features/matches/groupMatches';
import { formatCurrencyLabel, formatDateRangeLabel, formatScoreboardDate, shiftDate, toIsoDate } from '@/mobile/lib/format';
import { useMatchFeedStore } from '@/mobile/store/matchFeedStore';
import type { MatchStatusFilter } from '@/mobile/types/matches';
import type { PlaygroundItem } from '@/mobile/types/playgrounds';
import type { SportClubAddress, SportClubItem } from '@/mobile/types/sportClubs';
import type { TournamentItem } from '@/mobile/types/tournaments';

const sports = ['Football', 'Tennis', 'Basketball', 'Hockey'];

const filters: Array<{ label: string; value: MatchStatusFilter }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Live', value: 'IN_PROGRESS' },
  { label: 'Finished', value: 'COMPLETED' },
  { label: 'Scheduled', value: 'PENDING' },
];

interface SpotlightState {
  loading: boolean;
  error: string | null;
  tournaments: TournamentItem[];
  clubs: SportClubItem[];
  playgrounds: PlaygroundItem[];
}

const initialSpotlightState: SpotlightState = {
  loading: true,
  error: null,
  tournaments: [],
  clubs: [],
  playgrounds: [],
};

const getPrimaryAddress = (addresses: SportClubAddress[] = []) =>
  addresses.find((item) => item.isPrimary) || addresses[0];

const formatClubLocation = (club: SportClubItem) => {
  const address = getPrimaryAddress(club.addresses || []);
  const parts = [address?.cityName, address?.streetLine1].filter(Boolean);

  if (parts.length === 0) {
    return 'Location pending';
  }

  return parts.join(', ');
};

const formatPlaygroundAvailability = (playground: PlaygroundItem) => {
  if (!playground.availableFrom && !playground.availableTo) {
    return 'Open schedule on request';
  }

  if (playground.availableFrom && playground.availableTo) {
    return `${playground.availableFrom} - ${playground.availableTo}`;
  }

  return playground.availableFrom || playground.availableTo || 'Open schedule on request';
};

const renderRailSkeleton = (prefix: string) =>
  Array.from({ length: 3 }).map((_, index) => (
    <div
      key={`${prefix}-${index}`}
      className="h-[210px] min-w-[232px] animate-pulse rounded-2xl border border-white/6 bg-[#062635]"
    />
  ));

export default function HomePage() {
  const { items, loading, error, page, totalPages, loadInitial, loadMore } = useMatchFeedStore();
  const [selectedSport, setSelectedSport] = useState('Football');
  const [status, setStatus] = useState<MatchStatusFilter>('ALL');
  const [dayOffset, setDayOffset] = useState(0);
  const [spotlights, setSpotlights] = useState<SpotlightState>(initialSpotlightState);

  const currentDate = useMemo(() => shiftDate(new Date(), dayOffset), [dayOffset]);
  const currentIsoDate = useMemo(() => toIsoDate(currentDate), [currentDate]);
  const groupedMatches = useMemo(() => groupMatchesByTournament(items), [items]);

  useEffect(() => {
    void loadInitial(status, currentIsoDate);
  }, [currentIsoDate, loadInitial, status]);

  useEffect(() => {
    let cancelled = false;

    const loadSpotlights = async () => {
      setSpotlights((current) => ({
        ...current,
        loading: true,
        error: null,
      }));

      const results = await Promise.allSettled([
        tournamentsApi.getPreview(4),
        sportClubsApi.getPreview(4),
        playgroundsApi.getPreview(4),
      ]);

      if (cancelled) {
        return;
      }

      const [tournamentsResult, clubsResult, playgroundsResult] = results;
      const firstRejected = results.find(
        (result): result is PromiseRejectedResult => result.status === 'rejected',
      );

      setSpotlights({
        loading: false,
        error:
          firstRejected && results.every((result) => result.status === 'rejected')
            ? getErrorMessage(firstRejected.reason)
            : null,
        tournaments: tournamentsResult.status === 'fulfilled' ? tournamentsResult.value : [],
        clubs: clubsResult.status === 'fulfilled' ? clubsResult.value : [],
        playgrounds: playgroundsResult.status === 'fulfilled' ? playgroundsResult.value : [],
      });
    };

    void loadSpotlights();

    return () => {
      cancelled = true;
    };
  }, []);

  const showSpotlights =
    spotlights.loading ||
    Boolean(spotlights.error) ||
    spotlights.tournaments.length > 0 ||
    spotlights.clubs.length > 0 ||
    spotlights.playgrounds.length > 0;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto border-b border-white/6 pb-1">
        <div className="flex min-w-max items-center gap-4 pr-4">
          {sports.map((sport) => (
            <button
              key={sport}
              type="button"
              onClick={() => setSelectedSport(sport)}
              className={[
                'relative pb-2 text-[0.82rem] font-extrabold uppercase tracking-[0.03em] transition',
                selectedSport === sport ? 'text-white' : 'text-white/72',
              ].join(' ')}
            >
              {sport}
              {selectedSport === sport ? <span className="absolute inset-x-0 -bottom-[3px] h-[3px] rounded-full bg-accent-pink" /> : null}
            </button>
          ))}
          <button type="button" className="ml-auto pb-2 text-white/55">
            <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-[1.8]" fill="none">
              <path d="m7 10 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto py-1">
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

        <Link
          to="/favorites"
          className="rounded-xl bg-[#083042] px-4 py-2 text-[0.78rem] font-extrabold uppercase tracking-[0.04em] text-white/80 transition hover:bg-[#0c3950]"
        >
          Saved
        </Link>
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
          title="No matches for this date"
          description="Try another day or switch the live-status filter. The board is already connected to the public backend feed."
        />
      ) : null}

      <div className="space-y-3">
        {groupedMatches.map((group) => (
          <section key={group.key} className="overflow-hidden rounded-2xl border border-white/6 bg-[#03212e]">
            <div className="flex items-center justify-between gap-3 bg-[#0a3551] px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-[0.92rem] font-bold text-white">{group.title}</p>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-white/60">{group.subtitle}</p>
              </div>
              <button type="button" className="text-white/60">
                <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-[1.8]" fill="none">
                  <path d="m7 14 5-5 5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="divide-y divide-white/6">
              {group.items.map((item) => (
                <MatchCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {showSpotlights ? (
        <div className="space-y-3">
          <ContentSpotlightSection
            eyebrow="Admin sync"
            title="Tournaments"
            subtitle="Competitions created in the dashboard now flow into the mobile home feed."
          >
            {spotlights.loading && spotlights.tournaments.length === 0 ? renderRailSkeleton('tournament-skeleton') : null}

            {spotlights.tournaments.map((tournament) => (
              <ContentSpotlightCard
                key={tournament.id}
                tone="gold"
                eyebrow="Tournament"
                title={tournament.name}
                subtitle={formatDateRangeLabel(tournament.startDate, tournament.endDate)}
                meta={
                  tournament.numberOfMatches
                    ? `${tournament.numberOfMatches} scheduled matches`
                    : 'Waiting for bracket generation'
                }
                badge={tournament.numberOfMatches ? 'Live feed' : undefined}
                to={`/tournaments/${tournament.id}`}
              />
            ))}

            {!spotlights.loading && spotlights.tournaments.length === 0 ? (
              <div className="min-w-[232px] rounded-2xl border border-dashed border-white/10 bg-[#03212e] px-4 py-5 text-sm text-white/60">
                No tournaments published yet.
              </div>
            ) : null}
          </ContentSpotlightSection>

          <ContentSpotlightSection
            eyebrow="Admin sync"
            title="Sport clubs"
            subtitle="Active clubs configured in admin are surfaced here for users."
          >
            {spotlights.loading && spotlights.clubs.length === 0 ? renderRailSkeleton('club-skeleton') : null}

            {spotlights.clubs.map((club) => (
              <ContentSpotlightCard
                key={club.id}
                tone="blue"
                eyebrow={club.sportTypeName || 'Club'}
                title={club.name}
                subtitle={club.description || formatClubLocation(club)}
                meta={[
                  club.memberCount ? `${club.memberCount} members` : null,
                  club.clubType ? club.clubType.replace(/_/g, ' ') : null,
                  formatClubLocation(club),
                ]
                  .filter(Boolean)
                  .join(' | ')}
                badge={club.active ? 'Active' : undefined}
                to={`/clubs/${club.id}`}
              />
            ))}

            {!spotlights.loading && spotlights.clubs.length === 0 ? (
              <div className="min-w-[232px] rounded-2xl border border-dashed border-white/10 bg-[#03212e] px-4 py-5 text-sm text-white/60">
                No active clubs available yet.
              </div>
            ) : null}
          </ContentSpotlightSection>

          <ContentSpotlightSection
            eyebrow="Admin sync"
            title="Playgrounds"
            subtitle="Venues and prices from the admin panel are now visible in the mobile feed."
          >
            {spotlights.loading && spotlights.playgrounds.length === 0 ? renderRailSkeleton('playground-skeleton') : null}

            {spotlights.playgrounds.map((playground) => (
              <ContentSpotlightCard
                key={playground.id}
                tone="pink"
                eyebrow={playground.sportType?.name || 'Venue'}
                title={playground.name}
                subtitle={playground.address || 'Address pending'}
                meta={[
                  formatCurrencyLabel(playground.pricePerHour),
                  formatPlaygroundAvailability(playground),
                  playground.maxCapacity ? `${playground.maxCapacity} players` : null,
                ]
                  .filter(Boolean)
                  .join(' | ')}
                imageUrl={playground.images?.[0] || null}
                badge={playground.active ? 'Ready' : undefined}
                to={`/playgrounds/${playground.id}`}
              />
            ))}

            {!spotlights.loading && spotlights.playgrounds.length === 0 ? (
              <div className="min-w-[232px] rounded-2xl border border-dashed border-white/10 bg-[#03212e] px-4 py-5 text-sm text-white/60">
                No public playgrounds available yet.
              </div>
            ) : null}
          </ContentSpotlightSection>

          {spotlights.error ? (
            <div className="rounded-xl border border-accent-pink/25 bg-accent-pink/10 px-4 py-3 text-sm text-rose-100">
              {spotlights.error}
            </div>
          ) : null}
        </div>
      ) : null}

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
