"use client"

import { useState, useEffect, useContext } from "react"
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native"
import { theme } from "../core/theme"
import { AuthContext } from "../context/AuthContext"
import { getBaseUrl } from "../helpers/deviceDetection"
import axios from "axios"

const DonationsHistory = () => {
  const [clothesDonations, setClothesDonations] = useState([])
  const [foodDonations, setFoodDonations] = useState([])
  const [educationDonations, setEducationDonations] = useState([]) // New state for education donations
  const [activeTab, setActiveTab] = useState("clothes")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user?.username) {
        setLoading(false) // Stop loading if no user ID is available
        return
      }

      console.log("Fetching donations history for user:", user.username)

      try {
        const BASE_URL = await getBaseUrl()

        // Fetch clothes donations
        try {
          const clothesResponse = await axios.get(`${BASE_URL}/api/user-clothes-donations?userId=${user.username}`)
          console.log(`Found ${clothesResponse.data.length} clothes donations for this user.`)
          setClothesDonations(clothesResponse.data)
        } catch (err) {
          console.error("Error fetching clothes donations:", err)
          setError("Failed to load clothes donations")
        }

        // Fetch food donations
        try {
          const foodResponse = await axios.get(`${BASE_URL}/api/user-food-donations?userId=${user.username}`)
          console.log(`Found ${foodResponse.data.length} food donations for this user.`)
          setFoodDonations(foodResponse.data)
        } catch (err) {
          console.error("Error fetching food donations:", err)
          setError("Failed to load food donations")
        }

        // Fetch education donations
        try {
          const educationResponse = await axios.get(`${BASE_URL}/api/user-education-donations?userId=${user.username}`)
          console.log(`Found ${educationResponse.data.length} education donations for this user.`)
          setEducationDonations(educationResponse.data)
        } catch (err) {
          console.error("Error fetching education donations:", err)
          setError("Failed to load education donations")
        }
      } catch (err) {
        console.error("Error getting base URL:", err)
        setError("Failed to connect to server")
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [user?.id]) // Depend on user.id directly

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Helper function to determine status style
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "claimed":
        return styles.claimedStatus
      case "unclaimed":
        return styles.unclaimedStatus
      default:
        return styles.otherStatus
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your donation history...</Text>
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
    <View style={styles.donationItem}>
      <Text style={styles.donationTitle}>{item.itemName || item.itemCategory|| "Unnamed Item"}</Text>

      <View style={styles.donationDetails}>
        <Text style={styles.categoryInfo}>Category: {item.clothesCategory || item.itemCategory || "Unknown"}</Text>

        {item.gender && <Text style={styles.genderInfo}>Gender: {item.gender}</Text>}

        {item.upperWearSize && <Text style={styles.sizeInfo}>Upper Wear Size: {item.upperWearSize}</Text>}

        {item.bottomWearSize && <Text style={styles.sizeInfo}>Bottom Wear Size: {item.bottomWearSize}</Text>}

        {item.clothingSize && <Text style={styles.sizeInfo}>Clothing Size: {item.clothingSize}</Text>}

        {item.shoeSize && <Text style={styles.sizeInfo}>Shoe Size: {item.shoeSize}</Text>}

        <Text style={styles.donationDate}>Donated on: {formatDate(item.createdAt)}</Text>
      </View>

      <View style={[styles.statusBadge, getStatusStyle(item.claimStatus)]}>
        <Text style={styles.statusText}>{item.claimStatus}</Text>
      </View>
    </View>
  )

  const renderFoodItem = ({ item }) => (
    <View style={styles.donationItem}>
      <Text style={styles.donationTitle}>{item.foodName || "Unnamed Item"}</Text>

      <View style={styles.donationDetails}>
        <Text style={styles.categoryInfo}>Meal Type: {item.mealType || item.itemCategory || "Unknown"}</Text>

        {item.quantity && <Text style={styles.quantityInfo}>Quantity: {item.quantity}</Text>}

        {item.expiryDate && <Text style={styles.expiryInfo}>Expires on: {formatDate(item.expiryDate)}</Text>}

        <Text style={styles.donationDate}>Donated on: {formatDate(item.createdAt)}</Text>
      </View>

      <View style={[styles.statusBadge, getStatusStyle(item.claimStatus)]}>
        <Text style={styles.statusText}>{item.claimStatus}</Text>
      </View>
    </View>
  )

  // New render function for education items
  const renderEducationItem = ({ item }) => (
    <View style={styles.donationItem}>
      <Text style={styles.donationTitle}>{item.itemName || "Unnamed Item"}</Text>

      <View style={styles.donationDetails}>
        <Text style={styles.categoryInfo}>Type: {item.type|| item.itemCategory || "Unknown"}</Text>

        {item.subject && <Text style={styles.subjectInfo}>Subject: {item.subject}</Text>}

        {item.grade && <Text style={styles.gradeInfo}>Grade/Level: {item.grade}</Text>}

        {item.condition && <Text style={styles.conditionInfo}>Condition: {item.condition}</Text>}

        <Text style={styles.donationDate}>Donated on: {formatDate(item.createdAt)}</Text>
      </View>

      <View style={[styles.statusBadge, getStatusStyle(item.claimStatus)]}>
        <Text style={styles.statusText}>{item.claimStatus}</Text>
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
        (clothesDonations.length === 0 ? (
          <Text style={styles.emptyText}>You haven't made any clothes donations yet</Text>
        ) : (
          <FlatList
            data={clothesDonations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderClothesItem}
            contentContainerStyle={styles.listContainer}
          />
        ))}

      {activeTab === "food" &&
        (foodDonations.length === 0 ? (
          <Text style={styles.emptyText}>You haven't made any food donations yet</Text>
        ) : (
          <FlatList
            data={foodDonations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderFoodItem}
            contentContainerStyle={styles.listContainer}
          />
        ))}

      {activeTab === "education" &&
        (educationDonations.length === 0 ? (
          <Text style={styles.emptyText}>You haven't made any education donations yet</Text>
        ) : (
          <FlatList
            data={educationDonations}
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
  donationItem: {
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
  donationTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.ivory,
  },
  donationDetails: {
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
  donationDate: {
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
  statusBadge: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  claimedStatus: {
    backgroundColor: "#4caf50", // Green
  },
  unclaimedStatus: {
    backgroundColor: "#ff9800", // Orange
  },
  otherStatus: {
    backgroundColor: "#9e9e9e", // Gray
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
})

export default DonationsHistory