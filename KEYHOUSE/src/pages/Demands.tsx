import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  CircleCheck,
  Clock,
  Copy,
  Handshake,
  Headphones,
  Info,
  Lock,
  MapPin,
  Megaphone,
  MessageCircle,
  Ruler,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { useStore } from '../store/store';
import { useTitle } from '../hooks/useTitle';
import {
  ContactLink,
  EmptyState,
  Field,
  Modal,
  PageHeader,
  Segmented,
  Select,
  StatusPill,
  btn,
  inputCls,
} from '../components/ui';
import { BRAND, CITIES, DEMAND_REQUIREMENTS, DEMAND_SPACE_TYPES, NEIGHBORHOODS, TIMELINES } from '../lib/constants';
import type { Demand, DemandPurpose } from '../lib/types';
import { cn, formatMoney, groupThousands, isValidPhone, relativeTime, uid, waLink } from '../lib/utils';

/* ------------------------------------------------------------------ */
/* Ajudantes                                                           */
/* ------------------------------------------------------------------ */

const siteLink = (id: string) =>
  `${window.location.origin}${window.location.pathname}#/procura?ref=${encodeURIComponent(id)}`;

function budgetLabel(d: Pick<Demand, 'budget' | 'currency' | 'purpose' | 'negotiable'>) {
  if (!d.budget) return 'Valor negociável conforme as condições do espaço';
  return `Até ${formatMoney(d.budget, d.currency)}${d.purpose === 'Arrendamento' ? '/mês' : ''}${d.negotiable ? ' · negociável' : ''}`;
}

const areaLabel = (minArea: number) => (minArea > 0 ? `A partir de ${groupThousands(minArea)} m²` : 'Indiferente');
const timelineLabel = (id: string) => TIMELINES.find((t) => t.id === id)?.label ?? 'A combinar';

/** Anúncio "Procura-se" pronto para WhatsApp / Facebook. Nunca inclui o contacto do cliente. */
function demandAdText(d: Demand, withFooter: boolean) {
  const place = d.zone.split('—')[0].trim() || d.city;
  const money = d.budget
    ? `até ${formatMoney(d.budget, d.currency)}${d.purpose === 'Arrendamento' ? '/mês' : ''}${d.negotiable ? ' (negociável)' : ''}`
    : 'valor negociável conforme as condições do espaço';
  const lines: (string | null)[] = [
    `🔎 PROCURA-SE — ${place.toUpperCase()}`,
    '',
    d.title,
    '',
    `📍 Zona: ${d.zone}, ${d.city}`,
    d.minArea > 0 ? `📐 Área: a partir de ${groupThousands(d.minArea)} m²` : null,
    d.types.length ? `🏡 Aceita: ${d.types.join(', ')}` : null,
    d.requirements.length ? `✅ Requisitos: ${d.requirements.join(' · ')}` : null,
    `💰 ${d.purpose} — ${money}`,
  ];
  if (d.description) lines.push('', `📝 ${d.description}`);
  if (withFooter) {
    lines.push('', 'Tem um espaço? Envie localização + fotos + valor à KEYHOUSE:', `👉 ${siteLink(d.id)}`);
    if (BRAND.whatsappDisplay) lines.push(`💬 WhatsApp KEYHOUSE: ${BRAND.whatsappDisplay}`);
    lines.push(`Ref.: ${d.id}`);
  }
  return lines.filter((l): l is string => l !== null).join('\n');
}

function useCopy() {
  const { notify } = useStore();
  return async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify(message);
    } catch {
      notify('Não foi possível copiar. Seleccione o texto manualmente.', 'error');
    }
  };
}

/* ------------------------------------------------------------------ */
/* Peças reutilizáveis                                                 */
/* ------------------------------------------------------------------ */

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-[13px] font-semibold transition',
        active ? 'border-navy-950 bg-navy-950 text-white' : 'border-navy-900/10 bg-white text-graphite-600 hover:border-navy-900/30',
      )}
    >
      {active && <Check className="mr-1 inline h-3.5 w-3.5" strokeWidth={3} />}
      {children}
    </button>
  );
}

