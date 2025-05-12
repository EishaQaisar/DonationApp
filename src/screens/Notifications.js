"use client"

import { useEffect, useState, useContext, useCallback } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from "react-native"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import { getBaseUrl } from "../helpers/deviceDetection"
import { theme } from "../core/theme"
import { useFocusEffect } from "@react-navigation/native"
import firestore from "@react-native-firebase/firestore"
import { UserProfileContext } from "../context/UserProfileContext"
import ScheduleRDeliveryScreen from "./ScheduleRDeliveryScreen"
import i18n, { t } from "../i18n" // Import the translation function

const Notifications = ({ route, navigation }) => {
  const { role } = route.params
  const [notifications, setNotifications] = useState([])
  const [message, setMessage] = useState("")
  const { user } = useContext(AuthContext)
  const isDonor = role && role.toLowerCase() === "donor"
  const isRecipient = role && role.toLowerCase() === "recipient"
  const [refreshing, setRefreshing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { userProfile, setUserProfile } = useContext(UserProfileContext)

  const isUrdu = i18n.locale === "ur";
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }


  // Function to update khair points for a user
  const updateKhairPoints = async (uid, newPoints, profileCollection) => {
    if (isUpdating) return false

    setIsUpdating(true)
    try {
      // Update in Firestore
      await firestore().collection(profileCollection).doc(uid).update({
        khairPoints: newPoints,
      })

      console.log("Khair points updated successfully to", newPoints)
      return true
    } catch (error) {
      console.error("Error updating khair points:", error)
      return false
    } finally {
      setIsUpdating(false)
    }
  }

  const updataKhairPoints = async (item) => {
    try {
      // Get the recipient's username
      const recipientUsername = item.claimerUsername;
  
      // Get the item quantity and category for khair points calculation
      const itemQuantity = item.quantity || 1; // Default to 1 if not specified
      const itemCategory = item.donationType;
  
      let totalKhairPointsToRefund = item.khairPoints;
  
      console.log(`Attempting to refund ${totalKhairPointsToRefund} khair points to ${recipientUsername}`);
  
      // First, check if the recipient exists in the "recipients" collection
      let recipientQuery = await firestore()
        .collection("recipients")
        .where("username", "==", recipientUsername)
        .get();
  
      let recipientUid = null;
      let profileCollection = null;
  
      if (!recipientQuery.empty) {
        // Found in "recipients" collection
        const recipientDoc = recipientQuery.docs[0];
        recipientUid = recipientDoc.id;
        profileCollection = "individual_profiles";
      } else {
        // Not found in "recipients", check in "ngo"
        console.log(`Recipient not found in "recipients", checking in "ngo" database...`);
        recipientQuery = await firestore()
          .collection("ngos")
          .where("username", "==", recipientUsername)
          .get();
  
        if (!recipientQuery.empty) {
          // Found in "ngo" collection
          const recipientDoc = recipientQuery.docs[0];
          recipientUid = recipientDoc.id;
          profileCollection = "ngo_profiles";
        } else {
          console.error(`Recipient with username ${recipientUsername} not found in both databases.`);
          setMessage(t("notifications.recipientNotFound", "Recipient not found, but claim was declined."));
          return;
        }
      }
  
      // Get the recipient's profile document
      const profileDoc = await firestore()
        .collection(profileCollection)
        .doc(recipientUid)
        .get();
  
      if (!profileDoc.exists) {
        console.error(`Profile for UID ${recipientUid} not found in ${profileCollection}`);
        setMessage(t("notifications.claimDeclinedNoRefund", "Claim declined successfully but couldn't refund khair points."));
        return;
      }
  
      // Get current khair points and update
      const currentKhairPoints = profileDoc.data().khairPoints || 0;
      const newKhairPoints = currentKhairPoints + totalKhairPointsToRefund;
  
      // Update khair points in the correct profile collection
      const success = await updateKhairPoints(recipientUid, newKhairPoints, profileCollection);
  
      if (success) {
        console.log(`Updated khair points for ${recipientUsername}: ${currentKhairPoints} -> ${newKhairPoints}`);
        setUserProfile((prevProfile) => ({
          ...prevProfile, // This preserves ALL existing properties
          khairPoints: newKhairPoints,
        }));
        setMessage(t("notifications.claimDeclinedRefunded", "Claim declined successfully and khair points refunded."));
      } else {
        setMessage(t("notifications.claimDeclinedRefundFailed", "Claim declined but failed to refund khair points."));
      }
    } catch (error) {
      console.error("Error updating khair points:", error);
      setMessage(t("notifications.claimDeclinedRefundError", "Claim declined but error refunding khair points."));
    }
  };
  
  const changingStatus = async (category, id) => {
    try {
      const BASE_URL = await getBaseUrl() // If you're using a base URL helper function
      const itemId = id

      await axios.post(`${BASE_URL}/api/reverse-claim-status`, { itemId, category }) // Pass the id in the request body
      console.log("done")
      // setNot(not.filter(item => item.id !== id));
    } catch (error) {
      console.error(`Error changing claim status of table ${category}:`, error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const BASE_URL = await getBaseUrl()
      const response = await axios.get(`${BASE_URL}/api/claimed-items`)
      const responses = await axios.get(`${BASE_URL}/api/claimed-status`)

      if (response.data.status === "success") {
        let filteredItems = []

        if (isDonor) {
          filteredItems = response.data.data.filter((item) => item.donorUsername === user.username)

          if (filteredItems.length > 0) {
            console.log("Fetched notifications for donor")
            setNotifications(filteredItems)
          } else {
            setMessage(t("notifications.noItemsClaimedDonor", "No items claimed for this donor."))
          }
        } else if (isRecipient) {
          console.log("Fetched items for recipient:", responses.data.data)

          filteredItems = responses.data.data.filter(
            (item) => item.claimerUsername === user.username && item.claimStatus === "Approved",
          )

          if (filteredItems.length > 0) {
            setNotifications(filteredItems)
          } else {
            setMessage(t("notifications.noApprovedItemsRecipient", "No approved items found for this recipient."))
          }
        }
      } else {
        setMessage(t("notifications.noClaimedItems", "No claimed items found."))
      }
      // Reset notification count after viewing
      await axios.get(`${BASE_URL}/api/reset-notification-count`, {
        params: {
          username: user.username,
          role: role
        }
      });
      
      setRefreshing(false)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setMessage(t("notifications.failedToLoad", "Failed to load notifications."))
      setRefreshing(false)
    }
  }

  // Fetch notifications when component mounts
  useEffect(() => {
    if (role && user && user.username) {
      fetchNotifications()
    }
  }, [role, user])

  // Fetch notifications when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (role && user && user.username) {
        console.log("Screen focused, fetching notifications")
        fetchNotifications()
      }

      // Optional: Set up a polling interval for real-time updates
      const interval = setInterval(() => {
        if (role && user && user.username) {
          console.log("Polling for new notifications")
          fetchNotifications()
        }
      }, 30000) // Poll every 30 seconds

      return () => clearInterval(interval) // Clean up interval on screen unfocus
    }, [role, user]),
  )

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchNotifications()
  }, [])

  const handleApprove = async (id) => {
    try {
      const BASE_URL = await getBaseUrl()
      await axios.post(`${BASE_URL}/api/approve-claim`, { id })

      // Immediately remove the notification from the UI
      setNotifications(notifications.filter((item) => item.id !== id))
      setMessage(t("notifications.claimApproved", "Claim approved successfully."))

      // Also refresh in the background to ensure data consistency
      fetchNotifications()
      navigation.navigate("ScheduleRDeliveryScreen", { id: id })

      console.log(id)
    } catch (error) {
      console.error("Error approving claim:", error)
      setMessage(t("notifications.approvalFailed", "Failed to approve the claim."))
    }
  }

  const declineClaim = async (item) => {
    try {
      const id = item.id
      const BASE_URL = await getBaseUrl()
      const response = await axios.delete(`${BASE_URL}/api/delete-claim/${id}`)
      changingStatus(item.donationType, item.itemId)

      if (response.data.status === "success") {
        // Immediately remove the notification from the UI
        setNotifications(notifications.filter((notItem) => notItem.id !== id))
        setMessage(t("notifications.claimDeclined", "Claim declined successfully."))

        // Process khair points refund
        await updataKhairPoints(item)

        // Also refresh in the background to ensure data consistency
        fetchNotifications()
      } else {
        setMessage(t("notifications.declineFailed", "Failed to decline the claim."))
      }
    } catch (error) {
      console.error("Error declining claim:", error)
      setMessage(t("notifications.declineFailed", "Failed to decline the claim."))
    }
  }

  return (
    <View style={[styles.container, isUrdu && styles.rtlContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, isUrdu && styles.urduText]}>
          {t("notifications.title", "Notifications")}
        </Text>
      </View>

      {message && <Text style={[styles.message, isUrdu && styles.urduText]}>{message}</Text>}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.sageGreen]}
            tintColor={theme.colors.sageGreen}
          />
        }
      >
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <View key={item.id} style={styles.notificationItem}>
              <Text style={[styles.itemText, isUrdu && styles.urduText]}>
                {t("notifications.dateOfClaim", "Date of Claim")}: {formatDate(item.claimDate)}
              </Text>
              <Text style={[styles.itemText, isUrdu && styles.urduText]}>
                {t("notifications.itemType", "Item type")}: {t(`titles.${item.donationType.toLowerCase()}`, item.donationType)}
              </Text>
              <Text style={[styles.itemText, isUrdu && styles.urduText]}>
                {t("notifications.claimedBy", "Claimed by")}: {item.claimerUsername}
              </Text>
              <Text style={[styles.itemText, isUrdu && styles.urduText]}>
                {t("notifications.itemName", "Item name")}: {t(`clothes.item_category_options.${item.itemName}`, { defaultValue: item.itemName })}

              </Text>

              {isDonor ? (
                <View style={[styles.buttonContainer, isUrdu && styles.rtlButtonContainer]}>
                  <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(item.id)}>
                    <Text style={[styles.buttonText, isUrdu && styles.urduText]}>
                      {t("notifications.approve", "Approve")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.declineButton} onPress={() => declineClaim(item)}>
                    <Text style={[styles.buttonText, isUrdu && styles.urduText]}>
                      {t("notifications.decline", "Decline")}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={[styles.approvedText, isUrdu && styles.urduText]}>
                  {t("notifications.itemApproved", "Your item has been APPROVED.")}
                </Text>
              )}
            </View>
          ))
        ) : (
          <Text style={[styles.noNotificationText, isUrdu && styles.urduText]}>
            {t("notifications.noNewNotifications", "No new notifications.")}
          </Text>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.charcoalBlack,
    padding: 10,
  },
  rtlContainer: {
    direction: 'rtl',
  },
  header: {
    marginTop: 10,
    padding: 10,
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: theme.colors.sageGreen,
  },
  title: {
    fontSize: 30,
    color: theme.colors.ivory,
    fontWeight: "bold",
  },
  message: {
    color: theme.colors.ivory,
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
  },
  scrollViewContent: {
    paddingBottom: 20, // Extra padding for the scrollable content
  },
  notificationItem: {
    backgroundColor: theme.colors.outerSpace,
    padding: 10,
    borderRadius: 15,
    marginTop: 20, // 👈 Added this
    marginBottom: 20,
    borderWidth: 2,
    borderColor: theme.colors.sageGreen,
    shadowColor: theme.colors.sageGreen,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  
  itemText: {
    fontSize: 18,
    color: theme.colors.ivory,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  rtlButtonContainer: {
    flexDirection: "row-reverse",
  },
  approveButton: {
    backgroundColor: theme.colors.sageGreen,
    padding: 10,
    borderRadius: 15,
  },
  declineButton: {
    backgroundColor: theme.colors.copper,
    padding: 10,
    borderRadius: 15,
  },
  buttonText: {
    color: theme.colors.ivory,
    fontWeight: "bold",
    fontSize: 16,
  },
  approvedText: {
    fontSize: 16,
    color: theme.colors.sageGreen,
    marginTop: 10,
    fontWeight: "bold",
  },
  noNotificationText: {
    fontSize: 18,
    color: theme.colors.ivory,
    textAlign: "center",
    marginTop: 20,
  },
  urduText: {
    fontSize: 20, // Increase font size for Urdu
    fontFamily: 'System', // You might want to use a specific Urdu font if available
  },
})

export default Notifications