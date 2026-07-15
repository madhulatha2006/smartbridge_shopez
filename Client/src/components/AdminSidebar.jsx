import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, PlusCircle, ShoppingCart, ArrowLeft } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Overview',
      path: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'All Products',
      path: '/admin/products',
      icon: ShoppingBag,
    },
    {
      name: 'Add Product',
      path: '/admin/products/new',
      icon: PlusCircle,
    },
    {
      name: 'All Orders',
      path: '/admin/orders',
      icon: ShoppingCart,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-400 shrink-0 border-r border-slate-800 flex flex-col min-h-screen md:min-h-[calc(100vh-4rem)]">
      {/* Header Info */}
      <div className="p-6 border-b border-slate-800 bg-slate-950/40">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Admin Control</h2>
        <p className="text-xs text-slate-500 mt-1">Manage catalog and orders</p>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                active
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Back to main store */}
      <div className="p-4 border-t border-slate-800">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-white hover:bg-slate-800/40 transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Exit Dashboard</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
