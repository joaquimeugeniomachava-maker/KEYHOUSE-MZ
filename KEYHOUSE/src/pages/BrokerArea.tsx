import { Link } from 'react-router-dom';
import { BadgeCheck, Crown, Rocket } from 'lucide-react';
import { useStore } from '../store/store';
import { useTitle } from '../hooks/useTitle';
import Workspace from '../components/Workspace';
import { PageHeader, btn } from '../components/ui';
import { formatDate } from '../lib/utils';

export default function BrokerArea() {
  useTitle('Painel do Intermediário — KEYHOUSE PROPERTIES');
  const { subscription } = useStore();
  return (
    <div>
      <PageHeader
        eyebrow="Área do Intermediário"
        title="Painel do Intermediário"
        microcopy="Maximize as suas comissões."
        actions={
          subscription ? (
            <span className="inline-flex items-center gap-2 rounded-xl border border-gold-400/40 bg-gold-400/10 px-4 py-2.5 text-sm font-bold text-gold-300">
              <BadgeCheck className="h-4 w-4" /> Plano {subscription.plan === 'agencia' ? 'Agência Premium' : 'Intermediário'} · renova a{' '}
              {formatDate(subscription.renewsAt, { day: '2-digit', month: 'short' })}
            </span>
          ) : (
            <Link to="/pagamento?itens=intermediario" className={btn('gold', 'md')}>
              <Crown className="h-4 w-4" /> Subscrever · 3.000 MT/mês
            </Link>
          )
        }
      >
        {!subscription && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-gold-400/25 bg-gold-400/10 p-4 text-sm text-white/80 sm:flex-row sm:items-center">
            <Rocket className="h-5 w-5 shrink-0 text-gold-300" />
            <span className="flex-1">
              <b className="text-white">A subscrição paga-se no primeiro fecho.</b> Publicações incluídas (até 25 activas), perfil certificado, gestão de
              carteira e 60% da comissão de fecho.
            </span>
            <Link to="/planos" className="text-xs font-bold text-gold-300 hover:underline">
              Comparar planos →
            </Link>
          </div>
        )}
        <div className="h-6" />
      </PageHeader>
      <Workspace advertiserId="me-broker" variant="broker" />
    </div>
  );
}
