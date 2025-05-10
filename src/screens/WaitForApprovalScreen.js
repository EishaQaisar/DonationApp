"use client"

import React, { useEffect, useRef } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions, 
  Animated,
  StatusBar
} from "react-native";
import Button from "../components/Button";
import { theme } from "../core/theme";
import { t } from "../i18n";

const { width, height } = Dimensions.get("window");

export default function WaitForApprovalScreen({ navigation }) {
  // Animation values
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Floating animations
  const floatingAnim1 = useRef(new Animated.Value(0)).current;
  const floatingAnim2 = useRef(new Animated.Value(0)).current;
  const floatingAnim3 = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

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
    ]).start();

    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Continuous floating animations
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
    ).start();

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
    ).start();

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
    ).start();

    // Continuous rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  // Calculate rotation for the rotating background element
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Decorative Elements */}
      <View style={styles.decorativeElements}>
        {/* Static elements */}
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
        <View style={[styles.rectangle, styles.rectangle1]} />
        <View style={[styles.rectangle, styles.rectangle2]} />
        <View style={styles.diagonalLine} />

        {/* Animated elements */}
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
        {/* Header */}
        <Animated.View style={[styles.headerContainer, { opacity: fadeAnim1 }]}>
          <Text style={styles.headerText}>{t("startScreen.appName")||"Dast-e-khair"}</Text>
        </Animated.View>

        {/* Message */}
        <Animated.View 
          style={[
            styles.messageContainer, 
            { 
              opacity: fadeAnim2,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              {t("waitForApproval.message") || "We got your information, please wait while our representatives verify it."}
            </Text>
            
            {/* Visual indicator */}
            <View style={styles.indicatorContainer}>
              <View style={styles.indicator} />
              <View style={[styles.indicator, styles.indicatorActive]} />
              <View style={styles.indicator} />
            </View>
          </View>
        </Animated.View>

        {/* Button */}
        <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim2 }]}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("StartScreen")}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            {t("waitForApproval.homeButton") || "Home"}
          </Button>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  headerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  headerText: {
    color: theme.colors.primary,
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageBox: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  messageText: {
    fontSize: 18,
    color: theme.colors.sageGreen,
    textAlign: "center",
    lineHeight: 28,
    fontWeight: "500",
  },
  indicatorContainer: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "center",
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D0D0D0",
    marginHorizontal: 5,
  },
  indicatorActive: {
    backgroundColor: theme.colors.primary,
    width: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    width: "80%",
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
});