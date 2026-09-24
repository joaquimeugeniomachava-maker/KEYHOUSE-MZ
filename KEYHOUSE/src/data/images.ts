const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`;

export const IMG = {
  hero: 'images/hero.jpg',
  apartment: 'images/apartment-polana.jpg',
  villa: 'images/villa-sommerschield.jpg',
  penthouse: 'images/penthouse-marginal.jpg',
  office: 'images/office-baixa.jpg',
  beach: 'images/beach-ponta-do-ouro.jpg',
  lodge: 'images/lodge-vilankulo.jpg',
  townhouse: 'images/townhouse-matola.jpg',
  warehouse: 'images/warehouse-machava.jpg',
  bedroom: 'images/interior-bedroom.jpg',
  kitchen1: px(6587896),
  kitchen2: px(8142459),
  kitchen3: px(6538939),
  bath1: px(7195883),
  bath2: px(7045761),
  retail1: px(13068364),
  retail2: px(8311880),
  colonial1: px(2564873),
  colonial2: px(2564872),
  farm1: px(32940727),
  farm2: px(17973243),
  beachhouse: px(14011553),
  beach2: px(34855137),
  event1: px(17023018),
  event2: px(19569865),
  room1: px(6636242),
  room2: px(7045354),
  yard1: px(9914005),
  yard2: px(38259276),
};

export const FALLBACK_IMG = IMG.apartment;
