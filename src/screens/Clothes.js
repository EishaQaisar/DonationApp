"use client"

import { useContext, useState, useEffect } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, SectionList, FlatList } from "react-native"
import { theme } from "../core/theme"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { CartContext } from "../CartContext"
import axios from "axios"
import { getBaseUrl } from "../helpers/deviceDetection"
import firestore from "@react-native-firebase/firestore"
import { AuthContext } from "../context/AuthContext"

const Clothes = ({ route }) => {
  const navigation = useNavigation()
  const { role } = route.params
  const { isInCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  console.log(user.uid)


  const [clothesItems, setClothesItems] = useState({ recommended: [], others: [] })
  const [userProfile, setUserProfile] = useState(null)
console.log(user)
  /** Fetch user profile from Firestore */
  const fetchUserProfile = async () => {
    try {
      if (user) {
        console.log("Fetching user profile for:", user.uid)
        const userDoc = await firestore().collection("individual_profiles").doc(user.uid).get()
        if (userDoc.exists) {
          setUserProfile(userDoc.data())
          console.log("User profile fetched:", userDoc.data())
        } else {
          console.log("User profile not found in Firestore")
        }
      } else {
        console.log("User not found in AuthContext")
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  /** Fetch clothes donations from API */
  const fetchClothesDonations = async () => {
    if (!userProfile) return // Prevent API call if userProfile is not loaded

    try {
      console.log("Fetching clothes donations for user profile:", userProfile)
      const BASE_URL = await getBaseUrl()
      const response = await axios.get(`${BASE_URL}/api/clothes-donations`, {
        params: { userProfile: JSON.stringify(userProfile) },
      })
      console.log("Clothes donations fetched:", response.data)

      setClothesItems({
        recommended: response.data.recommended || [],
        others: response.data.others || [],
      })
    } catch (error) {
      console.error("Error fetching clothes donations:", error)
    }
  }

  /** Fetch user profile on component mount */
  useEffect(() => {
    fetchUserProfile()
  }, [])

  /** Fetch clothes donations when userProfile is updated */
  useEffect(() => {
    if (userProfile) {
      fetchClothesDonations()
    }
  }, [userProfile])

  /** Render each item */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.donationItem}
      onPress={() => navigation.navigate("ItemDetail", { item, category: "Clothes" })}
    >
      <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
      <Text style={styles.item}>{item.itemName}</Text>
      <Text style={styles.itemDetails}>{`Size: ${item.size}`}</Text>
      <Text style={styles.itemDetails}>{`Gender: ${item.gender}`}</Text>
      <TouchableOpacity
        style={styles.claimButton}
        onPress={() => navigation.navigate("ItemDetail", { item, category: "Clothes" })}
      >
        <Text style={styles.claimButtonText}>{role === "donor" ? "View" : "Claim"}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )

  /** Render section headers */
  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  )

  /** Define sections for SectionList */
  const isClothesPage = route.name === "Clothes"
  const sections = [
    { title: "Recommended for You", data: clothesItems.recommended.filter((item) => !isInCart(item)) },
    { title: "Others", data: clothesItems.others.filter((item) => !isInCart(item)) },
  ]

  return (
  <View style={styles.container}>
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

    {/* Recommended Donations */}
    {clothesItems.recommended.length > 0 && (
      <View>
        <Text style={styles.sectionHeaderText}>Recommended for You</Text>
        <FlatList
          data={clothesItems.recommended.filter((item) => !isInCart(item))}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2} // Keeps a two-column grid
          contentContainerStyle={styles.grid}
        />
      </View>
    )}

    {/* Other Donations */}
    {clothesItems.others.length > 0 && (
      <View>
        <Text style={styles.sectionHeaderText}>Others</Text>
        <FlatList
          data={clothesItems.others.filter((item) => !isInCart(item))}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2} // Keeps a two-column grid
          contentContainerStyle={styles.grid}
        />
      </View>
    )}
  </View>
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
  sectionHeader: {
    backgroundColor: theme.colors.charcoalBlack,
    padding: 10,
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.ivory,
  },
})

export default Clothes
