import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, ShoppingCart, ArrowLeft, Percent, Package, Award } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItemToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!user) {
      alert('Please sign in to add products to your cart.');
      navigate('/login');
      return;
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} items left in stock.`);
      return;
    }

    addItemToCart(product, quantity);
    alert(`${quantity} x ${product.title} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500">The product you are trying to view does not exist or has been deleted.</p>
        <Link to="/products" className="btn-primary inline-flex">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const { title, description, category, image, price, discount, stock, rating } = product;

  // Price calculations
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? price * (1 - discount / 100) : price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back Button */}
      <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary-600 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Collection</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
        
        {/* Left Side: Product Image Display */}
        <div className="lg:col-span-6 relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
          <img
            src={image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600'}
            alt={title}
            className="w-full h-full object-cover object-center"
          />

          {hasDiscount && (
            <div className="absolute top-4 left-4 flex items-center gap-0.5 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-rose-500/10">
              <Percent className="h-3.5 w-3.5" />
              <span>{discount}% Special Discount</span>
            </div>
          )}
        </div>

        {/* Right Side: Product Details info */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
              {category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight pt-1">
              {title}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-1.5 pt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(rating) ? 'fill-current' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">{rating.toFixed(1)} Rating</span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">${finalPrice.toFixed(2)}</span>
            {hasDiscount && (
              <>
                <span className="text-base text-slate-400 line-through">${price.toFixed(2)}</span>
                <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                  Save ${(price - finalPrice).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Stock inventory details */}
          <div className="flex items-center gap-2">
            <Package className="h-4.5 w-4.5 text-slate-400" />
            {stock > 0 ? (
              <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                In Stock ({stock} units available)
              </span>
            ) : (
              <span className="text-sm font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md">
                Out of Stock
              </span>
            )}
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">
            {description}
          </p>

          <hr className="border-slate-100" />

          {/* Add to Cart Actions */}
          {stock > 0 ? (
            <div className="space-y-4">
              {/* Quantity selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-slate-800 select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    disabled={quantity >= stock}
                    className="px-3.5 py-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add button */}
              <button
                onClick={handleAddToCart}
                className="w-full btn-primary py-3.5 text-sm font-bold"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart - ${(finalPrice * quantity).toFixed(2)}</span>
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full py-3.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed uppercase border border-slate-200"
            >
              Sold Out / Temporary Unavailable
            </button>
          )}

          {/* Warranty stamp */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <Award className="h-6 w-6 text-primary-500 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-slate-800">ShopEZ Authenticity Guarantee</p>
              <p className="text-slate-500 mt-0.5">100% verified original items and 30-day hassle free refund.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;
