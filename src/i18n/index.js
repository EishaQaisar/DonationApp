import * as Localization from "expo-localization"
import { I18nManager } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Import i18n-js with proper initialization
import { I18n } from "i18n-js" // Note: newer versions use { I18n } instead of default import

// Create a new i18n instance
const i18n = new I18n()

// Import translations
import en from "./translations/en.json"
import ur from "./translations/ur.json"

// Set up translations
i18n.translations = {
  en,
  ur,
}

// Default to English
i18n.locale = "en"
i18n.defaultLocale = "en"
i18n.enableFallback = true // Note: newer versions use enableFallback instead of fallbacks

// Key for storing pre-login language preference
const PRE_LOGIN_LANGUAGE_KEY = "@pre_login_language"

// Initialize i18n with default locale
export const initializeI18n = async (savedLanguage = null) => {
  try {
    let localeToUse

    if (savedLanguage) {
      // Use provided language preference
      localeToUse = savedLanguage
    } else {
      try {
        // Try to get saved pre-login language from AsyncStorage
        const storedLanguage = await AsyncStorage.getItem(PRE_LOGIN_LANGUAGE_KEY)
        if (storedLanguage) {
          localeToUse = storedLanguage
        } else {
          // Use device locale as default, or fall back to English
          const deviceLocale = Localization.locale.split("-")[0]
          localeToUse = i18n.translations[deviceLocale] ? deviceLocale : "en"
        }
      } catch (error) {
        console.error("Error reading from AsyncStorage:", error)
        // Fall back to device locale or English
        const deviceLocale = Localization.locale.split("-")[0]
        localeToUse = i18n.translations[deviceLocale] ? deviceLocale : "en"
      }
    }

    i18n.locale = localeToUse

    // Handle RTL for Urdu
    if (localeToUse === "ur" && !I18nManager.isRTL) {
      I18nManager.forceRTL(true)
    } else if (localeToUse !== "ur" && I18nManager.isRTL) {
      I18nManager.forceRTL(false)
    }

    return localeToUse
  } catch (error) {
    console.error("Error initializing i18n:", error)
    i18n.locale = "en"
    return "en"
  }
}

// Function to change language
export const changeLanguage = async (language) => {
  try {
    const currentLanguage = i18n.locale

    // Don't do anything if language is already set
    if (currentLanguage === language) {
      return { success: true, restart: false }
    }

    i18n.locale = language

    // Save to AsyncStorage as pre-login preference
    try {
      await AsyncStorage.setItem(PRE_LOGIN_LANGUAGE_KEY, language)
    } catch (storageError) {
      console.error("Error saving language preference:", storageError)
    }

    // Check if we need to change RTL setting
    const isCurrentRTL = I18nManager.isRTL
    const shouldBeRTL = language === "ur"

    // If RTL state needs to change, we need to restart the app
    const needsRestart = isCurrentRTL !== shouldBeRTL

    if (needsRestart) {
      I18nManager.forceRTL(shouldBeRTL)
    }

    return { success: true, restart: needsRestart, language }
  } catch (error) {
    console.error("Error changing language:", error)
    return { success: false, restart: false }
  }
}

// Get current locale
export const getCurrentLocale = () => i18n.locale

// Export the translate function
export const t = (key, options) => {
  if (!key) return ""

  // Handle nested keys like 'screen.component.text'
  const result = i18n.t(key, { defaultValue: key, ...options })

  // If the result is the same as the key, it means translation is missing
  return result
}

export default i18n

