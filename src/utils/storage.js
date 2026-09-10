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
  const existingProducts = getItem('products');
  if (!existingProducts) {
    setItem('products', products);
  } else {
    let changed = false;
    const normalized = existingProducts.map(p => {
      if (p.available === undefined) {
        changed = true;
        return { ...p, available: p.stock > 0 };
      }
      return p;
    });
    if (changed) {
      setItem('products', normalized);
    }
  }
  // Reset all transactions from localStorage and leave only the 2 requested users
  const isResetDone = getItem('reset_clean_v1');
  if (!isResetDone) {
    setItem('orders', []);
    const allUsers = [adminUser, ...customers];
    setItem('users', allUsers);
    setItem('reset_clean_v1', true);
  } else {
    if (!getItem('users')) {
      setItem('users', [adminUser, ...customers]);
    }
    if (!getItem('orders')) {
      setItem('orders', []);
    }
  }
}
