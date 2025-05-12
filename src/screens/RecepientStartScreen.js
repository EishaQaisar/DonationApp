"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from "react-native"
import { theme } from "../core/theme" // Ensure theme usage
import i18n,{ t } from "../i18n"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"

// Category data with icons and descriptions
const categories = [
  {
    id: "education",
    name: "chooseCategory.education",
    defaultName: "Education",
    icon: "📚",
    description: "chooseCategory.educationDesc",
    defaultDescription: "Books, stationery, and educational resources",
    screen: "Education",
  },
  {
    id: "food",
    name: "chooseCategory.food",
    defaultName: "Food",
    icon: "🍲",
    description: "chooseCategory.foodDesc",
    defaultDescription: "Meals, groceries, and food supplies",
    screen: "Food",
  },
  {
    id: "clothes",
    name: "chooseCategory.clothing",
    defaultName: "Clothing",
    icon: "👕",
    description: "chooseCategory.clothingDesc",
    defaultDescription: "Clothes, shoes, and accessories for all ages",
    screen: "Clothes",
  },
]

const RecepientStartScreen = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight()

  const [hoveredCategory, setHoveredCategory] = useState(null)

  // Render a single category card
  const renderCategory = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryBox, hoveredCategory === category.id && styles.categoryBoxHovered]}
      onPress={() => navigation.navigate(category.screen)}
      onMouseEnter={() => setHoveredCategory(category.id)}
      onMouseLeave={() => setHoveredCategory(null)}
    >
      <View style={styles.categoryBoxInner}>
        <Text style={[styles.categoryIcon, hoveredCategory === category.id && styles.categoryIconHovered]}>
          {category.icon}
        </Text>

        <Text style={[styles.categoryText, hoveredCategory === category.id && styles.categoryTextHovered]}>
          {t(category.name, category.defaultName)}
        </Text>

        <Text
          style={[styles.categoryDescription, hoveredCategory === category.id && styles.categoryDescriptionHovered]}
        >
          {t(category.description, category.defaultDescription)}
        </Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[styles.safeContainer, { marginBottom: tabBarHeight }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t("chooseCategory.title", "Available Donations")}</Text>

        {/* Render all categories dynamically */}
        {categories.map(renderCategory)}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Light gray background color for a soft, professional look
    justifyContent: "center",
    paddingHorizontal: 10, // Reduced padding
  },
  container: {
    alignItems: "center",
    paddingVertical: 20, // Reduced padding
    flexGrow: 1,
    paddingHorizontal: 15, // Reduced horizontal padding
  },
  title: {
    fontSize: 30, // Reduced font size
    fontWeight: "700", // Less bold for a subtle look
    marginBottom: 25, // Reduced space
    color: theme.colors.sageGreen,
    textAlign: "center",
    fontFamily: "Roboto",
    letterSpacing: 0.4,
    textShadowColor: "rgba(42, 93, 75, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  categoryBox: {
    width: "90%", // Slightly smaller width
    backgroundColor: theme.colors.pearlWhite,
    paddingVertical: 20, // Reduced padding
    paddingHorizontal: 18, // Reduced padding
    borderRadius: 20, // Less rounded corners
    marginVertical: 12, // Reduced vertical margin
    borderWidth: 2,
    borderColor: theme.colors.sageGreen,
    shadowColor: theme.colors.sageGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8, // Reduced elevation
    transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },
  categoryBoxHovered: {
    backgroundColor: theme.colors.sageGreen,
    borderColor: theme.colors.copper,
    transform: [{ scale: 1.05 }, { translateY: -4 }],
    shadowColor: theme.colors.sageGreen,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,
  },
  categoryText: {
    fontSize: 22, // Reduced font size
    fontWeight: "500", // Slightly lighter
    color: theme.colors.ivory,
    textAlign: "center",
    fontFamily: "Roboto",
    letterSpacing: 0.4,
    transition: "color 0.3s ease",
  },
  categoryTextHovered: {
    color: theme.colors.pearlWhite,
    fontWeight: "600",
    letterSpacing: 0.6,
  },
  categoryIcon: {
    fontSize: 28, // Reduced icon size
    marginBottom: 10, // Reduced space
    color: theme.colors.sageGreen,
  },
  categoryIconHovered: {
    color: theme.colors.pearlWhite,
  },
  categoryBoxInner: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
  categoryDescription: {
    fontSize:i18n.locale=='ur'?15: 14, // Reduced font size
    color: theme.colors.placeholder || "#8A8F8D",
    marginTop: 5, // Reduced space
    textAlign: "center",
    fontFamily: "Roboto",
    maxWidth: "80%", // Reduced max width for better spacing
  },
  categoryDescriptionHovered: {
    color: theme.colors.copper,
  },
})

export default RecepientStartScreen
