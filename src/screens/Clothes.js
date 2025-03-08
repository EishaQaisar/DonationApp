"use client"

import { useContext, useState, useEffect } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from "react-native"
import { theme } from "../core/theme"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { CartContext } from "../CartContext"
import axios from "axios"
import { getBaseUrl } from "../helpers/deviceDetection"
import { AuthContext } from "../context/AuthContext"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { UserProfileContext } from "../context/UserProfileContext"

const Clothes = ({ route }) => {
  const navigation = useNavigation()
  const tabBarHeight = useBottomTabBarHeight()

  const { role } = route.params
  const { isInCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const { userProfile } = useContext(UserProfileContext)

  const [clothesItems, setClothesItems] = useState({
    recommended: [],
    others: [],
    allDonations: [], // New state for donor view
  })

  const isDonor = role === "donor"

  /** Fetch clothes donations from API */
  const fetchClothesDonations = async () => {
    if (!userProfile && !isDonor && user.recipientType != "ngo") return // Prevent API call if userProfile is not loaded for recipients

    try {
      console.log(`Fetching clothes donations as ${isDonor ? "donor" : "recipient"}`)
      const BASE_URL = await getBaseUrl()

      // Different API endpoints based on role
      const endpoint = isDonor || user.recipientType === "ngo" ? `${BASE_URL}/api/all-clothes-donations` : `${BASE_URL}/api/clothes-donations`

      // Different params based on role
      const params = isDonor|| user.recipientType === "ngo" ? {} : { userProfile: JSON.stringify(userProfile) }

      const response = await axios.get(endpoint, { params })

      const processItems = (items) => {
        return items.map((item) => {
          const parsedImages = item.images ? JSON.parse(item.images) : []
          const validImages = parsedImages.map((imagePath) => ({ uri: imagePath }))
          return { ...item, images: validImages }
        })
      }

      if (isDonor || user.recipientType === "ngo") {
        // For donors, put all donations in the allDonations array
        setClothesItems({
          recommended: [],
          others: [],
          allDonations: processItems(response.data),
        })
      } else {
        // For recipients, maintain the recommended/others structure
        setClothesItems({
          recommended: response.data.recommended ? processItems(response.data.recommended) : [],
          others: response.data.others ? processItems(response.data.others) : [],
          allDonations: [],
        })
      }
    } catch (error) {
      console.error("Error fetching clothes donations:", error)
    }
  }

  /** Fetch clothes donations when userProfile is updated or role changes */
  useEffect(() => {
    if (isDonor || userProfile || user.recipientType === "ngo") {
      fetchClothesDonations()
    }
  }, [userProfile, isDonor]) //Fixed useEffect dependencies

  /** Render each item */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.donationItem}
      onPress={() => navigation.navigate("ItemDetail", { item, category: "Clothes" })}
    >
      <Image source={item.images[0]} style={styles.itemImage} />
       {item.itemCategory === "Shoes" && (
                                  <Text style={styles.item}> {item.itemCategory}</Text>
                              )}
                              {item.itemCategory === "Clothes" && (
                                  <Text style={styles.item}>{item.clothesCategory}</Text>
                              )}
  
      
      <Text style={styles.itemDetails}>
        {`Size: ${
          item.itemCategory === "Clothes" 
            ? (
                item.clothesCategory === "Upper Wear" 
                  ? item.upperWearSize 
                  : item.clothesCategory === "Bottom Wear" 
                    ? item.bottomWearSize 
                    : item.clothesCategory === "Full Outfit" 
                      ? item.clothingSize 
                      : "N/A"
              ) 
            : item.itemCategory === "Shoes" 
              ? item.shoeSize 
              : "N/A"
        }`}
      </Text>
      <Text style={styles.itemDetails}>{`Gender: ${item.gender}`}</Text>
      <TouchableOpacity
        style={styles.claimButton}
        onPress={() => navigation.navigate("ItemDetail", { item, category: "Clothes" })}
      >
        <Text style={styles.claimButtonText}>{isDonor ? "View" : "Claim"}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
  const isClothesPage = route.name === "Clothes"

  return (
    <ScrollView style={[styles.container, { marginBottom: tabBarHeight }]} showsVerticalScrollIndicator={false}>
      {/* Category Icons */}
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Education")}>
          <Icon name="school" size={40} color={theme.colors.sageGreen} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Clothes")}>
          <Icon
            name="checkroom"
            size={40}
            color={isClothesPage ? theme.colors.ivory : theme.colors.sageGreen}
            style={[styles.icon, isClothesPage && styles.activeIcon]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Food")}>
          <Icon name="local-dining" size={40} color={theme.colors.sageGreen} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Page Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Clothes Donations</Text>
      </View>

      {/* Donor View - All Donations */}
      {(isDonor || user.recipientType === "ngo")&& (
        <View>
          <Text style={styles.sectionHeaderText}>All Available Donations</Text>
          <FlatList
            data={clothesItems.allDonations.filter((item) => !isInCart(item))}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.grid}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Recipient View - Recommended Donations */}
      {!isDonor && clothesItems.recommended.length > 0 && (
        <View>
          <Text style={styles.sectionHeaderText}>Recommended for You</Text>
          <FlatList
            data={clothesItems.recommended.filter((item) => !isInCart(item))}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.grid}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Recipient View - Other Donations */}
      {!isDonor && clothesItems.others.length > 0 && (
        <View>
          <Text style={styles.sectionHeaderText}>Others</Text>
          <FlatList
            data={clothesItems.others.filter((item) => !isInCart(item))}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.grid}
            scrollEnabled={false}
          />
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.charcoalBlack,
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  title: {
    fontSize: 28,
    color: theme.colors.ivory,
    fontWeight: "bold",
  },
  grid: {
    justifyContent: "space-between",
    marginTop: 10,
    padding: 10,
  },
  donationItem: {
    backgroundColor: theme.colors.TaupeBlack,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "45%",
    alignItems: "center",
    marginHorizontal: "2.5%",
    shadowColor: theme.colors.sageGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.sageGreen,
  },
  itemImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    borderColor: theme.colors.sageGreen,
    borderWidth: 3,
    marginBottom: 10,
  },
  item: {
    fontSize: 20,
    color: theme.colors.ivory,
    textAlign: "center",
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 16,
    color: theme.colors.ivory,
    textAlign: "center",
    marginBottom: 5,
  },
  claimButton: {
    backgroundColor: theme.colors.charcoalBlack,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: theme.colors.sageGreen,
    borderBottomWidth: 8,
    borderWidth: 3,
    borderRadius: 20,
    marginTop: 10,
  },
  claimButtonText: {
    fontSize: 18,
    color: theme.colors.ivory,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 7,
    backgroundColor: theme.colors.charcoalBlack,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.sageGreen,
  },
  icon: {
    backgroundColor: theme.colors.outerSpace,
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  activeIcon: {
    backgroundColor: theme.colors.sageGreen,
    padding: 12,
  },
  sectionHeaderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.ivory,
    padding: 10,
    marginBottom: 10,
  },
})

export default Clothes

