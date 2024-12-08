import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, ImageBackground, Dimensions } from "react-native";
import { Text, Button } from "react-native-paper";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { numberValidator } from "../helpers/numberValidator";

const screenWidth = Dimensions.get("window").width;

export default function ResetPasswordScreen({ route, navigation }) {
  const [phone, setPhone] = useState({ value: "", error: "" });

  const sendResetPasswordPhone = () => {
    const { role } = route.params;
    console.log("Resetting password for role:", role);

    const phoneError = numberValidator(phone.value);
    if (phoneError) {
      setPhone({ ...phone, error: phoneError });
      return;
    }
    // Logic to send reset instructions via phone (e.g., SMS or API integration).
    navigation.navigate("StartScreen");
  };

  return (
    <ImageBackground
      source={require("../../assets/items/0d59de270836b6eafe057c8afb642e77.jpg")}
      style={styles.imageBackground}
      blurRadius={8}
    >
      <View style={styles.backButtonWrapper}>
        <BackButton goBack={navigation.goBack} />
      </View>

      <View style={styles.container}>
        <Text style={styles.header}>Reset Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            label="Phone Number"
            mode="outlined"
            style={styles.input}
            value={phone.value}
            onChangeText={(text) => setPhone({ value: text, error: "" })}
            error={!!phone.error}
            errorText={phone.error ? <Text style={styles.errorText}>{phone.error}</Text> : null}
            keyboardType="phone-pad"
            description="You will receive a reset link or code via SMS."
          />
        </View>

        <Button mode="contained" onPress={sendResetPasswordPhone} style={styles.button}>
          Send Reset Code
        </Button>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={styles.link}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  container: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: theme.colors.sageGreen,
    textShadowColor: theme.colors.background,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  input: {
    alignSelf: "center",
    width: "100%",
    marginBottom: 3,
    backgroundColor: "white",
  },
  inputContainer: {
    width: '90%',
    marginBottom: 10,
  },
  button: {
    width: '90%',
    paddingVertical: 8,
    borderRadius: 25,
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    fontSize: 15,
    fontWeight: "bold",
    color: theme.colors.sageGreen,
    marginLeft: 5,
  },
  backButtonWrapper: {
    position: "absolute",
    top: 10,
    left: 30,
    padding: 10,
  },
  errorText: {
    fontSize: 13,
    marginTop: -5,
  },
  inputContainer: {
    width: "90%",
    marginBottom: 10,
  },
});
