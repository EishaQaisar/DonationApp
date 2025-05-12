"use client"

import { useState, useContext } from "react"
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Text } from "react-native"
import { theme } from "../core/theme"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import CircleLogoStepper from "../components/CircleLogoStepper"
import { AuthContext } from "../context/AuthContext"
import { t } from "../i18n"
import RTLText from "../components/RTLText"

const ChooseCategory = ({ navigation }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const tabBarHeight = useBottomTabBarHeight()
  const { isRTL } = useContext(AuthContext)

  return (
    <SafeAreaView style={[styles.safeContainer, { marginBottom: tabBarHeight }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <CircleLogoStepper />
        <View style={styles.line} />

        <Text style={styles.title}>{t("chooseCategory.title", "Donation Categories")}</Text>

        {/* Category List */}
        {[
          { label: t("chooseCategory.education", "Education"), nav: "UploadEdu", key: "education" },
          { label: t("chooseCategory.food", "Food"), nav: "UploadFood", key: "food" },
          { label: t("chooseCategory.clothing", "Clothing"), nav: "UploadClothes", key: "clothes" }
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.categoryBox,
              hoveredCategory === item.key && styles.categoryBoxHovered
            ]}
            onPress={() => navigation.navigate(item.nav)}
            onMouseEnter={() => setHoveredCategory(item.key)}
            onMouseLeave={() => setHoveredCategory(null)}
            activeOpacity={0.85}
          >
            <Text style={styles.categoryText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.charcoalBlack,
  },
  container: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.ivory,
    marginBottom: 30,
    marginTop: 20,
    textAlign: "center",
  },
  line: {
    borderBottomWidth: 1,
    borderColor: theme.colors.sageGreen,
    marginVertical: 15,
    width: "80%",
  },
  categoryBox: {
    width: "100%",
    backgroundColor: theme.colors.sageGreen,
    borderWidth: 2,
    borderColor: theme.colors.sageGreen,
    borderRadius: 14,
    paddingVertical: 25,
    marginVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.sageGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  categoryBoxHovered: {
    backgroundColor: theme.colors.sageGreen,
  },
  categoryText: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.ivory,
    textAlign: "center",
  },
})

export default ChooseCategory