import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CalendarCheck,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Clock,
  Eye,
  Headphones,
  Heart,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  Ruler,
  Share2,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useStore } from '../store/store';
import { useTitle } from '../hooks/useTitle';
import MapView from '../components/MapView';
import PropertyCard from '../components/PropertyCard';
import QualificationModal from '../components/QualificationModal';
import { FeaturedBadge, VerifiedBadge, btn } from '../components/ui';
import { FALLBACK_IMG } from '../data/images';
import {
  cn,
  floorLabel,
  formatDate,
  formatMT,
  formatMoney,
  groupThousands,
  initials,
  priceLabel,
  toMZN,
  waLink,
  yesNo,
} from '../lib/utils';

const ADV_TYPE: Record<string, string> = {
  proprietario: 'Proprietário verificado',
  intermediario: 'Intermediário certificado',
  agencia: 'Agência Premium',
};

function Lightbox({ photos, index, onClose, onNav }: { photos: string[]; index: number; onClose: () => void; onNav: (i: number) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav((index + 1) % photos.length);
      if (e.key === 'ArrowLeft') onNav((index - 1 + photos.length) % photos.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, photos.length, onClose, onNav]);
  return (
    <div className="fixed inset-0 z-[120] flex animate-fade flex-col bg-navy-950/95 backdrop-blur">
      <div className="flex items-center justify-between p-4 text-white">
        <span className="text-sm font-semibold text-white/70">
          {index + 1} / {photos.length}
        </span>
        <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Fechar">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4">
        <img src={photos[index]} alt="" className="max-h-[75vh] max-w-full rounded-2xl object-contain" />
        <button onClick={() => onNav((index - 1 + photos.length) % photos.length)} className="absolute left-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Anterior">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button onClick={() => onNav((index + 1) % photos.length)} className="absolute right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Seguinte">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
      <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto p-4">
        {photos.map((ph, i) => (
          <button key={i} onClick={() => onNav(i)} className={cn('h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-2', i === index ? 'ring-gold-400' : 'ring-transparent opacity-60')}>
            <img src={ph} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PropertyDetail() {
  const { id } = useParams();
  const { properties, isFavorite, toggleFavorite, unlocked, visits, notify } = useStore();
  const p = properties.find((x) => x.id === id);
  useTitle(p ? `${p.type} em ${p.neighborhood} — KEYHOUSE PROPERTIES` : 'Imóvel — KEYHOUSE PROPERTIES');
  const [qualOpen, setQualOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!p) {
    return (
      <div className="container-kh py-24 text-center">
        <h1 className="text-3xl font-extrabold text-navy-950">Imóvel não encontrado</h1>
        <p className="mt-2 text-graphite-500">O anúncio pode ter sido vendido, arrendado ou retirado.</p>
        <Link to="/imoveis" className={btn('gold', 'md', 'mt-6')}>
          Ver imóveis disponíveis
        </Link>
      </div>
    );
  }

  const photos = p.photos.length ? p.photos : [FALLBACK_IMG];
  const fav = isFavorite(p.id);
  const myVisit = visits.find((v) => v.propertyId === p.id && v.mine && v.status !== 'cancelada');
  const contactOpen = unlocked.includes(p.id) || (!!myVisit && ['confirmada', 'realizada', 'fechada'].includes(myVisit.status));
  const available = p.status === 'publicado';
  const similar = properties
    .filter((x) => x.id !== p.id && x.status === 'publicado' && (x.type === p.type || x.city === p.city))
    .slice(0, 3);
  const n = photos.length;
  const thumbs = n >= 5 ? photos.slice(1, 5) : n >= 3 ? photos.slice(1, 3) : [];
  const perM2 = p.totalArea > 0 ? p.price / p.totalArea : 0;

  const groups: { title: string; rows: [string, string][] }[] = [
    {
      title: 'Identificação',
      rows: [
        ['Tipo de imóvel', p.type],
        ['Finalidade', p.purpose],
        ['Tipologia', p.typology],
        ['Bairro', p.neighborhood],
        ['Cidade', p.city],
        ['Zona', p.zone],
        ['Andar', floorLabel(p.floor)],
      ],
    },
    {
      title: 'Áreas & divisões',
      rows: [
        ['Área total', `${groupThousands(p.totalArea)} m²`],
        ['Área útil', `${groupThousands(p.usefulArea)} m²`],
        ['Quartos', String(p.bedrooms)],
        ['Casas de banho', String(p.bathrooms)],
        ['Sala', yesNo(p.livingRoom)],
        ['Cozinha', yesNo(p.kitchen)],
        ['Varanda', yesNo(p.balcony)],
        ['Estacionamento', `${p.parking} ${p.parking === 1 ? 'lugar' : 'lugares'}`],
      ],
    },
    {
      title: 'Estado & documentação',
      rows: [
        ['Estado de conservação', p.condition],
        ['Mobiliado', yesNo(p.furnished)],
        ['Título de propriedade / DUAT', yesNo(p.hasTitle)],
        ['Licença / documentação', yesNo(p.hasLicense)],
        ['Disponibilidade imediata', yesNo(p.immediate)],
      ],
    },
    {
      title: 'Condições comerciais',
      rows: [
        ['Preço', priceLabel(p)],
        ['Moeda', p.currency],
        ['Negociável', yesNo(p.negotiable)],
        ['Comissão de fecho', `${p.commission}%`],
      ],
    },
  ];

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify('Link do imóvel copiado.');
    } catch {
      notify('Copie o link a partir da barra de endereço.', 'info');
    }
  };

  return (
    <div className="pb-28 md:pb-16">
      <div className="container-kh pt-6">
        <div className="flex items-center justify-between gap-3">
          <Link to="/imoveis" className="inline-flex items-center gap-1.5 text-sm font-semibold text-graphite-500 hover:text-navy-950">
            <ArrowLeft className="h-4 w-4" /> Voltar à pesquisa
          </Link>
          <div className="flex gap-2">
            <button onClick={share} className={btn('outline', 'sm')}>
              <Share2 className="h-4 w-4" /> Partilhar
            </button>
            <button
              onClick={() => {
                toggleFavorite(p.id);
                notify(fav ? 'Removido dos favoritos.' : 'Guardado nos seus favoritos.', fav ? 'info' : 'success');
              }}
              className={btn('outline', 'sm')}
            >
              <Heart className={cn('h-4 w-4', fav && 'fill-rose-500 text-rose-500')} /> {fav ? 'Guardado' : 'Guardar'}
            </button>
          </div>
        </div>

        {/* Galeria */}
        <div
          className={cn(
            'mt-5 grid h-[300px] gap-2 overflow-hidden rounded-3xl sm:h-[500px] sm:grid-rows-2',
            n >= 5 ? 'sm:grid-cols-4' : n >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-1',
          )}
        >
          <button onClick={() => setLightbox(0)} className={cn('group relative overflow-hidden', n >= 3 ? 'sm:col-span-2 sm:row-span-2' : 'sm:row-span-2')}>
            <img src={photos[0]} alt={p.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {p.verified && <VerifiedBadge />}
              {p.featured && <FeaturedBadge />}
            </div>
            <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-navy-950 sm:hidden">
              Ver {n} fotos
            </span>
          </button>
          {thumbs.map((src, i) => (
            <button key={i} onClick={() => setLightbox(i + 1)} className="group relative hidden overflow-hidden sm:block">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              {i === thumbs.length - 1 && n > thumbs.length + 1 && (
                <span className="absolute inset-0 grid place-items-center bg-navy-950/50 text-lg font-extrabold text-white">+{n - thumbs.length - 1} fotos</span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0">
            {!available && (
              <div className="mb-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">
                Este imóvel não está disponível publicamente (estado: {p.status.replace('_', ' ')}).
              </div>
            )}
            <div className="text-[12px] font-bold uppercase tracking-[.2em] text-gold-600">
              {p.type}
              {p.typology !== 'Não aplicável' && ` · ${p.typology}`} · {p.purpose}
            </div>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-navy-950 sm:text-4xl">{p.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-graphite-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gold-600" /> {p.neighborhood}, {p.city} · {p.zone}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" /> {groupThousands(p.views)} visualizações
              </span>
              {p.verifiedAt && (
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Verificado a {formatDate(p.verifiedAt)}
                </span>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                [BedDouble, p.bedrooms > 0 ? `${p.bedrooms}` : '—', 'Quartos'],
                [Bath, p.bathrooms > 0 ? `${p.bathrooms}` : '—', 'Casas de banho'],
                [Ruler, `${groupThousands(p.totalArea)} m²`, 'Área total'],
                [Car, `${p.parking}`, 'Estacionamento'],
              ].map(([Icon, v, l]) => {
                const I = Icon as typeof BedDouble;
                return (
                  <div key={l as string} className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-navy-900/5">
                    <I className="h-5 w-5 text-gold-600" />
                    <div className="mt-2 text-xl font-extrabold text-navy-950">{v as string}</div>
                    <div className="text-xs text-graphite-500">{l as string}</div>
                  </div>
                );
              })}
            </div>

            <section className="mt-10">
              <h2 className="text-xl font-extrabold text-navy-950">Descrição</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-graphite-600">{p.description}</p>
              {p.highlights.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.highlights.map((h) => (
                    <span key={h} className="inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1.5 text-[13px] font-semibold text-navy-950 ring-1 ring-gold-200">
                      <Sparkles className="h-3.5 w-3.5 text-gold-600" /> {h}
                    </span>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-10">
              <div className="flex items-end justify-between">
                <h2 className="text-xl font-extrabold text-navy-950">Características</h2>
                <span className="text-xs font-semibold text-graphite-400">27 campos verificados</span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {groups.map((g) => (
                  <div key={g.title} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-900/5">
                    <div className="text-[11px] font-bold uppercase tracking-[.18em] text-gold-600">{g.title}</div>
                    <dl className="mt-3 divide-y divide-navy-900/5">
                      {g.rows.map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4 py-2 text-sm">
                          <dt className="text-graphite-500">{k}</dt>
                          <dd className="text-right font-semibold text-navy-950">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-navy-950 p-6 text-white">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.18em] text-gold-300">
                  <ShieldCheck className="h-4 w-4" /> Verificação KEYHOUSE
                </div>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {[
                    ['Título de propriedade / DUAT', p.hasTitle],
                    ['Licença / documentação', p.hasLicense],
                    ['Fotografias reais do imóvel', photos.length >= 3],
                    ['Localização confirmada no mapa', true],
                    ['Identidade do anunciante', p.advertiser.verified],
                  ].map(([label, ok]) => (
                    <li key={label as string} className="flex items-center gap-2.5">
                      {ok ? <CircleCheck className="h-4 w-4 text-gold-300" /> : <CircleX className="h-4 w-4 text-white/30" />}
                      <span className={ok ? 'text-white/90' : 'text-white/40'}>{label as string}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => setQualOpen(true)} className="group relative min-h-[200px] overflow-hidden rounded-2xl text-left">
                <img src={photos[1] ?? photos[0]} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-navy-950/60" />
                <div className="relative flex h-full flex-col justify-between p-6 text-white">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-navy-950 shadow-lift transition group-hover:scale-110">
                    <Play className="ml-1 h-6 w-6 fill-navy-950" />
                  </span>
                  <div>
                    <div className="text-lg font-extrabold">Tour em vídeo</div>
                    <div className="text-sm text-white/75">Enviado por WhatsApp após a qualificação.</div>
                  </div>
                </div>
              </button>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-extrabold text-navy-950">Localização</h2>
              <p className="mt-1 text-sm text-graphite-500">
                {contactOpen
                  ? 'Localização exacta libertada — visita confirmada.'
                  : 'Localização aproximada. A morada exacta é partilhada após a confirmação da visita.'}
              </p>
              <div className="mt-4 overflow-hidden rounded-3xl shadow-soft ring-1 ring-navy-900/5">
                <MapView
                  center={[p.lat, p.lng]}
                  zoom={contactOpen ? 16 : 14}
                  fit={false}
                  markers={contactOpen ? [{ id: p.id, lat: p.lat, lng: p.lng }] : []}
                  circle={contactOpen ? null : { lat: p.lat + 0.0012, lng: p.lng - 0.001, radius: 550 }}
                  className="h-80"
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-28 space-y-4">
              <div className="rounded-3xl bg-white p-6 shadow-lift ring-1 ring-navy-900/5">
                <div className="text-[11px] font-bold uppercase tracking-[.18em] text-graphite-400">
                  {p.purpose === 'Venda' ? 'Preço de venda' : 'Renda mensal'}
                </div>
                <div className="mt-1 text-3xl font-extrabold tracking-tight text-navy-950">
                  {formatMoney(p.price, p.currency)}
                  {p.purpose === 'Arrendamento' && <span className="text-base font-semibold text-graphite-400">/mês</span>}
                </div>
                <div className="mt-1 text-sm text-graphite-500">
                  {p.currency !== 'MZN' && <>≈ {formatMT(toMZN(p.price, p.currency))} · </>}
                  {perM2 > 0 && p.purpose === 'Venda' && <>{formatMoney(perM2, p.currency)}/m²</>}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-ivory px-3 py-1 text-xs font-bold text-navy-950 ring-1 ring-navy-900/5">
                    {p.negotiable ? 'Negociável' : 'Preço fixo'}
                  </span>
                  {p.immediate && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">Disponível já</span>
                  )}
                  {p.tier && <span className="rounded-full bg-navy-950 px-3 py-1 text-xs font-bold text-gold-300">{p.tier}</span>}
                </div>

                {myVisit ? (
                  <Link to="/cliente?tab=visitas" className="mt-6 flex items-center gap-3 rounded-2xl bg-gold-50 p-4 ring-1 ring-gold-200">
                    <CalendarCheck className="h-6 w-6 text-gold-700" />
                    <div className="text-sm">
                      <div className="font-bold text-navy-950">
                        Visita {myVisit.status === 'pendente' ? 'pedida' : myVisit.status === 'confirmada' ? 'confirmada' : myVisit.status}
                      </div>
                      <div className="text-graphite-600">
                        {formatDate(myVisit.date, { weekday: 'short', day: 'numeric', month: 'short' })} · {myVisit.time}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <button disabled={!available} onClick={() => setQualOpen(true)} className={btn('gold', 'lg', 'mt-6 w-full')}>
                    <CalendarCheck className="h-5 w-5" /> Marcar Visita
                  </button>
                )}
                <p className="mt-2 text-center font-serif text-lg italic text-graphite-500">Agende a sua visita hoje.</p>
                <div className="mt-3 flex items-center justify-center gap-4 text-[11px] font-semibold text-graphite-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> 60 segundos
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" /> Lembrete WhatsApp
                  </span>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-900/5">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-950 text-sm font-extrabold text-gold-300">
                    {initials(p.advertiser.name)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate font-bold text-navy-950">
                      {p.advertiser.name}
                      {p.advertiser.verified && <CircleCheck className="h-4 w-4 shrink-0 text-gold-600" />}
                    </div>
                    <div className="text-xs text-graphite-500">
                      {ADV_TYPE[p.advertiser.type]} · desde {new Date(p.advertiser.since).getFullYear()}
                    </div>
                  </div>
                </div>
                {contactOpen ? (
                  <div className="mt-5 space-y-2">
                    <a href={`tel:${p.advertiser.phone.replace(/\s/g, '')}`} className={btn('navy', 'md', 'w-full')}>
                      <Phone className="h-4 w-4" /> {p.advertiser.phone}
                    </a>
                    <a
                      href={waLink(p.advertiser.phone, `Olá! Vi o imóvel "${p.title}" na KEYHOUSE PROPERTIES e gostaria de mais informações.`)}
                      target="_blank"
                      rel="noreferrer"
                      className={btn('outline', 'md', 'w-full')}
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl bg-ivory p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-navy-950">
                      <Lock className="h-4 w-4 text-gold-600" /> Contacto protegido
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-graphite-500">
                      Libertado automaticamente após a confirmação da visita — ou desbloqueie já o contacto verificado.
                    </p>
                    <div className="mt-3 font-mono text-sm tracking-wider text-graphite-400">+258 8• ••• ••••</div>
                    <Link to={`/pagamento?itens=contacto&ref=${p.id}`} className={btn('outline', 'sm', 'mt-3 w-full')}>
                      Desbloquear contacto · 200 MT
                    </Link>
                  </div>
                )}
              </div>

              {p.advertiser.id.startsWith('me-') && (
                <Link
                  to={p.advertiser.id === 'me-broker' ? '/intermediario?tab=leads' : '/proprietario?tab=leads'}
                  className="flex items-center gap-3 rounded-3xl border border-dashed border-gold-400 bg-gold-50 p-4 text-sm text-navy-950"
                >
                  <Sparkles className="h-5 w-5 shrink-0 text-gold-600" />
                  <span>
                    <b>Demo:</b> este imóvel é da sua carteira ({p.advertiser.id === 'me-broker' ? 'Intermediário' : 'Proprietário'}). Marque uma visita e veja o lead
                    chegar → <u>gerir leads</u>
                  </span>
                </Link>
              )}

              <Link to="/planos#concierge" className="flex items-center gap-4 rounded-3xl bg-navy-950 p-5 text-white transition hover:ring-2 hover:ring-gold-400/50">
                <Headphones className="h-8 w-8 shrink-0 text-gold-300" />
                <div className="text-sm">
                  <div className="font-bold">Concierge Imobiliário</div>
                  <div className="text-white/60">Visitamos, verificamos e negociamos por si · 5.000 MT</div>
                </div>
              </Link>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-extrabold tracking-tight text-navy-950">
              Imóveis <em className="font-serif font-semibold italic text-gold-600">semelhantes</em>
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => (
                <PropertyCard key={s.id} p={s} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Barra fixa mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-900/10 bg-white/95 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-lg font-extrabold text-navy-950">{priceLabel(p)}</div>
            <div className="truncate text-xs text-graphite-500">
              {p.neighborhood}, {p.city}
            </div>
          </div>
          {myVisit ? (
            <Link to="/cliente?tab=visitas" className={btn('navy', 'md')}>
              <Check className="h-4 w-4" /> Visita marcada
            </Link>
          ) : (
            <button disabled={!available} onClick={() => setQualOpen(true)} className={btn('gold', 'md')}>
              <CalendarCheck className="h-4 w-4" /> Marcar Visita
            </button>
          )}
        </div>
      </div>

      <QualificationModal property={p} open={qualOpen} onClose={() => setQualOpen(false)} />
      {lightbox !== null && <Lightbox photos={photos} index={lightbox} onClose={() => setLightbox(null)} onNav={setLightbox} />}
    </div>
  );
}
