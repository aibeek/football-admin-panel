import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getErrorMessage } from '@/mobile/api/http';
import { playgroundsApi } from '@/mobile/api/playgrounds';
import EmptyState from '@/mobile/components/ui/EmptyState';
import LoadingBlock from '@/mobile/components/ui/LoadingBlock';
import PageHeader from '@/mobile/components/ui/PageHeader';
import { formatCurrencyLabel } from '@/mobile/lib/format';
import type { PlaygroundDetail, PlaygroundFacilityMapping } from '@/mobile/types/playgrounds';

interface DetailState {
  loading: boolean;
  error: string | null;
  item: PlaygroundDetail | null;
}

const initialState: DetailState = {
  loading: true,
  error: null,
  item: null,
};

const formatAvailability = (item: PlaygroundDetail) => {
  if (item.availableFrom && item.availableTo) {
    return `${item.availableFrom} - ${item.availableTo}`;
  }

  return item.availableFrom || item.availableTo || 'Open schedule on request';
};

const getFacilityTitle = (item: PlaygroundFacilityMapping) => item.facility?.name || 'Facility';

export default function PlaygroundDetailPage() {
  const { id } = useParams();
  const [state, setState] = useState<DetailState>(initialState);
  const numericId = Number(id);

  useEffect(() => {
    if (!Number.isFinite(numericId) || numericId <= 0) {
      setState({
        loading: false,
        error: 'Playground not found.',
        item: null,
      });
      return;
    }

    let cancelled = false;

    const loadItem = async () => {
      setState({
        loading: true,
        error: null,
        item: null,
      });

      try {
        const item = await playgroundsApi.getById(numericId);

        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            item,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            loading: false,
            error: getErrorMessage(error),
            item: null,
          });
        }
      }
    };

    void loadItem();

    return () => {
      cancelled = true;
    };
  }, [numericId]);

  if (state.loading) {
    return (
      <div className="space-y-4">
        <PageHeader
          eyebrow="Venue"
          title="Loading venue"
          subtitle="Fetching the public playground profile."
          action={
            <Link
              to="/"
              className="rounded-xl border border-white/10 bg-[#042634] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white/80 transition hover:bg-[#083042] hover:text-white"
            >
              Back
            </Link>
          }
        />
        <LoadingBlock lines={7} />
      </div>
    );
  }

  if (state.error || !state.item) {
    return (
      <div className="space-y-4">
        <PageHeader
          eyebrow="Venue"
          title="Venue details"
          subtitle="This screen reads the public playground endpoint."
          action={
            <Link
              to="/"
              className="rounded-xl border border-white/10 bg-[#042634] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white/80 transition hover:bg-[#083042] hover:text-white"
            >
              Back
            </Link>
          }
        />
        <EmptyState title="Venue unavailable" description={state.error || 'The playground could not be loaded.'} />
      </div>
    );
  }

  const item = state.item;
  const statCards = [
    { label: 'Rate', value: formatCurrencyLabel(item.pricePerHour) },
    { label: 'Capacity', value: item.maxCapacity ? `${item.maxCapacity} players` : 'N/A' },
    { label: 'Hours', value: formatAvailability(item) },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Venue"
        title={item.name}
        subtitle={item.sportType?.name || 'Playground profile'}
        action={
          <Link
            to="/"
            className="rounded-xl border border-white/10 bg-[#042634] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white/80 transition hover:bg-[#083042] hover:text-white"
          >
            Back
          </Link>
        }
      />

      <section className="overflow-hidden rounded-[1.7rem] border border-white/6 bg-[#03212e]">
        <div
          className={item.images?.[0] ? 'bg-cover bg-center px-4 py-5' : 'bg-gradient-to-br from-[#5a1632] via-[#2a1430] to-[#062130] px-4 py-5'}
          style={
            item.images?.[0]
              ? {
                  backgroundImage: `linear-gradient(180deg, rgba(0, 19, 28, 0.24), rgba(0, 19, 28, 0.88)), url(${item.images[0]})`,
                }
              : undefined
          }
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">{item.sportType?.name || 'Venue'}</p>
              <h2 className="mt-2 font-display text-[1.7rem] font-bold text-white">{item.name}</h2>
              <p className="mt-2 text-sm leading-6 text-white/72">{item.address || 'Address pending'}</p>
            </div>
            {item.active ? (
              <span className="rounded-full bg-accent-pink px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                Ready
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-px bg-white/6">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-[#03212e] px-3 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">{stat.label}</p>
              <p className="mt-2 text-base font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {item.description ? (
        <section className="rounded-[1.6rem] border border-white/6 bg-[#021c27] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Overview</p>
          <p className="mt-3 text-sm leading-6 text-[#d8e2e8]">{item.description}</p>
        </section>
      ) : null}

      <section className="rounded-[1.6rem] border border-white/6 bg-[#03212e] p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Venue info</p>
        <div className="mt-3 grid gap-3">
          <div className="rounded-[1rem] border border-white/6 bg-[#042634] px-4 py-3 text-sm text-white">
            <p className="text-white/55">Address</p>
            <p className="mt-1 font-semibold">{item.address || 'Address pending'}</p>
          </div>
          <div className="rounded-[1rem] border border-white/6 bg-[#042634] px-4 py-3 text-sm text-white">
            <p className="text-white/55">Current capacity</p>
            <p className="mt-1 font-semibold">
              {item.currentCapacity ?? 0}
              {item.maxCapacity ? ` / ${item.maxCapacity}` : ''} players
            </p>
          </div>
          {(item.latitude !== undefined || item.longitude !== undefined) ? (
            <div className="rounded-[1rem] border border-white/6 bg-[#042634] px-4 py-3 text-sm text-white">
              <p className="text-white/55">Coordinates</p>
              <p className="mt-1 font-semibold">
                {item.latitude ?? 'N/A'}, {item.longitude ?? 'N/A'}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {item.facilities && item.facilities.length > 0 ? (
        <section className="rounded-[1.6rem] border border-white/6 bg-[#03212e] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Facilities</p>
          <div className="mt-3 grid gap-3">
            {item.facilities.map((facility) => (
              <div key={facility.id} className="rounded-[1rem] border border-white/6 bg-[#042634] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{getFacilityTitle(facility)}</p>
                  {facility.quantity ? (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white/65">
                      x{facility.quantity}
                    </span>
                  ) : null}
                </div>
                {facility.facility?.description ? (
                  <p className="mt-2 text-sm leading-6 text-[#9db2bd]">{facility.facility.description}</p>
                ) : null}
                {facility.notes ? <p className="mt-2 text-xs leading-5 text-white/50">{facility.notes}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
