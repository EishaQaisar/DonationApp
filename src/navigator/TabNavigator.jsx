import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Notifications from "../screens/Notifications"
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { getBaseUrl } from "../helpers/deviceDetection";
import { AuthContext } from "../context/AuthContext";

import { theme } from "../core/theme"
import Entypo from "@expo/vector-icons/Entypo"
import Ionicons from "@expo/vector-icons/Ionicons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import History from "./History"
import ForCart from "./ForCart"
import {t} from "../i18n"


import { CartProvider } from "../CartContext" // Import CartProvider

import HomeStackNav from "./HomeStackNav"

const Tab = createBottomTabNavigator()

function TabNavigator({ navigation, route }) {
  const { role, type } = route.params
  const { user } = useContext(AuthContext);

  console.log("TabNavigator received role:", role)
  const [notificationCount, setNotificationCount] = useState(0);

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (!user || !user.username) return;
      
      try {
        const BASE_URL = await getBaseUrl();
        const response = await axios.get(`${BASE_URL}/api/get-notification-count`, {
          params: {
            username: user.username,
            role: role
          }
        });
        setNotificationCount(response.data.count);
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

    fetchNotificationCount();

    // Set up interval to periodically check for new notifications
    const intervalId = setInterval(fetchNotificationCount, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [user, role]);

  return (
    <CartProvider>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: styles.tabBarStyle,
          tabBarActiveTintColor: theme.colors.sageGreen,
        }}
      >
        <Tab.Screen
          name="Start-nav"
          component={HomeStackNav}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />,
          }}
          initialParams={{ role }}
        />

{(role === "recipient" || role === "donor") && (
   <Tab.Screen 
   name="Notifications" 
   component={Notifications} 
   options={{
     headerShown: false,
     tabBarIcon: ({ color }) => (
       <View>
         <Ionicons name="notifications" size={24} color={color} />
         {notificationCount > 0 && (
           <View style={styles.badgeContainer}>
             <Text style={styles.badgeText}>
               {notificationCount > 99 ? '99+' : notificationCount}
             </Text>
           </View>
         )}
       </View>
     )
   }} 
   initialParams={{ ...route.params }}
 />
)}



        {role === "recipient" && (
          <Tab.Screen
            name="ForCart"
            component={ForCart}
            options={{
            headerShown:false,
              
               
              tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
            }}
            initialParams={{ role }}
          />
        )}

        <Tab.Screen
          name="History"
          component={History}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={24} color={color} />,
          }}
          initialParams={{ role }}
        />

        
      </Tab.Navigator>
    </CartProvider>
  )
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 40,
    position: "absolute",
    backgroundColor: theme.colors.charcoalBlack,
    borderTopWidth: 0,
    borderTopColor: "transparent",
    elevation: 0,
  },
  badgeContainer: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: theme.colors.sageGreen,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: theme.colors.charcoalBlack,
  },
  badgeText: {
    color: 'red',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default TabNavigator