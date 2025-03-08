import { createStackNavigator } from "@react-navigation/stack"
import { ClaimsHistory, Profile } from "../screens"

const Stack = createStackNavigator()

const History = ({ route }) => {
  console.log("History navigator received params:", route.params)

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
        initialParams={{ ...route.params }}
      />
      <Stack.Screen name="ClaimsHistory" component={ClaimsHistory} options={{ title: "ClaimsHistory" }} />
    </Stack.Navigator>
  )
}

export default History

