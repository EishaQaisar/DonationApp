"use client"

import { useState, useContext } from "react"
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ImageBackground, Text } from "react-native"
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
      {/* Background Image */}
      <ImageBackground source={require("../../assets/items/poor1.jpg")} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.container}>
          <CircleLogoStepper />
          <View style={styles.line} />

          <Text style={styles.title}>{t("chooseCategory.title", "Donation Categories")}</Text>

          {/* Education Category */}
          <TouchableOpacity
            style={[styles.categoryBox, hoveredCategory === "education" && styles.categoryBoxHovered]}
            onPress={() => navigation.navigate("UploadEdu")}
            onMouseEnter={() => setHoveredCategory("education")}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Text style={styles.categoryText}>{t("chooseCategory.education", "Education")}</Text>
          </TouchableOpacity>

          {/* Food Category */}
          <TouchableOpacity
            style={[styles.categoryBox, hoveredCategory === "food" && styles.categoryBoxHovered]}
            onPress={() => navigation.navigate("UploadFood")}
            onMouseEnter={() => setHoveredCategory("food")}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Text style={styles.categoryText}>{t("chooseCategory.food", "Food")}</Text>
          </TouchableOpacity>

          {/* Clothing Category */}
          <TouchableOpacity
            style={[styles.categoryBox, hoveredCategory === "clothes" && styles.categoryBoxHovered]}
            onPress={() => navigation.navigate("UploadClothes")}
            onMouseEnter={() => setHoveredCategory("clothes")}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Text style={styles.categoryText}>{t("chooseCategory.clothing", "Clothing")}</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.charcoalBlack,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginTop: 30,
    width: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: theme.colors.ivory,
    textAlign: "center",
    marginTop: 50,
    width: "100%",
  },
  categoryBox: {
    width: "90%",
    backgroundColor: "transparent",
    paddingVertical: 25,
    borderRadius: 15,
    marginVertical: 15,
    borderWidth: 2,
    borderColor: theme.colors.sageGreen,
    shadowColor: theme.colors.sageGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBoxHovered: {
    backgroundColor: theme.colors.sageGreen,
    borderColor: theme.colors.charcoalBlack,
  },
  categoryText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  line: {
    borderBottomWidth: 1,
    borderColor: theme.colors.sageGreen,
    marginVertical: 10,
    width: "80%",
  },
})

export default ChooseCategory

