import { Product, InstagramPost, Order, RawMaterial, MaterialPurchase, MaterialMovement, Customer } from '@/types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Bolsas Temáticas Cumpleaños',
    slug: 'bolsas-cumpleanos-tematicas',
    category: 'cumpleanos',
    description: 'Bolsas impresas a todo color para souvenirs, golosinas y cumpleaños infantiles. Diseños variados: superhéroes, princesas, personajes y personalizadas con nombre.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    materials: ['Papel Ilustración 150g', 'Papel Kraft Blanco'],
    sizes: ['12x17x6 cm', '15x22x7 cm', '20x30x8 cm'],
    moqDescription: 'Pack mínimo de 20 unidades',
    featured: true,
    variants: [
      { id: 'var-1', name: 'Pack x20 (12x17 cm)', size: '12x17x6 cm', material: 'Papel Ilustración 150g', minQuantity: 20, price: 9500 },
      { id: 'var-2', name: 'Pack x50 (12x17 cm)', size: '12x17x6 cm', material: 'Papel Ilustración 150g', minQuantity: 50, price: 21500 },
      { id: 'var-3', name: 'Pack x20 (15x22 cm)', size: '15x22x7 cm', material: 'Papel Ilustración 150g', minQuantity: 20, price: 12000 },
    ]
  },
  {
    id: 'prod-2',
    name: 'Pochocleras & Cajas Golosineras',
    slug: 'pochocleras-golosineras',
    category: 'pochocleras',
    description: 'Cajas pochocleras armables automáticas. Ideales para cines, cumpleaños, candy bars y eventos. Cartulina tríplex rígida con impresión brillante.',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80',
    materials: ['Cartulina Tríplex 240g', 'Cartón Kraft'],
    sizes: ['Chica (8x14 cm)', 'Mediana (10x18 cm)', 'Grande (13x22 cm)'],
    moqDescription: 'Pack mínimo de 25 unidades',
    featured: true,
    variants: [
      { id: 'var-4', name: 'Pack x25 Chica', size: 'Chica (8x14 cm)', material: 'Cartulina Tríplex 240g', minQuantity: 25, price: 8500 },
      { id: 'var-5', name: 'Pack x50 Mediana', size: 'Mediana (10x18 cm)', material: 'Cartulina Tríplex 240g', minQuantity: 50, price: 18000 },
      { id: 'var-6', name: 'Pack x100 Grande', size: 'Grande (13x22 cm)', material: 'Cartulina Tríplex 240g', minQuantity: 100, price: 34000 },
    ]
  },
  {
    id: 'prod-3',
    name: 'Bolsas de Friselina con Manija',
    slug: 'bolsas-friselina-comerciales',
    category: 'comercio',
    description: 'Bolsas ecológicas reutilizables de friselina (TNT 80g). Confección termosellada o cosida con manija reforzada. Gran durabilidad para comercios y boutiques.',
    image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=600&auto=format&fit=crop&q=80',
    materials: ['Friselina 80g', 'Friselina 100g'],
    sizes: ['20x30 cm', '30x40 cm', '40x45x10 cm'],
    moqDescription: 'Compra mínima por 50 unidades',
    featured: true,
    variants: [
      { id: 'var-7', name: 'Pack x50 (20x30 cm)', size: '20x30 cm', material: 'Friselina 80g', handleType: 'Troquelada / Riñón', minQuantity: 50, price: 19000 },
      { id: 'var-8', name: 'Pack x50 (30x40 cm)', size: '30x40 cm', material: 'Friselina 80g', handleType: 'Cinta', minQuantity: 50, price: 27500 },
      { id: 'var-9', name: 'Pack x100 (40x45x10 cm)', size: '40x45x10 cm', material: 'Friselina 80g', handleType: 'Cinta', minQuantity: 100, price: 62000 },
    ]
  },
  {
    id: 'prod-4',
    name: 'Bolsas Papel Kraft Delivery & Boutique',
    slug: 'bolsas-papel-kraft',
    category: 'comercio',
    description: 'Bolsas de papel kraft marrón y blanco con base cuadrada. Con o sin manija retorcida de papel. Perfectas para gastronomía, indumentaria y regalos.',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    materials: ['Papel Kraft 80g', 'Papel Kraft 120g'],
    sizes: ['18x24x8 cm', '26x36x12 cm', '32x40x14 cm'],
    moqDescription: 'Pack mínimo de 50 unidades',
    featured: true,
    variants: [
      { id: 'var-10', name: 'Pack x50 (18x24x8 cm)', size: '18x24x8 cm', material: 'Papel Kraft 80g', handleType: 'Sin Manija (Fuelle)', minQuantity: 50, price: 14000 },
      { id: 'var-11', name: 'Pack x50 (26x36x12 cm)', size: '26x36x12 cm', material: 'Papel Kraft 120g', handleType: 'Manija Retorcida', minQuantity: 50, price: 29000 },
    ]
  },
  {
    id: 'prod-5',
    name: 'Bolsas Personalizadas con tu Logo',
    slug: 'bolsas-personalizadas-logo',
    category: 'personalizadas',
    description: 'Fabricación a medida con la identidad de tu marca. Impresión en serigrafía o flexografía a 1, 2 o más tintas. Asesoramiento en diseño sin cargo.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    materials: ['Papel Kraft', 'Friselina 80g', 'Cartón Tríplex'],
    sizes: ['A elección según requerimiento'],
    moqDescription: 'Pedido mínimo: 100 unidades con logo',
    featured: true,
    variants: [
      { id: 'var-12', name: '100u Friselina 30x40 (1 tinta)', size: '30x40 cm', material: 'Friselina 80g', handleType: 'Cinta', minQuantity: 100, price: 68000 },
      { id: 'var-13', name: '250u Kraft 26x36 (1 tinta)', size: '26x36x12 cm', material: 'Papel Kraft 120g', handleType: 'Manija Retorcida', minQuantity: 250, price: 155000 },
    ]
  }
];

