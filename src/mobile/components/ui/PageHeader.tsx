import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export default function PageHeader({ eyebrow, title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-4 border-b border-white/6 pb-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">{eyebrow}</p>
          ) : null}
          <h2 className="mt-1 font-display text-[1.35rem] font-bold text-white">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-[#9db2bd]">{subtitle}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
