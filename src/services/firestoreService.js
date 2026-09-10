import { db, isFirebaseConfigured } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

// ─── PRODUCTOS EN FIRESTORE ───
export async function getFirestoreProducts() {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const colRef = collection(db, 'products');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return null;
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error al obtener productos de Firestore:', err);
    return null;
  }
}

export async function syncInitialProductsToFirestore(products) {
  if (!isFirebaseConfigured || !db) return;
  try {
    const colRef = collection(db, 'products');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty && Array.isArray(products)) {
      for (const p of products) {
        await setDoc(doc(db, 'products', String(p.id)), p);
      }
      console.log('✅ Catálogo de productos inicial sincronizado con Firestore.');
    }
  } catch (err) {
    console.error('Error al sembrar productos en Firestore:', err);
  }
}

export async function updateFirestoreProduct(productId, updates) {
  if (!isFirebaseConfigured || !db) return false;
  try {
    const docRef = doc(db, 'products', String(productId));
    await updateDoc(docRef, updates);
    return true;
  } catch (err) {
    console.error(`Error al actualizar producto ${productId} en Firestore:`, err);
    return false;
  }
}

// ─── PEDIDOS / ÓRDENES EN FIRESTORE ───
export async function getFirestoreOrders() {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error al obtener órdenes de Firestore:', err);
    return null;
  }
}

export async function createFirestoreOrder(orderData) {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const docId = orderData.id || `ORD-${Date.now()}`;
    await setDoc(doc(db, 'orders', docId), { ...orderData, id: docId });
    return docId;
  } catch (err) {
    console.error('Error al crear orden en Firestore:', err);
    return null;
  }
}

export async function updateFirestoreOrderStatus(orderId, updates) {
  if (!isFirebaseConfigured || !db) return false;
  try {
    await updateDoc(doc(db, 'orders', String(orderId)), updates);
    return true;
  } catch (err) {
    console.error(`Error al actualizar orden ${orderId} en Firestore:`, err);
    return false;
  }
}

// ─── USUARIOS EN FIRESTORE ───
export async function syncFirestoreUser(user) {
  if (!isFirebaseConfigured || !db || !user?.id) return;
  try {
    const userRef = doc(db, 'users', String(user.id));
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        ...user,
        createdAt: new Date().toISOString()
      });
    } else {
      await updateDoc(userRef, {
        name: user.name || snap.data().name,
        email: user.email || snap.data().email,
        photoURL: user.photoURL || snap.data().photoURL || null,
        lastLogin: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error('Error al sincronizar usuario con Firestore:', err);
  }
}
