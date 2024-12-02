import firestore from "@react-native-firebase/firestore";
export async function IsCnicUnique(cnic) {
    try {
      const querySnapshot1 = await firestore()
        .collection("users")
        .where("idCard", "==", cnic)
        .get();
  
       const querySnapshot2 = await firestore()
        .collection("recipients")
        .where("idCard", "==", cnic)
        .get();
  
  
      return (querySnapshot1.empty && querySnapshot2.empty); // If empty, CNIC/ID card is unique
    } catch (error) {
      console.log("Error checking CNIC:", error);
      return false;
    }
  };
  
  