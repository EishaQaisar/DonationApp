"use client"

import React, { useContext, useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Animated, Easing } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { theme } from "../core/theme"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { AuthContext } from "../context/AuthContext"
import { UserProfileContext } from "../context/UserProfileContext"
import { t } from "../i18n" // Import the translation function

const Profile = ({ route }) => {
  const navigation = useNavigation()
  const { user } = useContext(AuthContext)
  const { role } = route.params || {}
  const { userProfile, setUserProfile } = useContext(UserProfileContext)

  // Detect language by comparing a known translation
  const isUrdu = t("food.donations_title") !== "Food Donations"

  // Dynamic styles based on language
  const dynamicStyles = {
    headerTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.colors.ivory,
      marginVertical: 20,
      textAlign: "center",
    },
    username: {
      fontSize: isUrdu ? 26 : 24,
      fontWeight: "700",
      color: theme.colors.pearlWhite,
      marginBottom: 8,
    },
    khairPoints: {
      fontSize: isUrdu ? 20 : 18,
      color: theme.colors.copper,
      marginLeft: 5,
    },
    info: {
      fontSize: isUrdu ? 18 : 16,
      color: theme.colors.ivory,
    },
    buttonText: {
      fontSize: isUrdu ? 20 : 18,
      color: theme.colors.ivory,
      fontWeight: "600",
    },
    logoutText: {
      color: theme.colors.sageGreen,
    }
  }

  const [isReady, setIsReady] = useState(false)

  const imageScale = new Animated.Value(0.8)
  const fadeAnim = new Animated.Value(0)
  const slideAnim = new Animated.Value(50)

  // Use useFocusEffect to refresh the component when it comes into focus
  useFocusEffect(
    React.useCallback(() => {

      // Force a re-render when the screen comes into focus
      setIsReady(false)
      setTimeout(() => setIsReady(true), 50)

      return () => {
        // Cleanup when screen loses focus
      }
    }, [userProfile, role]),
  )

  const handleLogout = () => {
    navigation.navigate("StartScreen")
  }

  useEffect(() => {
    // Start animations when component mounts or when isReady changes
    if (isReady) {
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
      ]).start()
    }
  }, [isReady])

  // Set isReady to true after initial mount
  useEffect(() => {
    setIsReady(true)
  }, [])
  if ((!isReady || !userProfile) && user.role!='donor' && user.role!='rider') {
    // Show a loading state or placeholder while waiting for data
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={dynamicStyles.headerTitle}>{t("profile.loading")}</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={dynamicStyles.headerTitle}>{t("profile.myProfile")}</Text>

      <Animated.View style={[styles.profileContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.patternOverlay} />
        <Animated.View style={[styles.profileImageContainer, { transform: [{ scale: imageScale }] }]}>
          <Image source={{ uri: "https://via.placeholder.com/120" }} style={styles.profileImage} />
        </Animated.View>

        <Text style={dynamicStyles.username}>{user?.name || t("profile.user")}</Text>

        {role === "recipient" && (
          <View style={styles.khairPointsContainer}>
            <MaterialCommunityIcons name="star" size={24} color={theme.colors.copper} />
            <Text style={dynamicStyles.khairPoints}>{userProfile?.khairPoints || 0} {t("profile.khairPoints")}</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <InfoItem icon="phone" text={user?.phone || t("profile.noPhone")} isUrdu={isUrdu} />
          <InfoItem icon="account" text={user?.username || t("profile.noUsername")} isUrdu={isUrdu} />
          {role === "donor" ? (
            <InfoItem icon="clipboard-check" text={`${t("profile.totalDonations")}: 3`} isUrdu={isUrdu} />
          ) : (
            <InfoItem icon="clipboard-check" text={`${t("profile.totalClaims")}: 3`} isUrdu={isUrdu} />
          )}
        </View>
      </Animated.View>

      <View style={styles.buttonsContainer}>
      {role === "donor" ? (
        <AnimatedButton
          icon="gift"
          text={t("profile.myDonations")}
          onPress={() => navigation.navigate("DonationsHistory")}
          isUrdu={isUrdu}
        />
      ) : role === "recipient" ? (
        <AnimatedButton
          icon="history"
          text={t("profile.myClaims")}
          onPress={() => navigation.navigate("ClaimsHistory")}
          isUrdu={isUrdu}
        />
      ) : role === "rider" ? (
        <AnimatedButton
          icon="truck-delivery"
          text={t("profile.myDeliveries")}
          onPress={() => navigation.navigate("DeliveryHistory")}
          isUrdu={isUrdu}
        />
      ) : null}
        <AnimatedButton
          icon="logout"
          text={t("profile.logout")}
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={styles.logoutText}
          isUrdu={isUrdu}
        />
      </View>
    </ScrollView>
  )
}

const InfoItem = ({ icon, text, isUrdu }) => {
  const dynamicStyles = {
    info: {
      fontSize: isUrdu ? 18 : 16,
      color: theme.colors.pearlWhite,
    }
  }
  
  return (
    <View style={styles.infoItem}>
      <MaterialCommunityIcons name={icon} size={20} color={theme.colors.sageGreen} style={styles.infoIcon} />
      <Text style={dynamicStyles.info}>{text}</Text>
    </View>
  )
}

const AnimatedButton = ({ icon, text, onPress, style, textStyle, isUrdu }) => {
  const scaleAnim = new Animated.Value(1)
  
  const dynamicStyles = {
    buttonText: {
      fontSize: isUrdu ? 20 : 18,
      color: theme.colors.pearlWhite,
      fontWeight: "600",
      ...(textStyle || {})
    }
  }

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  return (
    <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1}>
      <Animated.View style={[styles.button, style, { transform: [{ scale: scaleAnim }] }]}>
        <MaterialCommunityIcons name={icon} size={24} color={theme.colors.ivory} style={styles.buttonIcon} />
        <Text style={dynamicStyles.buttonText}>{text}</Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  // headerTitle moved to dynamicStyles
  profileContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.TaupeBlack,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: "100%",
    shadowColor: theme.colors.charcoalBlack,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 30,
    overflow: "hidden",
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    backgroundColor: theme.colors.ivory,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: theme.colors.sageGreen,
    marginBottom: 20,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  // username moved to dynamicStyles
  khairPointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "transparent", // Ensure this is transparent
  },
  // khairPoints moved to dynamicStyles
  infoContainer: {
    alignItems: "flex-start",
    width: "100%",
    marginTop: 10,
    backgroundColor: "transparent", // Ensure this is transparent
    color:theme.colors.pearlWhite
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "transparent", // Ensure this is transparent
  },
  infoIcon: {
    marginRight: 10,
  },
  // info moved to dynamicStyles
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
    gap: 5,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: theme.colors.sageGreen,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: theme.colors.sageGreen,
  },
  // buttonText moved to dynamicStyles
  // logoutText moved to dynamicStyles
})

export default Profile