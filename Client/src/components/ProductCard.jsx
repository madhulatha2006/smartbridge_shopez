import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, Percent } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addItemToCart } = useCart();
  const { _id, title, category, image, price, discount, stock, rating } = product;

  // Calculate final discounted price
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? price * (1 - discount / 100) : price;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to product details when clicking the button
    addItemToCart(product, 1);
  };

  return (
    <Link
      to={`/products/${_id}`}
      className="group flex flex-col overflow-hidden rounded-2xl glass-card premium-card h-full"
    >
      {/* Product Image Panel */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600'}
          alt={title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 flex items-center gap-0.5 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-md shadow-rose-500/10">
            <Percent className="h-3 w-3" />
            <span>{discount}% OFF</span>
          </div>
        )}

        {/* Category Overlay */}
        <div className="absolute bottom-3 left-3 rounded-md bg-slate-900/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
          {category}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Rating and Reviews */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(rating) ? 'fill-current' : 'text-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-500">{rating.toFixed(1)}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors mb-2 min-h-[40px]">
          {title}
        </h3>

        {/* Price and Add button section */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-50">
          <div>
            {hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 line-through">${price.toFixed(2)}</span>
                <span className="text-base font-bold text-slate-900">${finalPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-base font-bold text-slate-900">${price.toFixed(2)}</span>
            )}
          </div>

          {/* Add to Cart Action */}
          {stock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-primary-600 hover:text-white text-slate-700 transition-all duration-200 active:scale-95"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          ) : (
            <span className="text-xs font-bold text-rose-500 uppercase bg-rose-50 px-2 py-1 rounded-md">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
