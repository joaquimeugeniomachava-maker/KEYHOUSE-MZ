import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  ChevronDown,
  Crown,
  Handshake,
  Headphones,
  LockOpen,
  Plane,
  ShieldCheck,
  Star,
  Target,
  Video,
} from 'lucide-react';
import { useStore } from '../store/store';
import { useTitle } from '../hooks/useTitle';
import { PageHeader, btn, inputCls } from '../components/ui';
import { PaymentBadges } from '../components/Footer';
import { DEMO_USER, PRODUCTS } from '../lib/constants';
import type { ProductCode } from '../lib/types';
import { cn, formatMT, isValidPhone, uid } from '../lib/utils';

const PLANS = [
  {
    name: 'Proprietário',
    price: '500 MT',
    unit: 'por anúncio',
    desc: 'Para quem vende ou arrenda o seu próprio imóvel.',
    features: [
      'Publicação validada em até 24h',
      'Selo Verificado (com documentação)',
      'Contacto protegido até à visita',
      'Leads qualificados · 1.000 MT por lead aceite',
      'Visitas confirmadas · 500 MT por visita',
      'Minuta de contrato automática',
    ],
    cta: { label: 'Publicar imóvel', to: '/publicar' },
  },
  {
    name: 'Intermediário',
    price: '3.000 MT',
    unit: '/mês',
    highlight: true,
    desc: 'Para consultores e mediadores independentes.',
    features: [
      'Até 25 anúncios activos sem taxa de publicação',
      'Perfil de intermediário certificado',
      'Gestão de carteira, leads e visitas',
      'Painel de comissões · 60% do fecho',
      'Calculadora e minutas automáticas',
      'Validação prioritária',
    ],
    cta: { label: 'Subscrever', to: '/pagamento?itens=intermediario' },
  },
  {
    name: 'Agência Premium',
    price: '10.000 MT',
    unit: '/mês',
    desc: 'Para agências com equipa e volume.',
    features: [
      'Anúncios ilimitados sem taxa',
      'Até 10 utilizadores',
      'Página da agência com marca própria',
      'Relatórios de desempenho mensais',
      'Gestor de conta dedicado',
      'Selo Agência Premium',
    ],
    cta: { label: 'Tornar-me Premium', to: '/pagamento?itens=agencia' },
  },
];

const ALACARTE: { code: ProductCode; icon: typeof Star }[] = [
  { code: 'destaque', icon: Star },
  { code: 'lead', icon: Target },
  { code: 'visita', icon: CalendarCheck },
  { code: 'contacto', icon: LockOpen },
  { code: 'comissao', icon: Handshake },
  { code: 'concierge', icon: Headphones },
];

const FAQ = [
  ['Quando pago a taxa de publicação?', 'No momento da submissão do anúncio (500 MT). Se a nossa equipa rejeitar o anúncio, a taxa é reembolsada automaticamente.'],
  ['O que é um lead qualificado?', 'Um cliente que respondeu às perguntas obrigatórias (zona, orçamento, quartos e prazo) e obteve pontuação mínima de 60/100. Só paga os leads que decidir aceitar.'],
  ['Como funciona a comissão de fecho?', 'Entre 2% e 5% sobre o valor do negócio (no arrendamento, sobre o valor global do contrato), acrescida de IVA. A minuta de contrato e o cálculo são gerados automaticamente.'],
  ['Posso pagar a partir do estrangeiro?', 'Sim. Clientes na diáspora pagam com PayPal. Em Moçambique aceitamos M-Pesa, e-Mola e transferência bancária para montantes elevados.'],
  ['Porque é que o contacto do anunciante está protegido?', 'Para eliminar curiosos e intermediários fantasma. O contacto é libertado após a confirmação da visita — ou imediatamente, por 200 MT.'],
];

