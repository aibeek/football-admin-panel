import { Link } from 'react-router-dom';

interface ContentSpotlightCardProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta?: string;
  badge?: string;
  tone?: 'blue' | 'gold' | 'pink';
  imageUrl?: string | null;
  to?: string;
}

const toneClasses: Record<NonNullable<ContentSpotlightCardProps['tone']>, string> = {
  blue: 'from-[#0f3f66] via-[#0a2f49] to-[#062130]',
  gold: 'from-[#5d4317] via-[#2b2411] to-[#062130]',
  pink: 'from-[#5a1632] via-[#2a1430] to-[#062130]',
};

export default function ContentSpotlightCard({
  eyebrow,
  title,
  subtitle,
  meta,
  badge,
  tone = 'blue',
  imageUrl,
  to,
}: ContentSpotlightCardProps) {
  const content = (
    <article className="min-w-[232px] overflow-hidden rounded-2xl border border-white/6 bg-[#03212e] shadow-[0_16px_40px_rgba(0,0,0,0.24)] transition hover:border-white/15 hover:bg-[#042736]">
      <div
        className={[
          'relative min-h-[132px] px-3 py-3',
          imageUrl ? 'bg-cover bg-center' : `bg-gradient-to-br ${toneClasses[tone]}`,
        ].join(' ')}
        style={
          imageUrl
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(0, 19, 28, 0.12), rgba(0, 19, 28, 0.88)), url(${imageUrl})`,
              }
            : undefined
        }
      >
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white/80">
            {eyebrow}
          </span>
          {badge ? (
            <span className="rounded-md bg-accent-pink px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
              {badge}
            </span>
          ) : null}
        </div>

        <div className="mt-8">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-[1rem] font-extrabold leading-5 text-white">{title}</h3>
            {to ? (
              <span className="mt-[2px] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/70">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 stroke-[2]" fill="none">
                  <path d="m9 6 6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            ) : null}
          </div>
          <p className="mt-2 line-clamp-2 text-[0.8rem] leading-5 text-white/72">{subtitle}</p>
        </div>
      </div>

      <div className="border-t border-white/6 px-3 py-3">
        <p className="line-clamp-2 text-[0.78rem] leading-5 text-[#a9bdc8]">{meta || 'Open the admin panel to enrich this card with more details.'}</p>
      </div>
    </article>
  );

  if (!to) {
    return content;
  }

  return (
    <Link to={to} className="block">
      {content}
    </Link>
  );
}
