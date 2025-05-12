"use client"

import React, { useContext } from "react"
import { View, Text, StyleSheet } from "react-native"
import { theme } from "../core/theme"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import Ionicons from "@expo/vector-icons/Ionicons"
import { AuthContext } from "../context/AuthContext"
import { t } from "../i18n"
import RTLText from "./RTLText"

const CircleLogoStepper = () => {
  const { isRTL } = useContext(AuthContext)

  // Create the steps
  const steps = [
    {
      icon: <MaterialCommunityIcons name="cursor-default-click-outline" size={30} color="black" />,
      text: t("circleLogoStepper.selectCategory", "Select Category"),
      active: true,
    },
    {
      icon: <MaterialIcons name="add" size={30} color="black" />,
      text: t("circleLogoStepper.addDetails", "Add Details"),
      active: false,
    },
    {
      icon: <Ionicons name="checkmark-done" size={30} color="black" />,
      text: t("circleLogoStepper.confirm", "Confirm"),
      active: false,
    },
  ]

  // Reverse steps if RTL
  const displaySteps = isRTL ? [...steps].reverse() : steps

  return (
    <View style={[styles.container, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
      {displaySteps.map((step, index) => (
        <React.Fragment key={index}>
          {/* Step */}
          <View style={styles.step}>
            <View style={styles.circleContainer}>
              <View style={[styles.circle, step.active && { backgroundColor: theme.colors.sageGreen }]}>
                {step.icon}
              </View>
              <RTLText style={styles.circleText}>{step.text}</RTLText>
            </View>
          </View>

          {/* Arrow - only show between steps, not after the last one */}
          {index < displaySteps.length - 1 && <Text style={styles.arrow}>{isRTL ? "<---------" : "--------->"}</Text>}
        </React.Fragment>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
    paddingHorizontal: 10,
  },
  step: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.outerSpace,
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    marginTop: 5,
    fontSize: 14,
    color: theme.colors.ivory,
    textAlign: "center",
    maxWidth: 80,
  },
  arrow: {
    fontSize: 20,
    color: "#ccc",
    marginHorizontal: 5,
  },
})

export default CircleLogoStepper

