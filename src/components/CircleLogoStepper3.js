"use client"

import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../core/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from "../context/AuthContext";
import { t } from "../i18n";

const CircleLogoStepper3 = () => {
  const { isRTL, language } = useContext(AuthContext);
  const isUrdu = language === "ur";

  // Create the steps with translations
  const steps = [
    {
      icon: <MaterialCommunityIcons name="cursor-default-click-outline" size={30} color="black" />,
      text: t("circleLogoStepper.selectCategory", "Select Category"),
      active: true,
    },
    {
      icon: <MaterialIcons name="add" size={30} color="black" />,
      text: t("circleLogoStepper.addDetails", "Add Details"),
      active: true,
    },
    {
      icon: <Ionicons name="checkmark-done" size={30} color="black" />,
      text: t("circleLogoStepper.confirm", "Confirm"),
      active: true,
    },
  ];

  // Reverse steps if RTL
  const displaySteps = isRTL ? [...steps].reverse() : steps;

  return (
    <View style={[styles.container, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
      {displaySteps.map((step, index) => (
        <React.Fragment key={index}>
          {/* Step */}
          <View style={styles.step}>
            <View style={styles.circleContainer}>
              <View style={[styles.circle, { backgroundColor: theme.colors.pearlWhite }]}>
                {step.icon}
              </View>
              <Text style={[
                styles.circleText, 
                { textAlign: "center" },
                isUrdu && styles.urduText
              ]}>
                {step.text}
              </Text>
            </View>
          </View>

          {/* Arrow - only show between steps, not after the last one */}
          {index < displaySteps.length - 1 && (
            <Text style={[
              styles.arrow,
              index === 1 && styles.secondArrow,
              isUrdu && styles.urduArrow
            ]}>
              {isRTL ? "<---------" : "--------->"}
            </Text>
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 10,
    width: "100%",
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: theme.colors.copper,
    justifyContent: 'center'
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.sageGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categories: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.sageGreen,
  },
  circleText: {
    marginTop: 5,
    fontSize: 14,
    color: theme.colors.ivory,
    width: 80, // Fixed width to ensure text alignment
  },
  urduText: {
    fontSize: 16, // Larger font size for Urdu
  },
  arrow: {
    fontSize: 20,
    color: '#ccc',
    marginHorizontal: 5,
  },
  secondArrow: {
    marginLeft: 12,
    marginRight: 6,
  },
  urduArrow: {
    fontSize: 20,
  },
});

export default CircleLogoStepper3;