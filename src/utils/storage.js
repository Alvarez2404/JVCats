// localStorage helpers with namespace
const NAMESPACE = 'jvcats_';

export function getItem(key) {
  try {
    const item = localStorage.getItem(NAMESPACE + key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(NAMESPACE + key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

export function removeItem(key) {
  localStorage.removeItem(NAMESPACE + key);
}

// Initialize store data if not already present
export function initializeStore(products, customers, adminUser, orders) {
  if (!getItem('products')) {
    setItem('products', products);
  }
  if (!getItem('users')) {
    const allUsers = [adminUser, ...customers];
    setItem('users', allUsers);
  }
  if (!getItem('orders')) {
    setItem('orders', orders);
  }
}
