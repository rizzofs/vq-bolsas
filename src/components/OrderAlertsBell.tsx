'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Order } from '@/types';
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  MessageCircle,
  ChevronRight,
  X,
  AlertCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';

export interface OrderAlertInfo {
  type: 'entrega_vencida' | 'nuevo_olvidado' | 'entrega_hoy' | 'taller_estancado';
  severity: 'high' | 'medium' | 'low';
  badge: string;
  badgeClass: string;
  title: string;
  description: string;
  daysPassed?: number;
}

/**
 * Función utilitaria pura para diagnosticar si un pedido tiene alerta de demora / olvido
 */
export function getOrderAlert(order: Order, currentDateStr?: string): OrderAlertInfo | null {
  if (order.status === 'entregado' || order.status === 'cancelado') {
    return null;
  }

  const now = new Date();
  const todayStr = currentDateStr || now.toISOString().split('T')[0];
  const createdDate = new Date(order.createdAt);
  const diffHours = Math.max(0, (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  // 1. Alerta de Fecha de Entrega Vencida
  if (order.estimatedDeliveryDate && order.status !== 'listo') {
    if (order.estimatedDeliveryDate < todayStr) {
      // Calcular días de atraso
      const estDate = new Date(order.estimatedDeliveryDate + 'T00:00:00');
      const todayDate = new Date(todayStr + 'T00:00:00');
      const daysOverdue = Math.max(1, Math.round((todayDate.getTime() - estDate.getTime()) / (1000 * 60 * 60 * 24)));

      return {
        type: 'entrega_vencida',
        severity: 'high',
        badge: `🚨 Atrasado ${daysOverdue}d`,
        badgeClass: 'bg-red-100 text-red-800 border-red-300 font-black animate-pulse',
        title: `Fecha de entrega vencida hace ${daysOverdue} día${daysOverdue > 1 ? 's' : ''}`,
        description: `Pactado para el ${new Date(order.estimatedDeliveryDate + 'T12:00:00').toLocaleDateString('es-AR')}`,
        daysPassed: daysOverdue,
      };
    }

    // 2. Alerta de Entrega para Hoy
    if (order.estimatedDeliveryDate === todayStr) {
      return {
        type: 'entrega_hoy',
        severity: 'medium',
        badge: '⏳ Entrega Hoy',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
        title: 'Compromiso de entrega para hoy',
        description: 'Verificar si ya está listo para despacho o retiro.',
        daysPassed: 0,
      };
    }
  }

  // 3. Alerta de Pedido Nuevo Olvidado (+24 horas sin contactar)
  if (order.status === 'nuevo') {
    if (diffHours >= 24) {
      return {
        type: 'nuevo_olvidado',
        severity: 'high',
        badge: `⚠️ Sin atender (${diffDays}d)`,
        badgeClass: 'bg-orange-100 text-orange-900 border-orange-300 font-bold',
        title: `Pedido nuevo sin contactar hace ${diffDays} día${diffDays > 1 ? 's' : ''}`,
        description: 'El cliente espera confirmación de diseño o seña.',
        daysPassed: diffDays,
      };
    } else if (diffHours >= 8) {
      return {
        type: 'nuevo_olvidado',
        severity: 'medium',
        badge: '⚠️ Nuevo pendiente',
        badgeClass: 'bg-yellow-100 text-yellow-900 border-yellow-300 font-medium',
        title: `Pedido ingresado hace ${Math.round(diffHours)}hs`,
        description: 'Pendiente de primer contacto con el cliente.',
        daysPassed: 0,
      };
    }
  }

  // 4. En Taller / Diseño Demorado (+3 días sin entrega definida)
  if ((order.status === 'en_taller' || order.status === 'en_diseno') && diffDays >= 3 && !order.estimatedDeliveryDate) {
    return {
      type: 'taller_estancado',
      severity: 'medium',
      badge: `⏱️ En taller (${diffDays}d)`,
      badgeClass: 'bg-purple-100 text-purple-900 border-purple-300 font-medium',
      title: `En proceso hace ${diffDays} días sin fecha pactada`,
      description: 'Definir fecha de entrega para coordinar con el cliente.',
      daysPassed: diffDays,
    };
  }

  return null;
}

export function OrderAlertsBell({
  orders,
  onNavigateToOrder,
  onUpdateStatus,
}: {
  orders: Order[];
  onNavigateToOrder?: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, status: Order['status']) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'vencidos' | 'nuevos' | 'hoy'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calcular alertas
  const ordersWithAlerts = orders
    .map((order) => {
      const alert = getOrderAlert(order);
      return alert ? { order, alert } : null;
    })
    .filter((item): item is { order: Order; alert: OrderAlertInfo } => item !== null)
    .sort((a, b) => {
      // Priorizar severidad alta primero
      if (a.alert.severity === 'high' && b.alert.severity !== 'high') return -1;
      if (b.alert.severity === 'high' && a.alert.severity !== 'high') return 1;
      return (b.alert.daysPassed || 0) - (a.alert.daysPassed || 0);
    });

  const highSeverityCount = ordersWithAlerts.filter((item) => item.alert.severity === 'high').length;
  const overdueCount = ordersWithAlerts.filter((item) => item.alert.type === 'entrega_vencida').length;
  const newPendingCount = ordersWithAlerts.filter((item) => item.alert.type === 'nuevo_olvidado').length;
  const todayCount = ordersWithAlerts.filter((item) => item.alert.type === 'entrega_hoy').length;

  const filteredAlerts = ordersWithAlerts.filter((item) => {
    if (filterType === 'vencidos') return item.alert.type === 'entrega_vencida';
    if (filterType === 'nuevos') return item.alert.type === 'nuevo_olvidado';
    if (filterType === 'hoy') return item.alert.type === 'entrega_hoy';
    return true;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de la Campanita */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500 ${
          ordersWithAlerts.length > 0
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
        }`}
        title={
          ordersWithAlerts.length > 0
            ? `${ordersWithAlerts.length} pedidos requieren atención / atrasados`
            : 'No hay pedidos atrasados'
        }
      >
        <Bell className={`w-5 h-5 ${ordersWithAlerts.length > 0 ? 'text-red-400 animate-wiggle' : ''}`} />

        {/* Badge contador */}
        {ordersWithAlerts.length > 0 && (
          <>
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-black text-white shadow-md shadow-red-600/50">
              {ordersWithAlerts.length}
            </span>
            {highSeverityCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-red-500 animate-ping opacity-75 pointer-events-none" />
            )}
          </>
        )}
      </button>

      {/* Popover / Panel Desplegable de Notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fadeIn">
          {/* Header del Panel */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-600/30 text-orange-400 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5">
                  Alertas de Pedidos & Demoras
                </h4>
                <p className="text-[10px] text-slate-400">
                  {ordersWithAlerts.length === 0
                    ? 'Todo al día'
                    : `${ordersWithAlerts.length} pedido${ordersWithAlerts.length > 1 ? 's' : ''} para revisar`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filtros Rápidos dentro del Popover */}
          {ordersWithAlerts.length > 0 && (
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                  filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Todos ({ordersWithAlerts.length})
              </button>
              {overdueCount > 0 && (
                <button
                  onClick={() => setFilterType('vencidos')}
                  className={`px-2 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                    filterType === 'vencidos' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  🚨 Vencidos ({overdueCount})
                </button>
              )}
              {newPendingCount > 0 && (
                <button
                  onClick={() => setFilterType('nuevos')}
                  className={`px-2 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                    filterType === 'nuevos'
                      ? 'bg-orange-600 text-white'
                      : 'bg-orange-50 text-orange-700 border border-orange-200'
                  }`}
                >
                  ⚠️ Sin Contactar ({newPendingCount})
                </button>
              )}
              {todayCount > 0 && (
                <button
                  onClick={() => setFilterType('hoy')}
                  className={`px-2 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                    filterType === 'hoy'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  ⏳ Entrega Hoy ({todayCount})
                </button>
              )}
            </div>
          )}

          {/* Lista de Alertas */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 p-2 space-y-2">
            {ordersWithAlerts.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h5 className="font-bold text-xs text-slate-800">¡Todo al día y sin retrasos!</h5>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  No hay pedidos pendientes de contacto ni entregas atrasadas en este momento.
                </p>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No hay pedidos en esta categoría de filtro.
              </div>
            ) : (
              filteredAlerts.map(({ order, alert }) => (
                <div
                  key={order.id}
                  className={`p-3 rounded-xl border transition-all space-y-2 ${
                    alert.severity === 'high'
                      ? 'bg-red-50/40 border-red-200'
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  {/* Top: Badge + Nro de Orden */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md border inline-flex items-center gap-1 ${alert.badgeClass}`}
                    >
                      {alert.badge}
                    </span>
                    <span className="font-mono text-xs font-black text-slate-800">{order.orderNumber}</span>
                  </div>

                  {/* Cliente & Detalle */}
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 leading-tight">
                      {order.customerName} {order.businessName && <span className="text-slate-500 font-normal">({order.businessName})</span>}
                    </h5>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">{alert.title}</p>
                    <p className="text-[10px] text-slate-400">{alert.description}</p>
                  </div>

                  {/* Detalle de Items */}
                  <div className="text-[10px] text-slate-500 bg-white/80 p-2 rounded-lg border border-slate-200/60 flex items-center justify-between">
                    <span className="truncate max-w-[200px]">
                      {order.items[0]?.quantity}u. {order.items[0]?.productName}
                    </span>
                    <span className="font-bold text-slate-700">${order.totalAmount.toLocaleString('es-AR')}</span>
                  </div>

                  {/* Botones de Acción Inmediata */}
                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    <a
                      href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(
                        order.customerName
                      )},%20te%20escribimos%20de%20VQ%20Bolsas%20para%20coordinar%20tu%20pedido%20${order.orderNumber}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>

                    {order.status === 'nuevo' && onUpdateStatus && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'contactado')}
                        className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-bold transition-colors"
                      >
                        Marcar Contactado
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (onNavigateToOrder) {
                          onNavigateToOrder(order.id);
                          setIsOpen(false);
                        }
                      }}
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ml-auto"
                    >
                      <span>Gestionar</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Informativo */}
          <div className="p-2.5 bg-slate-100 border-t border-slate-200 text-center text-[10px] text-slate-500 font-medium">
            💡 Las alertas detectan pedidos nuevos sin atender (+24h) y fechas de entrega vencidas.
          </div>
        </div>
      )}
    </div>
  );
}
