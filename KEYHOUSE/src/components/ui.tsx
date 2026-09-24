import { useEffect, useRef, type ReactNode, type SelectHTMLAttributes } from 'react';
import { BadgeCheck, Check, ChevronDown, CircleCheck, Info, Star, TriangleAlert, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/store';

/* ---------------- Botões ---------------- */
export type BtnVariant = 'gold' | 'navy' | 'outline' | 'ghost' | 'white' | 'glass';
export type BtnSize = 'sm' | 'md' | 'lg';

export function btn(variant: BtnVariant = 'gold', size: BtnSize = 'md', extra?: string) {
  const sizes: Record<BtnSize, string> = {
    sm: 'h-9 px-3.5 text-[13px]',
    md: 'h-11 px-5 text-sm',
    lg: 'h-14 px-7 text-[15px]',
  };
  const variants: Record<BtnVariant, string> = {
    gold: 'bg-linear-to-b from-gold-300 to-gold-500 text-navy-950 shadow-gold hover:from-gold-200 hover:to-gold-400',
    navy: 'bg-navy-900 text-white shadow-soft hover:bg-navy-800',
    outline: 'border border-navy-900/15 bg-white text-navy-900 hover:border-navy-900/40',
    ghost: 'text-navy-900 hover:bg-navy-900/5',
    white: 'bg-white text-navy-950 shadow-soft hover:bg-ivory',
    glass: 'border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/15',
  };
  return cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 active:scale-[.98] disabled:pointer-events-none disabled:opacity-45',
    sizes[size],
    variants[variant],
    extra,
  );
}

/* ---------------- Badges ---------------- */
export function VerifiedBadge({ small }: { small?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-linear-to-r from-gold-200 via-gold-300 to-gold-400 font-extrabold uppercase tracking-[.12em] text-navy-950 shadow-sm',
        small ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]',
      )}
    >
      <BadgeCheck className={small ? 'h-3 w-3' : 'h-3.5 w-3.5'} strokeWidth={2.5} /> Verificado
    </span>
  );
}

export function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-navy-950/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.12em] text-gold-300 ring-1 ring-gold-400/40 backdrop-blur">
      <Star className="h-3 w-3 fill-gold-300" /> Destaque
    </span>
  );
}

const STATUS: Record<string, [string, string]> = {
  pendente_pagamento: ['Pagamento pendente', 'bg-amber-50 text-amber-700 ring-amber-200'],
  em_validacao: ['Em validação', 'bg-sky-50 text-sky-700 ring-sky-200'],
  publicado: ['Publicado', 'bg-emerald-50 text-emerald-700 ring-emerald-200'],
  rejeitado: ['Rejeitado', 'bg-rose-50 text-rose-700 ring-rose-200'],
  vendido: ['Vendido', 'bg-navy-50 text-navy-700 ring-navy-200'],
  arrendado: ['Arrendado', 'bg-navy-50 text-navy-700 ring-navy-200'],
  pendente: ['A confirmar', 'bg-amber-50 text-amber-700 ring-amber-200'],
  confirmada: ['Confirmada', 'bg-emerald-50 text-emerald-700 ring-emerald-200'],
  realizada: ['Realizada', 'bg-sky-50 text-sky-700 ring-sky-200'],
  cancelada: ['Cancelada', 'bg-rose-50 text-rose-700 ring-rose-200'],
  fechada: ['Negócio fechado', 'bg-gold-50 text-gold-700 ring-gold-200'],
  novo: ['Novo', 'bg-sky-50 text-sky-700 ring-sky-200'],
  aceite: ['Aceite', 'bg-emerald-50 text-emerald-700 ring-emerald-200'],
  descartado: ['Descartado', 'bg-graphite-100 text-graphite-600 ring-graphite-200'],
  minuta: ['Comissão pendente', 'bg-amber-50 text-amber-700 ring-amber-200'],
  pago: ['Pago', 'bg-emerald-50 text-emerald-700 ring-emerald-200'],
  reembolsado: ['Reembolsado', 'bg-graphite-100 text-graphite-600 ring-graphite-200'],
  em_curso: ['Em curso', 'bg-sky-50 text-sky-700 ring-sky-200'],
  concluido: ['Concluído', 'bg-emerald-50 text-emerald-700 ring-emerald-200'],
};

export function StatusPill({ status, className }: { status: string; className?: string }) {
  const [label, cls] = STATUS[status] ?? [status, 'bg-graphite-100 text-graphite-600 ring-graphite-200'];
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1', cls, className)}>
      {label}
    </span>
  );
}

