import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import EmptyState from '@/mobile/components/ui/EmptyState';
import LoadingBlock from '@/mobile/components/ui/LoadingBlock';
import NewsCard from '@/mobile/features/news/NewsCard';
import { useNewsFeedStore } from '@/mobile/store/newsFeedStore';

const filters = ['All', 'Breaking', 'Featured'] as const;

export default function NewsPage() {
  const { items, loading, error, page, totalPages, loadInitial, loadMore } = useNewsFeedStore();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<(typeof filters)[number]>('All');
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    void loadInitial(deferredQuery.trim());
  }, [deferredQuery, loadInitial]);

  const filteredItems = useMemo(() => {
    if (mode === 'Breaking') {
      return items.filter((item) => item.isBreaking);
    }

    if (mode === 'Featured') {
      return items.filter((item) => item.isFeatured);
    }

    return items;
  }, [items, mode]);

  return (
    <div className="space-y-4">
      <label className="block rounded-xl border border-white/6 bg-[#042634] px-4 py-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Search news</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search headline or keyword"
          className="mt-2 w-full border-none bg-transparent p-0 text-sm text-white outline-none"
        />
      </label>

      <div className="flex gap-2 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setMode(filter)}
            className={[
              'rounded-xl px-4 py-2 text-[0.78rem] font-extrabold uppercase tracking-[0.04em] transition',
              mode === filter
                ? 'bg-accent-pink text-white'
                : 'bg-[#083042] text-white/80 hover:bg-[#0c3950]',
            ].join(' ')}
          >
            {filter}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-xl border border-accent-pink/25 bg-accent-pink/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {loading && items.length === 0 ? <LoadingBlock lines={4} /> : null}

      {!loading && filteredItems.length === 0 ? (
        <EmptyState
          title="No stories found"
          description="Try another keyword or switch the quick news filter."
        />
      ) : null}

      <div className="space-y-3">
        {filteredItems.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {page + 1 < totalPages ? (
        <button
          type="button"
          onClick={() => void loadMore()}
          className="w-full rounded-xl bg-[#083042] px-4 py-3 text-sm font-extrabold uppercase tracking-[0.04em] text-white transition hover:bg-[#0c3950]"
        >
          {loading ? 'Loading...' : 'More news'}
        </button>
      ) : null}
    </div>
  );
}
