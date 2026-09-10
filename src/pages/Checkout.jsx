import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { formatCOP } from '../utils/formatters';
import { openWompiCheckout, getWompiConfig, generateWompiReference, formatWompiPaymentMethod } from '../services/wompiService';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, updateUserPurchases } = useAuth();
  const { createOrder } = useStore();
  const navigate = useNavigate();

  const [payMethod, setPayMethod] = useState('wompi'); // 'wompi' default
  const [wompiSubMethod, setWompiSubMethod] = useState('todos'); // 'todos', 'nequi', 'pse', 'card', 'bancolombia'
  const [step, setStep] = useState(1); // 1=shipping, 2=payment, 3=confirm
  const [shipping, setShipping] = useState({
    address: user?.address || '',
    city: user?.city || '',
    phone: user?.phone || ''
  });
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [orderComplete, setOrderComplete] = useState(null);
  const [wompiConfig, setWompiConfig] = useState(getWompiConfig());

  useEffect(() => {
    setWompiConfig(getWompiConfig());
  }, []);

  const shippingCost = cartTotal > 100000 ? 0 : 12000;
  const total = cartTotal + shippingCost;

  if (!user) {
    return (
      <div className="container page-section">
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
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
          <div className="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h3>Tu carrito está vacío</h3>
          <Link to="/tienda" className="btn btn-primary">Ir a la Tienda</Link>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    const isPending = orderComplete.status === 'pendiente_pago';
    return (
      <div className="container page-section">
        <div className="empty-state animate-slideUp">
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: isPending ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: isPending ? '#f59e0b' : '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '2rem'
          }}>
            {isPending ? '⏳' : '✓'}
          </div>

          <h3 style={{ fontSize: '1.6rem' }}>
            {isPending ? '¡Pago en Proceso de Verificación!' : '¡Pedido y Pago Confirmados!'}
          </h3>
          <p style={{ maxWidth: 460, margin: '8px auto 24px', color: 'var(--jv-text-secondary)', lineHeight: 1.6 }}>
            {isPending
              ? `Tu transacción con Wompi está siendo procesada por tu banco. Hemos registrado tu pedido `
              : `¡Muchas gracias por tu compra! Tu pedido `}
            <strong>{orderComplete.id}</strong> ha sido recibido con éxito.
          </p>

          <div className="summary-card" style={{ maxWidth: 440, margin: '0 auto 24px', textAlign: 'left' }}>
            <div className="summary-item">
              <span>Referencia Pedido</span>
              <span style={{ fontWeight: 700 }}>{orderComplete.id}</span>
            </div>
            {orderComplete.wompiTransactionId && (
              <div className="summary-item">
                <span>ID Transacción Wompi</span>
                <span style={{ fontWeight: 600, fontSize: '0.82rem', color: '#64748b' }}>{orderComplete.wompiTransactionId}</span>
              </div>
            )}
            <div className="summary-item">
              <span>Método de pago</span>
              <span style={{ fontWeight: 600, color: 'var(--jv-primary)' }}>{orderComplete.paymentMethod}</span>
            </div>
            <div className="summary-item">
              <span>Total</span>
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{formatCOP(orderComplete.total)}</span>
            </div>
            <div className="summary-item">
              <span>Estado</span>
              <span className={`badge ${isPending ? 'badge-warning' : 'badge-success'}`}>
                {isPending ? 'Pendiente de Validación' : 'Pago Aprobado (Wompi)'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/mis-pedidos" className="btn btn-primary">Ver Mis Pedidos</Link>
            <Link to="/tienda" className="btn btn-outline">Seguir Comprando</Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePayWithWompi = async () => {
    setPaymentError(null);
    setProcessing(true);

    const orderRef = generateWompiReference('JVC');

    await openWompiCheckout({
      total,
      orderReference: orderRef,
      customer: {
        name: user.name,
        email: user.email,
        phone: shipping.phone
      },
      shipping: {
        address: shipping.address,
        city: shipping.city,
        phone: shipping.phone
      },
      onSuccess: (result) => {
        const order = createOrder({
          id: orderRef,
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
          paymentMethod: result.paymentMethodName || 'Wompi Oficial (Bancolombia)',
          paymentMethodType: result.paymentMethod,
          wompiTransactionId: result.transactionId,
          wompiReference: result.reference,
          status: 'pagado',
          shippingAddress: `${shipping.address}, ${shipping.city}`
        });

        updateUserPurchases(user.id, total);
        clearCart();
        setProcessing(false);
        setOrderComplete(order);
      },
      onPending: (result) => {
        const order = createOrder({
          id: orderRef,
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
          paymentMethod: result.paymentMethodName || 'Wompi (En Proceso)',
          paymentMethodType: result.paymentMethod,
          wompiTransactionId: result.transactionId,
          wompiReference: result.reference,
          status: 'pendiente_pago',
          shippingAddress: `${shipping.address}, ${shipping.city}`
        });

        clearCart();
        setProcessing(false);
        setOrderComplete(order);
      },
      onDeclined: (result) => {
        setProcessing(false);
        setPaymentError(result.statusMessage || 'Transacción declinada por la entidad financiera. Por favor verifica tus fondos o utiliza otro medio de pago.');
      },
      onError: (result) => {
        setProcessing(false);
        setPaymentError(result.statusMessage || result.message || 'Ocurrió un error al procesar la transacción con Wompi. Por favor intenta de nuevo.');
      },
      onClose: () => {
        setProcessing(false);
      }
    });
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
            <span className="step-number">{step > 2 ? '✓' : '2'}</span>Pago Wompi
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
                    placeholder="Ej: Bogotá, Medellín, Cali..." />
                </div>
                <div className="form-group">
                  <label>Teléfono de contacto</label>
                  <input className="form-input" value={shipping.phone}
                    onChange={e => setShipping({ ...shipping, phone: e.target.value })}
                    placeholder="300 123 4567" />
                </div>
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }}
                disabled={!shipping.address || !shipping.city || !shipping.phone}
                onClick={() => setStep(2)}>
                Continuar al Pago →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="card card-body animate-fadeIn">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3>Métodos de Pago Oficiales</h3>
                {wompiConfig.isSandbox && (
                  <span className="badge badge-warning" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                    MODO PRUEBAS (SANDBOX)
                  </span>
                )}
              </div>

              {/* Main Wompi Featured Card */}
              <div
                className={`payment-wompi-card ${payMethod === 'wompi' ? 'selected' : ''}`}
                onClick={() => setPayMethod('wompi')}
              >
                <div className="pwc-header">
                  <div className="pwc-title-row">
                    <span className="pwc-radio" />
                    <div>
                      <h4 className="pwc-title">Pasarela Segura Wompi (Bancolombia)</h4>
                      <p className="pwc-sub">Paga de forma rápida y 100% protegida con cualquiera de estos medios:</p>
                    </div>
                  </div>
                  <span className="pwc-bancolombia-badge">Grupo Bancolombia</span>
                </div>

                {/* Badges of accepted Colombian payment methods */}
                <div className="pwc-methods-grid">
                  <div className="pwc-pill">
                    <span className="pwc-dot pwc-dot--nequi" />
                    <strong>Nequi</strong>
                    <small>Push directo</small>
                  </div>
                  <div className="pwc-pill">
                    <span className="pwc-dot pwc-dot--pse" />
                    <strong>PSE</strong>
                    <small>Todos los bancos</small>
                  </div>
                  <div className="pwc-pill">
                    <span className="pwc-dot pwc-dot--card" />
                    <strong>Tarjetas</strong>
                    <small>Crédito / Débito</small>
                  </div>
                  <div className="pwc-pill">
                    <span className="pwc-dot pwc-dot--bancolombia" />
                    <strong>Bancolombia</strong>
                    <small>Botón / QR</small>
                  </div>
                </div>

                <div className="pwc-security-banner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span>Certificación PCI-DSS Nivel 1 • Encriptación SSL 256-bit • Avalado por Bancolombia</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Volver a Envío</button>
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }}
                  onClick={() => setStep(3)}>
                  Revisar y Pagar →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm & Pay with Wompi */}
          {step === 3 && (
            <div className="card card-body animate-fadeIn">
              <h3 style={{ marginBottom: 20 }}>Confirmar Pedido</h3>

              {paymentError && (
                <div className="alert alert-danger" style={{ marginBottom: 20, padding: 14, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                  <div style={{ flex: 1, fontSize: '0.88rem' }}>{paymentError}</div>
                  <button className="btn btn-sm btn-outline" onClick={() => setPaymentError(null)}>Cerrar</button>
                </div>
              )}

              <div style={{ marginBottom: 20, padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--jv-text-secondary)', marginBottom: 8 }}>
                  Enviar pedido a:
                </h4>
                <p style={{ fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{shipping.address}, {shipping.city}</p>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Teléfono de contacto: {shipping.phone}</p>
              </div>

              <div style={{ marginBottom: 20, padding: 16, background: '#fff9f0', borderRadius: 12, border: '1px solid rgba(242, 112, 37, 0.2)' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--jv-primary)', marginBottom: 8 }}>
                  Pasarela de pago seleccionada:
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>Wompi Colombia (Bancolombia)</strong>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 20px' }}>
                  Al presionar el botón se abrirá el modal seguro de Wompi para que elijas entre Nequi, PSE, Tarjeta o Bancolombia.
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--jv-text-secondary)', marginBottom: 12 }}>
                  Detalle de Artículos:
                </h4>
                {cart.map(item => (
                  <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--jv-border-light)' }}>
                    <div>
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                      <span style={{ fontSize: '0.82rem', color: '#64748b', marginLeft: 8 }}>× {item.quantity}</span>
                    </div>
                    <span style={{ fontWeight: 600 }}>{formatCOP(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-outline" onClick={() => setStep(2)} disabled={processing}>
                  ← Atrás
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    background: 'linear-gradient(135deg, #e50601 0%, #d9480f 100%)',
                    boxShadow: '0 8px 24px rgba(229, 6, 1, 0.35)'
                  }}
                  onClick={handlePayWithWompi}
                  disabled={processing}
                >
                  {processing ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Abriendo Wompi...
                    </span>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      Pagar con Wompi • {formatCOP(total)}
                    </>
                  )}
                </button>
              </div>

              {wompiConfig.isSandbox && (
                <div style={{ marginTop: 16, padding: '10px 14px', background: '#f8fafc', borderRadius: 8, fontSize: '0.78rem', color: '#64748b', textAlign: 'center' }}>
                  💡 <strong>Tip de Pruebas:</strong> En el modal de Wompi puedes usar la tarjeta de prueba <code>4242 4242 4242 4242</code> (CVV 123, fecha futura) o tu celular en Nequi sandbox.
                </div>
              )}
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
