import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="empty-state animate-slideUp">
        <img src="/logo-jvcats.png" alt="JV Cats" style={{ width: 120, margin: '0 auto 16px', opacity: 0.8 }} />
        <h3 style={{ fontSize: '2rem' }}>404</h3>
        <p style={{ fontSize: '1.05rem' }}>Esta página no existe o ha sido movida</p>
        <Link to="/" className="btn btn-primary btn-lg" style={{ marginTop: 16 }}>Volver al Inicio</Link>
      </div>
    </div>
  );
}
