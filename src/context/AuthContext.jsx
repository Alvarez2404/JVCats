import { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem } from '../utils/storage';
import { generateUserId } from '../utils/formatters';
import { auth, googleProvider, signInWithPopup, signOut, isFirebaseConfigured } from '../services/firebase';
import { syncFirestoreUser } from '../services/firestoreService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getItem('currentUser');
    if (savedUser) setUser(savedUser);
    setLoading(false);
  }, []);

  function checkIsAdmin(email) {
    if (!email) return false;
    const normalized = email.toLowerCase().trim();
    if (normalized === 'admin' || normalized === 'admin@jvcats.com') return true;
    const adminEmailsEnv = (import.meta.env.VITE_ADMIN_EMAILS || '').toLowerCase();
    const adminList = adminEmailsEnv.split(',').map(e => e.trim());
    return adminList.includes(normalized);
  }

  async function loginWithGoogle() {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      return {
        success: false,
        message: 'Firebase está listo pero requiere las credenciales (API Key) en el archivo .env para conectar con Google.'
      };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const isAdmin = checkIsAdmin(fbUser.email);

      const users = getItem('users') || [];
      let existing = users.find(u => u.email === fbUser.email);

      const userData = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Usuario Google',
        email: fbUser.email,
        phone: fbUser.phoneNumber || '',
        photoURL: fbUser.photoURL || null,
        role: isAdmin ? 'admin' : (existing?.role || 'cliente'),
        registeredAt: existing?.registeredAt || new Date().toISOString(),
        totalPurchases: existing?.totalPurchases || 0
      };

      if (!existing) {
        users.push(userData);
      } else {
        const idx = users.findIndex(u => u.email === fbUser.email);
        users[idx] = { ...users[idx], ...userData };
      }
      setItem('users', users);

      setUser(userData);
      setItem('currentUser', userData);

      // Sincronizar en Firestore
      syncFirestoreUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      console.error('Error al iniciar sesión con Google:', err);
      let msg = 'Error al iniciar sesión con Google';
      if (err.code === 'auth/popup-closed-by-user') {
        msg = 'La ventana de inicio de sesión de Google fue cerrada.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        msg = 'Operación cancelada.';
      } else if (err.message) {
        msg = err.message;
      }
      return { success: false, message: msg };
    }
  }

  function login(email, password) {
    const users = getItem('users') || [];
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
    const isAdmin = checkIsAdmin(email);
    const newUser = {
      id: generateUserId(),
      name,
      email,
      phone,
      address,
      city,
      password,
      role: isAdmin ? 'admin' : 'cliente',
      registeredAt: new Date().toISOString(),
      totalPurchases: 0
    };
    users.push(newUser);
    setItem('users', users);
    setUser(newUser);
    setItem('currentUser', newUser);
    syncFirestoreUser(newUser);
    return { success: true, user: newUser };
  }

  async function logout() {
    setUser(null);
    setItem('currentUser', null);
    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        // silent
      }
    }
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
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginWithGoogle,
      register,
      logout,
      promoteToAdmin,
      updateUserPurchases
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
