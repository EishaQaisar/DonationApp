"use client"

import { useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Animated,
  Platform,
  Easing,
} from "react-native"
import Button from "../components/Button"
import { theme } from "../core/theme"
import LanguageSwitcher from "../components/LanguageSwitcher"
import { t } from "../i18n"

const { width, height } = Dimensions.get("window")

export default function StartScreen({ navigation }) {
  // Animation values
  const fadeAnim1 = useRef(new Animated.Value(0)).current
  const fadeAnim2 = useRef(new Animated.Value(0)).current
  const fadeAnim3 = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current

  // New animations
  const floatingAnim1 = useRef(new Animated.Value(0)).current
  const floatingAnim2 = useRef(new Animated.Value(0)).current
  const floatingAnim3 = useRef(new Animated.Value(0)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()

    // Parallel animations
    Animated.parallel([
      Animated.timing(fadeAnim3, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()

    // Continuous floating animations - Fixed easing
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim1, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim1, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim2, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim2, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim3, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim3, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Continuous rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      }),
    ).start()

    // Pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  // Calculate rotation for the rotating background element
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Language Switcher */}
      <View style={styles.languageSwitcherContainer}>
        <LanguageSwitcher />
      </View>

      {/* Enhanced Decorative Elements */}
      <View style={styles.decorativeElements}>
        {/* Original elements */}
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
        <View style={[styles.rectangle, styles.rectangle1]} />
        <View style={[styles.rectangle, styles.rectangle2]} />
        <View style={styles.diagonalLine} />

        {/* New animated elements */}
        <Animated.View
          style={[
            styles.floatingCircle,
            styles.floatingCircle1,
            {
              transform: [
                {
                  translateY: floatingAnim1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingCircle,
            styles.floatingCircle2,
            {
              transform: [
                {
                  translateY: floatingAnim2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -15],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingCircle,
            styles.floatingCircle3,
            {
              transform: [
                {
                  translateY: floatingAnim3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -25],
                  }),
                },
              ],
            },
          ]}
        />

        {/* Rotating background element */}
        <Animated.View
          style={[
            styles.rotatingElement,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        />

        {/* Pattern elements */}
        <View style={styles.patternContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <View key={`dot-row-${index}`} style={styles.patternRow}>
              {Array.from({ length: 5 }).map((_, dotIndex) => (
                <View
                  key={`dot-${index}-${dotIndex}`}
                  style={[
                    styles.patternDot,
                    {
                      opacity: 0.1 + (Math.abs(2 - index) + Math.abs(2 - dotIndex)) * 0.02,
                      backgroundColor: (index + dotIndex) % 2 === 0 ? theme.colors.primary : theme.colors.copper,
                    },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>

        {/* Gradient overlay */}
        <View style={styles.gradientOverlay} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* App Branding */}
        <Animated.View style={[styles.brandingContainer, { opacity: fadeAnim1 }]}>
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.logoShape1} />
            <View style={styles.logoShape2} />
            <View style={styles.logoShape3} />

            {/* New logo elements */}
            <View style={styles.logoRing} />
            <View style={styles.logoInnerRing} />
          </Animated.View>

          <Text style={styles.appName}>{t("startScreen.appName") || "Daily Havit"}</Text>
          <Text style={styles.tagline}>{t("startScreen.catchline") || "Make a difference every day"}</Text>
        </Animated.View>

        {/* Features */}
        <Animated.View
          style={[
            styles.featuresContainer,
            {
              opacity: fadeAnim2,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Visual feature indicators */}
          <View style={styles.visualFeatureContainer}>
            {Array.from({ length: 3 }).map((_, index) => (
              <View key={`feature-${index}`} style={styles.visualFeatureItem}>
                <View
                  style={[
                    styles.visualFeatureIcon,
                    {
                      backgroundColor:
                        index === 0
                          ? theme.colors.primary
                          : index === 1
                            ? theme.colors.copper
                            : theme.colors.outerSpace,
                    },
                  ]}
                />
                <View style={styles.visualFeatureLine} />
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Button Container */}
        <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim3 }]}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("ChooseRole")}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            {t("startScreen.getStarted") || "Get Started"}
          </Button>

          <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginButton}>
            <Text style={styles.loginText}>{t("startScreen.alreadyHaveAccount") || "Already have an account?"}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  languageSwitcherContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    right: 20,
    zIndex: 10,
  },
  decorativeElements: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
  },
  circle1: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: theme.colors.outerSpace,
    top: -width * 0.2,
    right: -width * 0.1,
    opacity: 0.7,
  },
  circle2: {
    width: width * 0.25,
    height: width * 0.25,
    backgroundColor: theme.colors.copper,
    bottom: height * 0.15,
    left: -width * 0.1,
    opacity: 0.5,
  },
  circle3: {
    width: width * 0.15,
    height: width * 0.15,
    backgroundColor: theme.colors.primary,
    top: height * 0.45,
    right: -width * 0.05,
    opacity: 0.3,
  },
  rectangle: {
    position: "absolute",
    borderRadius: 12,
  },
  rectangle1: {
    width: width * 0.3,
    height: width * 0.1,
    backgroundColor: theme.colors.copper,
    transform: [{ rotate: "45deg" }],
    top: height * 0.2,
    left: -width * 0.1,
    opacity: 0.3,
  },
  rectangle2: {
    width: width * 0.2,
    height: width * 0.05,
    backgroundColor: theme.colors.primary,
    transform: [{ rotate: "-30deg" }],
    bottom: height * 0.3,
    right: width * 0.1,
    opacity: 0.4,
  },
  diagonalLine: {
    position: "absolute",
    width: width * 1.5,
    height: 2,
    backgroundColor: theme.colors.outerSpace,
    transform: [{ rotate: "45deg" }],
    top: height * 0.35,
    left: -width * 0.25,
    opacity: 0.1,
  },
  // New decorative elements
  floatingCircle: {
    position: "absolute",
    borderRadius: 999,
  },
  floatingCircle1: {
    width: width * 0.08,
    height: width * 0.08,
    backgroundColor: theme.colors.primary,
    top: height * 0.3,
    left: width * 0.2,
    opacity: 0.4,
  },
  floatingCircle2: {
    width: width * 0.05,
    height: width * 0.05,
    backgroundColor: theme.colors.copper,
    top: height * 0.5,
    left: width * 0.7,
    opacity: 0.5,
  },
  floatingCircle3: {
    width: width * 0.06,
    height: width * 0.06,
    backgroundColor: theme.colors.outerSpace,
    top: height * 0.15,
    left: width * 0.6,
    opacity: 0.3,
  },
  rotatingElement: {
    position: "absolute",
    width: width * 1.5,
    height: width * 1.5,
    borderWidth: 1,
    borderColor: theme.colors.outerSpace,
    borderRadius: width * 0.75,
    top: height * 0.5 - width * 0.75,
    left: width * 0.5 - width * 0.75,
    opacity: 0.05,
  },
  patternContainer: {
    position: "absolute",
    top: height * 0.6,
    right: 0,
    width: width * 0.4,
    height: width * 0.4,
    opacity: 0.2,
  },
  patternRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  patternDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 5,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
    backgroundColor: "#FFFFFF",
    opacity: 0.7,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  brandingContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  logoShape1: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    position: "absolute",
  },
  logoShape2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.copper,
    position: "absolute",
    top: 10,
    left: 30,
  },
  logoShape3: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.outerSpace,
    position: "absolute",
    top: 30,
    left: 20,
  },
  // New logo elements
  logoRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    position: "absolute",
    opacity: 0.5,
  },
  logoInnerRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: theme.colors.copper,
    position: "absolute",
    opacity: 0.7,
  },
  appName: {
    color: theme.colors.primary,
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  tagline: {
    color: theme.colors.ivory,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  featuresContainer: {
    marginVertical: 30,
  },
  // Visual feature indicators
  visualFeatureContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  visualFeatureItem: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  visualFeatureIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  visualFeatureLine: {
    width: 30,
    height: 3,
    backgroundColor: theme.colors.outerSpace,
    borderRadius: 1.5,
    opacity: 0.2,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    marginBottom: 16,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.pearlWhite,
  },
  loginButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  loginText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
})

