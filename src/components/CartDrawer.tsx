'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { X, Trash2, Send, ShoppingBag, CheckCircle, ArrowRight } from 'lucide-react';
import { VQ_CONFIG } from '@/lib/mockData';
import confetti from 'canvas-confetti';

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal, addOrder } = useStore();
  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [orderSent, setOrderSent] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');

  if (!isOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Por favor completa tu nombre y número de WhatsApp');
      return;
    }

    // 1. Guardar orden en el sistema
    const newOrder = addOrder({
      customerName,
      businessName: businessName || undefined,
      customerPhone,
      customerCity: customerCity || 'A coordinar',
      customerAddress: customerAddress || 'A coordinar',
      items: cart,
      totalAmount: cartTotal,
      depositAmount: 0,
      balanceDue: cartTotal,
      status: 'nuevo',
      notes: notes || undefined,
    });

    setCreatedOrderNumber(newOrder.orderNumber);
    setOrderSent(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    // 2. Formatear mensaje para WhatsApp
    let message = `*¡HOLA VQ BOLSAS! Quiero confirmar un pedido*\n`;
    message += `📋 *Pedido N°:* ${newOrder.orderNumber}\n`;
    message += `👤 *Cliente:* ${customerName}${businessName ? ` (${businessName})` : ''}\n`;
    message += `📱 *Teléfono:* ${customerPhone}\n`;
    message += `📍 *Ubicación / Entrega:* ${customerCity} - ${customerAddress}\n\n`;
    message += `📦 *DETALLE DEL PEDIDO:*\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.productName}*\n`;
      message += `   • Cantidad: ${item.quantity} un.\n`;
      message += `   • Medida: ${item.size} | Material: ${item.material}\n`;
      if (item.handleType) message += `   • Manija: ${item.handleType}\n`;
      if (item.customNotes) message += `   • Nota: ${item.customNotes}\n`;
      message += `   • Subtotal: $${item.totalPrice.toLocaleString('es-AR')}\n\n`;
    });

    message += `💰 *TOTAL ESTIMADO:* $${cartTotal.toLocaleString('es-AR')}\n`;
    if (notes) message += `📝 *Aclaraciones:* ${notes}\n\n`;
    message += `_Espero su respuesta para coordinar pago de seña y tiempo de entrega. ¡Gracias!_`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${VQ_CONFIG.phoneWhatsapp}?text=${encodedMsg}`;

    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappUrl, '_blank');
    clearCart();
  };

  const handleResetAfterSent = () => {
    setOrderSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-2 text-orange-950 font-bold text-lg">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            <span>Tu Pedido en VQ Bolsas</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/80 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {orderSent ? (
          <div className="p-8 text-center my-auto">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">¡Pedido Enviado!</h3>
            <p className="text-sm font-semibold text-orange-600 mb-2">Orden N°: {createdOrderNumber}</p>
            <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
              Se abrió WhatsApp para que confirmes tu pedido con nosotros. Te responderemos a la brevedad para
              coordinar seña, diseño y fecha de entrega.
            </p>
            <button
              onClick={handleResetAfterSent}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Seguir viendo el catálogo
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="p-8 text-center my-auto">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-4">El carrito de pedidos está vacío.</p>
            <button
              onClick={onClose}
              className="bg-orange-600 text-white text-sm font-bold py-2.5 px-6 rounded-xl hover:bg-orange-700 transition-colors"
            >
              Explorar Catálogo
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Lista de Items */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                <span>Productos Seleccionados ({cart.length})</span>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold normal-case"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Vaciar
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 flex gap-3 items-start"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{item.productName}</h4>
                    <p className="text-xs text-gray-500">
                      Medida: <span className="font-semibold text-gray-700">{item.size}</span> | Mat:{' '}
                      <span className="font-semibold text-gray-700">{item.material}</span>
                    </p>
                    {item.handleType && (
                      <p className="text-xs text-gray-500">
                        Manija: <span className="font-semibold text-gray-700">{item.handleType}</span>
                      </p>
                    )}
                    {item.customNotes && (
                      <p className="text-xs text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 mt-1">
                        Nota: {item.customNotes}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 border border-gray-300 rounded-lg bg-white px-2 py-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 10)}
                          className="text-gray-500 font-bold hover:text-orange-600 px-1"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-gray-800">{item.quantity} un.</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 10)}
                          className="text-gray-500 font-bold hover:text-orange-600 px-1"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-black text-gray-900">
                        ${item.totalPrice.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-orange-800 uppercase tracking-wider block">
                  Total Estimado
                </span>
                <span className="text-[11px] text-gray-500">Seña habitual: 50% al confirmar</span>
              </div>
              <span className="text-xl font-black text-orange-600">
                ${cartTotal.toLocaleString('es-AR')}
              </span>
            </div>

            {/* Formulario de Checkout rápido */}
            <form onSubmit={handleCheckout} className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Tus Datos de Contacto</h4>

              <div>
                <input
                  type="text"
                  required
                  placeholder="Tu Nombre y Apellido *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500 font-medium text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nombre de tu Comercio (opcional)"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder:text-gray-400"
                />
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp con código de área *"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500 font-medium text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Localidad / Ciudad"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder:text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Dirección o Retiro en Fábrica"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div>
                <textarea
                  rows={2}
                  placeholder="Aclaraciones sobre diseño, personajes o entrega (opcional)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500 resize-none text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-green-600/25 flex items-center justify-center gap-2 text-sm transition-all transform hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Pedido por WhatsApp</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
              <p className="text-[11px] text-gray-400 text-center">
                Sin pagos online obligatorios. Coordinamos directamente con vos.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
