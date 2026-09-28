import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Building,
  ChartColumn,
  Check,
  CircleCheck,
  CircleX,
  Clock,
  Download,
  Eye,
  Headphones,
  ShieldCheck,
  Target,
  Wallet,
  X,
} from 'lucide-react';
import { useStore } from '../store/store';
import { useTitle } from '../hooks/useTitle';
import { EmptyState, PageHeader, Select, StatCard, StatusPill, Tabs, btn } from '../components/ui';
import { BarList } from '../components/charts';
import { METHOD_LABEL, PRODUCTS, PRODUCT_ORDER, REJECTION_REASONS } from '../lib/constants';
import { propertyChecks, suggestTier } from '../lib/listing';
import type { ConciergeRequest, PaymentMethod, Property, Tier } from '../lib/types';
import { cn, compact, downloadCSV, formatDateTime, formatMT, groupThousands, priceLabel, relativeTime } from '../lib/utils';

type ATab = 'validacao' | 'pagamentos' | 'relatorios' | 'concierge';
const TABS: ATab[] = ['validacao', 'pagamentos', 'relatorios', 'concierge'];
const ADV: Record<string, string> = { proprietario: 'Proprietário', intermediario: 'Intermediário', agencia: 'Agência' };

function ValidationCard({ p }: { p: Property }) {
  const s = useStore();
  const checks = propertyChecks(p);
  const ok = checks.filter((c) => c.ok).length;
  const [tier, setTier] = useState<Tier>(p.tier ?? suggestTier(p));
  const [reason, setReason] = useState(REJECTION_REASONS[0]);
  const [rejecting, setRejecting] = useState(false);
  const verified = p.hasTitle && p.hasLicense;

  const approve = () => {
    s.updateProperty(p.id, { status: 'publicado', verified, verifiedAt: new Date().toISOString(), tier });
    s.notify(`Anúncio aprovado e publicado${verified ? ' com selo Verificado' : ' (sem selo — documentação incompleta)'}.`);
  };
  const reject = () => {
    s.updateProperty(p.id, { status: 'rejeitado', rejectionReason: reason });
    const pay = s.payments.find((x) => x.status === 'pago' && x.items.some((i) => i.code === 'publicacao' && i.ref === p.id));
    if (pay) s.updatePayment(pay.id, { status: 'reembolsado' });
    s.notify(`Anúncio rejeitado${pay ? ' — taxa de publicação reembolsada automaticamente' : ''}.`, 'info');
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-navy-900/5">
      <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="grid grid-cols-3 gap-1 p-1.5 lg:grid-cols-1 lg:grid-rows-3">
          {p.photos.slice(0, 3).map((ph, i) => (
            <img key={i} src={ph} alt="" className="h-24 w-full rounded-xl object-cover lg:h-full" />
          ))}
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={p.status} />
            <span className="inline-flex items-center gap-1 text-xs text-graphite-400">
              <Clock className="h-3.5 w-3.5" /> Submetido {relativeTime(p.createdAt)}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-extrabold text-navy-950">{p.title}</h3>
          <div className="text-sm text-graphite-500">
            {p.type} · {p.neighborhood}, {p.city} · {priceLabel(p)}
          </div>
          <div className="mt-1 text-xs text-graphite-500">
            Anunciante: <b className="text-navy-950">{p.advertiser.name}</b> ({ADV[p.advertiser.type]}) · {p.advertiser.phone}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm font-bold text-navy-950">Checklist de 27 pontos</span>
            <span className={cn('text-sm font-extrabold', ok === 27 ? 'text-emerald-600' : 'text-amber-600')}>{ok}/27</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
            {checks.map((c) => (
              <div key={c.label} className={cn('flex items-center gap-1.5 text-xs', c.ok ? 'text-graphite-600' : 'font-bold text-rose-600')}>
                {c.ok ? <Check className="h-3 w-3 shrink-0 text-emerald-600" /> : <X className="h-3 w-3 shrink-0" />}
                {c.label}
              </div>
            ))}
          </div>
          {!verified && (
            <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
              Documentação incompleta: pode publicar, mas sem selo Verificado.
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 border-t border-navy-900/5 pt-5 xl:flex-row xl:items-end">
            <label className="block xl:w-48">
              <span className="mb-1 block text-xs font-bold text-graphite-500">Classificação da oferta</span>
              <Select value={tier} onChange={(e) => setTier(e.target.value as Tier)}>
                {(['Premium', 'Essencial', 'Oportunidade'] as Tier[]).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </label>
            {rejecting ? (
              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end">
                <label className="block flex-1">
                  <span className="mb-1 block text-xs font-bold text-graphite-500">Motivo da rejeição</span>
                  <Select value={reason} onChange={(e) => setReason(e.target.value)}>
                    {REJECTION_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </Select>
                </label>
                <button onClick={reject} className={btn('outline', 'md', 'border-rose-200 text-rose-700 hover:border-rose-400')}>
                  Confirmar rejeição
                </button>
                <button onClick={() => setRejecting(false)} className={btn('ghost', 'md')}>
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex flex-1 flex-wrap justify-end gap-2">
                <Link to={`/imovel/${p.id}`} className={btn('ghost', 'md')}>
                  <Eye className="h-4 w-4" /> Pré-visualizar
                </Link>
                <button onClick={() => setRejecting(true)} className={btn('outline', 'md')}>
                  <CircleX className="h-4 w-4" /> Rejeitar
                </button>
                <button onClick={approve} className={btn('gold', 'md')}>
                  <CircleCheck className="h-4 w-4" /> Aprovar & publicar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminArea() {
  useTitle('Administração — KEYHOUSE PROPERTIES');
  const s = useStore();
  const [params, setParams] = useSearchParams();
  const t = params.get('tab') as ATab | null;
  const tab: ATab = t && TABS.includes(t) ? t : 'validacao';
  const setTab = (x: ATab) => setParams({ tab: x }, { replace: true });
  const [method, setMethod] = useState<'all' | PaymentMethod>('all');

  const queue = s.properties.filter((p) => p.status === 'em_validacao');
  const awaitingPayment = s.properties.filter((p) => p.status === 'pendente_pagamento');
  const paid = s.payments.filter((p) => p.status === 'pago');
  const revenue = paid.reduce((a, p) => a + p.total, 0);
  const published = s.properties.filter((p) => p.status === 'publicado').length;
  const qualRate = s.leads.length ? (s.leads.filter((l) => l.qualified).length / s.leads.length) * 100 : 0;
  const paymentsList = s.payments.filter((p) => method === 'all' || p.method === method);
  const bySource = PRODUCT_ORDER.map((c) => ({
    code: c,
    label: PRODUCTS[c].label,
    count: paid.flatMap((p) => p.items).filter((i) => i.code === c).length,
    value: paid.flatMap((p) => p.items).filter((i) => i.code === c).reduce((a, i) => a + i.amount, 0),
  }));
  const byStatus = (['publicado', 'em_validacao', 'pendente_pagamento', 'rejeitado', 'vendido', 'arrendado'] as const).map((st) => ({
    status: st,
    count: s.properties.filter((p) => p.status === st).length,
  }));

  const exportPayments = () =>
    downloadCSV('keyhouse-pagamentos.csv', [
      ['Referência', 'Data', 'Pagador', 'Itens', 'Método', 'Valor (MT)', 'Estado'],
      ...paymentsList.map((p) => [p.reference, formatDateTime(p.createdAt), p.payer, p.items.map((i) => i.label).join(' + '), METHOD_LABEL[p.method], p.total, p.status]),
    ]);
  const exportReport = () =>
    downloadCSV('keyhouse-relatorio-receita.csv', [
      ['Fonte de receita', 'Preço', 'Quem paga', 'Quando cobra', 'Transacções', 'Receita (MT)'],
      ...bySource.map((r) => [r.label, PRODUCTS[r.code].code === 'comissao' ? '2-5%' : PRODUCTS[r.code].price, PRODUCTS[r.code].payer, PRODUCTS[r.code].when, r.count, r.value]),
      ['TOTAL', '', '', '', bySource.reduce((a, r) => a + r.count, 0), revenue],
    ]);

  return (
    <div>
      <PageHeader
        eyebrow="Administração"
        title="Centro de operações"
        microcopy="Controle total da plataforma."
        actions={
          <Link to="/painel" className={btn('glass', 'md')}>
            <ChartColumn className="h-4 w-4" /> Painel de Controlo
          </Link>
        }
      >
        <div className="h-6" />
      </PageHeader>

      <div className="container-kh relative -mt-8 pb-20">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard accent icon={<ShieldCheck className="h-4 w-4" />} label="Por validar" value={queue.length} hint={`${awaitingPayment.length} a aguardar pagamento`} />
          <StatCard icon={<Wallet className="h-4 w-4" />} label="Receita registada" value={`${compact(revenue)} MT`} hint={`${paid.length} transacções`} />
          <StatCard icon={<Building className="h-4 w-4" />} label="Anúncios publicados" value={published} hint={`${s.properties.length} no total`} />
          <StatCard icon={<Target className="h-4 w-4" />} label="Taxa de qualificação" value={`${qualRate.toFixed(0)}%`} hint={`${s.leads.length} leads`} />
        </div>

        <div className="mt-8">
          <Tabs
            items={[
              { id: 'validacao' as ATab, label: 'Validação de anúncios', count: queue.length },
              { id: 'pagamentos' as ATab, label: 'Pagamentos', count: s.payments.length },
              { id: 'relatorios' as ATab, label: 'Relatórios' },
              { id: 'concierge' as ATab, label: 'Concierge', count: s.concierge.length },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>

        <div className="mt-6">
          {tab === 'validacao' && (
            <div className="space-y-5">
              {queue.length === 0 ? (
                <EmptyState
                  icon={<ShieldCheck className="h-6 w-6" />}
                  title="Fila de validação vazia"
                  text="Todos os anúncios pagos foram validados. Publique um imóvel de teste para ver o fluxo completo."
                  action={
                    <Link to="/publicar" className={btn('gold')}>
                      Publicar imóvel de teste
                    </Link>
                  }
                />
              ) : (
                queue.map((p) => <ValidationCard key={p.id} p={p} />)
              )}
              {awaitingPayment.length > 0 && (
                <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-900/5">
                  <div className="text-sm font-bold text-navy-950">A aguardar pagamento da taxa de publicação</div>
                  <ul className="mt-3 divide-y divide-navy-900/5 text-sm">
                    {awaitingPayment.map((p) => (
                      <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                        <span className="truncate text-graphite-600">{p.title}</span>
                        <span className="shrink-0 text-xs text-graphite-400">{relativeTime(p.createdAt)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {tab === 'pagamentos' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {(['mpesa', 'emola', 'paypal', 'banco'] as PaymentMethod[]).map((m) => {
                  const list = paid.filter((p) => p.method === m);
                  return (
                    <button
                      key={m}
                      onClick={() => setMethod(method === m ? 'all' : m)}
                      className={cn('rounded-2xl bg-white p-4 text-left shadow-soft ring-1 transition', method === m ? 'ring-2 ring-gold-400' : 'ring-navy-900/5')}
                    >
                      <div className="text-[11px] font-bold uppercase tracking-[.16em] text-graphite-400">{METHOD_LABEL[m]}</div>
                      <div className="mt-1 text-xl font-extrabold text-navy-950">{formatMT(list.reduce((a, p) => a + p.total, 0))}</div>
                      <div className="text-xs text-graphite-500">{list.length} transacções</div>
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Select value={method} onChange={(e) => setMethod(e.target.value as 'all' | PaymentMethod)} className="w-52">
                  <option value="all">Todos os métodos</option>
                  {(['mpesa', 'emola', 'paypal', 'banco'] as PaymentMethod[]).map((m) => (
                    <option key={m} value={m}>
                      {METHOD_LABEL[m]}
                    </option>
                  ))}
                </Select>
                <button onClick={exportPayments} className={btn('navy', 'md')}>
                  <Download className="h-4 w-4" /> Exportar CSV
                </button>
              </div>
              <div className="overflow-x-auto rounded-2xl bg-white shadow-soft ring-1 ring-navy-900/5">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="bg-ivory text-[11px] font-bold uppercase tracking-[.14em] text-graphite-400">
                    <tr>
                      <th className="px-4 py-3">Referência</th>
                      <th className="px-4 py-3">Data</th>
                      <th className="px-4 py-3">Pagador</th>
                      <th className="px-4 py-3">Itens</th>
                      <th className="px-4 py-3">Método</th>
                      <th className="px-4 py-3 text-right">Valor</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-900/5">
                    {paymentsList.map((p) => (
                      <tr key={p.id} className={cn(p.live && 'bg-gold-50/40')}>
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-navy-950">{p.reference}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-graphite-500">{formatDateTime(p.createdAt)}</td>
                        <td className="max-w-[180px] truncate px-4 py-3 text-navy-950">{p.payer}</td>
                        <td className="max-w-[240px] truncate px-4 py-3 text-graphite-600">{p.items.map((i) => i.label).join(' + ')}</td>
                        <td className="px-4 py-3 font-semibold text-navy-950">{METHOD_LABEL[p.method]}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-extrabold text-navy-950">{formatMT(p.total)}</td>
                        <td className="px-4 py-3">
                          <StatusPill status={p.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          {p.status === 'pago' && p.items.some((i) => i.code !== 'comissao') && (
                            <button
                              onClick={() => {
                                s.updatePayment(p.id, { status: 'reembolsado' });
                                s.notify(`Pagamento ${p.reference} reembolsado.`, 'info');
                              }}
                              className="text-xs font-bold text-graphite-400 hover:text-rose-600"
                            >
                              Reembolsar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'relatorios' && (
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-900/5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[.18em] text-graphite-400">Receita por fonte (registada)</div>
                    <div className="mt-1 text-2xl font-extrabold text-navy-950">{formatMT(revenue)}</div>
                  </div>
                  <button onClick={exportReport} className={btn('navy', 'sm')}>
                    <Download className="h-4 w-4" /> CSV
                  </button>
                </div>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead className="text-left text-[11px] font-bold uppercase tracking-[.14em] text-graphite-400">
                      <tr>
                        <th className="py-2">Fonte</th>
                        <th className="py-2">Preço</th>
                        <th className="py-2 text-right">Transacções</th>
                        <th className="py-2 text-right">Receita</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-900/5">
                      {bySource.map((r) => (
                        <tr key={r.code}>
                          <td className="py-2.5 font-semibold text-navy-950">{r.label}</td>
                          <td className="py-2.5 text-graphite-500">{r.code === 'comissao' ? '2–5%' : `${groupThousands(PRODUCTS[r.code].price)} MT ${PRODUCTS[r.code].unit}`}</td>
                          <td className="py-2.5 text-right text-graphite-600">{r.count}</td>
                          <td className="py-2.5 text-right font-extrabold text-navy-950">{formatMT(r.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-900/5">
                  <div className="text-[11px] font-bold uppercase tracking-[.18em] text-graphite-400">Anúncios por estado</div>
                  <div className="mt-4 space-y-2">
                    {byStatus.map((b) => (
                      <div key={b.status} className="flex items-center justify-between">
                        <StatusPill status={b.status} />
                        <span className="font-extrabold text-navy-950">{b.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-900/5">
                  <div className="text-[11px] font-bold uppercase tracking-[.18em] text-graphite-400">Pipeline comercial</div>
                  <div className="mt-4">
                    <BarList
                      items={[
                        { label: 'Leads totais', value: s.leads.length },
                        { label: 'Leads qualificados', value: s.leads.filter((l) => l.qualified).length },
                        { label: 'Leads aceites (pagos)', value: s.leads.filter((l) => l.feePaid).length },
                        { label: 'Visitas', value: s.visits.length },
                        { label: 'Negócios', value: s.deals.length },
                      ]}
                    />
                  </div>
                  <div className="mt-4 rounded-xl bg-ivory px-3 py-2 text-xs text-graphite-600">
                    Comissões geradas: <b className="text-navy-950">{formatMT(s.deals.reduce((a, d) => a + d.commissionMZN, 0))}</b>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'concierge' &&
            (s.concierge.length === 0 ? (
              <EmptyState icon={<Headphones className="h-6 w-6" />} title="Sem pedidos Concierge" text="Os pedidos de Concierge aparecem aqui." />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {s.concierge.map((c) => (
                  <div key={c.id} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-900/5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-bold text-navy-950">{c.name}</div>
                        <div className="text-xs text-graphite-500">
                          {c.phone} · {relativeTime(c.createdAt)}
                        </div>
                      </div>
                      <StatusPill status={c.status} />
                    </div>
                    <p className="mt-3 text-sm text-graphite-600">{c.brief}</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-gold-50 px-3 py-1 text-xs font-bold text-navy-950 ring-1 ring-gold-200">{c.budget}</span>
                      <Select
                        value={c.status}
                        onChange={(e) => s.updateConcierge(c.id, { status: e.target.value as ConciergeRequest['status'] })}
                        className="w-40"
                      >
                        <option value="pendente">Pendente</option>
                        <option value="em_curso">Em curso</option>
                        <option value="concluido">Concluído</option>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