export const MOCK_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    caption: '¡Salieron 500 bolsas en friselina boutique con manija cinta para @indumentaria_luna! ✨ Gracias por confiar en VQ Bolsas.',
    mediaUrl: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=600&auto=format&fit=crop&q=80',
    permalink: 'https://instagram.com/vq_bolsas',
    timestamp: 'Hace 2 días',
    likeCount: 42
  },
  {
    id: 'ig-2',
    caption: 'Producción de pochocleras temáticas para el cumple de Benja 🍿🎉 Impresión full color en cartulina tríplex.',
    mediaUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80',
    permalink: 'https://instagram.com/vq_bolsas',
    timestamp: 'Hace 4 días',
    likeCount: 68
  },
  {
    id: 'ig-3',
    caption: 'Bolsas Kraft delivery con fuelle ancho listas para despachar. Resistencia y calidad garantizada 🙌📦',
    mediaUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    permalink: 'https://instagram.com/vq_bolsas',
    timestamp: 'Hace 1 semana',
    likeCount: 55
  },
  {
    id: 'ig-4',
    caption: 'Detalle de impresión en serigrafía a 2 tintas. Hacemos realidad el packaging de tu marca.',
    mediaUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    permalink: 'https://instagram.com/vq_bolsas',
    timestamp: 'Hace 1 semana',
    likeCount: 89
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'VQ-1001',
    createdAt: '2026-09-20T14:30:00Z',
    customerName: 'Mariana López',
    businessName: 'Boutique Chicas Chic',
    customerPhone: '+5491145678901',
    customerAddress: 'Av. Corrientes 3420',
    customerCity: 'CABA',
    totalAmount: 68000,
    depositAmount: 34000,
    balanceDue: 34000,
    status: 'en_taller',
    paymentMethod: 'Transferencia Bancaria',
    estimatedDeliveryDate: '2026-09-25',
    items: [
      {
        id: 'item-1',
        productId: 'prod-5',
        productName: 'Bolsas Personalizadas con tu Logo',
        category: 'personalizadas',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
        material: 'Friselina 80g',
        size: '30x40 cm',
        handleType: 'Cinta',
        quantity: 100,
        unitPrice: 680,
        totalPrice: 68000,
        customNotes: 'Logo a 1 color fucsia en el frente.'
      }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: 'VQ-1002',
    createdAt: '2026-09-21T09:15:00Z',
    customerName: 'Santiago Romero',
    businessName: 'Romero Eventos & Cumpleaños',
    customerPhone: '+5491167891234',
    customerAddress: 'San Martín 840',
    customerCity: 'Quilmes, BsAs',
    totalAmount: 39500,
    depositAmount: 39500,
    balanceDue: 0,
    status: 'nuevo',
    paymentMethod: 'Efectivo',
    estimatedDeliveryDate: '2026-09-23',
    items: [
      {
        id: 'item-2',
        productId: 'prod-1',
        productName: 'Bolsas Temáticas Cumpleaños',
        category: 'cumpleanos',
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
        material: 'Papel Ilustración 150g',
        size: '12x17x6 cm',
        quantity: 50,
        unitPrice: 430,
        totalPrice: 21500,
        customNotes: 'Diseño Spiderman y Stitch variado.'
      },
      {
        id: 'item-3',
        productId: 'prod-2',
        productName: 'Pochocleras & Cajas Golosineras',
        category: 'pochocleras',
        image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80',
        material: 'Cartulina Tríplex 240g',
        size: 'Mediana (10x18 cm)',
        quantity: 50,
        unitPrice: 360,
        totalPrice: 18000
      }
    ]
  },
  {
    id: 'ord-103',
    orderNumber: 'VQ-1003',
    createdAt: '2026-09-18T11:00:00Z',
    customerName: 'Carolina Rossi',
    businessName: 'Lencería & Calzados Roma',
    customerPhone: '+5492346512345',
    customerAddress: 'Pellegrini 230',
    customerCity: 'Chivilcoy',
    totalAmount: 85000,
    depositAmount: 0,
    balanceDue: 85000,
    status: 'nuevo',
    paymentMethod: 'Pendiente',
    estimatedDeliveryDate: '2026-09-22',
    notes: 'Ingresó por web. Requiere contactar para confirmar muestra de logo.',
    items: [
      {
        id: 'item-4',
        productId: 'prod-5',
        productName: 'Bolsas Personalizadas con tu Logo',
        category: 'personalizadas',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
        material: 'Friselina 80g',
        size: '40x45x10 cm',
        handleType: 'Cinta reforzada',
        quantity: 150,
        unitPrice: 566,
        totalPrice: 85000,
        customNotes: 'Logo en serigrafía dorada sobre friselina negra.'
      }
    ]
  },
  {
    id: 'ord-104',
    orderNumber: 'VQ-1004',
    createdAt: '2026-09-15T16:20:00Z',
    customerName: 'Martín Benítez',
    businessName: 'Hamburguesería Crave',
    customerPhone: '+5491133445566',
    customerAddress: 'Av. Soarez 154',
    customerCity: 'Chivilcoy',
    totalAmount: 48000,
    depositAmount: 24000,
    balanceDue: 24000,
    status: 'en_taller',
    paymentMethod: 'Transferencia',
    estimatedDeliveryDate: '2026-09-21',
    notes: 'Pedido demorado en taller: secado de tintas especiales.',
    items: [
      {
        id: 'item-5',
        productId: 'prod-4',
        productName: 'Bolsas Papel Kraft Delivery & Boutique',
        category: 'comercio',
        image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
        material: 'Papel Kraft 120g',
        size: '26x36x12 cm',
        handleType: 'Manija Retorcida',
        quantity: 100,
        unitPrice: 480,
        totalPrice: 48000,
        customNotes: 'Impresión logo burger Kraft delivery.'
      }
    ]
  }
];

