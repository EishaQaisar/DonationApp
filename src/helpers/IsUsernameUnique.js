import firestore from "@react-native-firebase/firestore";
export async function IsUsernameUnique (username)  {
    try {
      console.log("dfvdfvdfv")
      const querySnapshot1 = await firestore()
        .collection("recipients")
        .where("username", "==", username)
        .get();
  
        const querySnapshot2 = await firestore()
        .collection("users")
        .where("username", "==", username)
        .get();

        const querySnapshot3 = await firestore()
        .collection("ngos")
        .where("username", "==", username)
        .get();
        
  
  
      return (querySnapshot1.empty && querySnapshot2.empty && querySnapshot3.empty); // If empty, username is unique
    } catch (error) {
      console.log("Error checking username:", error);
      return false;
    }
  };