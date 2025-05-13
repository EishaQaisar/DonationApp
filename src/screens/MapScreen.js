import React from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

import Background from "../components/Background";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import i18n, { t } from "../i18n";

export default function MapScreen({ navigation }) {
  return (
    <View style={styles.container}>
     <MapView
  style={StyleSheet.absoluteFillObject}
  initialRegion={{
    latitude: 31.4504,
    longitude: 73.1350,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
>
  <Marker
    coordinate={{ latitude: 31.4504, longitude: 73.1350 }}
    title="Faisalabad"
    description="This is Faisalabad"
  />
</MapView>

      {/* Overlayed UI */}
      <View style={styles.overlay}>
        <BackButton goBack={navigation.goBack} />
        <Text style={styles.header}>{t("map.title") || "Map View"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
    alignItems: "flex-start",
  },
  header: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.ivory,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
