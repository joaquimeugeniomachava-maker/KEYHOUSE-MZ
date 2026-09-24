import { useEffect, useMemo, useState } from 'react';
import { Calculator, Copy, FileText, Handshake, Printer, ScrollText } from 'lucide-react';
import type { Deal, Property, Visit } from '../lib/types';
import { useStore } from '../store/store';
import { Field, Modal, Segmented, btn, inputCls } from './ui';
import { BROKER_SHARE, VAT } from '../lib/constants';
import { groupOf } from '../lib/search';
import { cn, formatMT, formatMoney, groupThousands, toMZN, uid } from '../lib/utils';

const clampPct = (n: number) => Math.min(5, Math.max(2, n || 3));

function buildContract(o: {
  p: Property;
  client: string;
  value: number;
  months: number;
  deposit: number;
  pct: number;
}) {
  const { p, client, value, months, deposit, pct } = o;
  const today = new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
  const owner = p.advertiser.type === 'proprietario' ? p.advertiser.name : '[Nome do proprietário]';
  const broker = p.advertiser.type !== 'proprietario' ? `, representada por ${p.advertiser.name}` : '';
  const obj = `${p.type}${p.typology !== 'Não aplicável' ? ` ${p.typology}` : ''}, sito no bairro ${p.neighborhood}, ${p.city}, com a área total de ${groupThousands(p.totalArea)} m² e área útil de ${groupThousands(p.usefulArea)} m²`;
  const foro = p.city === 'Maputo' ? 'Tribunal Judicial da Cidade de Maputo' : `Tribunal Judicial competente da área de ${p.city}`;

  if (p.purpose === 'Venda') {
    return `MINUTA DE CONTRATO-PROMESSA DE COMPRA E VENDA

PRIMEIRO OUTORGANTE (Promitente Vendedor): ${owner}, portador(a) do documento de identificação n.º [__________], NUIT [__________], adiante designado(a) VENDEDOR.
SEGUNDO OUTORGANTE (Promitente Comprador): ${client || '[Nome do cliente]'}, portador(a) do documento de identificação n.º [__________], NUIT [__________], adiante designado(a) COMPRADOR.
INTERMEDIÁRIA: KEYHOUSE PROPERTIES${broker}.

Cláusula 1.ª — Objecto
O VENDEDOR promete vender ao COMPRADOR, que promete comprar, o imóvel: ${obj}, livre de ónus ou encargos${p.hasTitle ? ', com título de propriedade / DUAT regularizado' : ''}.

Cláusula 2.ª — Preço e pagamento
O preço total é de ${formatMoney(value, p.currency)}, pago da seguinte forma:
a) ${deposit}% (${formatMoney((value * deposit) / 100, p.currency)}) a título de sinal e princípio de pagamento, na data de assinatura;
b) O remanescente (${formatMoney((value * (100 - deposit)) / 100, p.currency)}) na data da escritura pública.

Cláusula 3.ª — Escritura
A escritura pública de compra e venda será celebrada no prazo máximo de 90 dias a contar da presente data.

Cláusula 4.ª — Comissão de intermediação
É devida à KEYHOUSE PROPERTIES uma comissão de ${pct}% sobre o valor do negócio, acrescida de IVA à taxa legal, paga pelo VENDEDOR na data da escritura.

Cláusula 5.ª — Incumprimento
O incumprimento pelo COMPRADOR implica a perda do sinal; o incumprimento pelo VENDEDOR obriga à restituição do sinal em dobro.

Cláusula 6.ª — Foro
Para dirimir quaisquer litígios, as partes elegem o foro do ${foro}.

Feito em ${p.city}, aos ${today}, em dois exemplares de igual valor.

O VENDEDOR ______________________        O COMPRADOR ______________________

KEYHOUSE PROPERTIES ______________________`;
  }

  const habit = groupOf(p.type) === 'residencial' ? 'HABITACIONAL' : 'NÃO HABITACIONAL';
  return `MINUTA DE CONTRATO DE ARRENDAMENTO ${habit}

SENHORIO: ${owner}, portador(a) do documento de identificação n.º [__________], NUIT [__________].
ARRENDATÁRIO: ${client || '[Nome do cliente]'}, portador(a) do documento de identificação n.º [__________], NUIT [__________].
INTERMEDIÁRIA: KEYHOUSE PROPERTIES${broker}.

Cláusula 1.ª — Objecto
O SENHORIO dá de arrendamento ao ARRENDATÁRIO o imóvel: ${obj}${p.furnished ? ', mobilado conforme inventário anexo' : ''}.

Cláusula 2.ª — Prazo
O arrendamento é celebrado pelo prazo de ${months} meses, com início em [__/__/____], renovável por iguais períodos salvo denúncia escrita com 60 dias de antecedência.

Cláusula 3.ª — Renda
A renda mensal é de ${formatMoney(value, p.currency)}, paga até ao dia 8 de cada mês por transferência bancária ou carteira móvel. Na assinatura são pagos o primeiro mês de renda e dois meses de caução.

Cláusula 4.ª — Comissão de intermediação
É devida à KEYHOUSE PROPERTIES uma comissão de ${pct}% sobre o valor global do contrato (${months} meses), acrescida de IVA à taxa legal.

Cláusula 5.ª — Conservação
O ARRENDATÁRIO obriga-se a manter o imóvel em bom estado, não podendo realizar obras sem autorização escrita do SENHORIO.

Cláusula 6.ª — Foro
Para dirimir quaisquer litígios, as partes elegem o foro do ${foro}.

Feito em ${p.city}, aos ${today}, em dois exemplares de igual valor.

O SENHORIO ______________________        O ARRENDATÁRIO ______________________

KEYHOUSE PROPERTIES ______________________`;
}

