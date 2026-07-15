import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User as UserIcon, LogOut, LayoutDashboard, Shield, Menu, X, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full glass-nav shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                ShopEZ
              </span>
              <span className="text-primary-600 bg-primary-50 p-1.5 rounded-lg text-sm font-semibold border border-primary-100">
                E-STORE
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-primary-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`text-sm font-medium transition-colors ${
                isActive('/products') ? 'text-primary-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Products
            </Link>
          </div>

          {/* Action Icons */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-primary-600 transition-colors">
              <ShoppingBag className="h-6 w-6 stroke-[2]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white ring-2 ring-white animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary-500/10">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 animate-slide-up origin-top-right">
                    <div className="px-4 py-2 border-b border-slate-50">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-700 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-all"
                    >
                      <UserIcon className="h-4 w-4" />
                      My Profile
                    </Link>
                    
                    <Link
                      to="/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-all"
                    >
                      <ClipboardList className="h-4 w-4" />
                      My Orders
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50/50 transition-all font-medium border-t border-slate-50"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-all font-medium border-t border-slate-50 text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm font-semibold">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Link to="/cart" className="relative p-2 text-slate-600 mr-2">
              <ShoppingBag className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-4 space-y-3 animate-slide-down">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-primary-600"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-primary-600"
          >
            Products
          </Link>
          <hr className="border-slate-100" />
          {user ? (
            <>
              <div className="flex items-center gap-3 px-1 py-1">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 text-white flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-slate-600 hover:text-primary-600 pl-2"
              >
                My Profile
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-slate-600 hover:text-primary-600 pl-2"
              >
                My Orders
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-primary-600 hover:text-primary-700 pl-2 font-semibold"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left block text-base font-medium text-rose-600 hover:text-rose-700 pl-2 pt-2 border-t border-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-secondary py-2 text-center"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary py-2 text-center text-sm font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
