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
              Distribuidor autorizado online de JVCats. Productos premium para gatos en Colombia.
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
            <h4>Contacto</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="tel:3182164552">Teléfono: 318 216 4552</a>
              <a href="mailto:contacto@jvcatslatienda.com">contacto@jvcatslatienda.com</a>
              <a href="https://www.instagram.com/jvcatslatienda/" target="_blank" rel="noreferrer">Instagram: @jvcatslatienda</a>
              <a href="https://www.facebook.com/jvcatslatienda" target="_blank" rel="noreferrer">Facebook: jvcatslatienda</a>
            </div>
          </div>

        </div>
        <div className="footer-bottom" style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
          <p>© {new Date().getFullYear()} JV Cats La Tienda – Distribuidor Autorizado. Todos los derechos reservados.</p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            Desarrollada y creada por{' '}
            <a 
              href="https://smartlitcompany.com" 
              target="_blank" 
              rel="noreferrer"
              style={{ color: 'var(--jv-accent)', fontWeight: 600, textDecoration: 'underline' }}
            >
              smartlitcompany.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

