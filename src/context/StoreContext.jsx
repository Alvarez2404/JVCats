import { createContext, useContext, useState } from 'react';
import { getItem, setItem } from '../utils/storage';
import { generateOrderId } from '../utils/formatters';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [productsVer, setProductsVer] = useState(0);

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
    }
    return products;
  }

  function toggleProductAvailability(productId) {
    const products = getProducts();
    const idx = products.findIndex(p => p.id === productId);
    if (idx !== -1) {
      const currentAvailable = products[idx].available !== false;
      const nextAvailable = !currentAvailable;
      products[idx] = {
        ...products[idx],
        available: nextAvailable,
        stock: nextAvailable ? (products[idx].stock > 0 ? products[idx].stock : 99) : 0
      };
      setItem('products', products);
      setProductsVer(v => v + 1);
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

    return newOrder;
  }

  function updateOrderStatus(orderId, newStatus) {
    const orders = getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = newStatus;
      if (newStatus === 'enviado') {
        orders[idx].shippedAt = new Date().toISOString();
      }
      setItem('orders', orders);
    }
    return orders;
  }

  function getUsers() {
    return getItem('users') || [];
  }

  return (
    <StoreContext.Provider value={{ getProducts, updateProduct, toggleProductAvailability, productsVer, getOrders, createOrder, updateOrderStatus, getUsers }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
