import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  Crown,
  ImagePlus,
  Info,
  LocateFixed,
  LoaderCircle,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Upload,
  Video,
  X,
} from 'lucide-react';
import { useStore } from '../store/store';
import { useTitle } from '../hooks/useTitle';
import MapView from '../components/MapView';
import { Field, PageHeader, Select, VerifiedBadge, YesNo, btn, inputCls } from '../components/ui';
import { IMG } from '../data/images';
import { ME_BROKER, ME_OWNER } from '../data/seed';
import {
  CITIES,
  CITY_COORDS,
  CONDITIONS,
  CURRENCIES,
  NEIGHBORHOODS,
  PRODUCTS,
  PROPERTY_TYPES,
  PURPOSES,
  TYPE_GROUPS,
  TYPOLOGIES,
  ZONES,
  type TypeGroup,
} from '../lib/constants';
import {
  EMPTY_DRAFT,
  FIELDS,
  draftToProperty,
  validateDraft,
  type BoolKey,
  type FieldKey,
  type ListingDraft,
} from '../lib/listing';
import type { Currency, Purpose } from '../lib/types';
import { cn, formatMT, formatMoney, resizeImage, toMZN } from '../lib/utils';

const STEPS = [
  { title: 'Identificação', desc: 'Tipo, finalidade e localização administrativa.' },
  { title: 'Áreas & divisões', desc: 'Dimensões e compartimentos do imóvel.' },
  { title: 'Estado & documentação', desc: 'Conservação e documentos legais.' },
  { title: 'Condições comerciais', desc: 'Preço, moeda, negociação e comissão.' },
  { title: 'Media & localização', desc: 'Fotografias, vídeo e posição no mapa.' },
  { title: 'Rever & publicar', desc: 'Confirme os dados e submeta para validação.' },
];

type NumKey = 'floor' | 'totalArea' | 'usefulArea' | 'bedrooms' | 'bathrooms' | 'parking' | 'price' | 'commission';

