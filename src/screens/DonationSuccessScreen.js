"use client"

import React, { useContext, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Animated, StatusBar, SafeAreaView } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from "../core/theme"; 
import CircleLogoStepper3 from "../components/CircleLogoStepper3";
import { AuthContext } from "../context/AuthContext";
import { t } from '../i18n';

const { width, height } = Dimensions.get('window');

export default function DonationSuccessScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const role = user.role;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;
  
  // Floating animations
  const floatingAnim1 = useRef(new Animated.Value(0)).current;
  const floatingAnim2 = useRef(new Animated.Value(0)).current;
  const floatingAnim3 = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in and scale animation for the container
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Checkmark animation
    Animated.timing(checkmarkAnim, {
      toValue: 1,
      duration: 1000,
      delay: 300,
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

  // Calculate scale and opacity for the checkmark
  const checkmarkScale = checkmarkAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1.2, 1],
  });

  const checkmarkOpacity = checkmarkAnim.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0, 0.8, 1],
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
        <View style={styles.stepperContainer}>
          <CircleLogoStepper3 />
        </View>

        <Animated.View 
          style={[
            styles.successContainer, 
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Circular checkmark */}
          <Animated.View 
            style={[
              styles.circleWrapper,
              {
                opacity: checkmarkOpacity,
                transform: [{ scale: checkmarkScale }]
              }
            ]}
          >
            <View style={styles.circle}>
              <MaterialCommunityIcons name="check-circle" size={100} color={theme.colors.sageGreen} />
            </View>
          </Animated.View>

          {/* Success message based on role */}
          <Text style={styles.successMessage}>
            {role === "donor"
              ? t('donation_success.donation_success') 
              : t('donation_success.campaign_success')}
          </Text>

          {/* Continue button */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.replace("TabNavigator", { role })}
          >
            <Text style={styles.buttonText}>{t('donation_success.continue')}</Text>
          </TouchableOpacity>
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
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  stepperContainer: {
    width: '100%',
    marginBottom: 20,
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '90%',
    maxWidth: 350,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  circleWrapper: {
    marginBottom: 20,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: theme.colors.ivory,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.sageGreen,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
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
    shadowColor: theme.colors.sageGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});