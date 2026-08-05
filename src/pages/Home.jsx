import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { getProducts } = useStore();
  const products = getProducts();
  const featured = products.filter(p => p.featured).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="animate-slideUp">
              <p style={{ color: 'var(--jv-accent)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                JV CATS COLOMBIA
              </p>
              <h1>Tu mascota merece <span>lo mejor</span>, nosotros lo creamos</h1>
              <p>
                Descubre nuestra línea de arenas sanitarias premium y alimentos de alta calidad para gatos.
                Compra online y recibe en la puerta de tu hogar.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/tienda" className="btn btn-accent btn-lg">
                  Comprar Ahora
                </Link>
                <Link to="/tienda?cat=Arenas" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                  Ver Catálogo
                </Link>
              </div>
              <div style={{ display: 'flex', gap: 32, marginTop: 32 }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--jv-font-heading)' }}>20+</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Productos</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--jv-font-heading)' }}>Colombia</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Envíos Nacionales</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--jv-font-heading)' }}>Calidad</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Premium</div>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <img src="https://jvcats.com/wp-content/uploads/2022/03/LOGO-JVC-1-1.png" alt="JV Cats"
                style={{ maxHeight: 320, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }} />
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="page-section">
        <div className="container">
          <div className="grid-3" style={{ gap: 32 }}>
            {[
              { icon: 'Envío', title: 'Envío a Todo Colombia', desc: 'Envío gratis en compras superiores a $100.000' },
              { icon: 'Pago', title: 'Pago Seguro Online', desc: 'Paga con Nequi o PSE de forma rápida y segura' },
              { icon: 'Calidad', title: 'Calidad Garantizada', desc: 'Productos premium con los mejores estándares' }
            ].map((f, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: 32, border: 'none', boxShadow: 'var(--jv-shadow-md)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--jv-accent)', marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: 6, fontFamily: 'var(--jv-font-heading)' }}>{f.title}</h3>
                <p style={{ color: 'var(--jv-text-secondary)', fontSize: '0.88rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Categories */}
      <section className="page-section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="section-header">
            <h2>Nuestras Categorías</h2>
            <p>Todo lo que tu gato necesita en un solo lugar</p>
            <div className="accent-line" />
          </div>
          <div className="grid-2" style={{ maxWidth: 700, margin: '0 auto' }}>
            <Link to="/tienda?cat=Arenas">
              <div className="category-card cat-arenas">
                <div className="cat-icon">Arenas</div>
                <h3>Arenas Sanitarias</h3>
                <p>16 variedades con aromas únicos</p>
              </div>
            </Link>
            <Link to="/tienda?cat=Comida">
              <div className="category-card cat-comida">
                <div className="cat-icon">Alimentos</div>
                <h3>Alimentos</h3>
                <p>Nuggets y snacks premium</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="page-section">
        <div className="container">
          <div className="section-header">
            <h2>Productos Destacados</h2>
            <p>Los favoritos de nuestros clientes</p>
            <div className="accent-line" />
          </div>
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/tienda" className="btn btn-primary btn-lg">
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="page-section" style={{ background: 'linear-gradient(135deg, var(--jv-primary-dark), var(--jv-primary))', color: '#fff' }}>
        <div className="container">
          <div className="section-header">
            <h2 style={{ color: '#fff' }}>Lo que dicen nuestros clientes</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Miles de gatos felices en Colombia</p>
            <div className="accent-line" />
          </div>
          <div className="grid-3">
            {[
              { name: 'María F.', city: 'Bogotá', text: 'Las arenas de JV Cats son las mejores que he probado. El aroma a lavanda es increíble y mi gato la ama.', rating: 'Excelente' },
              { name: 'Carlos M.', city: 'Medellín', text: 'Excelente calidad en los nuggets. Mi gato los devora y se nota que son ingredientes naturales de verdad.', rating: 'Excelente' },
              { name: 'Valentina R.', city: 'Cali', text: 'Envío súper rápido y los productos llegan perfectos. Ahora compro todo online sin necesidad de ir a la tienda.', rating: 'Excelente' }
            ].map((t, i) => (
              <div key={i} className="card" style={{ padding: 28, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <div style={{ marginBottom: 12, fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--jv-accent)' }}>{t.rating}</div>
                <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>"{t.text}"</p>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>{t.city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="page-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 12 }}>¿Listo para consentir a tu gato?</h2>
          <p style={{ color: 'var(--jv-text-secondary)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto 32px' }}>
            Crea tu cuenta y empieza a comprar los mejores productos para tu mascota
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Crear Cuenta Gratis</Link>
            <Link to="/tienda" className="btn btn-outline btn-lg">Explorar Tienda</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
