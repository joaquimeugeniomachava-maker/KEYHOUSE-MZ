import type { Currency, PaymentMethod, ProductCode, Role } from './types';

export const BRAND = {
  name: 'KEYHOUSE PROPERTIES',
  short: 'KEYHOUSE',
  whatsapp: '258840000000',
  whatsappDisplay: '+258 84 000 0000',
  email: 'concierge@keyhouse.co.mz',
  address: 'Av. Julius Nyerere, Polana — Maputo',
};

export const DEMO_USER = { name: 'Ana Matsinhe', phone: '+258 84 555 0101', email: 'ana.matsinhe@email.co.mz' };

/** Taxas indicativas (MZN por unidade) */
export const RATES: Record<Currency, number> = { MZN: 1, USD: 63.9, EUR: 74.5, ZAR: 3.6 };
export const VAT = 0.16;
export const BROKER_SHARE = 0.6;

export const ROLE_LABEL: Record<Role, string> = {
  cliente: 'Cliente',
  proprietario: 'Proprietário',
  intermediario: 'Intermediário',
  admin: 'Administrador',
};
export const ROLE_PATH: Record<Role, string> = {
  cliente: '/cliente',
  proprietario: '/proprietario',
  intermediario: '/intermediario',
  admin: '/admin',
};

export type TypeGroup = 'residencial' | 'comercial' | 'terrenos' | 'investimento';
export interface PropertyTypeDef {
  label: string;
  plural: string;
  group: TypeGroup;
}

/** 20 tipos de propriedade suportados */
export const PROPERTY_TYPES: PropertyTypeDef[] = [
  { label: 'Apartamento', plural: 'Apartamentos', group: 'residencial' },
  { label: 'Moradia', plural: 'Moradias', group: 'residencial' },
  { label: 'Casa geminada', plural: 'Casas geminadas', group: 'residencial' },
  { label: 'Quarto', plural: 'Quartos', group: 'residencial' },
  { label: 'Loja', plural: 'Lojas', group: 'comercial' },
  { label: 'Escritório', plural: 'Escritórios', group: 'comercial' },
  { label: 'Armazém', plural: 'Armazéns', group: 'comercial' },
  { label: 'Espaço comercial', plural: 'Espaços comerciais', group: 'comercial' },
  { label: 'Salão de eventos', plural: 'Salões de eventos', group: 'comercial' },
  { label: 'Terreno', plural: 'Terrenos', group: 'terrenos' },
  { label: 'Ruína', plural: 'Ruínas', group: 'terrenos' },
  { label: 'Lodge', plural: 'Lodges', group: 'investimento' },
  { label: 'Quinta', plural: 'Quintas', group: 'terrenos' },
  { label: 'Terreno na praia', plural: 'Terrenos na praia', group: 'terrenos' },
  { label: 'Espaço em aluguer', plural: 'Espaços em aluguer', group: 'comercial' },
  { label: 'Dependência', plural: 'Dependências', group: 'residencial' },
  { label: 'Parque', plural: 'Parques', group: 'comercial' },
  { label: 'Estaleiro', plural: 'Estaleiros', group: 'comercial' },
  { label: 'Imóvel para investimento', plural: 'Imóveis para investimento', group: 'investimento' },
  { label: 'Imóvel para reabilitação', plural: 'Imóveis para reabilitação', group: 'investimento' },
];

export const TYPE_GROUPS: Record<TypeGroup, string> = {
  residencial: 'Residencial',
  comercial: 'Comercial',
  terrenos: 'Terrenos & Rural',
  investimento: 'Turismo & Investimento',
};

export const PURPOSES = ['Venda', 'Arrendamento'] as const;
export const TYPOLOGIES = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5+', 'V1', 'V2', 'V3', 'V4', 'V5+', 'Open space', 'Não aplicável'];
export const CONDITIONS = ['Novo', 'Como novo', 'Bom estado', 'Para renovar', 'Em construção', 'Ruína', 'Não aplicável'];
export const CURRENCIES: { code: Currency; label: string }[] = [
  { code: 'MZN', label: 'MT — Metical' },
  { code: 'USD', label: 'USD — Dólar' },
  { code: 'EUR', label: 'EUR — Euro' },
  { code: 'ZAR', label: 'ZAR — Rand' },
];

