import { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export default function Inventory() {
  const { getProducts } = useStore();
  const [filter, setFilter] = useState('all');
  const products = getProducts();

  const filtered = products.filter(p => {
    if (filter === 'low') return p.stock <= p.minStock && p.stock > 0;
    if (filter === 'out') return p.stock === 0;
    if (filter === 'ok') return p.stock > p.minStock;
    return true;
  });

  const totalValue = products.reduce((s, p) => s + p.cost * p.stock, 0);
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);

  return (
    <div>
      <div className="admin-header">
        <h1>Inventario</h1>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card accent-primary">
          <div className="stat-value">{totalUnits}</div>
          <div className="stat-label">Unidades en Stock</div>
        </div>
        <div className="stat-card accent-accent">
          <div className="stat-value">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(totalValue)}</div>
          <div className="stat-label">Valor del Inventario (costo)</div>
        </div>
        <div className="stat-card accent-danger">
          <div className="stat-value">{products.filter(p => p.stock <= p.minStock).length}</div>
          <div className="stat-label">Productos con Stock Bajo</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'ok', label: 'Ok' },
          { key: 'low', label: 'Stock Bajo' },
          { key: 'out', label: 'Agotados' }
        ].map(f => (
          <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock Actual</th>
              <th>Stock Mínimo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain', background: '#f8fafc' }} />
                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                  </div>
                </td>
                <td>{p.category}</td>
                <td style={{ fontWeight: 700 }}>{p.stock}</td>
                <td>{p.minStock}</td>
                <td>
                  {p.stock === 0 ? (
                    <span className="badge badge-danger">Agotado</span>
                  ) : p.stock <= p.minStock ? (
                    <span className="badge badge-warning">Bajo</span>
                  ) : (
                    <span className="badge badge-success">Disponible</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

