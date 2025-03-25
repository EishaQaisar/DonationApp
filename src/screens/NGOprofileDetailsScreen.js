"use client"
import { useState, useRef, useContext } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal, Alert } from "react-native"
import { Formik } from "formik"
import { theme } from "../core/theme"
import ImagePickerComponent from "../components/ImagePickerComponent"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import { AuthContext } from "../context/AuthContext"
import firestore from "@react-native-firebase/firestore"
import axios from 'axios'

// You would replace this with your actual API key
const GOOGLE_API_KEY = "AIzaSyB9irjntPHdEJf024h7H_XKpS11OeW1Nh8";

const NGOProfileDetailsScreen = ({ navigation }) => {
 const { user } = useContext(AuthContext)
 
 const [image, setImage] = useState(null)
 const [showLocationModal, setShowLocationModal] = useState(false)
 const [currentField, setCurrentField] = useState(null)
 const googlePlacesRef = useRef(null)
 const [khairPoints] = useState({value:100})
 const [addressCoordinates, setAddressCoordinates] = useState(null)

 // Validate address and get coordinates using Google Maps API
 const validateAndGetCoordinates = async (address) => {
 if (!address) return null;

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
 console.log("Formatted address:", formattedAddress);
 console.log("Coordinates:", coordinates);

 setAddressCoordinates(coordinates);
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

 const validate = (values) => {
 const errors = {}

 // Address validation
 if (!values.address) {
 errors.address = "Address is required"
 }

 // Number of recipients validation
 if (!values.membersCount && values.membersCount !== 0) {
 errors.membersCount = "Number of recipients is required"
 } else if (isNaN(values.membersCount)) {
 errors.membersCount = "Number of recipients must be a number"
 } else if (values.membersCount < 0) {
 errors.membersCount = "Number of recipients cannot be negative"
 } else if (values.membersCount > 500) {
 errors.membersCount = "Number of recipients should be less than 500"
 } else if (!Number.isInteger(Number(values.membersCount))) {
 errors.membersCount = "Number of recipients must be a whole number"
 } else if (!/^\d+$/.test(values.membersCount)) {
 errors.membersCount = "Number of recipients must contain only digits"
 }

 return errors
 }

 const onSubmit = async (values, { setSubmitting }) => {
 console.log("Form submitted with values:", values)
 setSubmitting(false)

 if (!addressCoordinates) {
 Alert.alert('Address Error', 'Please select a valid address from the suggestions');
 return;
 }

 // Here you would typically save the NGO profile to your database
 console.log(user.uid)
 
 try {
 await firestore()
 .collection("ngo_profiles")
 .doc(user.uid)
 .set({
 address: values.address,
 addressCoordinates: addressCoordinates,
 membersCount: parseInt(values.membersCount),
 contactPerson: values.contactPerson,
 phone: values.phone,
 email: values.email,
 description: values.description,
 profileImage: image ? image.uri : "",
 createdAt: firestore.FieldValue.serverTimestamp(),
 khairPoints: (khairPoints.value * parseInt(values.membersCount)),
 lastPointsReassignmentDate: firestore.FieldValue.serverTimestamp(),
 });
 navigation.navigate("WaitForApprovalScreen")
 } catch (error) {
 console.log("Error saving NGO details", error);
 Alert.alert('Error', 'Failed to save NGO profile details');
 }
 }

 // Location search modal component
 const LocationSearchModal = () => (
 <Modal
 visible={showLocationModal}
 animationType="slide"
 transparent={false}
 onRequestClose={() => setShowLocationModal(false)}
 >
 <View style={styles.modalContainer}>
 <View style={styles.modalHeader}>
 <Text style={styles.modalTitle}>Search NGO Location</Text>
 <TouchableOpacity onPress={() => setShowLocationModal(false)} style={styles.closeButton}>
 <Text style={styles.closeButtonText}>Close</Text>
 </TouchableOpacity>
 </View>

 <GooglePlacesAutocomplete
 ref={googlePlacesRef}
 placeholder="Enter NGO Location"
 minLength={2}
 fetchDetails={true}
 onPress={(data, details = null) => {
 if (details && currentField) {
 const location = details.geometry.location;
 currentField.setFieldValue("address", details.formatted_address);
 setAddressCoordinates({
 latitude: location.lat,
 longitude: location.lng
 });
 setShowLocationModal(false);
 }
 }}
 query={{
 key: GOOGLE_API_KEY,
 language: "en",
 }}
 styles={{
 container: {
 flex: 1,
 zIndex: 1,
 },
 textInputContainer: {
 backgroundColor: theme.colors.TaupeBlack,
 borderTopWidth: 0,
 borderBottomWidth: 0,
 },
 textInput: {
 backgroundColor: theme.colors.TaupeBlack,
 color: theme.colors.ivory,
 height: 50,
 borderWidth: 1,
 borderRadius: 10,
 borderColor: theme.colors.ivory,
 fontSize: 16,
 marginLeft: 0,
 marginRight: 0,
 },
 listView: {
 backgroundColor: theme.colors.TaupeBlack,
 borderWidth: 1,
 borderColor: theme.colors.ivory,
 borderRadius: 5,
 marginTop: 5,
 },
 row: {
 backgroundColor: theme.colors.TaupeBlack,
 padding: 13,
 height: 'auto',
 flexDirection: 'row',
 borderBottomWidth: 1,
 borderColor: theme.colors.ivory,
 },
 separator: {
 height: 1,
 backgroundColor: theme.colors.ivory,
 },
 description: {
 color: theme.colors.ivory,
 fontSize: 14,
 },
 predefinedPlacesDescription: {
 color: theme.colors.ivory,
 },
 poweredContainer: {
 backgroundColor: theme.colors.TaupeBlack,
 borderBottomLeftRadius: 5,
 borderBottomRightRadius: 5,
 borderColor: theme.colors.ivory,
 borderTopWidth: 0.5,
 },
 powered: {
 tintColor: theme.colors.ivory,
 },
 }}
 enablePoweredByContainer={false}
 keyboardShouldPersistTaps="handled"
 listViewDisplayed={true}
 debounce={300}
 />
 </View>
 </Modal>
 )

 return (
 <View style={styles.container}>
 <ScrollView>
 <Text style={styles.title}>NGO Profile</Text>
 <View style={styles.line} />

 <Formik
 initialValues={{
 ngoName: "",
 address: "",
 membersCount: "",
 contactPerson: "",
 phone: "",
 email: "",
 description: "",
 }}
 validate={validate}
 onSubmit={onSubmit}
 >
 {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
 <>
 {/* Address Input with Location Search */}
 <View style={styles.inputContainer}>
 <Text style={styles.label}>NGO Address</Text>
 <View style={styles.addressContainer}>
 <TextInput
 style={[
 styles.addressInput,
 errors.address && touched.address && styles.errorBorder
 ]}
 value={values.address}
 placeholder="Search NGO address"
 placeholderTextColor={theme.colors.ivory}
 editable={false}
 />
 <TouchableOpacity
 style={styles.searchButton}
 onPress={() => {
 setCurrentField({ setFieldValue })
 setShowLocationModal(true)
 }}
 >
 <Text style={styles.searchButtonText}>Search</Text>
 </TouchableOpacity>
 </View>
 {errors.address && touched.address && <Text style={styles.errorText}>{errors.address}</Text>}
 {addressCoordinates && (
 <Text style={styles.coordinatesText}>
 Address validated ✓
 </Text>
 )}
 </View>

 {/* Number of Recipients Input */}
 <View style={styles.inputContainer}>
 <Text style={styles.label}>Number of Recipients</Text>
 <TextInput
 style={[
 styles.input,
 errors.membersCount && touched.membersCount && styles.errorBorder
 ]}
 onChangeText={(text) => {
 // Only allow digits
 if (/^\d*$/.test(text)) {
 setFieldValue("membersCount", text)
 }
 }}
 onBlur={handleBlur("membersCount")}
 value={values.membersCount}
 placeholder="Enter number of recipients (max 500)"
 placeholderTextColor={theme.colors.ivory}
 keyboardType="numeric"
 maxLength={3} // Limit to 3 digits (max 500)
 />
 {errors.membersCount && touched.membersCount && (
 <Text style={styles.errorText}>{errors.membersCount}</Text>
 )}
 </View>

 {/* Description Input */}
 <View style={styles.inputContainer}>
 <Text style={styles.label}>NGO Description</Text>
 <TextInput
 style={styles.textArea}
 onChangeText={handleChange("description")}
 onBlur={handleBlur("description")}
 value={values.description}
 placeholder="Enter a brief description of your NGO"
 placeholderTextColor={theme.colors.ivory}
 multiline
 numberOfLines={4}
 />
 </View>

 {/* Submit Button */}
 <TouchableOpacity
 onPress={() => {
 console.log("Submit button pressed")
 handleSubmit()
 }}
 style={styles.submitButton}
 >
 <Text style={styles.submitButtonText}>Save NGO Profile</Text>
 </TouchableOpacity>
 </>
 )}
 </Formik>
 </ScrollView>

 {/* Location Search Modal */}
 <LocationSearchModal />
 </View>
 )
}

