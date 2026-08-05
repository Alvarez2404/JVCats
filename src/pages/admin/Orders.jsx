import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCOP, formatDate } from '../../utils/formatters';

export default function Orders() {
  const { getOrders, updateOrderStatus } = useStore();

  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState(getOrders());

  const filtered = orders.filter(o => filter === 'all' || o.status === filter);

  const handleStatusChange = (orderId, newStatus) => {
    const updated = updateOrderStatus(orderId, newStatus);
    setOrders(updated);
  };

  const statusConfig = {
    enviado: { label: 'Enviado', class: 'badge-success', icon: '', color: '#10B981' },
    pagado: { label: 'Pago Recibido', class: 'badge-warning', icon: '', color: '#F59E0B' },
    mora: { label: 'En Mora', class: 'badge-danger', icon: '', color: '#EF4444' }
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Pedidos & Historial de Ventas</h1>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card accent-success">
          <div className="stat-value" style={{ color: 'var(--jv-success)' }}>{orders.filter(o => o.status === 'enviado').length}</div>
          <div className="stat-label">Enviados</div>
        </div>
        <div className="stat-card accent-warning">
          <div className="stat-value" style={{ color: 'var(--jv-warning)' }}>{orders.filter(o => o.status === 'pagado').length}</div>
          <div className="stat-label">Por Enviar</div>
        </div>
        <div className="stat-card accent-danger">
          <div className="stat-value" style={{ color: 'var(--jv-danger)' }}>{orders.filter(o => o.status === 'mora').length}</div>
          <div className="stat-label">En Mora</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'pagado', label: 'Por Enviar' },
          { key: 'mora', label: 'En Mora' },
          { key: 'enviado', label: 'Enviados' }
        ].map(f => (
          <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>


      {/* Orders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map(order => {
          const st = statusConfig[order.status];
          return (
            <div key={order.id} className="card" style={{ borderLeft: `4px solid ${st.color}` }}>
              <div className="card-body">
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{order.id}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--jv-text-secondary)' }}>
                      {formatDate(order.createdAt)} · {order.paymentMethod}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className={`badge ${st.class}`}>{st.label}</span>
                    {/* Status Change Buttons */}
                    <select className="form-select" value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      style={{ width: 'auto', padding: '6px 32px 6px 12px', fontSize: '0.8rem' }}>
                      <option value="pagado">Por Enviar</option>
                      <option value="enviado">Enviado</option>
                      <option value="mora">En Mora</option>
                    </select>
                  </div>
                </div>

                {/* Customer Info */}
                <div style={{ display: 'flex', gap: 24, marginBottom: 16, fontSize: '0.85rem', color: 'var(--jv-text-secondary)', flexWrap: 'wrap' }}>
                  <span>Cliente: {order.customerName}</span>
                  <span>Email: {order.customerEmail}</span>
                  <span>Teléfono: {order.customerPhone}</span>
                  <span>Dirección: {order.shippingAddress}</span>
                </div>


                {/* Items */}
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.88rem', borderBottom: '1px solid var(--jv-border-light)' }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>{formatCOP(item.price * item.quantity)}</span>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, marginTop: 4 }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--jv-text-secondary)' }}>
                    {order.shippedAt && `Enviado: ${formatDate(order.shippedAt)}`}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--jv-text-secondary)' }}>Envío: {formatCOP(order.shipping)}</div>
                    <div style={{ fontWeight: 800, color: 'var(--jv-primary)', fontSize: '1.1rem' }}>Total: {formatCOP(order.total)}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
