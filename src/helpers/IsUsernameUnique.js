import firestore from "@react-native-firebase/firestore";
export async function IsUsernameUnique (username)  {
    try {
      console.log("dfvdfvdfv")
      const querySnapshot1 = await firestore()
        .collection("recipients")
        .where("username", "==", username)
        .get();
        console.log("returning the username1111 is unique wala file");
  
        const querySnapshot2 = await firestore()
        .collection("users")
        .where("username", "==", username)
        .get();
        console.log("returning the username2222 is unique wala file");

        const querySnapshot3 = await firestore()
        .collection("ngos")
        .where("username", "==", username)
        .get();
        
        console.log(querySnapshot3.docs)
  
      console.log("returning the username is unvsdgsffsdfsdique wala file");
      return (querySnapshot1.empty && querySnapshot2.empty && querySnapshot3.empty); // If empty, username is unique
       
    
    } catch (error) {
      console.log("Error checking username:", error);
      return false;
    }
  };