export const CITIES = [
  'Maputo',
  'Matola',
  'Marracuene',
  'Beira',
  'Nampula',
  'Inhambane',
  'Vilankulo',
  'Ponta do Ouro',
  'Bilene',
  'Xai-Xai',
  'Pemba',
  'Tete',
  'Quelimane',
  'Nacala',
  'Chimoio',
];

export const CITY_COORDS: Record<string, [number, number]> = {
  Maputo: [-25.9655, 32.5832],
  Matola: [-25.9622, 32.4589],
  Marracuene: [-25.7383, 32.675],
  Beira: [-19.8436, 34.8389],
  Nampula: [-15.1165, 39.2666],
  Inhambane: [-23.865, 35.3833],
  Vilankulo: [-21.995, 35.316],
  'Ponta do Ouro': [-26.843, 32.896],
  Bilene: [-25.283, 33.238],
  'Xai-Xai': [-25.0519, 33.6442],
  Pemba: [-12.974, 40.5178],
  Tete: [-16.1564, 33.5867],
  Quelimane: [-17.8786, 36.8883],
  Nacala: [-14.5428, 40.6728],
  Chimoio: [-19.1164, 33.4833],
};

export const NEIGHBORHOODS: Record<string, string[]> = {
  Maputo: [
    'Sommerschield',
    'Polana Cimento A',
    'Polana Cimento B',
    'Costa do Sol',
    'Triunfo',
    'Coop',
    'Malhangalene',
    'Central',
    'Baixa',
    'Alto Maé',
    'Museu',
    'Maxaquene',
    'Polana Caniço',
    'Mavalane',
    'Zimpeto',
  ],
  Matola: ['Matola Rio', 'Machava', 'Fomento', 'Liberdade', 'Tchumene', 'Matola Gare', 'Sikwama'],
  Marracuene: ['Vila de Marracuene', 'Bobole', 'Michafutene', 'Ricatla'],
  Beira: ['Ponta Gêa', 'Macuti', 'Palmeiras', 'Esturro', 'Manga'],
  Nampula: ['Central', 'Muahivire', 'Mutauanha', 'Namicopo'],
  Inhambane: ['Tofo', 'Barra', 'Cidade Baixa', 'Guinjata'],
  Vilankulo: ['Praia de Vilankulo', 'Chibuene', 'Bairro Central'],
  'Ponta do Ouro': ['Ponta do Ouro', 'Ponta Malongane', 'Ponta Mamoli'],
  Bilene: ['Praia do Bilene', 'Vila do Bilene'],
  'Xai-Xai': ['Praia do Xai-Xai', 'Cidade Alta'],
  Pemba: ['Wimbi', 'Cimento', 'Paquitequete'],
  Tete: ['Matundo', 'Cidade', 'Chingodzi'],
  Quelimane: ['Aeroporto', 'Central', 'Sampene'],
  Nacala: ['Nacala Porto', 'Relanzapo'],
  Chimoio: ['Centro', 'Soalpo', 'Bairro 5'],
};

export const ZONES = [
  'Zona nobre',
  'Marginal / Frente mar',
  'Centro / Baixa',
  'Zona residencial',
  'Zona industrial',
  'Zona de expansão',
  'Zona turística',
  'Zona rural',
];

export const MZ_BOUNDS = { minLat: -26.95, maxLat: -10.4, minLng: 30.2, maxLng: 41.0 };

export interface ProductDef {
  code: ProductCode;
  label: string;
  price: number;
  unit: string;
  when: string;
  payer: string;
  description: string;
  recurring: boolean;
}

