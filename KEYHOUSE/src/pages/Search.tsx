import { useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Headphones, Heart, LayoutGrid, Map as MapIcon, SearchX, SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../store/store';
import { useTitle } from '../hooks/useTitle';
import PropertyCard from '../components/PropertyCard';
import MapView from '../components/MapView';
import { EmptyState, Select, btn, inputCls } from '../components/ui';
import { CITIES, CONDITIONS, PROPERTY_TYPES, TYPE_GROUPS, TYPOLOGIES, type TypeGroup } from '../lib/constants';
import { SORTS, applyFilters, describeFilters, parseFilters, type Filters } from '../lib/search';
import { cn, compact, pinLabel } from '../lib/utils';

type Setter = (key: string, value: string | null) => void;

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
      {children}
    </button>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="flex w-full items-center justify-between py-2 text-sm font-semibold text-navy-950">
      {label}
      <span className={cn('relative h-6 w-11 rounded-full transition', on ? 'bg-gold-500' : 'bg-navy-900/15')}>
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
      </span>
    </button>
  );
}

function FiltersPanel({ f, set, clear }: { f: Filters; set: Setter; clear: () => void }) {
  const label = 'mb-2 block text-[11px] font-bold uppercase tracking-[.16em] text-graphite-400';
  const pricePresets: [number, string][] =
    f.finalidade === 'Arrendamento'
      ? [
          [30000, '30k'],
          [80000, '80k'],
          [250000, '250k'],
          [600000, '600k'],
        ]
      : [
          [5000000, '5M'],
          [15000000, '15M'],
          [40000000, '40M'],
          [100000000, '100M'],
        ];
  return (
    <div className="space-y-6 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-900/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-extrabold text-navy-950">
          <SlidersHorizontal className="h-4 w-4 text-gold-600" /> Filtros
        </div>
        <button onClick={clear} className="text-xs font-bold text-gold-700 hover:underline">
          Limpar tudo
        </button>
      </div>
      <div>
        <span className={label}>Finalidade</span>
        <div className="flex flex-wrap gap-2">
          {[
            ['', 'Todos'],
            ['Venda', 'Comprar'],
            ['Arrendamento', 'Arrendar'],
          ].map(([v, l]) => (
            <Chip key={l} active={f.finalidade === v} onClick={() => set('finalidade', v)}>
              {l}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <span className={label}>Zona ou palavra-chave</span>
        <input value={f.q} onChange={(e) => set('q', e.target.value)} placeholder="Ex.: Sommerschield, Marginal…" className={inputCls()} />
      </div>
      <div>
        <span className={label}>Cidade</span>
        <Select value={f.cidade} onChange={(e) => set('cidade', e.target.value)}>
          <option value="">Todas as cidades</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <span className={label}>Categoria</span>
        <div className="flex flex-wrap gap-2">
          <Chip active={!f.categoria} onClick={() => set('categoria', null)}>
            Todas
          </Chip>
          {(Object.keys(TYPE_GROUPS) as TypeGroup[]).map((g) => (
            <Chip key={g} active={f.categoria === g} onClick={() => set('categoria', g)}>
              {TYPE_GROUPS[g]}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <span className={label}>Tipo de imóvel</span>
        <Select value={f.tipo} onChange={(e) => set('tipo', e.target.value)}>
          <option value="">Todos os tipos (20)</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t.label} value={t.label}>
              {t.label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <span className={label}>Tipologia</span>
        <Select value={f.tipologia} onChange={(e) => set('tipologia', e.target.value)}>
          <option value="">Todas</option>
          {TYPOLOGIES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <span className={label}>Preço (MT{f.finalidade === 'Arrendamento' ? '/mês' : ''})</span>
        <div className="grid grid-cols-2 gap-2">
          <input inputMode="numeric" placeholder="Mínimo" value={f.min ?? ''} onChange={(e) => set('min', e.target.value.replace(/\D/g, ''))} className={inputCls()} />
          <input inputMode="numeric" placeholder="Máximo" value={f.max ?? ''} onChange={(e) => set('max', e.target.value.replace(/\D/g, ''))} className={inputCls()} />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {pricePresets.map(([v, l]) => (
            <Chip key={v} active={f.max === v} onClick={() => set('max', String(v))}>
              até {l}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <span className={label}>Quartos</span>
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <Chip key={n} active={f.quartos === n} onClick={() => set('quartos', n ? String(n) : null)}>
              {n === 0 ? 'Todos' : `${n}+`}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <span className={label}>Estado de conservação</span>
        <Select value={f.estado} onChange={(e) => set('estado', e.target.value)}>
          <option value="">Qualquer estado</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>
      <div className="divide-y divide-navy-900/5 border-t border-navy-900/5 pt-2">
        <Toggle label="Apenas verificados" on={f.verificados} onChange={(v) => set('verificados', v ? '1' : null)} />
        <Toggle label="Mobiliado" on={f.mobiliado} onChange={(v) => set('mobiliado', v ? '1' : null)} />
        <Toggle label="Disponibilidade imediata" on={f.imediato} onChange={(v) => set('imediato', v ? '1' : null)} />
      </div>
    </div>
  );
}

export default function SearchPage() {
  useTitle('Pesquisar Imóveis — KEYHOUSE PROPERTIES');
  const [params, setParams] = useSearchParams();
  const { properties, addSearch, notify } = useStore();
  const filters = useMemo(() => parseFilters(params), [params]);
  const published = useMemo(() => properties.filter((p) => p.status === 'publicado'), [properties]);
  const results = useMemo(() => applyFilters(published, filters), [published, filters]);
  const view = params.get('vista') === 'mapa' ? 'mapa' : 'grelha';
  const [drawer, setDrawer] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const set: Setter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };
  const clear = () => setParams(view === 'mapa' ? { vista: 'mapa' } : {}, { replace: true });

  const query = () => {
    const q = new URLSearchParams(params);
    q.delete('vista');
    return q.toString();
  };
  const save = () => {
    addSearch({ query: query(), label: describeFilters(filters), results: results.length });
    notify('Pesquisa guardada na sua área de cliente. Avisamos quando surgirem novos imóveis.');
  };

  const chips: [string, string | null][] = [
    ['finalidade', filters.finalidade || null],
    ['categoria', filters.categoria ? TYPE_GROUPS[filters.categoria as TypeGroup] ?? filters.categoria : null],
    ['q', filters.q ? `“${filters.q}”` : null],
    ['cidade', filters.cidade || null],
    ['tipo', filters.tipo || null],
    ['tipologia', filters.tipologia || null],
    ['min', filters.min ? `Desde ${compact(filters.min)} MT` : null],
    ['max', filters.max ? `Até ${compact(filters.max)} MT` : null],
    ['quartos', filters.quartos ? `${filters.quartos}+ quartos` : null],
    ['estado', filters.estado || null],
    ['verificados', filters.verificados ? 'Verificados' : null],
    ['mobiliado', filters.mobiliado ? 'Mobiliado' : null],
    ['imediato', filters.imediato ? 'Disponível já' : null],
  ];
  const activeChips = chips.filter(([, v]) => v);

  const markers = results.map((p) => ({ id: p.id, lat: p.lat, lng: p.lng, label: pinLabel(p) }));

  return (
    <div>
      <section className="border-b border-navy-900/5 bg-white">
        <div className="container-kh py-7 sm:py-9">
          <div className="text-[11px] font-bold uppercase tracking-[.25em] text-gold-600">Pesquisar imóveis</div>
          <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">{describeFilters(filters)}</h1>
              <p className="mt-1 font-serif text-xl italic text-graphite-500">Filtre. Encontre. Agende.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setDrawer(true)} className={btn('outline', 'md', 'lg:hidden')}>
                <SlidersHorizontal className="h-4 w-4" /> Filtros {activeChips.length > 0 && `(${activeChips.length})`}
              </button>
              <Select value={filters.ordem} onChange={(e) => set('ordem', e.target.value)} className="w-44">
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </Select>
              <div className="flex rounded-xl bg-navy-900/5 p-1">
                <button
                  onClick={() => set('vista', null)}
                  className={cn('flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-bold', view === 'grelha' ? 'bg-white text-navy-950 shadow-sm' : 'text-graphite-500')}
                >
                  <LayoutGrid className="h-4 w-4" /> Grelha
                </button>
                <button
                  onClick={() => set('vista', 'mapa')}
                  className={cn('flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-bold', view === 'mapa' ? 'bg-white text-navy-950 shadow-sm' : 'text-graphite-500')}
                >
                  <MapIcon className="h-4 w-4" /> Mapa
                </button>
              </div>
              <button onClick={save} className={btn('navy', 'md')}>
                <Heart className="h-4 w-4" /> Guardar pesquisa
              </button>
            </div>
          </div>
          {activeChips.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {activeChips.map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => set(k, null)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1.5 text-[13px] font-semibold text-navy-950 ring-1 ring-gold-200 hover:bg-gold-100"
                >
                  {v} <X className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container-kh grid gap-8 py-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-4 no-scrollbar">
            <FiltersPanel f={filters} set={set} clear={clear} />
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between text-sm text-graphite-500">
            <span>
              <b className="text-navy-950">{results.length}</b> {results.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
            </span>
            <span className="hidden sm:inline">Anúncios em destaque aparecem primeiro no seu bairro</span>
          </div>

          {results.length === 0 ? (
            <EmptyState
              icon={<SearchX className="h-6 w-6" />}
              title="Nenhum imóvel corresponde aos filtros"
              text="Alargue a pesquisa — ou deixe o nosso Concierge encontrar o imóvel certo por si, incluindo oportunidades fora do mercado."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={clear} className={btn('outline')}>
                    Limpar filtros
                  </button>
                  <Link to="/planos#concierge" className={btn('gold')}>
                    <Headphones className="h-4 w-4" /> Pedir ao Concierge
                  </Link>
                </div>
              }
            />
          ) : view === 'grelha' ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => (
                <PropertyCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
              <div className="order-2 space-y-3 xl:order-1 xl:max-h-[calc(100vh-9rem)] xl:overflow-y-auto xl:pr-1">
                {results.map((p) => (
                  <div key={p.id} id={`card-${p.id}`}>
                    <PropertyCard p={p} compact active={active === p.id} onHover={setActive} />
                  </div>
                ))}
              </div>
              <div className="order-1 xl:order-2">
                <div className="sticky top-28 overflow-hidden rounded-3xl shadow-soft ring-1 ring-navy-900/5">
                  <MapView
                    markers={markers}
                    activeId={active}
                    onMarkerClick={(id) => {
                      setActive(id);
                      document.getElementById(`card-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="h-[55vh] xl:h-[calc(100vh-9rem)]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div className="absolute inset-0 animate-fade bg-navy-950/60 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] animate-rise overflow-y-auto rounded-t-3xl bg-ivory p-4 pb-8">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-navy-900/15" />
            <FiltersPanel f={filters} set={set} clear={clear} />
            <button onClick={() => setDrawer(false)} className={btn('gold', 'lg', 'mt-4 w-full')}>
              Ver {results.length} imóveis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
