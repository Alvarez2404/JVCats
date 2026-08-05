import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { formatCOP } from '../../utils/formatters';

export default function Dashboard() {
  const { user, logout, promoteToAdmin } = useAuth();
  const { getProducts, getOrders, getUsers } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [promoteEmail, setPromoteEmail] = useState('');
  const [promoteMsg, setPromoteMsg] = useState('');

  const products = getProducts();
  const orders = getOrders();
  const users = getUsers();

  const isActive = (path) => location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path)) ? 'active' : '';

  // Stats
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pagado').length;
  const overdueOrders = orders.filter(o => o.status === 'mora').length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  const totalClients = users.filter(u => u.role === 'cliente').length;

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '' },
    { path: '/admin/inventario', label: 'Inventario', icon: '' },
    { path: '/admin/pedidos', label: 'Pedidos', icon: '' },
    { path: '/admin/productos', label: 'Productos', icon: '' },
    { path: '/admin/clientes', label: 'Clientes', icon: '' },
    { path: '/admin/reportes', label: 'Reportes', icon: '' },
  ];

  const handlePromote = () => {
    const result = promoteToAdmin(promoteEmail);
    setPromoteMsg(result.message);
    if (result.success) setPromoteEmail('');
    setTimeout(() => setPromoteMsg(''), 3000);
  };

  // If on /admin exactly, show dashboard content; otherwise render Outlet
  const isDashboard = location.pathname === '/admin';

  // Top products by order frequency
  const productSales = {};
  orders.forEach(o => o.items.forEach(item => {
    productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
  }));
  const topProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxSales = topProducts.length > 0 ? topProducts[0][1] : 1;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            <img src="https://jvcats.com/wp-content/uploads/2022/03/LOGO-JVC-1-1.png" alt="JV Cats" />
          </Link>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: 8, letterSpacing: '0.05em' }}>PANEL DE ADMINISTRACIÓN</div>
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
              className={`admin-nav-item ${isActive(item.path)}`}>
              {item.label}
            </Link>
          ))}
        </nav>


        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
            Sesión activa
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user?.name}</div>
          <Link to="/" style={{ display: 'block', marginTop: 12, fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
            ← Volver a la tienda
          </Link>
          <button onClick={() => { logout(); navigate('/'); }}
            style={{ marginTop: 8, fontSize: '0.82rem', color: '#EF4444' }}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Toggle */}
      <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
      {sidebarOpen && <div className="mobile-nav-overlay" onClick={() => setSidebarOpen(false)} style={{ zIndex: 90 }} />}

      {/* Main */}
      <main className="admin-main">
        {isDashboard ? (
          <>
            <div className="admin-header">
              <div>
                <h1>Dashboard</h1>
                <p style={{ color: 'var(--jv-text-secondary)', fontSize: '0.9rem' }}>Bienvenido, {user?.name}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid-4" style={{ marginBottom: 32 }}>
              <div className="stat-card accent-accent">
                <div className="stat-value">{formatCOP(totalRevenue)}</div>
                <div className="stat-label">Ventas Totales</div>
              </div>
              <div className="stat-card accent-warning">
                <div className="stat-value">{pendingOrders}</div>
                <div className="stat-label">Por Enviar</div>
              </div>
              <div className="stat-card accent-danger">
                <div className="stat-value">{overdueOrders}</div>
                <div className="stat-label">En Mora</div>
              </div>
              <div className="stat-card accent-primary">
                <div className="stat-value">{totalClients}</div>
                <div className="stat-label">Clientes</div>
              </div>
            </div>

            <div className="grid-2" style={{ marginBottom: 32 }}>
              {/* Top Products Chart */}
              <div className="chart-container">
                <h3>Productos Más Vendidos</h3>
                <div className="bar-chart">
                  {topProducts.map(([name, qty], i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                      <div className="bar-value">{qty}</div>
                      <div className="bar" style={{
                        height: `${(qty / maxSales) * 100}%`,
                        background: `hsl(${200 + i * 25}, 65%, ${50 + i * 5}%)`
                      }} />
                      <div className="bar-label" style={{ maxWidth: 80 }}>{name.split(' ').slice(0, 2).join(' ')}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="chart-container">
                <h3>Alertas de Stock Bajo ({lowStockProducts})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
                  {products.filter(p => p.stock <= p.minStock).map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(239,68,68,0.04)', borderRadius: 8, fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                      <span className={`badge ${p.stock === 0 ? 'badge-danger' : 'badge-warning'}`}>
                        {p.stock === 0 ? 'Agotado' : `${p.stock} uds`}
                      </span>
                    </div>
                  ))}
                  {lowStockProducts === 0 && <p style={{ color: 'var(--jv-text-light)', fontSize: '0.88rem' }}>Todos los productos tienen stock suficiente</p>}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="chart-container" style={{ marginBottom: 32 }}>
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Pedidos Recientes</h3>
                <Link to="/admin/pedidos" className="btn btn-sm btn-outline">Ver Todos</Link>
              </div>
              <div className="table-wrapper" style={{ boxShadow: 'none', border: 'none' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 600 }}>{o.id}</td>
                        <td>{o.customerName}</td>
                        <td style={{ fontWeight: 600 }}>{formatCOP(o.total)}</td>
                        <td>
                          <span className={`badge ${o.status === 'enviado' ? 'badge-success' : o.status === 'pagado' ? 'badge-warning' : 'badge-danger'}`}>
                            {o.status === 'enviado' ? 'Enviado' : o.status === 'pagado' ? 'Por enviar' : 'En mora'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Promote Admin */}
            <div className="chart-container">
              <h3>Promover Administrador</h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--jv-text-secondary)', marginBottom: 16 }}>
                Ingresa el email de un cliente registrado para darle acceso de administrador
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <input className="form-input" value={promoteEmail} onChange={e => setPromoteEmail(e.target.value)}
                  placeholder="email@cliente.com" style={{ flex: 1 }} />
                <button className="btn btn-primary" onClick={handlePromote} disabled={!promoteEmail}>
                  Promover
                </button>
              </div>
              {promoteMsg && (
                <div style={{ marginTop: 12, fontSize: '0.88rem', fontWeight: 500,
                  color: promoteMsg.includes('ahora') ? 'var(--jv-success)' : 'var(--jv-danger)' }}>
                  {promoteMsg}
                </div>
              )}
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
