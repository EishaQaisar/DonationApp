import React, { useState, useEffect, useRef } from "react";
import { useRoute } from '@react-navigation/native';
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, Modal } from "react-native";
import { theme } from "../core/theme";
import Button from "../components/Button";
import MapPicker from "../components/MapPicker";
import TextInput from "../components/TextInput";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { getBaseUrl } from "../helpers/deviceDetection"
import CalendarPicker from "react-native-calendar-picker";
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import axios from 'axios';
import i18n,{t} from "../i18n";

const GOOGLE_API_KEY = "AI";
const isUrdu = i18n.locale === "ur";


export default function ScheduleRDeliveryScreen({ navigation }) {
 const route = useRoute();
 const [validationErrors, setValidationErrors] = useState({
 date: false,
 pickupLocation: false,
 dropOffLocation: false
 });
 const { id = 0 } = route.params || {};
 const [showLocationModal, setShowLocationModal] = useState(false);
 console.log(id)
 console.log(route.params)

 // State for claimed item data
 const [claimedItem, setClaimedItem] = useState(null);
 const [donorUsername, setDonorUsername] = useState("");
 const [claimerUsername, setClaimerUsername] = useState("");
 const [donationType, setDonationType] = useState("");
 const [loading, setLoading] = useState(true);
 const [claimerAddress, setClaimerAddress] = useState("");

 // Delivery details state
 const [selectedStartDate, setSelectedStartDate] = useState(null);
 const [pickupLocation, setPickupLocation] = useState("");
 const [dropOffLocation, setDropOffLocation] = useState("");
 const [error, setError] = useState(null);
 const [pickupTime, setPickupTime] = useState(new Date());
 const [showTimePicker, setShowTimePicker] = useState(false);
 const [pickupCoordinates, setPickupCoordinates] = useState(null);
 const [dropOffCoordinates, setDropOffCoordinates] = useState(null);

 // Ref for GooglePlacesAutocomplete
 const googlePlacesRef = useRef(null);

 // Fetch the specific claimed item based on ID
 useEffect(() => {
 fetchClaimedItem();
 }, [id]);

 const fetchClaimedItem = async () => {
 if (!id) {
 setError(t('scheduleDelivery.noItemToSchedule'));
 setLoading(false);
 return;
 }

 try {
 const BASE_URL = await getBaseUrl();
 const endpoint = `${BASE_URL}/api/claimed-items/unscheduled`;
 const response = await axios.get(endpoint);
 console.log('wefweferfer',response.data)

 console.log("Fetched Claimed Items:", response.data); // Debugging step

 // Ensure response.data.data exists and is an array before using find()
 if (Array.isArray(response.data?.data)) {
 const matchingItem = response.data.data.find(item => item.id === id);

 if (matchingItem) {
 console.log("Found matching claimed item:", matchingItem);
 setClaimedItem(matchingItem);
 // Update state variables
 setClaimedItem(matchingItem);
 setDonorUsername(matchingItem.donorUsername);
 setClaimerUsername(matchingItem.claimerUsername);
 setDonationType(matchingItem.donationType);

 // Log extracted values
 console.log("Donor Username:", matchingItem.donorUsername);
 console.log("Claimer Username:", matchingItem.claimerUsername);
 console.log("Donation Type:", matchingItem.donationType);

 } else {
 console.log("No matching item found for ID:", id);
 // Don't set error state, just log the message
 }
 } else {
 console.error("Unexpected API response format:", response.data);
 setError("Unexpected response format");
 }
 } catch (error) {
 console.error("Error fetching claimed item:", error);
 setError("Failed to load item details");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 if (!claimerUsername) return; // Prevent running when username is empty

 const fetchClaimerAddress = async () => {
 try {
 // Step 1: Get the UID of the claimerUsername
 const userQuery = await firestore()
 .collection("recipients") // Collection where user details are stored
 .where("username", "==", claimerUsername)
 .get();

 if (userQuery.empty) {
 console.warn("No user found with username:", claimerUsername);
 setClaimerAddress(""); // Clear address if user not found
 return;
 }

 const uid = userQuery.docs[0].id; // Extract UID
 console.log("Found UID for claimer:", uid);

 // Step 2: Fetch address from IndividualProfile collection using UID
 const profileDoc = await firestore()
 .collection("individual_profiles")
 .doc(uid)
 .get();

 if (!profileDoc.exists) {
 console.warn("No profile found for UID:", uid);
 setClaimerAddress(""); // Clear address if profile not found
 return;
 }

 const address = profileDoc.data().address; // Extract address
 console.log("Claimer's Address:", address);

 setClaimerAddress(address); // Update state with fetched address

 // Set the claimer's address as the drop-off location
 setDropOffLocation(address);

 // Get coordinates for the claimer's address
 validateAndGetCoordinates(address, 'dropoff');
 } catch (error) {
 console.error("Error fetching claimer's address:", error);
 setClaimerAddress(""); // Handle errors gracefully
 }
 };

 fetchClaimerAddress();
 }, [claimerUsername]); // Runs when claimerUsername changes

 // Validate address and get coordinates using Google Maps API
 const validateAndGetCoordinates = async (address, locationType) => {
 console.log("in validateAndGetCoordinates");
 if (!address) return;

 try {
 const response = await axios.get(
 `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
 );

 if (response.data.status === 'OK' && response.data.results.length > 0) {
 const location = response.data.results[0].geometry.location;
 const coordinates = {
 latitude: location.lat,
 longitude: location.lng
 };

 // Format the address
 const formattedAddress = response.data.results[0].formatted_address;
 console.log("formatted address", formattedAddress);

 if (locationType === 'pickup') {
 setPickupCoordinates(coordinates);
 setPickupLocation(formattedAddress);
 } else if (locationType === 'dropoff') {
 setDropOffCoordinates(coordinates);
 setDropOffLocation(formattedAddress);
 }
 console.log("coordinates of drop off", coordinates);

 return coordinates;

 } else {
 console.error("Address validation failed:", response.data.status);
 Alert.alert('Invalid Address', 'Please enter a valid address');
 return null;
 }
 } catch (error) {
 console.error("Error validating address:", error);
 Alert.alert('Error', 'Failed to validate address');
 return null;
 }
 };

 const onDateChange = (date) => setSelectedStartDate(date);

 const onTimeChange = (event, selectedTime) => {
 setShowTimePicker(false);
 if (selectedTime) setPickupTime(selectedTime);
 };
 const handleSaveDelivery = async () => {
 console.log("handle save button");

 // Reset all validation errors
 setValidationErrors({
 date: false,
 pickupLocation: false,
 dropOffLocation: false,
 pickupCoordinates: false
 });

 // Check all required fields and set validation errors
 let hasErrors = false;
 let newErrors = {
 date: false,
 pickupLocation: false,
 dropOffLocation: false
 };

 if (!selectedStartDate) {
 newErrors.date = true;
 hasErrors = true;
 }

 if (!pickupLocation) {
 newErrors.pickupLocation = true;
 hasErrors = true;
 }

 if (!dropOffLocation) {
 newErrors.dropOffLocation = true;
 hasErrors = true;
 }

 if (!pickupCoordinates) {
 newErrors.pickupCoordinates = true;
 hasErrors = true;
 }

 // If there are errors, update state and show alert
 if (hasErrors) {
 setValidationErrors(newErrors);

 // Create error message based on what's missing
 let errorMessage = t("scheduleDelivery.missingInfo");

 if (newErrors.date) errorMessage +=  t("scheduleDelivery.selectDate");
 if (newErrors.pickupLocation) errorMessage +=  t("scheduleDelivery.enterPickupLocation");
 if (newErrors.dropOffLocation) errorMessage += t("scheduleDelivery.enterDropoffLocation");

 Alert.alert(t("scheduleDelivery.missingInfo"), errorMessage);
 return;
 }

 // If we get here, all validation passed, continue with saving
 try {
 // Save the order to Firebase
 await firestore()
 .collection('orders')
 .doc(id.toString()) // Use the claimed item ID as the order ID
 .set({
 orderId: id,
 origin: {
 latitude: pickupCoordinates.latitude,
 longitude: pickupCoordinates.longitude,
 address: pickupLocation
 },
 destination: {
 latitude: dropOffCoordinates.latitude,
 longitude: dropOffCoordinates.longitude,
 address: dropOffLocation
 },
 pickupDate: selectedStartDate.toISOString(),
 pickupTime: pickupTime.toISOString(),
 status: 'pending',
 createdAt: firestore.FieldValue.serverTimestamp()
 });

 // Show success alert
 Alert.alert(
    t("scheduleDelivery.deliveryScheduled"),
    t("scheduleDelivery.successMessage"),
 [
 {
 text: t("scheduleDelivery.ok"),
 onPress: () => {
 console.log('Delivery scheduled for item ID:', id);
 navigation.goBack(); // Navigate back after scheduling
 },
 },
 ],
 { cancelable: false }
 );
 } catch (error) {
 console.error("Error scheduling delivery:", error);
 Alert.alert('Error', 'Failed to schedule delivery. Please try again.');
 }
 };

 // Handle address input change and validation
 const handleAddressChange = (text, type) => {
 if (type === 'pickup') {
 setPickupLocation(text);
 // Clear coordinates when manually editing
 setPickupCoordinates(null);
 } else if (type === 'dropoff') {
 setDropOffLocation(text);
 // Clear coordinates when manually editing
 setDropOffCoordinates(null);
 }
 };

 // Location search modal
 const LocationSearchModal = () => (
 <Modal
 visible={showLocationModal}
 animationType="slide"
 transparent={false}
 onRequestClose={() => setShowLocationModal(false)}
 >
 <View style={styles.modalContainer}>
 <View style={styles.modalHeader}>
 <Text style={styles.modalTitle}> {t("scheduleDelivery.searchPickupLocation")}</Text>
 <TouchableOpacity onPress={() => setShowLocationModal(false)} style={styles.closeButton}>
 <Text style={styles.closeButtonText}> {t("scheduleDelivery.close")}</Text>
 </TouchableOpacity>
 </View>

 <GooglePlacesAutocomplete
 ref={googlePlacesRef}
 placeholder= {t("scheduleDelivery.enterPickupLocation")}
 minLength={2}
 fetchDetails={true}
 onPress={(data, details = null) => {
 if (details) {
 const location = details.geometry.location;
 setPickupLocation(details.formatted_address);
 setPickupCoordinates({
 latitude: location.lat,
 longitude: location.lng
 });
 setShowLocationModal(false);
 }
 }}
 query={{
 key: GOOGLE_API_KEY,
 language: 'en',
 }}
 styles={{
 container: styles.autocompleteContainer,
 textInput: styles.autocompleteInput,
 listView: styles.autocompleteList,
 row: styles.autocompleteRow,
 description: styles.autocompleteDescription,
 }}
 enablePoweredByContainer={false}
 keyboardShouldPersistTaps="handled"
 listViewDisplayed={true}
 />
 </View>
 </Modal>
 );

 return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
  
        {/* Location Search Modal */}
        <LocationSearchModal />
  
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {loading ? (
              <Text style={styles.loadingText}>{t("scheduleDelivery.loadingItem")}</Text>
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : !claimedItem ? (
              <Text style={styles.loadingText}>{t("scheduleDelivery.noDeliveries")}</Text>
            ) : (
              <>
                {/* Item Details Section */}
                {claimedItem && (
                  <View style={styles.itemDetailsContainer}>
                    <Text style={styles.itemTitle}>{claimedItem.itemName || t("scheduleDelivery.item")}</Text>
                    {claimedItem.claimerUsername && (
                      <Text style={styles.itemDescription}>{t("scheduleDelivery.claimedBy")}: {claimedItem.claimerUsername}</Text>
                    )}
                    {claimedItem.itemId && (
                      <Text style={styles.itemQuantity}>{t("scheduleDelivery.itemId")}: {claimedItem.itemId}</Text>
                    )}
                  </View>
                )}
  
                {/* Calendar Section */}
                <Text style={styles.sectionTitle}>
                  {t("scheduleDelivery.selectDate")}
                  {validationErrors.date && <Text style={styles.errorIndicator}>*</Text>}
                </Text>
                <View style={[
                  styles.calendarContainer,
                  validationErrors.date && styles.errorBorder
                ]}>
                  <CalendarPicker
                    onDateChange={(date) => {
                      setSelectedStartDate(date);
                      // Clear the validation error when user selects a date
                      if (validationErrors.date) {
                        setValidationErrors({ ...validationErrors, date: false });
                      }
                    }}
                    textStyle={styles.calendarText}
                    todayBackgroundColor={theme.colors.sageGreen}
                    selectedDayColor={theme.colors.sageGreen}
                    selectedDayTextColor="white"
                    width={300}
                    minDate={new Date()}
                    style={styles.calendar}
                  />
                </View>
  
                {selectedStartDate && (
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>
                      {t("scheduleDelivery.pickupDate")}: {selectedStartDate.toDateString()}
                    </Text>
                  </View>
                )}
  
                {/* Time Picker Section */}
                <Text style={styles.sectionTitle}>
                  {t("scheduleDelivery.selectPickupTime")}
                  {validationErrors.time && <Text style={styles.errorIndicator}>*</Text>}
                </Text>
                <Button
                  mode="contained"
                  onPress={() => setShowTimePicker(true)}
                  style={styles.button}
                >
                  {pickupTime ? pickupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t("scheduleDelivery.setPickupTime")}
                </Button>
  
                {showTimePicker && (
                  <DateTimePicker
                    value={pickupTime}
                    mode="time"
                    display="spinner"
                    onChange={onTimeChange}
                    themeVariant="dark"
                    accentColor={theme.colors.sageGreen}
                  />
                )}
  
                {/* Pickup Location */}
                <Text style={styles.sectionTitle}>
                  {t("scheduleDelivery.pickupLocation")}
                  {validationErrors.pickupLocation && <Text style={styles.errorIndicator}>*</Text>}
                </Text>
                <TouchableOpacity
                  style={styles.locationInputContainer}
                  onPress={() => setShowLocationModal(true)}
                >
                  <TextInput
                    style={[
                      styles.input,
                      validationErrors.pickupLocation && styles.errorBorder
                    ]}
                    placeholder={t("scheduleDelivery.pickupPlaceholder")}
                    placeholderTextColor={theme.colors.placeholder}
                    value={pickupLocation}
                    editable={false}
                  />
                </TouchableOpacity>
  
                {/* Drop-off Location */}
                <Text style={styles.sectionTitle}>
                  {t("scheduleDelivery.dropoffLocation")}
                  {validationErrors.dropOffLocation && <Text style={styles.errorIndicator}>*</Text>}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    validationErrors.dropOffLocation && styles.errorBorder
                  ]}
                  placeholder={t("scheduleDelivery.dropoffPlaceholder")}
                  placeholderTextColor={theme.colors.placeholder}
                  value={dropOffLocation}
                  editable={false}
                />
  
                {/* Save Button */}
                <View style={styles.saveButtonContainer}>
                  <Button
                    mode="contained"
                    onPress={handleSaveDelivery}
                    style={styles.saveButton}
                  >
                    {t("scheduleDelivery.scheduleDelivery")}
                  </Button>
                </View>
              </>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Background>
  );
  
}

const styles = StyleSheet.create({
 scrollContainer: {
 flexGrow: 1,
 paddingBottom: 50,
 },
 header: {
 fontSize: 24,
 fontWeight: 'bold',
 color: theme.colors.ivory,
 textAlign: 'center',
 marginBottom: 20,
 marginTop: 20,
 },
 calendarContainer: {
 backgroundColor: theme.colors.sageGreen,
 width: '100%',
 height: '30%',
 alignItems: 'center',
 marginBottom: 1,
 borderWidth: 4,
 borderColor: theme.colors.sageGreen,
 borderRadius: 4,
 padding: 5,
 },
 calendar: {
 width: '100%',
 height: 390,
 },
 calendarText: {
 fontSize: 14,
 color: theme.colors.background,
 },
 dateContainer: {
 marginTop: 20,
 alignItems: "flex-start",
 },
 dateText: {
 fontSize: 18,
 color: theme.colors.ivory,
 textAlign: 'left',
 paddingLeft: 5,
 },
 timeButton: {
 marginTop: 20,
 paddingVertical: 12,
 paddingHorizontal: 30,
 backgroundColor: theme.colors.sageGreen,
 borderRadius: 5,
 },
 timeButtonText: {
 color: "white",
 fontSize: 16,
 fontWeight: "bold",
 textAlign: 'center',
 },
 tabNavigatorPlaceholder: {
 height: 60,
 backgroundColor: theme.colors.sageGreen,
 justifyContent: 'center',
 alignItems: 'center',
 },
 tabNavigatorText: {
 color: "white",
 fontSize: 16,
 fontWeight: "bold",
 },
 input: {
 width: "100%",
 height: 30,
 padding: 15,
 borderWidth: 1,
 borderColor: theme.colors.sageGreen,
 borderRadius: 7,
 backgroundColor: theme.colors.pearlWhite,
 },
 locationInputContainer: {
 width: '100%',
 backgroundColor:theme.colors.pearlWhite
 },
 mapOverlay: {
 position: "absolute",
 top: 0,
 bottom: 40,
 left: 0,
 right: 0,
 },
 backButtonWrapper: {
 position: 'absolute',
 top: 5,
 left: 0,
 zIndex: 10,
 },
 buttonRow: {
 flexDirection: 'row',
 justifyContent: 'space-between',
 width: '90%',
 marginBottom: 15,
 },
 rowButton: {
 flex: 0.48,
 },
 button: {
 marginBottom: 10,
 },
 validateButton: {
 borderColor: theme.colors.sageGreen,
 },
 useAddressButton: {
 borderColor: theme.colors.sageGreen,
 },
 saveButtonContainer: {
 width: '90%',
 alignItems: 'center',
 marginTop: 20,
 bottom: 20,
 marginBottom: 40,
 },
 saveButton: {
 width: '100%',
 backgroundColor: theme.colors.sageGreen,
 paddingVertical: 12,
 borderRadius: 8,
 shadowColor: "#000",
 shadowOffset: {
 width: 0,
 height: 2,
 },
 shadowOpacity: 0.25,
 shadowRadius: 3.84,
 elevation: 5,
 },
 mapButtons: {
 position: 'absolute',
 bottom: 400,
 left: 0,
 right: 0,
 flexDirection: 'row',
 justifyContent: 'space-around',
 padding: 10,
 },
 itemDetailsContainer: {},
 sectionTitle: {
 fontSize: 18,
 fontWeight: '600',
 color: theme.colors.ivory,
 marginTop: 15,
 marginBottom: 10,
 },
 claimerAddressContainer: {},
 addressText: {
 fontSize: 16,
 color: theme.colors.ivory,
 marginBottom: 10,
 },
 loadingText: {
 fontSize: 18,
 color: theme.colors.ivory,
 textAlign: 'center',
 marginTop: 50,
 },
 errorText: {
 fontSize: 18,
 color: '#ff6b6b',
 textAlign: 'center',
 marginTop: 50,
 },
 itemTitle: {
 fontSize: 20,
 fontWeight: '600',
 color: theme.colors.ivory,
 marginBottom: 8,
 },
 itemDescription: {
 fontSize: 16,
 color: theme.colors.ivory,
 marginBottom: 8,
 },
 itemQuantity: {
 fontSize: 16,
 color: theme.colors.ivory,
 fontWeight: '500',
 },
 // Modal styles
 modalContainer: {
 flex: 1,
 backgroundColor: theme.colors.pearlWhite,
 },
 modalHeader: {
 flexDirection: 'row',
 justifyContent: 'space-between',
 alignItems: 'center',
 padding: 15,
 borderBottomWidth: 1,
 borderBottomColor: theme.colors.sageGreen,
 backgroundColor: theme.colors.sageGreen,
 },
 modalTitle: {
 fontSize: 18,
 fontWeight: 'bold',
 color: theme.colors.ivory,
 },
 closeButton: {
 padding: 8,
 },
 closeButtonText: {
 color: theme.colors.ivory,
 fontSize: 16,
 },
 // Autocomplete styles
 autocompleteContainer: {
 flex: 1,
 width: '100%',
 paddingHorizontal: 15,
 },
 autocompleteInput: {
 height: 50,
 fontSize: 16,
 backgroundColor: theme.colors.pearlWhite,
 borderWidth: 1,
 borderColor: theme.colors.sageGreen,
 borderRadius: 5,
 marginTop: 10,
 paddingHorizontal: 10,
 },
 autocompleteList: {
 backgroundColor: theme.colors.pearlWhite,
 borderWidth: 1,
 borderColor: theme.colors.sageGreen,
 borderRadius: 5,
 marginTop: 5,
 },
 autocompleteRow: {
 padding: 15,
 borderBottomWidth: 1,
 borderBottomColor: '#eee',
 },
 autocompleteDescription: {
 fontSize: 16,
 color: '#333',
 },
 errorIndicator: {
 color: '#ff3333',
 fontSize: 18,
 fontWeight: 'bold',
 marginLeft: 5,
 },
 errorBorder: {
 borderColor: '#ff3333',
 borderWidth: 2,
 },
 validationErrorText: {
 color: '#ff3333',
 fontSize: 14,
 marginTop: 5,
 marginBottom: 10,
 alignSelf: 'flex-start',
 marginLeft: '5%',
 },
});