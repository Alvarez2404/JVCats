// Format Colombian pesos
export function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format date in Spanish
export function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format short date
export function formatShortDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Generate unique order ID
export function generateOrderId() {
  const num = Math.floor(Math.random() * 900) + 100;
  return `ORD-${num}`;
}

// Generate unique user ID
export function generateUserId() {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Calculate margin percentage
export function calcMargin(price, cost) {
  if (!price || price === 0) return 0;
  return Math.round(((price - cost) / price) * 100);
}