function WhatsAppPreview({ text }: { text: string }) {
  return (
    <div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-[#DCF8C6] p-4 text-[13px] leading-relaxed text-[#0B3B2E] shadow-sm">
      {text}
    </div>
  );
}

/** Envia a mensagem para o WhatsApp OFICIAL da KEYHOUSE (ou mostra alternativa se ainda não estiver configurado). */
function SendToKeyhouse({ text, onSent, label }: { text: string; onSent: () => void; label: string }) {
  const copy = useCopy();
  return (
    <div className="space-y-3">
      {BRAND.whatsapp ? (
        <ContactLink official newTab href={waLink(BRAND.whatsapp, text)} onClick={onSent} className={btn('gold', 'lg', 'w-full')}>
          <MessageCircle className="h-4 w-4" /> {label}
        </ContactLink>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>O WhatsApp da KEYHOUSE ainda está a ser configurado. Copie a mensagem e envie-a mais tarde, ou volte em breve.</p>
        </div>
      )}
      <button type="button" onClick={() => copy(text, 'Mensagem copiada.')} className={btn('outline', 'md', 'w-full')}>
        <Copy className="h-4 w-4" /> Copiar mensagem
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Enviar proposta (proprietário / intermediário)                      */
/* ------------------------------------------------------------------ */

interface ProposalDraft {
  name: string;
  spaceType: string;
  location: string;
  mapLink: string;
  area: string;
  price: string;
  negotiable: boolean;
  notes: string;
}

const EMPTY_PROPOSAL: ProposalDraft = {
  name: '',
  spaceType: '',
  location: '',
  mapLink: '',
  area: '',
  price: '',
  negotiable: true,
  notes: '',
};

function ProposalModal({ demand, onClose }: { demand: Demand | null; onClose: () => void }) {
  const { addProposal, notify } = useStore();
  const [f, setF] = useState<ProposalDraft>(EMPTY_PROPOSAL);
  const [step, setStep] = useState<'form' | 'review' | 'sent'>('form');
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (!demand) return;
    setF({ ...EMPTY_PROPOSAL, spaceType: demand.types[0] ?? '' });
    setStep('form');
    setShowErrors(false);
  }, [demand]);

  if (!demand) return null;
  const d = demand;
  const set = <K extends keyof ProposalDraft>(k: K, v: ProposalDraft[K]) => setF((s) => ({ ...s, [k]: v }));

  const errors: Record<string, string | null> = {
    name: f.name.trim().length >= 2 ? null : 'Indique o seu nome.',
    spaceType: f.spaceType ? null : 'Seleccione o tipo de espaço.',
    location: f.location.trim().length >= 3 ? null : 'Indique o bairro ou uma referência.',
    area: Number(f.area) > 0 ? null : 'Indique a área em m².',
    price: Number(f.price) > 0 ? null : 'Indique o valor pedido.',
  };
  const err = (k: string) => (showErrors ? errors[k] : null);
  const valid = Object.values(errors).every((e) => !e);
  const areaNum = Number(f.area) || 0;
  const typeOptions = d.types.length ? [...d.types, 'Outro'] : [...DEMAND_SPACE_TYPES, 'Outro'];

  const text = [
    `Olá KEYHOUSE! Tenho um espaço para o pedido ${d.id}:`,
    `"${d.title}" (${d.zone}, ${d.city}).`,
    '',
    `🏡 Tipo: ${f.spaceType}`,
    `📍 Localização: ${f.location.trim()}`,
    f.mapLink.trim() ? `🗺️ Mapa: ${f.mapLink.trim()}` : null,
    `📐 Área: ${groupThousands(areaNum)} m²`,
    `💰 Valor: ${formatMoney(Number(f.price) || 0, 'MZN')}${d.purpose === 'Arrendamento' ? '/mês' : ''}${f.negotiable ? ' (negociável)' : ''}`,
    f.notes.trim() ? `📝 ${f.notes.trim()}` : null,
    '',
    `👤 ${f.name.trim()}`,
    '📸 Envio a seguir as fotos e a localização no mapa.',
  ]
    .filter((l): l is string => l !== null)
    .join('\n');

  const record = () => {
    addProposal({
      id: uid('prop'),
      demandId: d.id,
      name: f.name.trim(),
      spaceType: f.spaceType,
      location: f.location.trim(),
      mapLink: f.mapLink.trim(),
      area: areaNum,
      price: Number(f.price) || 0,
      negotiable: f.negotiable,
      notes: f.notes.trim(),
      createdAt: new Date().toISOString(),
    });
    notify('Proposta a caminho! Envie agora as fotos e a localização na mesma conversa.');
    // Muda de ecrã depois de o WhatsApp abrir (não interromper o clique no link)
    window.setTimeout(() => setStep('sent'), 500);
  };

  return (
    <Modal open onClose={onClose} className="sm:max-w-2xl">
      <div className="border-b border-navy-900/5 bg-ivory px-5 pb-5 pt-6 sm:px-8">
        <div className="pr-10">
          <div className="text-[11px] font-bold uppercase tracking-[.18em] text-gold-600">Enviar proposta · {d.id}</div>
          <div className="mt-1 font-bold text-navy-950">{d.title}</div>
          <div className="text-sm text-graphite-500">
            {d.zone}, {d.city} · {areaLabel(d.minArea)}
          </div>
        </div>
      </div>

      <div className="px-5 py-6 sm:px-8">
        {step === 'form' && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="O seu nome" error={err('name')}>
                <input value={f.name} onChange={(e) => set('name', e.target.value)} className={inputCls(!!err('name'))} placeholder="Nome e apelido" />
              </Field>
              <Field label="Tipo de espaço" error={err('spaceType')}>
                <Select value={f.spaceType} onChange={(e) => set('spaceType', e.target.value)} error={!!err('spaceType')}>
                  <option value="">Seleccione…</option>
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Bairro / referência" error={err('location')} hint="Ex.: Kumbeza, 300 m depois da primeira rotunda">
                <input value={f.location} onChange={(e) => set('location', e.target.value)} className={inputCls(!!err('location'))} />
              </Field>
              <Field label="Link do mapa (opcional)" hint="Google Maps → partilhar localização → copiar link">
                <input value={f.mapLink} onChange={(e) => set('mapLink', e.target.value)} className={inputCls()} placeholder="https://maps.app.goo.gl/…" />
              </Field>
              <Field
                label="Área (m²)"
                error={err('area')}
                hint={
                  areaNum > 0 && d.minArea > 0 && areaNum < d.minArea
                    ? `Abaixo dos ${groupThousands(d.minArea)} m² pedidos: pode enviar na mesma.`
                    : undefined
                }
              >
                <input inputMode="numeric" value={f.area} onChange={(e) => set('area', e.target.value.replace(/\D/g, ''))} className={inputCls(!!err('area'))} placeholder="Ex.: 600" />
              </Field>
              <Field label={`Valor pedido (MT${d.purpose === 'Arrendamento' ? '/mês' : ''})`} error={err('price')}>
                <input inputMode="numeric" value={f.price} onChange={(e) => set('price', e.target.value.replace(/\D/g, ''))} className={inputCls(!!err('price'))} placeholder="Ex.: 12000" />
              </Field>
              <Field label="Negociável?">
                <Segmented
                  options={[
                    { value: 'sim', label: 'Sim' },
                    { value: 'nao', label: 'Não' },
                  ]}
                  value={f.negotiable ? 'sim' : 'nao'}
                  onChange={(v) => set('negotiable', v === 'sim')}
                />
              </Field>
              <Field label="Condições (opcional)" hint="Água, energia, vedação, acesso, segurança…">
                <input value={f.notes} onChange={(e) => set('notes', e.target.value)} className={inputCls()} placeholder="Ex.: vedado, com furo de água e energia" />
              </Field>
            </div>
            <p className="flex items-start gap-2 rounded-2xl bg-navy-950 p-4 text-sm text-white/80">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              As fotografias e a localização no mapa seguem na mesma conversa de WhatsApp, logo a seguir à mensagem.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (!valid) {
                    setShowErrors(true);
                    return;
                  }
                  setStep('review');
                }}
                className={btn('gold', 'lg')}
              >
                Rever proposta <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-5">
            <WhatsAppPreview text={text} />
            <SendToKeyhouse text={text} onSent={record} label="Enviar à KEYHOUSE pelo WhatsApp" />
            <button onClick={() => setStep('form')} className={btn('ghost', 'md')}>
              Voltar e corrigir
            </button>
          </div>
        )}

        {step === 'sent' && (
          <div className="py-4 text-center">
            <CircleCheck className="mx-auto h-12 w-12 text-emerald-500" />
            <h3 className="mt-4 text-xl font-extrabold text-navy-950">Proposta enviada à KEYHOUSE</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-graphite-500">
              Envie agora as fotos e a localização (📎 → Localização) na mesma conversa. Se o espaço cumprir o pedido, a KEYHOUSE marca a visita com a cliente.
            </p>
            <button onClick={onClose} className={btn('navy', 'md', 'mt-6')}>
              Fechar
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Publicar pedido (cliente)                                           */
/* ------------------------------------------------------------------ */

interface DemandDraft {
  title: string;
  purpose: DemandPurpose;
  types: string[];
  city: string;
  zone: string;
  minArea: string;
  budget: string;
  negotiable: boolean;
  requirements: string[];
  description: string;
  timeline: string;
  name: string;
  phone: string;
}

const EMPTY_DEMAND: DemandDraft = {
  title: '',
  purpose: 'Arrendamento',
  types: [],
  city: 'Maputo',
  zone: '',
  minArea: '',
  budget: '',
  negotiable: true,
  requirements: [],
  description: '',
  timeline: '',
  name: '',
  phone: '',
};

function NewDemandModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addDemand, notify } = useStore();
  const [f, setF] = useState<DemandDraft>(EMPTY_DEMAND);
  const [step, setStep] = useState<'form' | 'review' | 'sent'>('form');
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (!open) return;
    setF(EMPTY_DEMAND);
    setStep('form');
    setShowErrors(false);
  }, [open]);

  const set = <K extends keyof DemandDraft>(k: K, v: DemandDraft[K]) => setF((s) => ({ ...s, [k]: v }));
  const toggle = (k: 'types' | 'requirements', v: string) =>
    setF((s) => ({ ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] }));

  const errors: Record<string, string | null> = {
    title: f.title.trim().length >= 5 ? null : 'Descreva o que procura (mín. 5 caracteres).',
    types: f.types.length ? null : 'Escolha pelo menos um tipo de espaço.',
    zone: f.zone.trim().length >= 3 ? null : 'Indique o bairro ou a zona.',
    name: f.name.trim().length >= 2 ? null : 'Indique o seu nome.',
    phone: isValidPhone(f.phone) ? null : 'Número inválido. Ex.: 84 123 4567',
  };
  const err = (k: string) => (showErrors ? errors[k] : null);
  const valid = Object.values(errors).every((e) => !e);

  const preview: Demand = {
    id: 'PED-NOVO',
    title: f.title.trim(),
    purpose: f.purpose,
    types: f.types,
    city: f.city,
    zone: f.zone.trim(),
    minArea: Number(f.minArea) || 0,
    budget: Number(f.budget) > 0 ? Number(f.budget) : null,
    currency: 'MZN',
    negotiable: f.negotiable,
    use: '',
    requirements: f.requirements,
    description: f.description.trim(),
    timeline: f.timeline,
    clientName: f.name.trim(),
    clientPhone: f.phone.trim(),
    status: 'em_validacao',
    createdAt: new Date().toISOString(),
  };

  const requestText = [
    'Olá KEYHOUSE! Quero publicar um pedido de procura:',
    '',
    demandAdText(preview, false),
    '',
    `⏱️ Prazo: ${timelineLabel(f.timeline)}`,
    '',
    '🔒 Os meus dados (não partilhar):',
    `👤 ${f.name.trim()} · 📞 ${f.phone.trim()}`,
  ].join('\n');

  const send = () => {
    addDemand({
      ...preview,
      id: `PED-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      mine: true,
    });
    notify('Pedido enviado! A KEYHOUSE vai divulgá-lo e enviar-lhe as melhores propostas.');
    window.setTimeout(() => setStep('sent'), 500);
  };

  return (
    <Modal open={open} onClose={onClose} className="sm:max-w-2xl">
      <div className="border-b border-navy-900/5 bg-navy-950 px-5 pb-5 pt-6 text-white sm:px-8">
        <div className="pr-10">
          <div className="text-[11px] font-bold uppercase tracking-[.2em] text-gold-300">Publicar pedido · grátis</div>
          <div className="mt-1 text-xl font-extrabold">Diga-nos o que procura</div>
          <div className="text-sm text-white/60">O seu contacto fica protegido. As propostas chegam primeiro à KEYHOUSE.</div>
        </div>
      </div>

      <div className="px-5 py-6 sm:px-8">
        {step === 'form' && (
          <div className="space-y-5">
            <Field label="O que procura?" error={err('title')}>
              <input
                value={f.title}
                onChange={(e) => set('title', e.target.value)}
                className={inputCls(!!err('title'))}
                placeholder="Ex.: Espaço para criação de aves · T2 mobilado perto da Polana"
              />
            </Field>
            <Field label="Finalidade">
              <Segmented
                options={[
                  { value: 'Arrendamento', label: 'Arrendar' },
                  { value: 'Compra', label: 'Comprar' },
                ]}
                value={f.purpose}
                onChange={(v) => set('purpose', v as DemandPurpose)}
              />
            </Field>
            <Field label="Tipo de espaço (pode escolher vários)" error={err('types')}>
              <div className="flex flex-wrap gap-2">
                {DEMAND_SPACE_TYPES.map((t) => (
                  <Chip key={t} active={f.types.includes(t)} onClick={() => toggle('types', t)}>
                    {t}
                  </Chip>
                ))}
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Cidade / distrito">
                <Select value={f.city} onChange={(e) => set('city', e.target.value)}>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Bairro / zona de referência" error={err('zone')}>
                <input
                  list="kh-demand-zones"
                  value={f.zone}
                  onChange={(e) => set('zone', e.target.value)}
                  className={inputCls(!!err('zone'))}
                  placeholder="Ex.: Kumbeza, perto da primeira rotunda"
                />
                <datalist id="kh-demand-zones">
                  {(NEIGHBORHOODS[f.city] ?? []).map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </Field>
              <Field label="Área mínima (m², opcional)">
                <input inputMode="numeric" value={f.minArea} onChange={(e) => set('minArea', e.target.value.replace(/\D/g, ''))} className={inputCls()} placeholder="Ex.: 500" />
              </Field>
              <Field label={`Orçamento máximo (MT${f.purpose === 'Arrendamento' ? '/mês' : ''}, opcional)`}>
                <input inputMode="numeric" value={f.budget} onChange={(e) => set('budget', e.target.value.replace(/\D/g, ''))} className={inputCls()} placeholder="Vazio = negociável" />
              </Field>
              <Field label="Valor negociável?">
                <Segmented
                  options={[
                    { value: 'sim', label: 'Sim' },
                    { value: 'nao', label: 'Não' },
                  ]}
                  value={f.negotiable ? 'sim' : 'nao'}
                  onChange={(v) => set('negotiable', v === 'sim')}
                />
              </Field>
              <Field label="Prazo">
                <Select value={f.timeline} onChange={(e) => set('timeline', e.target.value)}>
                  <option value="">A combinar</option>
                  {TIMELINES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Requisitos (opcional)">
              <div className="flex flex-wrap gap-2">
                {DEMAND_REQUIREMENTS.map((r) => (
                  <Chip key={r} active={f.requirements.includes(r)} onClick={() => toggle('requirements', r)}>
                    {r}
                  </Chip>
                ))}
              </div>
            </Field>
            <Field label="Mais detalhes (opcional)">
              <textarea
                value={f.description}
                onChange={(e) => set('description', e.target.value)}
                rows={3}
                className={cn(inputCls(), 'h-auto py-3')}
                placeholder="Ex.: para uma pequena criação de aves; preciso de água e bom acesso."
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="O seu nome" error={err('name')}>
                <input value={f.name} onChange={(e) => set('name', e.target.value)} className={inputCls(!!err('name'))} />
              </Field>
              <Field label="O seu WhatsApp" error={err('phone')} hint="Protegido: nunca aparece no anúncio público.">
                <input value={f.phone} onChange={(e) => set('phone', e.target.value)} inputMode="tel" className={inputCls(!!err('phone'))} placeholder="84 123 4567" />
              </Field>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (!valid) {
                    setShowErrors(true);
                    return;
                  }
                  setStep('review');
                }}
                className={btn('gold', 'lg')}
              >
                Rever pedido <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-5">
            <div>
              <div className="mb-2 text-[13px] font-bold text-navy-950">Assim fica o anúncio público (sem o seu contacto):</div>
              <WhatsAppPreview text={demandAdText(preview, false)} />
            </div>
            <SendToKeyhouse text={requestText} onSent={send} label="Enviar pedido à KEYHOUSE pelo WhatsApp" />
            <button onClick={() => setStep('form')} className={btn('ghost', 'md')}>
              Voltar e corrigir
            </button>
          </div>
        )}

        {step === 'sent' && (
          <div className="py-4 text-center">
            <CircleCheck className="mx-auto h-12 w-12 text-emerald-500" />
            <h3 className="mt-4 text-xl font-extrabold text-navy-950">Pedido enviado</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-graphite-500">
              A KEYHOUSE valida o pedido, divulga-o a proprietários e intermediários e envia-lhe as melhores propostas, sem expor o seu contacto.
            </p>
            <button onClick={onClose} className={btn('navy', 'md', 'mt-6')}>
              Fechar
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Cartão de pedido                                                    */
/* ------------------------------------------------------------------ */

function DemandCard({ d, highlight, onPropose }: { d: Demand; highlight: boolean; onPropose: (d: Demand) => void }) {
  const copy = useCopy();
  const ad = demandAdText(d, true);
  const facts: { icon: typeof MapPin; label: string; value: string }[] = [
    { icon: MapPin, label: 'Zona', value: `${d.zone}, ${d.city}` },
    { icon: Ruler, label: 'Área', value: areaLabel(d.minArea) },
    { icon: Tag, label: d.purpose, value: budgetLabel(d) },
    { icon: Clock, label: 'Prazo', value: timelineLabel(d.timeline) },
  ];

  return (
    <article
      id={`ped-${d.id}`}
      className={cn(
        'flex flex-col rounded-3xl bg-white p-6 shadow-soft ring-1 transition',
        highlight ? 'ring-2 ring-gold-400' : 'ring-navy-900/5',
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-navy-950 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.14em] text-gold-300">
          Procura-se
        </span>
        <span className="rounded-full bg-ivory px-2.5 py-1 text-[11px] font-bold text-navy-950 ring-1 ring-navy-900/5">{d.purpose}</span>
        <StatusPill status={d.status} />
        {d.mine && <span className="text-[11px] font-bold text-gold-700">O seu pedido</span>}
        <span className="ml-auto text-xs text-graphite-400">
          {d.id} · {relativeTime(d.createdAt)}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-extrabold leading-snug text-navy-950">{d.title}</h3>
      {d.use && <p className="mt-1 text-sm text-graphite-500">Uso: {d.use}</p>}

      <dl className="mt-4 grid gap-2 text-[13px] sm:grid-cols-2">
        {facts.map((x) => (
          <div key={x.label} className="flex items-start gap-2.5 rounded-xl bg-ivory px-3 py-2.5">
            <x.icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
            <div className="min-w-0">
              <dt className="text-[10px] font-bold uppercase tracking-widest text-graphite-400">{x.label}</dt>
              <dd className="font-semibold text-navy-950">{x.value}</dd>
            </div>
          </div>
        ))}
      </dl>

      {d.types.length > 0 && (
        <div className="mt-4">
          <div className="text-[11px] font-bold uppercase tracking-[.16em] text-graphite-400">Aceita</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {d.types.map((t) => (
              <span key={t} className="rounded-full bg-gold-50 px-2.5 py-1 text-[12px] font-semibold text-navy-950 ring-1 ring-gold-200">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {d.requirements.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-graphite-600">
          {d.requirements.map((r) => (
            <li key={r} className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={3} /> {r}
            </li>
          ))}
        </ul>
      )}

      {d.description && <p className="mt-4 text-sm leading-relaxed text-graphite-600">{d.description}</p>}

      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-ivory px-3 py-2.5 text-xs text-graphite-600">
        <Lock className="h-3.5 w-3.5 shrink-0 text-gold-600" /> Contacto do cliente protegido: as propostas passam pela KEYHOUSE.
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-navy-900/5 pt-5">
        {!d.mine && (
          <button disabled={d.status === 'fechado'} onClick={() => onPropose(d)} className={btn('gold', 'sm', 'flex-1')}>
            <Send className="h-4 w-4" /> Enviar proposta
          </button>
        )}
        <a href={`https://wa.me/?text=${encodeURIComponent(ad)}`} target="_blank" rel="noreferrer" className={btn('outline', 'sm')}>
          <Share2 className="h-4 w-4" /> Partilhar
        </a>
        <button onClick={() => copy(ad, 'Anúncio copiado: cole-o nos grupos de WhatsApp ou no Facebook.')} className={btn('outline', 'sm')}>
          <Copy className="h-4 w-4" /> Copiar anúncio
        </button>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

const HOW = [
  { icon: Megaphone, title: 'O cliente diz o que procura', text: 'Zona, área, tipo de espaço e valor. Publicar um pedido é grátis.' },
  { icon: Send, title: 'Os proprietários propõem', text: 'Localização, fotos e valor, enviados directamente à KEYHOUSE pelo WhatsApp.' },
  { icon: ShieldCheck, title: 'A KEYHOUSE filtra', text: 'Verificamos as propostas e apresentamos ao cliente só as que cumprem o pedido.' },
  { icon: Handshake, title: 'Visita e fecho', text: 'Visita confirmada, minuta de contrato e comissão: tudo acompanhado.' },
];

export default function Demands() {
  useTitle('Procura-se — Pedidos de Clientes — KEYHOUSE PROPERTIES');
  const { demands } = useStore();
  const [params, setParams] = useSearchParams();
  const refId = params.get('ref');
  const [newOpen, setNewOpen] = useState(params.get('novo') === '1');
  const [proposalFor, setProposalFor] = useState<Demand | null>(null);
  const [city, setCity] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    if (params.get('novo') === '1') setNewOpen(true);
  }, [params]);

  useEffect(() => {
    if (!refId) return;
    const t = window.setTimeout(
      () => document.getElementById(`ped-${refId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      350,
    );
    return () => window.clearTimeout(t);
  }, [refId]);

  const cities = useMemo(() => Array.from(new Set(demands.map((d) => d.city))).sort(), [demands]);
  const list = useMemo(() => {
    const nq = q.trim().toLowerCase();
    return demands
      .filter((d) => !city || d.city === city)
      .filter((d) => !nq || `${d.title} ${d.zone} ${d.city} ${d.use} ${d.types.join(' ')}`.toLowerCase().includes(nq))
      .sort((a, b) => Number(!!b.mine) - Number(!!a.mine) || b.createdAt.localeCompare(a.createdAt));
  }, [demands, city, q]);

  const closeNew = () => {
    setNewOpen(false);
    if (params.get('novo')) {
      const next = new URLSearchParams(params);
      next.delete('novo');
      setParams(next, { replace: true });
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Procura-se"
        title="Pedidos de clientes"
        microcopy="Diga o que procura. Nós encontramos."
        actions={
          <button onClick={() => setNewOpen(true)} className={btn('gold', 'md')}>
            <Megaphone className="h-4 w-4" /> Publicar pedido
          </button>
        }
      >
        <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {['Grátis para quem procura', 'Contacto do cliente protegido', 'Propostas filtradas pela KEYHOUSE'].map((t) => (
            <div key={t} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <Check className="h-4 w-4 shrink-0 text-gold-300" strokeWidth={3} /> {t}
            </div>
          ))}
        </div>
      </PageHeader>

      <div className="container-kh py-10 pb-20">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HOW.map((h, i) => (
            <div key={h.title} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-900/5">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-950 text-gold-300">
                  <h.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-extrabold text-gold-500">0{i + 1}</span>
              </div>
              <div className="mt-4 font-extrabold text-navy-950">{h.title}</div>
              <p className="mt-1 text-sm leading-relaxed text-graphite-500">{h.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-navy-950">Pedidos activos</h2>
            <p className="text-sm text-graphite-500">
              {list.length} {list.length === 1 ? 'pedido' : 'pedidos'} · tem um espaço que serve? Envie a sua proposta.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Zona, tipo, uso…" className={cn(inputCls(), 'pl-10 sm:w-60')} />
            </div>
            <Select value={city} onChange={(e) => setCity(e.target.value)} className="sm:w-48">
              <option value="">Todas as zonas</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-6">
          {list.length === 0 ? (
            <EmptyState
              icon={<Search className="h-6 w-6" />}
              title="Nenhum pedido com estes filtros"
              text="Limpe os filtros, ou publique o seu pedido: a KEYHOUSE divulga-o e envia-lhe as melhores propostas."
              action={
                <button onClick={() => setNewOpen(true)} className={btn('gold')}>
                  <Megaphone className="h-4 w-4" /> Publicar pedido
                </button>
              }
            />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {list.map((d) => (
                <DemandCard key={d.id} d={d} highlight={refId === d.id} onPropose={setProposalFor} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-4 rounded-3xl bg-navy-950 p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <Headphones className="h-10 w-10 shrink-0 text-gold-300" />
          <div className="flex-1">
            <div className="text-lg font-extrabold">Prefere que procuremos por si?</div>
            <p className="text-sm text-white/65">
              Com o Concierge, um consultor procura, visita, verifica a documentação e negoceia por si, incluindo espaços fora do mercado.
            </p>
          </div>
          <Link to="/planos#concierge" className={btn('gold', 'md', 'shrink-0')}>
            Concierge · 5.000 MT <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <ProposalModal demand={proposalFor} onClose={() => setProposalFor(null)} />
      <NewDemandModal open={newOpen} onClose={closeNew} />
    </div>
  );
}
