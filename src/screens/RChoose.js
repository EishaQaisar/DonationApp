import React from "react";
import Background from "../components/Background";
import Header from "../components/Header";
import ImageButton from "../components/ImageButton";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import { StyleSheet, View, Text } from "react-native";
import { theme } from "../core/theme";

export default function RChoose({ navigation }) {
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />

      <View style={styles.container}>
        {/* Header text */}
        <Text style={styles.header}>Are you an NGO or an Individual?</Text>

        {/* Button container placed under the header in a vertical layout */}
        <View style={styles.buttonContainer}>
        <ImageButton
            onPress={() => navigation.navigate("RegisterNGOScreen")}
            source={require("../../assets/items/istockphoto-1498170916-612x612.jpg")}
            imageStyle={styles.image}
            text="NGO"
          />

        <ImageButton
            onPress={() => navigation.navigate("RegisterIndividualScreen")}
            source={require("../../assets/items/20445e4432dc89c01c75b932749732a9.jpg")} 
            imageStyle={styles.image}
            text="Individual"
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
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 5, // Shadow blur radius
    elevation: 5, // Elevation for Android devices (shadow effect)
  },
  header: {
    color:theme.colors.ivory,
    fontSize: 30,
    fontWeight: 'bold',
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
