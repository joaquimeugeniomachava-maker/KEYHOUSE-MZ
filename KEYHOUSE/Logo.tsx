import { cn } from '../lib/utils';

export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="kh-logo-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F1E2B8" />
          <stop offset=".5" stopColor="#D4B06A" />
          <stop offset="1" stopColor="#A9823F" />
        </linearGradient>
      </defs>
      <path
        d="M24 5 L42 19.5 V41 a2 2 0 0 1 -2 2 H8 a2 2 0 0 1 -2 -2 V19.5 Z"
        stroke="url(#kh-logo-gold)"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24.5" r="4.6" fill="url(#kh-logo-gold)" />
      <path d="M21.6 27.5 h4.8 l1.4 9 h-7.6 z" fill="url(#kh-logo-gold)" />
    </svg>
  );
}

export default function Logo({ light = true, className }: { light?: boolean; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      <div className="leading-none">
        <div className={cn('text-[17px] font-extrabold tracking-[.22em]', light ? 'text-white' : 'text-navy-950')}>
          KEYHOUSE
        </div>
        <div className="mt-1 text-[8.5px] font-bold tracking-[.5em] text-gold-400">PROPERTIES</div>
      </div>
    </div>
  );
}
