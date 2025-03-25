"use client"

// src/context/AuthContext.js
import { createContext, useState, useContext, useEffect } from "react"
import { initializeI18n, changeLanguage } from "../i18n"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [language, setLanguage] = useState("en")
  const [isRTL, setIsRTL] = useState(false)
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false)

  // Initialize language when the context is created
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        // Load the pre-login language preference
        const initialLocale = await initializeI18n()
        setLanguage(initialLocale)
        setIsRTL(initialLocale === "ur")
        setIsLanguageLoaded(true)
      } catch (error) {
        console.error("Error loading language:", error)
        setLanguage("en")
        setIsRTL(false)
        setIsLanguageLoaded(true)
      }
    }

    loadLanguage()
  }, [])

  // Function to update language
  const updateLanguage = async (newLanguage) => {
    try {
      const result = await changeLanguage(newLanguage)

      if (result.success) {
        setLanguage(newLanguage)
        setIsRTL(newLanguage === "ur")

        return result
      }

      return { success: false }
    } catch (error) {
      console.error("Error updating language:", error)
      return { success: false }
    }
  }

  // Function to set user with custom login logic
  const login = (userData) => {
    setUser(userData)
    // Reset language to English when a new user logs in
    // This ensures each test user gets a fresh language setting
    updateLanguage("en")
  }

  // Function to handle logout
  const logout = () => {
    setUser(null)
    // We don't reset language on logout, so the pre-login language preference persists
  }

  // Don't render children until language is loaded
  if (!isLanguageLoaded) {
    return null // Or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        language,
        updateLanguage,
        isRTL,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

