import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid-4" style={{ gap: '40px' }}>
          <div>
            <img src="https://jvcats.com/wp-content/uploads/2022/03/LOGO-JVC-1-1.png" alt="JV Cats"
              style={{ height: 42, filter: 'brightness(0) invert(1)', marginBottom: 16 }} />
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7 }}>
              Tu mascota merece lo mejor, nosotros lo creamos. Productos premium para gatos en Colombia.
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
              <a href="mailto:contacto@jvcats.com">Email: contacto@jvcats.com</a>
              <a href="https://www.instagram.com/jvcats_agricola/" target="_blank" rel="noreferrer">Instagram: @jvcats_agricola</a>
              <a href="https://www.facebook.com/people/Jvcats/100063583298653/" target="_blank" rel="noreferrer">Facebook</a>
            </div>
          </div>

        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} JV Cats Colombia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
