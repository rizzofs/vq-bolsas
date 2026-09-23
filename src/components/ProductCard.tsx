'use client';

import React, { useState } from 'react';
import { Product, ProductVariant } from '@/types';
import { useStore } from '@/context/StoreContext';
import { ShoppingBag, Check, Plus, Layers, Sparkles } from 'lucide-react';

export function ProductCard({
  product,
  onOpenCustomModal,
}: {
  product: Product;
  onOpenCustomModal?: (product: Product) => void;
  key?: string;
}) {
  const { addToCart } = useStore();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants?.[0]?.id || ''
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const selectedVariant: ProductVariant | undefined = product.variants.find(
    (v) => v.id === selectedVariantId
  );

  const handleAddToCart = () => {
    if (product.category === 'personalizadas') {
      if (onOpenCustomModal) onOpenCustomModal(product);
      return;
    }

    if (!selectedVariant) return;

    addToCart({
      id: `cart-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      category: product.category,
      image: product.image,
      material: selectedVariant.material || product.materials[0] || 'Estándar',
      size: selectedVariant.size || product.sizes[0] || 'Única',
      handleType: selectedVariant.handleType,
      quantity: selectedVariant.minQuantity,
      unitPrice: Math.round(selectedVariant.price / selectedVariant.minQuantity),
      totalPrice: selectedVariant.price,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const getCategoryBadge = (cat: Product['category']) => {
    switch (cat) {
      case 'cumpleanos':
        return <span className="bg-pink-100 text-pink-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Cumpleaños & Eventos</span>;
      case 'pochocleras':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Pochocleras</span>;
      case 'comercio':
        return <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Comercios</span>;
      case 'personalizadas':
        return <span className="bg-purple-100 text-purple-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Con tu Logo</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Imagen */}
        <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">{getCategoryBadge(product.category)}</div>
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5 space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Medidas y Materiales Disponibles */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.sizes.map((sz, idx) => (
              <span key={idx} className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                📏 {sz}
              </span>
            ))}
          </div>

          {/* Selector de Variante / Pack */}
          {product.variants.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
                Opciones / Packs Disponibles:
              </label>
              <select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="w-full text-xs font-semibold bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} — ${v.price.toLocaleString('es-AR')}
                  </option>
                ))}
              </select>
            </div>
          )}

          {product.moqDescription && (
            <p className="text-[11px] text-orange-700 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-500" />
              {product.moqDescription}
            </p>
          )}
        </div>
      </div>

      {/* Footer / Precio y Botón */}
      <div className="p-4 sm:p-5 pt-0 border-t border-gray-100 mt-2">
        <div className="flex items-center justify-between pt-3">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold block">
              {product.category === 'personalizadas' ? 'Desde' : 'Precio Pack'}
            </span>
            <span className="text-lg sm:text-xl font-black text-gray-900">
              ${selectedVariant ? selectedVariant.price.toLocaleString('es-AR') : 'A cotizar'}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              addedAnimation
                ? 'bg-green-600 text-white scale-105'
                : 'bg-orange-600 hover:bg-orange-700 text-white hover:shadow-orange-600/30'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Agregado!</span>
              </>
            ) : product.category === 'personalizadas' ? (
              <>
                <Layers className="w-4 h-4" />
                <span>Pedir Cotización</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Agregar al Carrito</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
