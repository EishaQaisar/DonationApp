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

export default function RegisterChooseRole({ navigation }) {
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.header}>{t("rChoose.title")}</Text>

          <RoleCard
            title={t("rChoose.ngo")}
            image={require("../../assets/items/start1.jpg")}
            onPress={() => navigation.navigate("RegisterNGOScreen")}
          />

          <RoleCard
            title={t("rChoose.individual")}
            image={require("../../assets/items/20445e4432dc89c01c75b932749732a9.jpg")}
            onPress={() => navigation.navigate("RegisterIndividualScreen")}
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
