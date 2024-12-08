// CartContext.js
import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const isInCart = (item) => {
    return cartItems.some(cartItem => cartItem.id === item.id);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter(cartItem => cartItem.id !== itemId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};

// To use the CartContext in your components
export const useCart = () => useContext(CartContext);
