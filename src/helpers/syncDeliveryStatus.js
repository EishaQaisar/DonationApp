import axios from "axios";
import { getBaseUrl } from "./deviceDetection";

export const syncDeliveryStatus = async (orderId) => {
  if (!orderId) {
    console.error("No order ID provided for syncDeliveryStatus");
    return;
  }

  console.log(`(SYNC) Directly updating scheduledelivery for order: ${orderId}`);

  try {
    const BASE_URL = await getBaseUrl();

    // Define the scheduledelivery value
    const scheduledelivery = "delivered"; // or dynamically calculate if needed

    // Only pass id and scheduledelivery in the request body
    const response = await axios.put(`${BASE_URL}/api/update-delivery-status`, {
      id: orderId,
      scheduledelivery: scheduledelivery,  // Only include this field
    });

    console.log("✅ MySQL database updated successfully:", response.data);
  } catch (error) {
    console.error("❌ Error updating MySQL database:", error);

    if (error.response) {
      console.error("Server error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
  }
};
