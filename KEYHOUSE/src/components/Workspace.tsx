import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Calculator,
  CalendarCheck,
  Check,
  Clock,
  Eye,
  Handshake,
  LockOpen,
  MessageCircle,
  Plus,
  Star,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Building,
  Video,
} from 'lucide-react';
import type { Property, Visit } from '../lib/types';
import { useStore } from '../store/store';
import { EmptyState, ScoreRing, StatCard, StatusPill, Tabs, VerifiedBadge, btn, inputCls } from './ui';
import ContractModal from './ContractModal';
import { BROKER_SHARE, BUY_PAYMENT, PRODUCTS, RENT_PAYMENT, TIMELINES, VAT } from '../lib/constants';
import { FALLBACK_IMG } from '../data/images';
import {
  cn,
  formatDate,
  formatMT,
  formatMoney,
  groupThousands,
  maskName,
  maskPhone,
  priceLabel,
  relativeTime,
  waLink,
  weekday,
} from '../lib/utils';

type WTab = 'imoveis' | 'leads' | 'visitas' | 'negocios' | 'destaques';
const TABS: WTab[] = ['imoveis', 'leads', 'visitas', 'negocios', 'destaques'];

function CommissionCalculator() {
  const [value, setValue] = useState('10000000');
  const [pct, setPct] = useState(3);
  const v = Number(value) || 0;
  const c = (v * pct) / 100;
  const broker = c * BROKER_SHARE;
  return (
    <div className="rounded-2xl bg-navy-950 p-6 text-white">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] text-gold-300">
        <Calculator className="h-4 w-4" /> Calculadora de comissões
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold text-white/60">Valor do negócio (MT)</span>
          <input
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
            className={cn(inputCls(), 'mt-1.5 border-white/10 bg-white/5 text-white')}
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-white/60">Comissão: {pct}%</span>
          <input
            type="range"
            min={2}
            max={5}
            step={0.5}
            value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
            className="mt-5 w-full accent-gold-400"
          />
        </label>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">Comissão</div>
          <div className="mt-1 text-sm font-extrabold">{formatMT(c)}</div>
        </div>
        <div className="rounded-xl bg-gold-400 p-3 text-navy-950">
          <div className="text-[10px] font-bold uppercase tracking-widest">A sua parte 60%</div>
          <div className="mt-1 text-sm font-extrabold">{formatMT(broker)}</div>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">+ IVA 16%</div>
          <div className="mt-1 text-sm font-extrabold">{formatMT(c * VAT)}</div>
        </div>
      </div>
    </div>
  );
}

