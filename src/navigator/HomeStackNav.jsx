import { createStackNavigator } from '@react-navigation/stack';
import { theme } from '../core/theme';
import { 
  ChooseCategory, DonorHomeScreen, ScheduleRDeliveryScreen, UploadClothes, UploadEdu, UploadFood, HomeScreenRec, 
  Education, Clothes, Food, ClaimsHistory, ItemDetail, RecepientStartScreen, DonationSuccessScreen, 
  NgoPostDetailsScreen, ViewNgoPostsScreen, NGOCampaignForm, RiderFinalHomeScreen, DonorOrderTrackingScreen, 
  DonationsHistory, NGOProfileDetailsScreen , DeliveryHistory
} from '../screens';
import i18n, {t} from '../i18n'
const Stack = createStackNavigator();

const HomeStackNav = ({ navigation, route }) => {
  const { role } = route.params;

  return (
    <Stack.Navigator initialRouteName="Start">
      {role === "donor" && (
        <Stack.Screen name="Start" component={DonorHomeScreen} options={{ headerShown: false }} />
      )}
      {role === "recipient" && (
        <Stack.Screen name="Start" component={HomeScreenRec} options={{ headerShown: false }} initialParams={{ ...route.params }} />
      )}
      {role === "rider" && (
        <Stack.Screen name="Start" component={RiderFinalHomeScreen} options={{ headerShown: false }} initialParams={{ ...route.params }} />
      )}

      <Stack.Screen name="ChooseCategory" component={ChooseCategory} options={{ headerShown: false }} />

      <Stack.Screen 
        name="UploadFood" 
        component={UploadFood} 
        options={{
          title: t("titles.food"),
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} 
      />

      <Stack.Screen 
        name="UploadClothes" 
        component={UploadClothes} 
        options={{
          title: t("titles.clothes"),
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} 
      />

      <Stack.Screen 
        name="UploadEdu" 
        component={UploadEdu} 
        options={{
          title: t("titles.education"),
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} 
      />

      <Stack.Screen 
        name="DonationSuccessScreen" 
        component={DonationSuccessScreen} 
        options={{
          title: "",
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} 
      />

      <Stack.Screen 
        name="ScheduleRDeliveryScreen" 
        component={ScheduleRDeliveryScreen} 
        options={{
          title: t("titles.schedule_delivery"),
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} 
      />

      <Stack.Screen 
        name="Clothes" 
        component={Clothes} 
        options={{
          title: t("titles.clothes_donations"),
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} 
        initialParams={{ ...route.params }} 
      />

      <Stack.Screen 
        name="Education" 
        component={Education} 
        options={{
          title: t("titles.education_donations"),
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} 
        initialParams={{ ...route.params }} 
      />

      <Stack.Screen 
        name="Food" 
        component={Food} 
        options={{
          title: t("titles.food_donations"),
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} 
        initialParams={{ ...route.params }} 
      />

      <Stack.Screen 
        name="ItemDetail" 
        component={ItemDetail} 
        options={{
          title: t("titles.item_details"),
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} 
        initialParams={{ ...route.params }} 
      />

      <Stack.Screen 
        name="RecepientStartScreen" 
        component={RecepientStartScreen} 
        options={{
          title: t("titles.categories"),
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} 
      />

      <Stack.Screen 
        name="DonationsHistory" 
        component={DonationsHistory} 
        options={{
          title: t("titles.donation_history"),
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} 
      />
      <Stack.Screen 
        name="DeliveryHistory" 
        component={DeliveryHistory} 
        options={{
          title: t("titles.donation_history"),
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} 
      />

      <Stack.Screen name="DonorOrderTrackingScreen" component={DonorOrderTrackingScreen} options={{ headerShown: false }} />

      <Stack.Screen 
        name="ViewNgoPostsScreen" 
        component={ViewNgoPostsScreen} 
        options={{
          title: t("titles.ngo_campaigns"),
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
          headerTintColor: theme.colors.ivory
        }} 
      />
      
    
      <Stack.Screen name="NgoPostDetailsScreen" component={NgoPostDetailsScreen} options={{ headerShown: false }} initialParams={{ ...route.params }} />

      <Stack.Screen name="NGOCampaignForm" component={NGOCampaignForm} options={{ headerShown: false }} initialParams={{ ...route.params }} />
    </Stack.Navigator>
  );
};

export default HomeStackNav;
