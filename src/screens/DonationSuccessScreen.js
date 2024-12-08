
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from "../core/theme";  // Assuming you have a theme defined as before
import CircleLogoStepper3 from "../components/CircleLogoStepper3";

const screenWidth = Dimensions.get('window').width;

export default function DonationSuccessScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../../assets/items/0d59de270836b6eafe057c8afb642e77.jpg')} // Replace with your image path
      style={styles.imageBackground}
      blurRadius={8} // Adjust the blur intensity

    >
        <View style={{marginTop:0}}>
        <CircleLogoStepper3></CircleLogoStepper3>

        </View>
        
      <View style={styles.container}>
        {/* Circular checkmark */}
        <View style={styles.circle}>
          <MaterialCommunityIcons name="check-circle" size={100} color={theme.colors.sageGreen} />
        </View>

        {/* Success message */}
        <Text style={styles.successMessage}>
          You have uploaded the Campaign successfully!
        </Text>

        {/* Continue button */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace("TabNavigator",{role:"Recipient"})}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)', // Semi-transparent white background for clarity
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '90%', // Responsive width
    maxWidth: 350, // Max width to ensure readability
    marginTop:60
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: theme.colors.ivory,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: theme.colors.sageGreen,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  successMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.TaupeBlack,
    marginBottom: 30,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  button: {
    width: '80%',
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: theme.colors.sageGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});