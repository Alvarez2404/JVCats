import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { formatCOP } from '../utils/formatters';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, updateUserPurchases } = useAuth();
  const { createOrder } = useStore();
  const navigate = useNavigate();

  const [payMethod, setPayMethod] = useState('');
  const [step, setStep] = useState(1); // 1=shipping, 2=payment, 3=confirm
  const [shipping, setShipping] = useState({
    address: user?.address || '',
    city: user?.city || '',
    phone: user?.phone || ''
  });
  const [payData, setPayData] = useState({ nequiPhone: '', bank: '' });
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const shippingCost = cartTotal > 100000 ? 0 : 12000;
  const total = cartTotal + shippingCost;

  if (!user) {
    return (
      <div className="container page-section">
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <h3>Inicia sesión para continuar</h3>
          <p>Necesitas una cuenta para realizar tu compra</p>
          <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="container page-section">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Tu carrito está vacío</h3>
          <Link to="/tienda" className="btn btn-primary">Ir a la Tienda</Link>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="container page-section">
        <div className="empty-state animate-slideUp">
          <h3 style={{ fontSize: '1.5rem' }}>¡Pedido Confirmado!</h3>
          <p style={{ maxWidth: 400, margin: '8px auto 24px' }}>
            Tu pedido <strong>{orderComplete.id}</strong> ha sido recibido. Te notificaremos cuando sea enviado.
          </p>
          <div className="summary-card" style={{ maxWidth: 400, margin: '0 auto 24px', textAlign: 'left' }}>
            <div className="summary-item"><span>Método de pago</span><span style={{ fontWeight: 600 }}>{orderComplete.paymentMethod}</span></div>
            <div className="summary-item"><span>Total pagado</span><span style={{ fontWeight: 600 }}>{formatCOP(orderComplete.total)}</span></div>
            <div className="summary-item"><span>Estado</span><span className="badge badge-warning">Pago Recibido</span></div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/mis-pedidos" className="btn btn-primary">Ver Mis Pedidos</Link>
            <Link to="/tienda" className="btn btn-outline">Seguir Comprando</Link>
          </div>
        </div>
      </div>
    );
  }


  const handleConfirm = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2500));

    const order = createOrder({
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: shipping.phone,
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal: cartTotal,
      shipping: shippingCost,
      total,
      paymentMethod: payMethod,
      shippingAddress: `${shipping.address}, ${shipping.city}`
    });

    updateUserPurchases(user.id, total);
    clearCart();
    setProcessing(false);
    setOrderComplete(order);
  };

  return (
    <div className="container">
      <div style={{ padding: '28px 0 12px' }}>
        <h1 style={{ fontFamily: 'var(--jv-font-heading)', fontSize: '1.6rem', marginBottom: 24 }}>Finalizar Compra</h1>

        {/* Progress */}
        <div className="process-steps">
          <div className={`process-step ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`}>
            <span className="step-number">{step > 1 ? '✓' : '1'}</span>Envío
          </div>
          <div className={`process-connector ${step > 1 ? 'done' : ''}`} />
          <div className={`process-step ${step >= 2 ? (step > 2 ? 'done' : 'active') : ''}`}>
            <span className="step-number">{step > 2 ? '✓' : '2'}</span>Pago
          </div>
          <div className={`process-connector ${step > 2 ? 'done' : ''}`} />
          <div className={`process-step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>Confirmar
          </div>
        </div>
      </div>

      <div className="checkout-layout" style={{ paddingTop: 0 }}>
        <div>
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="card card-body animate-fadeIn">
              <h3 style={{ marginBottom: 20 }}>Datos de Envío</h3>
              <div className="form-group">
                <label>Dirección completa</label>
                <input className="form-input" value={shipping.address}
                  onChange={e => setShipping({ ...shipping, address: e.target.value })}
                  placeholder="Cra/Calle #Num, Apto/Casa" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Ciudad</label>
                  <input className="form-input" value={shipping.city}
                    onChange={e => setShipping({ ...shipping, city: e.target.value })}
                    placeholder="Ej: Bogotá" />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input className="form-input" value={shipping.phone}
                    onChange={e => setShipping({ ...shipping, phone: e.target.value })}
                    placeholder="300 123 4567" />
                </div>
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }}
                disabled={!shipping.address || !shipping.city || !shipping.phone}
                onClick={() => setStep(2)}>
                Continuar al Pago
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="card card-body animate-fadeIn">
              <h3 style={{ marginBottom: 20 }}>Método de Pago</h3>
              <div className="payment-methods">
                <div className={`payment-option ${payMethod === 'Nequi' ? 'selected' : ''}`}
                  onClick={() => setPayMethod('Nequi')}>
                  <div className="pay-name">Nequi</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--jv-text-secondary)', marginTop: 4 }}>Paga desde tu celular</div>
                </div>
                <div className={`payment-option ${payMethod === 'PSE' ? 'selected' : ''}`}
                  onClick={() => setPayMethod('PSE')}>
                  <div className="pay-name">PSE</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--jv-text-secondary)', marginTop: 4 }}>Débito bancario</div>
                </div>
              </div>

              {payMethod === 'Nequi' && (
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label>Número Nequi</label>
                  <input className="form-input" value={payData.nequiPhone}
                    onChange={e => setPayData({ ...payData, nequiPhone: e.target.value })}
                    placeholder="Ingresa tu número Nequi" maxLength={10} />
                </div>
              )}

              {payMethod === 'PSE' && (
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label>Selecciona tu Banco</label>
                  <select className="form-select" value={payData.bank}
                    onChange={e => setPayData({ ...payData, bank: e.target.value })}>
                    <option value="">Seleccionar banco...</option>
                    <option value="bancolombia">Bancolombia</option>
                    <option value="davivienda">Davivienda</option>
                    <option value="bbva">BBVA</option>
                    <option value="nequi-pse">Nequi</option>
                    <option value="banco-bogota">Banco de Bogotá</option>
                    <option value="banco-occidente">Banco de Occidente</option>
                    <option value="scotiabank">Scotiabank Colpatria</option>
                    <option value="itau">Itaú</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>Atrás</button>
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }}
                  disabled={!payMethod || (payMethod === 'Nequi' && !payData.nequiPhone) || (payMethod === 'PSE' && !payData.bank)}
                  onClick={() => setStep(3)}>
                  Revisar Pedido
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="card card-body animate-fadeIn">
              <h3 style={{ marginBottom: 20 }}>Confirmar Pedido</h3>


              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '0.9rem', fontFamily: 'var(--jv-font-body)', color: 'var(--jv-text-secondary)', marginBottom: 8 }}>Enviar a:</h4>
                <p style={{ fontWeight: 600 }}>{shipping.address}, {shipping.city}</p>
                <p style={{ fontSize: '0.88rem', color: 'var(--jv-text-secondary)' }}>Tel: {shipping.phone}</p>
              </div>

              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '0.9rem', fontFamily: 'var(--jv-font-body)', color: 'var(--jv-text-secondary)', marginBottom: 8 }}>Pago:</h4>
                <p style={{ fontWeight: 600 }}>{payMethod} {payMethod === 'Nequi' ? `(${payData.nequiPhone})` : `(${payData.bank})`}</p>
              </div>

              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '0.9rem', fontFamily: 'var(--jv-font-body)', color: 'var(--jv-text-secondary)', marginBottom: 8 }}>Productos:</h4>
                {cart.map(item => (
                  <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--jv-border-light)' }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>{formatCOP(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-outline" onClick={() => setStep(2)} disabled={processing}>Atrás</button>
                <button className="btn btn-accent btn-lg" style={{ flex: 1 }}
                  onClick={handleConfirm} disabled={processing}>
                  {processing ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Procesando pago...
                    </span>
                  ) : (
                    `Pagar ${formatCOP(total)}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>


        {/* Order Summary */}
        <div className="checkout-summary">
          <div className="summary-card">
            <h3 style={{ fontSize: '1rem', marginBottom: 16, fontFamily: 'var(--jv-font-heading)' }}>Resumen del Pedido</h3>
            {cart.map(item => (
              <div key={item.productId} className="summary-item">
                <span style={{ flex: 1 }}>{item.name} × {item.quantity}</span>
                <span style={{ fontWeight: 600, marginLeft: 8 }}>{formatCOP(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="summary-item" style={{ borderTop: '1px solid var(--jv-border-light)', paddingTop: 12, marginTop: 8 }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatCOP(cartTotal)}</span>
            </div>
            <div className="summary-item">
              <span>Envío</span>
              <span style={{ fontWeight: 600, color: shippingCost === 0 ? 'var(--jv-success)' : 'inherit' }}>
                {shippingCost === 0 ? '¡Gratis!' : formatCOP(shippingCost)}
              </span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{formatCOP(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
