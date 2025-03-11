import { createStackNavigator } from "@react-navigation/stack"
import { ClaimsHistory, Profile , DonationsHistory} from "../screens"
import { useEffect } from "react";
import { theme } from '../core/theme'


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
                title: 'Claims History', headerTitleStyle: { textAlign: 'center' },
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
    </Stack.Navigator>
  );
};
export default History

