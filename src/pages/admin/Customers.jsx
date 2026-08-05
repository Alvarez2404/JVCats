import { useStore } from '../../context/StoreContext';
import { formatCOP, formatShortDate } from '../../utils/formatters';

export default function Customers() {
  const { getUsers, getOrders } = useStore();

  const users = getUsers().filter(u => u.role === 'cliente');
  const orders = getOrders();

  const getCustomerOrders = (id) => orders.filter(o => o.customerId === id).length;

  return (
    <div>
      <div className="admin-header">
        <h1>Clientes Registrados</h1>
      </div>


      <div className="stat-card accent-primary" style={{ marginBottom: 24, display: 'inline-block', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Total Clientes</div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Ciudad</th>
              <th>Registro</th>
              <th>Pedidos</th>
              <th>Total Compras</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>{u.name}</td>
                <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.city}</td>
                <td style={{ fontSize: '0.82rem', color: 'var(--jv-text-secondary)' }}>
                  {formatShortDate(u.registeredAt)}
                </td>
                <td>
                  <span className="badge badge-info">{getCustomerOrders(u.id)}</span>
                </td>
                <td style={{ fontWeight: 700 }}>{formatCOP(u.totalPurchases || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
