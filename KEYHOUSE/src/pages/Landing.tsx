import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Building,
  CalendarCheck,
  Check,
  FileText,
  Globe,
  Headphones,
  Lock,
  MapPin,
  Megaphone,
  Plane,
  Quote,
  Search,
  ShieldCheck,
  Star,
  Target,
  Video,
} from 'lucide-react';
import { useStore } from '../store/store';
import { useTitle } from '../hooks/useTitle';
import PropertyCard from '../components/PropertyCard';
import { SectionHeading, VerifiedBadge, btn } from '../components/ui';
import { PaymentBadges } from '../components/Footer';
import { TYPE_ICON } from '../components/typeIcons';
import { IMG } from '../data/images';
import { CITIES, NEIGHBORHOODS, PROPERTY_TYPES } from '../lib/constants';
import { applyFilters, describeFilters, parseFilters } from '../lib/search';
import type { Property } from '../lib/types';
import { cn } from '../lib/utils';

type Mode = 'Venda' | 'Arrendamento' | 'investimento';

function HeroSearch() {
  const navigate = useNavigate();
  const { properties, addSearch } = useStore();
  const [mode, setMode] = useState<Mode>('Venda');
  const [where, setWhere] = useState('');
  const [type, setType] = useState('');
  const [budget, setBudget] = useState('');
  const places = useMemo(() => Array.from(new Set([...CITIES, ...NEIGHBORHOODS.Maputo, ...NEIGHBORHOODS.Matola])), []);
  const budgets: [number, string][] =
    mode === 'Arrendamento'
      ? [
          [30000, 'Até 30.000 MT/mês'],
          [80000, 'Até 80.000 MT/mês'],
          [250000, 'Até 250.000 MT/mês'],
          [1000000, 'Até 1.000.000 MT/mês'],
        ]
      : [
          [5000000, 'Até 5 milhões MT'],
          [15000000, 'Até 15 milhões MT'],
          [40000000, 'Até 40 milhões MT'],
          [100000000, 'Até 100 milhões MT'],
        ];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (mode === 'investimento') q.set('categoria', 'investimento');
    else q.set('finalidade', mode);
    const w = where.trim();
    if (w) {
      const city = CITIES.find((c) => c.toLowerCase() === w.toLowerCase());
      if (city) q.set('cidade', city);
      else q.set('q', w);
    }
    if (type) q.set('tipo', type);
    if (budget) q.set('max', budget);
    const f = parseFilters(q);
    const results = applyFilters(
      properties.filter((p) => p.status === 'publicado'),
      f,
    ).length;
    addSearch({ query: q.toString(), label: describeFilters(f), results });
    navigate(`/imoveis?${q.toString()}`);
  };

  const tabs: { id: Mode; label: string }[] = [
    { id: 'Venda', label: 'Comprar' },
    { id: 'Arrendamento', label: 'Arrendar' },
    { id: 'investimento', label: 'Investir' },
  ];

  return (
    <form
      onSubmit={submit}
      className="mt-10 max-w-4xl animate-rise rounded-3xl border border-white/10 bg-white/[.07] p-2 shadow-lift backdrop-blur-xl [animation-delay:120ms]"
    >
      <div className="flex gap-1 p-1.5">
        {tabs.map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => {
              setMode(t.id);
              setBudget('');
            }}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-bold transition',
              mode === t.id ? 'bg-white text-navy-950' : 'text-white/75 hover:text-white',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid gap-1 rounded-[20px] bg-white p-2 text-navy-950 md:grid-cols-[1.3fr_1fr_1fr_auto]">
        <label className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-ivory">
          <MapPin className="h-5 w-5 shrink-0 text-gold-600" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-[.16em] text-graphite-400">Onde</span>
            <input
              list="kh-places"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              placeholder="Cidade, bairro ou zona"
              className="w-full bg-transparent text-[15px] font-semibold outline-none placeholder:text-graphite-300"
            />
          </span>
        </label>
        <datalist id="kh-places">
          {places.map((x) => (
            <option key={x} value={x} />
          ))}
        </datalist>
        <label className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-ivory">
          <Building className="h-5 w-5 shrink-0 text-gold-600" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-[.16em] text-graphite-400">Tipo</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full appearance-none bg-transparent text-[15px] font-semibold outline-none">
              <option value="">Todos os tipos</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.label} value={t.label}>
                  {t.label}
                </option>
              ))}
            </select>
          </span>
        </label>
        <label className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-ivory">
          <Banknote className="h-5 w-5 shrink-0 text-gold-600" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-[.16em] text-graphite-400">Orçamento</span>
            <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full appearance-none bg-transparent text-[15px] font-semibold outline-none">
              <option value="">Sem limite</option>
              {budgets.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </span>
        </label>
        <button type="submit" className={btn('gold', 'lg', 'rounded-2xl')}>
          <Search className="h-5 w-5" /> Pesquisar
        </button>
      </div>
    </form>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <img
        src={IMG.hero}
        alt="Villa contemporânea com piscina infinita sobre o Índico, Costa do Sol, Maputo"
        className="absolute inset-0 h-full w-full object-cover object-[68%_50%]"
      />
      <div className="absolute inset-0 bg-linear-to-r from-navy-950 via-navy-950/80 to-navy-950/10" />
      <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-transparent to-navy-950/50" />
      <div className="container-kh relative flex min-h-[92svh] flex-col justify-center pb-16 pt-28 sm:pt-32">
        <div className="max-w-3xl animate-rise">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-navy-950/40 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[.22em] text-gold-300 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> Imobiliário premium · Moçambique
          </div>
          <h1 className="mt-6 text-[2.55rem] font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.6rem]">
            Encontre o seu próximo imóvel com <span className="kh-gold-text font-serif font-semibold italic">confiança.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Anúncios verificados, contactos protegidos e visitas confirmadas. Do Sommerschield a Vilankulo, só o que é real chega até
            si.
          </p>
        </div>
        <HeroSearch />
        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-white/70">
          {['27 pontos de verificação', 'Contacto protegido até à visita', 'M-Pesa · e-Mola · PayPal'].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-gold-400" />
              {t}
            </span>
          ))}
        </div>
      </div>
      <Link
        to="/imovel/kh-1000"
        className="absolute bottom-10 right-8 hidden w-72 rounded-2xl border border-white/15 bg-navy-950/55 p-4 backdrop-blur-xl transition hover:border-gold-400/60 xl:block"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[.2em] text-gold-300">Em destaque</span>
          <VerifiedBadge small />
        </div>
        <div className="mt-2 font-semibold">Villa com piscina infinita</div>
        <div className="text-xs text-white/60">Costa do Sol, Maputo · V5+ · 1.400 m²</div>
        <div className="mt-3 flex items-end justify-between">
          <span className="text-lg font-extrabold">USD 2.450.000</span>
          <ArrowUpRight className="h-5 w-5 text-gold-300" />
        </div>
      </Link>
    </section>
  );
}