export default function Workspace({ advertiserId, variant }: { advertiserId: string; variant: 'owner' | 'broker' }) {
  const s = useStore();
  const [params, setParams] = useSearchParams();
  const tabParam = params.get('tab') as WTab | null;
  const tab: WTab = tabParam && TABS.includes(tabParam) ? tabParam : 'imoveis';
  const setTab = (t: WTab) => setParams({ tab: t }, { replace: true });
  const [contract, setContract] = useState<{ property: Property; visit: Visit } | null>(null);

  const mine = s.properties.filter((p) => p.advertiser.id === advertiserId);
  const ids = new Set(mine.map((p) => p.id));
  const propOf = (id: string) => s.properties.find((p) => p.id === id);
  const leadOf = (id: string) => s.leads.find((l) => l.id === id);
  const leads = s.leads.filter((l) => ids.has(l.propertyId) && l.qualified && l.status !== 'descartado');
  const visits = s.visits
    .filter((v) => ids.has(v.propertyId) && v.status !== 'cancelada')
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const deals = s.deals.filter((d) => ids.has(d.propertyId));

  const active = mine.filter((p) => p.status === 'publicado');
  const views = mine.reduce((a, p) => a + p.views, 0);
  const upcoming = visits.filter((v) => v.status === 'pendente' || v.status === 'confirmada');
  const pendingBroker = deals.filter((d) => d.status === 'minuta').reduce((a, d) => a + d.brokerShareMZN, 0);
  const paidBroker = deals.filter((d) => d.status === 'pago').reduce((a, d) => a + d.brokerShareMZN, 0);
  const newLeads = leads.filter((l) => !l.feePaid).length;

  const tabs =
    variant === 'broker'
      ? [
          { id: 'imoveis' as WTab, label: 'Carteira', count: mine.length },
          { id: 'leads' as WTab, label: 'Leads', count: leads.length },
          { id: 'visitas' as WTab, label: 'Visitas', count: upcoming.length },
          { id: 'negocios' as WTab, label: 'Comissões', count: deals.length },
          { id: 'destaques' as WTab, label: 'Destaques', count: mine.filter((p) => p.featured).length },
        ]
      : [
          { id: 'imoveis' as WTab, label: 'Os meus imóveis', count: mine.length },
          { id: 'leads' as WTab, label: 'Leads recebidos', count: leads.length },
          { id: 'visitas' as WTab, label: 'Visitas agendadas', count: upcoming.length },
          { id: 'negocios' as WTab, label: 'Negócios', count: deals.length },
        ];

  return (
    <div className="container-kh -mt-8 relative pb-20">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {variant === 'broker' ? (
          <>
            <StatCard accent icon={<Building className="h-4 w-4" />} label="Carteira activa" value={active.length} hint={`${mine.length} imóveis no total`} />
            <StatCard icon={<Target className="h-4 w-4" />} label="Leads qualificados" value={leads.length} hint={`${newLeads} por aceitar`} />
            <StatCard icon={<Wallet className="h-4 w-4" />} label="Comissões a receber" value={formatMT(pendingBroker)} hint="Após liquidação" />
            <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Comissões recebidas" value={formatMT(paidBroker)} hint="Acumulado" />
          </>
        ) : (
          <>
            <StatCard accent icon={<Building className="h-4 w-4" />} label="Imóveis activos" value={active.length} hint={`${mine.length} no total`} />
            <StatCard icon={<Eye className="h-4 w-4" />} label="Visualizações" value={groupThousands(views)} hint="Todos os anúncios" />
            <StatCard icon={<Users className="h-4 w-4" />} label="Leads qualificados" value={leads.length} hint={`${newLeads} por aceitar`} />
            <StatCard icon={<CalendarCheck className="h-4 w-4" />} label="Visitas agendadas" value={upcoming.length} hint="Próximos 7 dias" />
          </>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs items={tabs} value={tab} onChange={setTab} />
        <Link to="/publicar" className={btn('gold', 'md', 'shrink-0')}>
          <Plus className="h-4 w-4" /> Publicar imóvel
        </Link>
      </div>

      <div className="mt-6">
        {/* ---------- Imóveis ---------- */}
        {tab === 'imoveis' &&
          (mine.length === 0 ? (
            <EmptyState
              icon={<Building className="h-6 w-6" />}
              title="Ainda não tem imóveis"
              text="Publique em 5 minutos. Validamos em 24h e começa a receber leads qualificados."
              action={
                <Link to="/publicar" className={btn('gold')}>
                  Publicar primeiro imóvel
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {mine.map((p) => {
                const pl = s.leads.filter((l) => l.propertyId === p.id && l.qualified).length;
                return (
                  <div key={p.id} className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-navy-900/5 md:flex-row md:items-center">
                    <img src={p.photos[0] || FALLBACK_IMG} alt="" className="h-40 w-full rounded-xl object-cover md:h-20 md:w-28" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill status={p.status} />
                        {p.verified && <VerifiedBadge small />}
                        {p.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-navy-950 px-2 py-0.5 text-[10px] font-bold text-gold-300">
                            <Star className="h-3 w-3 fill-gold-300" /> Destaque
                            {p.featuredUntil && ` até ${formatDate(p.featuredUntil, { day: '2-digit', month: 'short' })}`}
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 truncate font-bold text-navy-950">{p.title}</div>
                      <div className="text-sm text-graphite-500">
                        {p.neighborhood}, {p.city} · {priceLabel(p)}
                      </div>
                      {p.status === 'rejeitado' && p.rejectionReason && (
                        <div className="mt-1 text-xs font-medium text-rose-600">Motivo: {p.rejectionReason} · taxa reembolsada</div>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-center text-[11px] text-graphite-500">
                      <div>
                        <div className="text-lg font-extrabold text-navy-950">{groupThousands(p.views)}</div>visualizações
                      </div>
                      <div>
                        <div className="text-lg font-extrabold text-navy-950">{pl}</div>leads
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:w-64 md:justify-end">
                      {p.status === 'pendente_pagamento' && (
                        <Link to={`/pagamento?itens=publicacao&ref=${p.id}`} className={btn('gold', 'sm')}>
                          Pagar publicação · 500 MT
                        </Link>
                      )}
                      {p.status === 'em_validacao' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700">
                          <Clock className="h-3.5 w-3.5" /> Validação em até 24h
                        </span>
                      )}
                      {p.status === 'publicado' && !p.featured && (
                        <Link to={`/pagamento?itens=destaque&ref=${p.id}`} className={btn('outline', 'sm')}>
                          <Star className="h-3.5 w-3.5" /> Destacar · 1.500 MT/mês
                        </Link>
                      )}
                      {p.status === 'publicado' && (
                        <Link to={`/imovel/${p.id}`} className={btn('ghost', 'sm')}>
                          Ver anúncio
                        </Link>
                      )}
                      {p.status === 'rejeitado' && (
                        <Link to="/publicar" className={btn('outline', 'sm')}>
                          Corrigir e reenviar
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

        {/* ---------- Leads ---------- */}
        {tab === 'leads' &&
          (leads.length === 0 ? (
            <EmptyState
              icon={<Target className="h-6 w-6" />}
              title="Sem leads qualificados por agora"
              text="Os leads aparecem aqui assim que um cliente passa a qualificação (orçamento, prazo e capacidade financeira)."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {leads.map((l) => {
                const p = propOf(l.propertyId);
                const paid = l.feePaid;
                const tl = TIMELINES.find((t) => t.id === l.timeline)?.label ?? '—';
                const pay = [...BUY_PAYMENT, ...RENT_PAYMENT].find((x) => x.id === l.payment)?.label ?? '—';
                return (
                  <div key={l.id} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-900/5">
                    <div className="flex items-start gap-4">
                      <ScoreRing score={l.score} size={64} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusPill status={l.status} />
                          <span className="text-xs text-graphite-400">{relativeTime(l.createdAt)}</span>
                        </div>
                        <div className="mt-1.5 font-bold text-navy-950">{paid ? l.name : maskName(l.name)}</div>
                        <div className="text-sm text-graphite-500">{paid ? l.phone : maskPhone(l.phone)}</div>
                      </div>
                    </div>
                    {p && (
                      <div className="mt-4 truncate text-xs text-graphite-500">
                        Interesse:{' '}
                        <Link to={`/imovel/${p.id}`} className="font-semibold text-navy-950 hover:underline">
                          {p.title}
                        </Link>
                      </div>
                    )}
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
                      {[
                        ['Orçamento', formatMoney(l.budget, l.currency)],
                        ['Prazo', tl],
                        ['Pagamento', pay],
                        ['Zona', l.zone],
                      ].map(([k, val]) => (
                        <div key={k} className="rounded-xl bg-ivory px-3 py-2">
                          <dt className="text-[10px] font-bold uppercase tracking-widest text-graphite-400">{k}</dt>
                          <dd className="truncate font-bold text-navy-950">{val}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-4 flex gap-2">
                      {paid ? (
                        <a
                          href={waLink(l.phone, `Olá ${l.name.split(' ')[0]}! Obrigado pelo interesse no imóvel "${p?.title ?? ''}" na KEYHOUSE PROPERTIES.`)}
                          target="_blank"
                          rel="noreferrer"
                          className={btn('navy', 'sm', 'flex-1')}
                        >
                          <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
                        </a>
                      ) : (
                        <>
                          <Link to={`/pagamento?itens=lead&ref=${l.id}`} className={btn('gold', 'sm', 'flex-1')}>
                            <LockOpen className="h-4 w-4" /> Aceitar lead · {groupThousands(PRODUCTS.lead.price)} MT
                          </Link>
                          <button
                            onClick={() => {
                              s.updateLead(l.id, { status: 'descartado' });
                              s.notify('Lead descartado. Não será cobrado.', 'info');
                            }}
                            className={btn('ghost', 'sm')}
                          >
                            Descartar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

        {/* ---------- Visitas ---------- */}
        {tab === 'visitas' &&
          (visits.length === 0 ? (
            <EmptyState icon={<CalendarCheck className="h-6 w-6" />} title="Sem visitas" text="As visitas pedidas por leads qualificados aparecem aqui." />
          ) : (
            <div className="space-y-3">
              {visits.map((v) => {
                const p = propOf(v.propertyId);
                const lead = leadOf(v.leadId);
                const leadPaid = lead ? lead.feePaid : true;
                const reminder = `Lembrete KEYHOUSE 🔑 ${formatDate(v.date, { weekday: 'long', day: 'numeric', month: 'long' })} às ${v.time}: visita a "${p?.title ?? ''}" (${p?.neighborhood ?? ''}). Responda SIM para confirmar ou REMARCAR para alterar.`;
                return (
                  <div key={v.id} className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-navy-900/5 md:flex-row md:items-center">
                    <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-navy-950 py-2 text-white">
                      <span className="text-[10px] font-bold uppercase text-gold-300">{weekday(v.date)}</span>
                      <span className="text-xl font-extrabold leading-tight">{v.date.slice(-2)}</span>
                      <span className="text-[10px] text-white/60">{v.time}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill status={v.status} />
                        {v.mode === 'video' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-bold text-violet-700 ring-1 ring-violet-200">
                            <Video className="h-3 w-3" /> Videochamada
                          </span>
                        )}
                        {v.reminderSent && <span className="text-[11px] font-semibold text-emerald-600">✓ Lembrete enviado</span>}
                      </div>
                      <div className="mt-1 font-bold text-navy-950">{leadPaid ? v.clientName : maskName(v.clientName)}</div>
                      <div className="truncate text-sm text-graphite-500">{p?.title}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {v.status === 'pendente' &&
                        (leadPaid ? (
                          <Link to={`/pagamento?itens=visita&ref=${v.id}`} className={btn('gold', 'sm')}>
                            <Check className="h-4 w-4" /> Confirmar visita · 500 MT
                          </Link>
                        ) : (
                          <Link to={`/pagamento?itens=lead,visita&lead=${v.leadId}&visita=${v.id}`} className={btn('gold', 'sm')}>
                            <LockOpen className="h-4 w-4" /> Aceitar lead + confirmar · 1.500 MT
                          </Link>
                        ))}
                      {v.status === 'pendente' && (
                        <button
                          onClick={() => {
                            s.updateVisit(v.id, { status: 'cancelada' });
                            s.notify('Visita recusada. O cliente será notificado.', 'info');
                          }}
                          className={btn('ghost', 'sm')}
                        >
                          Recusar
                        </button>
                      )}
                      {v.status === 'confirmada' && (
                        <>
                          <a
                            href={waLink(v.clientPhone, reminder)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => s.updateVisit(v.id, { reminderSent: true })}
                            className={btn('outline', 'sm')}
                          >
                            <MessageCircle className="h-4 w-4" /> Lembrete WhatsApp
                          </a>
                          <button
                            onClick={() => {
                              s.updateVisit(v.id, { status: 'realizada' });
                              s.notify('Visita marcada como realizada.');
                            }}
                            className={btn('navy', 'sm')}
                          >
                            Marcar realizada
                          </button>
                        </>
                      )}
                      {v.status === 'realizada' && p && (
                        <button onClick={() => setContract({ property: p, visit: v })} className={btn('gold', 'sm')}>
                          <Handshake className="h-4 w-4" /> Fechar negócio
                        </button>
                      )}
                      {v.status === 'fechada' && (
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-gold-700">
                          <Handshake className="h-4 w-4" /> Negócio fechado
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

        {/* ---------- Negócios / Comissões ---------- */}
        {tab === 'negocios' && (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-3">
              {deals.length === 0 ? (
                <EmptyState
                  icon={<Handshake className="h-6 w-6" />}
                  title="Ainda sem negócios fechados"
                  text="Depois de uma visita realizada, use “Fechar negócio” para gerar a minuta e calcular a comissão automaticamente."
                />
              ) : (
                deals.map((d) => {
                  const p = propOf(d.propertyId);
                  const total = d.commissionMZN + d.vatMZN;
                  return (
                    <div key={d.id} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-900/5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <StatusPill status={d.status} />
                            <span className="text-xs text-graphite-400">{formatDate(d.createdAt)}</span>
                          </div>
                          <div className="mt-1.5 truncate font-bold text-navy-950">{p?.title ?? d.propertyId}</div>
                          <div className="text-sm text-graphite-500">
                            {d.clientName} · {formatMoney(d.value, d.currency)}
                            {d.months ? ` (${d.months} meses)` : ''}
                          </div>
                        </div>
                        {d.status === 'minuta' ? (
                          <Link to={`/pagamento?itens=comissao&ref=${d.id}`} className={btn('gold', 'sm', 'shrink-0')}>
                            Liquidar comissão · {formatMT(total)}
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600">
                            <Check className="h-4 w-4" /> Liquidada
                          </span>
                        )}
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[12px] sm:grid-cols-4">
                        {[
                          [`Comissão ${d.commissionPct}%`, formatMT(d.commissionMZN)],
                          ['IVA 16%', formatMT(d.vatMZN)],
                          [variant === 'broker' ? 'A sua parte' : 'Intermediário', formatMT(d.brokerShareMZN)],
                          ['KEYHOUSE', formatMT(d.platformShareMZN)],
                        ].map(([k, val], i) => (
                          <div key={k} className={cn('rounded-xl px-2 py-2.5', i === 2 && variant === 'broker' ? 'bg-gold-50 ring-1 ring-gold-200' : 'bg-ivory')}>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-graphite-400">{k}</div>
                            <div className="mt-0.5 font-extrabold text-navy-950">{val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="space-y-4">
              {variant === 'broker' && <CommissionCalculator />}
              <div className="rounded-2xl bg-white p-5 text-sm text-graphite-600 shadow-soft ring-1 ring-navy-900/5">
                <div className="font-bold text-navy-950">Como funciona a comissão de fecho</div>
                <ul className="mt-3 space-y-2">
                  <li>• 2% a 5% sobre o valor do negócio (arrendamento: valor global do contrato).</li>
                  <li>• Minuta de contrato gerada automaticamente no fecho.</li>
                  <li>• Com intermediário: 60% intermediário · 40% KEYHOUSE.</li>
                  <li>• IVA de 16% aplicado sobre a comissão.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ---------- Destaques ---------- */}
        {tab === 'destaques' && (
          <div className="grid gap-4 md:grid-cols-2">
            {active.map((p) => (
              <div key={p.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-navy-900/5">
                <img src={p.photos[0] || FALLBACK_IMG} alt="" className="h-16 w-20 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold text-navy-950">{p.title}</div>
                  <div className="text-xs text-graphite-500">Bairro: {p.neighborhood}</div>
                  {p.featured ? (
                    <div className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-gold-700">
                      <Star className="h-3 w-3 fill-gold-500 text-gold-500" /> Activo
                      {p.featuredUntil ? ` até ${formatDate(p.featuredUntil, { day: '2-digit', month: 'short' })}` : ''}
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-graphite-400">Sem destaque</div>
                  )}
                </div>
                {!p.featured && (
                  <Link to={`/pagamento?itens=destaque&ref=${p.id}`} className={btn('gold', 'sm')}>
                    Destacar
                  </Link>
                )}
              </div>
            ))}
            {active.length === 0 && (
              <EmptyState icon={<Star className="h-6 w-6" />} title="Sem imóveis publicados" text="Publique e destaque no bairro para aparecer no topo das pesquisas." />
            )}
          </div>
        )}
      </div>

      {contract && (
        <ContractModal
          open
          onClose={() => setContract(null)}
          property={contract.property}
          visit={contract.visit}
          onDone={() => setTab('negocios')}
        />
      )}
    </div>
  );
}
