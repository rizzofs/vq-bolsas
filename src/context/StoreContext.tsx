'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CartItem,
  Product,
  Order,
  InstagramPost,
  RawMaterial,
  MaterialPurchase,
  MaterialMovement,
  Customer,
} from '@/types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  MOCK_INSTAGRAM_POSTS,
  INITIAL_MATERIALS,
  INITIAL_PURCHASES,
  INITIAL_MOVEMENTS,
  INITIAL_CUSTOMERS,
  VQ_CONFIG,
} from '@/lib/mockData';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  customers: Customer[];
  instagramPosts: InstagramPost[];
  instagramWidgetId: string;
  materials: RawMaterial[];
  purchases: MaterialPurchase[];
  materialMovements: MaterialMovement[];
  setInstagramWidgetId: (id: string) => void;
  addInstagramPost: (post: Omit<InstagramPost, 'id'>) => void;
  deleteInstagramPost: (postId: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrderPayment: (orderId: string, depositAmount: number) => void;
  updateOrderDeliveryDate: (orderId: string, estimatedDeliveryDate: string) => void;
  updateOrder: (order: Order) => void;
  addRawMaterial: (material: Omit<RawMaterial, 'id'>) => void;
  updateRawMaterial: (material: RawMaterial) => void;
  deleteRawMaterial: (materialId: string) => void;
  adjustMaterialStock: (materialId: string, delta: number, reason: string) => void;
  addMaterialPurchase: (purchase: Omit<MaterialPurchase, 'id'>) => void;
  deleteMaterialPurchase: (purchaseId: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>) => Customer;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  isAuthenticated: boolean;
  login: (user: string, pin: string) => boolean;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>(MOCK_INSTAGRAM_POSTS);
  const [instagramWidgetId, setInstagramWidgetIdState] = useState<string>('');
  const [materials, setMaterials] = useState<RawMaterial[]>(INITIAL_MATERIALS);
  const [purchases, setPurchases] = useState<MaterialPurchase[]>(INITIAL_PURCHASES);
  const [materialMovements, setMaterialMovements] = useState<MaterialMovement[]>(INITIAL_MOVEMENTS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Carga inicial desde localStorage si existe
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('vq_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedOrders = localStorage.getItem('vq_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedCart = localStorage.getItem('vq_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedCustomers = localStorage.getItem('vq_customers');
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers));

      const savedIg = localStorage.getItem('vq_instagram_posts');
      if (savedIg) setInstagramPosts(JSON.parse(savedIg));

      const savedWidget = localStorage.getItem('vq_instagram_widget');
      if (savedWidget) setInstagramWidgetIdState(savedWidget);

      const savedMaterials = localStorage.getItem('vq_materials');
      if (savedMaterials) setMaterials(JSON.parse(savedMaterials));

      const savedPurchases = localStorage.getItem('vq_purchases');
      if (savedPurchases) setPurchases(JSON.parse(savedPurchases));

      const savedMovements = localStorage.getItem('vq_material_movements');
      if (savedMovements) setMaterialMovements(JSON.parse(savedMovements));

      const savedAuth = localStorage.getItem('vq_auth');
      if (savedAuth === 'true') setIsAuthenticated(true);
    } catch (e) {
      console.error('Error cargando datos de localStorage', e);
    }
  }, []);

  // Persistir en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vq_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('vq_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('vq_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('vq_customers', JSON.stringify(customers));
    } catch (e) {
      console.error(e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem('vq_instagram_posts', JSON.stringify(instagramPosts));
    } catch (e) {
      console.error(e);
    }
  }, [instagramPosts]);

  useEffect(() => {
    try {
      localStorage.setItem('vq_materials', JSON.stringify(materials));
    } catch (e) {
      console.error(e);
    }
  }, [materials]);

  useEffect(() => {
    try {
      localStorage.setItem('vq_purchases', JSON.stringify(purchases));
    } catch (e) {
      console.error(e);
    }
  }, [purchases]);

  useEffect(() => {
    try {
      localStorage.setItem('vq_material_movements', JSON.stringify(materialMovements));
    } catch (e) {
      console.error(e);
    }
  }, [materialMovements]);

  const setInstagramWidgetId = (id: string) => {
    setInstagramWidgetIdState(id);
    localStorage.setItem('vq_instagram_widget', id);
  };

  const addInstagramPost = (postData: Omit<InstagramPost, 'id'>) => {
    const newPost: InstagramPost = {
      ...postData,
      id: `ig-${Date.now()}`,
    };
    setInstagramPosts((prev) => [newPost, ...prev]);
  };

  const deleteInstagramPost = (postId: string) => {
    setInstagramPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // Carrito
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.size === item.size && i.material === item.material
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                totalPrice: (i.quantity + item.quantity) * i.unitPrice,
              }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              quantity,
              totalPrice: quantity * i.unitPrice,
            }
          : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Productos (Gestión dinámica)
  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Clientes ABM
  const addCustomer = (custData: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>): Customer => {
    const newCustomer: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      totalSpent: 0,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (updated: Customer) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
  };

  // Pedidos
  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const nextNum = orders.length + 1001;
    const today = new Date().toISOString().split('T')[0];
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `VQ-${nextNum}`,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Sincronizar / Actualizar cliente si ya existe o crearlo si es nuevo de la web
    setCustomers((prev) => {
      const cleanPhone = orderData.customerPhone.replace(/\D/g, '');
      const existing = prev.find(
        (c) =>
          (cleanPhone && c.phone.replace(/\D/g, '') === cleanPhone) ||
          (c.name.toLowerCase().trim() === orderData.customerName.toLowerCase().trim())
      );

      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: c.totalSpent + orderData.totalAmount,
                lastOrderDate: today,
                address: orderData.customerAddress || c.address,
                city: orderData.customerCity || c.city,
                businessName: orderData.businessName || c.businessName,
              }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: orderData.customerName,
          businessName: orderData.businessName || '',
          phone: orderData.customerPhone,
          address: orderData.customerAddress,
          city: orderData.customerCity || 'Chivilcoy',
          channel: 'web',
          totalOrders: 1,
          totalSpent: orderData.totalAmount,
          createdAt: today,
          lastOrderDate: today,
        };
        return [newCust, ...prev];
      }
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const updateOrderDeliveryDate = (orderId: string, estimatedDeliveryDate: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, estimatedDeliveryDate } : o)));
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
  };

  const updateOrderPayment = (orderId: string, depositAmount: number) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const balance = Math.max(0, o.totalAmount - depositAmount);
          return {
            ...o,
            depositAmount,
            balanceDue: balance,
          };
        }
        return o;
      })
    );
  };

  // Materiales & Insumos de Taller
  const addRawMaterial = (matData: Omit<RawMaterial, 'id'>) => {
    const newMat: RawMaterial = {
      ...matData,
      id: `mat-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setMaterials((prev) => [...prev, newMat]);
  };

  const updateRawMaterial = (updated: RawMaterial) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === updated.id
          ? { ...updated, lastUpdated: new Date().toISOString().split('T')[0] }
          : m
      )
    );
  };

  const deleteRawMaterial = (materialId: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== materialId));
  };

  const adjustMaterialStock = (materialId: string, delta: number, reason: string) => {
    const targetMat = materials.find((m) => m.id === materialId);
    if (!targetMat) return;

    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === materialId) {
          const newStock = Math.max(0, m.currentStock + delta);
          return {
            ...m,
            currentStock: newStock,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return m;
      })
    );

    // Registrar movimiento
    const newMovement: MaterialMovement = {
      id: `mov-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      materialId,
      materialName: targetMat.name,
      type: delta < 0 ? 'consumo_taller' : 'ajuste_manual',
      quantity: delta,
      unit: targetMat.unit,
      reason: reason || (delta < 0 ? 'Consumo de taller' : 'Ajuste de inventario'),
    };
    setMaterialMovements((prev) => [newMovement, ...prev]);
  };

  const addMaterialPurchase = (purchaseData: Omit<MaterialPurchase, 'id'>) => {
    const newPurchase: MaterialPurchase = {
      ...purchaseData,
      id: `pur-${Date.now()}`,
    };
    setPurchases((prev) => [newPurchase, ...prev]);

    // Incrementar stock automáticamente
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === purchaseData.materialId) {
          return {
            ...m,
            currentStock: m.currentStock + purchaseData.quantity,
            costPerUnit: purchaseData.unitPrice,
            lastUpdated: purchaseData.date,
          };
        }
        return m;
      })
    );

    // Registrar movimiento de ingreso
    const newMovement: MaterialMovement = {
      id: `mov-${Date.now()}`,
      date: purchaseData.date,
      materialId: purchaseData.materialId,
      materialName: purchaseData.materialName,
      type: 'ingreso_compra',
      quantity: purchaseData.quantity,
      unit: purchaseData.unit,
      reason: `Compra a ${purchaseData.supplier} (${purchaseData.notes || 'Ingreso de stock'})`,
    };
    setMaterialMovements((prev) => [newMovement, ...prev]);
  };

  const deleteMaterialPurchase = (purchaseId: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== purchaseId));
  };

  // Auth simple
  const login = (user: string, pin: string) => {
    if ((user.toLowerCase() === 'admin' || user.toLowerCase() === 'vqbolsas') && pin === '1234') {
      setIsAuthenticated(true);
      localStorage.setItem('vq_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vq_auth');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        cart,
        customers,
        instagramPosts,
        instagramWidgetId,
        materials,
        purchases,
        materialMovements,
        setInstagramWidgetId,
        addInstagramPost,
        deleteInstagramPost,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        updateOrderPayment,
        updateOrderDeliveryDate,
        updateOrder,
        addRawMaterial,
        updateRawMaterial,
        deleteRawMaterial,
        adjustMaterialStock,
        addMaterialPurchase,
        deleteMaterialPurchase,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore debe usarse dentro de StoreProvider');
  }
  return context;
}