export default function Publish() {
  useTitle('Publicar Imóvel — KEYHOUSE PROPERTIES');
  const navigate = useNavigate();
  const { role, setRole, subscription, addProperty, notify } = useStore();
  const [draft, setDraft] = useState<ListingDraft>(EMPTY_DRAFT);
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [titleEdited, setTitleEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [addHighlight, setAddHighlight] = useState(true);
  const [accept, setAccept] = useState(false);
  const [videoMode, setVideoMode] = useState<'upload' | 'link'>('upload');
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const errors = useMemo(() => validateDraft(draft), [draft]);
  const validCount = FIELDS.filter((f) => !errors[f.key]).length;
  const allValid = validCount === FIELDS.length;
  const autoTitle = useMemo(
    () =>
      draft.type
        ? `${draft.type}${draft.typology && draft.typology !== 'Não aplicável' ? ` ${draft.typology}` : ''}${draft.neighborhood.trim() ? ` em ${draft.neighborhood.trim()}` : ''}`
        : '',
    [draft.type, draft.typology, draft.neighborhood],
  );
  useEffect(() => {
    if (!titleEdited) setTitle(autoTitle);
  }, [autoTitle, titleEdited]);
  useEffect(() => {
    setMapCenter(null);
  }, [draft.city]);

  function setField<K extends keyof ListingDraft>(k: K, v: ListingDraft[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
    if (k !== 'lng') setTouched((t) => ({ ...t, [k as string]: true }));
  }
  const err = (k: FieldKey) => (touched[k] ? errors[k] : null);
  const F = (k: FieldKey) => {
    const meta = FIELDS.find((f) => f.key === k)!;
    return { label: meta.label, n: meta.n, valid: !errors[k], error: err(k) };
  };
  const stepFields = (i: number) => FIELDS.filter((f) => f.step === i);
  const stepValid = (i: number) => i < 5 && stepFields(i).every((f) => !errors[f.key]);

  const numInput = (k: NumKey, placeholder: string, suffix?: string, allowNeg = false) => (
    <div className="relative">
      <input
        inputMode="decimal"
        value={draft[k]}
        onChange={(e) => setField(k, e.target.value.replace(allowNeg ? /[^\d-]/g : /[^\d.,]/g, ''))}
        placeholder={placeholder}
        className={cn(inputCls(!!err(k)), suffix && 'pr-14')}
      />
      {suffix && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-graphite-400">{suffix}</span>}
    </div>
  );
  const bool = (k: BoolKey) => <YesNo value={draft[k]} onChange={(v) => setField(k, v)} />;

  const goTo = (i: number) => {
    setStep(i);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const next = () => {
    const fields = stepFields(step);
    setTouched((t) => ({ ...t, ...Object.fromEntries(fields.map((f) => [f.key, true])) }));
    const bad = fields.filter((f) => errors[f.key]);
    if (bad.length) {
      notify(`Corrija ${bad.length} ${bad.length === 1 ? 'campo' : 'campos'} para continuar.`, 'error');
      return;
    }
    goTo(Math.min(5, step + 1));
  };

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, Math.max(0, 12 - draft.photos.length));
    if (!list.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(list.map((f) => resizeImage(f)));
      setDraft((d) => ({ ...d, photos: [...d.photos, ...urls].slice(0, 12) }));
      setTouched((t) => ({ ...t, photos: true }));
    } catch {
      notify('Não foi possível processar uma das imagens.', 'error');
    } finally {
      setUploading(false);
    }
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    onFiles(e.dataTransfer.files);
  };

  const locate = () => {
    if (!navigator.geolocation) {
      notify('Geolocalização indisponível neste dispositivo.', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setField('lat', latitude.toFixed(6));
        setField('lng', longitude.toFixed(6));
        setMapCenter([latitude, longitude]);
      },
      () => notify('Não foi possível obter a sua localização.', 'error'),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const fillDemo = () => {
    setDraft({
      type: 'Apartamento',
      purpose: 'Venda',
      typology: 'T3',
      neighborhood: 'Sommerschield',
      city: 'Maputo',
      zone: 'Zona nobre',
      floor: '5',
      totalArea: '185',
      usefulArea: '160',
      bedrooms: '3',
      bathrooms: '2',
      livingRoom: true,
      kitchen: true,
      balcony: true,
      parking: '2',
      condition: 'Como novo',
      furnished: false,
      hasTitle: true,
      hasLicense: true,
      immediate: true,
      price: '295000',
      currency: 'USD',
      negotiable: true,
      commission: '3',
      photos: [IMG.apartment, IMG.kitchen1, IMG.bedroom, IMG.bath1],
      video: 'https://youtu.be/keyhouse-tour-sommerschield',
      lat: '-25.955500',
      lng: '32.592500',
    });
    setTimeout(() => setMapCenter([-25.9555, 32.5925]), 0);
    setTouched(Object.fromEntries(FIELDS.map((f) => [f.key, true])));
    setDescription(
      'Apartamento T3 luminoso num condomínio recente do Sommerschield, com suite, cozinha equipada, varanda e dois lugares de garagem. Segurança 24h e gerador.',
    );
    setTitleEdited(false);
    notify('Exemplo preenchido — 27/27 campos válidos.', 'info');
  };

  const included = !!subscription;
  const fee = included ? 0 : PRODUCTS.publicacao.price;
  const total = fee + (addHighlight ? PRODUCTS.destaque.price : 0);

  const submit = () => {
    if (!allValid) {
      const first = FIELDS.find((f) => errors[f.key]);
      setTouched(Object.fromEntries(FIELDS.map((f) => [f.key, true])));
      notify(`Faltam ${FIELDS.length - validCount} campos obrigatórios.`, 'error');
      if (first) goTo(first.step);
      return;
    }
    if (!accept) {
      notify('Confirme a declaração de veracidade para continuar.', 'error');
      return;
    }
    const isBroker = role === 'intermediario';
    if (!isBroker) setRole('proprietario');
    const id = `kh-${Date.now().toString().slice(-5)}`;
    const property = draftToProperty(draft, {
      id,
      title: title.trim() || autoTitle,
      description: description.trim() || `${autoTitle}. Anúncio validado pela equipa KEYHOUSE.`,
      advertiser: isBroker ? ME_BROKER : ME_OWNER,
      status: included ? 'em_validacao' : 'pendente_pagamento',
    });
    addProperty(property);
    const items = [...(included ? [] : ['publicacao']), ...(addHighlight ? ['destaque'] : [])];
    if (!items.length) {
      notify('Anúncio submetido para validação — incluído no seu plano.');
      navigate(isBroker ? '/intermediario' : '/proprietario');
      return;
    }
    navigate(`/pagamento?itens=${items.join(',')}&ref=${id}`);
  };

  const price = Number(draft.price.replace(',', '.')) || 0;
  const cur = (draft.currency || 'MZN') as Currency;
  const commissionPct = Number(draft.commission.replace(',', '.')) || 0;
  const center: [number, number] = mapCenter ?? CITY_COORDS[draft.city] ?? CITY_COORDS.Maputo;

  return (
    <div>
      <PageHeader
        eyebrow="Publicar imóvel"
        title="Publique o seu imóvel"
        microcopy="Publique em 5 minutos. Venda em dias."
        actions={
          <button onClick={fillDemo} className={btn('glass', 'md')}>
            <Sparkles className="h-4 w-4 text-gold-300" /> Preencher exemplo
          </button>
        }
      >
        <div className="mt-8 max-w-3xl">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-white/80">
              <b className="text-white">{validCount}</b>/27 campos obrigatórios válidos
            </span>
            <span className="font-extrabold text-gold-300">{Math.round((validCount / 27) * 100)}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-linear-to-r from-gold-300 to-gold-500 transition-all duration-500" style={{ width: `${(validCount / 27) * 100}%` }} />
          </div>
        </div>
      </PageHeader>

      <div className="container-kh grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <button
                key={s.title}
                onClick={() => goTo(i)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-bold transition',
                  step === i ? 'bg-navy-950 text-white' : 'bg-white text-graphite-500 ring-1 ring-navy-900/5 hover:text-navy-950',
                )}
              >
                <span
                  className={cn(
                    'grid h-6 w-6 place-items-center rounded-full text-[11px]',
                    stepValid(i) ? 'bg-emerald-500 text-white' : step === i ? 'bg-gold-400 text-navy-950' : 'bg-navy-900/5',
                  )}
                >
                  {stepValid(i) ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                {s.title}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-900/5 sm:p-8">
            <div className="mb-7">
              <div className="text-[11px] font-bold uppercase tracking-[.2em] text-gold-600">Passo {step + 1} de 6</div>
              <h2 className="mt-1 text-2xl font-extrabold text-navy-950">{STEPS[step].title}</h2>
              <p className="text-sm text-graphite-500">{STEPS[step].desc}</p>
            </div>

            {step === 0 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field {...F('type')}>
                  <Select value={draft.type} onChange={(e) => setField('type', e.target.value)} error={!!err('type')}>
                    <option value="">Seleccione o tipo…</option>
                    {(Object.keys(TYPE_GROUPS) as TypeGroup[]).map((g) => (
                      <optgroup key={g} label={TYPE_GROUPS[g]}>
                        {PROPERTY_TYPES.filter((t) => t.group === g).map((t) => (
                          <option key={t.label} value={t.label}>
                            {t.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </Select>
                </Field>
                <Field {...F('purpose')}>
                  <div className="grid grid-cols-2 gap-2">
                    {PURPOSES.map((pp) => (
                      <button
                        type="button"
                        key={pp}
                        onClick={() => setField('purpose', pp as Purpose)}
                        className={cn(
                          'h-12 rounded-xl border text-sm font-semibold transition',
                          draft.purpose === pp ? 'border-navy-950 bg-navy-950 text-white' : 'border-navy-900/10 bg-white text-graphite-600 hover:border-navy-900/30',
                        )}
                      >
                        {pp}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field {...F('typology')}>
                  <Select value={draft.typology} onChange={(e) => setField('typology', e.target.value)} error={!!err('typology')}>
                    <option value="">Seleccione…</option>
                    {TYPOLOGIES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field {...F('city')}>
                  <Select value={draft.city} onChange={(e) => setField('city', e.target.value)} error={!!err('city')}>
                    <option value="">Seleccione a cidade…</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field {...F('neighborhood')} hint="Ex.: Sommerschield, Polana Cimento A, Matola Rio">
                  <input
                    list="kh-bairros"
                    value={draft.neighborhood}
                    onChange={(e) => setField('neighborhood', e.target.value)}
                    placeholder="Nome do bairro"
                    className={inputCls(!!err('neighborhood'))}
                  />
                  <datalist id="kh-bairros">
                    {(NEIGHBORHOODS[draft.city] ?? NEIGHBORHOODS.Maputo).map((b) => (
                      <option key={b} value={b} />
                    ))}
                  </datalist>
                </Field>
                <Field {...F('zone')}>
                  <input list="kh-zonas" value={draft.zone} onChange={(e) => setField('zone', e.target.value)} placeholder="Ex.: Zona nobre" className={inputCls(!!err('zone'))} />
                  <datalist id="kh-zonas">
                    {ZONES.map((z) => (
                      <option key={z} value={z} />
                    ))}
                  </datalist>
                </Field>
                <Field {...F('floor')} hint="0 = rés-do-chão · negativo = cave">
                  {numInput('floor', '0', 'andar', true)}
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field {...F('totalArea')}>{numInput('totalArea', 'Ex.: 210', 'm²')}</Field>
                <Field {...F('usefulArea')}>{numInput('usefulArea', 'Ex.: 185', 'm²')}</Field>
                <Field {...F('bedrooms')} hint="0 se não aplicável">
                  {numInput('bedrooms', '0')}
                </Field>
                <Field {...F('bathrooms')}>{numInput('bathrooms', '0')}</Field>
                <Field {...F('livingRoom')}>{bool('livingRoom')}</Field>
                <Field {...F('kitchen')}>{bool('kitchen')}</Field>
                <Field {...F('balcony')}>{bool('balcony')}</Field>
                <Field {...F('parking')} hint="Número de lugares">
                  {numInput('parking', '0', 'lugares')}
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field {...F('condition')}>
                    <Select value={draft.condition} onChange={(e) => setField('condition', e.target.value)} error={!!err('condition')}>
                      <option value="">Seleccione…</option>
                      {CONDITIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field {...F('furnished')}>{bool('furnished')}</Field>
                  <Field {...F('hasTitle')} hint="Certidão do registo predial ou DUAT (terrenos).">
                    {bool('hasTitle')}
                  </Field>
                  <Field {...F('hasLicense')} hint="Licença de utilização / construção.">
                    {bool('hasLicense')}
                  </Field>
                  <Field {...F('immediate')}>{bool('immediate')}</Field>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-gold-50 p-4 text-sm text-navy-900 ring-1 ring-gold-200">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" />
                  <p>
                    Imóveis com <b>título de propriedade</b> e <b>licença</b> confirmados recebem o selo <VerifiedBadge small /> — que
                    gera, em média, mais contactos qualificados.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  {...F('price')}
                  hint={
                    price > 0
                      ? cur === 'MZN'
                        ? `≈ ${formatMoney(price / 63.9, 'USD')}`
                        : `≈ ${formatMT(toMZN(price, cur))}`
                      : draft.purpose === 'Arrendamento'
                        ? 'Renda mensal'
                        : 'Preço total de venda'
                  }
                >
                  {numInput('price', draft.purpose === 'Arrendamento' ? 'Renda mensal' : 'Preço de venda', cur === 'MZN' ? 'MT' : cur)}
                </Field>
                <Field {...F('currency')} hint="Imóveis premium em Maputo são frequentemente cotados em USD.">
                  <Select value={draft.currency} onChange={(e) => setField('currency', e.target.value as Currency)} error={!!err('currency')}>
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field {...F('negotiable')}>{bool('negotiable')}</Field>
                <Field
                  {...F('commission')}
                  hint={
                    price > 0 && commissionPct > 0
                      ? `Comissão estimada no fecho: ${formatMT((toMZN(price, cur) * (draft.purpose === 'Arrendamento' ? 12 : 1) * commissionPct) / 100)}${draft.purpose === 'Arrendamento' ? ' (contrato de 12 meses)' : ''}`
                      : 'Paga apenas quando o negócio fecha (2% a 5%).'
                  }
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={2}
                      max={5}
                      step={0.5}
                      value={commissionPct || 2}
                      onChange={(e) => setField('commission', e.target.value)}
                      className="flex-1 accent-gold-500"
                    />
                    <div className="w-24 shrink-0">{numInput('commission', '3', '%')}</div>
                  </div>
                </Field>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-7">
                <Field {...F('photos')} hint="Mínimo 3, máximo 12. A primeira fotografia é a capa do anúncio.">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => fileRef.current?.click()}
                    className={cn(
                      'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition',
                      dragging ? 'border-gold-500 bg-gold-50' : err('photos') ? 'border-rose-300 bg-rose-50/40' : 'border-navy-900/15 bg-ivory hover:border-gold-400',
                    )}
                  >
                    {uploading ? <LoaderCircle className="h-8 w-8 animate-spin text-gold-600" /> : <ImagePlus className="h-8 w-8 text-gold-600" />}
                    <div className="mt-3 font-bold text-navy-950">Arraste as fotografias ou clique para carregar</div>
                    <div className="text-xs text-graphite-500">JPG ou PNG · optimizadas automaticamente</div>
                    <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
                  </div>
                  {draft.photos.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {draft.photos.map((ph, i) => (
                        <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-xl">
                          <img src={ph} alt="" className="h-full w-full object-cover" />
                          {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-navy-950 px-2 py-0.5 text-[10px] font-bold text-gold-300">Capa</span>}
                          <button
                            type="button"
                            onClick={() => setField('photos', draft.photos.filter((_, j) => j !== i))}
                            className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-navy-950 opacity-0 transition group-hover:opacity-100"
                            aria-label="Remover"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Field>

                <Field {...F('video')}>
                  <div className="mb-2 flex gap-2">
                    {(
                      [
                        ['upload', 'Carregar ficheiro'],
                        ['link', 'Link (YouTube, Drive…)'],
                      ] as const
                    ).map(([m, l]) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setVideoMode(m)}
                        className={cn('rounded-lg px-3 py-1.5 text-xs font-bold', videoMode === m ? 'bg-navy-950 text-white' : 'bg-navy-900/5 text-graphite-500')}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  {videoMode === 'upload' ? (
                    <button
                      type="button"
                      onClick={() => videoRef.current?.click()}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition',
                        draft.video ? 'border-emerald-300 bg-emerald-50' : 'border-navy-900/10 bg-white hover:border-gold-400',
                      )}
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-950 text-gold-300">
                        {draft.video ? <CircleCheck className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-navy-950">{draft.video || 'Seleccionar vídeo do imóvel'}</span>
                        <span className="block text-xs text-graphite-500">MP4 ou MOV · tour de 1 a 3 minutos</span>
                      </span>
                      <input
                        ref={videoRef}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setField('video', `${f.name} · ${(f.size / 1e6).toFixed(1)} MB`);
                        }}
                      />
                    </button>
                  ) : (
                    <div className="relative">
                      <Video className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
                      <input value={draft.video} onChange={(e) => setField('video', e.target.value)} placeholder="https://youtu.be/…" className={cn(inputCls(!!err('video')), 'pl-11')} />
                    </div>
                  )}
                </Field>

                <Field {...F('lat')} hint="Clique no mapa para marcar a posição exacta. Aos clientes mostramos apenas uma área aproximada até à visita.">
                  <div className="overflow-hidden rounded-2xl ring-1 ring-navy-900/10">
                    <MapView
                      center={center}
                      zoom={mapCenter ? 15 : 13}
                      fit={false}
                      markers={draft.lat && draft.lng && !errors.lat ? [{ id: 'pick', lat: Number(draft.lat), lng: Number(draft.lng) }] : []}
                      onPick={(lat, lng) => {
                        setField('lat', lat.toFixed(6));
                        setField('lng', lng.toFixed(6));
                      }}
                      className="h-80"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <button type="button" onClick={locate} className={btn('outline', 'sm')}>
                      <LocateFixed className="h-4 w-4" /> Usar a minha localização
                    </button>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-ivory px-3 py-2 font-mono text-xs text-graphite-600">
                      <MapPin className="h-3.5 w-3.5 text-gold-600" />
                      {draft.lat && draft.lng ? `${draft.lat}, ${draft.lng}` : 'Sem coordenadas'}
                    </span>
                  </div>
                </Field>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div className="grid gap-5">
                  <Field label="Título do anúncio" hint="Gerado automaticamente — pode personalizar.">
                    <input
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setTitleEdited(true);
                      }}
                      className={inputCls()}
                    />
                  </Field>
                  <Field label="Descrição (opcional)" hint="Destaque o que torna este imóvel único: vista, acabamentos, segurança, acessos.">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className={cn(inputCls(), 'h-auto py-3')}
                      placeholder="Descreva o imóvel…"
                    />
                  </Field>
                </div>

                <div className="rounded-2xl bg-ivory p-5">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-navy-950">Validação dos 27 campos</div>
                    <span className={cn('text-sm font-extrabold', allValid ? 'text-emerald-600' : 'text-rose-600')}>{validCount}/27</span>
                  </div>
                  <div className="mt-3 grid gap-1.5 sm:grid-cols-3">
                    {FIELDS.map((f) => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => errors[f.key] && goTo(f.step)}
                        className={cn('flex items-center gap-2 text-left text-xs', errors[f.key] ? 'text-rose-600 hover:underline' : 'text-graphite-600')}
                      >
                        {errors[f.key] ? <X className="h-3.5 w-3.5 shrink-0" /> : <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />}
                        {f.n}. {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-navy-900/10 p-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-graphite-600">Taxa de publicação</span>
                    <span className="font-bold text-navy-950">{included ? 'Incluída no seu plano' : `${PRODUCTS.publicacao.price} MT`}</span>
                  </div>
                  <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl bg-navy-950 p-4 text-white">
                    <input type="checkbox" checked={addHighlight} onChange={(e) => setAddHighlight(e.target.checked)} className="mt-1 h-4 w-4 accent-gold-400" />
                    <span className="flex-1">
                      <span className="flex items-center gap-2 font-bold">
                        <Star className="h-4 w-4 fill-gold-300 text-gold-300" /> Destaque em {draft.neighborhood || 'seu bairro'} · 1.500 MT/mês
                      </span>
                      <span className="mt-0.5 block text-xs text-white/65">Topo das pesquisas no bairro, selo Destaque e prioridade nas recomendações.</span>
                    </span>
                  </label>
                  <div className="mt-4 flex items-center justify-between border-t border-navy-900/10 pt-4">
                    <span className="font-bold text-navy-950">Total hoje</span>
                    <span className="text-2xl font-extrabold text-navy-950">{formatMT(total)}</span>
                  </div>
                  <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-graphite-600">
                    <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-0.5 h-4 w-4 accent-gold-500" />
                    Declaro que as informações são verdadeiras e autorizo a KEYHOUSE a verificar a documentação. Se o anúncio for rejeitado, a
                    taxa é reembolsada.
                  </label>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-navy-900/5 pt-6">
              <button disabled={step === 0} onClick={() => goTo(step - 1)} className={btn('ghost')}>
                <ArrowLeft className="h-4 w-4" /> Anterior
              </button>
              {step < 5 ? (
                <button onClick={next} className={btn('gold')}>
                  Seguinte <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button onClick={submit} className={btn('gold', 'lg')}>
                  <Lock className="h-4 w-4" /> {total > 0 ? `Pagar ${formatMT(total)} e submeter` : 'Submeter para validação'}
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-[.2em] text-graphite-400">Pré-visualização ao vivo</div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-navy-900/5">
              <div className="relative aspect-[4/3] bg-navy-100">
                {draft.photos[0] ? (
                  <img src={draft.photos[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-navy-300">
                    <ImagePlus className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute left-3 top-3 flex gap-1.5">
                  {draft.hasTitle && draft.hasLicense && <VerifiedBadge />}
                  {addHighlight && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-navy-950/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.12em] text-gold-300">
                      <Star className="h-3 w-3 fill-gold-300" /> Destaque
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <div className="text-[11px] font-bold uppercase tracking-[.16em] text-gold-600">
                  {draft.type || 'Tipo de imóvel'}
                  {draft.typology && draft.typology !== 'Não aplicável' && ` · ${draft.typology}`}
                </div>
                <div className="mt-1 line-clamp-2 text-[17px] font-bold text-navy-950">{title || 'Título do anúncio'}</div>
                <div className="mt-1 flex items-center gap-1 text-[13px] text-graphite-500">
                  <MapPin className="h-3.5 w-3.5" /> {draft.neighborhood || 'Bairro'}, {draft.city || 'Cidade'}
                </div>
                <div className="mt-4 text-xl font-extrabold text-navy-950">
                  {price > 0 ? formatMoney(price, cur) : 'Preço'}
                  {draft.purpose === 'Arrendamento' && <span className="text-sm font-semibold text-graphite-400">/mês</span>}
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-900/5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-navy-950">27 campos obrigatórios</span>
                <span className="font-extrabold text-gold-700">{validCount}/27</span>
              </div>
              <div className="mt-3 grid grid-cols-9 gap-1.5">
                {FIELDS.map((f) => (
                  <span
                    key={f.key}
                    title={`${f.n}. ${f.label}`}
                    className={cn('grid aspect-square place-items-center rounded-md text-[9px] font-bold', errors[f.key] ? 'bg-navy-900/5 text-graphite-400' : 'bg-emerald-500 text-white')}
                  >
                    {f.n}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-navy-950 p-5 text-sm text-white/75">
              <div className="flex items-center gap-2 font-bold text-white">
                <Info className="h-4 w-4 text-gold-300" /> Depois de publicar
              </div>
              <ol className="mt-3 space-y-1.5">
                <li>1. Validação documental em até 24h</li>
                <li>2. Classificação da oferta (Premium, Essencial, Oportunidade)</li>
                <li>3. Leads qualificados · 1.000 MT por lead aceite</li>
                <li>4. Visitas confirmadas · 500 MT por visita</li>
              </ol>
              {!included && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 p-3 text-xs">
                  <Crown className="h-4 w-4 shrink-0 text-gold-300" /> Intermediários com subscrição publicam sem taxa.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
