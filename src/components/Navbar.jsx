import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartSidebar from './CartSidebar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-top">
          <div className="container flex-between">
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <a href="tel:3182164552">Teléfono: 318 216 4552</a>
              <a href="mailto:contacto@jvcats.com">Email: contacto@jvcats.com</a>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <a href="https://www.instagram.com/jvcatslatienda/" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.facebook.com/share/1Gzwkh2ueM/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Facebook</a>
            </div>
          </div>
        </div>

        <div className="navbar-main">
          <div className="container flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <Link to="/" className="navbar-logo">
                <img src="/logo-jvcats.png" alt="JV Cats La Tienda" />
              </Link>
              <div className="navbar-links">
                <Link to="/" className={isActive('/')}>Inicio</Link>
                <Link to="/tienda" className={isActive('/tienda')}>Tienda</Link>
                {user && <Link to="/mis-pedidos" className={isActive('/mis-pedidos')}>Mis Pedidos</Link>}
                {user?.role === 'admin' && <Link to="/admin" className={isActive('/admin')}>Admin</Link>}
              </div>
            </div>

            <div className="navbar-actions">
              <button className="navbar-cart-btn" onClick={() => setCartOpen(true)} aria-label="Carrito">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-cart">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartCount > 0 && <span className="navbar-cart-count">{cartCount}</span>}
              </button>


              {user ? (
                <div style={{ position: 'relative' }}>
                  <button className="navbar-user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                    Usuario: {user.name.split(' ')[0]}
                    {user.role === 'admin' && <span className="badge badge-primary" style={{ marginLeft: 4, fontSize: '0.65rem' }}>ADMIN</span>}
                  </button>
                  {userMenuOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: 8,
                      background: '#fff', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                      border: '1px solid #e2e8f0', minWidth: 200, zIndex: 50, overflow: 'hidden',
                      animation: 'slideUp 0.2s ease'
                    }}>
                      <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{user.email}</div>
                      </div>
                      <Link to="/mis-pedidos" onClick={() => setUserMenuOpen(false)}
                        style={{ display: 'block', padding: '12px 18px', fontSize: '0.88rem', borderBottom: '1px solid #f1f5f9' }}>
                        Mis Pedidos
                      </Link>

                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                          style={{ display: 'block', padding: '12px 18px', fontSize: '0.88rem', borderBottom: '1px solid #f1f5f9' }}>
                          Panel Admin
                        </Link>
                      )}
                      <button onClick={handleLogout}
                        style={{ display: 'block', width: '100%', padding: '12px 18px', fontSize: '0.88rem', textAlign: 'left', color: '#EF4444' }}>
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm">Iniciar Sesión</Link>
              )}

              <button className="navbar-mobile-toggle" onClick={() => setMobileOpen(true)} aria-label="Menu">Menu</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <>
          <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-nav">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <img src="/logo-jvcats.png" alt="JV Cats La Tienda" style={{ height: 48 }} />
              <button onClick={() => setMobileOpen(false)} style={{ fontSize: '1.4rem' }}>Cerrar</button>
            </div>
            <Link to="/" onClick={() => setMobileOpen(false)} className={isActive('/')}>Inicio</Link>
            <Link to="/tienda" onClick={() => setMobileOpen(false)} className={isActive('/tienda')}>Tienda</Link>
            {user && <Link to="/mis-pedidos" onClick={() => setMobileOpen(false)}>Mis Pedidos</Link>}
            {user?.role === 'admin' && <Link to="/admin" onClick={() => setMobileOpen(false)}>Panel Admin</Link>}
            {!user && <Link to="/login" onClick={() => setMobileOpen(false)}>Iniciar Sesión</Link>}
            {user && (
              <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                style={{ padding: '14px 0', fontSize: '1rem', fontWeight: 600, color: '#EF4444', textAlign: 'left' }}>
                Cerrar Sesión
              </button>
            )}
          </div>
        </>
      )}


      {/* Cart Sidebar */}
      {cartOpen && <CartSidebar onClose={() => setCartOpen(false)} />}
    </>
  );
}
