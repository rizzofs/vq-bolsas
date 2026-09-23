'use client';

import React, { useState } from 'react';
import { Customer, Product, Order, CartItem } from '@/types';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Search,
  UserPlus,
  Users,
  Check,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Package,
  MessageCircle,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { VQ_CONFIG } from '@/lib/mockData';

export function NewOrderModal({
  isOpen,
  onClose,
  customers,
  products,
  onAddOrder,
  onAddCustomer,
}: {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  products: Product[];
  onAddOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>) => Customer;
}) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // --- PASO 1: CLIENTE ---
  const [clientMode, setClientMode] = useState<'search' | 'create'>('search');
  const [customerQuery, setCustomerQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Formulario nuevo cliente
  const [newCustName, setNewCustName] = useState('');
  const [newCustBusiness, setNewCustBusiness] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustCity, setNewCustCity] = useState('Chivilcoy');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustChannel, setNewCustChannel] = useState<Customer['channel']>('whatsapp');
  const [newCustNotes, setNewCustNotes] = useState('');

  // --- PASO 2: ARTÍCULOS ---
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || 'custom');
  const [itemProductName, setItemProductName] = useState(products[0]?.name || 'Bolsas Personalizadas con Logo');
  const [itemMaterial, setItemMaterial] = useState('Friselina 80g');
  const [itemSize, setItemSize] = useState('30x40 cm');
  const [itemHandleType, setItemHandleType] = useState('Cinta reforzada');
  const [itemQuantity, setItemQuantity] = useState(100);
  const [itemUnitPrice, setItemUnitPrice] = useState(450);
  const [itemNotes, setItemNotes] = useState('');

  // --- PASO 3: ENTREGA Y PAGOS ---
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDeliveryDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  })();

  const [deliveryDate, setDeliveryDate] = useState(defaultDeliveryDate);
  const [depositAmount, setDepositAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Transferencia Bancaria');
  const [orderStatus, setOrderStatus] = useState<Order['status']>('en_taller');
  const [orderGeneralNotes, setOrderGeneralNotes] = useState('');

  if (!isOpen) return null;

  // Filtrado de clientes en vivo
  const filteredCustomers = customers.filter((c) => {
    const q = customerQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.businessName && c.businessName.toLowerCase().includes(q)) ||
      c.phone.includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  // Manejar selección de producto del catálogo
  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    if (prodId === 'custom') {
      setItemProductName('Bolsas a Medida Especial');
    } else {
      const p = products.find((x) => x.id === prodId);
      if (p) {
        setItemProductName(p.name);
        if (p.materials && p.materials.length > 0) setItemMaterial(p.materials[0]);
        if (p.sizes && p.sizes.length > 0) setItemSize(p.sizes[0]);
        if (p.variants && p.variants.length > 0) {
          const v = p.variants[0];
          setItemQuantity(v.minQuantity || 100);
          setItemUnitPrice(Math.round(v.price / (v.minQuantity || 1)));
        }
      }
    }
  };

  // Agregar item a la lista
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(itemQuantity) || 1;
    const unitPrice = Number(itemUnitPrice) || 0;
    const totalPrice = qty * unitPrice;

    const prod = products.find((p) => p.id === selectedProductId);

    const newItem: CartItem = {
      id: `item-${Date.now()}`,
      productId: selectedProductId,
      productName: itemProductName.trim(),
      category: prod ? prod.category : 'personalizadas',
      image: prod?.image || selectedCustomer?.logoUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
      material: itemMaterial,
      size: itemSize,
      handleType: itemHandleType,
      quantity: qty,
      unitPrice,
      totalPrice,
      customNotes: itemNotes.trim(),
    };

    setItems((prev) => [...prev, newItem]);
    setItemNotes('');
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalOrderAmount = items.reduce((sum, i) => sum + i.totalPrice, 0);
  const balanceDue = Math.max(0, totalOrderAmount - depositAmount);

  // Crear cliente rápido si está en modo "create"
  const handleEnsureCustomer = (): Customer | null => {
    if (clientMode === 'search') {
      return selectedCustomer;
    }

    if (!newCustName.trim()) {
      alert('Por favor, ingresá el nombre del cliente');
      return null;
    }

    const created = onAddCustomer({
      name: newCustName.trim(),
      businessName: newCustBusiness.trim(),
      phone: newCustPhone.trim() || VQ_CONFIG.phoneWhatsapp,
      city: newCustCity.trim() || 'Chivilcoy',
      address: newCustAddress.trim(),
      channel: newCustChannel,
      notes: newCustNotes.trim(),
    });

    setSelectedCustomer(created);
    return created;
  };

  // Guardar pedido final
  const handleSaveOrder = (sendWhatsApp: boolean = false) => {
    let cust = selectedCustomer;
    if (!cust) {
      cust = handleEnsureCustomer();
    }
    if (!cust) return;

    if (items.length === 0) {
      alert('El pedido debe tener al menos 1 artículo');
      return;
    }

    const newCreatedOrder = onAddOrder({
      customerName: cust.name,
      customerPhone: cust.phone,
      customerAddress: cust.address || 'Mostrador / Taller',
      customerCity: cust.city || 'Chivilcoy',
      businessName: cust.businessName,
      items,
      totalAmount: totalOrderAmount,
      depositAmount: Number(depositAmount),
      balanceDue,
      paymentMethod,
      status: orderStatus,
      estimatedDeliveryDate: deliveryDate,
      notes: orderGeneralNotes.trim(),
    });

    if (sendWhatsApp) {
      let msg = `*¡HOLA ${cust.name.toUpperCase()}!* 👋🛍️\n`;
      msg += `Te confirmamos la recepción de tu pedido *#${newCreatedOrder.orderNumber}* en *VQ Bolsas*.\n\n`;
      msg += `📋 *DETALLE DEL TRABAJO:*\n`;
      items.forEach((item) => {
        msg += `• *${item.quantity} un.* ${item.productName} (${item.size} - ${item.material})\n`;
        if (item.customNotes) msg += `  _Detalle: ${item.customNotes}_\n`;
      });
      msg += `\n💰 *Total:* $${totalOrderAmount.toLocaleString('es-AR')}\n`;
      msg += `💳 *Seña abonada:* $${depositAmount.toLocaleString('es-AR')}\n`;
      msg += `💵 *Saldo restante:* $${balanceDue.toLocaleString('es-AR')}\n`;
      if (deliveryDate) {
        msg += `📅 *Fecha pactada de entrega:* ${new Date(deliveryDate + 'T12:00:00').toLocaleDateString('es-AR')}\n`;
      }
      msg += `\n_¡Muchas gracias por confiar en VQ Bolsas! Te avisamos cuando esté listo._ ✨`;

      const encoded = encodeURIComponent(msg);
      window.open(`https://wa.me/${cust.phone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
    }

    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setSelectedCustomer(null);
    setItems([]);
    onClose();
  };

  // Helper para presets de fecha
  const setDeliveryPreset = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setDeliveryDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header con Stepper */}
        <div className="p-5 sm:px-6 border-b border-slate-100 bg-slate-900 text-white shrink-0 relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Fábrica & Taller VQ Bolsas</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">Alta de Nuevo Pedido</h3>

          {/* Stepper Progress */}
          <div className="grid grid-cols-4 gap-2 mt-4 text-xs font-bold">
            {[
              { num: 1, label: '1. Cliente' },
              { num: 2, label: '2. Artículos' },
              { num: 3, label: '3. Plazos & Pagos' },
              { num: 4, label: '4. Resumen' },
            ].map((s) => (
              <div
                key={s.num}
                className={`py-1.5 px-2 rounded-xl text-center border transition-all truncate text-[11px] sm:text-xs ${
                  step === s.num
                    ? 'bg-orange-600 border-orange-500 text-white shadow-md shadow-orange-600/30'
                    : step > s.num
                    ? 'bg-slate-800 border-green-500/50 text-green-400'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}
              >
                {step > s.num ? `✓ ${s.label.split('.')[1]}` : s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Cuerpo del Modal con Scroll */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-xs text-slate-700 space-y-4">
          
          {/* ============================================================ */}
          {/* PASO 1: SELECCIONAR O CREAR CLIENTE */}
          {/* ============================================================ */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">¿Para qué cliente es este pedido?</span>
                
                <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => setClientMode('search')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      clientMode === 'search' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Buscar Existente
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientMode('create')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      clientMode === 'create' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" /> + Nuevo
                  </button>
                </div>
              </div>

              {clientMode === 'search' ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre, comercio, teléfono..."
                      value={customerQuery}
                      onChange={(e) => setCustomerQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  {selectedCustomer && (
                    <div className="p-3.5 bg-green-50 border-2 border-green-500 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-green-200 flex items-center justify-center font-black text-green-700 shrink-0">
                          {selectedCustomer.logoUrl ? (
                            <img src={selectedCustomer.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            selectedCustomer.name.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <span className="font-black text-sm text-green-950 block">{selectedCustomer.name}</span>
                          <span className="text-xs text-green-800 font-medium">
                            {selectedCustomer.businessName ? `🏢 ${selectedCustomer.businessName} • ` : ''}
                            📱 {selectedCustomer.phone}
                          </span>
                        </div>
                      </div>
                      <span className="bg-green-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
                        Seleccionado ✓
                      </span>
                    </div>
                  )}

                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white">
                    {filteredCustomers.length === 0 ? (
                      <div className="p-6 text-center text-slate-500">
                        <p>No se encontró ningún cliente con ese nombre.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setClientMode('create');
                            setNewCustName(customerQuery);
                          }}
                          className="mt-2 text-indigo-600 font-bold hover:underline"
                        >
                          + Dar de alta como nuevo cliente
                        </button>
                      </div>
                    ) : (
                      filteredCustomers.map((cust) => (
                        <div
                          key={cust.id}
                          onClick={() => setSelectedCustomer(cust)}
                          className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                            selectedCustomer?.id === cust.id ? 'bg-indigo-50/70 font-bold' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                              {cust.logoUrl ? (
                                <img src={cust.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                cust.name.substring(0, 2).toUpperCase()
                              )}
                            </div>
                            <div>
                              <span className="text-slate-900 block font-bold">{cust.name}</span>
                              <span className="text-[11px] text-slate-500">
                                {cust.businessName ? `${cust.businessName} • ` : ''}
                                {cust.city}
                              </span>
                            </div>
                          </div>
                          <span className="text-slate-400 font-mono text-xs">{cust.phone}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* Modo Crear Nuevo Cliente */
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 text-slate-600 uppercase font-bold text-[11px]">
                        Nombre y Apellido *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Lucía Gómez"
                        value={newCustName}
                        onChange={(e) => setNewCustName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-slate-600 uppercase font-bold text-[11px]">
                        Comercio / Marca (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Tienda Aurora"
                        value={newCustBusiness}
                        onChange={(e) => setNewCustBusiness(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 text-slate-600 uppercase font-bold text-[11px]">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: 2346-597969"
                        value={newCustPhone}
                        onChange={(e) => setNewCustPhone(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-slate-600 uppercase font-bold text-[11px]">
                        Ciudad / Localidad
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Chivilcoy"
                        value={newCustCity}
                        onChange={(e) => setNewCustCity(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-600 uppercase font-bold text-[11px]">
                      Dirección (Calle / Altura)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Av. Soárez 142"
                      value={newCustAddress}
                      onChange={(e) => setNewCustAddress(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* PASO 2: ARTÍCULOS Y TRABAJOS A REALIZAR */}
          {/* ============================================================ */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Artículos del Pedido ({items.length})</span>
                {items.length > 0 && (
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    Subtotal: ${totalOrderAmount.toLocaleString('es-AR')}
                  </span>
                )}
              </div>

              {/* Lista de Items Agregados */}
              {items.length > 0 && (
                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div
                      key={it.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-xs">{it.productName}</span>
                          <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {it.quantity} un.
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {it.size} • {it.material} {it.handleType ? `• Manija ${it.handleType}` : ''}
                        </p>
                        {it.customNotes && (
                          <p className="text-[10px] text-slate-600 italic bg-white p-1 rounded border border-slate-200">
                            📝 {it.customNotes}
                          </p>
                        )}
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <div>
                          <span className="font-black text-sm text-slate-900 block">
                            ${it.totalPrice.toLocaleString('es-AR')}
                          </span>
                          <span className="text-[10px] text-slate-400">${it.unitPrice}/un</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(it.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulario para Agregar Nuevo Item */}
              <form onSubmit={handleAddItem} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700 block">
                  + Agregar Artículo / Tipo de Bolsa
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-slate-500 uppercase font-bold text-[10px]">Producto Base</label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => handleProductChange(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                      <option value="custom">★ Confección Personalizada a Medida</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-500 uppercase font-bold text-[10px]">Descripción / Título</label>
                    <input
                      type="text"
                      required
                      value={itemProductName}
                      onChange={(e) => setItemProductName(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block mb-1 text-slate-500 uppercase font-bold text-[10px]">Material</label>
                    <input
                      type="text"
                      value={itemMaterial}
                      onChange={(e) => setItemMaterial(e.target.value)}
                      placeholder="Friselina 80g, Kraft..."
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-500 uppercase font-bold text-[10px]">Medida</label>
                    <input
                      type="text"
                      value={itemSize}
                      onChange={(e) => setItemSize(e.target.value)}
                      placeholder="30x40 cm..."
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-500 uppercase font-bold text-[10px]">Manija</label>
                    <select
                      value={itemHandleType}
                      onChange={(e) => setItemHandleType(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                    >
                      <option value="Cinta reforzada">Cinta reforzada</option>
                      <option value="Troquelada / Riñón">Troquelada / Riñón</option>
                      <option value="Cordón de algodón">Cordón de algodón</option>
                      <option value="Manija retorcida">Manija retorcida</option>
                      <option value="Sin manija">Sin manija</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-slate-500 uppercase font-bold text-[10px]">Cantidad de Unidades</label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="100"
                      value={itemQuantity === 0 ? '' : itemQuantity}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value;
                        setItemQuantity(val === '' ? 0 : Number(val));
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-500 uppercase font-bold text-[10px]">Precio Unitario ($)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      placeholder="0"
                      value={itemUnitPrice === 0 ? '' : itemUnitPrice}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value;
                        setItemUnitPrice(val === '' ? 0 : Number(val));
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold text-[10px]">
                    Detalle del Logo / Tintas / Serigrafía (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Logo blanco centrado en frente / Usar matriz guardada"
                    value={itemNotes}
                    onChange={(e) => setItemNotes(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar este artículo (${(itemQuantity * itemUnitPrice).toLocaleString('es-AR')})</span>
                </button>
              </form>
            </div>
          )}

          {/* ============================================================ */}
          {/* PASO 3: PLAZOS DE ENTREGA, PAGOS Y ESTADO */}
          {/* ============================================================ */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Fecha de Entrega */}
              <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <label className="font-black text-xs uppercase tracking-wider text-amber-950">
                      Fecha Comprometida de Entrega
                    </label>
                  </div>
                  <span className="text-[10px] text-amber-800 font-semibold">Plazo para taller</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />

                  {/* Botones de Presets rápidos */}
                  <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setDeliveryPreset(3)}
                      className="px-2.5 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg shrink-0"
                    >
                      En 3 días
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryPreset(5)}
                      className="px-2.5 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg shrink-0"
                    >
                      En 5 días
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryPreset(7)}
                      className="px-2.5 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg shrink-0"
                    >
                      En 1 semana
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryPreset(14)}
                      className="px-2.5 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg shrink-0"
                    >
                      En 2 semanas
                    </button>
                  </div>
                </div>
              </div>

              {/* Facturación y Cobro */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <span className="font-black text-xs uppercase tracking-wider text-slate-700 block">
                  Finanzas & Cobro del Pedido
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Pedido</span>
                    <span className="text-base font-black text-slate-900 block mt-0.5">
                      ${totalOrderAmount.toLocaleString('es-AR')}
                    </span>
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-600 uppercase font-bold text-[10px]">
                      Seña / Pago Inicial ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={totalOrderAmount}
                      placeholder="0"
                      value={depositAmount === 0 ? '' : depositAmount}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDepositAmount(val === '' ? 0 : Number(val));
                      }}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    {/* Botones de Presets de Seña */}
                    <div className="flex items-center gap-1 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setDepositAmount(0)}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
                          depositAmount === 0
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        0% (Sin seña)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDepositAmount(Math.round(totalOrderAmount * 0.5))}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
                          depositAmount === Math.round(totalOrderAmount * 0.5) && depositAmount > 0
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        50% Seña
                      </button>
                      <button
                        type="button"
                        onClick={() => setDepositAmount(totalOrderAmount)}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
                          depositAmount === totalOrderAmount && depositAmount > 0
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        100% Total
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Saldo Restante</span>
                    <span className="text-base font-black text-orange-600 block mt-0.5">
                      ${balanceDue.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block mb-1 text-slate-500 uppercase font-bold text-[10px]">Método de Pago</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold"
                    >
                      <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                      <option value="Efectivo en Fábrica / Taller">Efectivo en Fábrica / Mostrador</option>
                      <option value="Mercado Pago / QR">Mercado Pago / QR</option>
                      <option value="Cheque / Cuenta Corriente">Cheque / Cuenta Corriente</option>
                      <option value="Pendiente de Pago">Pendiente de Pago</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-500 uppercase font-bold text-[10px]">Estado Inicial</label>
                    <select
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value as any)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-bold"
                    >
                      <option value="nuevo">Nuevo / En Cola</option>
                      <option value="contactado">Contactado / Seña Recibida</option>
                      <option value="en_diseno">En Diseño / Muestra</option>
                      <option value="en_taller">⚙️ En Taller (Producción)</option>
                      <option value="listo">✅ Listo p/ Retirar o Despachar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-slate-500 uppercase font-bold text-[10px]">
                    Observaciones Internas del Pedido (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Avisar cuando esté listo para retirar por mostrador..."
                    value={orderGeneralNotes}
                    onChange={(e) => setOrderGeneralNotes(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* PASO 4: RESUMEN FINAL & CONFIRMACIÓN */}
          {/* ============================================================ */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-200/70 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-black text-sm text-indigo-950">Resumen del Pedido para Taller</h4>
                  </div>
                  <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-md uppercase">
                    {orderStatus.replace('_', ' ')}
                  </span>
                </div>

                {/* Cliente */}
                <div className="text-xs text-indigo-950 space-y-0.5">
                  <p className="font-black text-sm">
                    👤 {selectedCustomer?.name || newCustName}{' '}
                    {(selectedCustomer?.businessName || newCustBusiness) && (
                      <span className="font-medium text-indigo-800">
                        ({selectedCustomer?.businessName || newCustBusiness})
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-indigo-700">
                    📱 {selectedCustomer?.phone || newCustPhone} • 📍 {selectedCustomer?.city || newCustCity}
                  </p>
                </div>

                {/* Detalle de Artículos */}
                <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1.5">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">
                          {it.quantity} un. {it.productName}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {it.size} - {it.material} {it.customNotes ? `• ${it.customNotes}` : ''}
                        </span>
                      </div>
                      <span className="font-black text-slate-900">${it.totalPrice.toLocaleString('es-AR')}</span>
                    </div>
                  ))}
                </div>

                {/* Plazos y Finanzas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Total</span>
                    <span className="font-black text-slate-900 block">${totalOrderAmount.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Seña</span>
                    <span className="font-black text-green-600 block">${depositAmount.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Resta</span>
                    <span className="font-black text-orange-600 block">${balanceDue.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Entrega</span>
                    <span className="font-black text-slate-900 block">
                      {new Date(deliveryDate + 'T12:00:00').toLocaleDateString('es-AR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer de Controles */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 hover:bg-white transition-colors"
            >
              Cancelar
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1) {
                  const c = handleEnsureCustomer();
                  if (!c) return;
                }
                if (step === 2 && items.length === 0) {
                  alert('Agregá al menos un artículo al pedido');
                  return;
                }
                setStep((s) => (s + 1) as any);
              }}
              className="py-2.5 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-2 transition-all transform hover:scale-[1.01]"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveOrder(false)}
                className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Guardar Pedido
              </button>
              <button
                type="button"
                onClick={() => handleSaveOrder(true)}
                className="py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-green-600/25 flex items-center gap-1.5 transition-all transform hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Guardar & WhatsApp</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
