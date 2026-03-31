import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getErrorMessage } from '@/mobile/api/http';
import { sportClubsApi } from '@/mobile/api/sportClubs';
import EmptyState from '@/mobile/components/ui/EmptyState';
import LoadingBlock from '@/mobile/components/ui/LoadingBlock';
import PageHeader from '@/mobile/components/ui/PageHeader';
import { formatCurrencyLabel } from '@/mobile/lib/format';
import type { SportClubAddress, SportClubAgeCategory, SportClubDetail, SportClubOpeningHours } from '@/mobile/types/sportClubs';

interface DetailState {
  loading: boolean;
  error: string | null;
  item: SportClubDetail | null;
}

const initialState: DetailState = {
  loading: true,
  error: null,
  item: null,
};

const formatEnumLabel = (value?: string) =>
  value
    ? value
        .toLowerCase()
        .split('_')
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' ')
    : 'Not specified';

const formatDayLabel = (value?: string) => formatEnumLabel(value);

const getPrimaryAddress = (addresses: SportClubAddress[] = []) =>
  addresses.find((item) => item.isPrimary) || addresses[0];

const formatAddress = (address?: SportClubAddress) => {
  if (!address) {
    return 'Address pending';
  }

  return [address.cityName, address.streetLine1, address.streetLine2, address.zipCode].filter(Boolean).join(', ');
};

const formatAgeRange = (item: SportClubAgeCategory) => {
  if (item.minAge !== undefined && item.maxAge !== undefined) {
    return `${item.minAge}-${item.maxAge} yrs`;
  }

  if (item.minAge !== undefined) {
    return `${item.minAge}+ yrs`;
  }

  return 'Age flexible';
};

const formatOpeningHours = (item: SportClubOpeningHours) => {
  if (item.isClosed) {
    return 'Closed';
  }

  if (item.openTime && item.closeTime) {
    return `${item.openTime} - ${item.closeTime}`;
  }

  return item.openTime || item.closeTime || 'Hours pending';
};

export default function SportClubDetailPage() {
  const { id } = useParams();
  const [state, setState] = useState<DetailState>(initialState);
  const numericId = Number(id);

  useEffect(() => {
    if (!Number.isFinite(numericId) || numericId <= 0) {
      setState({
        loading: false,
        error: 'Sport club not found.',
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
        const item = await sportClubsApi.getById(numericId);

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
          eyebrow="Club"
          title="Loading club"
          subtitle="Fetching the public sport club profile."
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
          eyebrow="Club"
          title="Club details"
          subtitle="This screen reads the public sport club endpoint."
          action={
            <Link
              to="/"
              className="rounded-xl border border-white/10 bg-[#042634] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white/80 transition hover:bg-[#083042] hover:text-white"
            >
              Back
            </Link>
          }
        />
        <EmptyState title="Club unavailable" description={state.error || 'The sport club could not be loaded.'} />
      </div>
    );
  }

  const item = state.item;
  const primaryAddress = getPrimaryAddress(item.addresses || []);
  const statCards = [
    { label: 'Members', value: item.memberCount ? String(item.memberCount) : 'N/A' },
    { label: 'Founded', value: item.establishmentYear ? String(item.establishmentYear) : 'N/A' },
    { label: 'Fee', value: formatCurrencyLabel(item.membershipFee, 'KZT') },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Club"
        title={item.name}
        subtitle={item.sportTypeName || 'Sport club profile'}
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
        <div className="bg-gradient-to-br from-[#0f3f66] via-[#0a2f49] to-[#062130] px-4 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">{formatEnumLabel(item.clubType)}</p>
              <h2 className="mt-2 font-display text-[1.7rem] font-bold text-white">{item.name}</h2>
              <p className="mt-2 text-sm leading-6 text-white/72">{item.description || formatAddress(primaryAddress)}</p>
            </div>
            {item.active ? (
              <span className="rounded-full bg-accent-pink px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                Active
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

      <section className="rounded-[1.6rem] border border-white/6 bg-[#03212e] p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Contact & location</p>
        <div className="mt-3 grid gap-3">
          <div className="rounded-[1rem] border border-white/6 bg-[#042634] px-4 py-3 text-sm text-white">
            <p className="text-white/55">Primary address</p>
            <p className="mt-1 font-semibold">{formatAddress(primaryAddress)}</p>
          </div>

          {item.contactPhone ? (
            <a href={`tel:${item.contactPhone}`} className="rounded-[1rem] border border-white/6 bg-[#042634] px-4 py-3 text-sm text-white">
              <p className="text-white/55">Phone</p>
              <p className="mt-1 font-semibold">{item.contactPhone}</p>
            </a>
          ) : null}

          {item.contactEmail ? (
            <a href={`mailto:${item.contactEmail}`} className="rounded-[1rem] border border-white/6 bg-[#042634] px-4 py-3 text-sm text-white">
              <p className="text-white/55">Email</p>
              <p className="mt-1 font-semibold">{item.contactEmail}</p>
            </a>
          ) : null}

          {item.website ? (
            <a
              href={item.website}
              target="_blank"
              rel="noreferrer"
              className="rounded-[1rem] border border-white/6 bg-[#042634] px-4 py-3 text-sm text-white"
            >
              <p className="text-white/55">Website</p>
              <p className="mt-1 font-semibold">{item.website}</p>
            </a>
          ) : null}
        </div>
      </section>

      {item.membershipBenefits || item.facilities ? (
        <section className="rounded-[1.6rem] border border-white/6 bg-[#021c27] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Membership</p>
          {item.membershipBenefits ? (
            <p className="mt-3 text-sm leading-6 text-[#d8e2e8]">{item.membershipBenefits}</p>
          ) : null}
          {item.facilities ? (
            <p className="mt-3 text-sm leading-6 text-[#9db2bd]">{item.facilities}</p>
          ) : null}
        </section>
      ) : null}

      {item.ageCategories && item.ageCategories.length > 0 ? (
        <section className="rounded-[1.6rem] border border-white/6 bg-[#03212e] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Age groups</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {item.ageCategories.map((category) => (
              <div key={category.id} className="min-w-[140px] rounded-[1rem] border border-white/6 bg-[#042634] px-4 py-3">
                <p className="text-sm font-bold text-white">{category.ageCategoryDisplayName || formatEnumLabel(category.ageCategory)}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.08em] text-white/50">{formatAgeRange(category)}</p>
                <p className="mt-2 text-xs text-[#9db2bd]">
                  {category.currentParticipants ?? 0}/{category.maxParticipants ?? 'N/A'} participants
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {item.openingHours && item.openingHours.length > 0 ? (
        <section className="rounded-[1.6rem] border border-white/6 bg-[#03212e] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Opening hours</p>
          <div className="mt-3 grid gap-2">
            {item.openingHours.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between gap-3 rounded-[1rem] border border-white/6 bg-[#042634] px-4 py-3 text-sm"
              >
                <span className="font-semibold text-white">{formatDayLabel(slot.dayOfWeek)}</span>
                <span className="text-white/65">{formatOpeningHours(slot)}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {item.teams && item.teams.length > 0 ? (
        <section className="rounded-[1.6rem] border border-white/6 bg-[#03212e] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Teams</p>
          <div className="mt-3 grid gap-3">
            {item.teams.map((team) => (
              <div key={team.id} className="rounded-[1rem] border border-white/6 bg-[#042634] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{team.name}</p>
                  <span className="text-xs font-bold uppercase tracking-[0.08em] text-white/45">#{team.id}</span>
                </div>
                {team.description ? <p className="mt-2 text-sm leading-6 text-[#9db2bd]">{team.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