function TrustBar() {
  const stats = [
    ['2.400+', 'imóveis verificados'],
    ['18.000', 'clientes qualificados'],
    ['72h', 'até à primeira visita'],
    ['4,9/5', 'satisfação dos clientes'],
  ];
  return (
    <section className="border-y border-gold-400/15 bg-navy-950">
      <div className="container-kh grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4">
        {stats.map(([n, l], i) => (
          <div key={l} className={cn('px-4 text-center', i > 0 && 'md:border-l md:border-white/10')}>
            <div className="kh-gold-text text-3xl font-extrabold tracking-tight sm:text-4xl">{n}</div>
            <div className="mt-1 text-[13px] font-medium text-white/60">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Destinations({ published }: { published: Property[] }) {
  const dests: { name: string; sub: string; img: string; to: string; count: number; big?: boolean }[] = [
    { name: 'Maputo', sub: 'Sommerschield · Polana · Baixa', img: IMG.apartment, to: '/imoveis?cidade=Maputo', count: published.filter((p) => p.city === 'Maputo').length, big: true },
    { name: 'Costa do Sol', sub: 'Frente mar & Marginal', img: IMG.penthouse, to: `/imoveis?q=${encodeURIComponent('Costa do Sol')}`, count: published.filter((p) => p.neighborhood === 'Costa do Sol').length },
    { name: 'Matola', sub: 'Condomínios & indústria', img: IMG.townhouse, to: '/imoveis?cidade=Matola', count: published.filter((p) => p.city === 'Matola').length },
    { name: 'Ponta do Ouro', sub: 'Terrenos na praia', img: IMG.beach, to: `/imoveis?cidade=${encodeURIComponent('Ponta do Ouro')}`, count: published.filter((p) => p.city === 'Ponta do Ouro').length },
    { name: 'Vilankulo', sub: 'Lodges & turismo', img: IMG.lodge, to: '/imoveis?cidade=Vilankulo', count: published.filter((p) => p.city === 'Vilankulo').length },
  ];
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-kh">
        <SectionHeading
          eyebrow="Destinos"
          title={
            <>
              De Maputo ao <em className="font-serif font-semibold italic text-gold-600">Bazaruto</em>
            </>
          }
          subtitle="Os mercados mais procurados do país — residencial, corporativo e turístico — num só lugar."
        />
        <div className="mt-10 grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dests.map((d) => (
            <Link
              key={d.name}
              to={d.to}
              className={cn('group relative overflow-hidden rounded-3xl bg-navy-900', d.big && 'sm:col-span-2 lg:row-span-2')}
            >
              <img src={d.img} alt={d.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-linear-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white sm:p-6">
                <div>
                  <div className={cn('font-extrabold tracking-tight', d.big ? 'text-3xl sm:text-4xl' : 'text-xl')}>{d.name}</div>
                  <div className="mt-1 text-sm text-white/70">{d.sub}</div>
                </div>
                <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                  {d.count} {d.count === 1 ? 'imóvel' : 'imóveis'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Standard() {
  const pillars = [
    {
      icon: BadgeCheck,
      title: 'Verificado',
      text: 'Cada anúncio passa por 27 pontos de controlo: título de propriedade ou DUAT, licença, fotografias reais e localização confirmada.',
    },
    {
      icon: Lock,
      title: 'Protegido',
      text: 'O contacto do anunciante só é libertado após a confirmação da visita. Sem chamadas indesejadas, sem intermediários fantasma.',
    },
    {
      icon: CalendarCheck,
      title: 'Confirmado',
      text: 'Visitas agendadas automaticamente, com lembretes por WhatsApp. Chega, visita e decide — sem perder tempo.',
    },
  ];
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 text-white sm:py-28">
      <div className="kh-grid absolute inset-0 opacity-[.04]" />
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="container-kh relative">
        <SectionHeading
          light
          align="center"
          eyebrow="O padrão KEYHOUSE"
          title={
            <>
              Confiança não se promete. <em className="kh-gold-text font-serif font-semibold italic">Verifica-se.</em>
            </>
          }
          subtitle="O mercado imobiliário não precisa de mais anúncios. Precisa de anúncios em que se possa confiar."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <div key={p.title} className="relative rounded-3xl border border-white/10 bg-white/[.03] p-8 transition hover:border-gold-400/40">
              <div className="absolute right-6 top-6 font-serif text-5xl italic text-white/10">0{i + 1}</div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-b from-gold-300 to-gold-500 text-navy-950 shadow-gold">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-2xl font-extrabold">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-white/65">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const [who, setWho] = useState<'procura' | 'anuncia'>('procura');
  const flows = {
    procura: [
      { icon: Search, title: 'Pesquise', text: 'Filtre por zona, preço, tipologia e estado. Só vê anúncios validados.' },
      { icon: Target, title: 'Qualifique-se', text: '4 perguntas em 60 segundos: zona, orçamento, quartos e prazo.' },
      { icon: CalendarCheck, title: 'Visite', text: 'Agendamento automático e lembretes por WhatsApp. Presencial ou por vídeo.' },
      { icon: FileText, title: 'Feche', text: 'Minuta de contrato gerada e acompanhamento até à assinatura.' },
    ],
    anuncia: [
      { icon: Megaphone, title: 'Publique', text: '27 campos, 5 minutos, 500 MT. Fotos, vídeo e localização no mapa.' },
      { icon: ShieldCheck, title: 'Validamos', text: 'Verificação documental e classificação da oferta em até 24h.' },
      { icon: Target, title: 'Receba leads', text: 'Só clientes qualificados. Paga apenas pelos leads que aceita.' },
      { icon: Banknote, title: 'Feche e receba', text: 'Comissão calculada automaticamente. Pagamentos por M-Pesa ou e-Mola.' },
    ],
  };
  return (
    <section className="py-20 sm:py-28">
      <div className="container-kh">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Como funciona"
            title={
              <>
                Do anúncio ao fecho, <em className="font-serif font-semibold italic text-gold-600">sem atalhos.</em>
              </>
            }
          />
          <div className="flex rounded-2xl bg-white p-1.5 shadow-soft ring-1 ring-navy-900/5">
            {(
              [
                ['procura', 'Para quem procura'],
                ['anuncia', 'Para quem anuncia'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setWho(id)}
                className={cn(
                  'rounded-xl px-4 py-2.5 text-sm font-bold transition',
                  who === id ? 'bg-navy-950 text-white' : 'text-graphite-500 hover:text-navy-950',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {flows[who].map((s, i) => (
            <div key={s.title} className="relative animate-rise rounded-3xl bg-white p-7 shadow-soft ring-1 ring-navy-900/5" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-navy-950 text-gold-300">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-extrabold text-gold-500">0{i + 1}</span>
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-navy-950">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-graphite-500">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          {who === 'procura' ? (
            <Link to="/imoveis" className={btn('navy', 'lg')}>
              Explorar imóveis verificados <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link to="/publicar" className={btn('gold', 'lg')}>
              Publicar em 5 minutos <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function TypesGrid() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-kh">
        <SectionHeading
          align="center"
          eyebrow="20 tipologias"
          title={
            <>
              Todos os imóveis. <em className="font-serif font-semibold italic text-gold-600">Um só padrão.</em>
            </>
          }
          subtitle="Do quarto no Central ao lodge em Vilankulo — cada tipologia com a mesma exigência de verificação."
        />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {PROPERTY_TYPES.map((t) => {
            const Icon = TYPE_ICON[t.label] ?? Building;
            return (
              <Link
                key={t.label}
                to={`/imoveis?tipo=${encodeURIComponent(t.label)}`}
                className="group flex items-center gap-3 rounded-2xl border border-navy-900/8 bg-ivory px-4 py-4 transition hover:border-gold-400 hover:bg-white hover:shadow-soft"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-navy-900 ring-1 ring-navy-900/5 transition group-hover:bg-navy-950 group-hover:text-gold-300">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-[13.5px] font-bold leading-tight text-navy-950">{t.plural}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Diaspora() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-kh">
        <div className="grid overflow-hidden rounded-[2rem] bg-navy-950 text-white lg:grid-cols-2">
          <div className="relative min-h-[320px]">
            <img src={IMG.lodge} alt="Lodge com vista para o arquipélago do Bazaruto" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-r from-transparent to-navy-950/80 lg:to-navy-950" />
          </div>
          <div className="relative p-8 sm:p-12 lg:p-14">
            <div className="text-[11px] font-bold uppercase tracking-[.25em] text-gold-300">Diáspora & Concierge</div>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Compre em Maputo <em className="kh-gold-text font-serif font-semibold italic">sem sair de Lisboa.</em>
            </h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Um consultor sénior dedicado procura, visita por videochamada, verifica a documentação e negoceia por si. Pague com PayPal,
              acompanhe tudo online.
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
              {[
                [Video, 'Visitas por videochamada'],
                [ShieldCheck, 'Verificação de título / DUAT'],
                [Globe, 'Pagamento por PayPal'],
                [Headphones, 'Consultor dedicado'],
              ].map(([Icon, label]) => {
                const I = Icon as typeof Video;
                return (
                  <li key={label as string} className="flex items-center gap-2.5">
                    <I className="h-4 w-4 text-gold-300" /> {label as string}
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/planos#concierge" className={btn('gold', 'lg')}>
                <Plane className="h-4 w-4" /> Concierge · 5.000 MT
              </Link>
              <PaymentBadges />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      quote: 'Em duas semanas recebi seis leads qualificados e arrendei o meu T3 na Polana. Zero curiosos, zero chamadas às 23h.',
      name: 'Hélder M.',
      role: 'Proprietário · Maputo',
    },
    {
      quote: 'Comprámos a casa na Matola a partir de Joanesburgo. O Concierge tratou de tudo — das visitas por vídeo à minuta.',
      name: 'Luísa T.',
      role: 'Cliente na diáspora · África do Sul',
    },
    {
      quote: 'A subscrição paga-se no primeiro fecho. O painel de comissões mudou a forma como giro a minha carteira.',
      name: 'Edson C.',
      role: 'Intermediário · Matola',
    },
  ];
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-kh">
        <SectionHeading
          align="center"
          eyebrow="Prova social"
          title={
            <>
              Quem usa, <em className="font-serif font-semibold italic text-gold-600">recomenda.</em>
            </>
          }
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-3xl bg-ivory p-8 ring-1 ring-navy-900/5">
              <Quote className="h-8 w-8 text-gold-400" />
              <blockquote className="mt-4 flex-1 font-serif text-xl leading-snug text-navy-950">“{t.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center justify-between">
                <div>
                  <div className="font-bold text-navy-950">{t.name}</div>
                  <div className="text-xs text-graphite-500">{t.role}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function OwnerCTA() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-kh">
        <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-gold-200 via-gold-300 to-gold-500 p-10 sm:p-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="text-[11px] font-bold uppercase tracking-[.25em] text-navy-900/70">Para proprietários e intermediários</div>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-navy-950 sm:text-5xl">
                Publique em 5 minutos. <em className="font-serif font-semibold italic">Venda em dias.</em>
              </h2>
              <p className="mt-4 text-lg text-navy-900/75">
                Leads qualificados, visitas confirmadas e comissão calculada automaticamente. Paga pelo resultado, não pela promessa.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link to="/publicar" className={btn('navy', 'lg')}>
                Publicar imóvel · 500 MT <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/planos" className={btn('white', 'lg')}>
                Ver planos e serviços
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  useTitle('KEYHOUSE PROPERTIES — Imóveis Premium em Moçambique');
  const { properties } = useStore();
  const published = useMemo(() => properties.filter((p) => p.status === 'publicado'), [properties]);
  const featured = useMemo(
    () =>
      [...published]
        .sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.verified) - Number(a.verified) || b.views - a.views)
        .slice(0, 6),
    [published],
  );

  return (
    <>
      <Hero />
      <TrustBar />
      <section className="py-20 sm:py-28">
        <div className="container-kh">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Selecção KEYHOUSE"
              title={
                <>
                  Imóveis em <em className="font-serif font-semibold italic text-gold-600">destaque</em>
                </>
              }
              subtitle="Seleccionados e verificados pela nossa equipa — documentação, fotografias e localização confirmadas."
            />
            <Link to="/imoveis" className={btn('outline', 'md', 'shrink-0')}>
              Ver todos os imóveis <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>
      <Destinations published={published} />
      <Standard />
      <HowItWorks />
      <TypesGrid />
      <Diaspora />
      <Testimonials />
      <OwnerCTA />
    </>
  );
}
