import { useState, useEffect } from 'react';

const STORAGE_KEY = 'jvCatsLaTiendaModalSeen';

export default function ComingSoonModal() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      // Small delay so the page loads first
      const t = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(STORAGE_KEY, '1');
    }, 450);
  };

  if (!visible) return null;

  return (
    <div
      className={`cs-overlay ${closing ? 'cs-overlay--closing' : ''}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Próximamente – JV Cats La Tienda"
    >
      <div
        className={`cs-modal ${closing ? 'cs-modal--closing' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative circles */}
        <div className="cs-circle cs-circle--1" />
        <div className="cs-circle cs-circle--2" />

        <img
          src="/logo-jvcats.png"
          alt="JV Cats La Tienda"
          className="cs-logo"
        />

        <div className="cs-badge">Distribuidor Autorizado Online</div>

        <h1 className="cs-title">¡Muy pronto estamos listos!</h1>

        <p className="cs-subtitle">
          Estamos trabajando para traerte la mejor experiencia de compra.<br />
          <strong>Arena premium, alimentos y snacks</strong> para tu gato,<br />
          directo a la puerta de tu hogar.
        </p>

        <div className="cs-socials">
          <a
            href="https://www.instagram.com/jvcatslatienda/"
            target="_blank"
            rel="noreferrer"
            className="cs-social-btn cs-social-btn--ig"
            aria-label="Instagram @jvcatslatienda"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            @jvcatslatienda
          </a>
          <a
            href="https://www.facebook.com/share/1Gzwkh2ueM/?mibextid=wwXIfr"
            target="_blank"
            rel="noreferrer"
            className="cs-social-btn cs-social-btn--fb"
            aria-label="Facebook jvcatslatienda"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
            jvcatslatienda
          </a>
        </div>

        <button className="cs-btn" onClick={handleClose} id="cs-enter-btn">
          Entrar a la Tienda
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }}>
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        <p className="cs-dismiss">o haz clic fuera para explorar</p>
      </div>
    </div>
  );
}
