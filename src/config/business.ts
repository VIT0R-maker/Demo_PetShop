export type Service = {
  id: string
  title: string
  description: string
  cta: string
  image: string
  alt: string
  price: string | null
  duration: string | null
}

export type BusinessConfig = {
  name: string
  description: string
  whatsapp: string | null
  instagram: string | null
  address: string | null
  hours: string | null
  directionsUrl: string | null
  mapEmbedUrl: string | null
  services: Service[]
}

export const services: Service[] = [
  {
    id: 'banho',
    title: 'Banho',
    description: 'Limpeza e cuidado com a pelagem para renovar a sensação de conforto.',
    cta: 'Consultar banho',
    image: 'service-bath.webp',
    alt: 'Toalhas macias e frasco de produto para banho sobre uma bancada.',
    price: null,
    duration: null,
  },
  {
    id: 'tosa',
    title: 'Tosa',
    description: 'Acabamento pensado para a pelagem e para a rotina do seu pet.',
    cta: 'Consultar tosa',
    image: 'service-grooming.webp',
    alt: 'Tesoura, pente e máquina de tosa sobre uma toalha.',
    price: null,
    duration: null,
  },
  {
    id: 'escovacao',
    title: 'Escovação',
    description: 'Atenção aos fios e ao acabamento, com cuidado em cada movimento.',
    cta: 'Consultar escovação',
    image: 'service-brushing.webp',
    alt: 'Escova de madeira junto à pelagem de um cão.',
    price: null,
    duration: null,
  },
  {
    id: 'unhas',
    title: 'Corte de unhas',
    description: 'Um cuidado pontual que merece atenção e manejo gentil.',
    cta: 'Consultar disponibilidade',
    image: 'service-nails.webp',
    alt: 'Cortador de unhas para pets sobre uma toalha verde-sálvia.',
    price: null,
    duration: null,
  },
  {
    id: 'hidratacao',
    title: 'Hidratação',
    description: 'Uma opção de cuidado para a pelagem, conforme avaliação da equipe.',
    cta: 'Saber mais',
    image: 'service-hydration.webp',
    alt: 'Potes e frascos de cuidado com a pelagem sobre uma bancada.',
    price: null,
    duration: null,
  },
  {
    id: 'produtos',
    title: 'Produtos para pets',
    description: 'Itens de higiene e acessórios para acompanhar os cuidados em casa.',
    cta: 'Consultar produtos',
    image: 'service-products.webp',
    alt: 'Produtos de higiene, brinquedos e tigela para pets.',
    price: null,
    duration: null,
  },
]

// Preencha somente com dados reais da empresa. WhatsApp: país + DDD + número.
// URLs devem ser HTTPS. O mapa só aparece quando endereço e URL estão configurados.
export const business: BusinessConfig = {
  name: 'Casa Pet',
  description: 'Banho, tosa e cuidados para cães e gatos, com carinho em cada detalhe.',
  whatsapp: null,
  instagram: null,
  address: null,
  hours: null,
  directionsUrl: null,
  mapEmbedUrl: null,
  services,
}