export default function Pricing() {
  useTitle('Planos & Serviços — KEYHOUSE PROPERTIES');
  const { subscription, addConcierge, notify } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: DEMO_USER.name, phone: '', budget: '', brief: '' });

  const submitConcierge = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(form.phone) || form.brief.trim().length < 10) {
      notify('Indique um contacto válido e descreva o que procura (mín. 10 caracteres).', 'error');
      return;
    }
    const id = uid('c');
    addConcierge({
      id,
      name: form.name.trim() || DEMO_USER.name,
      phone: form.phone.trim(),
      brief: form.brief.trim(),
      budget: form.budget.trim() || 'A definir',
      createdAt: new Date().toISOString(),
      status: 'pendente',
      mine: true,
    });
    navigate(`/pagamento?itens=concierge&ref=${id}`);
  };

  return (
    <div>
      <PageHeader eyebrow="Planos & serviços" title="Pague pelo resultado, não pela promessa." microcopy="Transparência total. Cada etapa gera valor." />

      <section className="container-kh py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={cn(
                'relative flex flex-col rounded-3xl p-8 ring-1',
                p.highlight ? 'bg-navy-950 text-white shadow-lift ring-gold-400/40' : 'bg-white shadow-soft ring-navy-900/5',
              )}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-8 rounded-full bg-linear-to-r from-gold-300 to-gold-500 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.14em] text-navy-950">
                  Mais escolhido
                </span>
              )}
              <div className={cn('text-[11px] font-bold uppercase tracking-[.2em]', p.highlight ? 'text-gold-300' : 'text-gold-600')}>{p.name}</div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight">{p.price}</span>
                <span className={cn('text-sm font-semibold', p.highlight ? 'text-white/60' : 'text-graphite-400')}>{p.unit}</span>
              </div>
              <p className={cn('mt-2 text-sm', p.highlight ? 'text-white/65' : 'text-graphite-500')}>{p.desc}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className={cn('mt-0.5 h-4 w-4 shrink-0', p.highlight ? 'text-gold-300' : 'text-gold-600')} strokeWidth={3} />
                    <span className={p.highlight ? 'text-white/85' : 'text-graphite-700'}>{f}</span>
                  </li>
                ))}
              </ul>
              {p.name === 'Intermediário' && subscription?.plan === 'intermediario' ? (
                <Link to="/intermediario" className={btn('glass', 'lg', 'mt-8')}>
                  <BadgeCheck className="h-4 w-4" /> Plano activo
                </Link>
              ) : p.name === 'Agência Premium' && subscription?.plan === 'agencia' ? (
                <Link to="/intermediario" className={btn('navy', 'lg', 'mt-8')}>
                  <BadgeCheck className="h-4 w-4" /> Plano activo
                </Link>
              ) : (
                <Link to={p.cta.to} className={btn(p.highlight ? 'gold' : 'navy', 'lg', 'mt-8')}>
                  {p.cta.label} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-kh">
          <div className="max-w-2xl">
            <div className="text-[11px] font-bold uppercase tracking-[.25em] text-gold-600">Serviços à medida</div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              Cada etapa do fluxo, <em className="font-serif font-semibold italic text-gold-600">um valor claro.</em>
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALACARTE.map(({ code, icon: Icon }) => {
              const pr = PRODUCTS[code];
              return (
                <div key={code} className="rounded-3xl bg-ivory p-6 ring-1 ring-navy-900/5">
                  <div className="flex items-start justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-navy-950 text-gold-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="text-right">
                      <div className="text-xl font-extrabold text-navy-950">{code === 'comissao' ? '2–5%' : formatMT(pr.price)}</div>
                      <div className="text-xs text-graphite-400">{code === 'comissao' ? 'do valor do negócio' : pr.unit}</div>
                    </div>
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold text-navy-950">{pr.label}</h3>
                  <p className="mt-1.5 text-sm text-graphite-500">{pr.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold">
                    <span className="rounded-full bg-white px-2.5 py-1 text-navy-950 ring-1 ring-navy-900/5">Paga: {pr.payer}</span>
                    <span className="rounded-full bg-white px-2.5 py-1 text-navy-950 ring-1 ring-navy-900/5">{pr.when}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="concierge" className="scroll-mt-24 py-16 sm:py-20">
        <div className="container-kh">
          <div className="grid overflow-hidden rounded-[2rem] bg-navy-950 text-white lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <div className="text-[11px] font-bold uppercase tracking-[.25em] text-gold-300">Concierge Imobiliário · 5.000 MT</div>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Diga-nos o que procura. <em className="kh-gold-text font-serif font-semibold italic">Nós tratamos do resto.</em>
              </h2>
              <p className="mt-4 text-white/70">
                Um consultor sénior dedicado: pesquisa dentro e fora da plataforma, visitas presenciais ou por vídeo, verificação de título/DUAT e
                negociação — até à assinatura.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-white/85">
                {[
                  [Headphones, 'Consultor sénior dedicado'],
                  [Video, 'Visitas por videochamada para a diáspora'],
                  [ShieldCheck, 'Due diligence documental completa'],
                  [Handshake, 'Negociação e acompanhamento até à escritura'],
                ].map(([I, l]) => {
                  const Icon = I as typeof Headphones;
                  return (
                    <li key={l as string} className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-gold-300" /> {l as string}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-8">
                <PaymentBadges />
              </div>
            </div>
            <form onSubmit={submitConcierge} className="space-y-4 bg-white/[.04] p-8 sm:p-12">
              <div className="flex items-center gap-2 text-lg font-extrabold">
                <Plane className="h-5 w-5 text-gold-300" /> Pedir Concierge
              </div>
              {(
                [
                  ['name', 'Nome', 'O seu nome'],
                  ['phone', 'WhatsApp', '84 123 4567 ou +351…'],
                  ['budget', 'Orçamento', 'Ex.: USD 400.000'],
                ] as const
              ).map(([k, l, ph]) => (
                <label key={k} className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-white/60">{l}</span>
                  <input
                    value={form[k]}
                    onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                    placeholder={ph}
                    className={cn(inputCls(), 'border-white/10 bg-white/5 text-white placeholder:text-white/30')}
                  />
                </label>
              ))}
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-white/60">O que procura?</span>
                <textarea
                  value={form.brief}
                  onChange={(e) => setForm((f) => ({ ...f, brief: e.target.value }))}
                  rows={4}
                  placeholder="Ex.: Moradia V4 com jardim no Sommerschield, perto de escola internacional…"
                  className={cn(inputCls(), 'h-auto border-white/10 bg-white/5 py-3 text-white placeholder:text-white/30')}
                />
              </label>
              <button type="submit" className={btn('gold', 'lg', 'w-full')}>
                <Crown className="h-4 w-4" /> Solicitar Concierge · 5.000 MT
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-kh grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[.25em] text-gold-600">Perguntas frequentes</div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950">Tudo claro antes de pagar.</h2>
            <p className="mt-3 text-graphite-500">Sem letras pequenas. Se tiver outra dúvida, fale connosco por WhatsApp.</p>
          </div>
          <div className="space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group rounded-2xl bg-ivory p-5 ring-1 ring-navy-900/5 open:bg-white open:shadow-soft">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-navy-950">
                  {q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-gold-600 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-graphite-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
