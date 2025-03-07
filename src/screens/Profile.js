import React, { useContext, useEffect } from "react";
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../core/theme';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from "../context/AuthContext";
import { UserProfileContext } from "../context/UserProfileContext"


const Profile = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const {role}=route.params;
  const { userProfile } = useContext(UserProfileContext)
  

  const imageScale = new Animated.Value(0.8);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  const handleLogout = () => {
    navigation.navigate("StartScreen");
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>My Profile</Text>

      <Animated.View style={[styles.profileContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.patternOverlay} />
        <Animated.View style={[styles.profileImageContainer, { transform: [{ scale: imageScale }] }]}>
          <Image
            source={{ uri: 'https://via.placeholder.com/120' }}
            style={styles.profileImage}
          />
        </Animated.View>

        <Text style={styles.username}>{user.name}</Text>

        <View style={styles.khairPointsContainer}>
          <MaterialCommunityIcons name="star" size={24} color={theme.colors.sageGreen} />
          <Text style={styles.khairPoints}>{userProfile.khairPoints} Khair Points</Text>

        </View>

        <View style={styles.infoContainer}>
          <InfoItem icon="phone" text={user.phone} />
          <InfoItem icon="account" text={user.username} />
          {role === "donor" ? (
          <InfoItem icon="clipboard-check" text="Total Donations: 3" />
          ):(
            <InfoItem icon="clipboard-check" text="Total Claims: 3" /> 
          )}
        </View>
      </Animated.View>

      <View style={styles.buttonsContainer}>
      {role === "donor" ? (
          <AnimatedButton
            icon="gift"
            text="My Donations"
            onPress={() => navigation.navigate("ClaimsHistory")}
          />
        ) : (
          <AnimatedButton
            icon="history"
            text="My Claims"
            onPress={() => navigation.navigate("ClaimsHistory")}
          />
        )}
        <AnimatedButton
          icon="logout"
          text="Logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={styles.logoutText}
        />
      </View>
    </ScrollView>
  );
};

const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <MaterialCommunityIcons name={icon} size={20} color={theme.colors.sageGreen} style={styles.infoIcon} />
    <Text style={styles.info}>{text}</Text>
  </View>
);

const AnimatedButton = ({ icon, text, onPress, style, textStyle }) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={[styles.button, style, { transform: [{ scale: scaleAnim }] }]}>
        <MaterialCommunityIcons name={icon} size={24} color={theme.colors.ivory} style={styles.buttonIcon} />
        <Text style={[styles.buttonText, textStyle]}>{text}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.ivory,
    marginVertical: 20,
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
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 30,
    overflow: 'hidden',
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    backgroundColor: theme.colors.ivory,
    backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 10px 10px',
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: theme.colors.sageGreen,
    marginBottom: 20,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.ivory,
    marginBottom: 8,
  },
  khairPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  khairPoints: {
    fontSize: 18,
    color: theme.colors.sageGreen,
    marginLeft: 5,
  },
  infoContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 10,
  },
  info: {
    fontSize: 16,
    color: theme.colors.ivory,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
    gap:5
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.sageGreen,
    padding: 15,
    marginHorizontal:5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.charcoalBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  
  },
  buttonIcon: {
    marginRight: 8,
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

