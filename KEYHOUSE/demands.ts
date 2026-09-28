import type { Demand } from '../lib/types';

/**
 * Pedidos de procura ("Procura-se").
 * PED-0001 é um pedido real de cliente. O contacto da cliente NÃO fica no site:
 * é gerido pela KEYHOUSE (contacto protegido). As propostas chegam ao WhatsApp da KEYHOUSE.
 */
export const SEED_DEMANDS: Demand[] = [
  {
    id: 'PED-0001',
    title: 'Espaço para criação de animais de pequeno porte, principalmente aves',
    purpose: 'Arrendamento',
    types: ['Quintal', 'Terreno vedado', 'Espaço com infraestrutura adaptável'],
    city: 'Marracuene',
    zone: 'Kumbeza — primeira rotunda',
    minArea: 500,
    budget: null,
    currency: 'MZN',
    negotiable: true,
    use: 'Pequena criação de aves',
    requirements: ['Bom acesso', 'Segurança'],
    description:
      'Procura-se um local com bom acesso, segurança e condições para desenvolver uma pequena criação de aves. Havendo condições, a cliente visita o espaço.',
    timeline: '',
    clientName: 'Cliente KEYHOUSE',
    clientPhone: '',
    status: 'ativo',
    createdAt: new Date(Date.now() - 3 * 36e5).toISOString(),
  },
];
