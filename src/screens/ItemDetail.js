"use client"

import { useState, useContext } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native"
import { theme } from "../core/theme"
import Icon from "react-native-vector-icons/FontAwesome"
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import { useCart } from "../CartContext"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { UserProfileContext } from "../context/UserProfileContext"
import firestore from "@react-native-firebase/firestore"
import { AuthContext } from "../context/AuthContext"
import { getBaseUrl } from "../helpers/deviceDetection"
import axios from "axios"
import i18n, { t } from "../i18n"

const ItemDetail = ({ route }) => {
  const { item, category, role } = route.params
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addToCart, isInCart } = useCart()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const tabBarHeight = useBottomTabBarHeight()
  const { userProfile, setUserProfile } = useContext(UserProfileContext)
  const [requiredKhairPoints, setRequiredKhairPoints] = useState(0)
  const { user } = useContext(AuthContext)
  const [not, setNot] = useState([])

  // Detect language by comparing a known translation
  const isUrdu = t("food.donations_title") !== "Food Donations"

  // Dynamic styles based on language
  const dynamicStyles = {
    detailLabel: {
      fontSize: isUrdu ? 18 : 16,
      color: theme.colors.ivory,
      marginBottom: 2,
    },
    detailValue: {
      fontSize: isUrdu ? 20 : 18,
      color: theme.colors.pearlWhite,
      fontWeight: "500",
    },
    modalMessage: {
      fontSize: isUrdu ? 20 : 18,
      color: theme.colors.ivory,
      textAlign: "center",
      marginBottom: 25,
    },
  }

  const isClaimed = isInCart(item)
  const khairPointsPerCategory = {
    Food: 10,
    Education: 20,
    Clothes: 15,
  }

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  // Add a new state for city error modal
  const [isCityErrorModalVisible, setIsCityErrorModalVisible] = useState(false)

  // Add a function to hide the city error modal
  const hideCityErrorModal = () => {
    setIsCityErrorModalVisible(false)
  }

  // Function to update khair points directly in this component
  const updateKhairPoints = async (newPoints) => {
    if (!userProfile || isUpdating) return false

    setIsUpdating(true)
    try {
      // Update in Firestore
      if (user.recipientType === "individual") {
        await firestore().collection("individual_profiles").doc(user.uid).update({
          khairPoints: newPoints,
        })
      } else if (user.recipientType === "ngo") {
        await firestore().collection("ngo_profiles").doc(user.uid).update({
          khairPoints: newPoints,
        })
      }

      // Update local state in context using functional update pattern
      setUserProfile((prevProfile) => ({
        ...prevProfile, // This preserves ALL existing properties
        khairPoints: newPoints,
      }))

      console.log("Khair points updated successfully")
      return true
    } catch (error) {
      console.error("Error updating khair points:", error)
      return false
    } finally {
      setIsUpdating(false)
    }
  }

  // Normalize userRole to handle case variations
  const isDonor = role && role.toLowerCase() === "donor" // Checks if user is a donor

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.images.length)
  }

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + item.images.length) % item.images.length)
  }

  const renderCategoryDetails = () => {
    switch (category) {
      case "Food":
        return (
          <View>
            <Text style={styles.title}>{item.foodName}</Text>
            <View style={styles.detailsCard}>
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>{t("itemDetail.basicInfo")}</Text>
                <DetailItem
                  icon="food"
                  label={t("itemDetail.meal")}
                  value={t(`food.meal_options.${item.mealType}`, { defaultValue: item.mealType })}
                />
                <DetailItem
                  icon="silverware-fork-knife"
                  label={t("itemDetail.foodType")}
                  value={t(`food.food_type_options.${item.foodType}`, { defaultValue: item.foodType })}
                />
                <DetailItem icon="numeric" label={t("itemDetail.quantity")} value={item.quantity.toString()} />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>{t("itemDetail.additionalInfo")}</Text>
                <DetailItem icon="text-short" label={t("itemDetail.description")} value={item.description} />
                <DetailItem icon="map-marker" label={t("itemDetail.location")} value={item.donorCity || "N/A"} />
                <DetailItem icon="account" label={t("itemDetail.donorUsername")} value={item.donorUsername} />
              </View>
            </View>
          </View>
        )
      case "Clothes":
        return (
          <View>
            {/* Display clothes category only when item category is Clothes */}
            {item.itemCategory === "Shoes" && (
              <Text style={styles.title}>
                {t(`clothes.item_category_options.${item.itemCategory}`, { defaultValue: item.itemCategory })}
              </Text>
            )}
            {item.itemCategory === "Clothes" && (
              <Text style={styles.title}>
                {t(`clothes.clothes_category_options.${item.clothesCategory}`, { defaultValue: item.clothesCategory })}
              </Text>
            )}

            <View style={styles.detailsCard}>
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>{t("itemDetail.basicInfo")}</Text>
                {/* Conditionally display size with appropriate value based on category */}
                <DetailItem
                  icon="tshirt-crew"
                  label={t("clothes.size")}
                  value={
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
                  }
                />
                <DetailItem
                  icon="gender-male-female"
                  label={t("clothes.gender")}
                  value={t(`clothes.gender_options.${item.gender}`, { defaultValue: item.gender })}
                />
                <DetailItem
                  icon="human-male-child"
                  label={t("itemDetail.age")}
                  value={t(`clothes.age_categories.${item.age_category}`, { defaultValue: item.age_category })}
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>{t("itemDetail.specifications")}</Text>
                {/* Only display fabric if not shoes and not accessories */}
                {!(
                  item.itemCategory === "Shoes" ||
                  (item.itemCategory === "Clothes" && item.clothesCategory === "Accessories")
                ) && <DetailItem icon="texture-box" label={t("itemDetail.fabric")} value={item.fabric} />}

                <DetailItem
                  icon="weather-sunny"
                  label={t("itemDetail.season")}
                  value={t(`clothes.season_options.${item.season}`, { defaultValue: item.season })}
                />
                <DetailItem
                  icon="star-outline"
                  label={t("itemDetail.condition")}
                  value={t(`clothes.condition_options.${item.c_condition}`, { defaultValue: item.c_condition })}
                />
                <DetailItem icon="numeric" label={t("itemDetail.quantity")} value={item.quantity.toString()} />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>{t("itemDetail.donorInfo")}</Text>
                <DetailItem icon="account" label={t("itemDetail.donorUsername")} value={item.donorUsername} />
                <DetailItem icon="map-marker" label={t("itemDetail.location")} value={item.donorCity || "N/A"} />
              </View>
            </View>
          </View>
        )
      case "Education":
        return (
          <View>
            <Text style={styles.title}>{item.itemName}</Text>
            <View style={styles.detailsCard}>
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>{t("itemDetail.basicInfo")}</Text>
                <DetailItem
                  icon="shape-outline"
                  label={t("itemDetail.type")}
                  value={t(`education.types.${item.type}`, { defaultValue: item.type })}
                />
                <DetailItem
                  icon="school"
                  label={t("education.level")}
                  value={t(`education.levels.${item.level}`, { defaultValue: item.level })}
                />
                <DetailItem icon="numeric" label={t("itemDetail.quantity")} value={item.quantity.toString()} />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>{t("itemDetail.specifications")}</Text>
                {item.type !== "Stationary" && (
                  <DetailItem
                    icon="book-open-variant"
                    label={t("itemDetail.subject")}
                    value={t(`education.subjects.${item.subject}`, { defaultValue: item.subject })}
                  />
                )}
                {item.type === "Books" && (
                  <DetailItem
                    icon="school"
                    label={t("itemDetail.grade")}
                    value={t(`education.grades.${item.grade}`, { defaultValue: item.grade })}
                  />
                )}
                {item.type === "Books" && (
                  <DetailItem icon="school" label={t("itemDetail.institute")} value={item.institution} />
                )}
                <DetailItem
                  icon="star-outline"
                  label={t("itemDetail.condition")}
                  value={t(`education.conditions.${item.c_condition}`, { defaultValue: item.c_condition })}
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>{t("itemDetail.additionalInfo")}</Text>
                <DetailItem icon="text-short" label={t("itemDetail.description")} value={item.description} />
                <DetailItem icon="account" label={t("itemDetail.donorUsername")} value={item.donorUsername} />
                <DetailItem icon="map-marker" label={t("itemDetail.location")} value={item.donorCity || "N/A"} />
              </View>
            </View>
          </View>
        )
      default:
        return (
          <View style={styles.detailsCard}>
            <Text style={styles.noDetailsText}>{t("itemDetail.noDetails")}</Text>
          </View>
        )
    }
  }
  /*notification work*/
  const claimItemInDB = async () => {
    let requiredItemName

    if (category === "Food") {
      requiredItemName = item.foodName
    } else if (category === "Clothes") {
      requiredItemName = item.itemCategory
    } else {
      requiredItemName = item.itemName
    }
    const claimedItemDetails = {
      donorUsername: item.donorUsername,
      claimerUsername: user.username, // Replace this with the actual claimer's username (you can get this from user context or route)
      donationType: category,
      itemId: item.id,
      claimStatus: "Claimed",
      scheduledelivery: "Unscheduled",
      // Assuming each item has a unique ID
      itemName: requiredItemName,
      khairPoints: Number.parseInt(requiredKhairPoints),
    }

    try {
      const BASE_URL = await getBaseUrl()
      const response = await axios.post(`${BASE_URL}/api/add-claimed-item`, claimedItemDetails)

      console.log("Item claimed successfully in the database")
      return response.data
    } catch (error) {
      // Better error logging
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error("Server error:", error.response.status, error.response.data)
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request)
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message)
      }
      console.error("Error config:", error.config)
      throw error
    }
  }

  const changingStatus = async (category, id) => {
    try {
      const BASE_URL = await getBaseUrl() // If you're using a base URL helper function

      await axios.post(`${BASE_URL}/api/approve-claims`, { id, category }) // Pass the id in the request body
      // setNot(not.filter(item => item.id !== id));
    } catch (error) {
      console.error(`Error changing claim status of table ${category}:`, error)
    }
  }

  const showConfirmationModal = () => {
    setIsModalVisible(true)
  }

  const hideConfirmationModal = () => {
    setIsModalVisible(false)
  }

  const confirmClaimItem = async () => {
    const itemKhairPoints = khairPointsPerCategory[category] || 0
    setRequiredKhairPoints(item.quantity * itemKhairPoints)
    console.log("fsefwefi", item.quantity * itemKhairPoints)

    // Calculate new khair points balance
    const newKhairPoints = Math.max(0, userProfile.khairPoints - requiredKhairPoints)

    // Update khair points using the local function
    const success = await updateKhairPoints(newKhairPoints)

    if (success) {
      changingStatus(category, item.id)
      addToCart(item, category) // Add to cart if points were successfully updated
      claimItemInDB()
      setIsModalVisible(false)
    } else {
      // Handle error - could show an error message
      setIsModalVisible(false)
      // Optionally show an error toast or alert
    }
  }
  const handleClaim = () => {
    // First check if cities match
    if (item.donorCity !== userProfile.city) {
      setIsCityErrorModalVisible(true)
      return
    }

    // If cities match, proceed with the existing khair points check
    const itemKhairPoints = khairPointsPerCategory[category] || 0
    setRequiredKhairPoints(item.quantity * itemKhairPoints)
    console.log("fsefwefi", item.quantity * itemKhairPoints)
    console.log(userProfile.khairPoints)

    if (userProfile.khairPoints >= item.quantity * itemKhairPoints) {
      showConfirmationModal()
    } else {
      setIsErrorModalVisible(true) // Show error modal if insufficient points
    }
  }
  const hideErrorModal = () => {
    setIsErrorModalVisible(false)
  }

  return (
    <ScrollView style={[styles.container, { marginBottom: tabBarHeight }]}>
      {/* Header with item count */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {t("itemDetail.viewingItem")} {currentImageIndex + 1}/{item.images.length}
        </Text>
      </View>
      
      {/* Image carousel with improved styling */}
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={handlePreviousImage} style={styles.navButton}>
          <Icon name={i18n.locale=='ur' ? "chevron-right" : "chevron-left"} size={20} color={theme.colors.pearlWhite} />
        </TouchableOpacity>
        <Image source={item.images[currentImageIndex]} style={styles.image} />
        <TouchableOpacity onPress={handleNextImage} style={styles.navButton}>
          <Icon name={i18n.locale=='ur' ? "chevron-left" : "chevron-right"} size={20} color={theme.colors.pearlWhite} />
        </TouchableOpacity>
      </View>

      {/* Item details with improved organization */}
      {renderCategoryDetails()}

      {/* Khair Points required indicator */}
      <View style={styles.khairPointsContainer}>
        <MaterialIcon name="star-circle" size={24} color={theme.colors.pearlWhite} />
        <Text style={styles.khairPointsText}>
          {t("itemDetail.requiredPoints")}: {(khairPointsPerCategory[category] || 0) * item.quantity}
        </Text>
      </View>

      {/* Only show claim button if user is NOT a donor */}
      {!isDonor && (
        <TouchableOpacity
          style={[styles.claimButton, isClaimed && styles.disabledClaimButton]}
          onPress={() => !isClaimed && handleClaim()}
          disabled={isClaimed}
        >
          <Text style={styles.claimButtonText}>{isClaimed ? t("itemDetail.claimed") : t("itemDetail.claimItem")}</Text>
        </TouchableOpacity>
      )}

      {/* Custom Confirmation Modal */}
      <Modal transparent={true} visible={isModalVisible} animationType="fade" onRequestClose={hideConfirmationModal}>
        <TouchableWithoutFeedback onPress={hideConfirmationModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{t("itemDetail.confirmClaim")}</Text>
                <Text style={styles.modalMessage}>
                  {t("itemDetail.confirmClaimMessage")}
                  {"\n"} {requiredKhairPoints} {t("itemDetail.khairPoints")}
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={hideConfirmationModal}>
                    <Text style={styles.modalButtonText}>{t("itemDetail.no")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={confirmClaimItem}>
                    <Text style={styles.modalButtonText}>{t("itemDetail.yes")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Error Modal when recipient lacks Khair Points */}
      <Modal transparent={true} visible={isErrorModalVisible} animationType="fade" onRequestClose={hideErrorModal}>
        <TouchableWithoutFeedback onPress={hideErrorModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{t("itemDetail.insufficientPoints")}</Text>
                <Text style={styles.modalMessage}>{t("itemDetail.insufficientPointsMessage")}</Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={hideErrorModal}>
                    <Text style={styles.modalButtonText}>{t("itemDetail.ok")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* City Error Modal when recipient tries to claim from another city */}
      <Modal
        transparent={true}
        visible={isCityErrorModalVisible}
        animationType="fade"
        onRequestClose={hideCityErrorModal}
      >
        <TouchableWithoutFeedback onPress={hideCityErrorModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{t("itemDetail.differentCity")}</Text>
                <Text style={styles.modalMessage}>{t("itemDetail.differentCityMessage")}</Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={hideCityErrorModal}>
                    <Text style={styles.modalButtonText}>{t("itemDetail.ok")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  )
}

const DetailItem = ({ icon, label, value }) => {
  return (
    <View style={styles.detailItem}>
      <MaterialIcon name={icon} size={24} color={theme.colors.sageGreen} style={styles.detailIcon} />
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.pearlWhite, // Changed to pearlWhite
    paddingHorizontal: 16,
  },
  headerContainer: {
    backgroundColor: theme.colors.sageGreen, // Changed to sageGreen
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
    alignItems: "center",
  },
  headerText: {
    color: theme.colors.pearlWhite, // White text on sageGreen
    fontSize: 16,
    fontWeight: "500",
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.outerSpace, // sageGreen background
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.copper, // Mint green border
    backgroundColor: theme.colors.pearlWhite, // White background for image
  },
  navButton: {
    padding: 12,
    backgroundColor: theme.colors.copper, // Mint green for buttons
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.sageGreen, // Changed to sageGreen
    textAlign: "center",
    marginVertical: 16,
    letterSpacing: 0.5,
  },
  detailsCard: {
    backgroundColor: theme.colors.pearlWhite, // Changed to pearlWhite
    borderRadius: 12,
    padding: 0,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.sageGreen, // Changed to sageGreen
    overflow: "hidden",
  },
  detailsSection: {
    padding: 16,
    backgroundColor: theme.colors.outerSpace, // Changed to pearlWhite
    
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(42, 93, 75, 0.1)', // Very light sageGreen
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.sageGreen, // Changed to sageGreen
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(42, 93, 75, 0.1)', // Very light sageGreen
    paddingBottom: 6,
    
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  detailIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: i18n.locale=='ur' ? 19 : 16,
    color: theme.colors.sageGreen, // Changed to sageGreen
    marginBottom: 2,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: i18n.locale=='ur' ? 16 : 15,
    color: theme.colors.ivory, // Black text (ivory in your theme)
    fontWeight: "400",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(42, 93, 75, 0.1)', // Very light sageGreen
    width: '100%',
  },
  noDetailsText: {
    fontSize: 16,
    color: theme.colors.error,
    textAlign: "center",
    fontStyle: "italic",
    padding: 20,
  },
  khairPointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.sageGreen, // Changed to sageGreen
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  khairPointsText: {
    fontSize: 16,
    color: theme.colors.pearlWhite, // White text on sageGreen
    fontWeight: "600",
    marginLeft: 8,
  },
  claimButton: {
    backgroundColor: theme.colors.sageGreen, // sageGreen button
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledClaimButton: {
    backgroundColor: theme.colors.placeholder,
    shadowOpacity: 0.1,
  },
  claimButtonText: {
    color: theme.colors.pearlWhite, // White text on sageGreen
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: theme.colors.pearlWhite, // Changed to pearlWhite
    padding: 24,
    borderRadius: 16,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.colors.sageGreen, // Changed to sageGreen
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.sageGreen, // sageGreen text
    marginBottom: 16,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: i18n.locale=='ur' ? 20 : 18,
    color: theme.colors.ivory, // Black text (ivory in your theme)
    textAlign: "center",
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    borderWidth: 1,
    borderColor: theme.colors.error + "80",
  },
  confirmButton: {
    backgroundColor: theme.colors.sageGreen, // sageGreen button
    borderWidth: 1,
    borderColor: theme.colors.sageGreen + "80",
  },
  modalButtonText: {
    color: theme.colors.pearlWhite, // White text on buttons
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
})

export default ItemDetail
