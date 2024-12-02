// Only import react-native-gesture-handler on native platforms
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider } from "react-native-paper";
import { theme } from "./src/core/theme";
import {
  ChooseRole,
  LoginScreen,
  RChoose,
  RegisterIndividualScreen,
  RegisterNGOScreen,
  RegisterScreenDonor,
  ResetPasswordScreen,
  ScheduleDelivery,
  StartScreen,
  WaitForApprovalScreen,
  
} from "./src/screens";
import TabNavigator from './src/navigator/TabNavigator';
import ScheduleRDeliveryScreen from "./src/screens/ScheduleRDeliveryScreen";


import Detail from './src/Detail';
import Dashboard from './src/Dashboard';
import Loginn from './src/Loginn';

import * as DB from './src/database/setupTables'
import { useDrizzleStudio} from 'expo-drizzle-studio-plugin';
import { AuthProvider } from "./src/context/AuthContext"; // Adjust the path as necessary

const Stack= createStackNavigator();
DB.setupTables();
export default function App(){
  useDrizzleStudio(DB.db);
  return(
    <AuthProvider>
    <Provider theme={theme}>

    <NavigationContainer>
      <Stack.Navigator initialRouteName='StartScreen'  screenOptions={{
            headerShown: false,
          }}> 
        <Stack.Screen
        name="Loginn"
        component={Loginn}></Stack.Screen>
        <Stack.Screen
        name="Detail"
        component={Detail}></Stack.Screen>
        <Stack.Screen
        name="Dashboard"
        component={Dashboard}></Stack.Screen>

<Stack.Screen name="StartScreen" component={StartScreen} />

<Stack.Screen name="RChoose" component={RChoose} />         
<Stack.Screen name="ChooseRole" component={ChooseRole} />
<Stack.Screen name="LoginScreen" component={LoginScreen} />   
<Stack.Screen name="RegisterScreenDonor" component={RegisterScreenDonor} />  
<Stack.Screen name="RegisterNGOScreen" component={RegisterNGOScreen} />  
<Stack.Screen name="RegisterIndividualScreen" component={RegisterIndividualScreen} />   
<Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} /> 
<Stack.Screen name="WaitForApprovalScreen" component={WaitForApprovalScreen} /> 
<Stack.Screen name="ScheduleDelivery" component={ScheduleDelivery} /> 
            <Stack.Screen name="TabNavigator" component={TabNavigator} />





    
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
    </AuthProvider>


  )
}