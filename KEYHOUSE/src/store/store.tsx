import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type {
  ConciergeRequest,
  Deal,
  Lead,
  Payment,
  Property,
  Role,
  SearchEntry,
  Subscription,
  Toast,
  Visit,
} from '../lib/types';
import {
  SEED_CONCIERGE,
  SEED_DEALS,
  SEED_LEADS,
  SEED_PAYMENTS,
  SEED_PROPERTIES,
  SEED_SEARCHES,
  SEED_VISITS,
} from '../data/seed';
import { uid } from '../lib/utils';

interface Data {
  role: Role;
  properties: Property[];
  favorites: string[];
  searches: SearchEntry[];
  leads: Lead[];
  visits: Visit[];
  deals: Deal[];
  payments: Payment[];
  unlocked: string[];
  subscription: Subscription | null;
  concierge: ConciergeRequest[];
}

const KEY = 'keyhouse-properties:v1';

const fresh = (): Data => ({
  role: 'cliente',
  properties: SEED_PROPERTIES,
  favorites: ['kh-1000', 'kh-1002', 'kh-1005'],
  searches: SEED_SEARCHES,
  leads: SEED_LEADS,
  visits: SEED_VISITS,
  deals: SEED_DEALS,
  payments: SEED_PAYMENTS,
  unlocked: [],
  subscription: null,
  concierge: SEED_CONCIERGE,
});

function load(): Data {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...fresh(), ...(JSON.parse(raw) as Partial<Data>) };
  } catch {
    /* ignore */
  }
  return fresh();
}

