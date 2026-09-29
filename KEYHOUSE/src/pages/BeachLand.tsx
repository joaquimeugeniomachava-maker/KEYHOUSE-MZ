import { useEffect, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Anchor,
  ArrowRight,
  Camera,
  Check,
  Copy,
  FileText,
  Handshake,
  Info,
  Landmark,
  MapPin,
  MessageCircle,
  Ruler,
  Scale,
  Sprout,
  TreePalm,
  Video,
} from 'lucide-react';
import { useStore } from '../store/store';
import { useTitle } from '../hooks/useTitle';
import MapView from '../components/MapView';
import { ContactLink, Field, SectionHeading, Select, btn, inputCls } from '../components/ui';
import {
  BEACH_PLOTS,
  BEACH_RANGE,
  BEACH_ZONES,
  LAND_DOC_LABEL,
  plotPricing,
  type BeachPlot,
  type BeachZone,
  type BeachZoneId,
} from '../data/beach';
import { IMG } from '../data/images';
import { BRAND } from '../lib/constants';
import { cn, formatMoney, groupThousands, isValidPhone, waLink } from '../lib/utils';

/* ------------------------------------------------------------------ */
/* Dados da página (Colecção Praias)                                   */
/* ------------------------------------------------------------------ */

const SIZES = ['1–5 ha', '5–10 ha', '10–20 ha', '20–50 ha', 'Indiferente'];
const PURPOSES = ['Casa de férias', 'Lodge / turismo', 'Resort / hotel', 'Investimento', 'Outro'];
const PROFILES = [
  { id: 'nacional', label: 'Moçambicano residente' },
  { id: 'diaspora', label: 'Moçambicano na diáspora' },
  { id: 'empresa', label: 'Empresa moçambicana' },
  { id: 'estrangeiro', label: 'Estrangeiro / empresa estrangeira' },
] as const;
type ProfileId = (typeof PROFILES)[number]['id'];

const GENERAL_MSG =
  'Olá KEYHOUSE! Tenho interesse nos terrenos de praia (Macaneta, Barra, Jangamo, Tofo e Vilankulo). Pode enviar-me a lista disponível?';

const STEPS = [
  { icon: MessageCircle, title: 'Diga o que procura', text: 'Zona, hectares, finalidade e orçamento, em 1 minuto.' },
  { icon: Camera, title: 'Receba a lista', text: 'Fotografias reais, localização e estado da documentação de cada lote.' },
  { icon: Video, title: 'Visita acompanhada', text: 'No local ou por videochamada, para quem está na diáspora.' },
  { icon: Handshake, title: 'Fecho seguro', text: 'Minuta de contrato, pagamentos combinados e acompanhamento jurídico.' },
];

const SAFETY = [
  {
    icon: Landmark,
    title: 'DUAT, não "escritura de terra"',
    text: 'Em Moçambique a terra é propriedade do Estado. O que se transmite é o Direito de Uso e Aproveitamento da Terra (DUAT) e as benfeitorias. Confirmamos o título ou o processo nos Serviços de Cadastro.',
  },
  {
    icon: Anchor,
    title: 'A faixa dos 100 metros',
    text: 'Os primeiros 100 m a partir da linha das máximas preia-mares são zona de protecção parcial: aí não se adquire DUAT, apenas licença especial. Indicamos a posição de cada lote face a esta faixa.',
  },
  {
    icon: Sprout,
    title: 'Dunas e mangais',
    text: 'São ecossistemas frágeis: aí só é permitida a construção de infra-estruturas básicas, com licença especial. Junto à costa, as construções têm de deixar acessos livres à praia a cada 100 m (Decreto n.º 45/2006, art. 67). Indicamos se o lote está nas dunas ou atrás delas.',
  },
  {
    icon: Ruler,
    title: 'Limites, área e acessos',
    text: 'Confirmamos marcos, área (levantamento topográfico), vizinhos e a posição da comunidade local, para evitar conflitos e vendas duplicadas. E dizemos o que existe de estrada, energia, água e rede.',
  },
  {
    icon: Scale,
    title: 'Estrangeiros e diáspora',
    text: 'Pela lei em vigor, um estrangeiro só obtém DUAT com projecto de investimento aprovado e 5 anos de residência em Moçambique, ou através de empresa registada no país. Moçambicanos na diáspora compram como nacionais.',
  },
  {
    icon: FileText,
    title: 'Contrato acompanhado',
    text: 'Minuta, pagamentos combinados lote a lote e acompanhamento até à transmissão junto das autoridades.',
  },
];

