import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { theme } from '../core/theme'; // Importing custom theme
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from "../context/AuthContext";



const Profile = () => {
  const navigation = useNavigation();

  // Animating the profile image on mount
  const imageScale = new Animated.Value(0.8);
  const { user} = useContext(AuthContext); // Access user and logout from AuthContext

  const handleLogout = () => {
    navigation.navigate("StartScreen");
    
  };

  React.useEffect(() => {
    Animated.timing(imageScale, {
      toValue: 1,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Heading - No box background */}
      <Text style={styles.headerTitle}>Recipient Profile</Text>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Animated.View
          style={[styles.profileImageContainer, { transform: [{ scale: imageScale }] }]}
        >
          <Image
            source={{ uri: 'https://via.placeholder.com/120' }} // Placeholder image for profile picture
            style={styles.profileImage}
          />
        </Animated.View>

        <Text style={styles.username}>John Doe</Text>
        <Text style={styles.khairPoints}>
          <Text style={styles.star}>★</Text> 100 Khair Points
        </Text>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>Phone: 123-456-7890</Text>
          <Text style={styles.info}>Email: user@example.com</Text>
          <Text style={styles.info}>Total Claims: 5</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ClaimsHistory')}
        >
          <Text style={styles.buttonText}>My Claims</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  // Removed box background for header
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.ivory,
    marginBottom: 20,
    textAlign: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.TaupeBlack,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '100%',
    shadowColor: theme.colors.charcoalBlack,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 30,
  },
  profileImageContainer: {
    marginBottom: 20,
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: theme.colors.sageGreen,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.ivory,
    marginBottom: 8,
  },
  khairPoints: {
    fontSize: 18,
    color: theme.colors.sageGreen,
    marginBottom: 15,
  },
  star: {
    fontSize: 22,
    color: theme.colors.sageGreen,
  },
  infoContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    color: theme.colors.ivory,
    marginBottom: 6,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: theme.colors.sageGreen,
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: theme.colors.charcoalBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  logoutButton: {
    backgroundColor: theme.colors.outerSpace,
  },
  buttonText: {
    fontSize: 18,
    color: theme.colors.ivory,
    fontWeight: '600',
  },
  logoutText: {
    color: theme.colors.sageGreen,
  },
});

export default Profile;