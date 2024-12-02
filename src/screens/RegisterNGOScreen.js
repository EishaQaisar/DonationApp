import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, ImageBackground, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import * as DocumentPicker from 'expo-document-picker'; 
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";


import { emailValidator } from "../helpers/emailValidator";
import { nameValidator } from "../helpers/nameValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { usernameValidator } from "../helpers/usernameValidator";
import { numberValidator } from "../helpers/numberValidator";
import { IsUsernameUnique } from "../helpers/IsUsernameUnique";
import { IsUniqueNumber } from "../helpers/isUniqueNumber"

export default function RegisterNGOScreen({ navigation }) {
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [phoneNumber, setPhoneNumber] = useState({value:"", error:""});
  const [username, setUsername] = useState({ value: "", error: "" });
  const [certificate, setCertificate] = useState(null);
  const [approved]=useState({value:"false"});
  const [confirm, setConfirm] = useState("");



  // Handle the document pick and store the result in state
  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', // Specify PDF type
      });

      if (result.type === 'cancel') {
        console.log('Document picker was cancelled');
        return;
      }

      // Store the selected document details in state
      setCertificate(result);
      console.log(result); // Log the result for debugging
      setCertificate(result.assets[0]);
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  const validateFields = async (username, phoneNumber) => {
    const isUsernameUnique = await IsUsernameUnique(username);
    const isPhoneUnique = await IsUniqueNumber(phoneNumber);
    
  
    return {
      isUsernameUnique,
      isPhoneUnique,
      
    };
  }

  const onSignUpPressed =async () => {
    console.log("here");

    const usernameError=usernameValidator(username.value);
    const nameError = nameValidator(name.value);
    const numberError=numberValidator(phoneNumber.value);
    const passwordError=passwordValidator(password.value);
    if (nameError  || passwordError || usernameError || numberError ) {
      setName({ ...name, error: nameError });
      setPassword({...password, error:passwordError});
      setUsername({ ...username, error: usernameError });
      setPhoneNumber({ ...phoneNumber,error: numberError });
      return;
    }

    const { isUsernameUnique, isPhoneUnique} = await validateFields(
      username.value,
      phoneNumber.value,
    );

    if (!isUsernameUnique) {
      setUsername({ ...username, error: "This username is already taken." });
      return;
    }
    if (!isPhoneUnique) {
      setPhoneNumber({...phoneNumber, error: "Phone number is already registered."});
      return;
    }
    

    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber.value);
      setConfirm(confirmation);
      console.log("Phone Number:", phoneNumber);
    } catch (error) {
      console.log("Error sending code", error);
    }
  };

  const confirmCode = async () => {
    if (!confirm) {
      console.log("No confirmation object. Call signInWithPhoneNumber first.");
      return;
    }

    try {
      const userCredential = await confirm.confirm(code);
      const user = userCredential.user;

      const userDocument = await firestore().collection("ngos").doc(user.uid).get();
      console.log(userDocument)

      if (userDocument.exists) {
        
        navigation.navigate("TabNavigator");
      } 
      else {
        try {
          await firestore()
            .collection("ngos")
            .doc(user.uid)
            .set({
              name: name.value,
              username: username.value,
              phone: phoneNumber.value,
              password: password.value, // Hash password before saving
              approved:approved.value
            });

          navigation.navigate("WaitForApprovalScreen", { uid: user.uid });
        } catch (error) {
          console.log("Error saving details", error);
        }
      }
    } catch (error) {
      console.log("Invalid verification code:", error);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/items/0d59de270836b6eafe057c8afb642e77.jpg')} // Replace with your image path
      style={styles.imageBackground}
      blurRadius={8} // Adjust the blur intensity
    >
      <BackButton goBack={navigation.goBack} />
      <View style={styles.container}>
      <Text style={styles.header}>Hello.</Text>
      {!confirm ? (
          <>

      <View style={styles.inputContainer}>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        style={styles.input}
        onChangeText={(text) => setName({ value: text, error: "" })}
        error={!!name.error}
        errorText={name.error}
      />
      </View>
      <View style={styles.inputContainer}>
            <TextInput
              label="Username"
              returnKeyType="next"
              value={username.value}
              style={styles.input}
              onChangeText={(text) => setUsername({ value: text, error: "" })}
              error={!!username.error}
              errorText={username.error ? <Text style={styles.errorText}>{username.error}</Text> : null}

            />
            </View>

   
      
      <View style={styles.inputContainer}>
            <TextInput
              label="Phone Number"
              returnKeyType="next"
              value={phoneNumber.value}
              style={styles.input}
              onChangeText={(text) => setPhoneNumber({ value: text, error: "" })}
              error={!!phoneNumber.error}
              errorText={phoneNumber.error ? <Text style={styles.errorText}>{phoneNumber.error}</Text> : null}
            />
            </View>

            
        <View style={styles.inputContainer}>
      <TextInput
        label="Password"
        returnKeyType="done"
        style={styles.input}
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      </View>
      


      {/* Button to pick certificate */}
      <Button mode="contained" onPress={handleDocumentPick} style={{ marginTop: 24 }}>
        Upload Certificate
      </Button>

      {/* Display selected certificate details */}
      {certificate && (
        <View style={styles.certificateContainer}>
          <Text style={styles.certificateText}>Selected Certificate:</Text>
          <Text style={styles.certificateText}>Name: {certificate.name}</Text>
          <Text style={styles.certificateText}>URI: {certificate.uri}</Text>
        </View>
      )}

      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Next
      </Button>
      </>
        ) : (
          <>
          <Text>Enter the code sent to your phone</Text>
            <TextInput label="Code" value={code} onChangeText={setCode} style={styles.input} />
            <TouchableOpacity onPress={confirmCode}>
              <Text style={styles.forgotPassword}>Confirm Code</Text>
            </TouchableOpacity>
          </>
        )}
      <View style={styles.row}>
        <Text style={styles.already}>I already have an account !</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.replace("LoginScreen",{ role: "recipient" })}>
          <Text style={styles.link}>Log in</Text>
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
    backgroundColor: theme.colors.background, // Slightly transparent background for better readability
    borderRadius: 40,
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
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  input: {
    alignSelf:'center',
    width: '100%', // Responsive input width
    marginBottom: 15,
    backgroundColor: 'white', // Ensures clear visibility of input fields
  },
  already: {
    fontWeight: "bold",
    color: theme.colors.ivory,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.sageGreen,
  },
  certificateContainer: {
    marginTop: 16,
  },
  certificateText: {
    fontSize: 16,
    color: 'white',
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