export const INITIAL_MATERIALS: RawMaterial[] = [
  {
    id: 'mat-1',
    name: 'Cartulina Tríplex 240g',
    category: 'carton_papel',
    unit: 'pliegos',
    currentStock: 350,
    minStockAlert: 50,
    costPerUnit: 180,
    lastUpdated: '2026-09-20',
  },
  {
    id: 'mat-2',
    name: 'Papel Kraft Marrón 120g',
    category: 'carton_papel',
    unit: 'pliegos',
    currentStock: 620,
    minStockAlert: 100,
    costPerUnit: 110,
    lastUpdated: '2026-09-21',
  },
  {
    id: 'mat-3',
    name: 'Bobina Friselina 80g (Negro)',
    category: 'friselina',
    unit: 'metros',
    currentStock: 180,
    minStockAlert: 40,
    costPerUnit: 340,
    lastUpdated: '2026-09-18',
  },
  {
    id: 'mat-4',
    name: 'Bobina Friselina 80g (Blanco)',
    category: 'friselina',
    unit: 'metros',
    currentStock: 220,
    minStockAlert: 40,
    costPerUnit: 340,
    lastUpdated: '2026-09-19',
  },
  {
    id: 'mat-5',
    name: 'Cinta Reforzada para Manijas',
    category: 'manijas_cordones',
    unit: 'metros',
    currentStock: 500,
    minStockAlert: 80,
    costPerUnit: 45,
    lastUpdated: '2026-09-15',
  },
  {
    id: 'mat-6',
    name: 'Cordón de Algodón 5mm',
    category: 'manijas_cordones',
    unit: 'metros',
    currentStock: 250,
    minStockAlert: 50,
    costPerUnit: 60,
    lastUpdated: '2026-09-16',
  },
  {
    id: 'mat-7',
    name: 'Tinta Serigráfica al Agua (Negro)',
    category: 'tintas',
    unit: 'kg',
    currentStock: 8,
    minStockAlert: 2,
    costPerUnit: 8500,
    lastUpdated: '2026-09-10',
  },
  {
    id: 'mat-8',
    name: 'Tinta Serigráfica al Agua (Blanco)',
    category: 'tintas',
    unit: 'kg',
    currentStock: 6,
    minStockAlert: 2,
    costPerUnit: 9200,
    lastUpdated: '2026-09-10',
  },
];

