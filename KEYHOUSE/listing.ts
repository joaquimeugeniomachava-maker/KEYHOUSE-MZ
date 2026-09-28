import type { Advertiser, Currency, Property, PropertyStatus, Purpose, Tier } from './types';
import { MZ_BOUNDS } from './constants';
import { toMZN } from './utils';

/** Rascunho do formulário de publicação — 27 campos obrigatórios */
export interface ListingDraft {
  type: string;
  purpose: Purpose | '';
  typology: string;
  neighborhood: string;
  city: string;
  zone: string;
  floor: string;
  totalArea: string;
  usefulArea: string;
  bedrooms: string;
  bathrooms: string;
  livingRoom: boolean | null;
  kitchen: boolean | null;
  balcony: boolean | null;
  parking: string;
  condition: string;
  furnished: boolean | null;
  hasTitle: boolean | null;
  hasLicense: boolean | null;
  immediate: boolean | null;
  price: string;
  currency: Currency | '';
  negotiable: boolean | null;
  commission: string;
  photos: string[];
  video: string;
  lat: string;
  lng: string;
}

export type FieldKey = Exclude<keyof ListingDraft, 'lng'>;
export type BoolKey = 'livingRoom' | 'kitchen' | 'balcony' | 'furnished' | 'hasTitle' | 'hasLicense' | 'immediate' | 'negotiable';

export interface FieldMeta {
  key: FieldKey;
  n: number;
  label: string;
  step: number;
}

export const FIELDS: FieldMeta[] = [
  { key: 'type', n: 1, label: 'Tipo de imóvel', step: 0 },
  { key: 'purpose', n: 2, label: 'Finalidade', step: 0 },
  { key: 'typology', n: 3, label: 'Tipologia', step: 0 },
  { key: 'neighborhood', n: 4, label: 'Bairro', step: 0 },
  { key: 'city', n: 5, label: 'Cidade', step: 0 },
  { key: 'zone', n: 6, label: 'Zona', step: 0 },
  { key: 'floor', n: 7, label: 'Andar', step: 0 },
  { key: 'totalArea', n: 8, label: 'Área total (m²)', step: 1 },
  { key: 'usefulArea', n: 9, label: 'Área útil (m²)', step: 1 },
  { key: 'bedrooms', n: 10, label: 'Quartos', step: 1 },
  { key: 'bathrooms', n: 11, label: 'Casas de banho', step: 1 },
  { key: 'livingRoom', n: 12, label: 'Sala', step: 1 },
  { key: 'kitchen', n: 13, label: 'Cozinha', step: 1 },
  { key: 'balcony', n: 14, label: 'Varanda', step: 1 },
  { key: 'parking', n: 15, label: 'Estacionamento', step: 1 },
  { key: 'condition', n: 16, label: 'Estado de conservação', step: 2 },
  { key: 'furnished', n: 17, label: 'Mobiliado', step: 2 },
  { key: 'hasTitle', n: 18, label: 'Título de propriedade / DUAT', step: 2 },
  { key: 'hasLicense', n: 19, label: 'Licença / documentação', step: 2 },
  { key: 'immediate', n: 20, label: 'Disponibilidade imediata', step: 2 },
  { key: 'price', n: 21, label: 'Preço', step: 3 },
  { key: 'currency', n: 22, label: 'Moeda', step: 3 },
  { key: 'negotiable', n: 23, label: 'Negociável', step: 3 },
  { key: 'commission', n: 24, label: 'Comissão (%)', step: 3 },
  { key: 'photos', n: 25, label: 'Fotos', step: 4 },
  { key: 'video', n: 26, label: 'Vídeo', step: 4 },
  { key: 'lat', n: 27, label: 'Localização no mapa', step: 4 },
];

export const EMPTY_DRAFT: ListingDraft = {
  type: '',
  purpose: '',
  typology: '',
  neighborhood: '',
  city: '',
  zone: '',
  floor: '',
  totalArea: '',
  usefulArea: '',
  bedrooms: '',
  bathrooms: '',
  livingRoom: null,
  kitchen: null,
  balcony: null,
  parking: '',
  condition: '',
  furnished: null,
  hasTitle: null,
  hasLicense: null,
  immediate: null,
  price: '',
  currency: 'MZN',
  negotiable: null,
  commission: '3',
  photos: [],
  video: '',
  lat: '',
  lng: '',
};

const num = (s: string) => (s.trim() === '' ? NaN : Number(s.replace(',', '.')));
const intIn = (s: string, min: number, max: number) => {
  const n = num(s);
  return Number.isInteger(n) && n >= min && n <= max;
};

