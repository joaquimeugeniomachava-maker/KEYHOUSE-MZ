import { Link } from 'react-router-dom';
import { House, Search } from 'lucide-react';
import { useTitle } from '../hooks/useTitle';
import { LogoMark } from '../components/Logo';
import { btn } from '../components/ui';

export default function NotFound() {
  useTitle('Página não encontrada — KEYHOUSE PROPERTIES');
  return (
    <div className="container-kh flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <LogoMark className="h-16 w-16" />
      <div className="mt-6 text-[11px] font-bold uppercase tracking-[.25em] text-gold-600">Erro 404</div>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-navy-950">Esta porta não abre.</h1>
      <p className="mt-3 max-w-md text-graphite-500">A página que procura não existe ou foi movida. Mas temos muitas outras chaves para si.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className={btn('navy')}>
          <House className="h-4 w-4" /> Início
        </Link>
        <Link to="/imoveis" className={btn('gold')}>
          <Search className="h-4 w-4" /> Pesquisar imóveis
        </Link>
      </div>
    </div>
  );
}
