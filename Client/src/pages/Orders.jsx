import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, Calendar, DollarSign, Package, Eye, XCircle } from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getOrders(user.token);
        setOrders(data);
      } catch (err) {
        console.error('Error fetching customer orders', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'processing':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'shipped':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'delivered':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'cancelled':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Your Orders
        </h1>
        <p className="text-sm text-slate-500 mt-1">Review status and details of your shopping purchases</p>
      </div>

      {orders.length === 0 ? (
        /* Empty Orders View */
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-4">
          <ClipboardList className="h-14 w-14 text-slate-200 stroke-[1.5] mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Orders Yet</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xs">
            You haven't placed any orders on ShopEZ yet. Start shopping to fill your order ledger!
          </p>
        </div>
      ) : (
        /* Main Layout Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: List of orders */}
          <div className="lg:col-span-7 space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className={`p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all cursor-pointer ${
                  selectedOrder?._id === order._id ? 'border-primary-500 ring-1 ring-primary-500' : 'border-slate-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID</p>
                    <p className="text-sm font-semibold text-slate-700 truncate max-w-[200px] mt-0.5">{order._id}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:self-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="font-bold text-slate-400">Order Date</p>
                      <p className="font-semibold text-slate-700 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="font-bold text-slate-400">Total Spent</p>
                      <p className="font-extrabold text-slate-800 mt-0.5">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                    <Package className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="font-bold text-slate-400">Product Count</p>
                      <p className="font-semibold text-slate-700 mt-0.5">{order.products.length} Items</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right panel: Order Details Drawer */}
          <aside className="lg:col-span-5 rounded-3xl border border-slate-100 p-6 bg-white shadow-sm space-y-6">
            {selectedOrder ? (
              <div className="space-y-6 animate-fade-in">
                {/* Header detail */}
                <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-black text-slate-900 text-base">Order Details</h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {selectedOrder._id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>

                {/* Shipping info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Delivery Address</h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                    {selectedOrder.shippingAddress}
                  </p>
                  <div className="text-xs text-slate-500">
                    <span className="font-bold">Payment Option: </span>
                    <span className="font-medium">{selectedOrder.paymentMethod}</span>
                  </div>
                </div>

                {/* Items bought */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Items Purchased</h4>
                  <div className="divide-y divide-slate-100">
                    {selectedOrder.products.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        {item.productId ? (
                          <>
                            <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                              <img
                                src={item.productId.image}
                                alt={item.productId.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-bold text-slate-800 truncate">{item.productId.title}</h5>
                              <p className="text-[11px] text-slate-400 mt-0.5">Qty: {item.quantity} @ ${item.price.toFixed(2)}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-extrabold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-slate-400 italic">Product details unavailable</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total amount summary */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-500">Total Charged</span>
                  <span className="text-xl font-black text-primary-600">${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              /* No selection placeholder */
              <div className="py-12 text-center text-slate-400">
                <Eye className="h-8 w-8 mx-auto text-slate-300 stroke-[1.5] mb-2" />
                <p className="text-sm font-bold">Select an Order</p>
                <p className="text-xs text-slate-400 mt-1">Click any order on the left to inspect invoice details</p>
              </div>
            )}
          </aside>

        </div>
      )}

    </div>
  );
};

export default Orders;
