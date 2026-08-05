import { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem } from '../utils/storage';
import { generateUserId } from '../utils/formatters';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getItem('currentUser');
    if (savedUser) setUser(savedUser);
    setLoading(false);
  }, []);

  function login(email, password) {
    const users = getItem('users') || [];
    // Allow login by email or username 'admin'
    const found = users.find(u =>
      (u.email === email || (email === 'admin' && u.id === 'admin')) && u.password === password
    );
    if (found) {
      setUser(found);
      setItem('currentUser', found);
      return { success: true, user: found };
    }
    return { success: false, message: 'Credenciales incorrectas' };
  }

  function register({ name, email, phone, address, city, password }) {
    const users = getItem('users') || [];
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Este email ya está registrado' };
    }
    const newUser = {
      id: generateUserId(),
      name,
      email,
      phone,
      address,
      city,
      password,
      role: 'cliente',
      registeredAt: new Date().toISOString(),
      totalPurchases: 0
    };
    users.push(newUser);
    setItem('users', users);
    setUser(newUser);
    setItem('currentUser', newUser);
    return { success: true, user: newUser };
  }

  function logout() {
    setUser(null);
    setItem('currentUser', null);
  }

  function promoteToAdmin(email) {
    if (!user || user.role !== 'admin') {
      return { success: false, message: 'No tienes permisos' };
    }
    const users = getItem('users') || [];
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) return { success: false, message: 'Usuario no encontrado' };
    if (users[idx].role === 'admin') return { success: false, message: 'Ya es administrador' };
    users[idx].role = 'admin';
    setItem('users', users);
    return { success: true, message: `${users[idx].name} ahora es administrador` };
  }

  function updateUserPurchases(userId, amount) {
    const users = getItem('users') || [];
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].totalPurchases = (users[idx].totalPurchases || 0) + amount;
      setItem('users', users);
      if (user && user.id === userId) {
        const updated = { ...user, totalPurchases: users[idx].totalPurchases };
        setUser(updated);
        setItem('currentUser', updated);
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, promoteToAdmin, updateUserPurchases }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
