import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { ShoppingCart, Eye, Calendar, DollarSign, User, MapPin, XCircle } from 'lucide-react';

const AllOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAdminOrders(user.token);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch admin orders list', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadOrders();
    }
  }, [user]);

  // Handle status updates
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus, user.token);
      
      // Update local state lists
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );

      // If selected details matches, sync selected state too
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
      
      alert('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status', error);
      alert(error.response?.data?.message || 'Error updating order status');
    }
  };

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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Panel Content */}
      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Header Title */}
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Orders</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track shipping updates and fulfill customer orders</p>
        </div>

        {loading ? (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
            <ShoppingCart className="h-10 w-10 mx-auto text-slate-200 stroke-[1.5] mb-2" />
            <p className="text-sm font-bold">No Customer Orders</p>
            <p className="text-xs text-slate-400 mt-0.5">Orders will appear here once customers complete mock checkouts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Table of Orders */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="p-4 font-semibold">Customer</th>
                      <th className="p-4 font-semibold">Ordered Date</th>
                      <th className="p-4 font-semibold">Fulfillment</th>
                      <th className="p-4 font-semibold">Total Amount</th>
                      <th className="p-4 text-center font-semibold">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o._id} className="hover:bg-slate-50/10">
                        {/* Customer details */}
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{o.userId?.name || 'Guest User'}</p>
                          <span className="text-[10px] text-slate-400">{o.userId?.email || 'N/A'}</span>
                        </td>

                        {/* Date */}
                        <td className="p-4 text-slate-500 font-medium">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>

                        {/* Status update select */}
                        <td className="p-4">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleStatusChange(o._id, e.target.value)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer focus:outline-none capitalize ${getStatusColor(o.orderStatus)}`}
                          >
                            <option value="pending" className="bg-white text-slate-700">Pending</option>
                            <option value="processing" className="bg-white text-slate-700">Processing</option>
                            <option value="shipped" className="bg-white text-slate-700">Shipped</option>
                            <option value="delivered" className="bg-white text-slate-700">Delivered</option>
                            <option value="cancelled" className="bg-white text-slate-700">Cancelled</option>
                          </select>
                        </td>

                        {/* Total price */}
                        <td className="p-4 font-bold text-slate-900">
                          ${o.totalAmount.toFixed(2)}
                        </td>

                        {/* Inspect details */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-all"
                            title="Inspect details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Order Details Drawer */}
            <aside className="lg:col-span-4 rounded-3xl border border-slate-100 p-6 bg-white shadow-sm space-y-6">
              {selectedOrder ? (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Header info */}
                  <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-black text-slate-900 text-base">Invoice Details</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {selectedOrder._id}</p>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Customer Info Card */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customer Details</h4>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <User className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="font-bold">{selectedOrder.userId?.name || 'Guest User'}</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-600">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{selectedOrder.shippingAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Products bought */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ordered Items</h4>
                    <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto pr-1">
                      {selectedOrder.products.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                          {item.productId ? (
                            <>
                              <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                                <img src={item.productId.image} alt={item.productId.title} className="h-full w-full object-cover" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h5 className="text-[11px] font-bold text-slate-800 truncate">{item.productId.title}</h5>
                                <p className="text-[10px] text-slate-400">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-[11px] font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </>
                          ) : (
                            <span className="text-xs italic text-slate-400">Product details unavailable</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline text-sm">
                    <span className="font-bold text-slate-500">Invoice Total</span>
                    <span className="text-lg font-black text-primary-600">${selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>

                </div>
              ) : (
                /* No selection details placeholder */
                <div className="py-12 text-center text-slate-400">
                  <ShoppingCart className="h-8 w-8 mx-auto text-slate-300 stroke-[1.5] mb-2" />
                  <p className="text-sm font-bold">Select an Invoice</p>
                  <p className="text-xs text-slate-400 mt-1">Click the search icon in any row to inspect shipping logs</p>
                </div>
              )}
            </aside>

          </div>
        )}

      </main>

    </div>
  );
};

export default AllOrders;
