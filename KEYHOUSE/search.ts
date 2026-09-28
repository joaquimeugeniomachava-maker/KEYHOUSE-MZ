import type { Property } from './types';
import { PROPERTY_TYPES, TYPE_GROUPS, type TypeGroup } from './constants';
import { compact, toMZN } from './utils';

export interface Filters {
  finalidade: string;
  categoria: string;
  q: string;
  cidade: string;
  tipo: string;
  tipologia: string;
  min: number | null;
  max: number | null;
  quartos: number;
  estado: string;
  verificados: boolean;
  mobiliado: boolean;
  imediato: boolean;
  ordem: string;
}

export function parseFilters(p: URLSearchParams): Filters {
  const n = (k: string) => {
    const v = p.get(k);
    if (!v) return null;
    const x = Number(v);
    return Number.isFinite(x) && x > 0 ? x : null;
  };
  return {
    finalidade: p.get('finalidade') || '',
    categoria: p.get('categoria') || '',
    q: p.get('q') || '',
    cidade: p.get('cidade') || '',
    tipo: p.get('tipo') || '',
    tipologia: p.get('tipologia') || '',
    min: n('min'),
    max: n('max'),
    quartos: n('quartos') || 0,
    estado: p.get('estado') || '',
    verificados: p.get('verificados') === '1',
    mobiliado: p.get('mobiliado') === '1',
    imediato: p.get('imediato') === '1',
    ordem: p.get('ordem') || 'relevancia',
  };
}

export const groupOf = (type: string) => PROPERTY_TYPES.find((t) => t.label === type)?.group;
export const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function applyFilters(list: Property[], f: Filters): Property[] {
  const q = norm(f.q.trim());
  const out = list.filter((p) => {
    if (f.finalidade && p.purpose !== f.finalidade) return false;
    if (f.categoria && groupOf(p.type) !== f.categoria) return false;
    if (f.cidade && p.city !== f.cidade) return false;
    if (f.tipo && p.type !== f.tipo) return false;
    if (f.tipologia && p.typology !== f.tipologia) return false;
    const mzn = toMZN(p.price, p.currency);
    if (f.min !== null && mzn < f.min) return false;
    if (f.max !== null && mzn > f.max) return false;
    if (f.quartos && p.bedrooms < f.quartos) return false;
    if (f.estado && p.condition !== f.estado) return false;
    if (f.verificados && !p.verified) return false;
    if (f.mobiliado && !p.furnished) return false;
    if (f.imediato && !p.immediate) return false;
    if (q && !norm(`${p.title} ${p.neighborhood} ${p.city} ${p.zone} ${p.type}`).includes(q)) return false;
    return true;
  });
  // Destaque por bairro: sobe ao topo quando a pesquisa é feita nesse bairro
  const boost = (p: Property) =>
    (p.featured ? (q && norm(p.neighborhood).includes(q) ? 4 : 2) : 0) + (p.verified ? 1 : 0);
  const sorters: Record<string, (a: Property, b: Property) => number> = {
    relevancia: (a, b) => boost(b) - boost(a) || b.createdAt.localeCompare(a.createdAt),
    'preco-asc': (a, b) => toMZN(a.price, a.currency) - toMZN(b.price, b.currency),
    'preco-desc': (a, b) => toMZN(b.price, b.currency) - toMZN(a.price, a.currency),
    recentes: (a, b) => b.createdAt.localeCompare(a.createdAt),
    area: (a, b) => b.totalArea - a.totalArea,
  };
  return [...out].sort(sorters[f.ordem] || sorters.relevancia);
}

export function describeFilters(f: Filters): string {
  const typeLabel = f.tipo
    ? PROPERTY_TYPES.find((t) => t.label === f.tipo)?.plural || f.tipo
    : f.categoria
      ? `Imóveis · ${TYPE_GROUPS[f.categoria as TypeGroup] ?? f.categoria}`
      : 'Imóveis';
  const fin = f.finalidade === 'Venda' ? ' para venda' : f.finalidade === 'Arrendamento' ? ' para arrendar' : '';
  const loc = f.q ? ` em ${f.q}` : f.cidade ? ` em ${f.cidade}` : ' em Moçambique';
  const extras: string[] = [];
  if (f.quartos) extras.push(`${f.quartos}+ quartos`);
  if (f.max) extras.push(`até ${compact(f.max)} MT`);
  return `${typeLabel}${fin}${loc}${extras.length ? ` · ${extras.join(' · ')}` : ''}`;
}

export const SORTS = [
  { id: 'relevancia', label: 'Relevância' },
  { id: 'recentes', label: 'Mais recentes' },
  { id: 'preco-asc', label: 'Preço: menor' },
  { id: 'preco-desc', label: 'Preço: maior' },
  { id: 'area', label: 'Maior área' },
];
