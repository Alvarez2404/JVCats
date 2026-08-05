import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="empty-state animate-slideUp">
        <div style={{ fontSize: '6rem', marginBottom: 16, opacity: 0.3 }}>🐱</div>
        <h3 style={{ fontSize: '2rem' }}>404</h3>
        <p style={{ fontSize: '1.05rem' }}>¡Ups! Esta página no existe</p>
        <Link to="/" className="btn btn-primary btn-lg" style={{ marginTop: 16 }}>Volver al Inicio</Link>
      </div>
    </div>
  );
}
