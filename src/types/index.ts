export interface ProductVariant {
  id: string;
  name: string; // ej: "Pack x50", "15x20 Friselina", etc.
  material?: string;
  size?: string;
  handleType?: string;
  minQuantity: number;
  price: number; // precio unitario o por pack
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'cumpleanos' | 'pochocleras' | 'comercio' | 'personalizadas';
  description: string;
  image: string;
  materials: string[];
  sizes: string[];
  variants: ProductVariant[];
  featured?: boolean;
  moqDescription?: string; // ej: "Venta mínima: pack de 25 unidades"
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  image: string;
  material: string;
  size: string;
  handleType?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  businessName?: string;
  items: CartItem[];
  totalAmount: number;
  depositAmount: number;
  balanceDue: number;
  paymentMethod?: string;
  status: 'nuevo' | 'contactado' | 'en_diseno' | 'en_taller' | 'listo' | 'entregado' | 'cancelado';
  notes?: string;
  estimatedDeliveryDate?: string;
}

export interface InstagramPost {
  id: string;
  caption: string;
  mediaUrl: string;
  permalink: string;
  timestamp: string;
  likeCount?: number;
}

export interface RawMaterial {
  id: string;
  name: string; // ej: "Cartulina Tríplex 240g", "Papel Kraft 120g", "Bobina Friselina 80g"
  category: 'carton_papel' | 'friselina' | 'manijas_cordones' | 'tintas' | 'otros';
  unit: 'pliegos' | 'metros' | 'unidades' | 'kg' | 'rollos';
  currentStock: number;
  minStockAlert: number;
  costPerUnit: number; // Costo estimado o último pagado
  lastUpdated?: string;
}

export interface MaterialPurchase {
  id: string;
  date: string;
  materialId: string;
  materialName: string;
  supplier: string; // Proveedor
  quantity: number;
  unit: string;
  unitPrice: number;
  totalCost: number;
  notes?: string;
}

export interface MaterialMovement {
  id: string;
  date: string;
  materialId: string;
  materialName: string;
  type: 'ingreso_compra' | 'consumo_taller' | 'ajuste_manual';
  quantity: number; // positivo para ingreso, negativo para consumo
  unit: string;
  reason: string; // ej: "Uso en taller 10 cartones", "Compra #204", "Merma"
}

export interface Customer {
  id: string;
  name: string; // Nombre de contacto
  businessName?: string; // Nombre del comercio o marca
  phone: string; // Teléfono / WhatsApp
  address?: string; // Calle / Altura
  city: string; // Localidad o Zona
  channel: 'web' | 'whatsapp' | 'instagram' | 'local_taller' | 'recomendacion' | 'otro';
  notes?: string; // Observaciones, tipo de bolsa preferida, etc.
  logoUrl?: string; // Logo principal
  images?: string[]; // Galería de logos, matrices, muestras y fotos de pedidos
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  lastOrderDate?: string;
}
