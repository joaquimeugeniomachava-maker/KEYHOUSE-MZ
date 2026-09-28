import { cn, groupThousands } from '../lib/utils';

export function AreaChart({
  data,
  height = 240,
  format = (n: number) => groupThousands(n),
}: {
  data: { label: string; value: number }[];
  height?: number;
  format?: (n: number) => string;
}) {
  const w = 640;
  const h = height;
  const padX = 32;
  const padY = 30;
  const max = Math.max(1, ...data.map((d) => d.value)) * 1.18;
  const pts = data.map((d, i) => [
    padX + (i * (w - padX * 2)) / Math.max(1, data.length - 1),
    h - padY - (d.value / max) * (h - padY * 2),
  ]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0]},${h - padY} L${pts[0][0]},${h - padY} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Evolução da receita">
      <defs>
        <linearGradient id="kh-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C69C4E" stopOpacity=".32" />
          <stop offset="1" stopColor="#C69C4E" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => {
        const y = padY + (i * (h - padY * 2)) / 3;
        return <line key={i} x1={padX} x2={w - padX} y1={y} y2={y} stroke="#0E1D3A" strokeOpacity=".06" />;
      })}
      <path d={area} fill="url(#kh-area)" />
      <path d={line} fill="none" stroke="#AA813A" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 6 : 4.5} fill={i === pts.length - 1 ? '#071226' : '#fff'} stroke="#AA813A" strokeWidth="2.5" />
          <text x={p[0]} y={h - 8} textAnchor="middle" fontSize="12" fontWeight="600" fill="#8A909B">
            {data[i].label}
          </text>
          {i === pts.length - 1 && (
            <text x={p[0]} y={p[1] - 14} textAnchor="end" fontSize="12.5" fontWeight="800" fill="#071226">
              {format(data[i].value)}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

export function BarList({
  items,
  format = (n: number) => groupThousands(n),
  dark,
}: {
  items: { label: string; value: number; hint?: string }[];
  format?: (n: number) => string;
  dark?: boolean;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="space-y-3.5">
      {items.map((i) => (
        <div key={i.label}>
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className={cn('font-semibold', dark ? 'text-white/85' : 'text-navy-950')}>
              {i.label}
              {i.hint && <span className={cn('ml-1.5 text-xs font-medium', dark ? 'text-white/40' : 'text-graphite-400')}>{i.hint}</span>}
            </span>
            <span className={cn('shrink-0 font-bold', dark ? 'text-gold-300' : 'text-graphite-700')}>{format(i.value)}</span>
          </div>
          <div className={cn('mt-1.5 h-2 rounded-full', dark ? 'bg-white/10' : 'bg-navy-900/5')}>
            <div
              className="h-2 rounded-full bg-linear-to-r from-gold-300 to-gold-500 transition-all duration-700"
              style={{ width: `${Math.max(2, (i.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = steps[0]?.value || 1;
  return (
    <div className="space-y-2.5">
      {steps.map((s, i) => {
        const pct = (s.value / max) * 100;
        const conv = i > 0 && steps[i - 1].value ? (s.value / steps[i - 1].value) * 100 : null;
        return (
          <div key={s.label} className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-[13px] font-semibold text-graphite-600 sm:w-28">{s.label}</div>
            <div className="h-9 flex-1 rounded-lg bg-navy-900/[.04]">
              <div
                className="h-9 rounded-lg bg-linear-to-r from-navy-950 to-navy-700 transition-all duration-700"
                style={{ width: `${Math.max(pct, 3)}%` }}
              />
            </div>
            <div className="w-16 text-right text-sm font-extrabold text-navy-950">{groupThousands(s.value)}</div>
            <div className="w-12 text-right text-xs font-bold text-gold-600">{conv !== null ? `${conv.toFixed(0)}%` : ''}</div>
          </div>
        );
      })}
    </div>
  );
}
