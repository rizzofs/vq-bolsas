'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { X, ArrowLeft, ArrowRight, Calculator, MessageCircle, Check, Sparkles, Layers, Box, Palette } from 'lucide-react';
import { VQ_CONFIG } from '@/lib/mockData';

export function CustomQuoteModal({
  isOpen,
  onClose,
  product,
}: {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}) {
  const [step, setStep] = useState(1);
  const [clientName, setClientName] = useState('');
  const [material, setMaterial] = useState('Friselina 80g');
  const [size, setSize] = useState('30x40 cm (Mediana)');
  const [handleType, setHandleType] = useState('Cinta reforzada');
  const [inks, setInks] = useState('1 color');
  const [quantity, setQuantity] = useState(100);
  const [logoNotes, setLogoNotes] = useState('');

  if (!isOpen) return null;

  // Estimador paramétrico de presupuesto
  const calculateEstimatedPrice = () => {
    let baseUnitPrice = 450;
    if (material.includes('Kraft')) baseUnitPrice = 520;
    if (material.includes('Cartón') || material.includes('Tríplex') || material.includes('Cartulina')) baseUnitPrice = 680;
    if (size.includes('Grande') || size.includes('40x')) baseUnitPrice += 150;
    if (inks === '2 colores') baseUnitPrice += 80;
    if (inks === '3 o 4 colores') baseUnitPrice += 160;

    // Descuento por volumen
    if (quantity >= 250) baseUnitPrice *= 0.92;
    if (quantity >= 500) baseUnitPrice *= 0.85;
    if (quantity >= 1000) baseUnitPrice *= 0.78;

    return Math.round(baseUnitPrice * quantity);
  };

  const estimatedTotal = calculateEstimatedPrice();
  const unitPrice = Math.round(estimatedTotal / quantity);

  const handleSendQuoteWhatsApp = () => {
    let message = `*¡HOLA VQ BOLSAS! Solicito una Cotización Personalizada* 🎨🛍️\n\n`;
    if (clientName.trim()) {
      message += `👤 *Nombre / Comercio:* ${clientName.trim()}\n`;
    }
    message += `📋 *DETALLE DE LA COTIZACIÓN:*\n`;
    message += `• *Producto:* ${product ? product.name : 'Bolsas Personalizadas con Logo'}\n`;
    message += `• *Material:* ${material}\n`;
    message += `• *Medida:* ${size}\n`;
    message += `• *Tipo de manija:* ${handleType}\n`;
    message += `• *Impresión:* ${inks}\n`;
    message += `• *Cantidad:* ${quantity} unidades\n`;
    if (logoNotes.trim()) {
      message += `• *Detalle Logo / Marca:* ${logoNotes.trim()}\n`;
    }
    message += `\n💰 *Presupuesto Estimado:* $${estimatedTotal.toLocaleString('es-AR')} (~$${unitPrice}/un)\n\n`;
    message += `_Adjunto el logo/archivo en este chat para la muestra digital y coordinar tiempos de entrega. ¡Gracias!_`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${VQ_CONFIG.phoneWhatsapp}?text=${encodedMsg}`;

    window.open(whatsappUrl, '_blank');
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const stepsList = [
    { num: 1, title: 'Material', icon: Layers },
    { num: 2, title: 'Formato', icon: Box },
    { num: 3, title: 'Logo & Total', icon: Palette },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl relative border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 relative shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" />
            <span>Cotizador Online a Medida</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-gray-900 pr-8">
            {product ? `Cotizar: ${product.name}` : 'Personalizá tus bolsas con Logo'}
          </h3>

          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-between mt-4">
            {stepsList.map((s, index) => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isCompleted = step > s.num;

              return (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-orange-600 text-white shadow-md shadow-orange-500/30'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                    </div>
                    <span
                      className={`text-xs font-semibold hidden sm:inline ${
                        isActive ? 'text-orange-600 font-bold' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                  {index < stepsList.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 rounded transition-all ${
                        step > s.num ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-gray-700 space-y-4">
          
          {/* PASO 1: MATERIAL Y COMERCIO */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block mb-1.5 uppercase tracking-wider text-gray-500 font-bold text-[11px]">
                  Tu Nombre o Comercio (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Tienda Aurora / Lucía Gómez"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-wider text-gray-500 font-bold text-[11px]">
                  Paso 1: Seleccioná el Material
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'Friselina 80g', desc: 'Ecológica, reutilizable y resistente' },
                    { id: 'Papel Kraft Marrón', desc: 'Rústico, reciclable y premium' },
                    { id: 'Cartulina / Cartón', desc: 'Estructurada, elegante y firme' },
                  ].map((mat) => (
                    <button
                      type="button"
                      key={mat.id}
                      onClick={() => setMaterial(mat.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        material === mat.id
                          ? 'border-orange-600 bg-orange-50/80 text-orange-950 font-bold ring-2 ring-orange-500/20 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-bold text-xs">{mat.id}</span>
                        {material === mat.id && <Check className="w-3.5 h-3.5 text-orange-600" />}
                      </div>
                      <span className="text-[10px] text-gray-500 font-normal leading-tight">
                        {mat.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50/60 border border-orange-200/70 rounded-xl p-3 flex items-center gap-2.5 text-orange-900">
                <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
                <p className="text-[11px] leading-snug">
                  Cotización transparente con precio estimado en tiempo real. En los siguientes pasos elegís dimensiones y colores de logo.
                </p>
              </div>
            </div>
          )}

          {/* PASO 2: MEDIDA Y TIPO DE MANIJA */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block mb-1.5 uppercase tracking-wider text-gray-500 font-bold text-[11px]">
                  Paso 2A: Tamaño de la Bolsa
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { val: '20x30 cm (Chica)', sub: 'Joyería, accesorios, bijouterie' },
                    { val: '30x40 cm (Mediana)', sub: 'Indumentaria, calzado, remeras' },
                    { val: '40x45x10 cm (Grande)', sub: 'Camperas, cajas, abrigos' },
                    { val: 'Medida especial', sub: 'Fabricación a medida personalizada' },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.val}
                      onClick={() => setSize(s.val)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        size === s.val
                          ? 'border-orange-600 bg-orange-50/80 text-orange-950 font-bold ring-2 ring-orange-500/20'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{s.val}</span>
                        {size === s.val && <Check className="w-3.5 h-3.5 text-orange-600" />}
                      </div>
                      <span className="text-[10px] text-gray-500 font-normal block mt-0.5">{s.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-wider text-gray-500 font-bold text-[11px]">
                  Paso 2B: Tipo de Manija
                </label>
                <select
                  value={handleType}
                  onChange={(e) => setHandleType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="Troquelada / Riñón">Troquelada / Riñón (Corte anatómico)</option>
                  <option value="Cinta reforzada">Cinta reforzada (Máximo confort y resistencia)</option>
                  <option value="Cordón de algodón">Cordón de algodón (Elegante)</option>
                  <option value="Manija retorcida papel">Manija retorcida papel (Ecológica)</option>
                  <option value="Sin manija (Fuelle)">Sin manija (Tipo sobre / fuelle)</option>
                </select>
              </div>
            </div>
          )}

          {/* PASO 3: LOGO, CANTIDAD Y RESUMEN FINAL */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 uppercase tracking-wider text-gray-500 font-bold text-[11px]">
                    Impresión de Logo
                  </label>
                  <select
                    value={inks}
                    onChange={(e) => setInks(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="1 color">1 color (Frente)</option>
                    <option value="2 colores">2 colores (Frente)</option>
                    <option value="3 o 4 colores">Full Color / Varias caras</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 uppercase tracking-wider text-gray-500 font-bold text-[11px]">
                    Cantidad de Bolsas
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-800 focus:ring-2 focus:ring-orange-500 focus:outline-none font-semibold"
                  >
                    <option value={100}>100 unidades (Mínimo)</option>
                    <option value={250}>250 unidades (8% Descuento)</option>
                    <option value={500}>500 unidades (15% Descuento)</option>
                    <option value={1000}>1.000 unidades (22% Descuento)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-wider text-gray-500 font-bold text-[11px]">
                  Detalle del Logo / Colores (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Logo blanco sobre fondo negro / 1 cara"
                  value={logoNotes}
                  onChange={(e) => setLogoNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Resumen de Presupuesto */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-800 block">
                    Presupuesto Estimado ({quantity} un.)
                  </span>
                  <span className="text-xs text-gray-600 font-semibold">
                    ${unitPrice} por unidad aprox.
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-orange-600 block">
                    ${estimatedTotal.toLocaleString('es-AR')}
                  </span>
                  <span className="text-[9px] text-gray-400">Sujeto a confirmación de diseño</span>
                </div>
              </div>

              {/* Aclaración WhatsApp */}
              <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-2.5 flex items-start gap-2 text-amber-900 shadow-xs">
                <span className="text-sm leading-none mt-0.5">📎</span>
                <p className="text-[10px] leading-relaxed text-amber-800">
                  <strong className="font-bold text-amber-900">Envío de tu Logo:</strong> Al tocar enviar se abrirá WhatsApp con el presupuesto. Podrás adjuntar el archivo (PNG, JPG, PDF o AI) directamente en el chat para tu muestra digital.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:px-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="py-2.5 px-4 rounded-xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="py-2.5 px-4 rounded-xl border border-gray-300 font-bold text-xs text-gray-600 hover:bg-white transition-colors"
            >
              Cancelar
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="py-2.5 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-2 transition-all transform hover:scale-[1.01]"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSendQuoteWhatsApp}
              className="py-2.5 px-5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-green-600/25 flex items-center gap-2 transition-all transform hover:scale-[1.01]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar a WhatsApp</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
