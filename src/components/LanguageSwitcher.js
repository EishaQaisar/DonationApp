"use client"

import { View, TouchableOpacity, StyleSheet, Text, Alert, I18nManager } from "react-native"
import { useContext } from "react"
import { theme } from "../core/theme"
import { AuthContext } from "../context/AuthContext"
import i18n, { t } from "../i18n"

const LanguageSwitcher = () => {
  const { language, updateLanguage } = useContext(AuthContext)

  const handleLanguageChange = async (newLanguage) => {
    if (newLanguage === language) return

    await updateLanguage(newLanguage)

    // Check if the selected language requires RTL layout
    const isRTL = newLanguage === "ur"

    // Apply RTL settings
    await I18nManager.forceRTL(isRTL)
    Alert.alert(t("languageSwitcher.restartTitle"), t("languageSwitcher.restartMessage"), [
      { text: t("languageSwitcher.ok"), style: "default" }
    ])

    if (isRTL) {
      await I18nManager.doLeftAndRightSwapInRTL()
    }

   
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.languageButton, language === "en" && styles.activeLanguage]}
        onPress={() => handleLanguageChange("en")}
      >
        <Text style={[styles.languageText, language === "en" && styles.activeLanguageText]}>English</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.languageButton, language === "ur" && styles.activeLanguage]}
        onPress={() => handleLanguageChange("ur")}
      >
        <Text style={[styles.languageText, language === "ur" && styles.activeLanguageText]}>اردو</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
  },
  languageButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.sageGreen,
    marginHorizontal: 5,
    minWidth: 80,
    alignItems: "center",
  },
  activeLanguage: {
    backgroundColor: theme.colors.sageGreen,
  },
  languageText: {
    color: theme.colors.ivory,
    fontSize: 14,
  },
  activeLanguageText: {
    color: theme.colors.charcoalBlack,
    fontWeight: "bold",
  },
})

export default LanguageSwitcher
