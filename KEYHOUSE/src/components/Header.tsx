import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  ChevronDown,
  Heart,
  House,
  LayoutDashboard,
  Menu,
  Plus,
  RefreshCw,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import Logo from './Logo';
import { btn } from './ui';
import { useStore } from '../store/store';
import { ROLE_LABEL } from '../lib/constants';
import type { Role } from '../lib/types';
import { cn } from '../lib/utils';

const NAV = [
  { to: '/imoveis?finalidade=Venda', label: 'Comprar' },
  { to: '/imoveis?finalidade=Arrendamento', label: 'Arrendar' },
  { to: '/imoveis?categoria=comercial', label: 'Comercial' },
  { to: '/imoveis?categoria=investimento', label: 'Investir' },
  { to: '/planos', label: 'Planos' },
];

const AREAS: { role: Role; label: string; desc: string; to: string; icon: typeof User }[] = [
  { role: 'cliente', label: 'Cliente', desc: 'Visitas, favoritos e pesquisas', to: '/cliente', icon: User },
  { role: 'proprietario', label: 'Proprietário', desc: 'Os meus imóveis e leads', to: '/proprietario', icon: House },
  { role: 'intermediario', label: 'Intermediário', desc: 'Carteira, comissões, destaques', to: '/intermediario', icon: Briefcase },
  { role: 'admin', label: 'Administrador', desc: 'Validação, pagamentos, relatórios', to: '/admin', icon: ShieldCheck },
];

export default function Header() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { favorites, role, setRole, resetDemo, notify } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLanding = pathname === '/';

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname, search]);

  const transparent = isLanding && !scrolled && !mobileOpen;
  const go = (r: Role, to: string) => {
    setRole(r);
    navigate(to);
  };
  const reset = () => {
    resetDemo();
    notify('Demonstração reposta com os dados iniciais.', 'info');
    navigate('/');
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        transparent ? 'bg-transparent' : 'bg-navy-950/95 shadow-[0_1px_0_rgba(214,180,108,.18)] backdrop-blur-xl',
      )}
    >
      <div className="container-kh flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link to="/" aria-label="KEYHOUSE PROPERTIES — início">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = `${pathname}${search}` === n.to || (n.to === '/planos' && pathname === '/planos');
            return (
              <NavLink
                key={n.label}
                to={n.to}
                className={cn(
                  'rounded-lg px-3.5 py-2 text-[14px] font-semibold transition',
                  active ? 'text-gold-300' : 'text-white/80 hover:text-white',
                )}
              >
                {n.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cliente?tab=favoritos"
            className="relative hidden h-10 w-10 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white sm:grid"
            aria-label="Favoritos"
          >
            <Heart className="h-5 w-5" />
            {favorites.length > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold-400 px-1 text-[10px] font-extrabold text-navy-950">
                {favorites.length}
              </span>
            )}
          </Link>

          <div ref={menuRef} className="relative hidden md:block">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2.5 rounded-full border border-white/15 py-1.5 pl-1.5 pr-3 text-white transition hover:border-gold-400/50"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-linear-to-b from-gold-300 to-gold-500 text-navy-950">
                <User className="h-4 w-4" />
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[9px] font-bold uppercase tracking-[.2em] text-white/50">Perfil demo</span>
                <span className="block text-[13px] font-semibold">{ROLE_LABEL[role]}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-white/60" />
            </button>
            {menuOpen && (
              <>
                <div className="absolute right-0 z-10 mt-3 w-80 animate-rise overflow-hidden rounded-2xl bg-white p-2 shadow-lift ring-1 ring-navy-900/10">
                  <div className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[.2em] text-graphite-400">
                    Entrar como
                  </div>
                  {AREAS.map((a) => (
                    <button
                      key={a.role}
                      onClick={() => go(a.role, a.to)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-ivory',
                        role === a.role && 'bg-gold-50',
                      )}
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-950 text-gold-300">
                        <a.icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-bold text-navy-950">{a.label}</span>
                        <span className="block text-xs text-graphite-500">{a.desc}</span>
                      </span>
                      {role === a.role && <span className="h-2 w-2 rounded-full bg-gold-500" />}
                    </button>
                  ))}
                  <div className="my-2 h-px bg-navy-900/5" />
                  <Link
                    to="/painel"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-navy-950 hover:bg-ivory"
                  >
                    <LayoutDashboard className="h-4 w-4 text-gold-600" /> Painel de Controlo
                  </Link>
                  <button
                    onClick={reset}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-graphite-500 hover:bg-ivory"
                  >
                    <RefreshCw className="h-4 w-4" /> Repor demonstração
                  </button>
                </div>
              </>
            )}
          </div>

          <Link to="/publicar" className={btn('gold', 'sm', 'hidden sm:inline-flex')}>
            <Plus className="h-4 w-4" /> Publicar imóvel
          </Link>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full text-white hover:bg-white/10 lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-4rem)] animate-fade overflow-y-auto border-t border-white/10 bg-navy-950 lg:hidden">
          <div className="container-kh py-4">
            <div className="grid gap-1">
              {NAV.map((n) => (
                <Link key={n.label} to={n.to} className="rounded-xl px-3 py-3 text-[15px] font-semibold text-white/90 hover:bg-white/5">
                  {n.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 text-[10px] font-bold uppercase tracking-[.2em] text-gold-300">Áreas (perfil demo)</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {AREAS.map((a) => (
                <button
                  key={a.role}
                  onClick={() => go(a.role, a.to)}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm font-semibold text-white',
                    role === a.role ? 'border-gold-400/60 bg-gold-400/10' : 'border-white/10',
                  )}
                >
                  <a.icon className="h-4 w-4 text-gold-300" /> {a.label}
                </button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link to="/painel" className={btn('glass', 'md')}>
                <LayoutDashboard className="h-4 w-4" /> Painel
              </Link>
              <Link to="/publicar" className={btn('gold', 'md')}>
                <Plus className="h-4 w-4" /> Publicar
              </Link>
            </div>
            <button onClick={reset} className="mt-3 w-full py-2 text-xs font-semibold text-white/50">
              Repor demonstração
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
