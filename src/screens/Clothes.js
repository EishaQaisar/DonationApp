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
import { t } from "../i18n" // Import the translation function


const Clothes = ({ route }) => {
  const navigation = useNavigation()
  const tabBarHeight = useBottomTabBarHeight()

  const { role } = route.params
  const { isInCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const { userProfile } = useContext(UserProfileContext)

  // Detect language by comparing a known translation
  const isUrdu = t("clothes.item_category_options.Clothes") !== "Clothes"

  const [clothesItems, setClothesItems] = useState({
    recommended: [],
    others: [],
    allDonations: [], // New state for donor view
  })

  const isDonor = user.role === "donor"

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

  // Dynamic styles based on language
  const dynamicStyles = {
    itemDetails: {
      fontSize: isUrdu ? 18 : 16, // Increase font size for Urdu
      color: theme.colors.ivory,
      textAlign: "center",
      marginBottom: 5,
    }
  }

  /** Render each item */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.donationItem}
      onPress={() => navigation.navigate("ItemDetail", { item, category: "Clothes" })}
    >
      <Image source={item.images[0]} style={styles.itemImage} />
       {item.itemCategory === "Shoes" && (
          <Text style={styles.item}> {t(`clothes.item_category_options.${item.itemCategory}`, { defaultValue: item.itemCategory })}</Text>
       )}
       {item.itemCategory === "Clothes" && (
          <Text style={styles.item}> {t(`clothes.clothes_category_options.${item.clothesCategory}`, { defaultValue: item.clothesCategory })}</Text>
       )}
  
      
      <Text style={dynamicStyles.itemDetails}>
      {`${t("clothes.size")}: ${
        item.itemCategory === "Clothes"
          ? item.clothesCategory === "Upper Wear"
            ? t(`clothes.size_options.${item.upperWearSize}`, { defaultValue: item.upperWearSize })
            : item.clothesCategory === "Bottom Wear"
            ? t(`clothes.size_options.${item.bottomWearSize}`, { defaultValue: item.bottomWearSize })
            : item.clothesCategory === "Full Outfit"
            ? t(`clothes.size_options.${item.clothingSize}`, { defaultValue: item.clothingSize })
            : "N/A"
          : item.itemCategory === "Shoes"
          ? t(`clothes.size_options.${item.shoeSize}`, { defaultValue: item.shoeSize })
          : "N/A"
      }`}
      </Text>

      <Text style={dynamicStyles.itemDetails}>{`${t("clothes.gender")}: ${
          t(`clothes.gender_options.${item.gender}`, { defaultValue: item.gender })
        }`}</Text>
      <TouchableOpacity
        style={styles.claimButton}
        onPress={() => navigation.navigate("ItemDetail", { item, category: "Clothes" })}
      >
        <Text style={styles.claimButtonText}>{isDonor ? t("general.view") : t("general.claim")}</Text>
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
        <Text style={styles.title}>{t("clothes.donations_title", { defaultValue: "Clothes Donations" })}</Text>
      </View>

      {/* Donor View - All Donations */}
      {(isDonor || user.recipientType === "ngo")&& (
        <View>
          <Text style={styles.sectionHeaderText}>{t("general.allAvailableDonations", { defaultValue: "All Available Donations" })}</Text>
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
          <Text style={styles.sectionHeaderText}>{t("general.recommendedForYou", { defaultValue: "Recommended for You" })}</Text>
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
          <Text style={styles.sectionHeaderText}>{t("general.others", { defaultValue: "Others" })}</Text>
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
    backgroundColor: theme.colors.background, // white background
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    //backgroundColor: theme.colors.outerSpace,
  },
  title: {
    fontSize: 28,
    color: theme.colors.text, // dark gray text
    fontWeight: "bold",
  },
  grid: {
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  donationItem: {
    backgroundColor: theme.colors.pearlWhite, // soft white card
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
    width: "45%",
    alignItems: "center",
    marginHorizontal: "2.5%",
   // shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: theme.colors.sageGreen,
  },
  itemImage: {
    width: 130,
    height: 130,
    borderRadius: 12,
    borderColor: theme.colors.sageGreen,
    borderWidth: 2,
    marginBottom: 10,
  },
  item: {
    fontSize: 18,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 4,
    fontWeight: "600",
  },
  claimButton: {
    backgroundColor: theme.colors.sageGreen,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 10,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  claimButtonText: {
    fontSize: 16,
    color: theme.colors.pearlWhite,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 8,
    //backgroundColor: theme.colors.outerSpace,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.sageGreen,
  },
  icon: {
    backgroundColor: theme.colors.pearlWhite,
    padding: 12,
    borderRadius: 25,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: theme.colors.sageGreen,
  },
  activeIcon: {
    backgroundColor: theme.colors.sageGreen,
    padding: 12,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    padding: 10,
    marginBottom: 10,
    //backgroundColor: theme.colors.outerSpace,
    borderRadius: 10,
    marginHorizontal: 10,
  },
})

export default Clothes