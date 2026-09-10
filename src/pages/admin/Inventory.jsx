import { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCOP } from '../../utils/formatters';

export default function Inventory() {
  const { getProducts, toggleProductAvailability, productsVer } = useStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  // Re-read products whenever productsVer updates
  const products = useMemo(() => getProducts(), [productsVer]);

  const availableCount = products.filter(p => p.available !== false && (p.stock === undefined || p.stock > 0)).length;
  const unavailableCount = products.length - availableCount;

  const filtered = products.filter(p => {
    const isAvail = p.available !== false && (p.stock === undefined || p.stock > 0);
    if (filter === 'available' && !isAvail) return false;
    if (filter === 'unavailable' && isAvail) return false;
    if (filter === 'Arenas' && p.category !== 'Arenas') return false;
    if (filter === 'Comida' && p.category !== 'Comida') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.weight && p.weight.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleToggle = (product) => {
    const updated = toggleProductAvailability(product.id);
    const newStatus = updated?.available ? 'Disponible' : 'No disponible';
    showToast(`"${product.name}" marcado como ${newStatus}`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="admin-inventory-page">
      <div className="admin-header">
        <div>
          <h1>Control de Disponibilidad</h1>
          <p style={{ color: 'var(--jv-text-secondary)', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Gestiona de forma rápida si los productos están activos o inactivos en la tienda con un solo clic.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card accent-primary">
          <div className="stat-value">{products.length}</div>
          <div className="stat-label">Total de Productos</div>
        </div>
        <div className="stat-card accent-success">
          <div className="stat-value" style={{ color: '#16a34a' }}>{availableCount}</div>
          <div className="stat-label">Productos Disponibles</div>
        </div>
        <div className="stat-card accent-danger">
          <div className="stat-value" style={{ color: '#dc2626' }}>{unavailableCount}</div>
          <div className="stat-label">Productos No Disponibles</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: `Todos (${products.length})` },
            { key: 'available', label: `Disponibles (${availableCount})` },
            { key: 'unavailable', label: `No Disponibles (${unavailableCount})` },
            { key: 'Arenas', label: 'Arenas' },
            { key: 'Comida', label: 'Comida' },
          ].map(f => (
            <button
              key={f.key}
              className={`filter-btn ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ minWidth: 260, flex: '1 1 260px', maxWidth: 360 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar producto por nombre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 14px', fontSize: '0.88rem' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado Actual</th>
              <th style={{ textAlign: 'center' }}>Control Disponibilidad</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const isAvail = p.available !== false && (p.stock === undefined || p.stock > 0);
              return (
                <tr key={p.id} style={{ opacity: isAvail ? 1 : 0.75 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={(e) => { e.target.src = '/logo-jvcats.png'; }}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          objectFit: 'contain',
                          background: '#f8fafc',
                          border: '1px solid var(--jv-border)'
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</div>
                        {p.weight && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--jv-text-light)' }}>
                            {p.weight}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{p.category}</span>
                  </td>
                  <td style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatCOP(p.price)}</td>
                  <td>
                    <span className={`product-status-tag ${isAvail ? 'status-available' : 'status-unavailable'}`} style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
                      <span className="status-dot" />
                      {isAvail ? 'Disponible' : 'No disponible'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleToggle(p)}
                      className={`btn btn-sm ${isAvail ? 'btn-outline-danger' : 'btn-success'}`}
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        borderRadius: 100,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      title={isAvail ? 'Hacer clic para marcar como No disponible' : 'Hacer clic para marcar como Disponible'}
                    >
                      {isAvail ? 'Marcar No disponible' : '✓ Habilitar Disponible'}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: 'var(--jv-text-light)' }}>
                  No se encontraron productos con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {toast && <div className="toast success">{toast}</div>}
    </div>
  );
}
