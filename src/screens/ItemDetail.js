
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
import axios from 'axios';


const ItemDetail = ({ route }) => {
  const { item, category, role } = route.params
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addToCart, isInCart } = useCart()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const tabBarHeight = useBottomTabBarHeight()
  const { userProfile, setUserProfile } = useContext(UserProfileContext)
  const [requiredKhairPoints, setRequiredKhairPoints] = useState(0)
  const { user } = useContext(AuthContext)
  const [not, setNot] = useState([]);

  const isClaimed = isInCart(item)
  const khairPointsPerCategory = {
    Food: 10,
    Education: 20,
    Clothes: 15,
  }

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Function to update khair points directly in this component
  const updateKhairPoints = async (newPoints) => {
    if (!userProfile || isUpdating) return false

    setIsUpdating(true)
    try {
      // Update in Firestore
      if (user.recipientType==='individual'){
        await firestore().collection("individual_profiles").doc(user.uid).update({
          khairPoints: newPoints,
        })

      }
      else if(user.recipientType==='ngo'){
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
              <DetailItem icon="food" label="Meal" value={item.mealType} />
              <DetailItem icon="silverware-fork-knife" label="Food Type" value={item.foodType} />
              <DetailItem icon="numeric" label="Quantity" value={item.quantity.toString()} />
              <DetailItem icon="text-short" label="Description" value={item.description} />
            </View>
          </View>
        )
      case "Clothes":
        return (
          <View>
            {/* Display clothes category only when item category is Clothes */}
            {item.itemCategory === "Shoes" && <Text style={styles.title}> {item.itemCategory}</Text>}
            {item.itemCategory === "Clothes" && <Text style={styles.title}>{item.clothesCategory}</Text>}

            <View style={styles.detailsCard}>
              {/* Conditionally display size with appropriate value based on category */}
              <DetailItem
                icon="tshirt-crew"
                label="Size"
                value={
                  item.itemCategory === "Clothes"
                    ? item.clothesCategory === "Upper Wear"
                      ? item.upperWearSize
                      : item.clothesCategory === "Bottom Wear"
                        ? item.bottomWearSize
                        : item.clothesCategory === "Full Outfit"
                          ? item.clothingSize
                          : "N/A"
                    : item.itemCategory === "Shoes"
                      ? item.shoeSize
                      : "N/A"
                }
              />

              {/* Only display fabric if not shoes and not accessories */}
              {!(
                item.itemCategory === "Shoes" ||
                (item.itemCategory === "Clothes" && item.clothesCategory === "Accessories")
              ) && <DetailItem icon="texture-box" label="Fabric" value={item.fabric} />}

              <DetailItem icon="weather-sunny" label="Season" value={item.season} />
              <DetailItem icon="human-male-child" label="Age" value={item.age_category} />
              <DetailItem icon="gender-male-female" label="Gender" value={item.gender} />
              <DetailItem icon="star-outline" label="Condition" value={item.c_condition} />
              <DetailItem icon="numeric" label="Quantity" value={item.quantity.toString()} />
            </View>
          </View>
        )
      case "Education":
        return (
          <View>
            <Text style={styles.title}>{item.itemName}</Text>
            <View style={styles.detailsCard}>
              {item.type !== "Stationary" && (
                <DetailItem icon="book-open-variant" label="Subject" value={item.subject} />
              )}
              {item.type === "Books" && <DetailItem icon="school" label="Grade" value={item.grade} />}
              {item.type === "Books" && <DetailItem icon="school" label="Institute" value={item.institution} />}
              <DetailItem icon="school" label="Level" value={item.level} />
              <DetailItem icon="shape-outline" label="Type" value={item.type} />
              <DetailItem icon="star-outline" label="Condition" value={item.c_condition} />
              <DetailItem icon="numeric" label="Quantity" value={item.quantity.toString()} />
              <DetailItem icon="text-short" label="Description" value={item.description} />
              <DetailItem icon="account" label="Donor Username" value={item.donorUsername} />
            </View>
          </View>
        )
      default:
        return (
          <View style={styles.detailsCard}>
            <Text style={styles.noDetailsText}>No additional details available.</Text>
          </View>
        )
    }
  }
  /*notification work*/
  const claimItemInDB = async () => {
    let requiredItemName;

    if (category==='Food'){
      requiredItemName=item.foodName;

    }
    else if (category==='Clothes'){
      requiredItemName=item.itemCategory

    }
    else {
      requiredItemName=item.itemName
     
    }
    const claimedItemDetails = {
        donorUsername: item.donorUsername,
        claimerUsername: user.username, // Replace this with the actual claimer's username (you can get this from user context or route)
        donationType: category,
        itemId: item.id,
        claimStatus:'Claimed',
        scheduledelivery:'Unscheduled',
         // Assuming each item has a unique ID
         itemName:requiredItemName,
         khairPoints: parseInt(requiredKhairPoints)
    };

    try {
      const BASE_URL = await getBaseUrl();
      const response = await axios.post(`${BASE_URL}/api/add-claimed-item`, claimedItemDetails);
      
      console.log('Item claimed successfully in the database');
      return response.data;
    } catch (error) {
      // Better error logging
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error('Server error:', error.response.status, error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
      }
      console.error('Error config:', error.config);
      throw error;
    }
};

