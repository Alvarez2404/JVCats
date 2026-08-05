import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { StoreProvider } from './context/StoreContext';
import { initializeStore } from './utils/storage';

// Initial data import
import products from './data/products';
import { customers, adminUser } from './data/customers';
import orders from './data/orders';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import NotFound from './pages/NotFound';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Inventory from './pages/admin/Inventory';
import OrdersPage from './pages/admin/Orders';
import ProductsPage from './pages/admin/Products';
import CustomersPage from './pages/admin/Customers';
import ReportsPage from './pages/admin/Reports';

// Auto Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper to conditional render header/footer (omit in Auth pages or Admin pages)
function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAuthPath = location.pathname === '/login' || location.pathname === '/register';

  if (isAdminPath) {
    return children;
  }

  if (isAuthPath) {
    return children;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  // Initialize simulated local storage database
  useEffect(() => {
    initializeStore(products, customers, adminUser, orders);
  }, []);

  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <LayoutWrapper>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/tienda" element={<Store />} />
                <Route path="/producto/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Customer Protected Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mis-pedidos"
                  element={
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Dashboard />
                    </ProtectedRoute>
                  }
                >
                  <Route path="inventario" element={<Inventory />} />
                  <Route path="pedidos" element={<OrdersPage />} />
                  <Route path="productos" element={<ProductsPage />} />
                  <Route path="clientes" element={<CustomersPage />} />
                  <Route path="reportes" element={<ReportsPage />} />
                </Route>

                {/* Fallback Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LayoutWrapper>
          </Router>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
