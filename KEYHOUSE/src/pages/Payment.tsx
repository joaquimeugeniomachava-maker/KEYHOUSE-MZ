import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Building,
  CircleCheck,
  Copy,
  Crown,
  Globe,
  Headphones,
  Info,
  Landmark,
  LoaderCircle,
  Lock,
  Printer,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { useStore } from '../store/store';
import { useTitle } from '../hooks/useTitle';
import { btn, inputCls } from '../components/ui';
import { BRAND, DEMO_USER, METHOD_LABEL, PRODUCTS, RATES } from '../lib/constants';
import type { Payment as PaymentT, PaymentItem, PaymentMethod, ProductCode } from '../lib/types';
import { cn, formatDate, formatDateTime, formatMT, formatMoney, isMzMobile, maskName, paymentReference, uid } from '../lib/utils';

const METHODS: { id: PaymentMethod; name: string; sub: string; color: string }[] = [
  { id: 'mpesa', name: 'M-Pesa', sub: 'Vodacom · 84 / 85', color: '#E60000' },
  { id: 'emola', name: 'e-Mola', sub: 'Movitel · 86 / 87', color: '#F7941D' },
  { id: 'paypal', name: 'PayPal', sub: 'Diáspora · cartão internacional', color: '#0070E0' },
  { id: 'banco', name: 'Transferência', sub: 'Montantes elevados · NIB', color: '#0E1D3A' },
];

