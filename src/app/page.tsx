'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductCard } from '@/components/ProductCard';
import { InstagramSection } from '@/components/InstagramSection';
import { CustomQuoteModal } from '@/components/CustomQuoteModal';
import { MOCK_INSTAGRAM_POSTS, VQ_CONFIG } from '@/lib/mockData';
import { Product } from '@/types';
import { Sparkles, Truck, ShieldCheck, Clock, Layers, ArrowRight, Camera, Phone } from 'lucide-react';

export default function HomePage() {
  const { products } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [selectedProductForCustom, setSelectedProductForCustom] = useState<Product | null>(null);

  const filteredProducts =
    selectedCategory === 'todos'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleOpenCustomQuote = (product?: Product) => {
    setSelectedProductForCustom(product || null);
    setCustomModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-amber-600 via-orange-600 to-orange-700 text-white py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide text-orange-100 border border-white/20">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Fabricación Directa sin Intermediarios</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Bolsas, Pochocleras y Packaging a Medida
              </h1>

              <p className="text-sm sm:text-base text-orange-100 font-normal max-w-xl leading-relaxed">
                Especialistas en bolsas de papel kraft, friselina, cartulina y eventos temáticos. 
                Armá tu pedido online y coordinamos el diseño, seña y entrega directamente por WhatsApp.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#catalogo"
                  className="bg-white text-orange-700 hover:bg-orange-50 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-black/10 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Ver Catálogo & Precios</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  onClick={() => handleOpenCustomQuote()}
                  className="bg-orange-800/80 hover:bg-orange-900 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-orange-400/40 backdrop-blur-xs transition-all flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-amber-300" />
                  <span>Cotizar con Mi Logo</span>
                </button>
              </div>

              {/* Badges de Confianza */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-orange-500/50 text-orange-100 text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-300" />
                  <span>Envíos a todo el país</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Venta Mayorista / Minorista</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span>Tiempos de entrega rápidos</span>
                </div>
              </div>
            </div>

            {/* Showcase Visual */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-3xl border border-white/20 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80"
                  alt="Fabricación de bolsas VQ"
                  className="rounded-2xl w-full object-cover aspect-4/3 shadow-md"
                />
                <div className="p-4 flex items-center justify-between text-xs font-bold text-white">
                  <div>
                    <span className="text-amber-200 block text-[10px] uppercase">Instagram Oficial</span>
                    <span>@{VQ_CONFIG.instagramUser}</span>
                  </div>
                  <a
                    href={VQ_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full flex items-center gap-1 text-[11px]"
                  >
                    <Camera className="w-3.5 h-3.5" /> Seguir
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías & Catálogo */}
      <section id="catalogo" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Catálogo de Productos
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Elegí la medida o el pack que necesitás y agregalo al pedido. Al finalizar se abrirá tu WhatsApp con todo detallado.
          </p>
        </div>

        {/* Filtros de Categoría */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {[
            { id: 'todos', label: 'Todos los Productos' },
            { id: 'cumpleanos', label: '🎉 Cumpleaños & Souvenirs' },
            { id: 'pochocleras', label: '🍿 Pochocleras' },
            { id: 'comercio', label: '🛍️ Bolsas Comerciales' },
            { id: 'personalizadas', label: '✨ Personalizadas con Logo' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenCustomModal={handleOpenCustomQuote}
            />
          ))}
        </div>
      </section>

      {/* Banner Cotización Personalizada */}
      <section className="bg-gradient-to-r from-orange-500 via-amber-600 to-orange-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 bg-black/15 p-8 rounded-3xl backdrop-blur-xs border border-white/20">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-wider text-amber-200 bg-black/20 px-3 py-1 rounded-full">
              Atención a Comercios & Revendedores
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              ¿Buscás una medida especial o bolsas impresas para tu negocio?
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 font-normal">
              Contamos con taller propio de corte, impresión serigráfica y confección en friselina y papel.
            </p>
          </div>
          <button
            onClick={() => handleOpenCustomQuote()}
            className="whitespace-nowrap bg-white text-orange-700 hover:bg-orange-50 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            Abrir Cotizador Online
          </button>
        </div>
      </section>

      {/* Sección Instagram Feed */}
      <InstagramSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-xs py-12 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-lg font-black text-white block mb-2">
              VQ <span className="text-orange-500">Bolsas</span>
            </span>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              {VQ_CONFIG.tagline}. Fabricación de packaging para comercios, eventos y revendedores.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Contacto & Envíos</h4>
            <p className="text-gray-400 mb-1">📍 {VQ_CONFIG.address}</p>
            <p className="text-gray-400 mb-2">📦 Despachos a expresos y terminales</p>
            <a
              href={`https://wa.me/${VQ_CONFIG.phoneWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:underline inline-flex items-center gap-1.5 font-semibold mt-1"
            >
              <Phone className="w-3.5 h-3.5" /> WhatsApp Comercial: {VQ_CONFIG.phoneDisplay}
            </a>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Acceso Privado</h4>
            <p className="text-gray-400 text-xs mb-3">
              Panel exclusivo para administración de pedidos y taller de VQ Bolsas.
            </p>
            <a
              href="/admin"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-3 py-2 rounded-lg text-xs transition-colors inline-block"
            >
              Ingresar al Panel Admin
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-gray-500">
          <div>
            © {new Date().getFullYear()} VQ Bolsas. Todos los derechos reservados.
          </div>
          <a
            href="https://rzcore.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors group"
          >
            <span>Desarrollado por</span>
            <span className="font-semibold text-gray-300 group-hover:text-orange-400 transition-colors">
              rzcore.dev
            </span>
            <img
              src="/RzCore-Isologo.png"
              alt="rzcore.dev"
              className="h-5 w-auto object-contain opacity-85 group-hover:opacity-100 transition-opacity"
            />
          </a>
        </div>
      </footer>

      {/* Drawer del Carrito */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Modal de Cotización a Medida */}
      <CustomQuoteModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        product={selectedProductForCustom}
      />
    </div>
  );
}
