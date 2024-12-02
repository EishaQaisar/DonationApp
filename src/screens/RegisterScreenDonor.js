import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, ImageBackground } from "react-native";
import { Text } from "react-native-paper";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { nameValidator} from "../helpers/nameValidator";
import { idCardValidator } from "../helpers/idCardValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { usernameValidator } from "../helpers/usernameValidator";

import { numberValidator } from "../helpers/numberValidator";
import { ScrollView } from "react-native-gesture-handler";
import { IsCnicUnique } from "../helpers/IsCnicUnique";
import { IsUsernameUnique } from "../helpers/IsUsernameUnique";
import { IsUniqueNumber } from "../helpers/isUniqueNumber";



export default function RegisterScreenDonor({ navigation }) {
  const [name, setName] = useState({ value: "", error: "" });
  const [username, setUsername] = useState({ value: "", error: "" });
  const [phoneNumber, setPhoneNumber] = useState({value:"", error:""});
  const [password, setPassword] = useState({ value: "", error: "" });
  const [idCard, setidCard] = useState({ value: "", error: "" });
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState("");
  const [approved]=useState({value:"false"});


  const validateFields = async (username, phoneNumber, cnic) => {
    const isUsernameUnique = await IsUsernameUnique(username);
    const isPhoneUnique = await IsUniqueNumber(phoneNumber);
    const isCnicUnique = await IsCnicUnique(cnic);
    
  
    return {
      isUsernameUnique,
      isPhoneUnique,
      isCnicUnique,
    };
  }

  const onSignUpPressed = async () => {
    console.log("here");

    const usernameError=usernameValidator(username.value);
    const nameError = nameValidator(name.value);
    const numberError=numberValidator(phoneNumber.value);
    const passwordError=passwordValidator(password.value);
    const idCardError = idCardValidator(idCard.value);
    if (nameError || idCardError || passwordError || usernameError || numberError ) {
      setName({ ...name, error: nameError });
      setidCard({ ...idCard, error: idCardError });
      setPassword({...password, error:passwordError});
      setUsername({ ...username, error: usernameError });
      setPhoneNumber({ ...phoneNumber,error: numberError });
      return;
    }

    const { isUsernameUnique, isPhoneUnique, isCnicUnique } = await validateFields(
      username.value,
      phoneNumber.value,
      idCard.value
    );

    if (!isUsernameUnique) {
      setUsername({ ...username, error: "This username is already taken." });
      return;
    }
    if (!isPhoneUnique) {
      setPhoneNumber({...phoneNumber, error: "Phone number is already registered."});
      return;
    }
    if (!isCnicUnique) {
      setidCard({ ...idCard, error: "This CNIC is already registered." });
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

      const userDocument = await firestore().collection("users").doc(user.uid).get();
      console.log(userDocument)

      if (userDocument.exists) {
        
        navigation.navigate("TabNavigator");
      } 
      else {
        try {
          await firestore()
            .collection("users")
            .doc(user.uid)
            .set({
              name: name.value,
              username: username.value,
              phone: phoneNumber.value,
              idCard: idCard.value,
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
      source={require("../../assets/items/0d59de270836b6eafe057c8afb642e77.jpg")}
      style={styles.imageBackground}
      blurRadius={8}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>

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
              errorText={name.error ? <Text style={styles.errorText}>{name.error}</Text> : null}

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
              onChangeText={(text) => setPhoneNumber({ value: text, error: "" })}
              value={phoneNumber}
              style={styles.input}
              error={!!phoneNumber.error}
              errorText={phoneNumber.error ? <Text style={styles.errorText}>{phoneNumber.error}</Text> : null}

              

            />
            </View>
            <View style={styles.inputContainer}>
            <TextInput
              label="Password"
              returnKeyType="done"
              value={password.value}
              style={styles.input}
              onChangeText={(text) => setPassword({ value: text, error: "" })}
              error={!!password.error}
              errorText={password.error ? <Text style={styles.errorText}>{password.error}</Text> : null}


              secureTextEntry
            />
            </View>
            <View style={styles.inputContainer}>
            <TextInput
              label="ID Card"
              returnKeyType="done"
              value={idCard.value}
              style={styles.input}
              onChangeText={(text) => setidCard({ value: text, error: "" })}
              error={!!idCard.error}
              errorText={idCard.error ? <Text style={styles.errorText}>{idCard.error}</Text> : null}
              


            />
            </View>
            <Button mode="contained" onPress={onSignUpPressed} style={{ marginTop: 24 }}>
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
          <Text style={styles.footerText}>I already have an account!</Text>
          <TouchableOpacity onPress={() => navigation.replace("LoginScreen", { role: "donor" })}>
            <Text style={styles.link}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>

    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  scrollView:{
    justifyContent:'center',
    flexGrow:1

  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  container: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  input: {
    alignSelf: "center",
    width: "100%",
    marginBottom: 3,
    backgroundColor: "white",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme.colors.sageGreen,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  footerText: {
    fontSize: 13,
    color: theme.colors.ivory,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.sageGreen,
  },
  errorText: {
    fontSize: 13,
    marginTop: -5,
  },
  inputContainer: {
    width:'100%',
    marginBottom:10
   
    
  },
  
});
