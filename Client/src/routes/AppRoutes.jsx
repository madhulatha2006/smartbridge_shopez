import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Customer Page imports
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Profile from '../pages/Profile';
import Orders from '../pages/Orders';

// Admin Page imports
import AdminDashboard from '../pages/AdminDashboard';
import AllProducts from '../pages/AllProducts';
import NewProduct from '../pages/NewProduct';
import AllOrders from '../pages/AllOrders';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Protected Pages */}
      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
      </Route>

      {/* Admin Protected Pages */}
      <Route element={<ProtectedRoute adminOnly={true} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AllProducts />} />
        <Route path="/admin/products/new" element={<NewProduct />} />
        <Route path="/admin/products/edit/:id" element={<NewProduct />} />
        <Route path="/admin/orders" element={<AllOrders />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
