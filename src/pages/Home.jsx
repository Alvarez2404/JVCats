import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { getProducts } = useStore();
  const products = getProducts();

  // Category filter for featured products
  const [activeTab, setActiveTab] = useState('Todos');

  const filteredProducts = products.filter(p => {
    if (activeTab === 'Todos') return p.featured || true;
    if (activeTab === 'Arenas') return p.category === 'Arenas';
    if (activeTab === 'Comida') return p.category === 'Comida' || p.category === 'Alimentos';
    if (activeTab === 'Snacks') return p.category === 'Snacks';
    return true;
  }).slice(0, 8);

  return (
    <div className="home-wrapper">
      {/* ─── PURE CSS DYNAMIC HERO (NO PHOTOS, NO EMOJIS) ─── */}
      <section className="hero-dynamic">
        {/* Animated background ambient glow orbs */}
        <div className="hd-orb hd-orb--1" />
        <div className="hd-orb hd-orb--2" />
        <div className="hd-orb hd-orb--3" />

        {/* Floating animated sparkles and shapes (Clean SVGs, NO EMOJIS) */}
        <div className="hd-particles" aria-hidden="true">
          <span className="hd-particle hd-p1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
              <circle cx="12" cy="12" r="6" />
            </svg>
          </span>
          <span className="hd-particle hd-p2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(250,194,13,0.5)">
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
            </svg>
          </span>
          <span className="hd-particle hd-p3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
              <circle cx="12" cy="12" r="5" />
            </svg>
          </span>
          <span className="hd-particle hd-p4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(250,194,13,0.45)">
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
            </svg>
          </span>
          <span className="hd-particle hd-p5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)">
              <circle cx="12" cy="12" r="5" />
            </svg>
          </span>
          <span className="hd-particle hd-p6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(250,194,13,0.4)">
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
            </svg>
          </span>
        </div>

        <div className="hd-container">
          {/* Left Column: Headline, CTAs, Quick Links, Live Stats */}
          <div className="hd-content">
            {/* Live status badge */}
            <div className="hd-badge">
              <span className="hd-badge-pulse" />
              <span className="hd-badge-text">DISTRIBUIDOR AUTORIZADO ONLINE · COLOMBIA</span>
            </div>

            <h1 className="hd-title">
              Todo lo que tu gato ama,{' '}
              <span className="hd-title-gradient">directo a tu hogar</span>
            </h1>

            <p className="hd-subtitle">
              Arenas sanitarias de fórmula premium, nuggets rellenos nutritivos y snacks funcionales.
              La mejor calidad para el bienestar de tu mascota, con envíos rápidos y seguros a toda Colombia.
            </p>

            {/* Main Action Buttons (Clean text & SVG icons) */}
            <div className="hd-actions">
              <Link to="/tienda" className="hd-btn hd-btn--primary" id="hero-btn-tienda">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>Explorar Tienda</span>
                <span className="hd-btn-arrow">→</span>
              </Link>

              <Link to="/tienda?cat=Arenas" className="hd-btn hd-btn--secondary" id="hero-btn-arenas">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
                <span>Ver Arenas Sanitarias</span>
              </Link>

              <a
                href="https://wa.me/573182164552?text=%C2%A1Hola!%20Vengo%20de%20jvcatslatienda.com%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20productos"
                target="_blank"
                rel="noreferrer"
                className="hd-btn hd-btn--whatsapp"
                id="hero-btn-whatsapp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.957-1.401A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
                <span>Asesoría WhatsApp</span>
              </a>
            </div>

            {/* Quick-Access Category Pills */}
            <div className="hd-quick-chips">
              <span className="hd-quick-label">Accesos rápidos:</span>
              <div className="hd-chips-list">
                <Link to="/tienda?cat=Arenas" className="hd-chip">
                  Arenas (16 Variedades)
                </Link>
                <Link to="/tienda?cat=Comida" className="hd-chip">
                  Alimentos Secos
                </Link>
                <Link to="/tienda" className="hd-chip">
                  Snacks Funcionales
                </Link>
              </div>
            </div>

            {/* Live Metrics / Counters */}
            <div className="hd-stats">
              <div className="hd-stat-box">
                <div className="hd-stat-number">20+</div>
                <div className="hd-stat-label">Productos Premium</div>
              </div>
              <div className="hd-stat-divider" />
              <div className="hd-stat-box">
                <div className="hd-stat-number">16</div>
                <div className="hd-stat-label">Variedades de Arena</div>
              </div>
              <div className="hd-stat-divider" />
              <div className="hd-stat-box">
                <div className="hd-stat-number">100%</div>
                <div className="hd-stat-label">Auténtico JVCats</div>
              </div>
              <div className="hd-stat-divider" />
              <div className="hd-stat-box">
                <div className="hd-stat-number">24/48h</div>
                <div className="hd-stat-label">Envíos Colombia</div>
              </div>
            </div>
          </div>
        </div>
        

        {/* Dynamic Wave Divider */}
        <div className="hd-wave">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
            <path
              d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,42.7C1200,53,1320,75,1380,85.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* ─── DYNAMIC RUNNING MARQUEE TICKER (NO EMOJIS) ─── */}
      <div className="marquee-bar">
        <div className="marquee-track">
          {[1, 2].map((group) => (
            <div key={group} className="marquee-content">
              <span>ENVÍOS A TODA COLOMBIA</span>
              <span className="marquee-sep">•</span>
              <span>DISTRIBUIDOR AUTORIZADO JVCATS</span>
              <span className="marquee-sep">•</span>
              <span>ARENAS SANITARIAS PREMIUM 100% NATURAL</span>
              <span className="marquee-sep">•</span>
              <span>PAGO SEGURO CON NEQUI Y PSE</span>
              <span className="marquee-sep">•</span>
              <span>MÁXIMO CONTROL DE OLOR Y AGLOMERACIÓN</span>
              <span className="marquee-sep">•</span>
              <span>CALIDAD GARANTIZADA PARA TU MASCOTA</span>
              <span className="marquee-sep">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FEATURES STRIP ─── */}
      <section className="features-strip">
        <div className="container">
          <div className="features-grid">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                ),
                title: 'Envío a Todo Colombia',
                desc: 'Envíos rápidos y seguros. Gratis en compras superiores a $100.000',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                ),
                title: 'Pago 100% Seguro',
                desc: 'Paga con Nequi, PSE o tarjeta. Tus transacciones están protegidas.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                ),
                title: 'Calidad Garantizada',
                desc: 'Productos formulados con ingredientes de primera calidad para tu mascota.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                  </svg>
                ),
                title: 'Distribuidor Autorizado',
                desc: 'Somos el canal oficial de venta online de JVCats en Colombia.',
              },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES WITH AI PRODUCT BANNERS (KEPT, NO EMOJIS) ─── */}
      <section className="page-section category-showcase-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Explora por Categoría</span>
            <h2>¿Qué vas a encontrar?</h2>
            <p>Productos que tu gato ama, con calidad y autenticidad garantizada</p>
            <div className="accent-line" />
          </div>

          <div className="what-grid-img">
            {/* Card 1: Arenas */}
            <Link to="/tienda?cat=Arenas" className="what-img-card" id="cat-arena-btn">
              <img src="/banner-arena.jpg" alt="Arenas Sanitarias JVCats – 16 variedades" />
              <div className="what-card-badge">16 Variedades</div>
              <div className="what-img-overlay">
                <div className="what-overlay-text">
                  <h3>Arenas Sanitarias</h3>
                  <p>Aglomeración instantánea y aromas únicos</p>
                </div>
                <span className="what-overlay-cta">Ver Arenas →</span>
              </div>
            </Link>

            {/* Card 2: Alimentos */}
            <Link to="/tienda?cat=Comida" className="what-img-card" id="cat-food-btn">
              <img src="/banner-alimentos.jpg" alt="Alimentos JVCats – Nuggets rellenos de pollo" />
              <div className="what-card-badge">Nutrición Completa</div>
              <div className="what-img-overlay">
                <div className="what-overlay-text">
                  <h3>Alimentos Secos</h3>
                  <p>Nuggets rellenos con sabor irresistible</p>
                </div>
                <span className="what-overlay-cta">Ver Alimentos →</span>
              </div>
            </Link>

            {/* Card 3: Snacks */}
            <Link to="/tienda" className="what-img-card" id="cat-snacks-btn">
              <img src="/banner-snacks.jpg" alt="Snacks funcionales JVCats – Control de bolas de pelo" />
              <div className="what-card-badge">Snacks Funcionales</div>
              <div className="what-img-overlay">
                <div className="what-overlay-text">
                  <h3>Snacks & Premios</h3>
                  <p>Control de bolas de pelo y salud digestiva</p>
                </div>
                <span className="what-overlay-cta">Ver Snacks →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── DYNAMIC FEATURED PRODUCTS WITH CATEGORY TABS (NO EMOJIS) ─── */}
      <section className="page-section products-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Catálogo Destacado</span>
            <h2>Productos Favoritos</h2>
            <p>Los más elegidos por los amantes de los gatos en Colombia</p>
            <div className="accent-line" />
          </div>

          {/* Interactive Filter Tabs */}
          <div className="product-tabs">
            {['Todos', 'Arenas', 'Comida', 'Snacks'].map((tab) => (
              <button
                key={tab}
                className={`product-tab ${activeTab === tab ? 'product-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'Todos' && 'Todos'}
                {tab === 'Arenas' && 'Arenas'}
                {tab === 'Comida' && 'Alimentos'}
                {tab === 'Snacks' && 'Snacks'}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {filteredProducts.map((p, i) => (
              <div key={p.id} className="store-card-reveal" style={{ animationDelay: `${i * 70}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <Link to="/tienda" className="btn btn-primary btn-lg" id="see-all-btn">
              Ver Todos los Productos en la Tienda →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHO WE ARE BAND (BRAND GEOMETRY CIRCLES, INSPIRED BY BRAND MANUAL) ─── */}
      <section className="who-band">
        <div className="container">
          <div className="who-inner">
            <div className="who-text">
              <span className="who-eyebrow">DISTRIBUIDOR AUTORIZADO OFICIAL</span>
              <h2 className="who-heading">
                Somos <span>Distribuidor Autorizado Online</span> de JVCats
              </h2>
              <p className="who-body">
                En <strong>JV Cats La Tienda</strong> llevamos la arena sanitaria premium, alimentos balanceados
                y snacks funcionales de la marca JVCats directamente a tu puerta.
                Garantizamos autenticidad en cada paquete, servicio cordial y despachos rápidos para que nunca le falte lo mejor a tu mascota.
              </p>

              <div className="who-bullets">
                <div className="who-bullet-item">
                  <span className="who-bullet-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </span>
                  <span>100% Producto Auténtico JVCats</span>
                </div>
                <div className="who-bullet-item">
                  <span className="who-bullet-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </span>
                  <span>Despachos Rápidos con Guía de Rastreo</span>
                </div>
                <div className="who-bullet-item">
                  <span className="who-bullet-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Atención Personalizada para Familias Gatunas</span>
                </div>
              </div>

              <div style={{ marginTop: 32 }}>
                <Link to="/tienda" className="btn btn-primary btn-lg" id="who-shop-btn">
                  Explorar Catálogo →
                </Link>
              </div>
            </div>

            <div className="who-visual-stage">
              {/* Overlapping Brand Circles (Inspirado en el manual de marca) */}
              <div className="brand-circles-container">
                {/* Outer rotating decorative dashed orbit */}
                <div className="brand-circle-orbit" />
                
                {/* Large Brand Yellow Circle */}
                <div className="brand-circle brand-circle--yellow" />
                
                {/* Overlapping Brand Orange Circle */}
                <div className="brand-circle brand-circle--orange" />
                
                {/* Overlapping Brand Red / Wine Arc Circle */}
                <div className="brand-circle brand-circle--red" />

                {/* Floating micro accent bubbles */}
                <span className="brand-bubble bubble-1" />
                <span className="brand-bubble bubble-2" />
                <span className="brand-bubble bubble-3" />

                {/* Central Brand Mascot Artwork */}
                <div className="brand-mascot-frame">
                  <img
                    src="/logo-jvcats-clean.png"
                    alt="JV Cats La Tienda – Distribuidor Autorizado"
                    className="who-logo-clean"
                  />
                </div>

                {/* Floating Authenticity Badge */}
                <div className="brand-circle-badge">
                  <span className="bc-badge-icon">✓</span>
                  <div>
                    <strong>100% Oficial</strong>
                    <small>Distribuidor Colombia</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS (SVG STARS, NO EMOJIS) ─── */}
      <section className="page-section testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Comunidad Felina</span>
            <h2>Lo que dicen nuestros clientes</h2>
            <p>Miles de hogares y gatos felices en toda Colombia</p>
            <div className="accent-line" />
          </div>

          <div className="grid-3">
            {[
              {
                name: 'María F.',
                city: 'Bogotá D.C.',
                text: 'Las arenas de JV Cats son insuperables. El aroma a lavanda neutraliza todo y mi gata Luna se siente cómoda de inmediato. Llegó al día siguiente.',
              },
              {
                name: 'Carlos M.',
                city: 'Medellín, Antioquia',
                text: 'Excelente calidad en los nuggets rellenos. Mis dos gatos los devoran y su pelaje está mucho más brillante. Compra 100% recomendada.',
              },
              {
                name: 'Valentina R.',
                city: 'Cali, Valle del Cauca',
                text: 'Pagar con Nequi fue súper fácil y seguro. El paquete llegó muy bien embalado. Ahora soy clienta fija para la arena de 20kg.',
              },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars-svg" style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill="#fac20d">
                      <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                    </svg>
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-city">{t.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="page-section cta-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="cta-badge">DISTRIBUIDOR AUTORIZADO JVCATS</div>
          <h2 className="cta-title">¿Listo para consentir a tu gato?</h2>
          <p className="cta-sub">
            Crea tu cuenta en minutos o explora nuestra tienda online.<br />
            Estamos listos para llevarte la mejor experiencia de compra felina.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" id="cta-register-btn">
              Crear Cuenta Gratis
            </Link>
            <Link to="/tienda" className="btn btn-outline btn-lg" id="cta-explore-btn">
              Explorar Tienda
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FLOATING WHATSAPP BUTTON (NO EMOJIS) ─── */}
      <a
        href="https://wa.me/573182164552?text=%C2%A1Hola!%20Vengo%20de%20jvcatslatienda.com%20y%20quiero%20hacer%20un%20pedido"
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp"
        title="Escríbenos por WhatsApp"
        id="floating-whatsapp-btn"
      >
        <span className="wa-pulse" />
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.957-1.401A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
        </svg>
        <span className="wa-tooltip">Atención WhatsApp</span>
      </a>
    </div>
  );
}