/* ---------------- Tipografia de secção ---------------- */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  light,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  light?: boolean;
}) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && (
        <div
          className={cn(
            'flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.25em]',
            light ? 'text-gold-300' : 'text-gold-600',
            align === 'center' && 'justify-center',
          )}
        >
          <span className="h-px w-8 bg-current" />
          {eyebrow}
          {align === 'center' && <span className="h-px w-8 bg-current" />}
        </div>
      )}
      <h2
        className={cn(
          'mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-[2.6rem]',
          light ? 'text-white' : 'text-navy-950',
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 text-base leading-relaxed sm:text-lg', light ? 'text-white/70' : 'text-graphite-500')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  microcopy,
  actions,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  microcopy: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-navy-950 text-white">
      <div className="kh-grid absolute inset-0 opacity-[.05]" />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl" />
      <div className="container-kh relative py-10 sm:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="animate-rise">
            <div className="text-[11px] font-bold uppercase tracking-[.25em] text-gold-300">{eyebrow}</div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">{title}</h1>
            <p className="mt-2 font-serif text-xl italic text-white/70 sm:text-2xl">“{microcopy}”</p>
          </div>
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------- Modal ---------------- */
export function Modal({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade bg-navy-950/70 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative max-h-[94vh] w-full animate-rise overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl',
          className,
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-navy-900/5 text-navy-900 hover:bg-navy-900/10"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

/* ---------------- Tabs ---------------- */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: { id: T; label: string; count?: number; icon?: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'no-scrollbar flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-soft ring-1 ring-navy-900/5',
        className,
      )}
    >
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => onChange(it.id)}
          className={cn(
            'flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition',
            value === it.id ? 'bg-navy-950 text-white shadow' : 'text-graphite-500 hover:bg-navy-900/5 hover:text-navy-900',
          )}
        >
          {it.icon}
          {it.label}
          {it.count !== undefined && (
            <span
              className={cn(
                'min-w-5 rounded-full px-1.5 text-center text-[11px] font-bold',
                value === it.id ? 'bg-gold-400 text-navy-950' : 'bg-navy-900/5 text-graphite-500',
              )}
            >
              {it.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-1 rounded-xl bg-navy-900/5 p-1', className)} style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button
          type="button"
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'h-10 rounded-lg px-3 text-[13px] font-semibold transition',
            value === o.value ? 'bg-white text-navy-950 shadow-sm' : 'text-graphite-500 hover:text-navy-900',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Cartões de métricas ---------------- */
export function StatCard({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 ring-1',
        accent ? 'bg-navy-950 text-white ring-gold-400/20' : 'bg-white shadow-soft ring-navy-900/5',
      )}
    >
      {accent && <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-500/20 blur-2xl" />}
      <div className="relative flex items-start justify-between gap-3">
        <div className={cn('text-[11px] font-bold uppercase tracking-[.14em]', accent ? 'text-gold-300' : 'text-graphite-400')}>
          {label}
        </div>
        <div className={cn('grid h-9 w-9 place-items-center rounded-xl', accent ? 'bg-gold-400/15 text-gold-300' : 'bg-gold-50 text-gold-600')}>
          {icon}
        </div>
      </div>
      <div className={cn('relative mt-3 text-2xl font-extrabold tracking-tight sm:text-[28px]', accent ? 'text-white' : 'text-navy-950')}>
        {value}
      </div>
      {hint && <div className={cn('relative mt-1 text-xs', accent ? 'text-white/60' : 'text-graphite-500')}>{hint}</div>}
    </div>
  );
}

/* ---------------- Formulários ---------------- */
export const inputCls = (error?: boolean) =>
  cn(
    'h-12 w-full rounded-xl border bg-white px-4 text-[15px] text-navy-950 outline-none transition placeholder:text-graphite-300 focus:ring-4',
    error
      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
      : 'border-navy-900/10 focus:border-gold-500 focus:ring-gold-400/20',
  );

export function Field({
  label,
  n,
  valid,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  n?: number;
  valid?: boolean;
  error?: string | null;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold text-navy-900">
        {n !== undefined && (
          <span
            className={cn(
              'grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold transition',
              valid ? 'bg-emerald-500 text-white' : 'bg-navy-900/5 text-graphite-500',
            )}
          >
            {valid ? <Check className="h-3 w-3" strokeWidth={3} /> : n}
          </span>
        )}
        {label}
      </div>
      {children}
      {error ? (
        <div className="mt-1.5 text-xs font-medium text-rose-600">{error}</div>
      ) : hint ? (
        <div className="mt-1.5 text-xs text-graphite-400">{hint}</div>
      ) : null}
    </div>
  );
}

export function Select({
  className,
  children,
  error,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <div className={cn('relative', className)}>
      <select {...rest} className={cn(inputCls(error), 'appearance-none pr-10')}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
    </div>
  );
}

export function YesNo({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[true, false].map((v) => (
        <button
          type="button"
          key={String(v)}
          onClick={() => onChange(v)}
          className={cn(
            'h-12 rounded-xl border text-sm font-semibold transition',
            value === v
              ? 'border-navy-950 bg-navy-950 text-white'
              : 'border-navy-900/10 bg-white text-graphite-600 hover:border-navy-900/30',
          )}
        >
          {v ? 'Sim' : 'Não'}
        </button>
      ))}
    </div>
  );
}

export function ScoreRing({ score, size = 128 }: { score: number; size?: number }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(100, Math.max(0, score)) / 100);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="kh-ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#EEDDB5" />
            <stop offset="1" stopColor="#AA813A" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#EEF1F6" strokeWidth={10} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#kh-ring)"
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.2,.7,.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-3xl font-extrabold text-navy-950" style={{ fontSize: size / 4 }}>
            {score}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-graphite-400">/ 100</div>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-navy-900/15 bg-white px-6 py-14 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold-50 text-gold-600">{icon}</div>
      <h3 className="mt-4 text-lg font-bold text-navy-950">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-graphite-500">{text}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function Toaster() {
  const { toasts, dismiss } = useStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[200] flex flex-col items-center gap-2 px-4 md:bottom-6 md:items-end md:pr-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex w-full max-w-sm animate-rise items-start gap-3 rounded-2xl bg-navy-950 px-4 py-3.5 text-sm text-white shadow-lift ring-1 ring-gold-400/25"
        >
          {t.tone === 'error' ? (
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          ) : t.tone === 'info' ? (
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
          ) : (
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
          )}
          <span className="flex-1 leading-snug">{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="text-white/50 hover:text-white" aria-label="Fechar">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