/** 9 fontes de receita */
export const PRODUCTS: Record<ProductCode, ProductDef> = {
  publicacao: {
    code: 'publicacao',
    label: 'Publicação de anúncio',
    price: 500,
    unit: 'por anúncio',
    when: 'No momento da publicação',
    payer: 'Anunciante',
    description: 'Validação profissional, badge de verificação e presença em todas as pesquisas.',
    recurring: false,
  },
  destaque: {
    code: 'destaque',
    label: 'Destaque por bairro',
    price: 1500,
    unit: '/mês',
    when: 'Mensal',
    payer: 'Anunciante',
    description: 'Topo das pesquisas no seu bairro, selo Destaque e prioridade nas recomendações.',
    recurring: true,
  },
  lead: {
    code: 'lead',
    label: 'Lead qualificado',
    price: 1000,
    unit: 'por lead',
    when: 'Quando o lead é validado',
    payer: 'Anunciante',
    description: 'Cliente com orçamento, prazo e capacidade financeira confirmados.',
    recurring: false,
  },
  visita: {
    code: 'visita',
    label: 'Visita confirmada',
    price: 500,
    unit: 'por visita',
    when: 'Após confirmação',
    payer: 'Anunciante',
    description: 'Agendamento automático, lembretes por WhatsApp e confirmação de presença.',
    recurring: false,
  },
  comissao: {
    code: 'comissao',
    label: 'Comissão de fecho',
    price: 0,
    unit: '2–5% do negócio',
    when: 'No fecho do negócio',
    payer: 'Anunciante',
    description: 'Minuta de contrato gerada e comissão calculada automaticamente.',
    recurring: false,
  },
  intermediario: {
    code: 'intermediario',
    label: 'Subscrição de Intermediário',
    price: 3000,
    unit: '/mês',
    when: 'Mensal',
    payer: 'Intermediário',
    description: 'Publicações incluídas, gestão de carteira, comissões e perfil verificado.',
    recurring: true,
  },
  contacto: {
    code: 'contacto',
    label: 'Acesso a contacto verificado',
    price: 200,
    unit: 'por contacto',
    when: 'Por contacto',
    payer: 'Cliente',
    description: 'Acesso imediato ao contacto verificado do anunciante.',
    recurring: false,
  },
  concierge: {
    code: 'concierge',
    label: 'Concierge Imobiliário',
    price: 5000,
    unit: 'por serviço',
    when: 'Serviço personalizado',
    payer: 'Cliente',
    description: 'Um consultor sénior procura, visita, verifica e negoceia por si.',
    recurring: false,
  },
  agencia: {
    code: 'agencia',
    label: 'Plano Premium Agência',
    price: 10000,
    unit: '/mês',
    when: 'Mensal',
    payer: 'Agência',
    description: 'Anúncios ilimitados, equipa, marca própria e gestor de conta dedicado.',
    recurring: true,
  },
};

export const PRODUCT_ORDER: ProductCode[] = [
  'publicacao',
  'destaque',
  'lead',
  'visita',
  'comissao',
  'intermediario',
  'contacto',
  'concierge',
  'agencia',
];

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  mpesa: 'M-Pesa',
  emola: 'e-Mola',
  paypal: 'PayPal',
  banco: 'Transferência',
};

export const TIMELINES = [
  { id: 'imediato', label: 'Imediato (esta semana)', points: 25 },
  { id: '30d', label: 'Até 30 dias', points: 20 },
  { id: '90d', label: '1 a 3 meses', points: 12 },
  { id: '180d', label: '3 a 6 meses', points: 6 },
  { id: 'later', label: 'Mais de 6 meses', points: 2 },
];

export const BUY_PAYMENT = [
  { id: 'pronto', label: 'Pronto pagamento', points: 25 },
  { id: 'credito_aprovado', label: 'Crédito bancário aprovado', points: 20 },
  { id: 'credito_analise', label: 'Crédito em análise', points: 10 },
  { id: 'nao_sei', label: 'Ainda não decidi', points: 3 },
];

export const RENT_PAYMENT = [
  { id: 'empresa', label: 'Contrato empresarial', points: 25 },
  { id: 'rendimento', label: 'Rendimento comprovado', points: 22 },
  { id: 'fiador', label: 'Com fiador / garantia', points: 12 },
  { id: 'nao_sei', label: 'Ainda não decidi', points: 3 },
];

export const TIME_SLOTS = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];

export const REJECTION_REASONS = [
  'Fotografias de baixa qualidade ou não reais',
  'Documentação insuficiente',
  'Preço inconsistente com o mercado',
  'Localização não confirmada',
  'Anúncio duplicado',
];
