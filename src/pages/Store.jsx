import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

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
        p.subcategory.toLowerCase().includes(q) ||
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
    if (cat === 'Todos') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="store-page-wrapper">
      <div className="store-header">
        <div className="container">
          <span className="store-eyebrow">Catálogo Oficial JV Cats</span>
          <h1>Nuestra Tienda</h1>
          <p>
            {filtered.length} producto{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''} para consentir a tu gato
          </p>
        </div>
      </div>

      <div className="container page-section store-body-section">
        <div className="store-filters" style={{ marginBottom: 32 }}>
          <select 
            className="form-select store-select" 
            value={activeCategory} 
            onChange={e => handleCategoryChange(e.target.value)}
            style={{ width: 'auto', minWidth: 200 }}
          >
            <option value="Todos">Todos los productos</option>
            <option value="Arenas">Arenas Sanitarias</option>
            <option value="Comida">Alimentos y Nuggets</option>
          </select>

          <div className="store-search">
            <svg className="store-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Buscar productos por nombre, aroma..." 
              value={search}
              onChange={e => setSearch(e.target.value)} 
            />
          </div>

          <select 
            className="form-select store-select" 
            value={sort} 
            onChange={e => setSort(e.target.value)}
            style={{ width: 'auto', minWidth: 180 }}
          >
            <option value="default">Ordenar por</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="products-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--jv-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3>No encontramos productos</h3>
            <p>Intenta con otra búsqueda o categoría</p>
            <button className="btn btn-primary btn-sm" onClick={() => { setSearch(''); setActiveCategory('Todos'); }}>
              Ver Todos los Productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
