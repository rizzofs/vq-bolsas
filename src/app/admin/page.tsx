'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Product, Order, RawMaterial, MaterialPurchase, Customer, CartItem } from '@/types';
import Link from 'next/link';
import { OrderAlertsBell, getOrderAlert } from '@/components/OrderAlertsBell';
import { NewOrderModal } from '@/components/NewOrderModal';
import { FinancialReports } from '@/components/FinancialReports';
import {
  Lock,
  LogOut,
  Package,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Phone,
  ArrowLeft,
  DollarSign,
  Edit,
  Sparkles,
  Calculator,
  UserCheck,
  Users,
  Menu,
  X,
  Layers,
  Archive,
  ShoppingCart,
  MinusCircle,
  PlusCircle,
  History,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  Camera,
  Factory,
  Search,
  Filter,
  MapPin,
  ExternalLink,
  MessageCircle,
  FileText,
  Calendar,
  CreditCard,
  Image as ImageIcon,
  Upload,
  Download,
  Star,
  Eye,
  ZoomIn,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function AdminPage() {
  const {
    isAuthenticated,
    login,
    logout,
    orders,
    products,
    addOrder,
    updateOrderStatus,
    updateOrderPayment,
    updateOrderDeliveryDate,
    updateOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    materials,
    purchases,
    materialMovements,
    addRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
    adjustMaterialStock,
    addMaterialPurchase,
    deleteMaterialPurchase,
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    instagramPosts,
    instagramWidgetId,
    setInstagramWidgetId,
    addInstagramPost,
    deleteInstagramPost,
  } = useStore();

  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Menú Hamburguesa lateral
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

  // Tabs de navegación
  const [activeTab, setActiveTab] = useState<
    'pedidos' | 'taller' | 'stock_materiales' | 'compras' | 'reportes' | 'clientes' | 'productos' | 'recompra' | 'calculadora' | 'instagram'
  >('pedidos');

  // Estado para colapsar/mostrar resumen de métricas en móvil
  const [showKpis, setShowKpis] = useState(true);

  // Filtros de Pedidos & Búsqueda
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<
    'todos' | 'alertas' | 'nuevo' | 'contactado' | 'en_diseno' | 'en_taller' | 'listo' | 'entregado'
  >('todos');

  // --- MODAL / ESTADO ALTA NUEVO PEDIDO (WIZARD) ---
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);

  // --- MODAL / ESTADO ABM CLIENTES ---
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [custFormName, setCustFormName] = useState('');
  const [custFormBusiness, setCustFormBusiness] = useState('');
  const [custFormPhone, setCustFormPhone] = useState('');
  const [custFormCity, setCustFormCity] = useState('Chivilcoy');
  const [custFormAddress, setCustFormAddress] = useState('');
  const [custFormChannel, setCustFormChannel] = useState<Customer['channel']>('whatsapp');
  const [custFormNotes, setCustFormNotes] = useState('');
  const [custFormLogo, setCustFormLogo] = useState('');
  const [custFormImages, setCustFormImages] = useState<string[]>([]);
  const [custFormImageUrlInput, setCustFormImageUrlInput] = useState('');
  const [sheetImageUrlInput, setSheetImageUrlInput] = useState('');
  const [previewImageZoom, setPreviewImageZoom] = useState<string | null>(null);

  // Filtros de Clientes
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerChannelFilter, setCustomerChannelFilter] = useState<string>('todos');

  // --- MODAL / DETALLE HISTORIAL DEL CLIENTE ---
  const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState<Customer | null>(null);
  const [newOrderForCustModal, setNewOrderForCustModal] = useState(false);
  const [custOrderProductName, setCustOrderProductName] = useState('Bolsas Friselina 30x40');
  const [custOrderQty, setCustOrderQty] = useState(100);
  const [custOrderTotal, setCustOrderTotal] = useState(35000);
  const [custOrderDeposit, setCustOrderDeposit] = useState(17500);
  const [custOrderStatus, setCustOrderStatus] = useState<Order['status']>('nuevo');
  const [custOrderNotes, setCustOrderNotes] = useState('');

  // --- MODAL / ESTADO ABM PRODUCTOS ---
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodFormName, setProdFormName] = useState('');
  const [prodFormCategory, setProdFormCategory] = useState<Product['category']>('comercio');
  const [prodFormDescription, setProdFormDescription] = useState('');
  const [prodFormImage, setProdFormImage] = useState('');
  const [prodFormMaterials, setProdFormMaterials] = useState('Friselina 80g');
  const [prodFormSizes, setProdFormSizes] = useState('30x40 cm');
  const [prodFormPrice, setProdFormPrice] = useState(25000);
  const [prodFormMinQty, setProdFormMinQty] = useState(50);

  // --- MODAL / ESTADO MATERIALES ---
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);
  const [matFormName, setMatFormName] = useState('');
  const [matFormCategory, setMatFormCategory] = useState<RawMaterial['category']>('carton_papel');
  const [matFormUnit, setMatFormUnit] = useState<RawMaterial['unit']>('pliegos');
  const [matFormStock, setMatFormStock] = useState(100);
  const [matFormMinAlert, setMatFormMinAlert] = useState(20);
  const [matFormCostUnit, setMatFormCostUnit] = useState(150);

  // Modal para descontar stock con motivo específico
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [discountTargetMat, setDiscountTargetMat] = useState<RawMaterial | null>(null);
  const [discountQty, setDiscountQty] = useState(10);
  const [discountReason, setDiscountReason] = useState('Uso en taller / Producción');

  // --- FORMULARIO NUEVA COMPRA DE MATERIALES ---
  const [purchaseFormOpen, setPurchaseFormOpen] = useState(false);
  const [purDate, setPurDate] = useState(new Date().toISOString().split('T')[0]);
  const [purMaterialId, setPurMaterialId] = useState(materials[0]?.id || '');
  const [purSupplier, setPurSupplier] = useState('');
  const [purQty, setPurQty] = useState(100);
  const [purUnitPrice, setPurUnitPrice] = useState(150);
  const [purNotes, setPurNotes] = useState('');

  // --- INSTAGRAM POSTS ---
  const [newIgCaption, setNewIgCaption] = useState('');
  const [newIgImage, setNewIgImage] = useState('');
  const [newIgLink, setNewIgLink] = useState('https://instagram.com/vq_bolsas');
  const [widgetCodeInput, setWidgetCodeInput] = useState(instagramWidgetId || '');

  // --- CALCULADORA ESCANDALLO ---
  const [calcQty, setCalcQty] = useState(500);
  const [calcPaperCost, setCalcPaperCost] = useState(120);
  const [calcHandleCost, setCalcHandleCost] = useState(40);
  const [calcInkCost, setCalcInkCost] = useState(25);
  const [calcLaborCost, setCalcLaborCost] = useState(60);
  const [calcSalePrice, setCalcSalePrice] = useState(450);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, pin);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
    }
  };

  // --- GESTIÓN DE CLIENTES (ABM) ---
  const handleOpenCreateCustomer = () => {
    setEditingCustomerId(null);
    setCustFormName('');
    setCustFormBusiness('');
    setCustFormPhone('');
    setCustFormCity('Chivilcoy');
    setCustFormAddress('');
    setCustFormChannel('whatsapp');
    setCustFormNotes('');
    setCustFormLogo('');
    setCustFormImages([]);
    setCustFormImageUrlInput('');
    setCustomerModalOpen(true);
  };

  const handleOpenEditCustomer = (cust: Customer) => {
    setEditingCustomerId(cust.id);
    setCustFormName(cust.name);
    setCustFormBusiness(cust.businessName || '');
    setCustFormPhone(cust.phone);
    setCustFormCity(cust.city);
    setCustFormAddress(cust.address || '');
    setCustFormChannel(cust.channel);
    setCustFormNotes(cust.notes || '');
    const initialImages = cust.images && cust.images.length > 0
      ? cust.images
      : cust.logoUrl
      ? [cust.logoUrl]
      : [];
    setCustFormLogo(cust.logoUrl || initialImages[0] || '');
    setCustFormImages(initialImages);
    setCustFormImageUrlInput('');
    setCustomerModalOpen(true);
  };

  // Carga de múltiples archivos de imágenes
  const handleCustomerMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>, forSheet: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filePromises = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((newImgs) => {
      if (forSheet && selectedCustomerForHistory) {
        const currentImgs = selectedCustomerForHistory.images && selectedCustomerForHistory.images.length > 0
          ? selectedCustomerForHistory.images
          : selectedCustomerForHistory.logoUrl
          ? [selectedCustomerForHistory.logoUrl]
          : [];
        const updatedImgs = [...currentImgs, ...newImgs];
        const updatedCust: Customer = {
          ...selectedCustomerForHistory,
          logoUrl: selectedCustomerForHistory.logoUrl || newImgs[0] || '',
          images: updatedImgs,
        };
        updateCustomer(updatedCust);
        setSelectedCustomerForHistory(updatedCust);
      } else {
        setCustFormImages((prev) => {
          const combined = [...prev, ...newImgs];
          if (!custFormLogo && combined.length > 0) {
            setCustFormLogo(combined[0]);
          }
          return combined;
        });
      }
    });
    e.target.value = '';
  };

  const handleAddImageUrl = (url: string, forSheet: boolean = false) => {
    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    if (forSheet && selectedCustomerForHistory) {
      const currentImgs = selectedCustomerForHistory.images && selectedCustomerForHistory.images.length > 0
        ? selectedCustomerForHistory.images
        : selectedCustomerForHistory.logoUrl
        ? [selectedCustomerForHistory.logoUrl]
        : [];
      const updatedImgs = [...currentImgs, cleanUrl];
      const updatedCust: Customer = {
        ...selectedCustomerForHistory,
        logoUrl: selectedCustomerForHistory.logoUrl || cleanUrl,
        images: updatedImgs,
      };
      updateCustomer(updatedCust);
      setSelectedCustomerForHistory(updatedCust);
      setSheetImageUrlInput('');
    } else {
      setCustFormImages((prev) => {
        const combined = [...prev, cleanUrl];
        if (!custFormLogo) setCustFormLogo(cleanUrl);
        return combined;
      });
      setCustFormImageUrlInput('');
    }
  };

  const handleRemoveCustomerImage = (indexToRemove: number, forSheet: boolean = false) => {
    if (forSheet && selectedCustomerForHistory) {
      const currentImgs = selectedCustomerForHistory.images && selectedCustomerForHistory.images.length > 0
        ? selectedCustomerForHistory.images
        : selectedCustomerForHistory.logoUrl
        ? [selectedCustomerForHistory.logoUrl]
        : [];
      const targetImg = currentImgs[indexToRemove];
      const updatedImgs = currentImgs.filter((_, idx) => idx !== indexToRemove);
      const newLogo = selectedCustomerForHistory.logoUrl === targetImg
        ? (updatedImgs[0] || '')
        : selectedCustomerForHistory.logoUrl;
      const updatedCust: Customer = {
        ...selectedCustomerForHistory,
        logoUrl: newLogo,
        images: updatedImgs,
      };
      updateCustomer(updatedCust);
      setSelectedCustomerForHistory(updatedCust);
    } else {
      setCustFormImages((prev) => {
        const targetImg = prev[indexToRemove];
        const updated = prev.filter((_, idx) => idx !== indexToRemove);
        if (custFormLogo === targetImg) {
          setCustFormLogo(updated[0] || '');
        }
        return updated;
      });
    }
  };

  const handleSetPrimaryCustomerLogo = (imgUrl: string, forSheet: boolean = false) => {
    if (forSheet && selectedCustomerForHistory) {
      const updatedCust: Customer = {
        ...selectedCustomerForHistory,
        logoUrl: imgUrl,
      };
      updateCustomer(updatedCust);
      setSelectedCustomerForHistory(updatedCust);
    } else {
      setCustFormLogo(imgUrl);
    }
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custFormName.trim()) return;

    const allImages = custFormImages.filter(Boolean);
    const primaryLogo = custFormLogo.trim() || allImages[0] || '';
    const finalImages = primaryLogo && !allImages.includes(primaryLogo) ? [primaryLogo, ...allImages] : allImages;

    if (editingCustomerId) {
      const existing = customers.find((c) => c.id === editingCustomerId);
      if (existing) {
        const updatedCust: Customer = {
          ...existing,
          name: custFormName.trim(),
          businessName: custFormBusiness.trim(),
          phone: custFormPhone.trim(),
          city: custFormCity.trim() || 'Chivilcoy',
          address: custFormAddress.trim(),
          channel: custFormChannel,
          notes: custFormNotes.trim(),
          logoUrl: primaryLogo,
          images: finalImages,
        };
        updateCustomer(updatedCust);
        if (selectedCustomerForHistory && selectedCustomerForHistory.id === existing.id) {
          setSelectedCustomerForHistory(updatedCust);
        }
      }
    } else {
      addCustomer({
        name: custFormName.trim(),
        businessName: custFormBusiness.trim(),
        phone: custFormPhone.trim(),
        city: custFormCity.trim() || 'Chivilcoy',
        address: custFormAddress.trim(),
        channel: custFormChannel,
        notes: custFormNotes.trim(),
        logoUrl: primaryLogo,
        images: finalImages,
      });
    }

    setCustomerModalOpen(false);
  };

  // Obtener todos los pedidos asociados a un cliente
  const getCustomerOrders = (cust: Customer): Order[] => {
    const cleanCustPhone = cust.phone.replace(/\D/g, '');
    return orders.filter((o) => {
      const cleanOrderPhone = o.customerPhone.replace(/\D/g, '');
      const matchPhone = cleanCustPhone && cleanOrderPhone && cleanCustPhone === cleanOrderPhone;
      const matchName = o.customerName.toLowerCase().trim() === cust.name.toLowerCase().trim();
      const matchBusiness =
        cust.businessName &&
        o.businessName &&
        cust.businessName.toLowerCase().trim() === o.businessName.toLowerCase().trim();
      return matchPhone || matchName || matchBusiness;
    });
  };

  // Guardar nueva venta manual asociada a este cliente
  const handleSaveCustomerOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerForHistory) return;

    const dummyItem: CartItem = {
      id: `item-${Date.now()}`,
      productId: 'manual-order',
      productName: custOrderProductName,
      category: 'comercio',
      image: selectedCustomerForHistory.logoUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
      material: 'Friselina / Cartón',
      size: 'Estándar',
      quantity: Number(custOrderQty),
      unitPrice: Math.round(Number(custOrderTotal) / Number(custOrderQty)),
      totalPrice: Number(custOrderTotal),
      customNotes: custOrderNotes,
    };

    addOrder({
      customerName: selectedCustomerForHistory.name,
      customerPhone: selectedCustomerForHistory.phone,
      customerAddress: selectedCustomerForHistory.address || 'Mostrador / Taller',
      customerCity: selectedCustomerForHistory.city || 'Chivilcoy',
      businessName: selectedCustomerForHistory.businessName,
      items: [dummyItem],
      totalAmount: Number(custOrderTotal),
      depositAmount: Number(custOrderDeposit),
      balanceDue: Math.max(0, Number(custOrderTotal) - Number(custOrderDeposit)),
      paymentMethod: 'Efectivo / Transferencia',
      status: custOrderStatus,
      notes: custOrderNotes,
    });

    setNewOrderForCustModal(false);
    setCustOrderNotes('');
  };

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      (c.businessName && c.businessName.toLowerCase().includes(customerSearch.toLowerCase())) ||
      c.phone.includes(customerSearch) ||
      c.city.toLowerCase().includes(customerSearch.toLowerCase());

    const matchChannel =
      customerChannelFilter === 'todos' ? true : c.channel === customerChannelFilter;

    return matchSearch && matchChannel;
  });

  const getChannelBadge = (ch: Customer['channel']) => {
    switch (ch) {
      case 'web':
        return <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-md">🌐 Web</span>;
      case 'whatsapp':
        return <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-md">💬 WhatsApp</span>;
      case 'instagram':
        return <span className="bg-pink-100 text-pink-700 text-[10px] font-black px-2 py-0.5 rounded-md">📸 Instagram</span>;
      case 'local_taller':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md">🏭 Mostrador/Taller</span>;
      case 'recomendacion':
        return <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-md">🤝 Recomendación</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded-md">Otro</span>;
    }
  };

  // --- GESTIÓN DE PRODUCTOS (ABM SIMPLE) ---
  const handleOpenCreateProduct = () => {
    setEditingProductId(null);
    setProdFormName('');
    setProdFormCategory('comercio');
    setProdFormDescription('');
    setProdFormImage('https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80');
    setProdFormMaterials('Friselina 80g');
    setProdFormSizes('30x40 cm');
    setProdFormPrice(25000);
    setProdFormMinQty(50);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdFormName(prod.name);
    setProdFormCategory(prod.category);
    setProdFormDescription(prod.description);
    setProdFormImage(prod.image);
    setProdFormMaterials(prod.materials.join(', '));
    setProdFormSizes(prod.sizes.join(', '));
    setProdFormPrice(prod.variants[0]?.price || 25000);
    setProdFormMinQty(prod.variants[0]?.minQuantity || 50);
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodFormName.trim()) return;

    const materialsArray = prodFormMaterials.split(',').map((m) => m.trim()).filter(Boolean);
    const sizesArray = prodFormSizes.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingProductId) {
      const existing = products.find((p) => p.id === editingProductId);
      if (existing) {
        const updated: Product = {
          ...existing,
          name: prodFormName.trim(),
          category: prodFormCategory,
          description: prodFormDescription || 'Producto confeccionado por VQ Bolsas.',
          image: prodFormImage || existing.image,
          materials: materialsArray.length > 0 ? materialsArray : ['Friselina'],
          sizes: sizesArray.length > 0 ? sizesArray : ['Estándar'],
          moqDescription: `Compra mínima: ${prodFormMinQty} unidades`,
          variants: [
            {
              id: existing.variants[0]?.id || `var-${Date.now()}`,
              name: `Pack x${prodFormMinQty} (${sizesArray[0] || 'Estándar'})`,
              material: materialsArray[0] || 'Friselina 80g',
              size: sizesArray[0] || 'Estándar',
              minQuantity: Number(prodFormMinQty),
              price: Number(prodFormPrice),
            },
          ],
        };
        updateProduct(updated);
      }
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: prodFormName.trim(),
        slug: prodFormName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
        category: prodFormCategory,
        description: prodFormDescription || 'Producto confeccionado por VQ Bolsas con máxima calidad.',
        image: prodFormImage || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
        materials: materialsArray.length > 0 ? materialsArray : ['Friselina 80g'],
        sizes: sizesArray.length > 0 ? sizesArray : ['30x40 cm'],
        moqDescription: `Compra mínima: ${prodFormMinQty} unidades`,
        variants: [
          {
            id: `var-${Date.now()}`,
            name: `Pack x${prodFormMinQty} (${sizesArray[0] || 'Estándar'})`,
            material: materialsArray[0] || 'Friselina 80g',
            size: sizesArray[0] || '30x40 cm',
            minQuantity: Number(prodFormMinQty),
            price: Number(prodFormPrice),
          },
        ],
      };
      addProduct(newProd);
    }

    setProductModalOpen(false);
  };

  // --- GESTIÓN DE MATERIALES ---
  const handleOpenCreateMaterial = () => {
    setEditingMaterialId(null);
    setMatFormName('');
    setMatFormCategory('carton_papel');
    setMatFormUnit('pliegos');
    setMatFormStock(100);
    setMatFormMinAlert(20);
    setMatFormCostUnit(150);
    setMaterialModalOpen(true);
  };

  const handleOpenEditMaterial = (mat: RawMaterial) => {
    setEditingMaterialId(mat.id);
    setMatFormName(mat.name);
    setMatFormCategory(mat.category);
    setMatFormUnit(mat.unit);
    setMatFormStock(mat.currentStock);
    setMatFormMinAlert(mat.minStockAlert);
    setMatFormCostUnit(mat.costPerUnit);
    setMaterialModalOpen(true);
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matFormName.trim()) return;

    if (editingMaterialId) {
      const existing = materials.find((m) => m.id === editingMaterialId);
      if (existing) {
        updateRawMaterial({
          ...existing,
          name: matFormName.trim(),
          category: matFormCategory,
          unit: matFormUnit,
          currentStock: Number(matFormStock),
          minStockAlert: Number(matFormMinAlert),
          costPerUnit: Number(matFormCostUnit),
        });
      }
    } else {
      addRawMaterial({
        name: matFormName.trim(),
        category: matFormCategory,
        unit: matFormUnit,
        currentStock: Number(matFormStock),
        minStockAlert: Number(matFormMinAlert),
        costPerUnit: Number(matFormCostUnit),
      });
    }

    setMaterialModalOpen(false);
  };

  // Descontar rápido
  const handleOpenDiscountModal = (mat: RawMaterial, defaultQty: number = 10) => {
    setDiscountTargetMat(mat);
    setDiscountQty(defaultQty);
    setDiscountReason(`Uso en taller / Trabajo ${mat.name}`);
    setDiscountModalOpen(true);
  };

  const handleConfirmDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountTargetMat) return;
    adjustMaterialStock(discountTargetMat.id, -Math.abs(discountQty), discountReason);
    setDiscountModalOpen(false);
  };

  // --- GESTIÓN DE COMPRAS DE MATERIALES ---
  const handleSavePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedMat = materials.find((m) => m.id === purMaterialId) || materials[0];
    if (!selectedMat) return;

    const totalCost = Number(purQty) * Number(purUnitPrice);

    addMaterialPurchase({
      date: purDate,
      materialId: selectedMat.id,
      materialName: selectedMat.name,
      supplier: purSupplier.trim() || 'Proveedor Local',
      quantity: Number(purQty),
      unit: selectedMat.unit,
      unitPrice: Number(purUnitPrice),
      totalCost,
      notes: purNotes.trim(),
    });

    setPurchaseFormOpen(false);
    setPurSupplier('');
    setPurNotes('');
  };

  // Cálculos Financieros
  const totalVentas = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCobrado = orders.reduce((sum, o) => sum + o.depositAmount, 0);
  const totalGastosCompras = purchases.reduce((sum, p) => sum + p.totalCost, 0);
  const materialesBajoStock = materials.filter((m) => m.currentStock <= m.minStockAlert);

  // Si no está autenticado, mostramos login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl text-white flex items-center justify-center font-black text-xl mx-auto mb-3 shadow-lg shadow-orange-600/30">
              VQ
            </div>
            <h2 className="text-2xl font-black text-gray-900">Panel de Fábrica & Admin</h2>
            <p className="text-xs text-gray-500 mt-1">
              Ingresá tu usuario y PIN para gestionar clientes, stock de insumos y pedidos.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                required
                placeholder="admin o vqbolsas"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                PIN de Acceso
              </label>
              <input
                type="password"
                required
                placeholder="PIN: 1234"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Usuario o PIN incorrectos. (Usuario: <b>admin</b> - PIN: <b>1234</b>)</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Ingresar al Sistema</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-orange-600 hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Volver a la Tienda Pública
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Costos calculados
  const calcUnitCost = calcPaperCost + calcHandleCost + calcInkCost + calcLaborCost;
  const calcWasteCost = calcUnitCost * 0.05;
  const calcTotalUnitCost = Math.round(calcUnitCost + calcWasteCost);
  const calcUnitProfit = calcSalePrice - calcTotalUnitCost;
  const calcMarginPercent = Math.round((calcUnitProfit / calcSalePrice) * 100);
  const calcTotalOrderProfit = calcUnitProfit * calcQty;

  // Alertas de Pedidos
  const ordersWithAlerts = orders.filter((o) => getOrderAlert(o) !== null);

  const modulesList = [
    {
      id: 'pedidos',
      label: 'Pedidos & Facturación',
      icon: ShoppingBag,
      count: ordersWithAlerts.length > 0 ? `${orders.length} (${ordersWithAlerts.length} alertas)` : orders.length,
      badgeColor: ordersWithAlerts.length > 0 ? 'bg-red-100 text-red-800 font-black' : 'bg-blue-100 text-blue-800',
    },
    { id: 'taller', label: 'Taller & Producción (Kanban)', icon: Factory, count: orders.filter((o) => o.status === 'en_taller' || o.status === 'nuevo').length, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'clientes', label: 'Clientes & Compras (ABM)', icon: Users, count: customers.length, badgeColor: 'bg-indigo-100 text-indigo-800 font-bold' },
    { id: 'stock_materiales', label: 'Stock de Materiales & Insumos', icon: Archive, count: materialesBajoStock.length > 0 ? `${materialesBajoStock.length} alerta` : `${materials.length}`, badgeColor: materialesBajoStock.length > 0 ? 'bg-red-100 text-red-800 font-black' : 'bg-slate-100 text-slate-700' },
    { id: 'compras', label: 'Registro de Compras (Insumos)', icon: ShoppingCart, count: purchases.length, badgeColor: 'bg-green-100 text-green-800' },
    { id: 'reportes', label: 'Reportes & Finanzas (Caja)', icon: BarChart3, count: undefined, badgeColor: 'bg-emerald-100 text-emerald-800 font-bold' },
    { id: 'productos', label: 'Catálogo & Precios (ABM)', icon: Package, count: products.length, badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'recompra', label: 'Recompra Clientes (B2B)', icon: UserCheck, count: undefined, badgeColor: '' },
    { id: 'calculadora', label: 'Calculadora de Costos & Margen', icon: Calculator, count: undefined, badgeColor: '' },
    { id: 'instagram', label: 'Instagram (@vq_bolsas)', icon: Camera, count: undefined, badgeColor: '' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuDrawerOpen(true)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                title="Abrir Menú de Módulos"
              >
                <Menu className="w-5 h-5 text-orange-400" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                  VQ
                </div>
                <div>
                  <span className="font-black text-sm tracking-tight text-white block">
                    VQ Bolsas <span className="text-orange-400 font-normal">| Administración</span>
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:block">Control de Fábrica, Clientes y Stock</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Campanita de Alertas de Pedidos Atrasados / Demorados */}
              <OrderAlertsBell
                orders={orders}
                onNavigateToOrder={(orderId) => {
                  setActiveTab('pedidos');
                  setOrderSearch(orderId);
                  setOrderStatusFilter('todos');
                }}
                onUpdateStatus={(orderId, status) => updateOrderStatus(orderId, status)}
              />

              {/* Botón Nuevo Pedido */}
              <button
                onClick={() => setNewOrderModalOpen(true)}
                className="text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 px-3 py-2 rounded-xl transition-all shadow-md shadow-orange-600/30 flex items-center gap-1.5"
                title="Crear un nuevo pedido por pasos"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Nuevo Pedido</span>
              </button>

              <Link
                href="/"
                className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>Ver Tienda</span>
              </Link>
              <button
                onClick={logout}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-bold bg-red-950/40 hover:bg-red-950/70 border border-red-900/50 px-2.5 py-2 rounded-xl transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* DRAWER / SIDEBAR LATERAL (MENÚ HAMBURGUESA) */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMenuDrawerOpen(false)}
          />

          <div className="relative w-full max-w-xs bg-slate-900 text-white h-full shadow-2xl flex flex-col justify-between z-10 border-r border-slate-800">
            <div>
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white text-sm">
                    VQ
                  </div>
                  <div>
                    <span className="font-black text-sm text-white block">Módulos del Sistema</span>
                    <span className="text-[10px] text-orange-400">Seleccioná a dónde ir</span>
                  </div>
                </div>
                <button
                  onClick={() => setMenuDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
                {modulesList.map((mod) => {
                  const Icon = mod.icon;
                  const isActive = activeTab === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => {
                        setActiveTab(mod.id as any);
                        setMenuDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-orange-400'}`} />
                        <span>{mod.label}</span>
                      </div>
                      {mod.count !== undefined && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-orange-800 text-white' : mod.badgeColor
                          }`}
                        >
                          {mod.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
              <p className="text-[11px] text-slate-400">VQ Bolsas • Fábrica & Taller</p>
              <p className="text-[10px] text-slate-500">Chivilcoy, Bs. As. • vqbolsas.com</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* KPI Cards (Ocultas en móvil para máxima limpieza y espacio, visibles en desktop) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Ventas */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Ventas
              </span>
              <span className="text-xl font-black text-slate-900 mt-0.5 block">
                ${totalVentas.toLocaleString('es-AR')}
              </span>
              <span className="text-[10px] text-slate-500">{orders.length} pedidos</span>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          {/* Clientes Registrados */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Clientes Registrados
              </span>
              <span className="text-xl font-black text-indigo-600 mt-0.5 block">
                {customers.length} clientes
              </span>
              <span className="text-[10px] text-indigo-600 font-medium">Logos e historial guardados</span>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Cobrado / Señas */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Cobrado (Señas)
              </span>
              <span className="text-xl font-black text-green-600 mt-0.5 block">
                ${totalCobrado.toLocaleString('es-AR')}
              </span>
              <span className="text-[10px] text-green-600 font-medium">Ingresos en caja</span>
            </div>
            <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          {/* Stock Insumos */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Stock Insumos
              </span>
              <span className="text-xl font-black text-slate-900 mt-0.5 block">
                {materials.length} materiales
              </span>
              {materialesBajoStock.length > 0 ? (
                <span className="text-[10px] text-red-600 font-bold">⚠️ {materialesBajoStock.length} con stock bajo</span>
              ) : (
                <span className="text-[10px] text-green-600 font-medium">Niveles óptimos</span>
              )}
            </div>
            <div className={`p-2.5 rounded-xl ${materialesBajoStock.length > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
              <Archive className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Banner de Pedidos Atrasados / Requieren Atención Inmediata */}
        {ordersWithAlerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-red-600 text-white rounded-2xl shadow-md shadow-red-600/30 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-black text-sm text-red-950 flex items-center gap-2">
                  Atención: {ordersWithAlerts.length} pedido{ordersWithAlerts.length > 1 ? 's' : ''} requiere{ordersWithAlerts.length > 1 ? 'n' : ''} seguimiento
                </h4>
                <p className="text-xs text-red-700 mt-0.5">
                  Hay pedidos que ingresaron y quedaron sin atender (+24hs) o con fecha de entrega pactada vencida.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTab('pedidos');
                setOrderStatusFilter('alertas');
              }}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-red-600/20 flex items-center gap-2 transition-all shrink-0"
            >
              <span>Ver Pedidos con Alerta ({ordersWithAlerts.length})</span>
              <ArrowDownRight className="w-4 h-4" />
            </button>
          </div>
        )}



        {/* ============================================================ */}
        {/* TAB CLIENTES: ABM COMPLETO & HISTORIAL & LOGO */}
        {/* ============================================================ */}
        {activeTab === 'clientes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-indigo-100 text-indigo-600 rounded-xl font-bold">👥</span>
                  <h3 className="font-black text-base text-slate-900">ABM de Clientes, Logos & Compras</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Guardá los datos, archivos de logo para matrices/grabado e historial de compras de cada cliente.
                </p>
              </div>

              <button
                onClick={handleOpenCreateCustomer}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
              >
                <Plus className="w-4 h-4" /> + Nuevo Cliente
              </button>
            </div>

            {/* Barra de Búsqueda y Filtro por Canal */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, comercio, teléfono..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <span className="text-[11px] font-bold text-slate-500 uppercase shrink-0">Origen:</span>
                {['todos', 'web', 'whatsapp', 'local_taller', 'instagram', 'recomendacion'].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setCustomerChannelFilter(ch)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                      customerChannelFilter === ch
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {ch === 'todos' ? 'Todos' : ch === 'local_taller' ? 'Mostrador' : ch.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabla / Lista Compacta de Clientes */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="font-bold text-xs text-slate-700">
                  Mostrando {filteredCustomers.length} de {customers.length} clientes registrados
                </span>
                <span className="text-[11px] text-slate-400">
                  Hacé clic en cualquier fila para ver su ficha, logo y compras
                </span>
              </div>

              {filteredCustomers.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">No se encontraron clientes</h4>
                  <p className="text-xs text-slate-500">Probá modificando los términos de búsqueda o el filtro de origen.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/75 text-[10px] font-black uppercase tracking-wider text-slate-600">
                        <th className="py-3 px-4">Cliente / Marca</th>
                        <th className="py-3 px-4">Contacto</th>
                        <th className="py-3 px-4">Ubicación</th>
                        <th className="py-3 px-4">Origen</th>
                        <th className="py-3 px-4 text-right">Pedidos & Total</th>
                        <th className="py-3 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCustomers.map((cust) => {
                        const custOrders = getCustomerOrders(cust);
                        const actualTotalSpent =
                          custOrders.length > 0
                            ? custOrders.reduce((sum, o) => sum + o.totalAmount, 0)
                            : cust.totalSpent;
                        const actualOrdersCount = custOrders.length > 0 ? custOrders.length : cust.totalOrders;

                        return (
                          <tr
                            key={cust.id}
                            className="hover:bg-indigo-50/40 transition-colors group cursor-pointer"
                            onClick={() => setSelectedCustomerForHistory(cust)}
                          >
                            {/* Columna Cliente & Marca */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs group-hover:border-indigo-300">
                                  {cust.logoUrl ? (
                                    <img src={cust.logoUrl} alt={cust.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="font-black text-xs text-indigo-600">
                                      {cust.name.substring(0, 2).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <span className="font-black text-xs text-slate-900 block group-hover:text-indigo-600 transition-colors">
                                    {cust.name}
                                  </span>
                                  {cust.businessName ? (
                                    <span className="text-[11px] font-bold text-indigo-600 block">
                                      {cust.businessName}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 italic">Particular</span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Columna Contacto */}
                            <td className="py-3 px-4 text-slate-700" onClick={(e) => e.stopPropagation()}>
                              <a
                                href={`https://wa.me/${cust.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(
                                  cust.name
                                )},%20te%20escribimos%20de%20VQ%20Bolsas`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-slate-800 hover:text-green-600 flex items-center gap-1 transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5 text-green-600 shrink-0" />
                                <span>{cust.phone}</span>
                              </a>
                            </td>

                            {/* Columna Ubicación */}
                            <td className="py-3 px-4 text-slate-600">
                              <span className="font-medium text-slate-800 block">{cust.city}</span>
                              {cust.address && (
                                <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                                  {cust.address}
                                </span>
                              )}
                            </td>

                            {/* Columna Canal */}
                            <td className="py-3 px-4">{getChannelBadge(cust.channel)}</td>

                            {/* Columna Pedidos & Total */}
                            <td className="py-3 px-4 text-right">
                              <span className="font-black text-slate-900 block">
                                ${actualTotalSpent.toLocaleString('es-AR')}
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                {actualOrdersCount} pedido{actualOrdersCount !== 1 ? 's' : ''}
                              </span>
                            </td>

                            {/* Columna Acciones */}
                            <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setSelectedCustomerForHistory(cust)}
                                  className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-[10px] flex items-center gap-1 transition-colors border border-indigo-200"
                                  title="Ver Ficha y Logo"
                                >
                                  <FileText className="w-3 h-3" />
                                  <span className="hidden sm:inline">Ficha</span>
                                </button>

                                <a
                                  href={`https://wa.me/${cust.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(
                                    cust.name
                                  )},%20te%20escribimos%20de%20VQ%20Bolsas`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-2xs"
                                  title="WhatsApp directo"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>

                                <button
                                  onClick={() => handleOpenEditCustomer(cust)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Editar cliente"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => deleteCustomer(cust.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar cliente"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB STOCK DE MATERIALES */}
        {/* ============================================================ */}
        {activeTab === 'stock_materiales' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-orange-100 text-orange-600 rounded-xl font-bold">🧱</span>
                  <h3 className="font-black text-base text-slate-900">Control de Stock de Materiales e Insumos</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Descontá fácilmente cuando uses cartones, papeles o friselina en el taller, o ajustá el stock disponible.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setActiveTab('compras');
                    setPurchaseFormOpen(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" /> Ingresar Compra
                </button>

                <button
                  onClick={handleOpenCreateMaterial}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" /> Nuevo Insumo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((mat) => {
                const isLow = mat.currentStock <= mat.minStockAlert;
                return (
                  <div
                    key={mat.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                      isLow ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                            {mat.category.replace('_', ' ')}
                          </span>
                          <h4 className="font-black text-slate-900 text-sm">{mat.name}</h4>
                        </div>
                        {isLow ? (
                          <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Stock Bajo
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Disponible
                          </span>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 my-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block uppercase">Stock en Taller:</span>
                          <div className="flex items-baseline gap-1">
                            <span className={`text-2xl font-black ${isLow ? 'text-red-600' : 'text-slate-900'}`}>
                              {mat.currentStock.toLocaleString('es-AR')}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">{mat.unit}</span>
                          </div>
                        </div>
                        <div className="text-right text-[11px] text-slate-400">
                          <p>Mínimo: <b>{mat.minStockAlert} {mat.unit}</b></p>
                          <p>Costo: <b>${mat.costPerUnit}/{mat.unit}</b></p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          ⚡ Descuento Rápido por Uso:
                        </span>
                        <div className="grid grid-cols-4 gap-1.5">
                          <button
                            onClick={() => adjustMaterialStock(mat.id, -1, `Uso rápido 1 ${mat.unit}`)}
                            disabled={mat.currentStock < 1}
                            className="py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-black text-xs rounded-lg border border-red-200 transition-colors disabled:opacity-40"
                            title="Descontar 1"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => adjustMaterialStock(mat.id, -5, `Uso rápido 5 ${mat.unit}`)}
                            disabled={mat.currentStock < 5}
                            className="py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-black text-xs rounded-lg border border-red-200 transition-colors disabled:opacity-40"
                            title="Descontar 5"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => adjustMaterialStock(mat.id, -10, `Uso en taller 10 ${mat.unit}`)}
                            disabled={mat.currentStock < 10}
                            className="py-1.5 bg-red-100 hover:bg-red-200 text-red-800 font-black text-xs rounded-lg border border-red-300 transition-colors disabled:opacity-40"
                            title="Descontar 10"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => handleOpenDiscountModal(mat, 10)}
                            className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg border border-slate-200 transition-colors"
                            title="Descontar cantidad personalizada"
                          >
                            Otro...
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => adjustMaterialStock(mat.id, 50, `Ingreso rápido +50 ${mat.unit}`)}
                        className="text-green-700 hover:text-green-800 font-bold flex items-center gap-1 hover:underline"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> +50 {mat.unit}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditMaterial(mat)}
                          className="text-slate-400 hover:text-slate-700 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteRawMaterial(mat.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <History className="w-4 h-4 text-orange-600" />
                <h4 className="font-black text-sm text-slate-900">Últimos Movimientos de Stock (Consumos & Ingresos)</h4>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {materialMovements.slice(0, 10).map((mov) => (
                  <div key={mov.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`p-1.5 rounded-lg font-bold ${
                          mov.quantity > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {mov.quantity > 0 ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                      <div>
                        <span className="font-bold text-slate-800">{mov.materialName}</span>
                        <p className="text-[11px] text-slate-400">{mov.reason} • {mov.date}</p>
                      </div>
                    </div>
                    <span
                      className={`font-black text-xs ${
                        mov.quantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity} {mov.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB COMPRAS DE MATERIALES */}
        {/* ============================================================ */}
        {activeTab === 'compras' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-green-100 text-green-600 rounded-xl font-bold">🛒</span>
                  <h3 className="font-black text-base text-slate-900">Registro de Compras de Materia Prima</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Cargá cada compra de papel, cartón o friselina. El sistema sumará el stock de forma automática.
                </p>
              </div>

              <button
                onClick={() => setPurchaseFormOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-green-600/20"
              >
                <Plus className="w-4 h-4" /> Cargar Nueva Compra
              </button>
            </div>

            {purchaseFormOpen && (
              <div className="bg-white rounded-2xl border-2 border-green-500 p-6 shadow-lg space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="font-black text-sm text-slate-900">Registrar Compra de Insumos</h4>
                  <button
                    onClick={() => setPurchaseFormOpen(false)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSavePurchase} className="space-y-4 text-xs font-semibold text-slate-700">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block mb-1 text-slate-500 uppercase">Fecha de Compra</label>
                      <input
                        type="date"
                        required
                        value={purDate}
                        onChange={(e) => setPurDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-slate-500 uppercase">Material / Insumo</label>
                      <select
                        value={purMaterialId}
                        onChange={(e) => {
                          setPurMaterialId(e.target.value);
                          const m = materials.find((mat) => mat.id === e.target.value);
                          if (m) setPurUnitPrice(m.costPerUnit);
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      >
                        {materials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-slate-500 uppercase">Proveedor</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Papelera San Martín, Textil..."
                        value={purSupplier}
                        onChange={(e) => setPurSupplier(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block mb-1 text-slate-500 uppercase">Cantidad Comprada</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={purQty}
                        onChange={(e) => setPurQty(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-slate-500 uppercase">Precio Unitario ($)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={purUnitPrice}
                        onChange={(e) => setPurUnitPrice(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-slate-500 uppercase">Costo Total Calculado</label>
                      <div className="w-full p-2.5 bg-green-50 border border-green-200 rounded-lg text-green-800 font-black text-sm">
                        ${(purQty * purUnitPrice).toLocaleString('es-AR')}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-500 uppercase">N° Factura / Comprobante / Notas</label>
                    <input
                      type="text"
                      placeholder="Ej: Factura A #0002-3918 / Pago transferencia"
                      value={purNotes}
                      onChange={(e) => setPurNotes(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setPurchaseFormOpen(false)}
                      className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 font-bold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-md shadow-green-600/20"
                    >
                      Guardar Compra y Sumar a Stock
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-black text-sm text-slate-900">Historial de Compras de Insumos</h4>
                <span className="text-xs text-slate-500">Total gastado: <b>${totalGastosCompras.toLocaleString('es-AR')}</b></span>
              </div>

              <div className="divide-y divide-slate-100 overflow-x-auto">
                {purchases.map((pur) => (
                  <div key={pur.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">{pur.materialName}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                          {pur.supplier}
                        </span>
                        <span className="text-xs text-slate-400">{pur.date}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Cantidad: <b>+{pur.quantity} {pur.unit}</b> a ${pur.unitPrice}/{pur.unit}
                        {pur.notes && <span className="text-slate-400"> • {pur.notes}</span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-slate-900">
                        ${pur.totalCost.toLocaleString('es-AR')}
                      </span>
                      <button
                        onClick={() => deleteMaterialPurchase(pur.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Eliminar compra"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB REPORTES & FINANZAS (CAJA) */}
        {/* ============================================================ */}
        {activeTab === 'reportes' && (
          <FinancialReports
            orders={orders}
            purchases={purchases}
            customers={customers}
            materials={materials}
          />
        )}

        {/* ============================================================ */}
        {/* TAB PRODUCTOS: ABM SIMPLE */}
        {/* ============================================================ */}
        {activeTab === 'productos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-purple-100 text-purple-600 rounded-xl font-bold">🛍️</span>
                  <h3 className="font-black text-base text-slate-900">ABM Simple de Productos & Precios</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Creá, editá o eliminá productos de la tienda pública de forma rápida y sencilla.
                </p>
              </div>

              <button
                onClick={handleOpenCreateProduct}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-orange-600/25"
              >
                <Plus className="w-4 h-4" /> + Crear Nuevo Producto
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((prod) => (
                <div key={prod.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden relative">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                        {prod.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">{prod.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{prod.description}</p>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Precio Pack:</span>
                        <span className="font-black text-slate-900">
                          ${prod.variants[0]?.price ? prod.variants[0].price.toLocaleString('es-AR') : 'A cotizar'}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Medidas:</span>
                        <span className="font-medium">{prod.sizes.join(', ')}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Materiales:</span>
                        <span className="font-medium">{prod.materials.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEditProduct(prod)}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" /> Editar Producto
                    </button>

                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB PEDIDOS & BANDEJA */}
        {/* ============================================================ */}
        {activeTab === 'pedidos' && (() => {
          const filteredOrders = orders.filter((order) => {
            const alert = getOrderAlert(order);
            const matchFilter =
              orderStatusFilter === 'todos'
                ? true
                : orderStatusFilter === 'alertas'
                ? alert !== null
                : order.status === orderStatusFilter;

            const query = orderSearch.toLowerCase().trim();
            const matchSearch =
              !query ||
              order.orderNumber.toLowerCase().includes(query) ||
              order.customerName.toLowerCase().includes(query) ||
              (order.businessName && order.businessName.toLowerCase().includes(query)) ||
              order.customerPhone.includes(query) ||
              order.customerCity.toLowerCase().includes(query) ||
              order.id.toLowerCase().includes(query);

            return matchFilter && matchSearch;
          });

          return (
            <div className="space-y-4">
              {/* Header de la pestaña de Pedidos */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-orange-100 text-orange-600 rounded-xl font-bold">🛍️</span>
                    <h3 className="font-black text-base text-slate-900">Gestión de Pedidos & Checkout</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Administrá estados de producción, entregas pactadas, pagos de seña y envío de remitos por WhatsApp.
                  </p>
                </div>

                <button
                  onClick={() => setNewOrderModalOpen(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-600/20 transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" /> + Nuevo Pedido
                </button>
              </div>

              {/* Barra Superior de Filtros & Búsqueda de Pedidos */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Buscar por cliente, pedido, tel, ciudad..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filtros por Estado y Alertas */}
                <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs">
                  <button
                    onClick={() => setOrderStatusFilter('todos')}
                    className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                      orderStatusFilter === 'todos'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Todos ({orders.length})
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('alertas')}
                    className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors flex items-center gap-1.5 ${
                      orderStatusFilter === 'alertas'
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        : ordersWithAlerts.length > 0
                        ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <span>🚨 Atrasados / Alertas</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${orderStatusFilter === 'alertas' ? 'bg-red-800 text-white' : 'bg-red-600 text-white'}`}>
                      {ordersWithAlerts.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('nuevo')}
                    className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                      orderStatusFilter === 'nuevo'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    Nuevos ({orders.filter((o) => o.status === 'nuevo').length})
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('en_taller')}
                    className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                      orderStatusFilter === 'en_taller'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    En Taller ({orders.filter((o) => o.status === 'en_taller').length})
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('listo')}
                    className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                      orderStatusFilter === 'listo'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    Listos ({orders.filter((o) => o.status === 'listo').length})
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('entregado')}
                    className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                      orderStatusFilter === 'entregado'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    Entregados ({orders.filter((o) => o.status === 'entregado').length})
                  </button>
                </div>
              </div>

              {/* Lista de Pedidos */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                    <span>Bandeja de Pedidos & Checkout</span>
                    <span className="text-xs font-normal text-slate-400">({filteredOrders.length} resultado{filteredOrders.length !== 1 ? 's' : ''})</span>
                  </h3>
                  <span className="text-xs text-slate-500 hidden sm:inline">Toca en WhatsApp para hablar directamente con el cliente</span>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-800">No se encontraron pedidos</h4>
                    <p className="text-xs text-slate-500">Probá modificando el filtro de búsqueda o el estado.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 overflow-x-auto">
                    {filteredOrders.map((order) => {
                      const alert = getOrderAlert(order);

                      return (
                        <div
                          key={order.id}
                          className={`p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-colors ${
                            alert
                              ? 'bg-red-50/25 border-l-4 border-l-red-500 hover:bg-red-50/40'
                              : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <div className="space-y-2 flex-1 w-full">
                            {/* ALERTA VISIBLE SI EXISTE */}
                            {alert && (
                              <div
                                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs mb-1 ${
                                  alert.severity === 'high'
                                    ? 'bg-red-100/80 border-red-300 text-red-950 font-semibold'
                                    : 'bg-amber-100/80 border-amber-300 text-amber-950 font-medium'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                                  <div>
                                    <span className="font-black uppercase tracking-wider text-[10px] mr-1.5 bg-white/80 px-1.5 py-0.5 rounded-md border border-red-200">
                                      {alert.badge}
                                    </span>
                                    <span>{alert.title}</span>
                                    <span className="text-slate-600 font-normal hidden sm:inline"> — {alert.description}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-black text-sm text-slate-900">{order.orderNumber}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  order.status === 'nuevo'
                                    ? 'bg-blue-100 text-blue-700'
                                    : order.status === 'en_taller'
                                    ? 'bg-amber-100 text-amber-800'
                                    : order.status === 'listo'
                                    ? 'bg-purple-100 text-purple-700'
                                    : order.status === 'entregado'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {order.status.replace('_', ' ')}
                              </span>
                              <span className="text-xs text-slate-400">
                                Creado: {new Date(order.createdAt).toLocaleDateString('es-AR')}
                              </span>
                            </div>

                            <div className="text-xs text-slate-700">
                              <span className="font-bold">{order.customerName}</span>
                              {order.businessName && <span className="text-slate-500 font-medium"> ({order.businessName})</span>}
                              <span className="text-slate-400"> • </span>
                              <span>📍 {order.customerCity} - {order.customerAddress}</span>
                            </div>

                            {/* Resumen de items del pedido */}
                            <div className="text-xs text-slate-600 bg-slate-100/90 p-2.5 rounded-xl space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span>
                                    • {item.quantity} un. <b>{item.productName}</b> ({item.size} - {item.material})
                                  </span>
                                  <span className="font-bold text-slate-800">${item.totalPrice.toLocaleString('es-AR')}</span>
                                </div>
                              ))}
                            </div>

                            {/* Fecha de Entrega Comprometida (Editable directamente) */}
                            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Calendar className="w-3.5 h-3.5 text-orange-600" />
                                <span className="font-bold">Fecha pactada de entrega:</span>
                                <input
                                  type="date"
                                  value={order.estimatedDeliveryDate || ''}
                                  onChange={(e) => updateOrderDeliveryDate(order.id, e.target.value)}
                                  className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-2xs font-semibold"
                                />
                              </div>
                              {order.notes && (
                                <span className="text-slate-500 italic bg-amber-50/70 border border-amber-200/60 px-2 py-0.5 rounded-lg text-[11px]">
                                  📝 {order.notes}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
                            <div className="text-right">
                              <span className="text-xs text-slate-400 block">
                                Total: <b>${order.totalAmount.toLocaleString('es-AR')}</b>
                              </span>
                              <span className="text-xs text-green-600 block">
                                Seña: ${order.depositAmount.toLocaleString('es-AR')}
                              </span>
                              <span className="text-xs text-orange-600 font-bold block">
                                Resta: ${order.balanceDue.toLocaleString('es-AR')}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <a
                                href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(
                                  order.customerName
                                )},%20te%20escribo%20de%20VQ%20Bolsas%20por%20tu%20pedido%20${order.orderNumber}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5" /> WhatsApp
                              </a>

                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-700 focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-2xs"
                              >
                                <option value="nuevo">Nuevo</option>
                                <option value="contactado">Contactado / Seña</option>
                                <option value="en_diseno">En Diseño</option>
                                <option value="en_taller">En Taller</option>
                                <option value="listo">Listo p/ Entregar</option>
                                <option value="entregado">Entregado & Cobrado</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* TAB TALLER & KANBAN */}
        {/* ============================================================ */}
        {activeTab === 'taller' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-100 text-amber-600 rounded-xl font-bold">🏭</span>
                  <h3 className="font-black text-base text-slate-900">Tablero Kanban de Taller & Impresión</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Seguimiento del flujo de trabajo por fases de producción (Cola de Diseño, Impresión/Máquinas y Empaquetado).
                </p>
              </div>

              <button
                onClick={() => setNewOrderModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-600/20 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> + Nuevo Pedido
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-200/70 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between font-black text-xs uppercase text-slate-600 tracking-wider">
                <span>📋 En Cola / Diseño</span>
                <span className="bg-white px-2 py-0.5 rounded-full text-slate-800">
                  {orders.filter((o) => o.status === 'nuevo' || o.status === 'en_diseno').length}
                </span>
              </div>
              {orders
                .filter((o) => o.status === 'nuevo' || o.status === 'en_diseno')
                .map((o) => {
                  const alert = getOrderAlert(o);
                  return (
                    <div
                      key={o.id}
                      className={`bg-white p-4 rounded-xl shadow-xs border space-y-2 transition-all ${
                        alert ? 'border-red-300 ring-2 ring-red-100 bg-red-50/20' : 'border-slate-200'
                      }`}
                    >
                      {alert && (
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                          <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
                          <span>{alert.badge}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-900">{o.orderNumber}</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">
                          {o.customerName}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">
                        {o.items.map((i, idx) => (
                          <p key={idx}>• {i.quantity}u. {i.productName} ({i.size})</p>
                        ))}
                      </div>
                      <button
                        onClick={() => updateOrderStatus(o.id, 'en_taller')}
                        className="w-full text-xs font-bold bg-orange-600 text-white py-1.5 rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Mandar a Taller / Máquinas ➔
                      </button>
                    </div>
                  );
                })}
            </div>

            <div className="bg-amber-100/60 p-4 rounded-2xl space-y-3 border border-amber-200">
              <div className="flex items-center justify-between font-black text-xs uppercase text-amber-900 tracking-wider">
                <span>⚙️ En Taller (Corte / Impresión)</span>
                <span className="bg-amber-600 text-white px-2 py-0.5 rounded-full">
                  {orders.filter((o) => o.status === 'en_taller').length}
                </span>
              </div>
              {orders
                .filter((o) => o.status === 'en_taller')
                .map((o) => {
                  const alert = getOrderAlert(o);
                  return (
                    <div
                      key={o.id}
                      className={`bg-white p-4 rounded-xl shadow-xs border space-y-2 transition-all ${
                        alert ? 'border-red-400 ring-2 ring-red-200 bg-red-50/30' : 'border-amber-300'
                      }`}
                    >
                      {alert && (
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                          <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
                          <span>{alert.badge}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-900">{o.orderNumber}</span>
                        <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md font-bold">
                          {o.businessName || o.customerName}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 bg-amber-50 p-2 rounded-md">
                        {o.items.map((i, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <p className="font-bold text-slate-800">• {i.quantity} un. {i.productName}</p>
                            <p className="text-[11px] text-slate-500">Material: {i.material} | Medida: {i.size}</p>
                          </div>
                        ))}
                      </div>
                      {o.estimatedDeliveryDate && (
                        <p className="text-[10px] text-slate-500 font-medium">
                          📅 Entrega: {new Date(o.estimatedDeliveryDate + 'T12:00:00').toLocaleDateString('es-AR')}
                        </p>
                      )}
                      <button
                        onClick={() => updateOrderStatus(o.id, 'listo')}
                        className="w-full text-xs font-bold bg-purple-600 text-white py-1.5 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Marcar Listo / Empaquetado ➔
                      </button>
                    </div>
                  );
                })}
            </div>

            <div className="bg-green-100/60 p-4 rounded-2xl space-y-3 border border-green-200">
              <div className="flex items-center justify-between font-black text-xs uppercase text-green-900 tracking-wider">
                <span>✅ Listos / Empaquetados</span>
                <span className="bg-green-600 text-white px-2 py-0.5 rounded-full">
                  {orders.filter((o) => o.status === 'listo').length}
                </span>
              </div>
              {orders
                .filter((o) => o.status === 'listo')
                .map((o) => (
                  <div key={o.id} className="bg-white p-4 rounded-xl shadow-xs border border-green-300 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-900">{o.orderNumber}</span>
                      <span className="text-[10px] text-orange-600 font-bold">
                        Resta cobrar: ${o.balanceDue.toLocaleString('es-AR')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">📍 {o.customerCity} - {o.customerAddress}</p>
                    <button
                      onClick={() => {
                        updateOrderStatus(o.id, 'entregado');
                        updateOrderPayment(o.id, o.totalAmount);
                      }}
                      className="w-full text-xs font-bold bg-green-600 text-white py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Entregar & Cobrar Saldo ✓
                    </button>
                  </div>
                ))}
            </div>
          </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB RECOMPRA CLIENTES B2B */}
        {/* ============================================================ */}
        {activeTab === 'recompra' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl font-bold">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Motor de Recompra B2B para Comercios</h3>
                <p className="text-xs text-slate-500">
                  Detecta clientes recurrentes y te sugiere cuándo escribirles antes de que agoten su stock de bolsas.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  cliente: 'Boutique Chicas Chic',
                  contacto: 'Mariana López',
                  telefono: '+5492346597969',
                  ultimaCompra: 'Hace 42 días (500 bolsas)',
                  alerta: '🔴 Stock estimado crítico (menos del 15%)',
                  sugerencia: 'Ofrecer repetición de 500u con 5% de descuento por fidelidad',
                },
                {
                  cliente: 'Romero Eventos & Cumpleaños',
                  contacto: 'Santiago Romero',
                  telefono: '+5492346597969',
                  ultimaCompra: 'Hace 25 días (Pochocleras y Cumple)',
                  alerta: '🟡 Recompra programada fin de mes',
                  sugerencia: 'Consultar por nuevos diseños para eventos del próximo mes',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{item.cliente}</span>
                      <span className="text-xs text-slate-500">({item.contacto})</span>
                    </div>
                    <p className="text-xs text-slate-600">Último pedido: {item.ultimaCompra}</p>
                    <p className="text-xs font-bold text-orange-600">{item.alerta}</p>
                    <p className="text-xs text-slate-500 italic">💡 Sugerencia: {item.sugerencia}</p>
                  </div>

                  <a
                    href={`https://wa.me/${item.telefono.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(item.contacto)},%20¿cómo%20están%20con%20el%20stock%20de%20bolsas?%20Podemos%20prepararles%20la%20reposición`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" /> Enviar Mensaje de Reposición
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB CALCULADORA DE COSTOS & MARGEN */}
        {/* ============================================================ */}
        {activeTab === 'calculadora' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Calculadora de Costos Reales & Margen Neto</h3>
                <p className="text-xs text-slate-500">
                  Desglosá la materia prima, merma y mano de obra para asegurar la rentabilidad antes de pasar un precio.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4 text-xs font-semibold text-slate-700">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-slate-500 uppercase">Cantidad de Bolsas</label>
                    <input
                      type="number"
                      value={calcQty}
                      onChange={(e) => setCalcQty(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-500 uppercase">Precio de Venta Unitario ($)</label>
                    <input
                      type="number"
                      value={calcSalePrice}
                      onChange={(e) => setCalcSalePrice(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold text-orange-600"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Costos por Unidad:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-500">Papel / Friselina ($)</label>
                      <input
                        type="number"
                        value={calcPaperCost}
                        onChange={(e) => setCalcPaperCost(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500">Manija / Cinta ($)</label>
                      <input
                        type="number"
                        value={calcHandleCost}
                        onChange={(e) => setCalcHandleCost(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500">Tinta / Impresión ($)</label>
                      <input
                        type="number"
                        value={calcInkCost}
                        onChange={(e) => setCalcInkCost(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500">Armado / Mano de obra ($)</label>
                      <input
                        type="number"
                        value={calcLaborCost}
                        onChange={(e) => setCalcLaborCost(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block">
                    Resultado Económico del Pedido
                  </span>
                  <div className="mt-4 space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span>Costo Unitario Real (inc. 5% merma):</span>
                      <span className="font-bold text-white">${calcTotalUnitCost}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span>Ganancia Neta por Bolsa:</span>
                      <span className="font-bold text-green-400">+${calcUnitProfit}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span>Margen Bruto Porcentual:</span>
                      <span className="font-black text-amber-300 text-sm">{calcMarginPercent}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400 block">Ganancia Neta Total del Lote ({calcQty}u):</span>
                  <span className="text-3xl font-black text-green-400 mt-1 block">
                    ${calcTotalOrderProfit.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB INSTAGRAM FEED */}
        {/* ============================================================ */}
        {activeTab === 'instagram' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl font-bold">
                    📸
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900">
                      Sincronización con Instagram (@vq_bolsas)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Fotos y trabajos que se muestran en la galería de la tienda web.
                    </p>
                  </div>
                </div>

                <a
                  href="https://instagram.com/vq_bolsas"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-pink-50 text-pink-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-pink-200 hover:bg-pink-100 transition-colors shrink-0"
                >
                  Ver Perfil @vq_bolsas ↗
                </a>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newIgImage) return;
                  addInstagramPost({
                    caption: newIgCaption || 'Trabajo terminado por VQ Bolsas',
                    mediaUrl: newIgImage,
                    permalink: newIgLink || 'https://instagram.com/vq_bolsas',
                    timestamp: 'Hoy',
                  });
                  setNewIgCaption('');
                  setNewIgImage('');
                }}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
              >
                <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                  + Agregar Foto al Feed de la Web
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="URL de imagen (https://...)"
                    value={newIgImage}
                    onChange={(e) => setNewIgImage(e.target.value)}
                    className="p-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Descripción / Epígrafe"
                    value={newIgCaption}
                    onChange={(e) => setNewIgCaption(e.target.value)}
                    className="p-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <button
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs py-2 rounded-lg"
                  >
                    Publicar en Galería
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {instagramPosts.map((post) => (
                  <div key={post.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col justify-between">
                    <div className="aspect-square bg-slate-200 overflow-hidden relative">
                      <img src={post.mediaUrl} alt="IG post" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2.5 space-y-1.5">
                      <p className="text-[11px] text-slate-700 line-clamp-2">{post.caption}</p>
                      <button
                        onClick={() => deleteInstagramPost(post.id)}
                        className="text-[10px] text-red-500 hover:text-red-700 font-bold"
                      >
                        Eliminar foto
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* MODAL: FICHA & HISTORIAL DE COMPRAS & LOGO DEL CLIENTE */}
      {/* ============================================================ */}
      {selectedCustomerForHistory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                {/* Logo del Cliente Grande */}
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm relative group">
                  {selectedCustomerForHistory.logoUrl ? (
                    <img
                      src={selectedCustomerForHistory.logoUrl}
                      alt={selectedCustomerForHistory.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-black text-lg text-indigo-600">
                      {selectedCustomerForHistory.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">{selectedCustomerForHistory.name}</h3>
                    {getChannelBadge(selectedCustomerForHistory.channel)}
                  </div>
                  {selectedCustomerForHistory.businessName ? (
                    <span className="text-xs font-bold text-indigo-600 block">
                      🏢 {selectedCustomerForHistory.businessName}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 block">Cliente Particular</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCustomerForHistory(null);
                  setNewOrderForCustModal(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SECCIÓN GALERÍA DE LOGOS, MATRICES Y MUESTRAS DEL CLIENTE */}
            {(() => {
              const customerImages = selectedCustomerForHistory.images && selectedCustomerForHistory.images.length > 0
                ? selectedCustomerForHistory.images
                : selectedCustomerForHistory.logoUrl
                ? [selectedCustomerForHistory.logoUrl]
                : [];

              return (
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 my-4 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                        Galería de Diseños, Matrices & Fotos ({customerImages.length})
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>+ Subir Imágenes</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleCustomerMultipleFiles(e, true)}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Agregar por URL */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="O pegar URL de imagen / muestra digital (https://...)"
                      value={sheetImageUrlInput}
                      onChange={(e) => setSheetImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImageUrl(sheetImageUrlInput, true);
                        }
                      }}
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddImageUrl(sheetImageUrlInput, true)}
                      className="px-3 py-2 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-xl shrink-0 transition-colors"
                    >
                      Agregar
                    </button>
                  </div>

                  {/* Grid de Miniaturas */}
                  {customerImages.length === 0 ? (
                    <div className="p-6 text-center border-2 border-dashed border-indigo-200 rounded-xl bg-white/60">
                      <ImageIcon className="w-8 h-8 text-indigo-300 mx-auto mb-1.5" />
                      <p className="text-xs font-bold text-slate-700">Sin imágenes de diseño aún</p>
                      <p className="text-[11px] text-slate-400">Podés subir el logo principal, variantes de color y fotos de bolsas terminadas.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      {customerImages.map((imgUrl, idx) => {
                        const isPrimary = selectedCustomerForHistory.logoUrl === imgUrl;

                        return (
                          <div
                            key={idx}
                            className={`group relative bg-white rounded-xl border overflow-hidden transition-all shadow-2xs ${
                              isPrimary ? 'border-indigo-600 ring-2 ring-indigo-300' : 'border-slate-200 hover:border-indigo-300'
                            }`}
                          >
                            {/* Imagen */}
                            <div
                              className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer relative"
                              onClick={() => setPreviewImageZoom(imgUrl)}
                            >
                              <img src={imgUrl} alt={`Diseño ${idx + 1}`} className="w-full h-full object-contain p-1" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity">
                                <span className="p-1.5 bg-white text-slate-900 rounded-lg shadow-md hover:scale-110 transition-transform">
                                  <ZoomIn className="w-4 h-4" />
                                </span>
                              </div>
                            </div>

                            {/* Badge Principal */}
                            {isPrimary && (
                              <span className="absolute top-1.5 left-1.5 bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5 pointer-events-none">
                                <Star className="w-2.5 h-2.5 fill-current" /> Principal
                              </span>
                            )}

                            {/* Controles inferiores de la tarjeta de imagen */}
                            <div className="p-1.5 bg-white border-t border-slate-100 flex items-center justify-between text-[10px]">
                              {!isPrimary ? (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryCustomerLogo(imgUrl, true)}
                                  className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline flex items-center gap-0.5"
                                  title="Usar como logo principal"
                                >
                                  <Star className="w-3 h-3" /> Principal
                                </button>
                              ) : (
                                <span className="text-[10px] text-indigo-700 font-bold">Oficial</span>
                              )}

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setPreviewImageZoom(imgUrl)}
                                  className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
                                  title="Ver en grande"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCustomerImage(idx, true)}
                                  className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors"
                                  title="Eliminar esta imagen"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Datos de Contacto y Resumen del Cliente */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Contacto</span>
                <p className="font-bold text-slate-800">📱 {selectedCustomerForHistory.phone}</p>
                <p className="text-slate-500 text-[11px]">Canal: {selectedCustomerForHistory.channel.toUpperCase()}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Ubicación</span>
                <p className="font-bold text-slate-800">📍 {selectedCustomerForHistory.city}</p>
                <p className="text-slate-500 text-[11px] truncate">{selectedCustomerForHistory.address || 'Sin dirección'}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Resumen Comercial</span>
                <p className="font-black text-slate-900 text-sm">
                  {getCustomerOrders(selectedCustomerForHistory).length} compras
                </p>
                <p className="text-green-700 font-bold text-[11px]">
                  Total: $
                  {getCustomerOrders(selectedCustomerForHistory)
                    .reduce((sum, o) => sum + o.totalAmount, 0)
                    .toLocaleString('es-AR')}
                </p>
              </div>
            </div>

            {selectedCustomerForHistory.notes && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 mb-4">
                <strong className="font-bold">📝 Notas del Cliente:</strong> {selectedCustomerForHistory.notes}
              </div>
            )}

            {/* Botones de Acción Rápida (WhatsApp / Nueva Venta) */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pt-2 border-t border-slate-100">
              <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                <span>Historial de Compras & Pedidos</span>
              </h4>

              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${selectedCustomerForHistory.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(selectedCustomerForHistory.name)},%20te%20escribimos%20de%20VQ%20Bolsas`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" /> Hablar por WhatsApp
                </a>

                <button
                  onClick={() => setNewOrderForCustModal(!newOrderForCustModal)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> + Cargar Venta Manual
                </button>
              </div>
            </div>

            {/* Formulario Desplegable para Cargar Venta Manual al Cliente */}
            {newOrderForCustModal && (
              <form
                onSubmit={handleSaveCustomerOrder}
                className="bg-indigo-50/80 border-2 border-indigo-300 rounded-2xl p-4 mb-4 space-y-3 text-xs font-semibold text-slate-700"
              >
                <div className="flex justify-between items-center">
                  <h5 className="font-black text-xs text-indigo-900 uppercase">Nueva Venta para {selectedCustomerForHistory.name}</h5>
                  <button type="button" onClick={() => setNewOrderForCustModal(false)} className="text-slate-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-slate-500">Producto / Modelo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Bolsas Friselina 30x40 estampadas"
                      value={custOrderProductName}
                      onChange={(e) => setCustOrderProductName(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-500">Cantidad (Unidades)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="100"
                      value={custOrderQty === 0 ? '' : custOrderQty}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCustOrderQty(v === '' ? 0 : Number(v));
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1 text-slate-500">Monto Total ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="0"
                      value={custOrderTotal === 0 ? '' : custOrderTotal}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCustOrderTotal(v === '' ? 0 : Number(v));
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-500">Seña Cobrada ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="0"
                      value={custOrderDeposit === 0 ? '' : custOrderDeposit}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCustOrderDeposit(v === '' ? 0 : Number(v));
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-500">Estado Inicial</label>
                    <select
                      value={custOrderStatus}
                      onChange={(e) => setCustOrderStatus(e.target.value as any)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                    >
                      <option value="nuevo">Nuevo / En Cola</option>
                      <option value="en_taller">En Taller (Producción)</option>
                      <option value="listo">Listo p/ Entregar</option>
                      <option value="entregado">Entregado & Cobrado</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setNewOrderForCustModal(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs"
                  >
                    Registrar Venta
                  </button>
                </div>
              </form>
            )}

            {/* Listado de Compras del Cliente */}
            <div className="space-y-3">
              {getCustomerOrders(selectedCustomerForHistory).length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">No hay compras registradas para este cliente aún</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Podés cargar una venta manual o cuando compre por la tienda web aparecerá aquí automáticamente.
                  </p>
                </div>
              ) : (
                getCustomerOrders(selectedCustomerForHistory).map((order) => (
                  <div
                    key={order.id}
                    className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-4 transition-colors space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{order.orderNumber}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            order.status === 'nuevo'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'en_taller'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'listo'
                              ? 'bg-purple-100 text-purple-700'
                              : order.status === 'entregado'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-slate-400">
                          📅 {new Date(order.createdAt).toLocaleDateString('es-AR')}
                        </span>
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(order.customerName)},%20te%20escribo%20por%20tu%20pedido%20${order.orderNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-600 font-bold hover:underline inline-flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" /> WhatsApp Pedido
                        </a>
                      </div>
                    </div>

                    {/* Ítems del Pedido */}
                    <div className="space-y-1 text-xs text-slate-700">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100">
                          <div>
                            <span className="font-bold">{it.quantity} un.</span> {it.productName}
                            <span className="text-slate-400 text-[11px] block">
                              Medida: {it.size} | Material: {it.material} {it.customNotes ? `• ${it.customNotes}` : ''}
                            </span>
                          </div>
                          <span className="font-bold text-slate-900">${it.totalPrice.toLocaleString('es-AR')}</span>
                        </div>
                      ))}
                    </div>

                    {/* Desglose de Pago */}
                    <div className="flex justify-between items-center text-xs pt-1 text-slate-600 font-medium">
                      <span>Total: <b className="text-slate-900">${order.totalAmount.toLocaleString('es-AR')}</b></span>
                      <span>Seña: <b className="text-green-600">${order.depositAmount.toLocaleString('es-AR')}</b></span>
                      <span>
                        Saldo: <b className={order.balanceDue > 0 ? 'text-orange-600' : 'text-slate-400'}>
                          ${order.balanceDue.toLocaleString('es-AR')}
                        </b>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setSelectedCustomerForHistory(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ABM CLIENTES (CREAR / EDITAR) */}
      {/* ============================================================ */}
      {customerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-black text-slate-900">
                {editingCustomerId ? '✏️ Editar Cliente' : '👥 Nuevo Cliente / Comercio'}
              </h3>
              <button
                onClick={() => setCustomerModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Cargá los datos del contacto, comercio y su logo para el taller.
            </p>

            <form onSubmit={handleSaveCustomer} className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold">1. Nombre y Apellido *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Mariana López"
                    value={custFormName}
                    onChange={(e) => setCustFormName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold">2. Comercio / Marca (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: Boutique Chicas Chic"
                    value={custFormBusiness}
                    onChange={(e) => setCustFormBusiness(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold">3. Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 2346-597969"
                    value={custFormPhone}
                    onChange={(e) => setCustFormPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold">4. Origen / Canal</label>
                  <select
                    value={custFormChannel}
                    onChange={(e) => setCustFormChannel(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="whatsapp">WhatsApp Directo</option>
                    <option value="web">Tienda Web E-commerce</option>
                    <option value="local_taller">Mostrador / Taller Fábrica</option>
                    <option value="instagram">Instagram Direct</option>
                    <option value="recomendacion">Recomendación / Boca a boca</option>
                    <option value="otro">Otro Canal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold">5. Localidad / Ciudad</label>
                  <input
                    type="text"
                    placeholder="Ej: Chivilcoy, Alberti, Suipacha..."
                    value={custFormCity}
                    onChange={(e) => setCustFormCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold">6. Dirección / Calle</label>
                  <input
                    type="text"
                    placeholder="Ej: Av. Soárez 142"
                    value={custFormAddress}
                    onChange={(e) => setCustFormAddress(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* 7. GALERÍA DE DISEÑOS, LOGOS Y FOTOS DEL CLIENTE */}
              <div className="bg-indigo-50/70 border border-indigo-200/80 p-3.5 sm:p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <label className="text-slate-900 uppercase font-black text-[11px] tracking-wider">
                      7. Diseños, Logos & Muestras ({custFormImages.length})
                    </label>
                  </div>
                  <span className="text-[10px] text-indigo-600 font-semibold">Podés subir varios archivos</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <label className="cursor-pointer bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-xs px-3 py-2 rounded-xl border border-indigo-300 flex items-center justify-center gap-1.5 transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir Archivos (PC / Celular)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleCustomerMultipleFiles(e, false)}
                    />
                  </label>

                  <div className="flex flex-1 gap-1.5">
                    <input
                      type="text"
                      placeholder="O pegar URL de imagen..."
                      value={custFormImageUrlInput}
                      onChange={(e) => setCustFormImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImageUrl(custFormImageUrlInput, false);
                        }
                      }}
                      className="flex-1 p-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddImageUrl(custFormImageUrlInput, false)}
                      className="px-3 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors shadow-2xs"
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                {/* Miniaturas de imágenes cargadas en el formulario */}
                {custFormImages.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-slate-500 font-medium block">
                      ⭐ Hacé clic en una foto para seleccionarla como <b>Logo Principal</b>:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {custFormImages.map((imgUrl, idx) => {
                        const isPrimary = custFormLogo === imgUrl;
                        return (
                          <div
                            key={idx}
                            className={`relative bg-white rounded-xl border overflow-hidden group shadow-2xs transition-all ${
                              isPrimary ? 'border-indigo-600 ring-2 ring-indigo-300' : 'border-slate-200 hover:border-indigo-200'
                            }`}
                          >
                            <div
                              className="aspect-square bg-slate-50 flex items-center justify-center p-1 cursor-pointer"
                              onClick={() => handleSetPrimaryCustomerLogo(imgUrl, false)}
                              title="Marcar como logo principal"
                            >
                              <img src={imgUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-contain" />
                            </div>

                            {isPrimary && (
                              <span className="absolute top-1 left-1 bg-indigo-600 text-white text-[8px] font-black px-1 rounded shadow-xs flex items-center gap-0.5">
                                <Star className="w-2 h-2 fill-current" /> Principal
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveCustomerImage(idx, false)}
                              className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-md shadow-xs transition-colors"
                              title="Quitar imagen"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-1 text-slate-500 uppercase font-bold">8. Notas / Preferencias de Bolsas</label>
                <textarea
                  rows={2}
                  placeholder="Ej: Suele pedir friselina 30x40 en negro. Logo ya vectorizado en el taller..."
                  value={custFormNotes}
                  onChange={(e) => setCustFormNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCustomerModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30"
                >
                  {editingCustomerId ? 'Guardar Cambios' : 'Guardar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ABM SIMPLE DE PRODUCTOS */}
      {/* ============================================================ */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-black text-slate-900">
                {editingProductId ? '✏️ Editar Producto' : '✨ Crear Nuevo Producto'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Completá los datos del producto para que se publique en la tienda.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-500 uppercase font-bold">1. Nombre del Producto / Pack</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Bolsas de Cumpleaños Stitch & Spiderman"
                  value={prodFormName}
                  onChange={(e) => setProdFormName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold">2. Categoría</label>
                  <select
                    value={prodFormCategory}
                    onChange={(e) => setProdFormCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="cumpleanos">Cumpleaños & Eventos</option>
                    <option value="pochocleras">Pochocleras</option>
                    <option value="comercio">Comercios</option>
                    <option value="personalizadas">Con tu Logo / Personalizadas</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold">3. Precio del Pack ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Ej: 21500"
                    value={prodFormPrice}
                    onChange={(e) => setProdFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold">4. Cantidad Mínima (Pack)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Ej: 50"
                    value={prodFormMinQty}
                    onChange={(e) => setProdFormMinQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold">5. Medidas (separadas x coma)</label>
                  <input
                    type="text"
                    placeholder="Ej: 15x22 cm, 20x30 cm"
                    value={prodFormSizes}
                    onChange={(e) => setProdFormSizes(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-500 uppercase font-bold">6. Materiales (separados x coma)</label>
                <input
                  type="text"
                  placeholder="Ej: Papel Ilustración 150g, Friselina 80g"
                  value={prodFormMaterials}
                  onChange={(e) => setProdFormMaterials(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-500 uppercase font-bold">7. URL de Foto / Imagen</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={prodFormImage}
                  onChange={(e) => setProdFormImage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-500 uppercase font-bold">8. Descripción Corta</label>
                <textarea
                  rows={2}
                  placeholder="Descripción para mostrar a los clientes..."
                  value={prodFormDescription}
                  onChange={(e) => setProdFormDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/30"
                >
                  {editingProductId ? 'Guardar Cambios' : 'Publicar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: NUEVO / EDITAR MATERIAL */}
      {/* ============================================================ */}
      {materialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-black text-slate-900">
                {editingMaterialId ? '✏️ Editar Material / Insumo' : '🧱 Nuevo Material / Insumo'}
              </h3>
              <button
                onClick={() => setMaterialModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Cargá el tipo de insumo que usás en fábrica para controlar el stock.
            </p>

            <form onSubmit={handleSaveMaterial} className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-500 uppercase font-bold">Nombre del Insumo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cartulina Tríplex 240g, Bobina Friselina..."
                  value={matFormName}
                  onChange={(e) => setMatFormName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold">Categoría</label>
                  <select
                    value={matFormCategory}
                    onChange={(e) => setMatFormCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="carton_papel">Papel / Cartón</option>
                    <option value="friselina">Friselina / Tela</option>
                    <option value="manijas_cordones">Manijas / Cordones</option>
                    <option value="tintas">Tintas / Serigrafía</option>
                    <option value="otros">Otros Insumos</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold">Unidad de Medida</label>
                  <select
                    value={matFormUnit}
                    onChange={(e) => setMatFormUnit(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="pliegos">Pliegos</option>
                    <option value="metros">Metros</option>
                    <option value="unidades">Unidades</option>
                    <option value="kg">Kg</option>
                    <option value="rollos">Rollos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold">Stock Actual</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={matFormStock}
                    onChange={(e) => setMatFormStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold">Alerta Mínima</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={matFormMinAlert}
                    onChange={(e) => setMatFormMinAlert(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold">Costo Unit. ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={matFormCostUnit}
                    onChange={(e) => setMatFormCostUnit(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setMaterialModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/30"
                >
                  {editingMaterialId ? 'Guardar Cambios' : 'Registrar Insumo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: DESCUENTO RÁPIDO DE STOCK */}
      {/* ============================================================ */}
      {discountModalOpen && discountTargetMat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-black text-slate-900">
                ✂️ Descontar {discountTargetMat.name}
              </h3>
              <button
                onClick={() => setDiscountModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Stock actual: <b className="text-slate-900">{discountTargetMat.currentStock} {discountTargetMat.unit}</b>
            </p>

            <form onSubmit={handleConfirmDiscount} className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-500 uppercase font-bold">
                  Cantidad a Descontar ({discountTargetMat.unit})
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={discountTargetMat.currentStock}
                  value={discountQty}
                  onChange={(e) => setDiscountQty(Number(e.target.value))}
                  className="w-full p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 font-black text-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-500 uppercase font-bold">
                  Motivo / Destino
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Producción Pedido VQ-1004, Merma..."
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDiscountModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-600/25"
                >
                  Confirmar Descuento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: LIGHTBOX / ZOOM DE IMAGEN DE DISEÑO O LOGO */}
      {/* ============================================================ */}
      {previewImageZoom && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImageZoom(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-slate-900 rounded-3xl p-3 shadow-2xl border border-slate-700 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-2 px-2 text-white border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">Vista previa en alta resolución</span>
              <div className="flex items-center gap-2">
                <a
                  href={previewImageZoom}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Abrir Original
                </a>
                <button
                  onClick={() => setPreviewImageZoom(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={previewImageZoom}
                alt="Zoom Diseño"
                className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-lg bg-white/5 p-2"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ALTA DE NUEVO PEDIDO (WIZARD POR PASOS) */}
      {/* ============================================================ */}
      <NewOrderModal
        isOpen={newOrderModalOpen}
        onClose={() => setNewOrderModalOpen(false)}
        customers={customers}
        products={products}
        onAddOrder={addOrder}
        onAddCustomer={addCustomer}
      />
    </div>
  );
}
