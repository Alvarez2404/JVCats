import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCOP } from '../utils/formatters';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <Link to={`/producto/${product.id}`}>
        <div className="product-image-wrapper">
          {product.featured && <span className="product-badge">Destacado</span>}
          {product.stock <= 0 && (
            <span className="product-badge" style={{ background: '#EF4444' }}>Agotado</span>
          )}
          <img src={product.image} alt={product.name}
            onError={(e) => { e.target.src = 'https://jvcats.com/wp-content/uploads/2022/03/logo-blanco-copia-300x300.png'; }} />
          {product.stock > 0 && (
            <div className="product-quick-add">
              <button className="btn btn-accent btn-sm" onClick={(e) => { e.preventDefault(); addToCart(product); }}>
                Agregar
              </button>
            </div>
          )}
        </div>
      </Link>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <Link to={`/producto/${product.id}`}>
          <div className="product-name">{product.name}</div>
        </Link>
        <div className="product-price">{formatCOP(product.price)}</div>
        <div className="product-weight">{product.weight}</div>
      </div>
    </div>
  );
}
