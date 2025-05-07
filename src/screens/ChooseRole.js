import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import Background from "../components/Background";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import i18n, { t } from "../i18n";

export default function ChooseRole({ navigation }) {
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.header}>{t("chooseRole.chooseRole")}</Text>

          {/* Role cards */}
          <RoleCard
            title={t("chooseRole.recipient")}
            image={require("../../assets/items/desktop-wallpaper-child-african-bl-african-kids.jpg")}
            onPress={() => navigation.navigate("LoginScreen", { role: "recipient" })}
          />

          <RoleCard
            title={t("chooseRole.donor")}
            image={require("../../assets/items/illustration-about-helping-poor-needy-with-concept-giving-charity_882884-955.jpg")}
            onPress={() => navigation.navigate("LoginScreen", { role: "donor" })}
          />

          <RoleCard
            title={t("chooseRole.rider")}
            image={require("../../assets/items/testinglogo.jpg")}
            onPress={() => navigation.navigate("LoginScreen", { role: "rider" })}
          />
        </View>
      </ScrollView>
    </Background>
  );
}

function RoleCard({ title, image, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.cardWrapper}>
      <ImageBackground source={image} style={styles.cardImage} imageStyle={styles.cardImageStyle}>
        <View style={styles.overlay} />
        <Text style={[styles.cardText, { fontSize: i18n.locale === "ur" ? 22 : 18 }]}>
          {title}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  container: {
    alignItems: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.ivory,
    textAlign: "center",
    marginBottom: 30,
  },
  cardWrapper: {
    width: "100%",
    height: 180,
    marginVertical: 12,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  cardImage: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  cardImageStyle: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  cardText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "left",
  },
});
