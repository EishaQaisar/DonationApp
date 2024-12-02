import firestore from "@react-native-firebase/firestore";

export async function IsUniqueNumber(phoneNumber) {  // Added async here
  try {
    
    // Check in "users" collection
    const querySnapshot1 = await firestore()
      .collection("users")
      .where("phone", "==", phoneNumber)
      .get();
  
    // Check in "recipients" collection
    const querySnapshot2 = await firestore()
      .collection("recipients")
      .where("phone", "==", phoneNumber)
      .get();

      const querySnapshot3 = await firestore()
      .collection("ngos")
      .where("phone", "==", phoneNumber)
      .get();
  
    // Return true if both collections have no matching phone number
    return querySnapshot1.empty && querySnapshot2.empty && querySnapshot3.empty; // If empty, phone number is unique
  } catch (error) {
    console.log("Error checking phone number:", error);
    return false;
  }
}
