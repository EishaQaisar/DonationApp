import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import React, { useState, useContext } from "react";
import { TouchableOpacity, StyleSheet, View, ImageBackground, Dimensions } from "react-native";
import { Text, Button } from "react-native-paper";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { AuthContext } from "../context/AuthContext";



const screenWidth = Dimensions.get('window').width;

export default function LoginScreen({ navigation, route }) {
  //const [email, setEmail] = useState({ value: "", error: "" });
  const [input, setInput]=useState({value:"", error:""});
  const [password, setPassword] = useState({ value: "", error: "" });
  const [phoneNumber,setPhoneNumber]=useState("");
  const [code,setCode]=useState("");
  const [confirm,setConfirm]=useState("");
  const { role } = route.params;
  const { setUser } = useContext(AuthContext); // Access setUser from AuthContext


  async function validateUser(inputValue, passwordInput) {
    try {
      let db="";
      console.log(role)
      if (role=='donor'){
        db='users';
      }
      else if (role=='recipient'){
        db='recipients'; //indvidual recipients database
      }
      else if(role=='rider'){
        db='riders';
      }
      let usersRef = firestore().collection(db);
  
      // Query for the username
      let usernameQuerySnapshot = await usersRef
        .where("username", "==", inputValue)
        .get();
  
      // Query for the phone number
      let phoneNumberQuerySnapshot = await usersRef
        .where("phone", "==", inputValue)
        .get();

        if (role=='recipient'){ //if recipient check in ngo datbase as well
          db='ngos'
          usersRef = firestore().collection(db);
  
          const usernameQuerySnapshot1 = await usersRef
            .where("username", "==", inputValue)
            .get();
  
          const phoneNumberQuerySnapshot1 = await usersRef
            .where("phone", "==", inputValue)
            .get();

        }
    
  
      // Combine results: check if either query is not empty
      const isUserFound =
        !usernameQuerySnapshot.empty || !phoneNumberQuerySnapshot.empty
  
      if (isUserFound) {
        // Retrieve the user document
        let userDoc = null;
        if (!usernameQuerySnapshot.empty) {
          userDoc = usernameQuerySnapshot.docs[0];
        } else if (!phoneNumberQuerySnapshot.empty) {
          userDoc = phoneNumberQuerySnapshot.docs[0];
        } 
       
  
        // Verify password
        const userData = userDoc.data();
        if (userData.password === passwordInput) {
          console.log("hereeee");
          setUser(userData);
          // Password matches
          return { success: true, message: "Login successful!" };
        } else {
          // Password does not match
          setPassword({ ...password, error: "Incorrect password" });

          return { success: false, message: "Invalid password" };
        }
      } else {
        setInput({ ...input, error: "User not found" });

        return { success: false, message: "User not found" };
      }
    } catch (error) {
      console.log("Error checking username/phone number:", error);
      return { success: false, message: "An error occurred during login" };
    }
  }
  
  const LoginInPressed= async()=>{
    if (!input.value || !password.value) {
      if (!input.value){
        setInput({ ...input, error: "This field is required." });
      }
      if (!password.value){
      setPassword({ ...password, error: "This field is required." });
      }

      return;
    }
    validateUser(input.value, password.value).then((result) => {
      if (result.success) {
        if (role=='donor'){
          navigation.navigate("TabNavigator",{role:"donor"});

        }
         // Success message
        // Proceed with login actions
        else if(role=='recipient'){
          console.log("recipient logged in");
          navigation.navigate("TabNavigator",{role:"recipient"});

        }
        else if (role=='rider'){
          console.log("rider logged in");
        }
      } 
    });
    
    
    
};




  const navigateToRegister = () => {
    if (role === "recipient") {
      navigation.navigate("RChoose");
    } else if (role === "donor") {
      navigation.navigate("RegisterScreenDonor");
    } else {
      navigation.navigate("RChoose"); // Optional: for other roles
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/items/0d59de270836b6eafe057c8afb642e77.jpg')} // Replace with your image path
      style={styles.imageBackground}
      blurRadius={8} // Adjust the blur intensity
    >
      <View style={styles.backButtonWrapper}>
        <BackButton goBack={navigation.goBack} />
      </View>
      
      {/* <BackButton goBack={navigation.goBack} /> */}
      <View style={styles.container}>
      
        
        <Text style={styles.header}>Hello.</Text>
        {!confirm ? (
        <>
        <View style={styles.inputContainer}>
        <TextInput
          label="Username / Phone Number"
          mode="outlined"
          style={styles.input}
          value={input.value}
          onChangeText={(text) => setInput({ value: text, error: "" })}
          error={!!input.error}
          errorText={input.error ? <Text style={styles.errorText}>{input.error}</Text> : null}

         
        />
        </View>

        <View style={styles.inputContainer}>
        <TextInput
          label="Password"
          mode="outlined"
          style={styles.input}
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: "" })}
          error={!!password.error}
          errorText={password.error ? <Text style={styles.errorText}>{password.error}</Text> : null}

          secureTextEntry
        />
        </View>
        
        
        <TouchableOpacity onPress={() => navigation.navigate("ResetPasswordScreen")}>
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>
        
        <Button mode="contained" onPress={LoginInPressed} style={styles.button}>
          Log in
        </Button>
        </>
        ) : (
          <>
          <Text>Enter the code sent to your phone</Text>
          <TextInput
          label="code"
          value={code}
          onChangeText={setCode}

        />
        <TouchableOpacity onPress={(confirmCode)}>
        <Text style={styles.forgotPassword}>confirm code</Text>
      </TouchableOpacity>
      </>
  

        )}


        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account yet?</Text>
          <TouchableOpacity onPress={navigateToRegister}>
            <Text style={styles.link}>Create one!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.background, //'rgba(255, 255, 255, 0.65)', // Slightly transparent background for better readability
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.sageGreen,
    textShadowColor: theme.colors.background, // Outline color
    textShadowOffset: { width: 2, height: 2 }, // Offset for the shadow
    textShadowRadius: 1, // Spread for the shadow
  },
  input: {
    alignSelf:'center',
    width: '100%', // Responsive input width
    marginBottom: 3,
    backgroundColor: 'white', // Ensures clear visibility of input fields
  },
  forgotPassword: {
    fontSize: 13,
    color: theme.colors.ivory,
    marginTop: -10,
    marginBottom: 20,
  },
  button: {
    width: '90%', // Responsive button width
    paddingVertical: 8,
    borderRadius: 25,
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: theme.colors.ivory,
  },
  link: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.colors.sageGreen,
    marginLeft: 5,
  },
  backButtonWrapper: {
    position: 'absolute',
    top: 10, 
    left: 30, 
    padding: 10, 
  },
  errorText: {
    fontSize: 13,
    marginTop: -5,
  },
  inputContainer: {
    width:'90%',
    marginBottom:10
   
    
  },
});