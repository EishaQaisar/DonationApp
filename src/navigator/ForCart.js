import { View, Text } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  ChooseCategory,
  DonorHomeScreen,
  ScheduleRDeliveryScreen,
  UploadClothes,
  UploadEdu,
  UploadFood,
  HomeScreenRec,
  Education,
  Clothes,
  Food,
  ClaimsHistory,
  ItemDetail,
  RecepientStartScreen,
  Cart,
  DonationSuccessScreen,
} from '../screens';

import { theme } from '../core/theme';
import { CartProvider } from '../CartContext'; // Import CartProvider

const Stack = createStackNavigator();

const ForCart = ({ navigation, route }) => {
  const { role } = route.params; // Safely destructure `route.params`

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          title: 'Cart',
          headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory,
        }}
        initialParams={{ ...route.params }} // Pass params to `Cart`
      />
      <Stack.Screen
        name="Clothes"
        component={Clothes}
        options={{
          title: 'Clothes Donations',
          headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory,
        }}
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
        name="Education"
        component={Education}
        options={{
          title: 'Education Donations',
          headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory,
        }}
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
        name="Food"
        component={Food}
        options={{
          title: 'Food Donations',
          headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory,
        }}
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetail}
        options={{
          title: 'Item Details',
          headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory,
        }}
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
        name="RecepientStartScreen"
        component={RecepientStartScreen}
        options={{
          title: 'Categories',
          headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory,
        }}
        initialParams={{ ...route.params }}
      />
    </Stack.Navigator>
  );
};

export default ForCart;