const LEGAL_NOTE =
  'Informação geral, com base na Lei de Terras (Lei n.º 19/97), no seu Regulamento (Decreto n.º 66/98) e no Regulamento para a Prevenção da Poluição e Protecção do Ambiente Marinho e Costeiro (Decreto n.º 45/2006). Em Outubro de 2025 o Governo aprovou uma proposta de nova Lei de Terras, submetida à Assembleia da República, que pode alterar estas regras, sobretudo para estrangeiros. Confirme sempre com um jurista antes de fechar.';

const FAQ: [string, string][] = [
  [
    'Posso comprar um terreno na praia sendo estrangeiro?',
    'Pela lei em vigor, uma pessoa estrangeira precisa de projecto de investimento aprovado e de residir em Moçambique há pelo menos 5 anos; uma empresa estrangeira tem de estar registada no país e ter projecto aprovado. A proposta de nova Lei de Terras pode restringir mais estes casos. Orientamos cada situação com jurista, incluindo parcerias com sócios moçambicanos.',
  ],
  [
    'O terreno chega até à areia?',
    'Os primeiros 100 m a partir da linha das máximas preia-mares são zona de protecção parcial: não se adquire DUAT nessa faixa, embora possam ser emitidas licenças especiais para determinadas actividades. Em cada lote indicamos a distância ao mar e a posição face a esta faixa.',
  ],
  [
    'Posso construir num terreno nas dunas?',
    'As dunas são ecossistemas frágeis. Pelo Decreto n.º 45/2006 (art. 67), só é permitida a construção de infra-estruturas básicas, com licença especial e respeito pela legislação ambiental. Junto à costa, as construções têm de deixar acessos livres à praia a cada 100 m. Num terreno grande, a zona atrás das dunas pode ter mais opções: confirmamos em levantamento topográfico antes da venda.',
  ],
  [
    'Estou fora do país. Posso comprar à distância?',
    'Sim. Enviamos fotografias e vídeo do terreno, fazemos a visita por videochamada e acompanhamos a documentação. Com o Concierge, um consultor trata de todo o processo por si.',
  ],
  [
    'Os preços são negociáveis?',
    'Sim. São preços de oportunidade, e as condições de pagamento são combinadas lote a lote. Peça a lista para ver hectares, preço e documentação de cada terreno.',
  ],
];

const isZoneId = (v: string | null): v is BeachZoneId => BEACH_ZONES.some((z) => z.id === v);
const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/* ------------------------------------------------------------------ */
/* Peças                                                               */
/* ------------------------------------------------------------------ */

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-2 text-[13px] font-semibold transition',
        active ? 'border-navy-950 bg-navy-950 text-white' : 'border-navy-900/10 bg-white text-graphite-600 hover:border-navy-900/30',
      )}
    >
      {active && <Check className="mr-1 inline h-3.5 w-3.5" strokeWidth={3} />}
      {children}
    </button>
  );
}

function IllustrativeTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'rounded-full bg-navy-950/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-white/90 backdrop-blur',
        className,
      )}
    >
      Imagem ilustrativa
    </span>
  );
}

