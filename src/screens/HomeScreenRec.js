"use client"

import { useContext, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  StatusBar,
  Dimensions,
} from "react-native"
import { theme } from "../core/theme"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import Icon from "react-native-vector-icons/MaterialIcons"
import { AuthContext } from "../context/AuthContext"
import i18n, { t } from "../i18n"

const { width } = Dimensions.get("window")

const HomeScreenRec = ({ navigation, route }) => {
  const tabBarHeight = useBottomTabBarHeight()
  const { role, type } = route.params
  const { user } = useContext(AuthContext)
  const isUrdu = i18n.locale === "ur"
  const [activeCategory, setActiveCategory] = useState("education")

  // Helper function to safely get translation strings
  const getTranslation = (key) => {
    try {
      const translation = t(key)
      return typeof translation === "string" ? translation : key.split(".").pop()
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error)
      return key.split(".").pop()
    }
  }

  const handleCategoryPress = (category) => {
    setActiveCategory(category)
    navigation.navigate(category.charAt(0).toUpperCase() + category.slice(1))
  }

  return (
    <View style={[styles.container, { marginBottom: tabBarHeight }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.charcoalBlack} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Section */}
        <ImageBackground source={require("../../assets/items/hi_rec.jpg")} style={styles.bannerBackground}>
          <View style={styles.bannerOverlay}>
            <View style={styles.bannerContent}>
              <View>
                <Text style={styles.welcomeText}>{getTranslation("recipientScreen.greeting")}</Text>
                <Text style={styles.usernameText}>{user?.username || "User"}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
            {/* Donation Categories - Styled like donor home screen */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{getTranslation("recipientScreen.availableDonations")}</Text>

          <View style={styles.categoriesContainer}>
            <TouchableOpacity
              style={[styles.categoryButton, activeCategory === "education" && styles.activeCategoryButton]}
              onPress={() => handleCategoryPress("education")}
            >
              <View
                style={[
                  styles.categoryIconContainer,
                  activeCategory === "education" && styles.activeCategoryIconContainer,
                ]}
              >
                <Icon
                  name="school"
                  size={28}
                  color={activeCategory === "education" ? "#fff" : theme.colors.sageGreen}
                />
              </View>
              <Text style={[styles.categoryText, activeCategory === "education" && styles.activeCategoryText]}>
                {getTranslation("recipientScreen.education")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.categoryButton, activeCategory === "clothes" && styles.activeCategoryButton]}
              onPress={() => handleCategoryPress("clothes")}
            >
              <View
                style={[
                  styles.categoryIconContainer,
                  activeCategory === "clothes" && styles.activeCategoryIconContainer,
                ]}
              >
                <Icon
                  name="checkroom"
                  size={28}
                  color={activeCategory === "clothes" ? "#fff" : theme.colors.sageGreen}
                />
              </View>
              <Text style={[styles.categoryText, activeCategory === "clothes" && styles.activeCategoryText]}>
                {getTranslation("recipientScreen.clothes")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.categoryButton, activeCategory === "food" && styles.activeCategoryButton]}
              onPress={() => handleCategoryPress("food")}
            >
              <View
                style={[styles.categoryIconContainer, activeCategory === "food" && styles.activeCategoryIconContainer]}
              >
                <Icon
                  name="local-dining"
                  size={28}
                  color={activeCategory === "food" ? "#fff" : theme.colors.sageGreen}
                />
              </View>
              <Text style={[styles.categoryText, activeCategory === "food" && styles.activeCategoryText]}>
                {getTranslation("recipientScreen.food")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* Hero Card */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={require("../../assets/items/poor.jpeg")}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.heroContent}>
                <Text style={[styles.heroTitle, { fontSize: isUrdu ? 26 : 18 }]}>
                  {getTranslation("recipientScreen.motivational_text")}
                </Text>
                <TouchableOpacity style={styles.heroButton} onPress={() => navigation.navigate("RecepientStartScreen")}>
                  <Text style={styles.heroButtonText}>{getTranslation("recipientScreen.claimNow")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

    
        {/* Post Campaign Button for NGOs */}
        {role === "recipient" && user.recipientType === "ngo" && (
          <View style={styles.postCampaignContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("NGOCampaignForm")} style={styles.postCampaignButton}>
              <Icon name="add-circle" size={24} color={theme.colors.ivory} style={styles.buttonIcon} />
              <Text style={styles.postCampaignText}>{getTranslation("recipientScreen.postCampaign")}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Extra padding at bottom */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.charcoalBlack,
  },
  // Banner Section
  bannerBackground: {
    height: 180,
    width: "100%",
  },
  bannerOverlay: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  bannerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    color: "#fff",
    fontSize: i18n.locale === "ur" ? 18: 16,
    
    opacity: 0.9,
  },
  usernameText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },

  // Hero Section
  heroContainer: {
    marginTop: 25,
    marginHorizontal: 20,
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroImageStyle: {
    borderRadius: 20,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "space-between",
    padding: 20,
  },
  heroContent: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroTitle: {
    color: "#fff",
    fontWeight: "bold",
    width: "60%",
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heroButton: {
    backgroundColor: theme.colors.sageGreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
  },
  heroButtonText: {
    color: theme.colors.ivory,
    fontSize: 16,
    fontWeight: "bold",
  },

  // Section Containers
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: theme.colors.ivory,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  // Categories Section - Styled like donor home screen
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryButton: {
    alignItems: "center",
    width: "30%",
  },
  activeCategoryButton: {
    transform: [{ scale: 1.05 }],
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.outerSpace,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.sageGreen,
  },
  activeCategoryIconContainer: {
    backgroundColor: theme.colors.sageGreen,
  },
  categoryText: {
    color: theme.colors.ivory,
    marginTop: 5,
    fontSize: i18n.locale === "ur" ? 16: 14,
    
  },
  activeCategoryText: {
    color: theme.colors.sageGreen,
    fontWeight: "bold",
  },

  // Post campaign button
  postCampaignContainer: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  postCampaignButton: {
    backgroundColor: theme.colors.sageGreen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  postCampaignText: {
    color: theme.colors.ivory,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default HomeScreenRec