export const INITIAL_PURCHASES: MaterialPurchase[] = [
  {
    id: 'pur-1',
    date: '2026-09-15',
    materialId: 'mat-1',
    materialName: 'Cartulina Tríplex 240g',
    supplier: 'Papelera Central SRL',
    quantity: 500,
    unit: 'pliegos',
    unitPrice: 180,
    totalCost: 90000,
    notes: 'Factura A #0004-1294',
  },
  {
    id: 'pur-2',
    date: '2026-09-18',
    materialId: 'mat-3',
    materialName: 'Bobina Friselina 80g (Negro)',
    supplier: 'Distribuidora Textil Chivilcoy',
    quantity: 200,
    unit: 'metros',
    unitPrice: 340,
    totalCost: 68000,
    notes: 'Rollo cerrado 1.60m ancho',
  },
  {
    id: 'pur-3',
    date: '2026-09-19',
    materialId: 'mat-2',
    materialName: 'Papel Kraft Marrón 120g',
    supplier: 'Papelera San Martín',
    quantity: 800,
    unit: 'pliegos',
    unitPrice: 110,
    totalCost: 88000,
    notes: 'Despacho con expreso',
  },
];

export const INITIAL_MOVEMENTS: MaterialMovement[] = [
  {
    id: 'mov-1',
    date: '2026-09-20',
    materialId: 'mat-1',
    materialName: 'Cartulina Tríplex 240g',
    type: 'consumo_taller',
    quantity: -150,
    unit: 'pliegos',
    reason: 'Producción Pedido VQ-1002 (Pochocleras x100)',
  },
  {
    id: 'mov-2',
    date: '2026-09-21',
    materialId: 'mat-3',
    materialName: 'Bobina Friselina 80g (Negro)',
    type: 'consumo_taller',
    quantity: -20,
    unit: 'metros',
    reason: 'Corte de bolsas 30x40 para boutique',
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Mariana López',
    businessName: 'Boutique Chicas Chic',
    phone: '5492346597969',
    address: 'Av. Soárez 142',
    city: 'Chivilcoy',
    channel: 'web',
    notes: 'Compra bolsas de friselina 30x40 con logo en blanco.',
    logoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=600&auto=format&fit=crop&q=80'
    ],
    totalOrders: 3,
    totalSpent: 125000,
    createdAt: '2026-08-10',
    lastOrderDate: '2026-09-12',
  },
  {
    id: 'cust-2',
    name: 'Santiago Romero',
    businessName: 'Romero Eventos & Cumpleaños',
    phone: '5492346597969',
    address: 'Pellegrini 380',
    city: 'Chivilcoy',
    channel: 'local_taller',
    notes: 'Pide pochocleras y bolsas temáticas personalizadas por lote.',
    logoUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80'
    ],
    totalOrders: 5,
    totalSpent: 185000,
    createdAt: '2026-07-20',
    lastOrderDate: '2026-09-20',
  },
  {
    id: 'cust-3',
    name: 'Luciana Fernández',
    businessName: 'Lulú Calzados',
    phone: '5492346597969',
    address: 'Belgrano 88',
    city: 'Alberti',
    channel: 'whatsapp',
    notes: 'Contacto directo por WhatsApp para bolsas grandes de calzado.',
    logoUrl: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=600&auto=format&fit=crop&q=80'
    ],
    totalOrders: 2,
    totalSpent: 78000,
    createdAt: '2026-08-28',
    lastOrderDate: '2026-09-18',
  },
  {
    id: 'cust-4',
    name: 'Carlos Benítez',
    businessName: 'Librería & Juguetería San Martín',
    phone: '5492346597969',
    address: 'Rivadavia 210',
    city: 'Suipacha',
    channel: 'instagram',
    notes: 'Llegó por consulta en publicación de Instagram.',
    totalOrders: 1,
    totalSpent: 42000,
    createdAt: '2026-09-05',
    lastOrderDate: '2026-09-05',
  },
];

export const VQ_CONFIG = {
  name: 'VQ Bolsas',
  tagline: 'Fábrica de Bolsas, Pochocleras y Empaques Personalizados',
  phoneWhatsapp: '5492346597969', // Número de WhatsApp para recibir pedidos (Chivilcoy)
  phoneDisplay: '2346-597969',
  instagramUser: 'vq_bolsas',
  instagramUrl: 'https://instagram.com/vq_bolsas',
  address: 'Chivilcoy y la zona - Envíos a todo el país',
  adminPin: '1234', // Clave inicial configurable
  adminUser: 'admin'
};
