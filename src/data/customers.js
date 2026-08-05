// Clientes simulados con datos colombianos
const customers = [
  {
    id: 'c1',
    name: 'María Fernanda López',
    email: 'maria.lopez@gmail.com',
    phone: '3001234567',
    address: 'Cra 15 #82-30, Apto 501',
    city: 'Bogotá',
    password: 'maria123',
    role: 'cliente',
    registeredAt: '2026-06-15T10:30:00',
    totalPurchases: 189600
  },
  {
    id: 'c2',
    name: 'Carlos Andrés Martínez',
    email: 'carlos.martinez@hotmail.com',
    phone: '3109876543',
    address: 'Calle 45 #28-15',
    city: 'Medellín',
    password: 'carlos123',
    role: 'cliente',
    registeredAt: '2026-06-20T14:15:00',
    totalPurchases: 274700
  },
  {
    id: 'c3',
    name: 'Valentina Rodríguez',
    email: 'vale.rodriguez@yahoo.com',
    phone: '3205551234',
    address: 'Av 6N #25-110, Casa 3',
    city: 'Cali',
    password: 'vale123',
    role: 'cliente',
    registeredAt: '2026-07-02T09:45:00',
    totalPurchases: 92800
  },
  {
    id: 'c4',
    name: 'Juan Pablo Herrera',
    email: 'juanp.herrera@gmail.com',
    phone: '3157778899',
    address: 'Cra 53 #70-120',
    city: 'Barranquilla',
    password: 'juan123',
    role: 'cliente',
    registeredAt: '2026-07-10T16:20:00',
    totalPurchases: 145800
  },
  {
    id: 'c5',
    name: 'Sofía Ramírez Gómez',
    email: 'sofia.ramirez@outlook.com',
    phone: '3183334455',
    address: 'Calle 19 #9-50, Apto 302',
    city: 'Bucaramanga',
    password: 'sofia123',
    role: 'cliente',
    registeredAt: '2026-07-25T11:00:00',
    totalPurchases: 54900
  },
  {
    id: 'c-test',
    name: 'Cliente Prueba',
    email: 'customer@customer.com',
    phone: '3001234567',
    address: 'Calle Ficticia #123',
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

