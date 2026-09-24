import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  CircleCheck,
  Headphones,
  Lock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { Currency, Lead, Property, Visit } from '../lib/types';
import { useStore } from '../store/store';
import { Field, Modal, ScoreRing, Segmented, Select, btn, inputCls } from './ui';
import PropertyCard from './PropertyCard';
import {
  BRAND,
  BUY_PAYMENT,
  CURRENCIES,
  DEMO_USER,
  NEIGHBORHOODS,
  RENT_PAYMENT,
  TIMELINES,
  TIME_SLOTS,
} from '../lib/constants';
import { cn, formatDate, isValidPhone, isoDate, priceLabel, scoreLead, toMZN, uid, waLink, weekday } from '../lib/utils';

type Step = 'form' | 'result' | 'schedule' | 'done';
const STEPS: { id: Step; label: string }[] = [
  { id: 'form', label: 'Qualificação' },
  { id: 'result', label: 'Validação' },
  { id: 'schedule', label: 'Agendamento' },
  { id: 'done', label: 'Confirmação' },
];

export default function QualificationModal({
  property: p,
  open,
  onClose,
}: {
  property: Property;
  open: boolean;
  onClose: () => void;
}) {
  const { addLead, updateLead, addVisit, properties } = useStore();
  const navigate = useNavigate();
  const isSale = p.purpose === 'Venda';
  const payOptions = isSale ? BUY_PAYMENT : RENT_PAYMENT;
  const zones = useMemo(
    () => Array.from(new Set([p.neighborhood, p.city, ...(NEIGHBORHOODS[p.city] || []).slice(0, 6), 'Flexível'])),
    [p.neighborhood, p.city],
  );

  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState({
    zone: p.neighborhood,
    budget: '',
    currency: p.currency as Currency,
    bedrooms: String(Math.min(p.bedrooms, 5)),
    timeline: '',
    payment: '',
    name: DEMO_USER.name,
    phone: '',
  });
  const [showErrors, setShowErrors] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mode, setMode] = useState<'presencial' | 'video'>('presencial');
  const [visit, setVisit] = useState<Visit | null>(null);

  useEffect(() => {
    if (open) {
      setStep('form');
      setShowErrors(false);
      setVisit(null);
      setDate('');
      setTime('');
    }
  }, [open]);

  useEffect(() => {
    setLeadId(null);
    setForm((f) => ({ ...f, zone: p.neighborhood, currency: p.currency, bedrooms: String(Math.min(p.bedrooms, 5)), payment: '' }));
  }, [p.id, p.neighborhood, p.currency, p.bedrooms]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const errors: Record<string, string | null> = {
    zone: form.zone ? null : 'Indique a zona pretendida.',
    budget: Number(form.budget) > 0 ? null : 'Indique o seu orçamento.',
    timeline: form.timeline ? null : 'Indique o seu prazo.',
    payment: form.payment ? null : 'Seleccione uma opção.',
    name: form.name.trim().length >= 3 ? null : 'Indique o seu nome.',
    phone: isValidPhone(form.phone) ? null : 'Número inválido. Ex.: 84 123 4567 ou +351 912 345 678',
  };
  const valid = Object.values(errors).every((e) => !e);
  const err = (k: string) => (showErrors ? errors[k] : null);

  const result = useMemo(
    () =>
      scoreLead(
        {
          zone: form.zone,
          budget: Number(form.budget) || 0,
          currency: form.currency,
          bedrooms: Number(form.bedrooms) || 0,
          timeline: form.timeline,
          payment: form.payment,
        },
        p,
      ),
    [form, p],
  );

  const validate = () => {
    if (!valid) {
      setShowErrors(true);
      return;
    }
    const lead: Lead = {
      id: leadId ?? uid('l'),
      propertyId: p.id,
      name: form.name.trim(),
      phone: form.phone.trim(),
      zone: form.zone,
      budget: Number(form.budget),
      currency: form.currency,
      bedrooms: Number(form.bedrooms),
      timeline: form.timeline,
      payment: form.payment,
      score: result.score,
      qualified: result.qualified,
      status: 'novo',
      feePaid: false,
      createdAt: new Date().toISOString(),
      mine: true,
    };
    if (leadId) updateLead(leadId, lead);
    else {
      addLead(lead);
      setLeadId(lead.id);
    }
    setStep('result');
  };

  const days = useMemo(() => {
    const out: string[] = [];
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (out.length < 8) {
      if (d.getDay() !== 0) out.push(isoDate(d));
      d.setDate(d.getDate() + 1);
    }
    return out;
  }, []);
  const busy = (d: string, t: string) => (Number(d.slice(-2)) + Number(t.slice(0, 2))) % 4 === 0;

  const confirm = () => {
    if (!leadId || !date || !time) return;
    const v: Visit = {
      id: uid('v'),
      leadId,
      propertyId: p.id,
      clientName: form.name.trim(),
      clientPhone: form.phone.trim(),
      date,
      time,
      mode,
      status: 'pendente',
      feePaid: false,
      createdAt: new Date().toISOString(),
      mine: true,
    };
    addVisit(v);
    setVisit(v);
    setStep('done');
  };

  const alternatives = useMemo(() => {
    const budgetMZN = toMZN(Number(form.budget) || 0, form.currency);
    return properties
      .filter((x) => x.status === 'publicado' && x.id !== p.id && x.purpose === p.purpose && toMZN(x.price, x.currency) <= budgetMZN * 1.05)
      .slice(0, 2);
  }, [properties, form.budget, form.currency, p.id, p.purpose]);

  const waText = visit
    ? `Olá ${form.name.split(' ')[0]}! A sua visita ao imóvel "${p.title}" (${p.neighborhood}) foi solicitada para ${formatDate(visit.date, { weekday: 'long', day: 'numeric', month: 'long' })} às ${visit.time}. Receberá a confirmação do anunciante em até 24h. — ${BRAND.name}`
    : '';
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <Modal open={open} onClose={onClose} className="sm:max-w-2xl">
      <div className="border-b border-navy-900/5 bg-ivory px-5 pb-5 pt-6 sm:px-8">
        <div className="flex items-center gap-4 pr-10">
          <img src={p.photos[0]} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-[.18em] text-gold-600">Marcar visita</div>
            <div className="truncate font-bold text-navy-950">{p.title}</div>
            <div className="text-sm text-graphite-500">{priceLabel(p)}</div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id}>
              <div className={cn('h-1 rounded-full transition', i <= stepIndex ? 'bg-gold-500' : 'bg-navy-900/10')} />
              <div className={cn('mt-1.5 text-[10.5px] font-semibold sm:text-[11px]', i <= stepIndex ? 'text-navy-950' : 'text-graphite-400')}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-6 sm:px-8">
        {step === 'form' && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-2xl bg-navy-950 p-4 text-sm text-white/75">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
              <p>
                <b className="text-white">4 perguntas, 60 segundos.</b> Só clientes qualificados marcam visita — é isso que garante
                respostas rápidas dos anunciantes e protege o seu tempo.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="1 · Zona pretendida" error={err('zone')}>
                <Select value={form.zone} onChange={(e) => set('zone', e.target.value)}>
                  {zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={`2 · Orçamento ${isSale ? 'total' : 'mensal'}`} error={err('budget')}>
                <div className="flex gap-2">
                  <input
                    inputMode="numeric"
                    value={form.budget}
                    onChange={(e) => set('budget', e.target.value.replace(/\D/g, ''))}
                    placeholder={String(p.price)}
                    className={inputCls(!!err('budget'))}
                  />
                  <Select value={form.currency} onChange={(e) => set('currency', e.target.value)} className="w-28 shrink-0">
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </Select>
                </div>
              </Field>
              <Field label="3 · Quartos necessários">
                <Select value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)}>
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n === 0 ? 'Não aplicável' : n === 5 ? '5 ou mais' : n}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="4 · Prazo para decidir" error={err('timeline')}>
                <Select value={form.timeline} onChange={(e) => set('timeline', e.target.value)} error={!!err('timeline')}>
                  <option value="">Seleccione…</option>
                  {TIMELINES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={isSale ? 'Forma de pagamento' : 'Perfil do arrendatário'} error={err('payment')} className="sm:col-span-2">
                <div className="grid grid-cols-2 gap-2">
                  {payOptions.map((o) => (
                    <button
                      type="button"
                      key={o.id}
                      onClick={() => set('payment', o.id)}
                      className={cn(
                        'rounded-xl border px-3 py-3 text-left text-[13px] font-semibold transition',
                        form.payment === o.id
                          ? 'border-navy-950 bg-navy-950 text-white'
                          : 'border-navy-900/10 bg-white text-graphite-600 hover:border-navy-900/30',
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Nome completo" error={err('name')}>
                <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls(!!err('name'))} />
              </Field>
              <Field label="WhatsApp" error={err('phone')} hint="Confirmação e lembretes por WhatsApp.">
                <input
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="84 123 4567"
                  inputMode="tel"
                  className={inputCls(!!err('phone'))}
                />
              </Field>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-xs text-graphite-400">
                <Lock className="h-3.5 w-3.5 shrink-0" /> Os seus dados só são partilhados após a confirmação da visita.
              </p>
              <button onClick={validate} className={btn('gold', 'lg')}>
                Validar perfil <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              <ScoreRing score={result.score} />
              <div className="flex-1 text-center sm:text-left">
                {result.qualified ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                      <CircleCheck className="h-3.5 w-3.5" /> Lead qualificado
                    </span>
                    <h3 className="mt-3 text-2xl font-extrabold text-navy-950">Perfil validado. Pode marcar a visita.</h3>
                    <p className="mt-2 text-sm text-graphite-500">
                      O seu perfil cumpre os critérios deste imóvel. Escolha o melhor dia — tratamos da confirmação e dos lembretes.
                    </p>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                      Ainda não é o match ideal
                    </span>
                    <h3 className="mt-3 text-2xl font-extrabold text-navy-950">Vamos encontrar o imóvel certo para si.</h3>
                    <p className="mt-2 text-sm text-graphite-500">
                      Para proteger o tempo de todos, as visitas a este imóvel estão reservadas a perfis com orçamento e prazo
                      compatíveis. Veja alternativas ou deixe o nosso Concierge procurar por si.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl bg-ivory p-5">
              {result.breakdown.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-[13px]">
                    <span className="font-semibold text-navy-950">{b.label}</span>
                    <span className="font-bold text-graphite-500">
                      {b.points}/{b.max}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-navy-900/10">
                    <div className="h-1.5 rounded-full bg-linear-to-r from-gold-300 to-gold-600" style={{ width: `${(b.points / b.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {result.qualified ? (
              <div className="mt-6 flex items-center justify-between gap-3">
                <button onClick={() => setStep('form')} className={btn('ghost')}>
                  <ArrowLeft className="h-4 w-4" /> Rever
                </button>
                <button onClick={() => setStep('schedule')} className={btn('gold', 'lg')}>
                  Escolher data <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {alternatives.length > 0 && (
                  <div>
                    <div className="mb-2 text-[13px] font-bold text-navy-950">Dentro do seu orçamento</div>
                    <div className="grid gap-3">
                      {alternatives.map((a) => (
                        <div key={a.id} onClick={onClose}>
                          <PropertyCard p={a} compact />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-4 rounded-2xl bg-navy-950 p-5 text-white sm:flex-row sm:items-center">
                  <Headphones className="h-8 w-8 shrink-0 text-gold-300" />
                  <div className="flex-1 text-sm text-white/75">
                    <b className="text-white">Concierge Imobiliário · 5.000 MT.</b> Um consultor sénior procura, visita e negoceia por si.
                  </div>
                  <Link to="/planos#concierge" onClick={onClose} className={btn('gold', 'sm')}>
                    Conhecer
                  </Link>
                </div>
                <button onClick={() => setStep('form')} className={btn('ghost')}>
                  <ArrowLeft className="h-4 w-4" /> Rever respostas
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'schedule' && (
          <div className="space-y-6">
            <Segmented
              options={[
                { value: 'presencial', label: 'Visita presencial' },
                { value: 'video', label: 'Videochamada (diáspora)' },
              ]}
              value={mode}
              onChange={setMode}
            />
            <div>
              <div className="mb-2 text-[13px] font-bold text-navy-950">Dia</div>
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {days.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDate(d);
                      setTime('');
                    }}
                    className={cn(
                      'flex w-[68px] shrink-0 flex-col items-center rounded-2xl border py-3 transition',
                      date === d ? 'border-navy-950 bg-navy-950 text-white' : 'border-navy-900/10 bg-white hover:border-navy-900/30',
                    )}
                  >
                    <span className="text-[11px] font-semibold uppercase opacity-70">{weekday(d)}</span>
                    <span className="text-xl font-extrabold">{d.slice(-2)}</span>
                    <span className="text-[11px] opacity-70">{formatDate(d, { month: 'short' }).replace('.', '')}</span>
                  </button>
                ))}
              </div>
            </div>
            {date && (
              <div>
                <div className="mb-2 text-[13px] font-bold text-navy-950">Hora</div>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((t) => {
                    const b = busy(date, t);
                    return (
                      <button
                        key={t}
                        disabled={b}
                        onClick={() => setTime(t)}
                        className={cn(
                          'h-11 rounded-xl border text-sm font-bold transition',
                          time === t ? 'border-gold-500 bg-gold-400 text-navy-950' : 'border-navy-900/10 bg-white hover:border-navy-900/30',
                          b && 'line-through opacity-40',
                        )}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => setStep('result')} className={btn('ghost')}>
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <button disabled={!date || !time} onClick={confirm} className={btn('gold', 'lg')}>
                <CalendarCheck className="h-4 w-4" /> Confirmar pedido
              </button>
            </div>
          </div>
        )}

        {step === 'done' && visit && (
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-50 text-gold-600 ring-8 ring-gold-100/60">
              <CalendarCheck className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-2xl font-extrabold text-navy-950">Pedido de visita enviado</h3>
            <p className="mt-2 text-sm capitalize text-graphite-500">
              {formatDate(visit.date, { weekday: 'long', day: 'numeric', month: 'long' })} · {visit.time} ·{' '}
              {visit.mode === 'video' ? 'Videochamada' : 'Presencial'}
            </p>
            <ol className="mx-auto mt-6 max-w-sm space-y-3 text-left text-sm">
              {[
                ['Lead validado pelo sistema', true],
                ['Confirmação do anunciante (até 24h)', false],
                ['Lembrete por WhatsApp 24h antes', false],
                ['Contacto e morada exacta libertados', false],
              ].map(([label, done], i) => (
                <li key={i} className="flex items-center gap-3">
                  <span
                    className={cn(
                      'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold',
                      done ? 'bg-emerald-500 text-white' : 'bg-navy-900/5 text-graphite-500',
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={done ? 'font-semibold text-navy-950' : 'text-graphite-500'}>{label as string}</span>
                </li>
              ))}
            </ol>
            <div className="mx-auto mt-6 max-w-sm rounded-2xl rounded-tl-sm bg-[#DCF8C6] p-4 text-left text-[13px] leading-relaxed text-[#0B3B2E] shadow-sm">
              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-[#128C7E]">
                <Sparkles className="h-3 w-3" /> KEYHOUSE · WhatsApp
              </div>
              {waText}
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <a href={waLink(BRAND.whatsapp, waText)} target="_blank" rel="noreferrer" className={btn('outline')}>
                <MessageCircle className="h-4 w-4" /> Abrir no WhatsApp
              </a>
              <button
                onClick={() => {
                  onClose();
                  navigate('/cliente?tab=visitas');
                }}
                className={btn('navy')}
              >
                Ver na minha área <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
