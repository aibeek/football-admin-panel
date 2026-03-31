import { formatDateLabel } from '@/mobile/lib/format';
import type { NewsArticle, NewsPreview } from '@/mobile/types/news';

interface NewsCardProps {
  item: NewsPreview;
}

const isArticle = (item: NewsPreview): item is NewsArticle => 'content' in item;

export default function NewsCard({ item }: NewsCardProps) {
  const image = isArticle(item) ? item.images?.[0] : item.imageUrl;

  return (
    <article className="rounded-2xl border border-white/6 bg-[#042330] p-3">
      <div className="flex gap-3">
        <div
          className="h-20 w-24 shrink-0 rounded-xl bg-cover bg-center"
          style={{
            backgroundImage: image
              ? `linear-gradient(180deg, rgba(0, 24, 34, 0.1), rgba(0, 24, 34, 0.56)), url(${image})`
              : 'linear-gradient(135deg, rgba(247, 50, 99, 0.55), rgba(0, 43, 61, 0.95))',
          }}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-[#083245] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white/80">
              {item.category.replace(/_/g, ' ')}
            </span>
            {item.isBreaking ? (
              <span className="rounded-md bg-accent-pink px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                Breaking
              </span>
            ) : null}
          </div>

          <h3 className="mt-2 text-sm font-bold leading-5 text-white">{item.title}</h3>
          <p className="mt-1 text-xs leading-5 text-[#9db2bd]">{item.summary}</p>

          <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-white/45">
            <span>{formatDateLabel(item.publishedAt)}</span>
            <span className="truncate text-right">{item.viewCount} views</span>
          </div>
        </div>
      </div>
    </article>
  );
}
