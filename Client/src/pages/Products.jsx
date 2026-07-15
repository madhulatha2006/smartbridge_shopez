import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, Tag, Sparkles } from 'lucide-react';

const Products = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';
  const initialSort = queryParams.get('sort') || 'newest';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Categories list
  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Beauty', 'Sports'];

  // Handle URL change triggers (e.g. clicking categories from home page)
  useEffect(() => {
    const cat = queryParams.get('category');
    const srt = queryParams.get('sort');
    if (cat) setCategory(cat);
    if (srt) setSort(srt);
  }, [location.search]);

  // Load products based on filter changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const filters = {
          category,
          sort,
        };
        if (search.trim()) filters.search = search;
        if (minPrice) filters.minPrice = minPrice;
        if (maxPrice) filters.maxPrice = maxPrice;

        const data = await productService.getProducts(filters);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching filtered products', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly to avoid hammering database
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [category, sort, search, minPrice, maxPrice]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Explore Collection
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse through our highly curated premium product catalog
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-premium pl-9 py-2 text-sm w-full"
          />
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR FILTERS PANEL */}
        <aside className="lg:col-span-1 rounded-2xl glass-card border border-slate-100 p-6 space-y-6 h-fit sticky top-20">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary-500" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Categories Selector */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              <span>Category</span>
            </h4>
            <div className="flex flex-wrap lg:flex-col gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-left text-xs font-semibold transition-all ${
                    category === cat
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500 pl-3'
                      : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent pl-2.5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Price Range</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input-premium py-1.5 text-xs text-center"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input-premium py-1.5 text-xs text-center"
                />
              </div>
            </div>
          </div>

          {/* Sorting Dropdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>Sort By</span>
            </h4>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-premium py-2 text-xs w-full cursor-pointer bg-white"
            >
              <option value="newest">Newest Additions</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </aside>

        {/* PRODUCTS CATALOG GRID */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-4 h-[350px]">
                  <div className="bg-slate-100 rounded-xl aspect-square w-full mb-4"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-slate-100 rounded w-3/4 mb-3"></div>
                  <div className="h-9 bg-slate-100 rounded mt-auto"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-4">
              <SlidersHorizontal className="h-12 w-12 text-slate-300 stroke-[1.5] mb-4" />
              <h3 className="text-lg font-bold text-slate-800">No Products Found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                We couldn't find any products matching your select query. Try adjusting your search filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="btn-primary mt-6 text-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>

    </div>
  );
};

export default Products;
