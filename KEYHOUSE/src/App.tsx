import { useEffect, type ReactNode } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { StoreProvider } from './store/store';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileTabBar from './components/MobileTabBar';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from './components/ui';
import Landing from './pages/Landing';
import SearchPage from './pages/Search';
import PropertyDetail from './pages/PropertyDetail';
import Publish from './pages/Publish';
import Payment from './pages/Payment';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import ClientArea from './pages/ClientArea';
import OwnerArea from './pages/OwnerArea';
import BrokerArea from './pages/BrokerArea';
import AdminArea from './pages/AdminArea';
import NotFound from './pages/NotFound';
import { cn } from './lib/utils';

/** Reinicia o ecrã de pagamento sempre que o pedido (query string) muda */
function PaymentRoute() {
  const { search } = useLocation();
  return <Payment key={search} />;
}

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';
  const isDetail = pathname.startsWith('/imovel/');
  const hideTabBar = isDetail || pathname === '/pagamento';
  return (
    <div className={cn('flex min-h-screen flex-col', (!hideTabBar || isDetail) && 'pb-16 md:pb-0')}>
      <Header />
      <main className={cn('flex-1', !isLanding && 'pt-16 sm:pt-20')}>{children}</main>
      <Footer />
      {!hideTabBar && <MobileTabBar />}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <HashRouter>
          <ScrollManager />
          <Layout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/imoveis" element={<SearchPage />} />
              <Route path="/imovel/:id" element={<PropertyDetail />} />
              <Route path="/publicar" element={<Publish />} />
              <Route path="/pagamento" element={<PaymentRoute />} />
              <Route path="/planos" element={<Pricing />} />
              <Route path="/painel" element={<Dashboard />} />
              <Route path="/cliente" element={<ClientArea />} />
              <Route path="/proprietario" element={<OwnerArea />} />
              <Route path="/intermediario" element={<BrokerArea />} />
              <Route path="/admin" element={<AdminArea />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </HashRouter>
      </StoreProvider>
    </ErrorBoundary>
  );
}
