import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { MapPin, Phone, CreditCard, ChevronRight, ShoppingCart, ArrowLeft, ShieldAlert } from 'lucide-react';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Billing address and payment state
  const [shippingAddress, setShippingAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-fill user profile info on mount
  useEffect(() => {
    if (user) {
      if (user.address) setShippingAddress(user.address);
      if (user.phone) setContactPhone(user.phone);
    }
  }, [user]);

  // If cart is empty, bounce back to cart page
  useEffect(() => {
    if (cartItems.length === 0 && !submitting) {
      navigate('/cart');
    }
  }, [cartItems, navigate, submitting]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!shippingAddress.trim()) {
      setErrorMsg('Please enter a shipping address.');
      return;
    }

    if (!contactPhone.trim()) {
      setErrorMsg('Please enter a phone number.');
      return;
    }

    setSubmitting(true);

    try {
      // Map cart items to order products
      const orderProducts = cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price * (1 - (item.productId.discount || 0) / 100),
      }));

      const orderData = {
        userId: user._id,
        products: orderProducts,
        totalAmount: totalPrice,
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
      };

      await orderService.createOrder(orderData, user.token);
      
      // Clear Cart locally
      clearCart();

      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit order. Check inventory stock.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Button */}
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary-600 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Cart</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Shipping details form */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-slate-100 p-6 sm:p-8 bg-white shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-500" />
              <span>Shipping Details</span>
            </h2>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 p-4 text-xs text-rose-600">
                <ShieldAlert className="h-5 w-5 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Full Address */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Delivery Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Apartment, Street name, City, Zipcode, State"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="input-premium py-2 text-sm"
                ></textarea>
              </div>

              {/* Phone number */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Contact Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 555-0144"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="input-premium pl-10 py-2.5 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Panel */}
          <div className="rounded-3xl border border-slate-100 p-6 sm:p-8 bg-white shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary-500" />
              <span>Select Payment Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* COD */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-primary-500 bg-primary-50/20 ring-1 ring-primary-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Cash on Delivery</p>
                    <p className="text-xs text-slate-400">Pay when delivered</p>
                  </div>
                </div>
              </label>

              {/* Demo Card */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'Credit/Debit Card'
                    ? 'border-primary-500 bg-primary-50/20 ring-1 ring-primary-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="Credit/Debit Card"
                    checked={paymentMethod === 'Credit/Debit Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Credit/Debit Card</p>
                    <p className="text-xs text-slate-400">Sandbox / Demo Card</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-4 text-base font-bold"
            >
              <span>{submitting ? 'Placing Order...' : `Submit Order - $${totalPrice.toFixed(2)}`}</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Right Side: Order summary breakdown */}
        <aside className="lg:col-span-5 rounded-3xl border border-slate-100 p-6 bg-white shadow-sm space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
            <ShoppingCart className="h-4.5 w-4.5 text-primary-500" />
            <span>Order Summary</span>
          </h2>

          <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-2 space-y-3">
            {cartItems.map((item) => {
              const discountedPrice = item.productId.price * (1 - (item.productId.discount || 0) / 100);
              return (
                <div key={item._id} className="flex gap-4 pt-3 first:pt-0">
                  <div className="h-14 w-14 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                    <img
                      src={item.productId.image}
                      alt={item.productId.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-slate-800 truncate">{item.productId.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800">${(discountedPrice * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 text-sm space-y-2">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Shipping cost</span>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Free</span>
            </div>
            <hr className="border-slate-50 my-1" />
            <div className="flex justify-between text-base font-black text-slate-900">
              <span>Total Price</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </aside>

      </div>

    </div>
  );
};

export default Checkout;
