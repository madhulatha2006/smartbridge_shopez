import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { PlusCircle, Search, Edit2, Trash2, Tag, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';

const AllProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Get all products without filter limit
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products for admin', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadProducts();
    }
  }, [user]);

  // Handle product deletion
  const handleDeleteProduct = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await productService.deleteProduct(id, user.token);
        alert('Product deleted successfully');
        // Filter out of state
        setProducts(products.filter((p) => p._id !== id));
      } catch (error) {
        console.error('Failed to delete product', error);
        alert(error.response?.data?.message || 'Error deleting product');
      }
    }
  };

  // Filter products by search input
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Table Display */}
      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Header Title & Add Product Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Products Catalog</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage store products inventory and discounting</p>
          </div>
          
          <Link to="/admin/products/new" className="btn-primary py-2 px-4 text-xs font-semibold">
            <PlusCircle className="h-4.5 w-4.5" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Filters and search panel */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search products by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-premium pl-9 py-2 text-xs w-full"
            />
          </div>

          <div className="text-xs text-slate-400 font-semibold shrink-0">
            Count: {filteredProducts.length} items
          </div>
        </div>

        {/* Catalog Table */}
        {loading ? (
          <div className="flex h-[40vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
            <Tag className="h-10 w-10 mx-auto text-slate-200 stroke-[1.5] mb-2" />
            <p className="text-sm font-bold">No Products Listed</p>
            <p className="text-xs text-slate-400 mt-0.5">Add a product to start building the inventory catalog.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4 font-semibold">Product Name</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Stock Level</th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const discountedPrice = p.price * (1 - (p.discount || 0) / 100);
                    return (
                      <tr key={p._id} className="hover:bg-slate-50/20">
                        {/* Title and Thumbnail */}
                        <td className="p-4 font-semibold text-slate-800">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                              <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate max-w-[220px] font-bold text-slate-800">{p.title}</p>
                              {p.discount > 0 && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-rose-600 bg-rose-50 px-1 py-0.5 rounded">
                                  <Percent className="h-2 w-2" />
                                  <span>{p.discount}% OFF</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4 text-slate-500 font-semibold">{p.category}</td>

                        {/* Price */}
                        <td className="p-4">
                          {p.discount > 0 ? (
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 line-through">${p.price.toFixed(2)}</span>
                              <span className="font-bold text-slate-900">${discountedPrice.toFixed(2)}</span>
                            </div>
                          ) : (
                            <span className="font-bold text-slate-900">${p.price.toFixed(2)}</span>
                          )}
                        </td>

                        {/* Stock level */}
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.stock > 10
                                ? 'bg-emerald-50 text-emerald-600'
                                : p.stock > 0
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {p.stock > 0 ? `${p.stock} Available` : 'Sold Out'}
                          </span>
                        </td>

                        {/* Edit/Delete Actions */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/admin/products/edit/${p._id}`}
                              className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-all"
                              title="Edit item"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Link>

                            <button
                              onClick={() => handleDeleteProduct(p._id, p.title)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              title="Delete item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};

export default AllProducts;
