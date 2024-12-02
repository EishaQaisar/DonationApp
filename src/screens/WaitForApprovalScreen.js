import React from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import { theme } from "../core/theme";

export default function WaitForApprovalScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../../assets/items/0d59de270836b6eafe057c8afb642e77.jpg')}
      style={styles.background}
      resizeMode="cover"
      blurRadius={2} 
    >
      <View style={styles.container}>
        {/* Header at the top left */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Dast-e-khair</Text>
          <Text style={styles.WText}>We got your Information,Please wait while{'\n'}Our representatives varify it.</Text>
          <Text style={styles.W1Text}>Your Credentials will be sent to you through the email you entered.</Text>
        </View>

        {/* Button container at the bottom */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("StartScreen")}
            style={styles.button}
          >
            Home
          </Button>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,  // Full height of the screen
    justifyContent: 'space-between', // Distributes space between header, text, and button container
    alignItems: 'center',  // Centers items horizontally
    width: '100%',
    paddingBottom: 10,  // Extra padding for the bottom
  },
  WText: {
    color: theme.colors.ivory,
    fontSize: 18,  // Slightly smaller than the main text
    textAlign: 'center', 
    fontWeight: 'bold',  
    marginTop: 190,  // Add some spacing under the header
    padding: 5,
  },
  W1Text: {
    color: 'white',
    fontSize: 15,  // Slightly smaller than the main text
    textAlign: 'center', 
    fontWeight: 'bold',  
    marginTop: 4,  // Add some spacing under the header
    padding: 5,
    Right: 20,
  },
  header: {
    position: 'absolute',  // Make the header stick to the top
    top: 30,  // Adjust top position as needed
    padding: 5,
    borderRadius: 5,
  },
  headerText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    Right:20,
  },
  buttonContainer: {
    position: 'absolute',  // Make the container absolute to position it at the bottom
    bottom: 20,  // Adjusts how far from the bottom the button is
    width: '60%',  // Button container takes up 80% of the screen width
    alignItems: 'center',  // Centers buttons horizontally
    paddingBottom: 30,  // Padding at the bottom
  },
  button: {
    width: '90%',  // Button width as a percentage of the container width
    marginBottom: 10,  // Spacing between buttons
  },
});
