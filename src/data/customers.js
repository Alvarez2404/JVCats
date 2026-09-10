// Clientes iniciales - Solo cuenta de prueba y cuenta master admin
const customers = [
  {
    id: 'c-test',
    name: 'Cliente Prueba',
    email: 'customer@customer.com',
    phone: '3001234567',
    address: 'Calle Principal #123',
    city: 'Bogotá',
    password: 'customer',
    role: 'cliente',
    registeredAt: '2026-08-04T00:00:00',
    totalPurchases: 0
  }
];

// Cuenta master de administrador
const adminUser = {
  id: 'admin',
  name: 'Administrador JVCats',
  email: 'admin@jvcats.com',
  phone: '3182164552',
  address: 'Sede Principal JVCats',
  city: 'Colombia',
  password: 'admin',
  role: 'admin',
  registeredAt: '2026-01-01T00:00:00',
  totalPurchases: 0
};

export { customers, adminUser };
