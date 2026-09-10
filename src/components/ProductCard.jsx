import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCOP } from '../utils/formatters';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const isAvailable = product.available !== false && (product.stock === undefined || product.stock > 0);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className={`product-card ${!isAvailable ? 'card-unavailable' : ''}`}>
      <Link to={`/producto/${product.id}`} className="product-image-link">
        <div className="product-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => { e.target.src = '/logo-jvcats.png'; }}
          />
          {product.featured && <span className="product-badge">Destacado</span>}
          
          <span className={`product-status-tag ${isAvailable ? 'status-available' : 'status-unavailable'}`}>
            <span className="status-dot" />
            {isAvailable ? 'Disponible' : 'No disponible'}
          </span>
        </div>
      </Link>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <Link to={`/producto/${product.id}`} className="product-name-link">
          <div className="product-name" title={product.name}>{product.name}</div>
        </Link>
        
        <div className="product-price-row">
          <div className="product-price-col">
            <div className="product-price">{formatCOP(product.price)}</div>
            {product.weight && <div className="product-weight">{product.weight}</div>}
          </div>

          {isAvailable ? (
            <button
              className={`product-add-btn ${added ? 'is-added' : ''}`}
              id={`add-btn-${product.id}`}
              onClick={handleAddToCart}
              aria-label={`Agregar ${product.name} al carrito`}
            >
              {added ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>¡Listo!</span>
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <span>Agregar</span>
                </>
              )}
            </button>
          ) : (
            <button
              className="product-add-btn is-unavailable"
              disabled
              aria-label={`${product.name} no disponible`}
              title="Producto no disponible actualmente"
            >
              <span>No disponible</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
