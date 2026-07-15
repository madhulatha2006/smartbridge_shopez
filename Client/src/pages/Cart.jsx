import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { ShoppingBag, ArrowRight, ShoppingCart, Info } from 'lucide-react';

const Cart = () => {
  const { cartItems, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  // Subtotal before discounts
  const subtotalBeforeDiscounts = cartItems.reduce((total, item) => {
    if (!item.productId) return total;
    return total + item.productId.price * item.quantity;
  }, 0);

  const totalDiscount = subtotalBeforeDiscounts - totalPrice;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Your Cart
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review items and proceed to secure checkout
        </p>
      </div>

      {cartItems.length === 0 ? (
        /* Empty Cart View */
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-4">
          <ShoppingBag className="h-16 w-16 text-slate-200 stroke-[1.5] mb-6" />
          <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xs">
            Looks like you haven't added any products to your shopping cart yet.
          </p>
          <Link to="/products" className="btn-primary mt-8">
            <ShoppingCart className="h-4.5 w-4.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      ) : (
        /* Cart Details Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: List of items */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex justify-between items-center pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Items ({totalItems})
              </span>
            </div>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
          </div>

          {/* Right panel: Summary Card */}
          <div className="lg:col-span-4 rounded-3xl border border-slate-100 p-6 bg-white shadow-sm space-y-6">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider pb-4 border-b border-slate-100">
              Order Summary
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">${subtotalBeforeDiscounts.toFixed(2)}</span>
              </div>
              
              {totalDiscount > 0 && (
                <div className="flex justify-between text-rose-600 bg-rose-50/50 p-2.5 rounded-lg border border-rose-50">
                  <span className="font-semibold">Discount Applied</span>
                  <span className="font-bold">-${totalDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Shipping Fees</span>
                <span className="font-semibold text-emerald-600 uppercase text-xs bg-emerald-50 px-2 py-0.5 rounded">
                  Free Shipping
                </span>
              </div>

              <hr className="border-slate-100 my-2" />

              <div className="flex justify-between text-base">
                <span className="font-extrabold text-slate-900">Total Bill</span>
                <span className="font-black text-slate-900 text-lg">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Warning Alert */}
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-100/50 text-xs text-amber-800">
              <Info className="h-4.5 w-4.5 shrink-0 text-amber-600" />
              <p>Prices are tax-inclusive. Free shipping applies to standard deliveries.</p>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full btn-primary py-3.5 text-sm font-bold"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default Cart;
