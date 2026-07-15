import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart when user changes
  useEffect(() => {
    const fetchCart = async () => {
      if (user && user.token) {
        setLoading(true);
        try {
          const dbCart = await cartService.getCart(user._id, user.token);
          setCartItems(dbCart);
        } catch (error) {
          console.error('Failed to fetch cart from server', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Clear cart items if user logs out
        setCartItems([]);
      }
    };

    fetchCart();
  }, [user]);

  // Add Item to Cart
  const addItemToCart = async (product, quantity = 1) => {
    if (!user) {
      // Local cart behavior for guest user or prompt to login
      alert('Please log in to add products to your cart.');
      return;
    }

    try {
      const response = await cartService.addToCart(
        { userId: user._id, productId: product._id, quantity },
        user.token
      );
      
      // Update state
      setCartItems((prevItems) => {
        const exists = prevItems.find((item) => item.productId._id === product._id);
        if (exists) {
          return prevItems.map((item) =>
            item.productId._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevItems, response];
      });
    } catch (error) {
      console.error('Error adding to cart', error);
      alert(error.response?.data?.message || 'Error adding to cart');
    }
  };

  // Update Item Quantity
  const updateItemQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    if (!user) return;

    try {
      const item = cartItems.find((item) => item.productId._id === productId);
      if (!item) return;

      await cartService.updateCart(
        { cartItemId: item._id, quantity: newQuantity },
        user.token
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating cart quantity', error);
    }
  };

  // Remove Item from Cart
  const removeItemFromCart = async (cartItemId) => {
    if (!user) return;

    try {
      await cartService.removeFromCart(cartItemId, user.token);
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== cartItemId));
    } catch (error) {
      console.error('Error removing from cart', error);
    }
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate totals
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cartItems.reduce((total, item) => {
    if (!item.productId) return total;
    const finalPrice = item.productId.price * (1 - (item.productId.discount || 0) / 100);
    return total + finalPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
