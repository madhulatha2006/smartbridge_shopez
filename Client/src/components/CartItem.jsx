import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartItem = ({ item }) => {
  const { updateItemQuantity, removeItemFromCart } = useCart();
  const { productId, quantity, _id } = item;

  if (!productId) return null;

  const { title, image, price, discount, stock, _id: prodId } = productId;

  // Calculate price
  const hasDiscount = discount > 0;
  const unitPrice = hasDiscount ? price * (1 - discount / 100) : price;
  const totalPrice = unitPrice * quantity;

  const handleIncrement = () => {
    if (quantity < stock) {
      updateItemQuantity(prodId, quantity + 1);
    } else {
      alert(`Only ${stock} items available in stock.`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateItemQuantity(prodId, quantity - 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Product Image and Details */}
      <div className="flex items-center gap-4 flex-1">
        <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-50">
          <img
            src={image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600'}
            alt={title}
            className="h-full w-full object-cover object-center"
          />
        </div>
        
        <div className="space-y-1 min-w-0">
          <Link
            to={`/products/${prodId}`}
            className="text-sm font-semibold text-slate-800 hover:text-primary-600 transition-colors line-clamp-1"
          >
            {title}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">${unitPrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">${price.toFixed(2)}</span>
            )}
          </div>
          <p className="text-xs text-slate-400">Stock: {stock} units left</p>
        </div>
      </div>

      {/* Quantity Adjuster & Final Prices */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0">
        {/* Quantity buttons */}
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          
          <span className="w-10 text-center text-sm font-semibold text-slate-700 select-none">
            {quantity}
          </span>
          
          <button
            onClick={handleIncrement}
            disabled={quantity >= stock}
            className="p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right shrink-0">
          <p className="text-sm font-extrabold text-slate-900">${totalPrice.toFixed(2)}</p>
        </div>

        {/* Remove button */}
        <button
          onClick={() => removeItemFromCart(_id)}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          aria-label="Remove item"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
