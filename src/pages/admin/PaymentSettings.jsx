import { useState, useEffect } from 'react';
import { getWompiConfig, saveWompiConfig, DEFAULT_WOMPI_TEST_KEY } from '../../services/wompiService';

export default function PaymentSettings() {
  const [config, setConfig] = useState(getWompiConfig());
  const [showSecret, setShowSecret] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setConfig(getWompiConfig());
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = saveWompiConfig(config);
    setConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleResetSandbox = () => {
    const defaultCfg = {
      isSandbox: true,
      publicKey: DEFAULT_WOMPI_TEST_KEY,
      integritySecret: ''
    };
    saveWompiConfig(defaultCfg);
    setConfig(getWompiConfig());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="admin-page animate-fadeIn">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Configuración de Pagos (Wompi)</h1>
          <p className="admin-subtitle">
            Administra las credenciales de la pasarela oficial de Bancolombia para cobrar con Nequi, PSE y Tarjetas.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="alert alert-success animate-slideDown" style={{ marginBottom: 24 }}>
          ✓ <strong>Configuración guardada exitosamente.</strong> La tienda utilizará estas credenciales de Wompi de inmediato.
        </div>
      )}

      <div className="grid-2" style={{ gap: 28, alignItems: 'start' }}>
        {/* Left Column: Form Settings */}
        <div className="card card-body">
          <h3 style={{ fontSize: '1.2rem', marginBottom: 20 }}>Credenciales de Wompi Colombia</h3>

          <form onSubmit={handleSave}>
            {/* Mode Selector */}
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 700, marginBottom: 8, display: 'block' }}>Entorno de Operación</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div
                  className={`wompi-mode-card ${config.isSandbox ? 'selected' : ''}`}
                  onClick={() => setConfig({ ...config, isSandbox: true })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="pwc-dot pwc-dot--nequi" />
                    <strong>Modo Pruebas (Sandbox)</strong>
                  </div>
                  <small style={{ color: '#64748b' }}>Simula transacciones sin dinero real usando tarjetas de test.</small>
                </div>

                <div
                  className={`wompi-mode-card ${!config.isSandbox ? 'selected-prod' : ''}`}
                  onClick={() => setConfig({ ...config, isSandbox: false })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="pwc-dot pwc-dot--card" />
                    <strong>Modo Producción</strong>
                  </div>
                  <small style={{ color: '#64748b' }}>Cobra dinero real a cuentas bancarias y tarjetas en Colombia.</small>
                </div>
              </div>
            </div>

            {/* Public Key */}
            <div className="form-group" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontWeight: 600 }}>Llave Pública de Wompi (Public Key)</label>
                <span className="badge badge-outline" style={{ fontSize: '0.72rem' }}>Requerido</span>
              </div>
              <input
                className="form-input"
                type="text"
                value={config.publicKey}
                onChange={(e) => setConfig({ ...config, publicKey: e.target.value.trim() })}
                placeholder={config.isSandbox ? 'pub_test_...' : 'pub_prod_...'}
                required
              />
              <small style={{ color: '#64748b', marginTop: 4, display: 'block', fontSize: '0.8rem' }}>
                Encuéntrala en tu portal de <strong>Wompi.com ➔ Desarrolladores ➔ Llaves de API</strong>.
              </small>
            </div>

            {/* Integrity Secret */}
            <div className="form-group" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontWeight: 600 }}>Secreto de Integridad (SHA-256)</label>
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  style={{ background: 'none', border: 'none', color: 'var(--jv-primary)', fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  {showSecret ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <input
                className="form-input"
                type={showSecret ? 'text' : 'password'}
                value={config.integritySecret || ''}
                onChange={(e) => setConfig({ ...config, integritySecret: e.target.value.trim() })}
                placeholder={config.isSandbox ? 'test_integrity_...' : 'prod_integrity_...'}
              />
              <small style={{ color: '#64748b', marginTop: 4, display: 'block', fontSize: '0.8rem' }}>
                Firma automáticamente cada pedido con SHA-256 para evitar alteraciones en los montos de compra.
              </small>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Guardar Configuración Wompi
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleResetSandbox}
                title="Carga las llaves de prueba por defecto de Wompi"
              >
                Restablecer Sandbox
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Testing Guide & Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Status Box */}
          <div className="card card-body">
            <h4 style={{ fontSize: '1rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🛡️</span> Estado de la Pasarela
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Entorno:</span>
                <span className={`badge ${config.isSandbox ? 'badge-warning' : 'badge-success'}`}>
                  {config.isSandbox ? 'Sandbox (Pruebas)' : 'Producción En Vivo'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Firma de Integridad:</span>
                <span style={{ fontWeight: 600, color: config.integritySecret ? '#10b981' : '#f59e0b' }}>
                  {config.integritySecret ? '✓ Activa (SHA-256)' : 'Opcional'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: '#64748b' }}>Moneda Oficial:</span>
                <span style={{ fontWeight: 700 }}>COP ($ Pesos Colombianos)</span>
              </div>
            </div>
          </div>

          {/* Sandbox Testing Guide */}
          <div className="card card-body" style={{ background: '#f8fafc' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🧪</span> Guía de Pruebas (Sandbox Wompi)
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, marginBottom: 16 }}>
              Usa estos datos de prueba en el checkout cuando estés en <strong>Modo Pruebas</strong>:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: '10px 14px', background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '0.88rem', color: '#10b981', display: 'block', marginBottom: 4 }}>
                  💳 Tarjeta Aprobada (Visa):
                </strong>
                <code style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>4242 4242 4242 4242</code>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                  Fecha: Cualquiera futura (ej. 12/28) • CVV: 123 • Cuotas: 1
                </div>
              </div>

              <div style={{ padding: '10px 14px', background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '0.88rem', color: '#ef4444', display: 'block', marginBottom: 4 }}>
                  💳 Tarjeta Rechazada (Fondos Insuficientes):
                </strong>
                <code style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>4000 0000 0000 0002</code>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                  Simula rechazo por parte del banco emisor.
                </div>
              </div>

              <div style={{ padding: '10px 14px', background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '0.88rem', color: '#d9480f', display: 'block', marginBottom: 4 }}>
                  📱 Nequi Sandbox:
                </strong>
                <code style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>3991111111</code>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                  Código OTP de confirmación: <code>1111</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
