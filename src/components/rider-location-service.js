import { Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import * as Location from "expo-location";

class RiderLocationService {
  constructor(userId) {
    this.userId = userId;
    this.locationSubscription = null;
    this.isTracking = false;
  }

  // Start tracking and updating location to Firestore
  async startTracking() {
    if (this.isTracking) return true;

    Alert.alert("Tracking Status", "Starting location tracking...");

    try {
      // Request permissions first
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to track your position.");
        return false;
      }

      // Create a location subcollection for the rider if it doesn't exist
      await this.initializeLocationDocument();

      // Start watching position
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Update every 10 meters
          timeInterval: 5000, // Or at least every 5 seconds
        },
        this.updateLocation
      );

      this.isTracking = true;
      Alert.alert("Tracking Started", "Your location is now being tracked.");
      return true;
    } catch (error) {
      Alert.alert("Error", `Failed to start tracking: ${error.message}`);
      return false;
    }
  }

  // Stop tracking location
  stopTracking() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
    this.isTracking = false;
    Alert.alert("Tracking Stopped", "Your location tracking has been stopped.");
  }

  // Initialize the location document in Firestore
  async initializeLocationDocument() {
    try {
      const locationRef = firestore().collection("riders").doc(this.userId).collection("location").doc("current");

      // Check if document exists, create if not
      const doc = await locationRef.get();
      if (!doc.exists) {
        Alert.alert("Initializing", "Creating a new location document...");
        await locationRef.set({
          latitude: 0,
          longitude: 0,
          heading: 0,
          speed: 0,
          timestamp: firestore.FieldValue.serverTimestamp(),
          isActive: true,
        });
      }
    } catch (error) {
      Alert.alert("Error", `Failed to initialize location document: ${error.message}`);
    }
  }

  // Update location in Firestore
  updateLocation = async (location) => {
    try {
      const { latitude, longitude, heading, speed } = location.coords;

      // Update the current location document
      await firestore()
        .collection("riders")
        .doc(this.userId)
        .collection("location")
        .doc("current")
        .update({
          latitude,
          longitude,
          heading: heading || 0,
          speed: speed || 0,
          timestamp: firestore.Timestamp.fromDate(new Date(location.timestamp)),
          lastUpdated: firestore.FieldValue.serverTimestamp(),
        });

      // Also update the main rider document with last known location
      await firestore()
        .collection("riders")
        .doc(this.userId)
        .update({
          lastKnownLocation: {
            latitude,
            longitude,
            timestamp: firestore.FieldValue.serverTimestamp(),
          },
        });

      Alert.alert("Location Updated", "Your location has been updated in Firestore.");
    } catch (error) {
      Alert.alert("Error", `Failed to update location: ${error.message}`);
    }
  };

  // Get the current tracking status
  isCurrentlyTracking() {
    return this.isTracking;
  }
}

export default RiderLocationService;
