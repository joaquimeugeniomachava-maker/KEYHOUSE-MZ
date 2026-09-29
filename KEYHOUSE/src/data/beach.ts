import type { Currency } from '../lib/types';
import { IMG } from './images';

/**
 * COLECÇÃO PRAIAS — portfólio real de terrenos de praia da KEYHOUSE
 * (Macaneta, Barra, Jangamo, Tofo e Vilankulo · 1 a 50 hectares).
 *
 * As imagens das zonas são ILUSTRATIVAS da região e aparecem sempre com a etiqueta "Imagem ilustrativa".
 * Cada lote só mostra fotografias REAIS (campo `photos`) quando existirem.
 */

export type BeachZoneId = 'macaneta' | 'barra' | 'jangamo' | 'tofo' | 'vilankulo';
export type LandDocStatus = 'duat' | 'tramitacao' | 'declaracao' | 'confirmar';

export const LAND_DOC_LABEL: Record<LandDocStatus, string> = {
  duat: 'DUAT emitido',
  tramitacao: 'DUAT em tramitação',
  declaracao: 'Declaração da comunidade / bairro',
  confirmar: 'Documentação a confirmar',
};

export interface BeachZone {
  id: BeachZoneId;
  name: string;
  area: string;
  district: string;
  tagline: string;
  highlights: string[];
  idealFor: string[];
  image: string;
  lat: number; // localização APROXIMADA da zona (não de um lote)
  lng: number;
}

export interface BeachPlot {
  id: string; // ex.: 'TER-TOF-01'
  zoneId: BeachZoneId;
  title: string;
  hectares: number;
  /** Preço TOTAL. Deixe null se indicar só o preço por hectare (ou para "preço sob consulta"). */
  price: number | null;
  /** Preço por hectare (como os vendedores costumam indicar). O total é calculado automaticamente. */
  pricePerHa?: number;
  currency: Currency;
  negotiable: boolean;
  seaDistance: string; // ex.: '1.ª linha, após a faixa legal de 100 m' ou '400 m do mar'
  access: string; // ex.: 'Estrada de terra a 2 km do asfalto; energia a 500 m'
  docs: LandDocStatus;
  /** Lote em zona de dunas: só infra-estruturas básicas, com licença especial (Decreto n.º 45/2006, art. 67). */
  inDunes?: boolean;
  mapLink?: string; // link do Google Maps
  photos: string[]; // SÓ fotografias reais do lote (ex.: 'images/lotes/mac-01-1.jpg')
  notes?: string;
}

/** Total e preço por hectare de um lote (a partir de qualquer um dos dois campos). */
export function plotPricing(p: BeachPlot): { total: number | null; perHa: number | null } {
  const total = p.price ?? (p.pricePerHa ? p.pricePerHa * p.hectares : null);
  const perHa = p.pricePerHa ?? (p.price && p.hectares ? p.price / p.hectares : null);
  return { total, perHa };
}

export const BEACH_RANGE = { minHa: 1, maxHa: 50 }; // intervalo de hectares da colecção

export const BEACH_ZONES: BeachZone[] = [
  {
    id: 'macaneta',
    name: 'Macaneta',
    area: 'Península da Macaneta',
    district: 'Marracuene · Maputo',
    tagline: 'Praia, dunas e estuário a cerca de 40 km de Maputo',
    highlights: [
      'Península entre o Oceano Índico e o estuário do rio Incomáti',
      'Cerca de 11 km de praia, com lodges e restaurantes',
      'Acesso por estrada e pela ponte sobre o Incomáti, em Marracuene',
    ],
    idealFor: ['Casa de fim-de-semana', 'Eco-lodge', 'Investimento'],
    image: IMG.beach,
    lat: -25.75,
    lng: 32.755,
  },
  {
    id: 'tofo',
    name: 'Tofo',
    area: 'Praia do Tofo',
    district: 'Inhambane',
    tagline: 'A capital do mergulho em Moçambique',
    highlights: [
      'Tubarões-baleia e raias-manta: dos melhores mergulhos do Índico',
      'Baleias-jubarte de Julho a Outubro',
      'Procura turística forte: lodges, casas de férias e centros de mergulho',
    ],
    idealFor: ['Lodge', 'Casa de férias', 'Aluguer turístico'],
    image: IMG.tofo,
    lat: -23.853,
    lng: 35.546,
  },
  {
    id: 'barra',
    name: 'Barra',
    area: 'Ponta da Barra',
    district: 'Inhambane',
    tagline: 'Mar aberto e baía na ponta da península',
    highlights: [
      'Praias de mar aberto e águas calmas do lado da baía',
      'Mangais e bancos de areia: cenário de ecoturismo',
      'Acesso pela cidade de Inhambane, com aeroporto',
    ],
    idealFor: ['Lodge', 'Resort boutique', 'Casa de férias'],
    image: IMG.barra,
    lat: -23.79,
    lng: 35.53,
  },
  {
    id: 'jangamo',
    name: 'Jangamo',
    area: 'Guinjata · Paindane',
    district: 'Distrito de Jangamo',
    tagline: 'Recifes, baías abrigadas e natureza intacta',
    highlights: [
      'Baías de Guinjata e Paindane, com recifes de coral',
      'Costa menos construída: espaço para projectos de raiz',
      'Mergulho, pesca desportiva e ecoturismo',
    ],
    idealFor: ['Eco-lodge', 'Resort', 'Investimento'],
    image: IMG.jangamo,
    lat: -24.085,
    lng: 35.51,
  },
  {
    id: 'vilankulo',
    name: 'Vilankulo',
    area: 'Frente ao Arquipélago do Bazaruto',
    district: 'Vilankulo (Vilanculos)',
    tagline: 'A porta de entrada do Bazaruto',
    highlights: [
      'Vista para o Parque Nacional do Arquipélago do Bazaruto',
      'Aeroporto com voos domésticos e regionais',
      'Turismo de alto padrão, kitesurf e passeios de dhow',
    ],
    idealFor: ['Lodge premium', 'Hotel', 'Investimento'],
    image: IMG.vilankulo,
    lat: -22.0,
    lng: 35.32,
  },
];

/**
 * Lotes individuais. Acrescente um bloco por terreno real. Exemplo:
 *
 * {
 *   id: 'TER-TOF-01',
 *   zoneId: 'tofo',
 *   title: 'Terreno de 12 ha com vista mar',
 *   hectares: 12,
 *   price: null,             // preço total (ou null e use pricePerHa)
 *   pricePerHa: 300000,      // preço por hectare
 *   currency: 'MZN',         // 'MZN' | 'USD' | 'EUR' | 'ZAR'
 *   negotiable: true,
 *   seaDistance: '1.ª linha, após a faixa legal de 100 m',
 *   access: 'Estrada de terra a 2 km do asfalto',
 *   docs: 'duat',            // 'duat' | 'tramitacao' | 'declaracao' | 'confirmar'
 *   inDunes: false,
 *   mapLink: 'https://maps.app.goo.gl/…',
 *   photos: [],              // fotografias reais do lote
 * },
 */
export const BEACH_PLOTS: BeachPlot[] = [
  {
    id: 'TER-MAC-01',
    zoneId: 'macaneta',
    title: 'Terreno de 15 ha nas dunas, a cerca de 100 m da praia',
    hectares: 15,
    price: null,
    pricePerHa: 1500000,
    currency: 'MZN',
    negotiable: false,
    seaDistance: 'Cerca de 100 m da praia (faixa legal a confirmar em levantamento)',
    access: 'A confirmar',
    docs: 'confirmar',
    inDunes: true,
    photos: [],
  },
];
