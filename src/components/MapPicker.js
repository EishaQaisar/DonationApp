import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { theme } from "../core/theme";

export default function MapPicker({ onLocationSelect, onCancel }) {
  const [region, setRegion] = useState({
    latitude: 31.460373038978258,
    longitude: 73.13597597395149,
    latitudeDelta: 0.09,
    longitudeDelta: 0.015,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);

  const handlePress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const zoomIn = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  const zoomOut = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion} // Track the current region
        onPress={handlePress}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} title="Selected Location" />
        )}
      </MapView>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
          <Text style={styles.zoomButtonText}>-</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onLocationSelect(selectedLocation)}
        >
          <Text style={styles.buttonText}>Select Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  zoomButton: {
    backgroundColor: theme.colors.sageGreen,
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  zoomButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: theme.colors.ivory,
  },
  button: {
    backgroundColor: theme.colors.sageGreen,
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
