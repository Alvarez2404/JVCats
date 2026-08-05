import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCOP } from '../utils/formatters';

export default function CartSidebar({ onClose }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const shipping = cartTotal > 100000 ? 0 : 12000;

  return (
    <>
      <div className="cart-sidebar-overlay" onClick={onClose} />
      <div className="cart-sidebar">
        <div className="cart-sidebar-header">
          <h3 style={{ fontFamily: 'var(--jv-font-heading)', fontSize: '1.1rem' }}>
            Carrito ({cartCount})
          </h3>
          <button onClick={onClose} style={{ fontSize: '1.3rem', color: '#64748b' }}>✕</button>
        </div>

        <div className="cart-sidebar-body">
          {cart.length === 0 ? (
            <div className="empty-state" style={{ padding: '48px 16px' }}>
              <div className="empty-icon"></div>
              <h3>Tu carrito está vacío</h3>

              <p>Agrega productos para empezar</p>
              <button className="btn btn-primary btn-sm" onClick={() => { navigate('/tienda'); onClose(); }}>
                Ver Tienda
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">{formatCOP(item.price * item.quantity)}</div>
                  <div className="cart-qty-control">
                    <button className="cart-qty-btn" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                    <span className="cart-qty-value">{item.quantity}</span>
                    <button className="cart-qty-btn" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                    <button onClick={() => removeFromCart(item.productId)}
                      style={{ marginLeft: 'auto', color: '#EF4444', fontSize: '0.8rem', fontWeight: 600 }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-sidebar-footer">
            <div className="summary-item">
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatCOP(cartTotal)}</span>
            </div>
            <div className="summary-item">
              <span>Envío</span>
              <span style={{ fontWeight: 600, color: shipping === 0 ? '#10B981' : 'inherit' }}>
                {shipping === 0 ? '¡Gratis!' : formatCOP(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                Envío gratis en compras superiores a $100.000
              </p>
            )}
            <div className="summary-total">
              <span>Total</span>
              <span>{formatCOP(cartTotal + shipping)}</span>
            </div>
            <button className="btn btn-accent" style={{ width: '100%', marginTop: 16 }}
              onClick={() => { navigate('/checkout'); onClose(); }}>
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </>
  );
}
