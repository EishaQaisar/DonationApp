import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from '../core/theme'
import { ChooseCategory, DonorHomeScreen, ScheduleRDeliveryScreen, UploadClothes, UploadEdu, UploadFood, HomeScreenRec, Education, Clothes, Food, ClaimsHistory, ItemDetail, RecepientStartScreen, DonationSuccessScreen, NgoPostDetailsScreen, ViewNgoPostsScreen, NGOCampaignForm ,RiderFinalHomeScreen ,DonorOrderTrackingScreen, DonationsHistory} from '../screens';
const Stack = createStackNavigator();
const HomeStackNav = ({ navigation, route }) => {
  const { role } = route.params;

  return (

    <Stack.Navigator initialRouteName="Start">
      {role === "donor" && (
        <Stack.Screen
          name="Start"
          component={DonorHomeScreen}
          options={{ headerShown: false }}
        />
      )}
      {role === "recipient" && (
        <Stack.Screen
          name="Start"
          component={HomeScreenRec}
          options={{ headerShown: false }}
          initialParams={{ ...route.params }}/>
      )}

{role === "rider" && (
        <Stack.Screen
          name="Start"
          component={RiderFinalHomeScreen}
          options={{ headerShown: false }}
          initialParams={{ ...route.params }}/>

          
      )}
      
      <Stack.Screen name='ChooseCategory' component={ChooseCategory} options={{ headerShown: false }} />


      <Stack.Screen name='UploadFood' component={UploadFood}
        options={{
          title: "Food", headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} />

      <Stack.Screen name='UploadClothes' component={UploadClothes}
        options={{
          title: "Clothes", headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} />

      <Stack.Screen name='UploadEdu' component={UploadEdu}
        options={{
          title: "Education", headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} />

      <Stack.Screen name='DonationSuccessScreen' component={DonationSuccessScreen}
        options={{
          title: "", headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} />

      <Stack.Screen name='ScheduleRDeliveryScreen' component={ScheduleRDeliveryScreen}
        options={{
          title: "Schedule Delivery", headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }}

      />

{/* <Stack.Screen name='DonorOrderTrackingScreen' component={DonorOrderTrackingScreen}
        options={{
          title: "Monitoring", headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }}

      /> */}
        

      <Stack.Screen
        name="Clothes"
        component={Clothes}
        options={{
          title: 'Clothes Donations', headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} initialParams={{ ...route.params }}// Optional: Customize header title
      />
      <Stack.Screen
        name="Education"
        component={Education}
        options={{
          title: 'Education Donations', headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} initialParams={{ ...route.params }}// Optional: Customize header title
      />

      <Stack.Screen
        name="Food"
        component={Food}
        options={{
          title: 'Food Donations', headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} initialParams={{ ...route.params }}// Optional: Customize header title
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetail}
        options={{
          title: 'Item Details', headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} initialParams={{ ...route.params }}// Optional: Customize header title
      />
      <Stack.Screen
        name="RecepientStartScreen"
        component={RecepientStartScreen}
        options={{
          title: 'Categories', headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} // Optional: Customize header title
      />
       <Stack.Screen
        name="DonationsHistory"
        component={DonationsHistory}
        options={{
          title: 'Donation History', headerTitleStyle: { textAlign: 'center' },
          headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} // Optional: Customize header title
      />

      <Stack.Screen name='ViewNgoPostsScreen' component={ViewNgoPostsScreen} options={{ headerShown: false }} />
      <Stack.Screen name='NgoPostDetailsScreen' component={NgoPostDetailsScreen} options={{ headerShown: false }} />
     
      <Stack.Screen name='NGOCampaignForm' component={NGOCampaignForm} options={{headerShown:false}}/>
      <Stack.Screen name='DonorOrderTrackingScreen' component={DonorOrderTrackingScreen} options={{headerShown:false}}/>







    </Stack.Navigator>
  )
}

export default HomeStackNav;