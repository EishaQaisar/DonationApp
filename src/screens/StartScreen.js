import React from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import Button from "../components/Button";
import { theme } from "../core/theme";

export default function StartScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../../assets/items/0d59de270836b6eafe057c8afb642e77.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Header at the top left */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Dast-e-khair</Text>
          <Text style={styles.catchlineText}>Helping Communities,{'\n'}One Donation at a time</Text>
        </View>

        {/* Button container at the bottom */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("ChooseRole")}
            style={styles.button}
          >
            Get Started
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
    height: '120%',
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
  catchlineText: {
    color: theme.colors.ivory,
    fontSize: 20,  // Slightly smaller than the main text
    textAlign: 'left', 
    fontWeight: 'bold',  
    marginTop: 10,  // Add some spacing under the header
    padding: 5,
  },
  header: {
    position: 'absolute',  // Make the header stick to the top
    top: 30,  // Adjust top position as needed
    left: 20,  // Adjust left position as needed
    padding: 5,
    borderRadius: 5,
  },
  headerText: {
    color: theme.colors.ivory,
    fontSize: 40,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',  // Make the container absolute to position it at the bottom
    bottom: 30,  // Adjusts how far from the bottom the button is
    width: '80%',  // Button container takes up 80% of the screen width
    alignItems: 'center',  // Centers buttons horizontally
    paddingBottom: 30,  // Padding at the bottom
  },
  button: {
    width: '100%',  // Button width as a percentage of the container width
    marginBottom: 10,  // Spacing between buttons
  },
});
