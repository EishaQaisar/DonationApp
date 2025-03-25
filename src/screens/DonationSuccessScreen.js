import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from "../core/theme"; 
import CircleLogoStepper3 from "../components/CircleLogoStepper3";
import { AuthContext } from "../context/AuthContext";
import { t } from '../i18n'

const screenWidth = Dimensions.get('window').width;

export default function DonationSuccessScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const role = user.role;

  return (
    <ImageBackground
      source={require('../../assets/items/0d59de270836b6eafe057c8afb642e77.jpg')}
      style={styles.imageBackground}
      blurRadius={8} 
    >
      <View style={{ marginTop: 0 }}>
        <CircleLogoStepper3 />
      </View>

      <View style={styles.container}>
        {/* Circular checkmark */}
        <View style={styles.circle}>
          <MaterialCommunityIcons name="check-circle" size={100} color={theme.colors.sageGreen} />
        </View>

        {/* Success message based on role */}
        <Text style={styles.successMessage}>
          {role === "donor"
            ? t('donation_success.donation_success') 
            : t('donation_success.campaign_success')}
        </Text>

        {/* Continue button */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace("TabNavigator", { role })}>
          <Text style={styles.buttonText}>{t('donation_success.continue')}</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '90%',
    maxWidth: 350,
    marginTop: 60,
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

