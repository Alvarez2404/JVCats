import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { formatCOP } from '../utils/formatters';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { getProducts } = useStore();
  const { addToCart } = useCart();
  const products = getProducts();
  const product = products.find(p => p.id === Number(id));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="container page-section">
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3>Producto no encontrado</h3>
          <Link to="/tienda" className="btn btn-primary">Volver a la Tienda</Link>
        </div>
      </div>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container">
      {/* Breadcrumb */}
      <div style={{ padding: '20px 0', fontSize: '0.85rem', color: 'var(--jv-text-secondary)' }}>
        <Link to="/" style={{ color: 'var(--jv-text-secondary)' }}>Inicio</Link> /
        <Link to="/tienda" style={{ color: 'var(--jv-text-secondary)', margin: '0 6px' }}>Tienda</Link> /
        <Link to={`/tienda?cat=${product.category}`} style={{ color: 'var(--jv-text-secondary)', margin: '0 6px' }}>{product.category}</Link> /
        <span style={{ color: 'var(--jv-text)', fontWeight: 600 }}> {product.name}</span>
      </div>

      <div className="product-detail">
        <div className="product-detail-image animate-fadeIn">
          <img src={product.image} alt={product.name}
            onError={(e) => { e.target.src = '/logo-jvcats.png'; }} />
        </div>
        <div className="product-detail-info animate-slideUp">
          <span className="badge badge-primary" style={{ marginBottom: 12 }}>{product.category}</span>
          <h1>{product.name}</h1>
          <p style={{ color: 'var(--jv-text-secondary)', fontSize: '0.85rem', marginBottom: 4 }}>{product.weight}</p>
          <div className="product-detail-price">{formatCOP(product.price)}</div>

          <p style={{ color: 'var(--jv-text-secondary)', lineHeight: 1.8, marginBottom: 24, fontSize: '0.95rem' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.85rem', color: product.stock > 0 ? 'var(--jv-success)' : 'var(--jv-danger)', fontWeight: 600 }}>
              {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
            </span>
          </div>

          {product.stock > 0 && (
            <>
              <div className="qty-selector">
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--jv-text-secondary)' }}>Cantidad:</span>
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="qty-value">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn btn-accent btn-lg" onClick={handleAdd} style={{ flex: 1 }}>
                  {added ? '¡Agregado!' : 'Agregar al Carrito'}
                </button>
                <Link to="/checkout" className="btn btn-primary btn-lg" onClick={() => addToCart(product, qty)} style={{ flex: 1 }}>
                  Comprar Ahora
                </Link>
              </div>
            </>
          )}

          {/* Extra Info */}
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { text: 'Envío gratis en compras superiores a $100.000' },
              { text: 'Pago seguro con Nequi o PSE' },
              { text: 'Envíos a todo Colombia' }
            ].map((info, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'var(--jv-text-secondary)' }}>
                {info.text}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="page-section">
          <div className="section-header">
            <h2>Productos Relacionados</h2>
            <div className="accent-line" />
          </div>
          <div className="products-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Toast */}
      {added && <div className="toast success">Producto agregado al carrito</div>}
    </div>
  );
}
