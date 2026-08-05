import { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem } from '../utils/storage';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = getItem('cart');
    if (saved) setCart(saved);
  }, []);

  function saveCart(newCart) {
    setCart(newCart);
    setItem('cart', newCart);
  }

  function addToCart(product, quantity = 1) {
    const existing = cart.find(item => item.productId === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      }];
    }
    saveCart(newCart);
  }

  function removeFromCart(productId) {
    saveCart(cart.filter(item => item.productId !== productId));
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    saveCart(cart.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    ));
  }

  function clearCart() {
    saveCart([]);
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
