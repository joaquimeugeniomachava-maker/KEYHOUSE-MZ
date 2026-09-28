import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Building,
  CalendarCheck,
  Calculator,
  ChartColumn,
  Handshake,
  Rocket,
  ShieldCheck,
  Target,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useStore } from '../store/store';
import { useTitle } from '../hooks/useTitle';
import { PageHeader, StatCard, btn } from '../components/ui';
import { AreaChart, BarList, Funnel } from '../components/charts';
import { FUNNEL_BASE, REVENUE_HISTORY } from '../data/seed';
import { METHOD_LABEL, PRODUCTS, PRODUCT_ORDER } from '../lib/constants';
import type { PaymentMethod, ProductCode } from '../lib/types';
import { cn, compact, formatMT, groupThousands, relativeTime } from '../lib/utils';

type Rev = Record<ProductCode, number>;
const sum = (m: Rev) => PRODUCT_ORDER.reduce((a, c) => a + m[c], 0);

function RevenueSimulator() {
  const [v, setV] = useState({
    publicacao: 180,
    destaque: 40,
    lead: 260,
    visita: 150,
    negocios: 6,
    ticket: 6000000,
    pct: 3,
    intermediario: 45,
    contacto: 400,
    concierge: 8,
    agencia: 6,
    custos: 650000,
  });
  const set = (k: keyof typeof v, n: number) => setV((s) => ({ ...s, [k]: n }));
  const by: Rev = {
    publicacao: v.publicacao * 500,
    destaque: v.destaque * 1500,
    lead: v.lead * 1000,
    visita: v.visita * 500,
    comissao: (v.negocios * v.ticket * v.pct) / 100,
    intermediario: v.intermediario * 3000,
    contacto: v.contacto * 200,
    concierge: v.concierge * 5000,
    agencia: v.agencia * 10000,
  };
  const total = sum(by);
  const mrr = by.destaque + by.intermediario + by.agencia;
  const result = total - v.custos;
  const commissionShare = total ? (by.comissao / total) * 100 : 0;
  const sliders: { k: keyof typeof v; label: string; max: number; step: number; fmt?: (n: number) => string }[] = [
    { k: 'publicacao', label: 'Anúncios publicados / mês', max: 1000, step: 10 },
    { k: 'destaque', label: 'Destaques activos', max: 400, step: 5 },
    { k: 'lead', label: 'Leads aceites / mês', max: 2000, step: 10 },
    { k: 'visita', label: 'Visitas confirmadas / mês', max: 1500, step: 10 },
    { k: 'negocios', label: 'Negócios fechados / mês', max: 80, step: 1 },
    { k: 'ticket', label: 'Valor médio do negócio', max: 50000000, step: 500000, fmt: (n) => `${compact(n)} MT` },
    { k: 'pct', label: 'Comissão média', max: 5, step: 0.5, fmt: (n) => `${n}%` },
    { k: 'intermediario', label: 'Intermediários subscritos', max: 600, step: 5 },
    { k: 'contacto', label: 'Contactos desbloqueados / mês', max: 4000, step: 50 },
    { k: 'concierge', label: 'Serviços Concierge / mês', max: 120, step: 1 },
    { k: 'agencia', label: 'Agências Premium', max: 150, step: 1 },
    { k: 'custos', label: 'Custos operacionais / mês', max: 5000000, step: 50000, fmt: (n) => `${compact(n)} MT` },
  ];
  return (
    <div className="overflow-hidden rounded-3xl bg-navy-950 text-white ring-1 ring-gold-400/20">
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] text-gold-300">
            <Calculator className="h-4 w-4" /> Simulador de receita · 9 fontes
          </div>
          <h3 className="mt-2 text-2xl font-extrabold">Quanto vale a KEYHOUSE à escala?</h3>
          <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {sliders.map((s) => (
              <label key={s.k} className="block">
                <span className="flex justify-between text-xs">
                  <span className="font-semibold text-white/65">{s.label}</span>
                  <span className="font-extrabold text-gold-300">{s.fmt ? s.fmt(v[s.k]) : groupThousands(v[s.k])}</span>
                </span>
                <input
                  type="range"
                  min={s.k === 'pct' ? 2 : 0}
                  max={s.max}
                  step={s.step}
                  value={v[s.k]}
                  onChange={(e) => set(s.k, Number(e.target.value))}
                  className="mt-2 w-full accent-gold-400"
                />
              </label>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 bg-white/[.03] p-6 sm:p-8 lg:border-l lg:border-t-0">
          <div className="text-xs font-bold uppercase tracking-[.16em] text-white/50">Receita mensal projectada</div>
          <div className="kh-gold-text mt-1 text-4xl font-extrabold tracking-tight">{formatMT(total)}</div>
          <div className="mt-1 text-sm text-white/55">≈ {formatMT(total * 12)} / ano</div>
          <div className="mt-5 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/45">Recorrente (MRR)</div>
              <div className="mt-1 font-extrabold">{formatMT(mrr)}</div>
            </div>
            <div className={cn('rounded-xl p-3', result >= 0 ? 'bg-emerald-500/15' : 'bg-rose-500/15')}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/45">Resultado</div>
              <div className={cn('mt-1 font-extrabold', result >= 0 ? 'text-emerald-300' : 'text-rose-300')}>{formatMT(result)}</div>
            </div>
          </div>
          <div className="mt-6">
            <BarList dark items={PRODUCT_ORDER.map((c) => ({ label: PRODUCTS[c].label, value: by[c] }))} format={(n) => `${compact(n)} MT`} />
          </div>
          <div className="mt-6 rounded-2xl border border-gold-400/25 bg-gold-400/10 p-4 text-sm text-white/80">
            <b className="text-gold-300">Leitura:</b>{' '}
            {commissionShare > 45
              ? `A comissão de fecho representa ${commissionShare.toFixed(0)}% da receita. O motor é o fecho — tudo o resto é combustível para lá chegar.`
              : `A receita está diversificada: a comissão pesa ${commissionShare.toFixed(0)}%. Bom sinal de resiliência — menos dependência de grandes negócios.`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  useTitle('Painel de Controlo — KEYHOUSE PROPERTIES');
  const s = useStore();

  const months = useMemo(() => {
    const d = new Date();
    return Array.from({ length: 6 }, (_, i) =>
      new Date(d.getFullYear(), d.getMonth() - (5 - i), 1).toLocaleDateString('pt-PT', { month: 'short' }).replace('.', ''),
    );
  }, []);

  const live = s.payments.filter((p) => p.live && p.status === 'pago');
  const liveBy = PRODUCT_ORDER.reduce(
    (acc, c) => ({ ...acc, [c]: live.flatMap((p) => p.items).filter((i) => i.code === c).reduce((a, i) => a + i.amount, 0) }),
    {} as Rev,
  );
  const current = PRODUCT_ORDER.reduce((acc, c) => ({ ...acc, [c]: REVENUE_HISTORY[5][c] + liveBy[c] }), {} as Rev);
  const series = REVENUE_HISTORY.map((m, i) => ({ label: months[i], value: sum(i === 5 ? current : m) }));
  const monthRevenue = sum(current);
  const growth = (monthRevenue / sum(REVENUE_HISTORY[4]) - 1) * 100;
  const mrr = current.destaque + current.intermediario + current.agencia;

  const leadsTotal = FUNNEL_BASE.leads + s.leads.length;
  const qualified = FUNNEL_BASE.qualificados + s.leads.filter((l) => l.qualified).length;
  const visitsN = FUNNEL_BASE.visitas + s.visits.length;
  const confirmed = s.visits.filter((v) => v.status !== 'pendente' && v.status !== 'cancelada').length;
  const dealsN = FUNNEL_BASE.negocios + s.deals.length;
  const searches = FUNNEL_BASE.pesquisas + s.searches.length;
  const pendingValidation = s.properties.filter((p) => p.status === 'em_validacao').length;
  const published = s.properties.filter((p) => p.status === 'publicado').length;

  const propTitle = (id: string) => s.properties.find((p) => p.id === id)?.title ?? '';
  type Act = { id: string; at: string; icon: LucideIcon; title: string; sub: string; amount?: number };
  const activity: Act[] = [
    ...s.payments.slice(0, 10).map((p) => ({
      id: p.id,
      at: p.createdAt,
      icon: Wallet,
      title: `${METHOD_LABEL[p.method]} · ${p.items.map((i) => i.label).join(' + ')}`,
      sub: p.payer,
      amount: p.total,
    })),
    ...s.leads.slice(0, 8).map((l) => ({
      id: l.id,
      at: l.createdAt,
      icon: Target,
      title: `Lead ${l.qualified ? 'qualificado' : 'não qualificado'} · ${l.score}/100`,
      sub: propTitle(l.propertyId),
    })),
    ...s.visits.slice(0, 6).map((v) => ({
      id: v.id,
      at: v.createdAt,
      icon: CalendarCheck,
      title: `Visita ${v.status === 'pendente' ? 'pedida' : v.status}`,
      sub: propTitle(v.propertyId),
    })),
    ...s.deals.slice(0, 4).map((d) => ({
      id: d.id,
      at: d.createdAt,
      icon: Handshake,
      title: `Negócio fechado · comissão ${d.commissionPct}%`,
      sub: propTitle(d.propertyId),
      amount: d.commissionMZN,
    })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 8);

  const zoneDemand = useMemo(() => {
    const base: Record<string, number> = {
      Sommerschield: 148,
      'Polana Cimento A': 126,
      'Costa do Sol': 112,
      'Matola Rio': 87,
      Coop: 64,
      Baixa: 51,
    };
    s.leads.forEach((l) => {
      const p = s.properties.find((x) => x.id === l.propertyId);
      if (p) base[p.neighborhood] = (base[p.neighborhood] || 0) + 1;
    });
    return Object.entries(base)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [s.leads, s.properties]);

  const methodMix = (['mpesa', 'emola', 'paypal', 'banco'] as PaymentMethod[]).map((m) => ({
    label: METHOD_LABEL[m],
    value: s.payments.filter((p) => p.method === m && p.status === 'pago').length,
  }));

  return (
    <div>
      <PageHeader
        eyebrow="Painel de Controlo"
        title="Visão geral da plataforma"
        microcopy="Veja os seus resultados em tempo real."
        actions={
          <>
            <Link to="/admin" className={btn('glass', 'md')}>
              <ShieldCheck className="h-4 w-4" /> Administração
              {pendingValidation > 0 && <span className="rounded-full bg-gold-400 px-1.5 text-[11px] font-extrabold text-navy-950">{pendingValidation}</span>}
            </Link>
            <Link to="/planos" className={btn('gold', 'md')}>
              Planos & preços
            </Link>
          </>
        }
      >
        <div className="h-6" />
      </PageHeader>

      <div className="container-kh relative -mt-8 space-y-6 pb-20">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            accent
            icon={<Wallet className="h-4 w-4" />}
            label="Receita do mês"
            value={`${compact(monthRevenue)} MT`}
            hint={<span className="text-emerald-300">▲ {growth.toFixed(1)}% vs. mês anterior</span>}
          />
          <StatCard
            icon={<Target className="h-4 w-4" />}
            label="Leads qualificados"
            value={groupThousands(qualified)}
            hint={`${((qualified / leadsTotal) * 100).toFixed(0)}% de ${groupThousands(leadsTotal)} leads`}
          />
          <StatCard
            icon={<CalendarCheck className="h-4 w-4" />}
            label="Visitas"
            value={groupThousands(visitsN)}
            hint={`${confirmed} confirmadas · ${s.visits.filter((v) => v.status === 'pendente').length} por confirmar`}
          />
          <StatCard icon={<Handshake className="h-4 w-4" />} label="Negócios fechados" value={dealsN} hint={`MRR: ${compact(mrr)} MT`} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-900/5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[.18em] text-graphite-400">Receita · últimos 6 meses</div>
                <div className="mt-1 text-2xl font-extrabold text-navy-950">{formatMT(monthRevenue)}</div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                <TrendingUp className="h-3.5 w-3.5" /> {growth.toFixed(1)}%
              </span>
            </div>
            <div className="mt-4">
              <AreaChart data={series} format={(n) => `${compact(n)} MT`} />
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-900/5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.18em] text-graphite-400">
              <ChartColumn className="h-4 w-4" /> Receita por fonte · este mês
            </div>
            <div className="mt-5">
              <BarList
                items={PRODUCT_ORDER.map((c) => ({ label: PRODUCTS[c].label, value: current[c], hint: liveBy[c] ? `+${compact(liveBy[c])} hoje` : undefined }))}
                format={(n) => `${compact(n)} MT`}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-900/5">
            <div className="text-[11px] font-bold uppercase tracking-[.18em] text-graphite-400">Funil de conversão · do anúncio ao fecho</div>
            <div className="mt-5">
              <Funnel
                steps={[
                  { label: 'Pesquisas', value: searches },
                  { label: 'Leads', value: leadsTotal },
                  { label: 'Qualificados', value: qualified },
                  { label: 'Visitas', value: visitsN },
                  { label: 'Negócios', value: dealsN },
                ]}
              />
            </div>
            <p className="mt-4 text-xs text-graphite-500">A percentagem à direita mostra a conversão face à etapa anterior.</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-900/5">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-[.18em] text-graphite-400">Actividade recente</div>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Ao vivo
              </span>
            </div>
            <ul className="mt-4 divide-y divide-navy-900/5">
              {activity.map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold-50 text-gold-700">
                    <a.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-navy-950">{a.title}</div>
                    <div className="truncate text-xs text-graphite-500">
                      {a.sub} · {relativeTime(a.at)}
                    </div>
                  </div>
                  {a.amount !== undefined && <div className="shrink-0 text-sm font-extrabold text-navy-950">{formatMT(a.amount)}</div>}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-900/5">
            <div className="text-[11px] font-bold uppercase tracking-[.18em] text-graphite-400">Bairros com mais procura</div>
            <div className="mt-5">
              <BarList items={zoneDemand.map(([label, value]) => ({ label, value }))} format={(n) => `${n} leads`} />
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-900/5">
            <div className="text-[11px] font-bold uppercase tracking-[.18em] text-graphite-400">Métodos de pagamento</div>
            <div className="mt-5">
              <BarList items={methodMix} format={(n) => `${n} transacções`} />
            </div>
            <p className="mt-4 text-xs text-graphite-500">Carteiras móveis dominam; PayPal capta a diáspora; transferência para comissões.</p>
          </div>
          <div className="flex flex-col justify-between rounded-3xl bg-linear-to-br from-gold-200 to-gold-400 p-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[.18em] text-navy-900/70">Operações</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/60 p-4">
                  <Building className="h-5 w-5 text-navy-900" />
                  <div className="mt-2 text-2xl font-extrabold text-navy-950">{published}</div>
                  <div className="text-xs font-semibold text-navy-900/70">publicados</div>
                </div>
                <div className="rounded-2xl bg-white/60 p-4">
                  <ShieldCheck className="h-5 w-5 text-navy-900" />
                  <div className="mt-2 text-2xl font-extrabold text-navy-950">{pendingValidation}</div>
                  <div className="text-xs font-semibold text-navy-900/70">por validar</div>
                </div>
              </div>
            </div>
            <Link to="/admin" className={btn('navy', 'md', 'mt-5')}>
              <Rocket className="h-4 w-4" /> Abrir fila de validação <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <RevenueSimulator />
      </div>
    </div>
  );
}
