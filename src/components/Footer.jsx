import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid-4" style={{ gap: '40px' }}>
          <div>
            <img src="/logo-jvcats.png" alt="JV Cats La Tienda"
              style={{ height: 72, marginBottom: 16 }} />

            <p style={{ fontSize: '0.88rem', lineHeight: 1.7 }}>
              La tienda oficial de productos premium para gatos en Colombia.
              Directo a la puerta de tu hogar.
            </p>
          </div>
          <div>
            <h4>Tienda</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/tienda?cat=Arenas">Arenas Sanitarias</Link>
              <Link to="/tienda?cat=Comida">Alimentos</Link>
              <Link to="/tienda">Todos los Productos</Link>
            </div>
          </div>
          <div>
            <h4>Mi Cuenta</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/login">Iniciar Sesión</Link>
              <Link to="/register">Crear Cuenta</Link>
              <Link to="/mis-pedidos">Mis Pedidos</Link>
            </div>
          </div>
          <div>
            <h4>Contacto y Redes</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="tel:3182164552" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'inherit', textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--jv-primary)', flexShrink: 0 }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>Tel: 318 216 4552</span>
              </a>
              <a href="mailto:contacto@jvcats.com" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'inherit', textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--jv-primary)', flexShrink: 0 }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Email: contacto@jvcats.com</span>
              </a>
              <a href="https://www.instagram.com/jvcatslatienda/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'inherit', textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--jv-primary)', flexShrink: 0 }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>Instagram: @jvcatslatienda</span>
              </a>
              <a href="https://www.facebook.com/share/1Gzwkh2ueM/?mibextid=wwXIfr" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'inherit', textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--jv-primary)', flexShrink: 0 }}>
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span>Facebook: jvcatslatienda</span>
              </a>
            </div>
          </div>

        </div>
        <div className="footer-bottom" style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
          <p>© {new Date().getFullYear()} JV Cats La Tienda. Todos los derechos reservados.</p>
          <p className="footer-credits">
            Desarrollada y creada por{' '}
            <a 
              href="https://smartlitcompany.com" 
              target="_blank" 
              rel="noreferrer"
              style={{ color: 'var(--jv-primary)', fontWeight: 600, textDecoration: 'underline' }}
            >
              smartlitcompany.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

