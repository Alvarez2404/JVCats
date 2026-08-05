import { createContext, useContext } from 'react';
import { getItem, setItem } from '../utils/storage';
import { generateOrderId } from '../utils/formatters';

const StoreContext = createContext();

export function StoreProvider({ children }) {

  function getProducts() {
    return getItem('products') || [];
  }

  function updateProduct(productId, updates) {
    const products = getProducts();
    const idx = products.findIndex(p => p.id === productId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updates };
      setItem('products', products);
    }
    return products;
  }

  function getOrders() {
    return getItem('orders') || [];
  }

  function createOrder(orderData) {
    const orders = getOrders();
    const newOrder = {
      id: generateOrderId(),
      ...orderData,
      status: 'pagado',
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      shippedAt: null
    };
    orders.unshift(newOrder);
    setItem('orders', orders);

    // Deduct stock
    const products = getProducts();
    orderData.items.forEach(item => {
      const pIdx = products.findIndex(p => p.id === item.productId);
      if (pIdx !== -1) {
        products[pIdx].stock = Math.max(0, products[pIdx].stock - item.quantity);
      }
    });
    setItem('products', products);

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
    <StoreContext.Provider value={{ getProducts, updateProduct, getOrders, createOrder, updateOrderStatus, getUsers }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
