"use client"

import React, { useContext, useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { theme } from "../core/theme"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { AuthContext } from "../context/AuthContext"
import { UserProfileContext } from "../context/UserProfileContext"
import { t } from "../i18n"

const SCREEN_WIDTH = Dimensions.get("window").width

const Profile = ({ route }) => {
  const navigation = useNavigation()
  const { user } = useContext(AuthContext)
  const { role } = route.params || {}
  const { userProfile } = useContext(UserProfileContext)

  const isUrdu = t("food.donations_title") !== "Food Donations"

  const [isReady, setIsReady] = useState(false)

  const imageScale = new Animated.Value(0.8)
  const fadeAnim = new Animated.Value(0)
  const slideAnim = new Animated.Value(50)

  useFocusEffect(
    React.useCallback(() => {
      setIsReady(false)
      setTimeout(() => setIsReady(true), 50)
      return () => {}
    }, [userProfile, role]),
  )

  useEffect(() => {
    if (isReady) {
      Animated.parallel([
        Animated.timing(imageScale, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.poly(4)),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isReady])

  useEffect(() => {
    setIsReady(true)
  }, [])

  const handleLogout = () => {
    navigation.navigate("StartScreen")
  }

  if ((!isReady || !userProfile) && user.role !== "donor" && user.role !== "rider") {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={styles.loadingText}>{t("profile.loading")}</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>{t("profile.myProfile")}</Text>

      <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Animated.View style={[styles.imageWrapper, { transform: [{ scale: imageScale }] }]}>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            style={styles.profileImage}
          />
        </Animated.View>

        <Text style={[styles.nameText, isUrdu && styles.urduFont]}>{user?.name || t("profile.user")}</Text>

        {role === "recipient" && (
          <View style={styles.pointsRow}>
            <MaterialCommunityIcons name="star" size={24} color={theme.colors.sageGreen} />
            <Text style={styles.pointsText}>{userProfile?.khairPoints || 0} {t("profile.khairPoints")}</Text>
          </View>
        )}

        <View style={styles.infoBlock}>
          <InfoItem icon="phone" text={user?.phone || t("profile.noPhone")} isUrdu={isUrdu} />
          <InfoItem icon="account" text={user?.username || t("profile.noUsername")} isUrdu={isUrdu} />
          <InfoItem
            icon="clipboard-check"
            text={`${role === "donor" ? t("profile.totalDonations") : t("profile.totalClaims")}: 3`}
            isUrdu={isUrdu}
          />
        </View>
      </Animated.View>

      <View style={styles.actions}>
        {role === "donor" && (
          <AnimatedButton icon="gift" text={t("profile.myDonations")} onPress={() => navigation.navigate("DonationsHistory")} isUrdu={isUrdu} />
        )}
        {role === "recipient" && (
          <AnimatedButton icon="history" text={t("profile.myClaims")} onPress={() => navigation.navigate("ClaimsHistory")} isUrdu={isUrdu} />
        )}
        {role === "rider" && (
          <AnimatedButton icon="truck-delivery" text={t("profile.myDeliveries")} onPress={() => navigation.navigate("DeliveryHistory")} isUrdu={isUrdu} />
        )}
        <AnimatedButton
          icon="logout"
          text={t("profile.logout")}
          onPress={handleLogout}
          isUrdu={isUrdu}
          style={styles.logoutButton}
          textStyle={{ color: theme.colors.sageGreen }}
        />
      </View>
    </ScrollView>
  )
}

const InfoItem = ({ icon, text, isUrdu }) => (
  <View style={styles.infoItem}>
    <MaterialCommunityIcons name={icon} size={20} color={theme.colors.sageGreen} style={styles.infoIcon} />
    <Text style={[styles.infoText, isUrdu && styles.urduFont]}>{text}</Text>
  </View>
)

const AnimatedButton = ({ icon, text, onPress, style, textStyle, isUrdu }) => {
  const scale = new Animated.Value(1)

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
    >
      <Animated.View style={[styles.button, style, { transform: [{ scale }] }]}>
        <MaterialCommunityIcons name={icon} size={22} color={theme.colors.ivory} style={styles.buttonIcon} />
        <Text style={[styles.buttonText, isUrdu && styles.urduFont, textStyle]}>{text}</Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
    color: theme.colors.ivory,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.ivory,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: theme.colors.outerSpace,
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 20,
  },
  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: theme.colors.sageGreen,
    marginBottom: 16,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.ivory,
    marginBottom: 8,
  },
  urduFont: {
    fontSize: 22,
    fontFamily: "System",
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  pointsText: {
    fontSize: 18,
    color: theme.colors.sageGreen,
    marginLeft: 6,
  },
  infoBlock: {
    width: "100%",
    marginTop: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: theme.colors.ivory,
  },
  actions: {
    width: "100%",
    gap: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.sageGreen,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
    marginVertical: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.ivory,
  },
  logoutButton: {
    backgroundColor: theme.colors.outerSpace,
    marginTop: 10,
  },
})

export default Profile