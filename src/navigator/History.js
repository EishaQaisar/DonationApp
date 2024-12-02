import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {ClaimsHistory, Profile} from '../screens';
const Stack=createStackNavigator();
const History = () => {
  return (
    <Stack.Navigator >
      
            <Stack.Screen
              name="Profile"
              component={Profile}
            />
        <Stack.Screen
              name="ClaimsHistory"
              component={ClaimsHistory}
              options={{ title: 'ClaimsHistory' }} // Optional: Customize header title
            />
             
           



    </Stack.Navigator>
  )
}

export default History;