interface Store extends Data {
  toasts: Toast[];
  notify: (message: string, tone?: Toast['tone']) => void;
  dismiss: (id: string) => void;
  setRole: (r: Role) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addSearch: (s: Omit<SearchEntry, 'id' | 'createdAt'>) => void;
  removeSearch: (id: string) => void;
  addProperty: (p: Property) => void;
  updateProperty: (id: string, patch: Partial<Property>) => void;
  addLead: (l: Lead) => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  addVisit: (v: Visit) => void;
  updateVisit: (id: string, patch: Partial<Visit>) => void;
  addDeal: (d: Deal) => void;
  addConcierge: (c: ConciergeRequest) => void;
  updateConcierge: (id: string, patch: Partial<ConciergeRequest>) => void;
  updatePayment: (id: string, patch: Partial<Payment>) => void;
  applyPayment: (p: Payment) => void;
  resetDemo: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(load);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      // Quota excedida (fotos carregadas): persiste sem as imagens em base64
      try {
        const lite = {
          ...data,
          properties: data.properties.map((p) => ({ ...p, photos: p.photos.filter((ph) => !ph.startsWith('data:')) })),
        };
        localStorage.setItem(KEY, JSON.stringify(lite));
      } catch {
        /* ignore */
      }
    }
  }, [data]);

  const dismiss = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const notify = useCallback((message: string, tone: Toast['tone'] = 'success') => {
    const id = uid('t');
    setToasts((t) => [...t.slice(-2), { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const setRole = useCallback((role: Role) => setData((s) => ({ ...s, role })), []);
  const toggleFavorite = useCallback(
    (id: string) =>
      setData((s) => ({
        ...s,
        favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [id, ...s.favorites],
      })),
    [],
  );
  const addSearch = useCallback(
    (e: Omit<SearchEntry, 'id' | 'createdAt'>) =>
      setData((s) => ({
        ...s,
        searches: [
          { ...e, id: uid('s'), createdAt: new Date().toISOString() },
          ...s.searches.filter((x) => x.query !== e.query),
        ].slice(0, 20),
      })),
    [],
  );
  const removeSearch = useCallback((id: string) => setData((s) => ({ ...s, searches: s.searches.filter((x) => x.id !== id) })), []);
  const addProperty = useCallback((p: Property) => setData((s) => ({ ...s, properties: [p, ...s.properties] })), []);
  const updateProperty = useCallback(
    (id: string, patch: Partial<Property>) =>
      setData((s) => ({ ...s, properties: s.properties.map((p): Property => (p.id === id ? { ...p, ...patch } : p)) })),
    [],
  );
  const addLead = useCallback((l: Lead) => setData((s) => ({ ...s, leads: [l, ...s.leads] })), []);
  const updateLead = useCallback(
    (id: string, patch: Partial<Lead>) =>
      setData((s) => ({ ...s, leads: s.leads.map((l): Lead => (l.id === id ? { ...l, ...patch } : l)) })),
    [],
  );
  const addVisit = useCallback((v: Visit) => setData((s) => ({ ...s, visits: [v, ...s.visits] })), []);
  const updateVisit = useCallback(
    (id: string, patch: Partial<Visit>) =>
      setData((s) => ({ ...s, visits: s.visits.map((v): Visit => (v.id === id ? { ...v, ...patch } : v)) })),
    [],
  );
  const addDeal = useCallback((d: Deal) => setData((s) => ({ ...s, deals: [d, ...s.deals] })), []);
  const addConcierge = useCallback((c: ConciergeRequest) => setData((s) => ({ ...s, concierge: [c, ...s.concierge] })), []);
  const updateConcierge = useCallback(
    (id: string, patch: Partial<ConciergeRequest>) =>
      setData((s) => ({
        ...s,
        concierge: s.concierge.map((c): ConciergeRequest => (c.id === id ? { ...c, ...patch } : c)),
      })),
    [],
  );
  const updatePayment = useCallback(
    (id: string, patch: Partial<Payment>) =>
      setData((s) => ({ ...s, payments: s.payments.map((p): Payment => (p.id === id ? { ...p, ...patch } : p)) })),
    [],
  );

  /** Aplica os efeitos de negócio de cada item pago — o coração da monetização */
  const applyPayment = useCallback((pay: Payment) => {
    setData((s) => {
      const next: Data = { ...s, payments: [pay, ...s.payments] };
      const now = new Date();
      const in30 = new Date(now.getTime() + 30 * 864e5).toISOString();
      for (const it of pay.items) {
        const ref = it.ref;
        switch (it.code) {
          case 'publicacao':
            next.properties = next.properties.map(
              (p): Property => (p.id === ref && p.status === 'pendente_pagamento' ? { ...p, status: 'em_validacao' } : p),
            );
            break;
          case 'destaque':
            next.properties = next.properties.map(
              (p): Property => (p.id === ref ? { ...p, featured: true, featuredUntil: in30 } : p),
            );
            break;
          case 'lead':
            next.leads = next.leads.map((l): Lead => (l.id === ref ? { ...l, feePaid: true, status: 'aceite' } : l));
            break;
          case 'visita':
            next.visits = next.visits.map((v): Visit => (v.id === ref ? { ...v, feePaid: true, status: 'confirmada' } : v));
            break;
          case 'contacto':
            if (ref && !next.unlocked.includes(ref)) next.unlocked = [...next.unlocked, ref];
            break;
          case 'comissao':
            next.deals = next.deals.map((d): Deal => (d.id === ref ? { ...d, status: 'pago' } : d));
            break;
          case 'intermediario':
            next.subscription = { plan: 'intermediario', since: now.toISOString(), renewsAt: in30 };
            next.role = 'intermediario';
            break;
          case 'agencia':
            next.subscription = { plan: 'agencia', since: now.toISOString(), renewsAt: in30 };
            next.role = 'intermediario';
            break;
          case 'concierge':
            next.concierge = next.concierge.map(
              (c): ConciergeRequest => (c.id === ref ? { ...c, status: 'em_curso' } : c),
            );
            break;
        }
      }
      return next;
    });
  }, []);

  const resetDemo = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setData(fresh());
  }, []);

  const value = useMemo<Store>(
    () => ({
      ...data,
      toasts,
      notify,
      dismiss,
      setRole,
      toggleFavorite,
      isFavorite: (id: string) => data.favorites.includes(id),
      addSearch,
      removeSearch,
      addProperty,
      updateProperty,
      addLead,
      updateLead,
      addVisit,
      updateVisit,
      addDeal,
      addConcierge,
      updateConcierge,
      updatePayment,
      applyPayment,
      resetDemo,
    }),
    [
      data,
      toasts,
      notify,
      dismiss,
      setRole,
      toggleFavorite,
      addSearch,
      removeSearch,
      addProperty,
      updateProperty,
      addLead,
      updateLead,
      addVisit,
      updateVisit,
      addDeal,
      addConcierge,
      updateConcierge,
      updatePayment,
      applyPayment,
      resetDemo,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore deve ser usado dentro de StoreProvider');
  return ctx;
}
