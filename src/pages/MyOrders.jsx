import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { formatCOP, formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';

export default function MyOrders() {
  const { user } = useAuth();
  const { getOrders } = useStore();
  const orders = getOrders().filter(o => o.customerId === user?.id);

  const statusConfig = {
    enviado: { label: 'Enviado', class: 'badge-success', icon: '' },
    pagado: { label: 'Pago Recibido', class: 'badge-warning', icon: '' },
    mora: { label: 'En Mora', class: 'badge-danger', icon: '' }
  };

  return (
    <div className="container page-section">
      <h1 style={{ fontFamily: 'var(--jv-font-heading)', fontSize: '1.6rem', marginBottom: 24 }}>Mis Pedidos</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <h3>No tienes pedidos aún</h3>
          <p>¡Explora nuestra tienda y haz tu primera compra!</p>
          <Link to="/tienda" className="btn btn-primary">Ir a la Tienda</Link>
        </div>
      ) : (

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => {
            const st = statusConfig[order.status] || statusConfig.pagado;
            return (
              <div key={order.id} className={`order-card status-${order.status} animate-fadeIn`}>
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{order.id}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--jv-text-secondary)' }}>{formatDate(order.createdAt)}</div>
                  </div>
                  <span className={`badge ${st.class}`}>{st.icon} {st.label}</span>
                </div>

                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem' }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>{formatCOP(item.price * item.quantity)}</span>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--jv-border-light)', paddingTop: 12, marginTop: 12 }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--jv-text-secondary)' }}>
                    {order.paymentMethod} · {order.shippingAddress}
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--jv-primary)', fontSize: '1.05rem' }}>{formatCOP(order.total)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
