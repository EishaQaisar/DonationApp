import axios from "axios"
import { getBaseUrl } from "./deviceDetection"
import firestore from "@react-native-firebase/firestore"

/**
 * Sets up a listener to sync delivery status from Firestore to MySQL
 * @param {string} orderId - The ID of the order to sync
 * @returns {Function} - Unsubscribe function to stop listening
 */
export function syncDeliveryStatus(orderId) {
  console.log(`Setting up delivery status sync for order: ${orderId}`)

  // Return the unsubscribe function from the Firestore listener
  return firestore()
    .collection("orders")
    .doc(orderId)
    .onSnapshot(async (snapshot) => {
      const orderData = snapshot.data()

      if (!orderData) {
        console.log(`Order ${orderId} not found in Firestore`)
        return
      }

      // Check if the status is "delivered"
      if (orderData.status === "delivered") {
        console.log(`Order ${orderId} marked as delivered in Firestore, updating MySQL...`)

        try {
          // Get the claimed item ID from the order data
          const claimedItemId = orderData.claimedItemId

          if (!claimedItemId) {
            console.error("No claimed item ID found in the order data")
            return
          }

          // Update the MySQL database
          await updateMySQLDeliveryStatus(claimedItemId)
          console.log(`Successfully updated MySQL delivery status for claimed item: ${claimedItemId}`)
        } catch (error) {
          console.error("Error syncing delivery status to MySQL:", error)
        }
      }
    })
}

/**
 * Updates the delivery status in MySQL database
 * @param {string|number} claimedItemId - The ID of the claimed item in MySQL
 * @returns {Promise<Object>} - Response from the API
 */
export async function updateMySQLDeliveryStatus(claimedItemId) {
  try {
    // Get the base URL dynamically based on the device or environment
    const BASE_URL = await getBaseUrl()
    console.log("Base URL for updating delivery status:", BASE_URL)

    // Send the PUT request to update the claimed item status
    const response = await axios.put(`${BASE_URL}/api/update-delivery-status`, {
      id: claimedItemId,
      scheduledelivery: "Delivered",
    })

    // Handle success response
    console.log("MySQL delivery status updated successfully:", response.data)
    return response.data
  } catch (error) {
    // Log the full error for debugging purposes
    console.error("Error updating MySQL delivery status:", error.message)
    if (error.response) {
      // Handle server-side errors
      console.error("Response data:", error.response.data)
      console.error("Response status:", error.response.status)
      console.error("Response headers:", error.response.headers)
    } else if (error.request) {
      // Handle client-side or network errors
      console.error("No response received. Request data:", error.request)
    } else {
      // General error handling
      console.error("Error during request setup:", error.message)
    }
    throw error
  }
}
