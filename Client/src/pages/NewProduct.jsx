import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productService from '../services/productService';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { Save, ArrowLeft, PlusCircle, PencilLine, HelpCircle } from 'lucide-react';

const NewProduct = () => {
  const { id } = useParams(); // For Edit mode, check if id param exists
  const isEditMode = !!id;
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State variables
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('0');
  const [stock, setStock] = useState('');
  const [rating, setRating] = useState('0');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Beauty', 'Sports'];

  // Load product data if in edit mode
  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(id);
        setTitle(data.title);
        setCategory(data.category);
        setPrice(data.price.toString());
        setDiscount(data.discount.toString());
        setStock(data.stock.toString());
        setRating(data.rating.toString());
        setImage(data.image);
        setDescription(data.description);
      } catch (error) {
        console.error('Failed to load product details for edit', error);
        alert('Product not found or failed to load');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode) {
      loadProductData();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !price || !stock || !image.trim() || !description.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    const productData = {
      title: title.trim(),
      category,
      price: parseFloat(price),
      discount: parseFloat(discount) || 0,
      stock: parseInt(stock),
      rating: parseFloat(rating) || 0,
      image: image.trim(),
      description: description.trim(),
    };

    try {
      if (isEditMode) {
        await productService.updateProduct(id, productData, user.token);
        alert('Product updated successfully!');
      } else {
        await productService.createProduct(productData, user.token);
        alert('Product added successfully!');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error processing product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Form Panel */}
      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/products"
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
              title="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {isEditMode ? <PencilLine className="h-5.5 w-5.5 text-primary-500" /> : <PlusCircle className="h-5.5 w-5.5 text-primary-500" />}
                <span>{isEditMode ? 'Modify Product' : 'Add New Product'}</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEditMode ? 'Update values for an existing catalog product' : 'Configure details for a new catalog product'}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex h-[40vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm max-w-4xl space-y-6 animate-fade-in">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Product Title */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Product Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Precision Audio Pro Headphones"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-premium py-2.5 text-sm"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-premium py-2.5 text-sm cursor-pointer bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Image URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="input-premium py-2.5 text-sm"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Unit Price ($) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  placeholder="199.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input-premium py-2.5 text-sm"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Discount Offer (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 15"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="input-premium py-2.5 text-sm"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Stock Level <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="40"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="input-premium py-2.5 text-sm"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Initial Rating (0-5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="input-premium py-2.5 text-sm"
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Product Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe the product specifications, components, size, colors, or warranty information..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-premium py-2.5 text-sm"
                ></textarea>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Link
                to="/admin/products"
                className="btn-secondary py-2.5 px-6 text-sm"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary py-2.5 px-6 text-sm font-bold"
              >
                <Save className="h-4.5 w-4.5" />
                <span>{submitting ? 'Processing...' : 'Save Product'}</span>
              </button>
            </div>

          </form>
        )}

      </main>

    </div>
  );
};

export default NewProduct;
