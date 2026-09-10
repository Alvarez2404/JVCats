import { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem } from '../utils/storage';
import { generateOrderId } from '../utils/formatters';
import { isFirebaseConfigured } from '../services/firebase';
import {
  getFirestoreProducts,
  syncInitialProductsToFirestore,
  updateFirestoreProduct,
  getFirestoreOrders,
  createFirestoreOrder,
  updateFirestoreOrderStatus
} from '../services/firestoreService';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [productsVer, setProductsVer] = useState(0);

  // Sincronización inicial con Firestore si está configurado
  useEffect(() => {
    async function initFirestoreData() {
      if (!isFirebaseConfigured) return;

      try {
        const localProducts = getItem('products') || [];
        // Sembrar productos iniciales si Firestore está vacío
        await syncInitialProductsToFirestore(localProducts);

        // Si ya hay productos en Firestore, actualizar la caché local
        const remoteProducts = await getFirestoreProducts();
        if (remoteProducts && remoteProducts.length > 0) {
          setItem('products', remoteProducts);
          setProductsVer(v => v + 1);
        }

        // Cargar órdenes desde Firestore
        const remoteOrders = await getFirestoreOrders();
        if (remoteOrders) {
          setItem('orders', remoteOrders);
        }
      } catch (err) {
        console.error('Error al sincronizar datos de Firestore en StoreContext:', err);
      }
    }

    initFirestoreData();
  }, []);

  function getProducts() {
    return getItem('products') || [];
  }

  function updateProduct(productId, updates) {
    const products = getProducts();
    const idx = products.findIndex(p => p.id === productId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updates };
      setItem('products', products);
      setProductsVer(v => v + 1);
      // Sincronizar en Firestore
      updateFirestoreProduct(productId, updates);
    }
    return products;
  }

  function toggleProductAvailability(productId) {
    const products = getProducts();
    const idx = products.findIndex(p => p.id === productId);
    if (idx !== -1) {
      const currentAvailable = products[idx].available !== false;
      const nextAvailable = !currentAvailable;
      const updates = {
        available: nextAvailable,
        stock: nextAvailable ? (products[idx].stock > 0 ? products[idx].stock : 99) : 0
      };
      products[idx] = {
        ...products[idx],
        ...updates
      };
      setItem('products', products);
      setProductsVer(v => v + 1);
      // Sincronizar en Firestore
      updateFirestoreProduct(productId, updates);
      return products[idx];
    }
    return null;
  }

  function getOrders() {
    return getItem('orders') || [];
  }

  function createOrder(orderData) {
    const orders = getOrders();
    const initialStatus = orderData.status || 'pagado';
    const newOrder = {
      id: orderData.id || generateOrderId(),
      ...orderData,
      status: initialStatus,
      createdAt: new Date().toISOString(),
      paidAt: initialStatus === 'pendiente_pago' ? null : new Date().toISOString(),
      shippedAt: null
    };
    orders.unshift(newOrder);
    setItem('orders', orders);

    // Guardar en Firestore
    createFirestoreOrder(newOrder);

    return newOrder;
  }

  function updateOrderStatus(orderId, newStatus) {
    const orders = getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = newStatus;
      const updates = { status: newStatus };
      if (newStatus === 'enviado') {
        const shippedAt = new Date().toISOString();
        orders[idx].shippedAt = shippedAt;
        updates.shippedAt = shippedAt;
      }
      setItem('orders', orders);
      // Actualizar en Firestore
      updateFirestoreOrderStatus(orderId, updates);
    }
    return orders;
  }

  function getUsers() {
    return getItem('users') || [];
  }

  return (
    <StoreContext.Provider value={{
      getProducts,
      updateProduct,
      toggleProductAvailability,
      productsVer,
      getOrders,
      createOrder,
      updateOrderStatus,
      getUsers
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