export function validateField(key: FieldKey, d: ListingDraft): string | null {
  switch (key) {
    case 'type':
      return d.type ? null : 'Seleccione o tipo de imóvel.';
    case 'purpose':
      return d.purpose ? null : 'Seleccione a finalidade.';
    case 'typology':
      return d.typology ? null : 'Seleccione a tipologia.';
    case 'neighborhood':
      return d.neighborhood.trim().length >= 3 ? null : 'Indique o bairro (mín. 3 caracteres).';
    case 'city':
      return d.city ? null : 'Seleccione a cidade.';
    case 'zone':
      return d.zone.trim().length >= 3 ? null : 'Indique a zona.';
    case 'floor':
      return intIn(d.floor, -3, 80) ? null : 'Andar inválido (0 = rés-do-chão, negativo = cave).';
    case 'totalArea': {
      const n = num(d.totalArea);
      return n > 0 && n <= 10_000_000 ? null : 'Indique a área total em m².';
    }
    case 'usefulArea': {
      const n = num(d.usefulArea);
      const t = num(d.totalArea);
      if (!(n > 0)) return 'Indique a área útil em m².';
      if (t > 0 && n > t) return 'A área útil não pode exceder a área total.';
      return null;
    }
    case 'bedrooms':
      return intIn(d.bedrooms, 0, 100) ? null : 'Indique o número de quartos (0 se não aplicável).';
    case 'bathrooms':
      return intIn(d.bathrooms, 0, 100) ? null : 'Indique o número de casas de banho.';
    case 'parking':
      return intIn(d.parking, 0, 1000) ? null : 'Indique os lugares de estacionamento (0 se nenhum).';
    case 'livingRoom':
    case 'kitchen':
    case 'balcony':
    case 'furnished':
    case 'hasTitle':
    case 'hasLicense':
    case 'immediate':
    case 'negotiable':
      return d[key] === null ? 'Seleccione Sim ou Não.' : null;
    case 'condition':
      return d.condition ? null : 'Seleccione o estado de conservação.';
    case 'price':
      return num(d.price) > 0 ? null : 'Indique o preço.';
    case 'currency':
      return d.currency ? null : 'Seleccione a moeda.';
    case 'commission': {
      const n = num(d.commission);
      return n >= 2 && n <= 5 ? null : 'A comissão de fecho situa-se entre 2% e 5%.';
    }
    case 'photos':
      return d.photos.length >= 3 ? null : `Carregue pelo menos 3 fotos (${d.photos.length}/3).`;
    case 'video':
      return d.video.trim() ? null : 'Carregue um vídeo ou indique um link (YouTube, Drive…).';
    case 'lat': {
      const la = num(d.lat);
      const ln = num(d.lng);
      if (Number.isNaN(la) || Number.isNaN(ln)) return 'Marque a localização no mapa.';
      if (la < MZ_BOUNDS.minLat || la > MZ_BOUNDS.maxLat || ln < MZ_BOUNDS.minLng || ln > MZ_BOUNDS.maxLng)
        return 'A localização deve estar em Moçambique.';
      return null;
    }
  }
  return null;
}

export function validateDraft(d: ListingDraft) {
  const out = {} as Record<FieldKey, string | null>;
  for (const f of FIELDS) out[f.key] = validateField(f.key, d);
  return out;
}

export function draftToProperty(
  d: ListingDraft,
  meta: { id: string; title: string; description: string; advertiser: Advertiser; status: PropertyStatus },
): Property {
  return {
    id: meta.id,
    title: meta.title,
    description: meta.description,
    type: d.type,
    purpose: (d.purpose || 'Venda') as Purpose,
    typology: d.typology,
    neighborhood: d.neighborhood.trim(),
    city: d.city,
    zone: d.zone.trim(),
    floor: num(d.floor),
    totalArea: num(d.totalArea),
    usefulArea: num(d.usefulArea),
    bedrooms: num(d.bedrooms),
    bathrooms: num(d.bathrooms),
    livingRoom: !!d.livingRoom,
    kitchen: !!d.kitchen,
    balcony: !!d.balcony,
    parking: num(d.parking),
    condition: d.condition,
    furnished: !!d.furnished,
    hasTitle: !!d.hasTitle,
    hasLicense: !!d.hasLicense,
    immediate: !!d.immediate,
    price: num(d.price),
    currency: (d.currency || 'MZN') as Currency,
    negotiable: !!d.negotiable,
    commission: num(d.commission),
    photos: d.photos,
    video: d.video,
    lat: num(d.lat),
    lng: num(d.lng),
    status: meta.status,
    verified: false,
    featured: false,
    advertiser: meta.advertiser,
    views: 0,
    createdAt: new Date().toISOString(),
    highlights: [],
  };
}

/** Checklist de 27 pontos usada pela equipa de validação */
export function propertyChecks(p: Property): { label: string; ok: boolean }[] {
  const rows: [string, boolean][] = [
    ['Tipo de imóvel', !!p.type],
    ['Finalidade', !!p.purpose],
    ['Tipologia', !!p.typology],
    ['Bairro', !!p.neighborhood],
    ['Cidade', !!p.city],
    ['Zona', !!p.zone],
    ['Andar', Number.isFinite(p.floor)],
    ['Área total', p.totalArea > 0],
    ['Área útil', p.usefulArea > 0 && p.usefulArea <= p.totalArea],
    ['Quartos', p.bedrooms >= 0],
    ['Casas de banho', p.bathrooms >= 0],
    ['Sala', true],
    ['Cozinha', true],
    ['Varanda', true],
    ['Estacionamento', p.parking >= 0],
    ['Estado de conservação', !!p.condition],
    ['Mobiliado', true],
    ['Título de propriedade', p.hasTitle],
    ['Licença / documentação', p.hasLicense],
    ['Disponibilidade', true],
    ['Preço', p.price > 0],
    ['Moeda', !!p.currency],
    ['Negociável', true],
    ['Comissão 2–5%', p.commission >= 2 && p.commission <= 5],
    ['Fotos (mín. 3)', p.photos.length >= 3],
    ['Vídeo', !!p.video],
    ['Localização', Number.isFinite(p.lat) && Number.isFinite(p.lng)],
  ];
  return rows.map(([label, ok]) => ({ label, ok }));
}

export function suggestTier(p: Property): Tier {
  const mzn = toMZN(p.price, p.currency);
  if ((p.purpose === 'Venda' && mzn >= 40_000_000) || (p.purpose === 'Arrendamento' && mzn >= 250_000)) return 'Premium';
  if (
    p.condition === 'Para renovar' ||
    p.condition === 'Ruína' ||
    p.type.includes('reabilitação') ||
    p.type.includes('investimento') ||
    p.type === 'Ruína'
  )
    return 'Oportunidade';
  return 'Essencial';
}
