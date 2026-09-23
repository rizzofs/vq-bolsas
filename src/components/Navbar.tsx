'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { ShoppingBag, Menu, X, Shield, Phone } from 'lucide-react';
import { getOrderAlert } from '@/components/OrderAlertsBell';
import { VQ_CONFIG } from '@/lib/mockData';

export function Navbar({ onOpenCart }: { onOpenCart: () => void }) {
  const { cartCount, isAuthenticated, orders } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const alertCount = isAuthenticated ? orders.filter((o) => getOrderAlert(o) !== null).length : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              VQ
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 block">
                VQ <span className="text-orange-600">Bolsas</span>
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium tracking-wider uppercase block">
                Fábrica & Empaques
              </span>
            </div>
          </Link>

          {/* Navigation Links Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
            <Link href="/#catalogo" className="hover:text-orange-600 transition-colors">
              Catálogo
            </Link>
            <Link href="/#cumpleanos" className="hover:text-orange-600 transition-colors">
              Cumpleaños & Pochocleras
            </Link>
            <Link href="/#comercios" className="hover:text-orange-600 transition-colors">
              Bolsas Comerciales
            </Link>
            <Link href="/#instagram" className="hover:text-orange-600 transition-colors">
              Instagram
            </Link>
          </nav>

          {/* Actions: Cart & Admin */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* WhatsApp Direct */}
            <a
              href={`https://wa.me/${VQ_CONFIG.phoneWhatsapp}?text=Hola%20VQ%20Bolsas,%20tengo%20una%20consulta`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold bg-green-50 text-green-700 px-3 py-2 rounded-full border border-green-200 hover:bg-green-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              WhatsApp Directo
            </a>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 sm:px-4 py-2 rounded-full font-bold text-sm transition-all"
            >
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <span className="hidden sm:inline">Pedido</span>
              {cartCount > 0 && (
                <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Login Link */}
            <Link
              href="/admin"
              className={`relative p-2 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                isAuthenticated
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Panel Administrativo VQ Bolsas"
            >
              <Shield className="w-4 h-4" />
              {isAuthenticated && <span className="hidden lg:inline text-xs font-bold">Admin</span>}
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-black text-white shadow-xs">
                  {alertCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
          >
            Catálogo Completo
          </Link>
          <Link
            href="/#cumpleanos"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
          >
            Cumpleaños & Pochocleras
          </Link>
          <Link
            href="/#comercios"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
          >
            Bolsas Comerciales
          </Link>
          <Link
            href="/#instagram"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
          >
            Novedades Instagram
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-amber-700 bg-amber-50"
          >
            Acceso Panel Fábrica
          </Link>
        </div>
      )}
    </header>
  );
}
