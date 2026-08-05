// Pedidos simulados en los 3 estados del semáforo
const orders = [
  {
    id: 'ORD-001',
    customerId: 'c1',
    customerName: 'María Fernanda López',
    customerEmail: 'maria.lopez@gmail.com',
    customerPhone: '3001234567',
    items: [
      { productId: 1, name: 'Arena Carbón Activado 5kg', price: 18900, quantity: 2 },
      { productId: 17, name: 'Nuggets Pollo Adultos 100g', price: 5900, quantity: 3 }
    ],
    subtotal: 55500,
    shipping: 8000,
    total: 63500,
    paymentMethod: 'Nequi',
    shippingAddress: 'Cra 15 #82-30, Apto 501, Bogotá',
    status: 'enviado',
    createdAt: '2026-07-20T10:30:00',
    paidAt: '2026-07-20T10:35:00',
    shippedAt: '2026-07-21T14:00:00'
  },
  {
    id: 'ORD-002',
    customerId: 'c2',
    customerName: 'Carlos Andrés Martínez',
    customerEmail: 'carlos.martinez@hotmail.com',
    customerPhone: '3109876543',
    items: [
      { productId: 3, name: 'Arena Blueberry 20kg', price: 54900, quantity: 2 },
      { productId: 18, name: 'Nuggets Pollo Adultos 1kg', price: 35900, quantity: 1 }
    ],
    subtotal: 145700,
    shipping: 12000,
    total: 157700,
    paymentMethod: 'PSE',
    shippingAddress: 'Calle 45 #28-15, Medellín',
    status: 'enviado',
    createdAt: '2026-07-22T14:15:00',
    paidAt: '2026-07-22T14:20:00',
    shippedAt: '2026-07-23T09:00:00'
  },
  {
    id: 'ORD-003',
    customerId: 'c3',
    customerName: 'Valentina Rodríguez',
    customerEmail: 'vale.rodriguez@yahoo.com',
    customerPhone: '3205551234',
    items: [
      { productId: 11, name: 'Arena Lavanda 5kg', price: 18900, quantity: 2 },
      { productId: 9, name: 'Arena Fresa 5kg', price: 18900, quantity: 1 },
      { productId: 20, name: 'Snack Nuggets Rellenos 80g', price: 4900, quantity: 3 }
    ],
    subtotal: 71400,
    shipping: 10000,
    total: 81400,
    paymentMethod: 'Nequi',
    shippingAddress: 'Av 6N #25-110, Casa 3, Cali',
    status: 'pagado',
    createdAt: '2026-08-01T09:45:00',
    paidAt: '2026-08-01T09:50:00',
    shippedAt: null
  },
  {
    id: 'ORD-004',
    customerId: 'c4',
    customerName: 'Juan Pablo Herrera',
    customerEmail: 'juanp.herrera@gmail.com',
    customerPhone: '3157778899',
    items: [
      { productId: 19, name: 'Nuggets Pollo Adultos 3kg', price: 89900, quantity: 1 },
      { productId: 16, name: 'Arena de Maíz 4kg', price: 22900, quantity: 2 }
    ],
    subtotal: 135700,
    shipping: 15000,
    total: 150700,
    paymentMethod: 'PSE',
    shippingAddress: 'Cra 53 #70-120, Barranquilla',
    status: 'pagado',
    createdAt: '2026-08-02T16:20:00',
    paidAt: '2026-08-02T16:25:00',
    shippedAt: null
  },
  {
    id: 'ORD-005',
    customerId: 'c1',
    customerName: 'María Fernanda López',
    customerEmail: 'maria.lopez@gmail.com',
    customerPhone: '3001234567',
    items: [
      { productId: 6, name: 'Arena Café 20kg', price: 54900, quantity: 1 },
      { productId: 7, name: 'Arena Colonia 5kg', price: 18900, quantity: 2 }
    ],
    subtotal: 92700,
    shipping: 12000,
    total: 104700,
    paymentMethod: 'Nequi',
    shippingAddress: 'Cra 15 #82-30, Apto 501, Bogotá',
    status: 'mora',
    createdAt: '2026-07-15T08:00:00',
    paidAt: '2026-07-15T08:05:00',
    shippedAt: null
  },
  {
    id: 'ORD-006',
    customerId: 'c5',
    customerName: 'Sofía Ramírez Gómez',
    customerEmail: 'sofia.ramirez@outlook.com',
    customerPhone: '3183334455',
    items: [
      { productId: 12, name: 'Arena Lavanda 20kg', price: 54900, quantity: 1 }
    ],
    subtotal: 54900,
    shipping: 10000,
    total: 64900,
    paymentMethod: 'PSE',
    shippingAddress: 'Calle 19 #9-50, Apto 302, Bucaramanga',
    status: 'enviado',
    createdAt: '2026-07-28T11:00:00',
    paidAt: '2026-07-28T11:05:00',
    shippedAt: '2026-07-29T15:30:00'
  },
  {
    id: 'ORD-007',
    customerId: 'c2',
    customerName: 'Carlos Andrés Martínez',
    customerEmail: 'carlos.martinez@hotmail.com',
    customerPhone: '3109876543',
    items: [
      { productId: 1, name: 'Arena Carbón Activado 5kg', price: 18900, quantity: 3 },
      { productId: 18, name: 'Nuggets Pollo Adultos 1kg', price: 35900, quantity: 2 }
    ],
    subtotal: 128500,
    shipping: 12000,
    total: 140500,
    paymentMethod: 'Nequi',
    shippingAddress: 'Calle 45 #28-15, Medellín',
    status: 'mora',
    createdAt: '2026-07-10T12:30:00',
    paidAt: '2026-07-10T12:35:00',
    shippedAt: null
  },
  {
    id: 'ORD-008',
    customerId: 'c4',
    customerName: 'Juan Pablo Herrera',
    customerEmail: 'juanp.herrera@gmail.com',
    customerPhone: '3157778899',
    items: [
      { productId: 9, name: 'Arena Fresa 5kg', price: 18900, quantity: 4 },
      { productId: 17, name: 'Nuggets Pollo Adultos 100g', price: 5900, quantity: 5 }
    ],
    subtotal: 105100,
    shipping: 15000,
    total: 120100,
    paymentMethod: 'PSE',
    shippingAddress: 'Cra 53 #70-120, Barranquilla',
    status: 'enviado',
    createdAt: '2026-07-18T10:00:00',
    paidAt: '2026-07-18T10:05:00',
    shippedAt: '2026-07-19T08:30:00'
  }
];

export default orders;