export default function ContractModal({
  open,
  onClose,
  property: p,
  visit,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  property: Property;
  visit?: Visit | null;
  onDone?: () => void;
}) {
  const { addDeal, updateProperty, updateVisit, notify } = useStore();
  const isSale = p.purpose === 'Venda';
  const [tab, setTab] = useState<'calc' | 'minuta'>('calc');
  const [client, setClient] = useState(visit?.clientName ?? '');
  const [value, setValue] = useState(String(p.price));
  const [pct, setPct] = useState(clampPct(p.commission));
  const [months, setMonths] = useState(12);
  const [deposit, setDeposit] = useState(20);

  useEffect(() => {
    if (!open) return;
    setTab('calc');
    setClient(visit?.clientName ?? '');
    setValue(String(p.price));
    setPct(clampPct(p.commission));
  }, [open, visit?.clientName, p.price, p.commission]);

  const v = Number(value) || 0;
  const dealValue = isSale ? v : v * months;
  const dealMZN = toMZN(dealValue, p.currency);
  const commission = (dealMZN * pct) / 100;
  const vat = commission * VAT;
  const hasBroker = p.advertiser.type !== 'proprietario';
  const brokerShare = hasBroker ? commission * BROKER_SHARE : 0;
  const platformShare = commission - brokerShare;
  const text = useMemo(() => buildContract({ p, client, value: v, months, deposit, pct }), [p, client, v, months, deposit, pct]);

  const register = () => {
    const deal: Deal = {
      id: uid('d'),
      propertyId: p.id,
      visitId: visit?.id,
      clientName: client || 'Cliente KEYHOUSE',
      value: dealValue,
      months: isSale ? undefined : months,
      currency: p.currency,
      valueMZN: dealMZN,
      commissionPct: pct,
      commissionMZN: Math.round(commission),
      vatMZN: Math.round(vat),
      brokerShareMZN: Math.round(brokerShare),
      platformShareMZN: Math.round(platformShare),
      status: 'minuta',
      createdAt: new Date().toISOString(),
    };
    addDeal(deal);
    updateProperty(p.id, { status: isSale ? 'vendido' : 'arrendado' });
    if (visit) updateVisit(visit.id, { status: 'fechada' });
    notify('Negócio registado. Minuta gerada e comissão calculada automaticamente.');
    onDone?.();
    onClose();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      notify('Minuta copiada para a área de transferência.');
    } catch {
      notify('Não foi possível copiar. Seleccione o texto manualmente.', 'error');
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="sm:max-w-3xl">
      <div className="border-b border-navy-900/5 bg-navy-950 px-5 pb-5 pt-6 text-white sm:px-8">
        <div className="flex items-center gap-3 pr-10">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-400/15 text-gold-300">
            <Handshake className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-[.2em] text-gold-300">Fecho de negócio</div>
            <div className="truncate font-bold">{p.title}</div>
          </div>
        </div>
        <Segmented
          className="mt-5 bg-white/10"
          options={[
            { value: 'calc', label: 'Comissão' },
            { value: 'minuta', label: 'Minuta de contrato' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      <div className="px-5 py-6 sm:px-8">
        {tab === 'calc' ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <Field label={isSale ? 'Comprador' : 'Arrendatário'}>
                <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Nome do cliente" className={inputCls()} />
              </Field>
              <Field label={isSale ? `Valor final de venda (${p.currency})` : `Renda mensal acordada (${p.currency})`}>
                <input inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))} className={inputCls()} />
              </Field>
              {isSale ? (
                <Field label={`Sinal: ${deposit}%`}>
                  <input type="range" min={10} max={50} step={5} value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} className="w-full accent-gold-500" />
                </Field>
              ) : (
                <Field label={`Duração do contrato: ${months} meses`}>
                  <input type="range" min={6} max={36} step={6} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-gold-500" />
                </Field>
              )}
              <Field label={`Comissão de fecho: ${pct}%`} hint="Intervalo KEYHOUSE: 2% a 5%.">
                <input type="range" min={2} max={5} step={0.5} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-full accent-gold-500" />
              </Field>
            </div>
            <div className="rounded-2xl bg-ivory p-5">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.18em] text-gold-600">
                <Calculator className="h-4 w-4" /> Cálculo automático
              </div>
              <dl className="mt-4 space-y-2.5 text-sm">
                {[
                  ['Valor do negócio', `${formatMoney(dealValue, p.currency)}${p.currency !== 'MZN' ? ` ≈ ${formatMT(dealMZN)}` : ''}`],
                  [`Comissão (${pct}%)`, formatMT(commission)],
                  ['IVA (16%)', formatMT(vat)],
                ].map(([k, val]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-graphite-500">{k}</dt>
                    <dd className="text-right font-semibold text-navy-950">{val}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4 border-t border-navy-900/10 pt-3">
                  <dt className="font-bold text-navy-950">Total a facturar</dt>
                  <dd className="text-lg font-extrabold text-navy-950">{formatMT(commission + vat)}</dd>
                </div>
              </dl>
              <div className="mt-5 grid grid-cols-2 gap-2 text-center">
                <div className={cn('rounded-xl p-3', hasBroker ? 'bg-white' : 'bg-white/50 opacity-60')}>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-graphite-400">Intermediário {hasBroker ? '60%' : '—'}</div>
                  <div className="mt-1 font-extrabold text-navy-950">{formatMT(brokerShare)}</div>
                </div>
                <div className="rounded-xl bg-navy-950 p-3 text-white">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gold-300">KEYHOUSE {hasBroker ? '40%' : '100%'}</div>
                  <div className="mt-1 font-extrabold">{formatMT(platformShare)}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="print-area max-h-[46vh] overflow-y-auto whitespace-pre-wrap rounded-2xl border border-navy-900/10 bg-ivory p-5 font-serif text-[15px] leading-relaxed text-navy-950">
              {text}
            </div>
            <p className="mt-3 flex items-start gap-2 text-xs text-graphite-500">
              <ScrollText className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Minuta indicativa gerada automaticamente. Deve ser revista por jurista ou notário antes da assinatura.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-navy-900/5 pt-5 sm:flex-row sm:justify-between">
          <div className="flex gap-2">
            <button onClick={copy} className={btn('outline', 'md')}>
              <Copy className="h-4 w-4" /> Copiar
            </button>
            <button
              onClick={() => {
                setTab('minuta');
                setTimeout(() => window.print(), 150);
              }}
              className={btn('outline', 'md')}
            >
              <Printer className="h-4 w-4" /> Imprimir / PDF
            </button>
          </div>
          <button onClick={register} disabled={!v} className={btn('gold', 'md')}>
            <FileText className="h-4 w-4" /> Registar negócio · {formatMT(commission + vat)}
          </button>
        </div>
      </div>
    </Modal>
  );
}
