import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, Headphones, Sparkles } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'Electronics', icon: '💻', count: '12+ Items', bg: 'from-blue-500/10 to-indigo-500/10' },
    { name: 'Clothing', icon: '👕', count: '45+ Items', bg: 'from-pink-500/10 to-rose-500/10' },
    { name: 'Sports', icon: '⚽', count: '18+ Items', bg: 'from-emerald-500/10 to-teal-500/10' },
    { name: 'Home & Kitchen', icon: '🍳', count: '22+ Items', bg: 'from-amber-500/10 to-orange-500/10' },
    { name: 'Beauty', icon: '💄', count: '15+ Items', bg: 'from-purple-500/10 to-fuchsia-500/10' },
    { name: 'Books', icon: '📚', count: '30+ Items', bg: 'from-sky-500/10 to-cyan-500/10' }
  ];

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await productService.getProducts({ limit: 4 });
        // Get products with discount or high rating to feature
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load products for homepage', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Showcase Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-b-[2.5rem] py-20 px-6 lg:px-12 shadow-2xl">
        {/* Abstract design elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#4c1d95,transparent)] opacity-60"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full filter blur-[120px] opacity-30 animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-primary-400" />
              <span>Mega Summer Clearance</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              A Smarter Way <br />
              <span className="bg-gradient-to-r from-primary-400 to-indigo-300 bg-clip-text text-transparent">
                To Shop Online.
              </span>
            </h1>
            
            <p className="text-lg text-slate-300 max-w-lg mx-auto lg:mx-0">
              Discover verified premium products at direct prices. Save up to 50% on selected electronic devices, sportswear, apparel and much more.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link to="/products" className="btn-primary py-3 px-8 text-base">
                <ShoppingBag className="h-5 w-5" />
                <span>Explore Store</span>
              </Link>
              <Link
                to="/products?sort=priceAsc"
                className="px-8 py-3 rounded-xl border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>View Hot Deals</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Hero Banner Grid */}
          <div className="hidden lg:block relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-700 relative group">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200"
                alt="E-commerce banner"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-8">
                <p className="text-xs text-primary-400 font-bold uppercase tracking-widest mb-1">Weekly Spotlight</p>
                <h3 className="text-xl font-bold text-white mb-2">Noise-Cancellation Audio Gears</h3>
                <p className="text-sm text-slate-300">Discover premium acoustic experience starting at $99.99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Customer Trust Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Free Global Shipping</h4>
              <p className="text-xs text-slate-500 mt-0.5">On orders above $75.00</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">100% Secured Payment</h4>
              <p className="text-xs text-slate-500 mt-0.5">Encrypted transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Dedicated Live Support</h4>
              <p className="text-xs text-slate-500 mt-0.5">24/7 chat support availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Browse Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Shop by Category</h2>
            <p className="text-sm text-slate-500 mt-1">Select a category to browse matching products</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className={`group p-6 rounded-2xl bg-gradient-to-br ${cat.bg} border border-slate-100 text-center hover:scale-[1.03] transition-all duration-300 shadow-sm hover:shadow-md`}
            >
              <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <h3 className="font-bold text-slate-800 text-sm">{cat.name}</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-1 uppercase tracking-wider">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured / Best Seller Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Selections</h2>
            <p className="text-sm text-slate-500 mt-1">Explore our most popular customer picks of the week</p>
          </div>
          <Link to="/products" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            <span>Browse All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col rounded-2xl border border-slate-100 bg-white p-4 h-[350px]">
                <div className="bg-slate-200 rounded-xl aspect-square w-full mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-slate-200 rounded mt-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
