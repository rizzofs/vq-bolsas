'use client';

import React, { useState, useMemo } from 'react';
import { Order, MaterialPurchase, Customer, RawMaterial } from '@/types';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Calendar,
  Download,
  Printer,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Users,
  ShoppingBag,
  Layers,
  PieChart,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Phone,
  Search,
  FileSpreadsheet,
} from 'lucide-react';

interface FinancialReportsProps {
  orders: Order[];
  purchases: MaterialPurchase[];
  customers: Customer[];
  materials: RawMaterial[];
}

type PeriodPreset = 'hoy' | 'esta_semana' | 'este_mes' | 'mes_anterior' | 'este_ano' | 'historico' | 'personalizado';

export function FinancialReports({ orders, purchases, customers, materials }: FinancialReportsProps) {
  const [period, setPeriod] = useState<PeriodPreset>('este_mes');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [movementFilter, setMovementFilter] = useState<'todos' | 'ingresos' | 'egresos'>('todos');
  const [movementSearch, setMovementSearch] = useState('');

  // Rango de fechas según el preset seleccionado
  const dateRange = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (period === 'hoy') {
      return { start: todayStr, end: todayStr };
    }

    if (period === 'esta_semana') {
      const firstDay = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)));
      return {
        start: firstDay.toISOString().split('T')[0],
        end: todayStr,
      };
    }

    if (period === 'este_mes') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      return { start: startOfMonth, end: todayStr };
    }

    if (period === 'mes_anterior') {
      const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
      const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
      return { start: startOfPrevMonth, end: endOfPrevMonth };
    }

    if (period === 'este_ano') {
      const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      return { start: startOfYear, end: todayStr };
    }

    if (period === 'personalizado' && customStartDate && customEndDate) {
      return { start: customStartDate, end: customEndDate };
    }

    return { start: '2020-01-01', end: '2099-12-31' };
  }, [period, customStartDate, customEndDate]);

  // Filtrar pedidos por fecha
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const orderDate = o.createdAt.split('T')[0];
      return orderDate >= dateRange.start && orderDate <= dateRange.end;
    });
  }, [orders, dateRange]);

  // Filtrar compras de materia prima por fecha
  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      const purDate = p.date.split('T')[0];
      return purDate >= dateRange.start && purDate <= dateRange.end;
    });
  }, [purchases, dateRange]);

  // --- CÁLCULOS KPI CLAVE ---
  const metrics = useMemo(() => {
    // 1. Facturación Bruta Total
    const totalSales = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // 2. Dinero Cobrado Real (Seña o Total según si está entregado/pagado)
    const totalCollected = filteredOrders.reduce((sum, o) => {
      if (o.status === 'entregado') {
        return sum + o.totalAmount;
      }
      return sum + (o.depositAmount || 0);
    }, 0);

    // 3. Cuentas por Cobrar (Saldos pendientes de pedidos no entregados)
    const totalPendingCollection = filteredOrders.reduce((sum, o) => {
      if (o.status === 'entregado') return sum;
      return sum + (o.balanceDue || 0);
    }, 0);

    // 4. Gastos en Insumos / Materia Prima
    const totalExpenses = filteredPurchases.reduce((sum, p) => sum + p.totalCost, 0);

    // 5. Ganancia Operativa Neta Estimada (Cobrado - Gastos)
    const netProfitCollected = totalCollected - totalExpenses;
    const netProfitBilled = totalSales - totalExpenses;

    // 6. Cantidad total de bolsas producidas en unidades
    const totalBagsCount = filteredOrders.reduce((sum, o) => {
      return sum + o.items.reduce((itemSum, it) => itemSum + it.quantity, 0);
    }, 0);

    // 7. Ticket Promedio
    const averageTicket = filteredOrders.length > 0 ? Math.round(totalSales / filteredOrders.length) : 0;

    return {
      totalSales,
      totalCollected,
      totalPendingCollection,
      totalExpenses,
      netProfitCollected,
      netProfitBilled,
      totalBagsCount,
      averageTicket,
      ordersCount: filteredOrders.length,
      purchasesCount: filteredPurchases.length,
    };
  }, [filteredOrders, filteredPurchases]);

  // --- DESGLOSE POR MATERIAL / PRODUCTO ---
  const materialStats = useMemo(() => {
    const stats: Record<string, { count: number; totalAmount: number; bagsCount: number }> = {};

    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        const mat = item.material || 'Friselina 80g';
        if (!stats[mat]) {
          stats[mat] = { count: 0, totalAmount: 0, bagsCount: 0 };
        }
        stats[mat].count += 1;
        stats[mat].totalAmount += item.totalPrice;
        stats[mat].bagsCount += item.quantity;
      });
    });

    const totalSales = metrics.totalSales || 1;
    return Object.entries(stats)
      .map(([name, data]) => ({
        name,
        totalAmount: data.totalAmount,
        bagsCount: data.bagsCount,
        percentage: Math.round((data.totalAmount / totalSales) * 100),
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }, [filteredOrders, metrics.totalSales]);

  // --- DESGLOSE POR CANAL DE VENTA ---
  const channelStats = useMemo(() => {
    const stats: Record<string, { totalAmount: number; count: number }> = {
      whatsapp: { totalAmount: 0, count: 0 },
      web: { totalAmount: 0, count: 0 },
      local_taller: { totalAmount: 0, count: 0 },
      instagram: { totalAmount: 0, count: 0 },
    };

    filteredOrders.forEach((o) => {
      // Determinar canal del pedido o del cliente
      const cust = customers.find(
        (c) =>
          (c.phone && o.customerPhone && c.phone.replace(/\D/g, '') === o.customerPhone.replace(/\D/g, '')) ||
          c.name.toLowerCase() === o.customerName.toLowerCase()
      );
      const channel = cust?.channel || 'whatsapp';
      if (!stats[channel]) {
        stats[channel] = { totalAmount: 0, count: 0 };
      }
      stats[channel].totalAmount += o.totalAmount;
      stats[channel].count += 1;
    });

    const total = metrics.totalSales || 1;
    return Object.entries(stats).map(([channel, data]) => ({
      channel,
      label:
        channel === 'whatsapp'
          ? 'WhatsApp Directo'
          : channel === 'web'
          ? 'Tienda Web E-commerce'
          : channel === 'local_taller'
          ? 'Mostrador / Taller'
          : channel === 'instagram'
          ? 'Instagram'
          : channel.toUpperCase(),
      totalAmount: data.totalAmount,
      count: data.count,
      percentage: Math.round((data.totalAmount / total) * 100),
    }));
  }, [filteredOrders, customers, metrics.totalSales]);

  // --- TOP CLIENTES POR FACTURACIÓN ---
  const topCustomers = useMemo(() => {
    const map: Record<
      string,
      {
        id: string;
        name: string;
        businessName?: string;
        phone: string;
        ordersCount: number;
        totalSpent: number;
        pendingBalance: number;
      }
    > = {};

    filteredOrders.forEach((o) => {
      const key = o.customerPhone || o.customerName;
      if (!map[key]) {
        map[key] = {
          id: key,
          name: o.customerName,
          businessName: o.businessName,
          phone: o.customerPhone,
          ordersCount: 0,
          totalSpent: 0,
          pendingBalance: 0,
        };
      }
      map[key].ordersCount += 1;
      map[key].totalSpent += o.totalAmount;
      if (o.status !== 'entregado') {
        map[key].pendingBalance += o.balanceDue;
      }
    });

    return Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [filteredOrders]);

  // --- LISTADO DE MOVIMIENTOS COMBINADOS (LIBRO DE CAJA) ---
  const combinedMovements = useMemo(() => {
    const list: Array<{
      id: string;
      date: string;
      type: 'ingreso' | 'egreso';
      concept: string;
      detail: string;
      clientOrSupplier: string;
      amount: number;
      status: string;
      phone?: string;
    }> = [];

    // Agregar Ventas
    filteredOrders.forEach((o) => {
      const collectedAmount = o.status === 'entregado' ? o.totalAmount : o.depositAmount;
      list.push({
        id: o.id,
        date: o.createdAt.split('T')[0],
        type: 'ingreso',
        concept: `Venta Pedido ${o.orderNumber}`,
        detail: o.items.map((i) => `${i.quantity}u. ${i.productName}`).join(', '),
        clientOrSupplier: o.businessName || o.customerName,
        amount: o.totalAmount,
        status: o.status === 'entregado' ? 'Cobrado Total' : `Seña: $${o.depositAmount} (Resta: $${o.balanceDue})`,
        phone: o.customerPhone,
      });
    });

    // Agregar Compras de Insumos
    filteredPurchases.forEach((p) => {
      list.push({
        id: p.id,
        date: p.date,
        type: 'egreso',
        concept: `Compra Insumos: ${p.materialName}`,
        detail: `${p.quantity} unidades @ $${p.unitPrice}/u`,
        clientOrSupplier: p.supplier || 'Proveedor Local',
        amount: p.totalCost,
        status: 'Pagado',
      });
    });

    // Ordenar por fecha descendente
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredOrders, filteredPurchases]);

  // Filtrar movimientos por búsqueda y tipo
  const displayMovements = useMemo(() => {
    return combinedMovements.filter((m) => {
      const matchType =
        movementFilter === 'todos' ||
        (movementFilter === 'ingresos' && m.type === 'ingreso') ||
        (movementFilter === 'egresos' && m.type === 'egreso');

      const q = movementSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        m.concept.toLowerCase().includes(q) ||
        m.clientOrSupplier.toLowerCase().includes(q) ||
        m.detail.toLowerCase().includes(q);

      return matchType && matchSearch;
    });
  }, [combinedMovements, movementFilter, movementSearch]);

  // --- EXPORTAR A CSV (EXCEL) ---
  const handleExportCSV = () => {
    const headers = ['Fecha', 'Tipo', 'Concepto', 'Cliente_Proveedor', 'Detalle', 'Monto_ARS', 'Estado'];
    const rows = combinedMovements.map((m) => [
      m.date,
      m.type === 'ingreso' ? 'INGRESO (VENTA)' : 'EGRESO (COMPRA)',
      `"${m.concept.replace(/"/g, '""')}"`,
      `"${m.clientOrSupplier.replace(/"/g, '""')}"`,
      `"${m.detail.replace(/"/g, '""')}"`,
      m.amount,
      `"${m.status.replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VQ_Bolsas_Balance_${dateRange.start}_al_${dateRange.end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- IMPRIMIR / GENERAR PDF ---
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header del Módulo de Reportes & Cuentas */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl font-bold">📊</span>
            <h3 className="font-black text-base text-slate-900">Reportes Financieros, Caja & Cuentas</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualizá ventas reales, cobranzas, cuentas por cobrar y gastos en materia prima en tiempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            title="Descargar datos en formato Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar a Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
            title="Imprimir balance del período"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Resumen</span>
          </button>
        </div>
      </div>

      {/* Selector de Período de Tiempo */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1 shrink-0 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Período:
          </span>
          {[
            { id: 'hoy', label: 'Hoy' },
            { id: 'esta_semana', label: 'Esta Semana' },
            { id: 'este_mes', label: 'Este Mes' },
            { id: 'mes_anterior', label: 'Mes Anterior' },
            { id: 'este_ano', label: 'Año en Curso' },
            { id: 'historico', label: 'Todo el Histórico' },
            { id: 'personalizado', label: 'Personalizado' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id as PeriodPreset)}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
                period === item.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {period === 'personalizado' && (
          <div className="flex items-center gap-2 w-full lg:w-auto text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Desde:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Hasta:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* TARJETAS PRINCIPALES DE RESUMEN CONTABLE & FINANCIERO */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Facturación Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Facturación Total (Ventas)</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 block">
              ${metrics.totalSales.toLocaleString('es-AR')}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                {metrics.ordersCount} pedido{metrics.ordersCount !== 1 ? 's' : ''}
              </span>
              <span className="text-[11px] text-slate-400">
                Ticket prom: ${metrics.averageTicket.toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Dinero Cobrado Real */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">Dinero Cobrado (Caja)</span>
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-700 block">
              ${metrics.totalCollected.toLocaleString('es-AR')}
            </span>
            <p className="text-[11px] text-emerald-900/80 font-medium mt-1">
              Señas ingresadas + entregas cobradas
            </p>
          </div>
        </div>

        {/* 3. Cuentas por Cobrar (Saldos pendientes) */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs relative overflow-hidden bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-bold text-amber-900 tracking-wider">Cuentas por Cobrar</span>
            <span className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-amber-700 block">
              ${metrics.totalPendingCollection.toLocaleString('es-AR')}
            </span>
            <p className="text-[11px] text-amber-900/80 font-medium mt-1">
              Saldos a cobrar contra entrega
            </p>
          </div>
        </div>

        {/* 4. Gastos en Materia Prima & Compras */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Gastos en Insumos</span>
            <span className="p-2 bg-red-50 text-red-600 rounded-xl">
              <ArrowDownRight className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 block">
              ${metrics.totalExpenses.toLocaleString('es-AR')}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded-md">
                {metrics.purchasesCount} compra{metrics.purchasesCount !== 1 ? 's' : ''}
              </span>
              <span className="text-[11px] text-slate-400">Papel, tela, tintas</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TARJETA DE MARGEN Y GANANCIA OPERATIVA NETA */}
      {/* ============================================================ */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-orange-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
              Rentabilidad del Período
            </span>
            <span className="text-xs text-slate-400">
              ({dateRange.start} al {dateRange.end})
            </span>
          </div>
          <h4 className="text-xl sm:text-2xl font-black text-white">
            Ganancia Operativa Estimada:{' '}
            <span className={metrics.netProfitBilled >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              ${metrics.netProfitBilled.toLocaleString('es-AR')}
            </span>
          </h4>
          <p className="text-xs text-slate-400 max-w-xl">
            Calculado sobre Facturación Total (${metrics.totalSales.toLocaleString('es-AR')}) menos Compras de Materia Prima (${metrics.totalExpenses.toLocaleString('es-AR')}).
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 shrink-0 w-full md:w-auto justify-around md:justify-start">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Bolsas Producidas</span>
            <span className="text-lg font-black text-orange-400 block mt-0.5">
              {metrics.totalBagsCount.toLocaleString('es-AR')} u.
            </span>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Margen s/ Venta</span>
            <span className="text-lg font-black text-emerald-400 block mt-0.5">
              {metrics.totalSales > 0 ? Math.round((metrics.netProfitBilled / metrics.totalSales) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DESGLOSES: MATERIALES & CANALES DE VENTA */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Material / Línea de Bolsas */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-600" />
              <h4 className="font-black text-sm text-slate-900">Ventas por Material / Tipo de Bolsa</h4>
            </div>
            <span className="text-xs text-slate-400">Total: {materialStats.length} líneas</span>
          </div>

          {materialStats.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No hay ventas registradas en este período.</p>
          ) : (
            <div className="space-y-3">
              {materialStats.map((mat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{mat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px]">
                        {mat.bagsCount.toLocaleString('es-AR')} u.
                      </span>
                      <span className="font-black text-slate-900">
                        ${mat.totalAmount.toLocaleString('es-AR')} ({mat.percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${mat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Distribución por Canal de Origen */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              <h4 className="font-black text-sm text-slate-900">Ventas por Canal de Captación</h4>
            </div>
            <span className="text-xs text-slate-400">Origen de compras</span>
          </div>

          <div className="space-y-3">
            {channelStats.map((ch, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">{ch.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">{ch.count} pedido{ch.count !== 1 ? 's' : ''}</span>
                    <span className="font-black text-slate-900">
                      ${ch.totalAmount.toLocaleString('es-AR')} ({ch.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${ch.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RANKING DE TOP CLIENTES DEL PERÍODO */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h4 className="font-black text-sm text-slate-900">Top Clientes con Mayor Facturación</h4>
          </div>
          <span className="text-xs text-slate-400">Mostrando {topCustomers.length} clientes activos</span>
        </div>

        {topCustomers.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No hay clientes con compras en este período.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-600">
                  <th className="py-2.5 px-3">Cliente / Comercio</th>
                  <th className="py-2.5 px-3">Teléfono</th>
                  <th className="py-2.5 px-3 text-center">Pedidos</th>
                  <th className="py-2.5 px-3 text-right">Facturación</th>
                  <th className="py-2.5 px-3 text-right">Saldo Pendiente</th>
                  <th className="py-2.5 px-3 text-center">Contacto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topCustomers.slice(0, 10).map((cust, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-900 block">{cust.name}</span>
                      {cust.businessName && (
                        <span className="text-[11px] text-slate-500 font-medium">🏢 {cust.businessName}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{cust.phone}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="bg-slate-100 font-bold px-2 py-0.5 rounded-md text-slate-800 text-[11px]">
                        {cust.ordersCount}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-slate-900">
                      ${cust.totalSpent.toLocaleString('es-AR')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold">
                      {cust.pendingBalance > 0 ? (
                        <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md text-[11px]">
                          ${cust.pendingBalance.toLocaleString('es-AR')}
                        </span>
                      ) : (
                        <span className="text-emerald-700 text-[11px]">Al día ✓</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <a
                        href={`https://wa.me/${cust.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(
                          cust.name
                        )},%20te%20escribimos%20de%20VQ%20Bolsas`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg inline-flex items-center justify-center transition-colors shadow-2xs"
                        title="Escribir por WhatsApp"
                      >
                        <Phone className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* LIBRO DIARIO / MOVIMIENTOS DETALLADOS (INGRESOS Y EGRESOS) */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <span>Libro de Movimientos & Flujo de Caja</span>
              <span className="text-xs font-normal text-slate-400">({displayMovements.length} operaciones)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Registro completo de cada venta de bolsas y compra de insumos en el período.
            </p>
          </div>

          {/* Filtros de Tipo y Búsqueda */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Buscar operación..."
                value={movementSearch}
                onChange={(e) => setMovementSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs w-full sm:w-48"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setMovementFilter('todos')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors ${
                  movementFilter === 'todos' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setMovementFilter('ingresos')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors ${
                  movementFilter === 'ingresos' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'
                }`}
              >
                Ingresos
              </button>
              <button
                onClick={() => setMovementFilter('egresos')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors ${
                  movementFilter === 'egresos' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-800'
                }`}
              >
                Egresos
              </button>
            </div>
          </div>
        </div>

        {displayMovements.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <DollarSign className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No hay movimientos que coincidan con los filtros</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Concepto / Detalle</th>
                  <th className="py-3 px-4">Cliente / Proveedor</th>
                  <th className="py-3 px-4 text-right">Monto</th>
                  <th className="py-3 px-4 text-center">Estado de Cobro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(mov.date + 'T12:00:00').toLocaleDateString('es-AR')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {mov.type === 'ingreso' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                          <ArrowUpRight className="w-3 h-3 text-emerald-600" /> Ingreso (Venta)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                          <ArrowDownRight className="w-3 h-3 text-red-600" /> Egreso (Insumos)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{mov.concept}</span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{mov.detail}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{mov.clientOrSupplier}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap font-black">
                      <span className={mov.type === 'ingreso' ? 'text-emerald-700' : 'text-red-700'}>
                        {mov.type === 'ingreso' ? '+' : '-'}${mov.amount.toLocaleString('es-AR')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap text-[11px] font-semibold text-slate-600">
                      {mov.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