function ZoneCard({ z, onAsk }: { z: BeachZone; onAsk: (id: BeachZoneId) => void }) {
  return (
    <article id={`zona-${z.id}`} className="scroll-mt-28 overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-navy-900/5">
      <div className="relative aspect-[16/10] overflow-hidden bg-navy-100">
        <img src={z.image} alt={`${z.name}, imagem ilustrativa da região`} loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950/75 via-navy-950/10 to-transparent" />
        <IllustrativeTag className="absolute left-3 top-3" />
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <div className="text-2xl font-extrabold tracking-tight">{z.name}</div>
          <div className="text-sm text-white/75">
            {z.area} · {z.district}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="font-serif text-xl italic text-navy-950">{z.tagline}</div>
        <ul className="mt-4 space-y-2 text-sm text-graphite-600">
          {z.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" strokeWidth={3} /> {h}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {z.idealFor.map((t) => (
            <span key={t} className="rounded-full bg-gold-50 px-2.5 py-1 text-[12px] font-semibold text-navy-950 ring-1 ring-gold-200">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-navy-900/5 pt-4">
          <span className="text-xs font-semibold text-graphite-500">Lotes disponíveis · preço sob consulta</span>
          <button onClick={() => onAsk(z.id)} className={btn('navy', 'sm')}>
            Pedir lista de {z.name} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function PlotCard({ p }: { p: BeachPlot }) {
  const zone = BEACH_ZONES.find((z) => z.id === p.zoneId);
  const illustrative = p.photos.length === 0;
  const img = p.photos[0] ?? zone?.image ?? IMG.beach;
  const { total, perHa } = plotPricing(p);
  const perM2 = perHa ? perHa / 10000 : 0;
  const msg = `Olá KEYHOUSE! Tenho interesse no terreno ${p.id}: ${p.title} (${groupThousands(p.hectares)} ha, ${zone?.name ?? ''}). Pode enviar-me fotos, localização e documentação?`;
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-navy-900/5">
      <div className="relative aspect-[4/3] bg-navy-100">
        <img src={img} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
        {illustrative && <IllustrativeTag className="absolute left-3 top-3" />}
        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-navy-950">
          {groupThousands(p.hectares)} ha
        </span>
      </div>
      <div className="p-5">
        <div className="text-[11px] font-bold uppercase tracking-[.16em] text-gold-600">
          {zone?.name} · {p.id}
        </div>
        <h3 className="mt-1 font-bold text-navy-950">{p.title}</h3>
        <dl className="mt-3 space-y-1.5 text-[13px] text-graphite-600">
          {[
            ['Mar', p.seaDistance],
            ['Acesso', p.access],
            ['Documentação', LAND_DOC_LABEL[p.docs]],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt>{k}</dt>
              <dd className="text-right font-semibold text-navy-950">{v}</dd>
            </div>
          ))}
        </dl>
        {p.inDunes && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-[12px] leading-relaxed text-amber-900 ring-1 ring-amber-200">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Zona de dunas: só infra-estruturas básicas, com licença especial (Decreto n.º 45/2006, art. 67). Levantamento e licenciamento a
            confirmar antes da venda.
          </div>
        )}
        {p.notes && <p className="mt-3 text-[13px] text-graphite-500">{p.notes}</p>}
        {total && perHa ? (
          <div className="mt-4">
            <div className="text-lg font-extrabold text-navy-950">
              {formatMoney(perHa, p.currency)}
              <span className="text-sm font-semibold text-graphite-400">/ha</span>
            </div>
            <div className="text-xs text-graphite-500">
              Total {formatMoney(total, p.currency)}
              {perM2 >= 10 && ` · ≈ ${formatMoney(perM2, p.currency)}/m²`}
              {p.negotiable && ' · negociável'}
            </div>
          </div>
        ) : (
          <div className="mt-4 text-lg font-extrabold text-navy-950">Preço sob consulta</div>
        )}
        <div className="mt-4 flex gap-2">
          <ContactLink official newTab href={waLink(BRAND.whatsapp, msg)} className={btn('navy', 'sm', 'flex-1')}>
            <MessageCircle className="h-4 w-4" /> Pedir detalhes
          </ContactLink>
          {p.mapLink && (
            <a href={p.mapLink} target="_blank" rel="noreferrer" className={btn('outline', 'sm')} aria-label="Ver no mapa">
              <MapPin className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function InquiryForm({ zones, setZones }: { zones: BeachZoneId[]; setZones: (z: BeachZoneId[]) => void }) {
  const { notify } = useStore();
  const [size, setSize] = useState('');
  const [purpose, setPurpose] = useState('');
  const [budget, setBudget] = useState('');
  const [profile, setProfile] = useState<ProfileId | ''>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [ready, setReady] = useState(false);

  const errors: Record<'zones' | 'name' | 'phone', string | null> = {
    zones: zones.length ? null : 'Escolha pelo menos uma zona.',
    name: name.trim().length >= 2 ? null : 'Indique o seu nome.',
    phone: isValidPhone(phone) ? null : 'Número inválido. Ex.: 84 123 4567 ou +351 912 345 678',
  };
  const err = (k: keyof typeof errors) => (showErrors ? errors[k] : null);
  const valid = Object.values(errors).every((e) => !e);

  const zoneNames = BEACH_ZONES.filter((z) => zones.includes(z.id)).map((z) => z.name);
  const profileLabel = PROFILES.find((p) => p.id === profile)?.label;
  const message = [
    'Olá KEYHOUSE! Quero receber a lista de terrenos de praia:',
    '',
    `📍 Zonas: ${zoneNames.join(', ') || '—'}`,
    `📐 Área: ${size || 'Indiferente'}`,
    `🎯 Finalidade: ${purpose || 'A definir'}`,
    `💰 Orçamento: ${budget.trim() || 'A definir'}`,
    profileLabel ? `👤 Perfil: ${profileLabel}` : null,
    '',
    `Nome: ${name.trim()} · WhatsApp: ${phone.trim()}`,
    'Ref.: Colecção Praias',
  ]
    .filter((l): l is string => l !== null)
    .join('\n');

  const toggleZone = (id: BeachZoneId) => {
    setZones(zones.includes(id) ? zones.filter((x) => x !== id) : [...zones, id]);
    setReady(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      notify('Mensagem copiada.');
    } catch {
      notify('Não foi possível copiar. Seleccione o texto manualmente.', 'error');
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lift ring-1 ring-navy-900/5 sm:p-8">
      {!ready ? (
        <div className="space-y-5">
          <Field label="Zonas de interesse" error={err('zones')}>
            <div className="flex flex-wrap gap-2">
              {BEACH_ZONES.map((z) => (
                <Chip key={z.id} active={zones.includes(z.id)} onClick={() => toggleZone(z.id)}>
                  {z.name}
                </Chip>
              ))}
            </div>
          </Field>
          <Field label="Área pretendida">
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <Chip key={s} active={size === s} onClick={() => setSize(size === s ? '' : s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </Field>
          <Field label="Finalidade">
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map((p) => (
                <Chip key={p} active={purpose === p} onClick={() => setPurpose(purpose === p ? '' : p)}>
                  {p}
                </Chip>
              ))}
            </div>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Orçamento (opcional)" hint="Ex.: 2.000.000 MT ou USD 40.000">
              <input value={budget} onChange={(e) => setBudget(e.target.value)} className={inputCls()} placeholder="A definir" />
            </Field>
            <Field label="Perfil do comprador">
              <Select value={profile} onChange={(e) => setProfile(e.target.value as ProfileId | '')}>
                <option value="">Seleccione…</option>
                {PROFILES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Nome" error={err('name')}>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls(!!err('name'))} />
            </Field>
            <Field label="WhatsApp" error={err('phone')}>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                className={inputCls(!!err('phone'))}
                placeholder="84 123 4567"
              />
            </Field>
          </div>
          {profile === 'estrangeiro' && (
            <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Pela lei em vigor, um estrangeiro só obtém DUAT com projecto de investimento aprovado e 5 anos de residência em Moçambique, ou
                através de empresa registada no país. Está em discussão uma nova Lei de Terras que pode mudar estas regras. Orientamos cada caso
                com jurista.
              </p>
            </div>
          )}
          <button
            onClick={() => {
              if (!valid) {
                setShowErrors(true);
                return;
              }
              setReady(true);
            }}
            className={btn('gold', 'lg', 'w-full')}
          >
            Preparar pedido <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-[13px] font-bold text-navy-950">A mensagem que vai enviar à KEYHOUSE:</div>
          <div className="whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-[#DCF8C6] p-4 text-[13px] leading-relaxed text-[#0B3B2E] shadow-sm">
            {message}
          </div>
          {BRAND.whatsapp ? (
            <ContactLink
              official
              newTab
              href={waLink(BRAND.whatsapp, message)}
              onClick={() => notify('Pedido enviado! A KEYHOUSE responde com a lista, as fotos e a localização.')}
              className={btn('gold', 'lg', 'w-full')}
            >
              <MessageCircle className="h-4 w-4" /> Enviar pelo WhatsApp
            </ContactLink>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>O WhatsApp da KEYHOUSE está a ser configurado. Copie a mensagem e envie-a mais tarde.</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button onClick={copy} className={btn('outline', 'md')}>
              <Copy className="h-4 w-4" /> Copiar mensagem
            </button>
            <button onClick={() => setReady(false)} className={btn('ghost', 'md')}>
              Voltar e corrigir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export default function BeachLand() {
  useTitle('Terrenos de Praia em Macaneta, Tofo, Barra, Jangamo e Vilankulo — KEYHOUSE PROPERTIES');
  const [params] = useSearchParams();
  const zonaParam = params.get('zona');
  const [zones, setZones] = useState<BeachZoneId[]>(isZoneId(zonaParam) ? [zonaParam] : []);

  useEffect(() => {
    if (!isZoneId(zonaParam)) return;
    const id: BeachZoneId = zonaParam;
    setZones((z) => (z.includes(id) ? z : [...z, id]));
  }, [zonaParam]);

  const askZone = (id: BeachZoneId) => {
    setZones([id]);
    window.setTimeout(() => scrollToId('pedir-lista'), 60);
  };

  const markers = BEACH_ZONES.map((z) => ({ id: z.id, lat: z.lat, lng: z.lng, label: z.name }));

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <img
          src={IMG.beach}
          alt="Terreno de praia com dunas e mar turquesa, imagem ilustrativa"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-navy-950 via-navy-950/80 to-navy-950/20" />
        <div className="container-kh relative py-16 sm:py-24">
          <div className="max-w-3xl animate-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-navy-950/40 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[.22em] text-gold-300 backdrop-blur">
              <TreePalm className="h-3.5 w-3.5" /> Colecção Praias · Maputo e Inhambane
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Terrenos de praia,{' '}
              <span className="kh-gold-text font-serif font-semibold italic">da Macaneta a Vilankulo.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              Macaneta, Barra, Jangamo, Tofo e Vilankulo: de {BEACH_RANGE.minHa} a {BEACH_RANGE.maxHa} hectares, a preços de oportunidade. Para
              casa de férias, lodge, resort ou investimento. O DUAT e a posição face à faixa legal dos 100 m são confirmados antes de cada visita.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => scrollToId('pedir-lista')} className={btn('gold', 'lg')}>
                Pedir lista de terrenos <ArrowRight className="h-4 w-4" />
              </button>
              <ContactLink official newTab href={waLink(BRAND.whatsapp, GENERAL_MSG)} className={btn('glass', 'lg')}>
                <MessageCircle className="h-4 w-4" /> Falar com a KEYHOUSE
              </ContactLink>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-white/75">
              {[
                `${BEACH_RANGE.minHa} a ${BEACH_RANGE.maxHa} hectares`,
                `${BEACH_ZONES.length} destinos no Índico`,
                'Preços negociáveis',
                'Visitas por videochamada para a diáspora',
              ].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gold-400" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <IllustrativeTag className="absolute bottom-4 right-4" />
      </section>

      {/* ---------- Lotes em destaque (dados reais) ---------- */}
      {BEACH_PLOTS.length > 0 && (
        <section className="container-kh pt-16 sm:pt-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Lotes em destaque"
              title={
                <>
                  Disponível <em className="font-serif font-semibold italic text-gold-600">agora</em>
                </>
              }
            />
            <span className="text-sm text-graphite-500">
              {BEACH_PLOTS.length} {BEACH_PLOTS.length === 1 ? 'lote publicado' : 'lotes publicados'} · outros na lista por WhatsApp
            </span>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BEACH_PLOTS.map((p) => (
              <PlotCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      {/* ---------- Zonas ---------- */}
      <section className="container-kh py-16 sm:py-20">
        <SectionHeading
          eyebrow={`${BEACH_ZONES.length} destinos`}
          title={
            <>
              Escolha a <em className="font-serif font-semibold italic text-gold-600">sua praia</em>
            </>
          }
          subtitle="Cada zona tem o seu perfil de investimento. Os hectares, o preço e a documentação de cada lote seguem na lista enviada por WhatsApp."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {BEACH_ZONES.map((z) => (
            <ZoneCard key={z.id} z={z} onAsk={askZone} />
          ))}
        </div>
      </section>



      {/* ---------- Mapa + como funciona ---------- */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-kh grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="overflow-hidden rounded-3xl shadow-soft ring-1 ring-navy-900/5">
            <MapView markers={markers} onMarkerClick={(id) => scrollToId(`zona-${id}`)} className="h-[420px]" />
            <div className="bg-ivory px-4 py-2.5 text-xs text-graphite-500">
              <MapPin className="mr-1 inline h-3.5 w-3.5 text-gold-600" />
              Localização aproximada das zonas. A localização exacta de cada lote segue na lista.
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Como funciona"
              title={
                <>
                  Do pedido ao <em className="font-serif font-semibold italic text-gold-600">contrato</em>
                </>
              }
            />
            <ol className="mt-8 space-y-5">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-navy-950 text-gold-300">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-extrabold text-navy-950">
                      {i + 1}. {s.title}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-graphite-500">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- Pedir lista ---------- */}
      <section id="pedir-lista" className="scroll-mt-24 py-16 sm:py-20">
        <div className="container-kh grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading
              eyebrow="Pedir lista"
              title={
                <>
                  Receba os terrenos que <em className="font-serif font-semibold italic text-gold-600">encaixam</em> no seu projecto
                </>
              }
              subtitle="Diga-nos a zona, o tamanho e a finalidade. Enviamos a lista com fotografias, localização e estado da documentação de cada lote."
            />
            <ul className="mt-6 space-y-3 text-sm text-graphite-600">
              {[
                [Camera, 'Fotografias reais e vídeo do terreno'],
                [Landmark, 'Estado do DUAT de cada lote'],
                [Video, 'Visita no local ou por videochamada'],
              ].map(([Icon, label]) => {
                const I = Icon as typeof Camera;
                return (
                  <li key={label as string} className="flex items-center gap-2.5">
                    <I className="h-4 w-4 text-gold-600" /> {label as string}
                  </li>
                );
              })}
            </ul>
          </div>
          <InquiryForm zones={zones} setZones={setZones} />
        </div>
      </section>

      {/* ---------- Compra segura ---------- */}
      <section className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-24">
        <div className="kh-grid absolute inset-0 opacity-[.04]" />
        <div className="container-kh relative">
          <SectionHeading
            light
            align="center"
            eyebrow="Compra segura"
            title={
              <>
                Terra na praia, <em className="kh-gold-text font-serif font-semibold italic">com a lei do seu lado.</em>
              </>
            }
            subtitle="O que verificamos em cada lote antes de o apresentar."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SAFETY.map((s) => (
              <div key={s.title} className="rounded-3xl border border-white/10 bg-white/[.03] p-7">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-b from-gold-300 to-gold-500 text-navy-950 shadow-gold">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{s.text}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-white/45">{LEGAL_NOTE}</p>
        </div>
      </section>

      {/* ---------- Perguntas frequentes ---------- */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-kh grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[.25em] text-gold-600">Perguntas frequentes</div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950">Antes de comprar terra na praia</h2>
            <p className="mt-3 text-graphite-500">Respostas directas às dúvidas mais comuns de compradores e investidores.</p>
          </div>
          <div className="space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group rounded-2xl bg-ivory p-5 ring-1 ring-navy-900/5 open:bg-white open:shadow-soft">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-navy-950">
                  {q}
                  <ArrowRight className="h-4 w-4 shrink-0 text-gold-600 transition group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-graphite-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Proprietários ---------- */}
      <section className="py-16">
        <div className="container-kh">
          <div className="flex flex-col gap-5 rounded-3xl bg-linear-to-br from-gold-200 via-gold-300 to-gold-500 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <div className="text-2xl font-extrabold text-navy-950">Tem terrenos na praia para vender?</div>
              <p className="mt-1 text-navy-900/75">Publique na KEYHOUSE: verificação, leads qualificados e visitas confirmadas.</p>
            </div>
            <Link to="/publicar" className={btn('navy', 'lg', 'shrink-0')}>
              Publicar terreno <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
