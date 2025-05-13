"use client"

// App.js
import "react-native-gesture-handler"
import { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { Provider } from "react-native-paper"
import { theme } from "./src/core/theme"
import { ActivityIndicator, View } from "react-native"
import { initializeI18n } from "./src/i18n" // Import the i18n initialization function
import {
  ChooseRole,
  DonorProfileForm,
  LoginScreen,
  RChoose,
  RecipientProfileForm,
  RegisterIndividualScreen,
  RegisterNGOScreen,
  RegisterScreenDonor,
  ResetPasswordScreen,
  ScheduleDelivery,
  StartScreen,
  WaitForApprovalScreen,
  ChildrenProfiles,
  RiderFinalHomeScreen,
  DeliveryHistory,
  DonorOrderTrackingScreen,
  NGOProfileDetailsScreen,
  MapScreen,
} from "./src/screens"
import TabNavigator from "./src/navigator/TabNavigator"
import ScheduleRDeliveryScreen from "./src/screens/ScheduleRDeliveryScreen"

import Detail from "./src/Detail"
import Dashboard from "./src/Dashboard"
import Loginn from "./src/Loginn"

import * as DB from "./src/database/setupTables"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"
import { AuthProvider } from "./src/context/AuthContext" // Adjust the path as necessary
import { UserProfileProvider } from "./src/context/UserProfileContext" // Adjust the path as necessary
import "react-native-get-random-values"

const Stack = createStackNavigator()
DB.setupTables()

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  useDrizzleStudio(DB.db)

  // Initialize app
  useEffect(() => {
    const initialize = async () => {
      // Just initialize i18n with default settings
      // The AuthProvider will handle the actual language setup
      await initializeI18n()
      setIsLoading(false)
    }

    initialize()
  }, [])

  // Show loading indicator while initializing
  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  return (
    <AuthProvider>
      <UserProfileProvider>
        <Provider theme={theme}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="StartScreen"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Loginn" component={Loginn}></Stack.Screen>
              <Stack.Screen name="Detail" component={Detail}></Stack.Screen>
              <Stack.Screen name="Dashboard" component={Dashboard}></Stack.Screen>
              <Stack.Screen name="StartScreen" component={StartScreen} />
              <Stack.Screen name="RChoose" component={RChoose} />
              <Stack.Screen name="ChooseRole" component={ChooseRole} />
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="RegisterScreenDonor" component={RegisterScreenDonor} />
              <Stack.Screen name="RegisterNGOScreen" component={RegisterNGOScreen} />
              <Stack.Screen name="NGOprofileDetailsScreen" component={NGOProfileDetailsScreen} />
              <Stack.Screen name="RegisterIndividualScreen" component={RegisterIndividualScreen} />
              <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
              <Stack.Screen name="WaitForApprovalScreen" component={WaitForApprovalScreen} />
              <Stack.Screen name="ScheduleDelivery" component={ScheduleDelivery} />
              <Stack.Screen name="DonorProfileForm" component={DonorProfileForm} />
              <Stack.Screen name="RecipientProfileForm" component={RecipientProfileForm} />
              <Stack.Screen name="ChildrenProfiles" component={ChildrenProfiles} />
              <Stack.Screen name="RiderFinalHomeScreen" component={RiderFinalHomeScreen} />
              <Stack.Screen name="MapScreen" component={MapScreen}/>
              <Stack.Screen name="DeliveryHistory" component={DeliveryHistory} />
              <Stack.Screen name="ScheduleRDeliveryScreen" component={ScheduleRDeliveryScreen} />
              <Stack.Screen name="DonorOrderTrackingScreen" component={DonorOrderTrackingScreen} />
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </UserProfileProvider>
    </AuthProvider>
  )
}

