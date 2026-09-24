import { Link, useSearchParams } from 'react-router-dom';
import {
  CalendarCheck,
  CalendarDays,
  Check,
  Clock,
  Headphones,
  Heart,
  LockOpen,
  MessageCircle,
  Phone,
  Receipt,
  Search,
  Video,
  X,
} from 'lucide-react';
import { useStore } from '../store/store';
import { useTitle } from '../hooks/useTitle';
import PropertyCard from '../components/PropertyCard';
import { EmptyState, PageHeader, StatusPill, Tabs, btn } from '../components/ui';
import { DEMO_USER, METHOD_LABEL } from '../lib/constants';
import { FALLBACK_IMG } from '../data/images';
import { cn, downloadICS, formatDate, formatDateTime, formatMT, priceLabel, relativeTime, waLink } from '../lib/utils';

type CTab = 'visitas' | 'favoritos' | 'pesquisas' | 'contactos' | 'pagamentos';
const TABS: CTab[] = ['visitas', 'favoritos', 'pesquisas', 'contactos', 'pagamentos'];

export default function ClientArea() {
  useTitle('A Minha Área — KEYHOUSE PROPERTIES');
  const s = useStore();
  const [params, setParams] = useSearchParams();
  const t = params.get('tab') as CTab | null;
  const tab: CTab = t && TABS.includes(t) ? t : 'visitas';
  const setTab = (x: CTab) => setParams({ tab: x }, { replace: true });

  const myVisits = s.visits.filter((v) => v.mine && v.status !== 'cancelada').sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const favs = s.favorites.map((id) => s.properties.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p);
  const unlockedProps = s.unlocked.map((id) => s.properties.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p);
  const myPayments = s.payments.filter((p) => p.live);
  const myConcierge = s.concierge.filter((c) => c.mine);

  return (
    <div>
      <PageHeader eyebrow="A Minha Área" title={`Olá, ${DEMO_USER.name.split(' ')[0]}`} microcopy="Acompanhe os seus interesses.">
        <div className="mt-8 grid max-w-3xl grid-cols-3 gap-3">
          {[
            [myVisits.length, 'visitas'],
            [favs.length, 'favoritos'],
            [s.searches.length, 'pesquisas guardadas'],
          ].map(([n, l]) => (
            <div key={l as string} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-extrabold text-white">{n}</div>
              <div className="text-xs text-white/60">{l}</div>
            </div>
          ))}
        </div>
      </PageHeader>

      <div className="container-kh py-8 pb-20">
        <Tabs
          items={[
            { id: 'visitas' as CTab, label: 'Visitas agendadas', count: myVisits.length, icon: <CalendarCheck className="h-4 w-4" /> },
            { id: 'favoritos' as CTab, label: 'Favoritos', count: favs.length, icon: <Heart className="h-4 w-4" /> },
            { id: 'pesquisas' as CTab, label: 'Histórico de pesquisas', count: s.searches.length, icon: <Search className="h-4 w-4" /> },
            { id: 'contactos' as CTab, label: 'Contactos', count: unlockedProps.length, icon: <LockOpen className="h-4 w-4" /> },
            { id: 'pagamentos' as CTab, label: 'Pagamentos', count: myPayments.length, icon: <Receipt className="h-4 w-4" /> },
          ]}
          value={tab}
          onChange={setTab}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            {tab === 'visitas' &&
              (myVisits.length === 0 ? (
                <EmptyState
                  icon={<CalendarCheck className="h-6 w-6" />}
                  title="Ainda não marcou visitas"
                  text="Encontre um imóvel, responda a 4 perguntas e agende em menos de um minuto."
                  action={
                    <Link to="/imoveis" className={btn('gold')}>
                      Explorar imóveis
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {myVisits.map((v) => {
                    const p = s.properties.find((x) => x.id === v.propertyId);
                    if (!p) return null;
                    const confirmed = ['confirmada', 'realizada', 'fechada'].includes(v.status);
                    const reminder = new Date(`${v.date}T09:00:00`);
                    reminder.setDate(reminder.getDate() - 1);
                    const steps = [
                      ['Pedido enviado', true],
                      ['Confirmada pelo anunciante', confirmed],
                      ['Realizada', v.status === 'realizada' || v.status === 'fechada'],
                    ] as const;
                    return (
                      <div key={v.id} className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-navy-900/5">
                        <div className="flex flex-col sm:flex-row">
                          <Link to={`/imovel/${p.id}`} className="relative h-44 sm:h-auto sm:w-56 sm:shrink-0">
                            <img src={p.photos[0] || FALLBACK_IMG} alt="" className="h-full w-full object-cover" />
                          </Link>
                          <div className="flex-1 p-5">
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusPill status={v.status} />
                              {v.mode === 'video' && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-700">
                                  <Video className="h-3.5 w-3.5" /> Videochamada
                                </span>
                              )}
                            </div>
                            <Link to={`/imovel/${p.id}`} className="mt-2 block font-bold text-navy-950 hover:underline">
                              {p.title}
                            </Link>
                            <div className="text-sm text-graphite-500">
                              {p.neighborhood}, {p.city} · {priceLabel(p)}
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-sm font-bold capitalize text-navy-950">
                              <CalendarDays className="h-4 w-4 text-gold-600" />
                              {formatDate(v.date, { weekday: 'long', day: 'numeric', month: 'long' })} · {v.time}
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                              {steps.map(([label, ok], i) => (
                                <div key={label} className="flex flex-1 items-center gap-2">
                                  <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold', ok ? 'bg-emerald-500 text-white' : 'bg-navy-900/5 text-graphite-400')}>
                                    {ok ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                                  </span>
                                  <span className={cn('hidden text-[11px] font-semibold sm:block', ok ? 'text-navy-950' : 'text-graphite-400')}>{label}</span>
                                  {i < steps.length - 1 && <span className="h-px flex-1 bg-navy-900/10" />}
                                </div>
                              ))}
                            </div>
                            {confirmed ? (
                              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-sm ring-1 ring-emerald-200">
                                <span className="font-semibold text-emerald-800">Contacto libertado:</span>
                                <a href={`tel:${p.advertiser.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1 font-bold text-navy-950">
                                  <Phone className="h-3.5 w-3.5" /> {p.advertiser.phone}
                                </a>
                                <a
                                  href={waLink(p.advertiser.phone, `Olá! Confirmo a visita a "${p.title}" no dia ${formatDate(v.date)} às ${v.time}.`)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-emerald-700"
                                >
                                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                                </a>
                              </div>
                            ) : (
                              <div className="mt-4 flex items-center gap-2 text-xs text-graphite-500">
                                <Clock className="h-3.5 w-3.5" /> A aguardar confirmação do anunciante (até 24h). O contacto é libertado após confirmação.
                              </div>
                            )}
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <button onClick={() => downloadICS(v, p)} className={btn('outline', 'sm')}>
                                <CalendarDays className="h-4 w-4" /> Adicionar ao calendário
                              </button>
                              <span className="text-xs text-graphite-400">
                                Lembrete WhatsApp: {formatDate(reminder.toISOString(), { weekday: 'short', day: 'numeric', month: 'short' })} às 09:00
                              </span>
                              {v.status === 'pendente' && (
                                <button
                                  onClick={() => {
                                    s.updateVisit(v.id, { status: 'cancelada' });
                                    s.notify('Visita cancelada.', 'info');
                                  }}
                                  className={btn('ghost', 'sm', 'ml-auto text-rose-600')}
                                >
                                  <X className="h-4 w-4" /> Cancelar
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

            {tab === 'favoritos' &&
              (favs.length === 0 ? (
                <EmptyState icon={<Heart className="h-6 w-6" />} title="Sem favoritos" text="Toque no coração de qualquer imóvel para o guardar aqui." />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {favs.map((p) => (
                    <PropertyCard key={p.id} p={p} />
                  ))}
                </div>
              ))}

            {tab === 'pesquisas' &&
              (s.searches.length === 0 ? (
                <EmptyState icon={<Search className="h-6 w-6" />} title="Sem pesquisas guardadas" text="Guarde uma pesquisa para ser avisado de novos imóveis." />
              ) : (
                <div className="space-y-3">
                  {s.searches.map((q) => (
                    <div key={q.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-navy-900/5">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-950 text-gold-300">
                        <Search className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-bold text-navy-950">{q.label}</div>
                        <div className="text-xs text-graphite-500">
                          {q.results} resultados · {relativeTime(q.createdAt)} · alertas activos
                        </div>
                      </div>
                      <Link to={`/imoveis?${q.query}`} className={btn('navy', 'sm')}>
                        Repetir
                      </Link>
                      <button onClick={() => s.removeSearch(q.id)} className="grid h-9 w-9 place-items-center rounded-full text-graphite-400 hover:bg-navy-900/5" aria-label="Remover">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ))}

            {tab === 'contactos' &&
              (unlockedProps.length === 0 ? (
                <EmptyState
                  icon={<LockOpen className="h-6 w-6" />}
                  title="Sem contactos desbloqueados"
                  text="Os contactos são libertados após a confirmação da visita — ou imediatamente por 200 MT na página do imóvel."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {unlockedProps.map((p) => (
                    <div key={p.id} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-900/5">
                      <div className="truncate text-xs text-graphite-500">{p.title}</div>
                      <div className="mt-1 font-bold text-navy-950">{p.advertiser.name}</div>
                      <div className="mt-3 flex gap-2">
                        <a href={`tel:${p.advertiser.phone.replace(/\s/g, '')}`} className={btn('navy', 'sm', 'flex-1')}>
                          <Phone className="h-4 w-4" /> {p.advertiser.phone}
                        </a>
                        <a href={waLink(p.advertiser.phone, `Olá! Vi o imóvel "${p.title}" na KEYHOUSE.`)} target="_blank" rel="noreferrer" className={btn('outline', 'sm')}>
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {tab === 'pagamentos' &&
              (myPayments.length === 0 ? (
                <EmptyState icon={<Receipt className="h-6 w-6" />} title="Sem pagamentos nesta sessão" text="Os recibos dos serviços que adquirir aparecem aqui." />
              ) : (
                <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-navy-900/5">
                  {myPayments.map((p) => (
                    <div key={p.id} className="flex items-center gap-4 border-b border-navy-900/5 p-4 last:border-0">
                      <Receipt className="h-5 w-5 shrink-0 text-gold-600" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-navy-950">{p.items.map((i) => i.label).join(' + ')}</div>
                        <div className="text-xs text-graphite-500">
                          {p.reference} · {METHOD_LABEL[p.method]} · {formatDateTime(p.createdAt)}
                        </div>
                      </div>
                      <div className="font-extrabold text-navy-950">{formatMT(p.total)}</div>
                    </div>
                  ))}
                </div>
              ))}
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-navy-950 p-6 text-white">
              <Headphones className="h-7 w-7 text-gold-300" />
              <div className="mt-3 text-lg font-extrabold">Concierge Imobiliário</div>
              <p className="mt-1 text-sm text-white/65">Sem tempo para procurar? Um consultor sénior encontra, visita e negoceia por si.</p>
              <Link to="/planos#concierge" className={btn('gold', 'md', 'mt-4 w-full')}>
                Pedir Concierge · 5.000 MT
              </Link>
            </div>
            {myConcierge.length > 0 && (
              <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-900/5">
                <div className="text-[11px] font-bold uppercase tracking-[.18em] text-graphite-400">Os meus pedidos Concierge</div>
                <ul className="mt-3 space-y-3">
                  {myConcierge.map((c) => (
                    <li key={c.id} className="text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-bold text-navy-950">{c.budget}</span>
                        <StatusPill status={c.status} />
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-graphite-500">{c.brief}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
