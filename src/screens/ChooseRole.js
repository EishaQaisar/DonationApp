import React from "react";
import Background from "../components/Background";
import Header from "../components/Header";
import ImageButton from "../components/ImageButton";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import { StyleSheet, View, Text } from "react-native";

import { theme } from "../core/theme";

export default function ChooseRole({ navigation }) {
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />

      <View style={styles.container}>
        {/* Header text */}
        <Text style={styles.header}>Start by telling us who you are</Text>

        {/* Button container placed under the header in a vertical layout */}
        <View style={styles.buttonContainer}>
        <ImageButton
            onPress={() => navigation.navigate("LoginScreen",{ role: "recipient" })}
            source={require("../../assets/items/desktop-wallpaper-child-african-bl-african-kids.jpg")}
            imageStyle={styles.image}
            text="Recipient"
            
          />

        <ImageButton
            onPress={() => navigation.navigate("LoginScreen",{ role: "donor" })}
            source={require("../../assets/items/illustration-about-helping-poor-needy-with-concept-giving-charity_882884-955.jpg")} // Replace with your image path
            imageStyle={styles.image}
            text="Donor"
          />  
        <ImageButton
            onPress={() => navigation.navigate("LoginScreen",{role:"rider"})}
            source={require("../../assets/items/testinglogo.jpg")} 
            imageStyle={styles.image}
            text="Rider"
          />


         
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    justifyContent: 'center',  
    alignItems: 'center',  
    paddingBottom: 10,
  },
  image: {
    width: 130, // Size of the image
    height: 120, // Size of the image
    borderRadius: 30, // Make the image circular
    marginBottom: 10, // Space between image and text
    borderWidth: 2, // Border around the image
    borderColor: theme.colors.sageGreen, // Border color (white for contrast)
    shadowColor: theme.colors.ivory, // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 5, // Shadow blur radius
    elevation: 5, // Elevation for Android devices (shadow effect)
  },
  text: {
    color: 'white', // Use white text color
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: theme.colors.ivory,
    textAlign: 'center',
    marginBottom: 30, // Adds space between the header and button container
  },
  buttonContainer: {
    flexDirection: "column",  // Stack buttons vertically
    alignItems: "center",
    width: '80%',  // Adjust width as needed
  },
  circularButton: {
    width: 140,
    height: 110,
    borderRadius: 45,  // Circular shape
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,  // Spacing between buttons
  },
});
