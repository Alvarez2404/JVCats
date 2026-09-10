import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

// SVG icons for category pills
const CategoryIcon = ({ type }) => {
  if (type === 'Todos') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
  if (type === 'Arenas') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  );
  if (type === 'Comida') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  );
  return null;
};

const CATEGORY_CONFIG = {
  Todos:  { label: 'Todo el Catálogo', sub: 'Todos los productos' },
  Arenas: { label: 'Arenas Sanitarias', sub: '16 variedades disponibles' },
  Comida: { label: 'Alimentos y Nuggets', sub: 'Nutrición completa' },
};

export default function Store() {
  const { getProducts } = useStore();
  const products = getProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'Todos';

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');

  const categories = ['Todos', 'Arenas', 'Comida'];

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory !== 'Todos') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return result;
  }, [products, activeCategory, search, sort]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setSearch('');
    if (cat === 'Todos') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', cat);
    }
    setSearchParams(searchParams);
  };

  const activeCfg = CATEGORY_CONFIG[activeCategory] || CATEGORY_CONFIG['Todos'];

  return (
    <div className="store-page-wrapper">

      {/* ── PREMIUM STORE HEADER ── */}
      <header className="store-hero-header">
        {/* Decorative orbs */}
        <div className="sh-orb sh-orb--1" />
        <div className="sh-orb sh-orb--2" />

        <div className="container sh-inner">
          <div className="sh-text">
            <span className="store-eyebrow">Catálogo Oficial JV Cats</span>
            <h1 className="sh-title">{activeCfg.label}</h1>
            <p className="sh-sub">
              <span className="sh-count-badge">{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</span>
              &nbsp;{activeCfg.sub}
            </p>
          </div>

          {/* Search bar in header */}
          <div className="sh-search-wrap">
            <div className="store-search sh-search">
              <svg className="store-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                id="store-search-input"
                placeholder="Buscar por nombre, aroma…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Buscar productos"
              />
              {search && (
                <button className="sh-search-clear" onClick={() => setSearch('')} aria-label="Limpiar búsqueda">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="sh-wave">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none">
            <path d="M0,20L80,28C160,36,320,52,480,52C640,52,800,36,960,26C1120,16,1280,12,1360,10L1440,8L1440,60L0,60Z" fill="#ffffff"/>
          </svg>
        </div>
      </header>

      {/* ── CATEGORY PILLS ── */}
      <div className="store-cat-pills-section">
        <div className="container">
          <div className="store-cat-pills" role="tablist" aria-label="Filtrar por categoría">
            {categories.map(cat => (
              <button
                key={cat}
                id={`cat-pill-${cat.toLowerCase()}`}
                role="tab"
                aria-selected={activeCategory === cat}
                className={`store-cat-pill ${activeCategory === cat ? 'store-cat-pill--active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                <span className="scp-icon"><CategoryIcon type={cat} /></span>
                <span className="scp-label">
                  {cat === 'Todos' ? 'Todos' : cat === 'Arenas' ? 'Arenas' : 'Alimentos'}
                </span>
                {activeCategory === cat && (
                  <span className="scp-dot" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRODUCTS AREA ── */}
      <div className="container page-section store-body-section">

        {/* Toolbar: result count + sort */}
        <div className="store-toolbar">
          <p className="store-result-text">
            {search ? (
              <>Resultados para <strong>"{search}"</strong>: <span className="srt-count">{filtered.length}</span></>
            ) : (
              <><span className="srt-count">{filtered.length}</span> producto{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}</>
            )}
          </p>
          <div className="store-sort-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <select
              className="form-select store-select store-sort-select"
              value={sort}
              onChange={e => setSort(e.target.value)}
              id="store-sort-select"
              aria-label="Ordenar productos"
            >
              <option value="default">Ordenar por…</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name">Nombre A–Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="products-grid store-products-grid">
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className="store-card-reveal"
                style={{ animationDelay: `${Math.min(i * 55, 440)}ms` }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--jv-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h3>No encontramos productos</h3>
            <p>Intenta con otra búsqueda o categoría</p>
            <button
              className="btn btn-primary btn-sm"
              id="reset-store-filters-btn"
              onClick={() => { setSearch(''); handleCategoryChange('Todos'); }}
            >
              Ver Todos los Productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
