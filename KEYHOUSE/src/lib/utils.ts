import type { Currency, Property, Visit } from './types';
import { BUY_PAYMENT, RATES, RENT_PAYMENT, TIMELINES } from './constants';

export { cn } from '../utils/cn';

export const uid = (prefix = 'id') =>
  `${prefix}-${Math.random().toString(36).slice(2, 7)}${Date.now().toString(36).slice(-3)}`;

export const pad = (n: number) => String(n).padStart(2, '0');

export const groupThousands = (n: number) => {
  const neg = n < 0;
  const s = Math.round(Math.abs(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return neg ? `-${s}` : s;
};

const FORMAT: Record<Currency, (n: string) => string> = {
  MZN: (n) => `${n} MT`,
  USD: (n) => `USD ${n}`,
  EUR: (n) => `EUR ${n}`,
  ZAR: (n) => `ZAR ${n}`,
};

export const formatMoney = (amount: number, currency: Currency = 'MZN') => FORMAT[currency](groupThousands(amount));
export const formatMT = (amount: number) => formatMoney(amount, 'MZN');
export const toMZN = (amount: number, currency: Currency) => amount * RATES[currency];
export const fromMZN = (amount: number, currency: Currency) => amount / RATES[currency];

export function compact(n: number) {
  if (n >= 1e6) {
    const v = n / 1e6;
    return `${v >= 10 ? Math.round(v) : v.toFixed(1).replace('.0', '').replace('.', ',')}M`;
  }
  if (n >= 1e3) return `${Math.round(n / 1e3)}k`;
  return String(Math.round(n));
}

export const pinLabel = (p: Pick<Property, 'price' | 'currency'>) =>
  p.currency === 'MZN' ? `${compact(p.price)} MT` : p.currency === 'USD' ? `$${compact(p.price)}` : `${compact(p.price)} ${p.currency}`;

export const priceLabel = (p: Pick<Property, 'price' | 'currency' | 'purpose'>) =>
  `${formatMoney(p.price, p.currency)}${p.purpose === 'Arrendamento' ? '/mês' : ''}`;

export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const formatDate = (
  iso: string,
  opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' },
) => new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString('pt-PT', opts);

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export const weekday = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('pt-PT', { weekday: 'short' }).replace('.', '');

export function relativeTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'agora mesmo';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
  const d = Math.floor(diff / 86400);
  return d === 1 ? 'ontem' : `há ${d} dias`;
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /[A-Za-zÀ-ÿ]/.test(w[0] ?? ''))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export const maskName = (name: string) => {
  const [first, ...rest] = name.split(' ');
  return [first, ...rest.map((w) => `${w[0]}.`)].join(' ');
};

export const maskPhone = (phone: string) => {
  const d = phone.replace(/\D/g, '').slice(-9);
  return `+258 ${d.slice(0, 2)} ••• ••${d.slice(-2)}`;
};

export const phoneDigits = (phone: string) => {
  const d = phone.replace(/\D/g, '');
  return d.length === 9 ? `258${d}` : d;
};

export const waLink = (phone: string, text: string) => `https://wa.me/${phoneDigits(phone)}?text=${encodeURIComponent(text)}`;

export const isMzMobile = (phone: string, prefixes: string[] = ['82', '83', '84', '85', '86', '87']) => {
  const d = phone.replace(/\D/g, '').replace(/^258(?=\d{9}$)/, '');
  return d.length === 9 && prefixes.includes(d.slice(0, 2));
};

export const isValidPhone = (phone: string) => isMzMobile(phone) || /^\+\d{10,15}$/.test(phone.replace(/[\s-]/g, ''));

export const floorLabel = (f: number) => (f === 0 ? 'Rés-do-chão' : f < 0 ? `Cave ${Math.abs(f)}` : `${f}.º andar`);
export const yesNo = (b: boolean) => (b ? 'Sim' : 'Não');

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function downloadCSV(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n');
  downloadFile(filename, `\ufeff${csv}`, 'text/csv;charset=utf-8');
}

export function downloadICS(visit: Visit, property: Property) {
  const [h, m] = visit.time.split(':').map(Number);
  const day = visit.date.replace(/-/g, '');
  const stamp = `${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KEYHOUSE PROPERTIES//PT',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${visit.id}@keyhouse.co.mz`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${day}T${pad(h)}${pad(m)}00`,
    `DTEND:${day}T${pad(h + 1)}${pad(m)}00`,
    `SUMMARY:Visita KEYHOUSE — ${property.title}`,
    `LOCATION:${property.neighborhood}\\, ${property.city}`,
    `DESCRIPTION:${visit.mode === 'video' ? 'Visita por videochamada' : 'Visita presencial'} — ref. ${visit.id}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Lembrete de visita KEYHOUSE',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  downloadFile(`visita-${visit.id}.ics`, lines.join('\r\n'), 'text/calendar;charset=utf-8');
}

export function resizeImage(file: File, max = 1280, quality = 0.74): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Imagem inválida'));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(String(reader.result));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export const paymentReference = () => {
  const d = new Date();
  return `KH-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
};

export interface QualInput {
  zone: string;
  budget: number;
  currency: Currency;
  bedrooms: number;
  timeline: string;
  payment: string;
}

/** Motor de qualificação de leads (0–100). Qualificado ≥ 60 e orçamento compatível. */
export function scoreLead(input: QualInput, p: Property) {
  const budgetMZN = toMZN(input.budget, input.currency);
  const priceMZN = toMZN(p.price, p.currency);
  const ratio = priceMZN > 0 ? budgetMZN / priceMZN : 0;
  const budgetPts = ratio >= 0.95 ? 35 : ratio >= 0.85 ? 28 : ratio >= 0.7 ? 15 : ratio >= 0.5 ? 5 : 0;
  const timelinePts = TIMELINES.find((t) => t.id === input.timeline)?.points ?? 0;
  const payList = p.purpose === 'Venda' ? BUY_PAYMENT : RENT_PAYMENT;
  const payPts = payList.find((x) => x.id === input.payment)?.points ?? 0;
  const zonePts = input.zone === p.neighborhood || input.zone === p.city ? 10 : input.zone === 'Flexível' ? 6 : 3;
  const bedPts =
    p.bedrooms === 0 || input.bedrooms === 0
      ? 5
      : input.bedrooms <= p.bedrooms
        ? 5
        : input.bedrooms - p.bedrooms === 1
          ? 2
          : 0;
  const breakdown = [
    { label: 'Orçamento compatível', points: budgetPts, max: 35 },
    { label: 'Prazo de decisão', points: timelinePts, max: 25 },
    { label: p.purpose === 'Venda' ? 'Capacidade financeira' : 'Perfil do arrendatário', points: payPts, max: 25 },
    { label: 'Zona pretendida', points: zonePts, max: 10 },
    { label: 'Quartos / tipologia', points: bedPts, max: 5 },
  ];
  const score = breakdown.reduce((s, b) => s + b.points, 0);
  return { score, breakdown, qualified: score >= 60 && budgetPts >= 15 };
}
