import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getErrorMessage } from '@/mobile/api/http';
import { tournamentsApi } from '@/mobile/api/tournaments';
import EmptyState from '@/mobile/components/ui/EmptyState';
import LoadingBlock from '@/mobile/components/ui/LoadingBlock';
import PageHeader from '@/mobile/components/ui/PageHeader';
import { formatDateLabel, formatDateRangeLabel } from '@/mobile/lib/format';
import type { TournamentDetail } from '@/mobile/types/tournaments';

interface DetailState {
  loading: boolean;
  error: string | null;
  item: TournamentDetail | null;
}

const initialState: DetailState = {
  loading: true,
  error: null,
  item: null,
};

const infoRows = (item: TournamentDetail) =>
  [
    item.sportTypeId ? { label: 'Sport type', value: `#${item.sportTypeId}` } : null,
    item.categoryId ? { label: 'Category', value: `#${item.categoryId}` } : null,
    item.cityId ? { label: 'City', value: `#${item.cityId}` } : null,
    { label: 'Tournament ID', value: `#${item.id}` },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

export default function TournamentDetailPage() {
  const { id } = useParams();
  const [state, setState] = useState<DetailState>(initialState);
  const numericId = Number(id);

  useEffect(() => {
    if (!Number.isFinite(numericId) || numericId <= 0) {
      setState({
        loading: false,
        error: 'Tournament not found.',
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
        const item = await tournamentsApi.getById(numericId);

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
          eyebrow="Tournament"
          title="Loading tournament"
          subtitle="Fetching the public tournament details from the dashboard-backed API."
          action={
            <Link
              to="/"
              className="rounded-xl border border-white/10 bg-[#042634] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white/80 transition hover:bg-[#083042] hover:text-white"
            >
              Back
            </Link>
          }
        />
        <LoadingBlock lines={6} />
      </div>
    );
  }

  if (state.error || !state.item) {
    return (
      <div className="space-y-4">
        <PageHeader
          eyebrow="Tournament"
          title="Tournament details"
          subtitle="This screen reads directly from the public tournament endpoint."
          action={
            <Link
              to="/"
              className="rounded-xl border border-white/10 bg-[#042634] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white/80 transition hover:bg-[#083042] hover:text-white"
            >
              Back
            </Link>
          }
        />
        <EmptyState title="Tournament unavailable" description={state.error || 'The tournament could not be loaded.'} />
      </div>
    );
  }

  const item = state.item;

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Tournament"
        title={item.name}
        subtitle="Public tournament card sourced from admin data."
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
        <div className="bg-gradient-to-br from-[#5d4317] via-[#2d2410] to-[#082230] px-4 py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold/80">Competition</p>
          <h2 className="mt-2 font-display text-[1.7rem] font-bold text-white">{item.name}</h2>
          <p className="mt-2 text-sm leading-6 text-white/72">{formatDateRangeLabel(item.startDate, item.endDate)}</p>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/6">
          <div className="bg-[#03212e] px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Start</p>
            <p className="mt-2 text-lg font-bold text-white">{formatDateLabel(item.startDate)}</p>
          </div>
          <div className="bg-[#03212e] px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">End</p>
            <p className="mt-2 text-lg font-bold text-white">{formatDateLabel(item.endDate)}</p>
          </div>
          <div className="col-span-2 bg-[#03212e] px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Scheduled matches</p>
            <p className="mt-2 text-2xl font-extrabold text-white">{item.numberOfMatches ?? 0}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-white/6 bg-[#03212e] p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Identifiers</p>
        <div className="mt-3 grid gap-3">
          {infoRows(item).map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 rounded-[1rem] border border-white/6 bg-[#042634] px-4 py-3 text-sm"
            >
              <span className="text-white/60">{row.label}</span>
              <span className="font-semibold text-white">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-white/6 bg-[#021c27] p-4">
        <p className="font-display text-lg font-bold text-white">Next layer</p>
        <p className="mt-2 text-sm leading-6 text-[#9db2bd]">
          This public endpoint currently exposes the tournament shell. Standings, bracket, participant roster and match timeline can be added next without changing the route structure.
        </p>
      </section>
    </div>
  );
}
