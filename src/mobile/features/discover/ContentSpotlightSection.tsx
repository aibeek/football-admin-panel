import type { ReactNode } from 'react';

interface ContentSpotlightSectionProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function ContentSpotlightSection({
  eyebrow,
  title,
  subtitle,
  children,
}: ContentSpotlightSectionProps) {
  return (
    <section className="rounded-[1.5rem] border border-white/6 bg-[#021c27] p-3">
      <div className="mb-3 border-b border-white/6 pb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">{eyebrow}</p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[1.18rem] font-bold text-white">{title}</h2>
            <p className="mt-1 text-[0.82rem] leading-5 text-[#9db2bd]">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">{children}</div>
    </section>
  );
}