export default function Payment() {
  useTitle('Pagamento Seguro — KEYHOUSE PROPERTIES');
  const [params] = useSearchParams();
  const s = useStore();
  const [method, setMethod] = useState<PaymentMethod>('mpesa');
  const [phone, setPhone] = useState('');
  const [stage, setStage] = useState<'form' | 'processing' | 'success'>('form');
  const [phase, setPhase] = useState(0);
  const [receipt, setReceipt] = useState<PaymentT | null>(null);
  const [pendingRef] = useState(paymentReference);
  const done = useRef(false);

  const codes = useMemo(
    () => (params.get('itens') || '').split(',').filter((c): c is ProductCode => c in PRODUCTS),
    [params],
  );
  const items: PaymentItem[] = useMemo(() => {
    const defaultRef = params.get('ref') || undefined;
    return codes.map((code) => {
      const ref = params.get(code) || defaultRef;
      if (code === 'comissao') {
        const d = s.deals.find((x) => x.id === ref);
        return {
          code,
          label: `${PRODUCTS.comissao.label}${d ? ` (${d.commissionPct}% + IVA)` : ''}`,
          amount: d ? d.commissionMZN + d.vatMZN : 0,
          ref,
        };
      }
      return { code, label: PRODUCTS[code].label, amount: PRODUCTS[code].price, ref };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codes, params]);
  const total = items.reduce((a, i) => a + i.amount, 0);
  const usd = total / RATES.USD;

  const contextFor = (it: PaymentItem): string | null => {
    if (!it.ref) return null;
    const prop = s.properties.find((p) => p.id === it.ref);
    if (prop) return prop.title;
    const lead = s.leads.find((l) => l.id === it.ref);
    if (lead) return `${maskName(lead.name)} · ${s.properties.find((p) => p.id === lead.propertyId)?.title ?? ''}`;
    const visit = s.visits.find((v) => v.id === it.ref);
    if (visit) return `Visita ${formatDate(visit.date, { day: '2-digit', month: 'short' })} às ${visit.time}`;
    const deal = s.deals.find((d) => d.id === it.ref);
    if (deal) return s.properties.find((p) => p.id === deal.propertyId)?.title ?? 'Negócio';
    const c = s.concierge.find((x) => x.id === it.ref);
    if (c) return `Pedido de ${c.name}`;
    return null;
  };

  const areaFor = (): string => {
    const it = items.find((i) => i.ref);
    if (!it?.ref) return s.role === 'intermediario' ? '/intermediario' : '/proprietario';
    const propId =
      s.properties.find((p) => p.id === it.ref)?.id ??
      s.leads.find((l) => l.id === it.ref)?.propertyId ??
      s.visits.find((v) => v.id === it.ref)?.propertyId ??
      s.deals.find((d) => d.id === it.ref)?.propertyId;
    const prop = s.properties.find((p) => p.id === propId);
    return prop?.advertiser.id === 'me-broker' ? '/intermediario' : '/proprietario';
  };

  const isWallet = method === 'mpesa' || method === 'emola';
  const phoneOk = method === 'mpesa' ? isMzMobile(phone, ['84', '85']) : method === 'emola' ? isMzMobile(phone, ['86', '87']) : true;
  const canPay = total > 0 && phoneOk;

  useEffect(() => {
    if (stage !== 'processing') return;
    const t1 = setTimeout(() => setPhase(1), 900);
    const t2 = setTimeout(() => setPhase(2), 2700);
    const t3 = setTimeout(() => {
      if (done.current) return;
      done.current = true;
      const digits = phone.replace(/\D/g, '').slice(-9);
      const payer =
        method === 'paypal'
          ? `${DEMO_USER.name} · PayPal`
          : method === 'banco'
            ? DEMO_USER.name
            : `${DEMO_USER.name} · +258 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
      const pay: PaymentT = {
        id: uid('pay'),
        reference: pendingRef,
        items,
        total,
        method,
        payer,
        status: 'pago',
        createdAt: new Date().toISOString(),
        live: true,
      };
      s.applyPayment(pay);
      setReceipt(pay);
      setStage('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const nextStep = (() => {
    const c = items.map((i) => i.code);
    const area = areaFor();
    if (c.includes('publicacao')) return { label: 'Acompanhar validação', to: `${area}?tab=imoveis` };
    if (c.includes('contacto')) return { label: 'Ver contacto do anunciante', to: `/imovel/${items.find((i) => i.code === 'contacto')?.ref ?? ''}` };
    if (c.includes('visita')) return { label: 'Ver visitas confirmadas', to: `${area}?tab=visitas` };
    if (c.includes('lead')) return { label: 'Ver contacto do lead', to: `${area}?tab=leads` };
    if (c.includes('comissao')) return { label: 'Ver negócios', to: `${area}?tab=negocios` };
    if (c.includes('destaque')) return { label: 'Ver os meus imóveis', to: `${area}?tab=imoveis` };
    if (c.includes('intermediario') || c.includes('agencia')) return { label: 'Abrir Painel do Intermediário', to: '/intermediario' };
    if (c.includes('concierge')) return { label: 'Ir para a minha área', to: '/cliente' };
    return { label: 'Voltar ao início', to: '/' };
  })();

  if (!items.length || total <= 0) {
    return (
      <div className="container-kh py-20">
        <div className="mx-auto max-w-2xl text-center">
          <Lock className="mx-auto h-10 w-10 text-gold-600" />
          <h1 className="mt-4 text-3xl font-extrabold text-navy-950">Pagamento Seguro</h1>
          <p className="mt-2 font-serif text-xl italic text-graphite-500">Pague com M-Pesa ou Emola.</p>
          <p className="mt-4 text-graphite-500">Nenhum serviço seleccionado. Escolha um dos planos abaixo:</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {(
              [
                ['intermediario', Crown],
                ['agencia', Building],
                ['concierge', Headphones],
              ] as const
            ).map(([code, Icon]) => (
              <Link key={code} to={`/pagamento?itens=${code}`} className="rounded-2xl bg-white p-5 text-left shadow-soft ring-1 ring-navy-900/5 hover:ring-gold-400">
                <Icon className="h-6 w-6 text-gold-600" />
                <div className="mt-3 font-bold text-navy-950">{PRODUCTS[code].label}</div>
                <div className="text-sm text-graphite-500">
                  {formatMT(PRODUCTS[code].price)} {PRODUCTS[code].unit}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'success' && receipt) {
    return (
      <div className="container-kh py-12 sm:py-16">
        <div className="mx-auto max-w-xl">
          <div className="print-area overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-navy-900/5">
            <div className="bg-navy-950 px-8 py-8 text-center text-white">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-linear-to-b from-gold-300 to-gold-500 text-navy-950 shadow-gold">
                <CircleCheck className="h-8 w-8" />
              </div>
              <h1 className="mt-4 text-2xl font-extrabold">Pagamento confirmado</h1>
              <p className="mt-1 text-sm text-white/65">Recibo de demonstração · {BRAND.name}</p>
            </div>
            <div className="p-8">
              <dl className="space-y-2.5 text-sm">
                {[
                  ['Referência', receipt.reference],
                  ['Data', formatDateTime(receipt.createdAt)],
                  ['Método', METHOD_LABEL[receipt.method]],
                  ['Pagador', receipt.payer],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-graphite-500">{k}</dt>
                    <dd className="text-right font-semibold text-navy-950">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="my-5 border-t border-dashed border-navy-900/15" />
              <ul className="space-y-2 text-sm">
                {receipt.items.map((it, i) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span className="text-navy-950">{it.label}</span>
                    <span className="font-semibold text-navy-950">{formatMT(it.amount)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-navy-900/10 pt-4">
                <span className="font-bold text-navy-950">Total pago</span>
                <span className="text-xl font-extrabold text-navy-950">{formatMT(receipt.total)}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => window.print()} className={btn('outline', 'lg', 'sm:flex-1')}>
              <Printer className="h-4 w-4" /> Descarregar recibo
            </button>
            <Link to={nextStep.to} className={btn('gold', 'lg', 'sm:flex-[1.4]')}>
              {nextStep.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const active = METHODS.find((m) => m.id === method)!;
  const phaseText =
    phase === 0
      ? 'A iniciar transacção segura…'
      : phase === 1
        ? method === 'paypal'
          ? 'A abrir a página segura do PayPal…'
          : method === 'banco'
            ? 'A procurar a referência da transferência…'
            : 'Aprove o pedido no seu telemóvel'
        : 'A confirmar pagamento…';

  return (
    <div className="container-kh py-10 sm:py-14">
      <div className="mb-8">
        <div className="text-[11px] font-bold uppercase tracking-[.25em] text-gold-600">Pagamento seguro</div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">Finalizar pagamento</h1>
        <p className="mt-1 font-serif text-xl italic text-graphite-500">Pague com M-Pesa ou Emola.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-900/5 sm:p-8">
          {stage === 'form' ? (
            <>
              <div className="mb-6 flex items-start gap-3 rounded-2xl bg-gold-50 p-4 text-[13px] leading-relaxed text-navy-900 ring-1 ring-gold-200">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" />
                <p>
                  <b>Modo demonstração.</b> Nenhum valor é cobrado e nenhum dado de pagamento é enviado. Lembre-se: a KEYHOUSE <b>nunca</b> lhe pede o
                  PIN do M-Pesa ou do e-Mola, nem a senha do PayPal.
                </p>
              </div>

              <div className="text-sm font-bold text-navy-950">Método de pagamento</div>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      'rounded-2xl border-2 p-4 text-left transition',
                      method === m.id ? 'border-navy-950 bg-ivory' : 'border-navy-900/10 hover:border-navy-900/30',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: m.color }} />
                      <span className="font-extrabold text-navy-950">{m.name}</span>
                    </span>
                    <span className="mt-1 block text-[11px] leading-tight text-graphite-500">{m.sub}</span>
                  </button>
                ))}
              </div>

              <div className="mt-7">
                {isWallet && (
                  <label className="block">
                    <span className="mb-1.5 block text-[13px] font-semibold text-navy-900">Número {active.name}</span>
                    <div className="flex">
                      <span className="flex h-12 items-center rounded-l-xl border border-r-0 border-navy-900/10 bg-ivory px-4 text-sm font-bold text-navy-950">+258</span>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ''))}
                        inputMode="tel"
                        placeholder={method === 'mpesa' ? '84 123 4567' : '86 123 4567'}
                        className={cn(inputCls(phone.length > 3 && !phoneOk), 'rounded-l-none')}
                      />
                    </div>
                    <span className={cn('mt-1.5 block text-xs', phone.length > 3 && !phoneOk ? 'font-medium text-rose-600' : 'text-graphite-400')}>
                      {phone.length > 3 && !phoneOk
                        ? `Número ${active.name} inválido — deve começar por ${method === 'mpesa' ? '84 ou 85' : '86 ou 87'} e ter 9 dígitos.`
                        : 'Receberá um pedido de confirmação no seu telemóvel. Aprove-o directamente no telemóvel — o PIN nunca é introduzido neste site.'}
                    </span>
                  </label>
                )}

                {method === 'paypal' && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-2xl bg-ivory p-4 text-sm">
                      <Globe className="mt-0.5 h-5 w-5 shrink-0 text-[#0070E0]" />
                      <span className="text-graphite-600">
                        Será encaminhado para a <b className="text-navy-950">página segura do PayPal</b> para aprovar o pagamento. A KEYHOUSE não vê nem
                        guarda os seus dados PayPal.
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-navy-900/10 px-4 py-3 text-sm">
                      <span className="text-graphite-500">
                        Valor em dólares <span className="text-xs">(1 USD = {RATES.USD} MT)</span>
                      </span>
                      <b className="text-navy-950">{formatMoney(usd, 'USD')}</b>
                    </div>
                    <p className="text-xs text-graphite-400">Ideal para clientes na diáspora — cartão internacional ou saldo PayPal.</p>
                  </div>
                )}

                {method === 'banco' && (
                  <div className="rounded-2xl bg-ivory p-5 text-sm">
                    <div className="flex items-center gap-2 font-bold text-navy-950">
                      <Landmark className="h-4 w-4 text-gold-600" /> Dados para transferência
                    </div>
                    <dl className="mt-3 space-y-2">
                      {[
                        ['Titular', 'KEYHOUSE PROPERTIES, LDA'],
                        ['NIB', '0000 0000 0000 0000 0000 0'],
                        ['Referência obrigatória', pendingRef],
                        ['Montante', formatMT(total)],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4">
                          <dt className="text-graphite-500">{k}</dt>
                          <dd className="flex items-center gap-1.5 text-right font-mono font-semibold text-navy-950">
                            {v}
                            {k === 'Referência obrigatória' && (
                              <button
                                onClick={() => {
                                  navigator.clipboard?.writeText(v).then(() => s.notify('Referência copiada.')).catch(() => undefined);
                                }}
                                aria-label="Copiar referência"
                              >
                                <Copy className="h-3.5 w-3.5 text-graphite-400" />
                              </button>
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-3 text-xs text-graphite-500">A confirmação é automática quando a referência é identificada.</p>
                  </div>
                )}
              </div>

              <button disabled={!canPay} onClick={() => setStage('processing')} className={btn('gold', 'lg', 'mt-8 w-full')}>
                <Lock className="h-4 w-4" />
                {method === 'banco'
                  ? 'Já fiz a transferência'
                  : method === 'paypal'
                    ? `Continuar para o PayPal · ${formatMoney(usd, 'USD')}`
                    : `Pagar ${formatMT(total)}`}
              </button>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-graphite-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Ligação segura (HTTPS)
                </span>
                <span className="flex items-center gap-1.5">
                  <CircleCheck className="h-3.5 w-3.5 text-emerald-600" /> Recibo imediato
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-6 text-center">
              {isWallet ? (
                <>
                  <div className="w-64 rounded-[2.2rem] border-[10px] border-navy-950 bg-navy-950 shadow-lift">
                    <div className="rounded-[1.5rem] bg-white px-5 pb-6 pt-8 text-left">
                      <div className="flex items-center gap-2 text-sm font-extrabold" style={{ color: active.color }}>
                        <Smartphone className="h-4 w-4" /> {active.name}
                      </div>
                      <p className="mt-3 text-[13px] leading-snug text-navy-950">
                        Pedido de pagamento de <b>{formatMT(total)}</b> para <b>{BRAND.name}</b>.
                      </p>
                      <p className="mt-1 text-[11px] text-graphite-500">Ref: {pendingRef}</p>
                      <div className="mt-4 text-[11px] font-semibold text-graphite-500">
                        {phase < 2 ? 'A aguardar a sua aprovação…' : 'Aprovado ✓'}
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-900/10">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${phase === 0 ? 20 : phase === 1 ? 60 : 100}%`, background: active.color }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[.16em] text-graphite-400">Simulação do ecrã do telemóvel</p>
                </>
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-full" style={{ background: `${active.color}15` }}>
                  {method === 'paypal' ? <Globe className="h-9 w-9" style={{ color: active.color }} /> : <Landmark className="h-9 w-9 text-navy-950" />}
                </div>
              )}
              <div className="mt-8 flex items-center gap-2 text-lg font-extrabold text-navy-950">
                <LoaderCircle className="h-5 w-5 animate-spin text-gold-600" />
                {phaseText}
              </div>
              <p className="mt-2 max-w-sm text-sm text-graphite-500">Não feche esta página. A confirmação chega em segundos.</p>
            </div>
          )}
        </div>

        <aside>
          <div className="sticky top-28 rounded-3xl bg-navy-950 p-6 text-white sm:p-7">
            <div className="text-[11px] font-bold uppercase tracking-[.2em] text-gold-300">Resumo do pedido</div>
            <ul className="mt-5 space-y-4">
              {items.map((it, i) => {
                const ctx = contextFor(it);
                return (
                  <li key={i} className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-semibold">{it.label}</div>
                      {ctx && <div className="truncate text-xs text-white/50">{ctx}</div>}
                      <div className="text-[11px] text-gold-300/80">{PRODUCTS[it.code].when}</div>
                    </div>
                    <div className="shrink-0 font-bold">{formatMT(it.amount)}</div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
              <span className="text-sm text-white/60">Total</span>
              <span className="text-3xl font-extrabold">{formatMT(total)}</span>
            </div>
            <div className="mt-1 text-right text-xs text-white/40">≈ {formatMoney(usd, 'USD')}</div>
            <div className="mt-6 rounded-2xl bg-white/5 p-4 text-xs leading-relaxed text-white/60">
              <ShieldCheck className="mb-1.5 h-4 w-4 text-gold-300" />
              Taxas de publicação reembolsadas se o anúncio for rejeitado. Leads só são cobrados quando aceites. A KEYHOUSE nunca lhe pede PINs ou senhas.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
