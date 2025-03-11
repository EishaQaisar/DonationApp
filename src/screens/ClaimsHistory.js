"use client"

import { useState, useEffect, useContext } from "react"
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native"
import { theme } from "../core/theme"
import { AuthContext } from "../context/AuthContext"
import { getBaseUrl } from "../helpers/deviceDetection"
import axios from "axios"

const ClaimsHistory = () => {
  const [clothesClaims, setClothesClaims] = useState([])
  const [foodClaims, setFoodClaims] = useState([])
  const [educationClaims, setEducationClaims] = useState([])
  const [activeTab, setActiveTab] = useState("clothes")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchClaims = async () => {
      if (!user?.username) {
        setLoading(false) // Stop loading if no user ID is available
        return
      }

      console.log("Fetching claims history for user:", user.username)

      try {
        const BASE_URL = await getBaseUrl()

        try {
          // Fetch all claimed items for this user from a single endpoint
          const claimsResponse = await axios.get(`${BASE_URL}/api/user-claimed-items?userId=${user.username}`)
          console.log(`Found ${claimsResponse.data.length} claimed items for this user.`)
          
          // Filter the claims by item type
          const clothesItems = claimsResponse.data.filter(item => item.donationType === "Clothes")
          const foodItems = claimsResponse.data.filter(item => item.donationType === "Food")
          const educationItems = claimsResponse.data.filter(item => item.donationType === "Education")
          
          setClothesClaims(clothesItems)
          setFoodClaims(foodItems)
          setEducationClaims(educationItems)
        } catch (err) {
          console.error("Error fetching claimed items:", err)
          setError("Failed to load claimed items")
        }
      } catch (err) {
        console.error("Error getting base URL:", err)
        setError("Failed to connect to server")
      } finally {
        setLoading(false)
      }
    }

    fetchClaims()
  }, [user?.username])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your claims history...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  const renderClothesItem = ({ item }) => (
    <View style={styles.claimItem}>
      <Text style={styles.claimTitle}>{item.itemName || item.itemCategory || "Unnamed Item"}</Text>

      <View style={styles.claimDetails}>
        <Text style={styles.categoryInfo}>Category: {item.donationType || item.itemCategory || "Unknown"}</Text>

        {item.gender && <Text style={styles.genderInfo}>Gender: {item.gender}</Text>}

        {item.upperWearSize && <Text style={styles.sizeInfo}>Upper Wear Size: {item.upperWearSize}</Text>}

        {item.bottomWearSize && <Text style={styles.sizeInfo}>Bottom Wear Size: {item.bottomWearSize}</Text>}

        {item.clothingSize && <Text style={styles.sizeInfo}>Clothing Size: {item.clothingSize}</Text>}

        {item.shoeSize && <Text style={styles.sizeInfo}>Shoe Size: {item.shoeSize}</Text>}

        <Text style={styles.donorInfo}>Donated by: {item.donorUsername || "Anonymous"}</Text>
        <Text style={styles.claimDate}>Claimed on: {formatDate(item.claimDate || item.updatedAt)}</Text>
      </View>
    </View>
  )

  const renderFoodItem = ({ item }) => (
    <View style={styles.claimItem}>
      <Text style={styles.claimTitle}>{item.foodName || item.itemName || "Unnamed Item"}</Text>

      <View style={styles.claimDetails}>
        <Text style={styles.categoryInfo}>Type: {item.donationType || item.itemCategory || "Unknown"}</Text>

        {item.quantity && <Text style={styles.quantityInfo}>Quantity: {item.quantity}</Text>}

        {item.expiryDate && <Text style={styles.expiryInfo}>Expires on: {formatDate(item.expiryDate)}</Text>}

        <Text style={styles.donorInfo}>Donated by: {item.donorUsername || "Anonymous"}</Text>
        <Text style={styles.claimDate}>Claimed on: {formatDate(item.claimDate || item.updatedAt)}</Text>
      </View>
    </View>
  )

  const renderEducationItem = ({ item }) => (
    <View style={styles.claimItem}>
      <Text style={styles.claimTitle}>{item.itemName || "Unnamed Item"}</Text>

      <View style={styles.claimDetails}>
        <Text style={styles.categoryInfo}>Type: {item.donationType || item.itemCategory || "Unknown"}</Text>

        {item.subject && <Text style={styles.subjectInfo}>Subject: {item.subject}</Text>}

        {item.grade && <Text style={styles.gradeInfo}>Grade/Level: {item.grade}</Text>}

        {item.condition && <Text style={styles.conditionInfo}>Condition: {item.condition}</Text>}

        <Text style={styles.donorInfo}>Donated by: {item.donorUsername || "Anonymous"}</Text>
        <Text style={styles.claimDate}>Claimed on: {formatDate(item.claimDate || item.updatedAt)}</Text>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "clothes" && styles.activeTab]}
          onPress={() => setActiveTab("clothes")}
        >
          <Text style={[styles.tabText, activeTab === "clothes" && styles.activeTabText]}>Clothes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "food" && styles.activeTab]}
          onPress={() => setActiveTab("food")}
        >
          <Text style={[styles.tabText, activeTab === "food" && styles.activeTabText]}>Food</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "education" && styles.activeTab]}
          onPress={() => setActiveTab("education")}
        >
          <Text style={[styles.tabText, activeTab === "education" && styles.activeTabText]}>Education</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "clothes" &&
        (clothesClaims.length === 0 ? (
          <Text style={styles.emptyText}>You haven't claimed any clothes items yet</Text>
        ) : (
          <FlatList
            data={clothesClaims}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderClothesItem}
            contentContainerStyle={styles.listContainer}
          />
        ))}

      {activeTab === "food" &&
        (foodClaims.length === 0 ? (
          <Text style={styles.emptyText}>You haven't claimed any food items yet</Text>
        ) : (
          <FlatList
            data={foodClaims}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderFoodItem}
            contentContainerStyle={styles.listContainer}
          />
        ))}

      {activeTab === "education" &&
        (educationClaims.length === 0 ? (
          <Text style={styles.emptyText}>You haven't claimed any education items yet</Text>
        ) : (
          <FlatList
            data={educationClaims}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEducationItem}
            contentContainerStyle={styles.listContainer}
          />
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.ivory,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.sageGreen,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: theme.colors.pearlWhite,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: 20,
  },
  claimItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: theme.colors.sageGreen,
    marginBottom: 10,
    shadowColor: theme.colors.charcoalBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  claimTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.ivory,
  },
  claimDetails: {
    marginTop: 8,
  },
  categoryInfo: {
    fontSize: 14,
    color: theme.colors.pearlWhite,
    marginTop: 2,
  },
  genderInfo: {
    fontSize: 14,
    color: theme.colors.pearlWhite,
    marginTop: 2,
  },
  sizeInfo: {
    fontSize: 14,
    color: theme.colors.pearlWhite,
    marginTop: 2,
  },
  quantityInfo: {
    fontSize: 14,
    color: theme.colors.pearlWhite,
    marginTop: 2,
  },
  expiryInfo: {
    fontSize: 14,
    color: theme.colors.pearlWhite,
    marginTop: 2,
  },
  subjectInfo: {
    fontSize: 14,
    color: theme.colors.pearlWhite,
    marginTop: 2,
  },
  gradeInfo: {
    fontSize: 14,
    color: theme.colors.pearlWhite,
    marginTop: 2,
  },
  conditionInfo: {
    fontSize: 14,
    color: theme.colors.pearlWhite,
    marginTop: 2,
  },
  donorInfo: {
    fontSize: 14,
    color: theme.colors.pearlWhite,
    marginTop: 2,
    fontWeight: "500",
  },
  claimDate: {
    fontSize: 14,
    color: theme.colors.pearlWhite,
    marginTop: 2,
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.ivory,
    fontSize: 16,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
  },
  emptyText: {
    color: theme.colors.ivory,
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
})

export default ClaimsHistory