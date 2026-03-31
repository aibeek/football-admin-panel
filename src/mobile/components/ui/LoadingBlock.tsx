interface LoadingBlockProps {
  lines?: number;
}

export default function LoadingBlock({ lines = 3 }: LoadingBlockProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/6 bg-[#042330]">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={[
            'grid animate-pulse grid-cols-[18px,1fr,58px] items-center gap-3 px-3 py-3',
            index > 0 ? 'border-t border-white/6' : '',
          ].join(' ')}
        >
          <div className="h-4 w-4 rounded-full bg-white/10" />
          <div className="space-y-2">
            <div className="h-3 w-3/4 rounded-full bg-white/10" />
            <div className="h-3 w-2/3 rounded-full bg-white/10" />
          </div>
          <div className="space-y-2">
            <div className="ml-auto h-3 w-10 rounded-full bg-white/10" />
            <div className="ml-auto h-5 w-12 rounded-md bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
