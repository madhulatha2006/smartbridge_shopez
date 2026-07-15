import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { DollarSign, ShoppingCart, Users, Package, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [statusBreakdown, setStatusBreakdown] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await orderService.getAdminDashboard(user.token);
        setStats(data.stats);
        setStatusBreakdown(data.statusBreakdown);
        setRecentOrders(data.recentOrders);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'admin') {
      loadDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600"></div>
      </div>
    );
  }

  // Helper to color codes
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-amber-600 bg-amber-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'shipped':
        return 'text-purple-600 bg-purple-50';
      case 'delivered':
        return 'text-emerald-600 bg-emerald-50';
      case 'cancelled':
        return 'text-rose-600 bg-rose-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Stats Display Panel */}
      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Header Title */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Overview Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">Realtime e-store metrics and invoice summaries</p>
          </div>
          <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
            Live Database
          </div>
        </div>

        {/* 4 Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Sales */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Sales</p>
                <h3 className="text-2xl font-black text-slate-900">${stats.totalSales.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>

            {/* Orders */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Orders</p>
                <h3 className="text-2xl font-black text-slate-900">{stats.totalOrders}</h3>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <ShoppingCart className="h-6 w-6" />
              </div>
            </div>

            {/* Products */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Products</p>
                <h3 className="text-2xl font-black text-slate-900">{stats.totalProducts}</h3>
              </div>
              <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                <Package className="h-6 w-6" />
              </div>
            </div>

            {/* Customers */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customers</p>
                <h3 className="text-2xl font-black text-slate-900">{stats.totalCustomers}</h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
            </div>

          </div>
        )}

        {/* Breakdown section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Orders table */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recent Orders</h3>
              <Link to="/admin/orders" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No orders placed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 text-right font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50/50">
                        <td className="py-3 font-semibold text-slate-800">
                          <p className="truncate max-w-[120px]">{order.userId?.name || 'Guest User'}</p>
                          <span className="text-[10px] text-slate-400 font-normal">{order.userId?.email}</span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-right font-bold text-slate-900">
                          ${order.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Status Breakdown SVG summary chart */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-primary-500" />
              <span>Fulfillment Breakdown</span>
            </h3>

            <div className="space-y-4 pt-2">
              {statusBreakdown.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No status details available.</p>
              ) : (
                statusBreakdown.map((item) => (
                  <div key={item._id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="capitalize text-slate-600">{item._id}</span>
                      <span className="text-slate-800">{item.count} orders</span>
                    </div>
                    {/* SVG progress bar */}
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item._id === 'delivered'
                            ? 'bg-emerald-500'
                            : item._id === 'cancelled'
                            ? 'bg-rose-500'
                            : 'bg-primary-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (item.count / (stats?.totalOrders || 1)) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </main>
      
    </div>
  );
};

export default AdminDashboard;
