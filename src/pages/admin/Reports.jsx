import { useStore } from '../../context/StoreContext';
import { formatCOP } from '../../utils/formatters';

export default function Reports() {
  const { getProducts, getOrders, getUsers } = useStore();

  const products = getProducts();
  const orders = getOrders();
  const users = getUsers();

  // Revenue calculations
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalCost = orders.reduce((s, o) => {
    return s + o.items.reduce((is, item) => {
      const prod = products.find(p => p.id === item.productId);
      return is + (prod ? prod.cost * item.quantity : 0);
    }, 0);
  }, 0);
  const totalProfit = totalRevenue - totalCost;
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Products sold
  const productSales = {};
  const productRevenue = {};
  orders.forEach(o => o.items.forEach(item => {
    productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
    productRevenue[item.name] = (productRevenue[item.name] || 0) + item.price * item.quantity;
  }));
  const topBySales = Object.entries(productSales).sort((a, b) => b[1] - a[1]);
  const topByRevenue = Object.entries(productRevenue).sort((a, b) => b[1] - a[1]);
  const maxRevenue = topByRevenue.length > 0 ? topByRevenue[0][1] : 1;

  // Payment methods
  const nequiOrders = orders.filter(o => o.paymentMethod === 'Nequi').length;
  const pseOrders = orders.filter(o => o.paymentMethod === 'PSE').length;

  // Status distribution
  const statusCounts = {
    enviado: orders.filter(o => o.status === 'enviado').length,
    pagado: orders.filter(o => o.status === 'pagado').length,
    mora: orders.filter(o => o.status === 'mora').length
  };

  // Top customers
  const customerSpend = {};
  orders.forEach(o => {
    customerSpend[o.customerName] = (customerSpend[o.customerName] || 0) + o.total;
  });
  const topCustomers = Object.entries(customerSpend).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Category breakdown
  const categoryRevenue = {};
  orders.forEach(o => o.items.forEach(item => {
    const prod = products.find(p => p.id === item.productId);
    if (prod) {
      categoryRevenue[prod.category] = (categoryRevenue[prod.category] || 0) + item.price * item.quantity;
    }
  }));

  return (
    <div>
      <div className="admin-header">
        <h1>Reportes & Análisis</h1>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <div className="stat-card accent-accent">
          <div className="stat-value">{formatCOP(totalRevenue)}</div>
          <div className="stat-label">Ingresos Totales</div>
        </div>
        <div className="stat-card accent-danger">
          <div className="stat-value">{formatCOP(totalCost)}</div>
          <div className="stat-label">Costos Totales</div>
        </div>
        <div className="stat-card accent-success">
          <div className="stat-value">{formatCOP(totalProfit)}</div>
          <div className="stat-label">Ganancia Neta</div>
        </div>
        <div className="stat-card accent-primary">
          <div className="stat-value">{formatCOP(avgOrderValue)}</div>
          <div className="stat-label">Ticket Promedio</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 32 }}>
        {/* Revenue by Product */}
        <div className="chart-container">
          <h3>Ingresos por Producto</h3>

          <div className="bar-chart" style={{ height: 220 }}>
            {topByRevenue.slice(0, 8).map(([name, rev], i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <div className="bar-value">{formatCOP(rev)}</div>
                <div className="bar" style={{
                  height: `${(rev / maxRevenue) * 100}%`,
                  background: `linear-gradient(to top, hsl(${35 + i * 15}, 80%, 50%), hsl(${35 + i * 15}, 80%, 65%))`
                }} />
                <div className="bar-label" style={{ maxWidth: 70 }}>{name.split(' ').slice(0, 2).join(' ')}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Status Distribution */}
        <div className="chart-container">
          <h3>Distribución de Pedidos por Estado</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 0' }}>
            {[
              { label: 'Enviados', count: statusCounts.enviado, color: 'var(--jv-success)', icon: 'Enviado' },
              { label: 'Por Enviar', count: statusCounts.pagado, color: 'var(--jv-warning)', icon: 'Por enviar' },
              { label: 'En Mora', count: statusCounts.mora, color: 'var(--jv-danger)', icon: 'En mora' }
            ].map((s, i) => (
              <div key={i}>
                <div className="flex-between" style={{ marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.icon}: {s.label}</span>
                  <span style={{ fontWeight: 700 }}>{s.count} ({orders.length > 0 ? Math.round(s.count / orders.length * 100) : 0}%)</span>
                </div>
                <div style={{ height: 10, background: 'var(--jv-border-light)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${orders.length > 0 ? (s.count / orders.length) * 100 : 0}%`, background: s.color, borderRadius: 5, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: 12, fontFamily: 'var(--jv-font-body)' }}>Métodos de Pago</h4>
            <div className="grid-2" style={{ gap: 12 }}>
              <div style={{ padding: 16, background: 'var(--jv-bg)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{nequiOrders}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--jv-text-secondary)' }}>Nequi</div>
              </div>
              <div style={{ padding: 16, background: 'var(--jv-bg)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{pseOrders}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--jv-text-secondary)' }}>PSE</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 32 }}>
        {/* Top Customers */}
        <div className="chart-container">
          <h3>Clientes Más Activos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topCustomers.map(([name, total], i) => (
              <div key={i} className="flex-between" style={{ padding: '10px 14px', background: i === 0 ? 'rgba(245,166,35,0.06)' : 'var(--jv-bg)', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--jv-primary)', color: '#fff', display: 'flex', alignItems: 'center', justify: 'center', fontSize: '0.75rem', fontWeight: 700 }}>{i + 1}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{name}</span>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--jv-primary)' }}>{formatCOP(total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Revenue */}
        <div className="chart-container">
          <h3>Ingresos por Categoría</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 0' }}>
            {Object.entries(categoryRevenue).map(([cat, rev], i) => (
              <div key={i}>
                <div className="flex-between" style={{ marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{cat}</span>
                  <span style={{ fontWeight: 700, color: 'var(--jv-primary)' }}>{formatCOP(rev)}</span>
                </div>
                <div style={{ height: 12, background: 'var(--jv-border-light)', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(rev / totalRevenue) * 100}%`,
                    background: cat === 'Arenas' ? 'linear-gradient(90deg, #3B82F6, #60A5FA)' : 'linear-gradient(90deg, #F59E0B, #FBBF24)',
                    borderRadius: 6
                  }} />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--jv-text-light)', marginTop: 4 }}>
                  {totalRevenue > 0 ? Math.round((rev / totalRevenue) * 100) : 0}% del total
                </div>
              </div>
            ))}
          </div>

          {/* Units Sold */}
          <div style={{ marginTop: 24 }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: 12, fontFamily: 'var(--jv-font-body)' }}>Unidades Vendidas (Top 5)</h4>
            {topBySales.slice(0, 5).map(([name, qty], i) => (
              <div key={i} className="flex-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--jv-border-light)', fontSize: '0.88rem' }}>
                <span>{name}</span>
                <span style={{ fontWeight: 700 }}>{qty} uds</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="chart-container">
        <h3>Insights Clave</h3>
        <div className="grid-3" style={{ gap: 16, marginTop: 16 }}>
          <div style={{ padding: 20, background: 'rgba(16,185,129,0.04)', borderRadius: 12, border: '1px solid rgba(16,185,129,0.1)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--jv-text-secondary)', marginBottom: 4 }}>Margen de Ganancia Promedio</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--jv-success)', fontFamily: 'var(--jv-font-heading)' }}>
              {totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0}%
            </div>
          </div>
          <div style={{ padding: 20, background: 'rgba(59,130,246,0.04)', borderRadius: 12, border: '1px solid rgba(59,130,246,0.1)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--jv-text-secondary)', marginBottom: 4 }}>Tasa de Envío</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--jv-info)', fontFamily: 'var(--jv-font-heading)' }}>
              {orders.length > 0 ? Math.round((statusCounts.enviado / orders.length) * 100) : 0}%
            </div>
          </div>
          <div style={{ padding: 20, background: 'rgba(245,166,35,0.04)', borderRadius: 12, border: '1px solid rgba(245,166,35,0.1)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--jv-text-secondary)', marginBottom: 4 }}>Clientes Registrados</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--jv-accent)', fontFamily: 'var(--jv-font-heading)' }}>
              {users.filter(u => u.role === 'cliente').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



