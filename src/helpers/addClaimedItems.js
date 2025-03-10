import axios from 'axios';
import { getBaseUrl } from './deviceDetection'; // This function returns the base URL based on the environment

export async function addClaimedItem(claimedItemData) {
  // Destructure the claimedItemData object to get the required fields
  const { itemId, itemName, claimerUsername, donorUsername, donationType, claimStatus,scheduledelivery } = claimedItemData;

  try {
    // Get the base URL dynamically based on the device or environment
    const BASE_URL = await getBaseUrl();
    console.log("Base URL for claimed items:", BASE_URL);

    // Send the POST request with the claimed item details
    const response = await axios.post(`${BASE_URL}/api/add-claimed-item`, {
      itemId,
      itemName, // The name of the donated item
      claimerUsername,
      donorUsername,
      donationType, // e.g., "food", "clothes", "education"
      claimStatus, // e.g., "Claimed", "Pending", "Approved"
      scheduledelivery
    });

    // Handle success response
    console.log('Claimed item added successfully:', response.data);
    return response.data; // Optionally return the response if needed
  } catch (error) {
    // Log the full error for debugging purposes
    console.error('Error adding claimed item:', error.message);
    if (error.response) {
      // Handle server-side errors
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // Handle client-side or network errors
      console.error('No response received. Request data:', error.request);
    } else {
      // General error handling
      console.error('Error during request setup:', error.message);
    }
  }
}