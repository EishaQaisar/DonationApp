import { ImageBackground, StyleSheet, View, Text } from "react-native"
import Button from "../components/Button"
import { theme } from "../core/theme"
import LanguageSwitcher from "../components/LanguageSwitcher"
import i18n,{ t } from "../i18n"
export default function StartScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../../assets/items/0d59de270836b6eafe057c8afb642e77.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Language Switcher at the top right */}
        <View style={styles.languageSwitcherContainer}>
          <LanguageSwitcher />
        </View>

        {/* Header at the top left */}
        <View style={styles.header}>
          <Text style={styles.headerText}>{t("startScreen.appName")}</Text>
          <Text style={styles.catchlineText}>{t("startScreen.catchline")}</Text>
        </View>

        {/* Button container at the bottom */}
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={() => navigation.navigate("ChooseRole")} style={styles.button}>
            {t("startScreen.getStarted")}
          </Button>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "120%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1, // Full height of the screen
    justifyContent: "space-between", // Distributes space between header, text, and button container
    alignItems: "center", // Centers items horizontally
    width: "100%",
    paddingBottom: 10, // Extra padding for the bottom
  },
  catchlineText: {
    color: theme.colors.ivory,
    fontSize: 20, // Slightly smaller than the main text
    textAlign: "left",
    fontWeight: "bold",
    marginTop: 10, // Add some spacing under the header
    padding: 5,
  },
  header: {
    position: "absolute", // Make the header stick to the top
    top: 30, // Adjust top position as needed
    left: 20, // Adjust left position as needed
    padding: 5,
    borderRadius: 5,
  },
  headerText: {
    color: theme.colors.ivory,
    fontSize: 40,
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute", // Make the container absolute to position it at the bottom
    bottom: 30, // Adjusts how far from the bottom the button is
    width: "80%", // Button container takes up 80% of the screen width
    alignItems: "center", // Centers buttons horizontally
    paddingBottom: 30, // Padding at the bottom
  },
  button: {
    width: "100%", // Button width as a percentage of the container width
    marginBottom: 10, // Spacing between buttons
  },
  languageSwitcherContainer: {
    position: "absolute",
    top: 30,
    right: 20,
    zIndex: 10,
  },
})