const styles = StyleSheet.create({
 container: {
 backgroundColor: theme.colors.charcoalBlack,
 flex: 1,
 padding: 20,
 paddingTop: 40,
 },
 title: {
 fontSize: 24,
 fontWeight: "bold",
 color: theme.colors.ivory,
 textAlign: "center",
 marginBottom: 20,
 },
 line: {
 borderBottomWidth: 1,
 borderColor: theme.colors.sageGreen,
 marginVertical: 20,
 },
 inputContainer: {
 marginBottom: 20,
 },
 label: {
 fontSize: 16,
 fontWeight: "bold",
 color: theme.colors.ivory,
 marginBottom: 5,
 },
 input: {
 backgroundColor: theme.colors.TaupeBlack,
 height: 40,
 borderWidth: 1,
 borderRadius: 10,
 borderColor: theme.colors.ivory,
 paddingHorizontal: 15,
 color: theme.colors.ivory,
 fontSize: 16,
 },
 textArea: {
 backgroundColor: theme.colors.TaupeBlack,
 height: 100,
 borderWidth: 1,
 borderRadius: 10,
 borderColor: theme.colors.ivory,
 paddingHorizontal: 15,
 paddingTop: 10,
 color: theme.colors.ivory,
 fontSize: 16,
 textAlignVertical: "top",
 },
 addressContainer: {
 flexDirection: "row",
 alignItems: "center",
 },
 addressInput: {
 backgroundColor: theme.colors.TaupeBlack,
 height: 40,
 borderWidth: 1,
 borderRadius: 10,
 borderColor: theme.colors.ivory,
 paddingHorizontal: 15,
 color: theme.colors.ivory,
 fontSize: 16,
 flex: 1,
 },
 searchButton: {
 backgroundColor: theme.colors.sageGreen,
 height: 40,
 justifyContent: "center",
 alignItems: "center",
 borderRadius: 10,
 marginLeft: 10,
 paddingHorizontal: 15,
 },
 searchButtonText: {
 color: theme.colors.ivory,
 fontWeight: "bold",
 },
 submitButton: {
 backgroundColor: theme.colors.sageGreen,
 padding: 15,
 borderRadius: 10,
 alignItems: "center",
 marginTop: 20,
 marginBottom: 40,
 },
 submitButtonText: {
 color: theme.colors.ivory,
 fontWeight: "bold",
 fontSize: 18,
 },
 errorText: {
 color: "red",
 fontSize: 12,
 marginTop: 5,
 },
 errorBorder: {
 borderColor: "red",
 },
 coordinatesText: {
 color: theme.colors.sageGreen,
 fontSize: 12,
 marginTop: 5,
 },
 // Modal styles
 modalContainer: {
 flex: 1,
 backgroundColor: theme.colors.charcoalBlack,
 padding: 20,
 },
 modalHeader: {
 flexDirection: "row",
 justifyContent: "space-between",
 alignItems: "center",
 marginBottom: 20,
 },
 modalTitle: {
 fontSize: 20,
 fontWeight: "bold",
 color: theme.colors.ivory,
 },
 closeButton: {
 padding: 10,
 },
 closeButtonText: {
 color: theme.colors.sageGreen,
 fontWeight: "bold",
 },
})

export default NGOProfileDetailsScreen;