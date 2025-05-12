"use client"

import { useState, useContext, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import { theme } from "../core/theme"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import Icon from "react-native-vector-icons/MaterialIcons"
import { AuthContext } from "../context/AuthContext"
import { getBaseUrl } from "../helpers/deviceDetection"
import axios from "axios"
import i18n, { t } from "../i18n"

const { width } = Dimensions.get("window")
const cardWidth = width * 0.75

const DonorHomeScreen = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight()
  const { user } = useContext(AuthContext)
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("education")

  // Fetch campaigns data when component mounts
  const fetchCampaigns = async () => {
    try {
      const BASE_URL = await getBaseUrl()
      const response = await axios.get(`${BASE_URL}/api/get-ngo-campaigns`)
      setCampaigns(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching campaigns:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const handleCategoryPress = (category) => {
    setActiveCategory(category)
    navigation.navigate(category.charAt(0).toUpperCase() + category.slice(1))
  }

  // Helper function to safely get translation strings
  const getTranslation = (key) => {
    try {
      // Make sure we're getting a string, not an object
      const translation = t(key)
      return typeof translation === "string" ? translation : key.split(".").pop()
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error)
      return key.split(".").pop() // Fallback to the last part of the key
    }
  }

  return (
    <View style={[styles.container, { marginBottom: tabBarHeight }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Enhanced Banner Section */}
        <ImageBackground source={require("../../assets/items/donorp1.jpg")} style={styles.bannerBackground}>
          <View style={styles.bannerOverlay}>
            <View style={styles.bannerContent}>
              <View>
                <Text style={styles.welcomeText}>{getTranslation("donorHome.greeting")}</Text>
                <Text style={styles.usernameText}>{user?.username || "User"}</Text>
              </View>

              
            </View>

            {/* Impact Stats */}
            <View style={styles.impactContainer}>
              <View style={styles.impactItem}>
                <Text style={styles.impactValue}>12</Text>
                <Text style={styles.impactLabel}>{getTranslation("donorHome.donations")}</Text>
              </View>
              <View style={styles.impactDivider} />
              <View style={styles.impactItem}>
                <Text style={styles.impactValue}>3</Text>
                <Text style={styles.impactLabel}>{getTranslation("donorHome.causes")}</Text>
              </View>
              <View style={styles.impactDivider} />
              <View style={styles.impactItem}>
                <Text style={styles.impactValue}>$240</Text>
                <Text style={styles.impactLabel}>{getTranslation("donorHome.impact")}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* Enhanced Donation Categories */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{getTranslation("donorHome.donations")}</Text>

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
                {getTranslation("donorHome.education")}
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
                {getTranslation("donorHome.clothes")}
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
                {getTranslation("donorHome.food")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Hero Section */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={require("../../assets/items/give.jpg")}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{getTranslation("donorHome.hero.title")}</Text>
                <TouchableOpacity style={styles.heroButton} onPress={() => navigation.navigate("ChooseCategory")}>
                  <Text style={styles.heroButtonText}>{getTranslation("donorHome.hero.button")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Enhanced Features Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{getTranslation("donorHome.features.title")}</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuresScrollContainer}
          >
            <TouchableOpacity onPress={() => navigation.navigate("ScheduleRDeliveryScreen")} style={styles.featureCard}>
              <ImageBackground
                source={require("../../assets/items/sch4.jpg")}
                style={styles.featureImage}
                imageStyle={styles.featureImageStyle}
              >
                <View style={styles.featureOverlay}>
                  <View style={styles.featureContent}>
                    <Icon name="schedule" size={24} color="#fff" style={styles.featureIcon} />
                    <Text style={styles.featureText}>{getTranslation("donorHome.features.scheduleDelivery")}</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("DonorOrderTrackingScreen")}
              style={styles.featureCard}
            >
              <ImageBackground
                source={require("../../assets/items/moni.jpg")}
                style={styles.featureImage}
                imageStyle={styles.featureImageStyle}
              >
                <View style={styles.featureOverlay}>
                  <View style={styles.featureContent}>
                    <Icon name="location-on" size={24} color="#fff" style={styles.featureIcon} />
                    <Text style={styles.featureText}>{getTranslation("donorHome.features.monitorDelivery")}</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("DonorOrderTrcaking")} style={styles.featureCard}>
              <ImageBackground
                source={require("../../assets/items/viewanalytics2.jpg")}
                style={styles.featureImage}
                imageStyle={styles.featureImageStyle}
              >
                <View style={styles.featureOverlay}>
                  <View style={styles.featureContent}>
                    <Icon name="insert-chart" size={24} color="#fff" style={styles.featureIcon} />
                    <Text style={styles.featureText}>{getTranslation("donorHome.features.viewAnalytics")}</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Enhanced Campaigns Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{getTranslation("donorHome.campaigns.title")}</Text>
            <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate("ViewNgoPostsScreen")}>
              <Text style={styles.viewAllText}>{getTranslation("donorHome.campaigns.viewAll")}</Text>
              {i18n.locale === "ur" ? (
                <Icon name="arrow-back" size={16} color={theme.colors.sageGreen} />
              ) : (
                <Icon name="arrow-forward" size={16} color={theme.colors.sageGreen} />
              )}
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.sageGreen} />
              <Text style={styles.loadingText}>{getTranslation("donorHome.campaigns.loading")}</Text>
            </View>
          ) : campaigns.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.campaignsScrollContainer}
            >
              {campaigns.slice(0, 3).map((campaign) => (
                <TouchableOpacity
                  key={campaign.id}
                  onPress={() =>
                    navigation.navigate("NgoPostDetailsScreen", {
                      id: campaign.id,
                      title: campaign.campaignTitle,
                      description: campaign.fullDescription,
                      image: campaign.image,
                      phoneNumber: campaign.phoneNumber,
                      email: campaign.email,
                      bankAccount: campaign.bankAccount,
                      ngoName: campaign.ngoName,
                      createdAt: campaign.createdAt,
                    })
                  }
                  style={styles.campaignCard}
                >
                  <ImageBackground
                    source={{ uri: campaign.image }}
                    style={styles.campaignImage}
                    imageStyle={styles.campaignImageStyle}
                  >
                    <View style={styles.campaignImageOverlay}>
                      <View style={styles.campaignBadge}>
                        <Text style={styles.campaignBadgeText}>{i18n.t("donorHome.campaigns.urgent")}</Text>
                      </View>
                    </View>
                  </ImageBackground>

                  <View style={styles.campaignContent}>
                    <Text style={styles.campaignTitle} numberOfLines={1}>
                      {campaign.campaignTitle}
                    </Text>
                    <Text style={styles.campaignOrg} numberOfLines={1}>
                      {campaign.ngoName}
                    </Text>

                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: "65%" }]} />
                      </View>
                      <View style={styles.progressStats}>
                        <Text style={styles.progressText}>
                          {i18n.t("donorHome.campaigns.fundedPercent", { percent: "65%" })}
                        </Text>
                        <Text style={styles.daysLeftText}>
                          {i18n.t("donorHome.campaigns.daysLeft", { days: "12" })}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noCampaignsContainer}>
              <Icon name="campaign" size={50} color={theme.colors.sageGreen} style={styles.noCampaignsIcon} />
              <Text style={styles.noCampaignsText}>{getTranslation("donorHome.campaigns.noCampaigns")}</Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => {
                  setLoading(true)
                  fetchCampaigns()
                }}
              >
                <Text style={styles.refreshButtonText}>{getTranslation("donorHome.campaigns.refresh")}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Extra padding at bottom */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.charcoalBlack, // Light gray-blue background
  },
  // Banner Section
  bannerBackground: {
    height: 220,
    width: "100%",
  },
  bannerOverlay: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)", // Keep dark overlay for readability on image
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
    color: "#fff", // White for contrast on dark overlay
    fontSize: 16,
    opacity: 0.9,
  },
  usernameText: {
    color: "#fff", // White for contrast on dark overlay
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  impactContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    marginTop: 20,
    padding: 15,
    justifyContent: "space-between",
  },
  impactItem: {
    flex: 1,
    alignItems: "center",
  },
  impactValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  impactLabel: {
    color: "#fff",
    marginTop: 5,
    opacity: 0.8,
    fontSize: i18n.locale === "ur" ? 16: 12,

  },
  impactDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  // Section Containers
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    color: theme.colors.TaupeBlack, // Deep slate blue
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  // Categories Section
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
    backgroundColor: theme.colors.outerSpace, // Soft blue-gray
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
    color: theme.colors.TaupeBlack, // Deep slate blue
        fontSize: i18n.locale === "ur" ? 16 : 14,

    marginTop: 5,
  },
  activeCategoryText: {
    color: theme.colors.sageGreen,
    fontWeight: "bold",
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
    backgroundColor: "rgba(0,0,0,0.4)", // Keep dark overlay for readability on image
    justifyContent: "center",
    padding: 20,
  },
  heroContent: {
    width: "70%",
  },
  heroTitle: {
    color: "#fff", // White for contrast on dark overlay
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    lineHeight: 32,
  },
  heroButton: {
    backgroundColor: theme.colors.sageGreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  heroButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  // Features Section
  featuresScrollContainer: {
    paddingBottom: 10,
  },
  featureCard: {
    width: 180,
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 15,
    borderWidth: 1,
    borderColor: theme.colors.outerSpace,

  },
  featureImage: {
    width: "100%",
    height: "100%",
  },
  featureImageStyle: {
    borderRadius: 16,
  },
  featureOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // Keep dark overlay for readability on image
    justifyContent: "flex-end",
  },
  featureContent: {
    padding: 15,
  },
  featureIcon: {
    marginBottom: 8,
  },
  featureText: {
    color: "#fff", // White for contrast on dark overlay
    fontSize: i18n.locale === "ur" ? 15: 14,

    fontWeight: "bold",
  },

  // Campaigns Section
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    color: theme.colors.sageGreen,
    fontSize: i18n.locale === "ur" ? 16 : 14,
    marginRight: 5,
    marginLeft: 5,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    backgroundColor: theme.colors.outerSpace, // Soft blue-gray
    borderRadius: 16,
  },
  loadingText: {
    color: theme.colors.TaupeBlack, // Deep slate blue
    marginTop: 10,
    fontSize: 14,
  },
  campaignsScrollContainer: {
    paddingBottom: 10,
  },
  campaignCard: {
    width: cardWidth,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginRight: 15,
    borderWidth: 1,
    borderColor: theme.colors.outerSpace,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  campaignImage: {
    width: "100%",
    height: 150,
  },
  campaignImageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  campaignImageOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: 15,
  },
  campaignBadge: {
    backgroundColor: theme.colors.sageGreen,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  campaignBadgeText: {
    color: "#fff",
    fontSize: i18n.locale === "ur" ? 12 : 10,

    fontWeight: "bold",
  },
  campaignContent: {
    padding: 15,
  },
  campaignTitle: {
    color: theme.colors.TaupeBlack, // Deep slate blue
    fontSize: i18n.locale === "ur" ? 18 : 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  campaignOrg: {
    color: theme.colors.placeholder, // Soft slate blue
    fontSize: i18n.locale === "ur" ? 16 : 14,
    marginBottom: 15,
  },
  progressContainer: {
    marginTop: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.outerSpace, // Soft blue-gray
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.sageGreen,
    borderRadius: 3,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  progressText: {
    color: theme.colors.sageGreen,
    fontSize: i18n.locale === "ur" ? 15: 12,
    fontWeight: "bold",
  },
  daysLeftText: {
    color: theme.colors.placeholder, // Soft slate blue
    fontSize: i18n.locale === "ur" ? 15 : 12,
  },
  noCampaignsContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.outerSpace,
  },
  noCampaignsIcon: {
    marginBottom: 15,
    opacity: 0.7,
  },
  noCampaignsText: {
    color: theme.colors.TaupeBlack, // Deep slate blue
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  refreshButton: {
    backgroundColor: theme.colors.sageGreen,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
})

export default DonorHomeScreen