const changingStatus = async (category,id) => {
  try {
      const BASE_URL = await getBaseUrl();  // If you're using a base URL helper function

      await axios.post(`${BASE_URL}/api/approve-claims`, { id,category }); // Pass the id in the request body
      // setNot(not.filter(item => item.id !== id));

      
  } catch (error) {
      console.error(`Error changing claim status of table ${category}:`, error);
      
  }
};


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
    const newKhairPoints = Math.max(0, userProfile.khairPoints - requiredKhairPoints);


    // Update khair points using the local function
    const success = await updateKhairPoints(newKhairPoints)
    

    if (success) {
      changingStatus(category,item.id);
      addToCart(item,category) // Add to cart if points were successfully updated
      claimItemInDB();
      setIsModalVisible(false)
    } else {
      // Handle error - could show an error message
      setIsModalVisible(false)
      // Optionally show an error toast or alert
    }
  }
  const handleClaim = () => {
    const itemKhairPoints = khairPointsPerCategory[category] || 0
    setRequiredKhairPoints(item.quantity * itemKhairPoints)
    console.log("fsefwefi", item.quantity * itemKhairPoints)
    console.log(userProfile.khairPoints)

    if (userProfile.khairPoints >= (item.quantity * itemKhairPoints)) {

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
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={handlePreviousImage} style={styles.navButton}>
          <Icon name="chevron-left" size={20} color={theme.colors.ivory} />
        </TouchableOpacity>
        <Image source={item.images[currentImageIndex]} style={styles.image} />
        <TouchableOpacity onPress={handleNextImage} style={styles.navButton}>
          <Icon name="chevron-right" size={20} color={theme.colors.ivory} />
        </TouchableOpacity>
      </View>

      {renderCategoryDetails()}

      {/* Only show claim button if user is NOT a donor */}
      {!isDonor && (
        <TouchableOpacity
          style={[styles.claimButton, isClaimed && styles.disabledClaimButton]}
          onPress={() => !isClaimed && handleClaim()}
          disabled={isClaimed}
        >
          <Text style={styles.claimButtonText}>{isClaimed ? "Claimed" : "Claim Item"}</Text>
        </TouchableOpacity>
      )}

      {/* Custom Confirmation Modal */}
      <Modal transparent={true} visible={isModalVisible} animationType="fade" onRequestClose={hideConfirmationModal}>
        <TouchableWithoutFeedback onPress={hideConfirmationModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Confirm Claim</Text>
                <Text style={styles.modalMessage}>
                  Are you sure you want to claim this item?
                  {"\n"} {requiredKhairPoints} Khair Points will be deducted.
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={hideConfirmationModal}>
                    <Text style={styles.modalButtonText}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={confirmClaimItem}>
                    <Text style={styles.modalButtonText}>Yes</Text>
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
                <Text style={styles.modalTitle}>Insufficient Khair Points</Text>
                <Text style={styles.modalMessage}>You do not have enough Khair Points to claim this item.</Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={hideErrorModal}>
                    <Text style={styles.modalButtonText}>OK</Text>
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

const DetailItem = ({ icon, label, value }) => (
  <View style={styles.detailItem}>
    <MaterialIcon name={icon} size={24} color={theme.colors.sageGreen} style={styles.detailIcon} />
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.charcoalBlack,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  navButton: {
    padding: 10,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: theme.colors.pearlWhite,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  detailsCard: {
    backgroundColor: theme.colors.TaupeBlack,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  detailIcon: {
    marginRight: 15,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 16,
    color: theme.colors.ivory,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 18,
    color: theme.colors.pearlWhite,
    fontWeight: "500",
  },
  noDetailsText: {
    fontSize: 16,
    color: theme.colors.ivory,
    textAlign: "center",
  },
  claimButton: {
    backgroundColor: theme.colors.sageGreen,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  disabledClaimButton: {
    backgroundColor: theme.colors.outerSpace,
  },
  claimButtonText: {
    fontSize: 18,
    color: theme.colors.ivory,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: 300,
    backgroundColor: theme.colors.charcoalBlack,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 24,
    color: theme.colors.pearlWhite,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 18,
    color: theme.colors.ivory,
    textAlign: "center",
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: theme.colors.outerSpace,
  },
  confirmButton: {
    backgroundColor: theme.colors.sageGreen,
  },
  modalButtonText: {
    fontSize: 18,
    color: theme.colors.ivory,
    fontWeight: "bold",
  },
})

export default ItemDetail
