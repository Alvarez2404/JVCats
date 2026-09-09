import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCOP, calcMargin } from '../../utils/formatters';

export default function Products() {
  const { getProducts, updateProduct } = useStore();
  const [products, setProducts] = useState(getProducts());
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (product) => {
    setEditing(product.id);
    setForm({ ...product });
  };

  const saveEdit = () => {
    const updated = updateProduct(editing, {
      name: form.name,
      price: Number(form.price),
      cost: Number(form.cost),
      stock: Number(form.stock),
      minStock: Number(form.minStock),
      category: form.category,
      subcategory: form.subcategory,
      description: form.description,
      image: form.image,
      weight: form.weight
    });
    setProducts(updated);
    setEditing(null);
    setToast('Producto actualizado correctamente');
    setTimeout(() => setToast(''), 2500);
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({});
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Gestión de Productos</h1>
      </div>

      {/* Search */}
      <div className="store-search" style={{ marginBottom: 20, maxWidth: 400 }}>
        <input type="text" placeholder="Buscar producto..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '16px' }} />
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="modal-overlay" onClick={cancelEdit}>
          <div className="modal-content" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Producto</h3>
              <button className="modal-close" onClick={cancelEdit}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Imagen (URL)</label>
                <input className="form-input" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                {form.image && <img src={form.image} alt="Preview" style={{ height: 80, marginTop: 8, objectFit: 'contain' }} />}
              </div>
              <div className="form-group">
                <label>Nombre</label>
                <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Categoría</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="Arenas">Arenas</option>
                    <option value="Comida">Comida</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Peso/Presentación</label>
                  <input className="form-input" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
                </div>
              </div>
              <div className="grid-3">
                <div className="form-group">
                  <label>Precio de Venta (COP)</label>
                  <input className="form-input" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Costo (COP)</label>
                  <input className="form-input" type="number" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Margen</label>
                  <div style={{ padding: '12px 16px', background: 'var(--jv-bg)', borderRadius: 12, fontWeight: 700, color: 'var(--jv-success)', fontSize: '1.1rem', textAlign: 'center' }}>
                    {calcMargin(Number(form.price), Number(form.cost))}%
                  </div>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Stock</label>
                  <input className="form-input" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Stock Mínimo</label>
                  <input className="form-input" type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea className="form-input" rows={3} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={cancelEdit}>Cancelar</button>
                <button className="btn btn-primary" onClick={saveEdit}>Guardar Cambios</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Costo</th>
              <th>Margen</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={p.image} alt={p.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'contain', background: '#f8fafc' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--jv-text-light)' }}>{p.weight}</div>
                    </div>
                  </div>
                </td>
                <td><span className="badge badge-primary">{p.category}</span></td>
                <td style={{ fontWeight: 700 }}>{formatCOP(p.price)}</td>
                <td style={{ color: 'var(--jv-text-secondary)' }}>{formatCOP(p.cost)}</td>
                <td>
                  <span style={{ fontWeight: 700, color: 'var(--jv-success)' }}>{calcMargin(p.price, p.cost)}%</span>
                </td>
                <td>
                  <span className={`badge ${p.stock === 0 ? 'badge-danger' : p.stock <= p.minStock ? 'badge-warning' : 'badge-success'}`}>
                    {p.stock}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline" onClick={() => startEdit(p)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && <div className="toast success">{toast}</div>}
    </div>
  );
}

