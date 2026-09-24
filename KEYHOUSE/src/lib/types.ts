export type Role = 'cliente' | 'proprietario' | 'intermediario' | 'admin';
export type Purpose = 'Venda' | 'Arrendamento';
export type Currency = 'MZN' | 'USD' | 'EUR' | 'ZAR';
export type PropertyStatus = 'pendente_pagamento' | 'em_validacao' | 'publicado' | 'rejeitado' | 'vendido' | 'arrendado';
export type AdvertiserType = 'proprietario' | 'intermediario' | 'agencia';
export type Tier = 'Premium' | 'Essencial' | 'Oportunidade';

export interface Advertiser {
  id: string;
  name: string;
  type: AdvertiserType;
  phone: string;
  verified: boolean;
  since: string;
}

/** Os 27 campos obrigatórios + metadados da plataforma */
export interface Property {
  id: string;
  title: string;
  description: string;
  type: string; // 1
  purpose: Purpose; // 2
  typology: string; // 3
  neighborhood: string; // 4
  city: string; // 5
  zone: string; // 6
  floor: number; // 7
  totalArea: number; // 8
  usefulArea: number; // 9
  bedrooms: number; // 10
  bathrooms: number; // 11
  livingRoom: boolean; // 12
  kitchen: boolean; // 13
  balcony: boolean; // 14
  parking: number; // 15
  condition: string; // 16
  furnished: boolean; // 17
  hasTitle: boolean; // 18
  hasLicense: boolean; // 19
  immediate: boolean; // 20
  price: number; // 21
  currency: Currency; // 22
  negotiable: boolean; // 23
  commission: number; // 24
  photos: string[]; // 25
  video: string; // 26
  lat: number; // 27
  lng: number; // 27
  status: PropertyStatus;
  verified: boolean;
  featured: boolean;
  featuredUntil?: string;
  tier?: Tier;
  advertiser: Advertiser;
  views: number;
  createdAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
  highlights: string[];
}

export type LeadStatus = 'novo' | 'aceite' | 'descartado';
export interface Lead {
  id: string;
  propertyId: string;
  name: string;
  phone: string;
  email?: string;
  zone: string;
  budget: number;
  currency: Currency;
  bedrooms: number;
  timeline: string;
  payment: string;
  score: number;
  qualified: boolean;
  status: LeadStatus;
  feePaid: boolean;
  createdAt: string;
  mine?: boolean;
}

export type VisitStatus = 'pendente' | 'confirmada' | 'realizada' | 'cancelada' | 'fechada';
export interface Visit {
  id: string;
  leadId: string;
  propertyId: string;
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  mode: 'presencial' | 'video';
  status: VisitStatus;
  feePaid: boolean;
  reminderSent?: boolean;
  createdAt: string;
  mine?: boolean;
}

export interface Deal {
  id: string;
  propertyId: string;
  visitId?: string;
  clientName: string;
  value: number;
  months?: number;
  currency: Currency;
  valueMZN: number;
  commissionPct: number;
  commissionMZN: number;
  vatMZN: number;
  brokerShareMZN: number;
  platformShareMZN: number;
  status: 'minuta' | 'pago';
  createdAt: string;
}

export type ProductCode =
  | 'publicacao'
  | 'destaque'
  | 'lead'
  | 'visita'
  | 'comissao'
  | 'intermediario'
  | 'contacto'
  | 'concierge'
  | 'agencia';

export type PaymentMethod = 'mpesa' | 'emola' | 'paypal' | 'banco';

export interface PaymentItem {
  code: ProductCode;
  label: string;
  amount: number;
  ref?: string;
}

export interface Payment {
  id: string;
  reference: string;
  items: PaymentItem[];
  total: number;
  method: PaymentMethod;
  payer: string;
  status: 'pago' | 'reembolsado';
  createdAt: string;
  live?: boolean;
}

export interface SearchEntry {
  id: string;
  query: string;
  label: string;
  results: number;
  createdAt: string;
}

export interface Subscription {
  plan: 'intermediario' | 'agencia';
  since: string;
  renewsAt: string;
}

export interface ConciergeRequest {
  id: string;
  name: string;
  phone: string;
  brief: string;
  budget: string;
  propertyId?: string;
  createdAt: string;
  status: 'pendente' | 'em_curso' | 'concluido';
  mine?: boolean;
}

export interface Toast {
  id: string;
  message: string;
  tone: 'success' | 'info' | 'error';
}
