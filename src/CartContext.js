// CartContext.js
import React, { createContext, useState, useContext } from 'react';
import firestore from "@react-native-firebase/firestore"
import { AuthContext } from "./context/AuthContext"
import { UserProfileContext } from "./context/UserProfileContext"

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item,category) => {
    const newItem = { ...item, category }; // Assign category to item
    setCartItems((prevItems) => [...prevItems, newItem]);

  };

  const isInCart = (item) => {

    return cartItems.some(cartItem => cartItem.id === item.id);
  };

  const removeFromCart =async (item) => {
    const itemId=item.id
    const itemKP=khairPointsPerCategory[item.category]* item.quantity
    const currentKP=userProfile.khairPoints
    const newKP=currentKP + itemKP;
    const success = await updateKhairPoints(newKP)

    setCartItems((prevItems) => prevItems.filter(cartItem => cartItem.id !== itemId));
  };

  const { userProfile, setUserProfile } = useContext(UserProfileContext)
const { user } = useContext(AuthContext)


const [isUpdating, setIsUpdating] = useState(false)

  // Function to update khair points directly in this component
  const updateKhairPoints = async (newPoints) => {
    console.log(isUpdating)
    console.log(userProfile)
    if (!userProfile || isUpdating) return false

    setIsUpdating(true)
    try {
      // Update in Firestore
      console.log("here");
      await firestore().collection("individual_profiles").doc(user.uid).update({
        khairPoints: newPoints,
      })

      // Update local state in context using functional update pattern
      setUserProfile((prevProfile) => ({
        ...prevProfile, // This preserves ALL existing properties
        khairPoints: newPoints,
      }))

      console.log("Khair points updated successfully")
      return true
    } catch (error) {
      console.error("Error updating khair points:", error)
      return false
    } finally {
      setIsUpdating(false)
    }
  }

const khairPointsPerCategory = {
  Food: 10,
  Education: 20,
  Clothes: 15,
}



  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};

// To use the CartContext in your components
export const useCart = () => useContext(CartContext);
