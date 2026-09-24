import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import Logo from './Logo';
import { BRAND } from '../lib/constants';

const COLS = [
  {
    title: 'Imóveis',
    links: [
      ['Comprar', '/imoveis?finalidade=Venda'],
      ['Arrendar', '/imoveis?finalidade=Arrendamento'],
      ['Comercial & escritórios', '/imoveis?categoria=comercial'],
      ['Terrenos & praia', '/imoveis?categoria=terrenos'],
      ['Turismo & investimento', '/imoveis?categoria=investimento'],
    ],
  },
  {
    title: 'Anunciantes',
    links: [
      ['Publicar imóvel', '/publicar'],
      ['Planos & serviços', '/planos'],
      ['Área do Proprietário', '/proprietario'],
      ['Área do Intermediário', '/intermediario'],
    ],
  },
  {
    title: 'KEYHOUSE',
    links: [
      ['Concierge Imobiliário', '/planos#concierge'],
      ['A Minha Área', '/cliente'],
      ['Painel de Controlo', '/painel'],
      ['Administração', '/admin'],
    ],
  },
];

export function PaymentBadges({ dark = true }: { dark?: boolean }) {
  const base = dark ? 'border-white/10 bg-white/5 text-white' : 'border-navy-900/10 bg-white text-navy-950';
  return (
    <div className="flex flex-wrap gap-2">
      <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-extrabold ${base}`}>
        <span className="h-2 w-2 rounded-full bg-[#E60000]" /> M-Pesa
      </span>
      <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-extrabold ${base}`}>
        <span className="h-2 w-2 rounded-full bg-[#F7941D]" /> e-Mola
      </span>
      <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-extrabold ${base}`}>
        <span className="h-2 w-2 rounded-full bg-[#0070E0]" /> PayPal
      </span>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div className="kh-grid absolute inset-0 opacity-[.035]" />
      <div className="container-kh relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm font-serif text-xl italic leading-snug text-white/70">
              O padrão premium do imobiliário moçambicano.
            </p>
            <div className="mt-6 space-y-2.5 text-sm text-white/60">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-gold-400" /> {BRAND.address}
              </div>
              <a
                href={`https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 hover:text-white"
              >
                <MessageCircle className="h-4 w-4 text-gold-400" /> WhatsApp {BRAND.whatsappDisplay}
              </a>
              <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2.5 hover:text-white">
                <Mail className="h-4 w-4 text-gold-400" /> {BRAND.email}
              </a>
            </div>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <div className="text-[11px] font-bold uppercase tracking-[.22em] text-gold-300">{c.title}</div>
              <ul className="mt-5 space-y-3 text-sm">
                {c.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-white/65 transition hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <PaymentBadges />
          <div className="flex items-center gap-2 text-xs text-white/45">
            <ShieldCheck className="h-4 w-4 text-gold-400" />
            Demonstração interactiva — pagamentos e notificações simulados.
          </div>
          <div className="text-xs text-white/45">© 2026 {BRAND.name}. Todos os direitos reservados.</div>
        </div>
      </div>
    </footer>
  );
}
