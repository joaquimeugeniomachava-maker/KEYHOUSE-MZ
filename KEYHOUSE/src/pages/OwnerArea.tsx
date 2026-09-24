import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { useTitle } from '../hooks/useTitle';
import Workspace from '../components/Workspace';
import { PageHeader, btn } from '../components/ui';

export default function OwnerArea() {
  useTitle('Os Meus Imóveis — KEYHOUSE PROPERTIES');
  return (
    <div>
      <PageHeader
        eyebrow="Área do Proprietário"
        title="Os meus imóveis"
        microcopy="Gira os seus imóveis num só lugar."
        actions={
          <Link to="/planos" className={btn('glass', 'md')}>
            <Crown className="h-4 w-4 text-gold-300" /> Ver planos
          </Link>
        }
      >
        <div className="h-6" />
      </PageHeader>
      <Workspace advertiserId="me-owner" variant="owner" />
    </div>
  );
}
