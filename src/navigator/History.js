import { createStackNavigator } from "@react-navigation/stack"
import { ClaimsHistory, Profile , DonationsHistory, DeliveryHistory,Feedbackss} from "../screens"
import { useEffect } from "react";
import { theme } from '../core/theme'
import {t} from '../i18n'


const Stack = createStackNavigator()

const History = ({ route }) => {
  useEffect(() => {
    console.log("History component mounted with params:", route.params);
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
              name="ClaimsHistory"
              component={ClaimsHistory}
              options={{
                title:  t('titles.claims_history'), headerTitleStyle: { textAlign: 'center' },
                headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
                headerTintColor: theme.colors.ivory
              }} // Optional: Customize header title
            />
       <Stack.Screen
              name="DonationsHistory"
              component={DonationsHistory}
              options={{
                title:  t('titles.donations_history'), headerTitleStyle: { textAlign: 'center' },
                headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
                headerTintColor: theme.colors.ivory
              }} // Optional: Customize header title
            />

<Stack.Screen
              name="DeliveryHistory"
              component={DeliveryHistory}
              options={{
                title:  t('titles.delivery_history'), headerTitleStyle: { textAlign: 'center' },
                headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
                headerTintColor: theme.colors.ivory
              }} // Optional: Customize header title
            />
            <Stack.Screen
              name="Feedbackss"
              component={Feedbackss}
              options={{
                title:  t('titles.feedback'), headerTitleStyle: { textAlign: 'center' },
                headerTitleAlign: 'center', headerStyle: { backgroundColor: theme.colors.charcoalBlack, height: 70 },
                headerTintColor: theme.colors.ivory
              }} // Optional: Customize header title
            />
    </Stack.Navigator>
  );
};
export default History

