'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Heart, ExternalLink, Camera } from 'lucide-react';
import { VQ_CONFIG } from '@/lib/mockData';

export function InstagramSection() {
  const { instagramPosts, instagramWidgetId } = useStore();
  return (
    <section id="instagram" className="py-16 bg-gradient-to-b from-gray-50 to-orange-50/40 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-pink-600 font-bold text-xs uppercase tracking-wider bg-pink-50 px-3 py-1 rounded-full border border-pink-200/60 mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Feed Oficial @{VQ_CONFIG.instagramUser}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Trabajos Recientes en el Taller
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              Mirá las producciones reales que entregamos cada semana para comercios y fiestas. ¡Hacemos envíos a todo el país!
            </p>
          </div>

          <a
            href={VQ_CONFIG.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-pink-600 bg-white px-4 py-2.5 rounded-full border border-pink-200 hover:bg-pink-50 transition-colors shadow-xs"
          >
            <span>Seguinos en Instagram</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instagramPosts.map((post) => (
            <div
              key={post.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={post.mediaUrl}
                  alt="Trabajo VQ Bolsas en Instagram"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                    <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                    <span>{post.likeCount} me gusta</span>
                  </div>
                </div>
              </div>

              {/* Caption & Timestamp */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed font-normal mb-3">
                  {post.caption}
                </p>
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                  <span>{post.timestamp}</span>
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    Ver en IG
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
