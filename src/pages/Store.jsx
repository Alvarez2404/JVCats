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
    <div>
      <div className="store-header">
        <div className="container">
          <h1>Nuestra Tienda</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>
            {filtered.length} producto{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container page-section">
        {/* Filters */}
        <div className="store-filters" style={{ marginBottom: 32 }}>
          {categories.map(cat => (
            <button key={cat} className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}>
              {cat}
            </button>
          ))}
          <div className="store-search">
            <input type="text" placeholder="Buscar productos..." value={search}
              onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '16px' }} />
          </div>
          <select className="form-select" value={sort} onChange={e => setSort(e.target.value)}
            style={{ width: 'auto', minWidth: 180 }}>

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
            <div className="empty-icon">🔍</div>
            <h3>No encontramos productos</h3>
            <p>Intenta con otra búsqueda o categoría</p>
            <button className="btn btn-primary btn-sm" onClick={() => { setSearch(''); setActiveCategory('Todos'); }}>
              Ver Todos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
