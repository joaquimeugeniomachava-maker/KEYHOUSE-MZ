import { Link, useLocation } from 'react-router-dom';
import { Heart, House, Plus, Search, User } from 'lucide-react';
import { useStore } from '../store/store';
import { ROLE_PATH } from '../lib/constants';
import { cn } from '../lib/utils';

export default function MobileTabBar() {
  const { pathname, search } = useLocation();
  const { role } = useStore();
  const items = [
    { to: '/', label: 'Início', icon: House, active: pathname === '/' },
    { to: '/imoveis', label: 'Pesquisar', icon: Search, active: pathname === '/imoveis' },
    { to: '/publicar', label: 'Publicar', icon: Plus, active: pathname === '/publicar', primary: true },
    { to: '/cliente?tab=favoritos', label: 'Favoritos', icon: Heart, active: pathname === '/cliente' && search.includes('favoritos') },
    {
      to: ROLE_PATH[role],
      label: 'Conta',
      icon: User,
      active: ['/cliente', '/proprietario', '/intermediario', '/admin', '/painel'].includes(pathname) && !search.includes('favoritos'),
    },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5">
        {items.map((it) =>
          it.primary ? (
            <Link key={it.label} to={it.to} className="flex flex-col items-center justify-center py-1.5">
              <span className="-mt-6 grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-b from-gold-300 to-gold-500 text-navy-950 shadow-gold ring-4 ring-navy-950">
                <it.icon className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="mt-1 text-[10px] font-bold text-gold-300">{it.label}</span>
            </Link>
          ) : (
            <Link
              key={it.label}
              to={it.to}
              className={cn('flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold', it.active ? 'text-gold-300' : 'text-white/55')}
            >
              <it.icon className="h-5 w-5" />
              {it.label}
            </Link>
          ),
        )}
      </div>
    </nav>
  );
}
