import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Bath, BedDouble, Camera, Car, Heart, MapPin, Ruler } from 'lucide-react';
import type { Property } from '../lib/types';
import { useStore } from '../store/store';
import { FeaturedBadge, VerifiedBadge } from './ui';
import { FALLBACK_IMG } from '../data/images';
import { cn, formatMT, formatMoney, groupThousands, toMZN } from '../lib/utils';

export default function PropertyCard({
  p,
  compact,
  active,
  onHover,
}: {
  p: Property;
  compact?: boolean;
  active?: boolean;
  onHover?: (id: string | null) => void;
}) {
  const { isFavorite, toggleFavorite, notify } = useStore();
  const fav = isFavorite(p.id);
  const cover = p.photos[0] || FALLBACK_IMG;
  const toggle = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(p.id);
    notify(fav ? 'Removido dos favoritos.' : 'Guardado nos seus favoritos.', fav ? 'info' : 'success');
  };

  if (compact) {
    return (
      <Link
        to={`/imovel/${p.id}`}
        onMouseEnter={() => onHover?.(p.id)}
        onMouseLeave={() => onHover?.(null)}
        className={cn(
          'group flex gap-4 rounded-2xl bg-white p-3 shadow-soft ring-1 transition hover:shadow-lift',
          active ? 'ring-2 ring-gold-400' : 'ring-navy-900/5',
        )}
      >
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-36">
          <img src={cover} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          {p.verified && (
            <div className="absolute left-1.5 top-1.5">
              <VerifiedBadge small />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <div className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-600">
            {p.type}
            {p.typology !== 'Não aplicável' && ` · ${p.typology}`}
          </div>
          <div className="mt-0.5 line-clamp-1 font-bold text-navy-950">{p.title}</div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-graphite-500">
            <MapPin className="h-3 w-3" /> {p.neighborhood}, {p.city}
          </div>
          <div className="mt-2 text-[15px] font-extrabold text-navy-950">
            {formatMoney(p.price, p.currency)}
            {p.purpose === 'Arrendamento' && <span className="text-xs font-semibold text-graphite-400">/mês</span>}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/imovel/${p.id}`}
      onMouseEnter={() => onHover?.(p.id)}
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        'group block overflow-hidden rounded-2xl bg-white shadow-soft ring-1 transition duration-300 hover:-translate-y-1 hover:shadow-lift',
        active ? 'ring-2 ring-gold-400' : 'ring-navy-900/5',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-100">
        <img
          src={cover}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950/65 via-transparent to-navy-950/10" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {p.verified && <VerifiedBadge />}
          {p.featured && <FeaturedBadge />}
        </div>
        <button
          onClick={toggle}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-navy-900 shadow backdrop-blur transition hover:scale-110"
          aria-label={fav ? 'Remover dos favoritos' : 'Guardar nos favoritos'}
        >
          <Heart className={cn('h-4 w-4', fav && 'fill-rose-500 text-rose-500')} />
        </button>
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-navy-950">{p.purpose}</span>
          {p.photos.length > 1 && (
            <span className="flex items-center gap-1 rounded-full bg-navy-950/60 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
              <Camera className="h-3 w-3" />
              {p.photos.length}
            </span>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="text-[11px] font-bold uppercase tracking-[.16em] text-gold-600">
          {p.type}
          {p.typology !== 'Não aplicável' && ` · ${p.typology}`}
        </div>
        <h3 className="mt-1.5 line-clamp-1 text-[17px] font-bold text-navy-950">{p.title}</h3>
        <div className="mt-1 flex items-center gap-1 text-[13px] text-graphite-500">
          <MapPin className="h-3.5 w-3.5" /> {p.neighborhood}, {p.city}
        </div>
        <div className="mt-4 flex items-center gap-4 border-y border-navy-900/5 py-3 text-[13px] font-medium text-graphite-600">
          {p.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-graphite-400" /> {p.bedrooms}
            </span>
          )}
          {p.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-graphite-400" /> {p.bathrooms}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4 text-graphite-400" /> {groupThousands(p.totalArea)} m²
          </span>
          {p.parking > 0 && (
            <span className="flex items-center gap-1.5">
              <Car className="h-4 w-4 text-graphite-400" /> {p.parking}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-xl font-extrabold tracking-tight text-navy-950">
              {formatMoney(p.price, p.currency)}
              {p.purpose === 'Arrendamento' && <span className="text-sm font-semibold text-graphite-400">/mês</span>}
            </div>
            {p.currency !== 'MZN' && <div className="text-xs text-graphite-400">≈ {formatMT(toMZN(p.price, p.currency))}</div>}
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-950 text-gold-300 transition group-hover:bg-gold-400 group-hover:text-navy-950">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
