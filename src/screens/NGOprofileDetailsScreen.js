"use client"
import { useState, useRef ,useContext} from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal } from "react-native"
import { Formik } from "formik"
import { theme } from "../core/theme"
import ImagePickerComponent from "../components/ImagePickerComponent"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import { AuthContext } from "../context/AuthContext"
import firestore from "@react-native-firebase/firestore"


// You would replace this with your actual API key
const GOOGLE_API_KEY = "AIzaSyB9irjntPHdEJf024h7H_XKpS11OeW1Nh8";

const NGOProfileDetailsScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext)
  
  const [image, setImage] = useState(null)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [currentField, setCurrentField] = useState(null)
  const googlePlacesRef = useRef(null)
    const [khairPoints] = useState({value:100});
  

  const validate = (values) => {
    const errors = {}

    // NGO Name validation
    if (!values.ngoName) {
      errors.ngoName = "NGO name is required"
    }

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
      errors.membersCount = "Number of recipients should be less than 100"
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

    // Here you would typically save the NGO profile to your database
    // For example:
    console.log(user.uid)
    
    try {
      await firestore()
        .collection("ngo_profiles")
        .doc(user.uid)
        .set({
          ngoName: values.ngoName,
          address: values.address,
          membersCount: parseInt(values.membersCount),
          contactPerson: values.contactPerson,
          phone: values.phone,
          email: values.email,
          description: values.description,
          profileImage: image ? image.uri : "",
          createdAt: firestore.FieldValue.serverTimestamp(),
          khairPoints: (khairPoints.value * parseInt(values.membersCount)),
          lastPointsReassignmentDate:firestore.FieldValue.serverTimestamp(),
        });
        navigation.navigate("WaitForApprovalScreen")

    } catch (error) {
      console.log("Error saving NGO details", error);
    }
    

    // For demo purposes, just navigate
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
              const location = details.geometry.location
              currentField.setFieldValue("address", details.formatted_address)
              setShowLocationModal(false)
            }
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
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
              {/* NGO Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>NGO Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("ngoName")}
                  onBlur={handleBlur("ngoName")}
                  value={values.ngoName}
                  placeholder="Enter NGO name"
                  placeholderTextColor={theme.colors.ivory}
                />
                {errors.ngoName && touched.ngoName && <Text style={styles.errorText}>{errors.ngoName}</Text>}
              </View>

              {/* Address Input with Location Search */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>NGO Address</Text>
                <View style={styles.addressContainer}>
                  <TextInput
                    style={styles.addressInput}
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
              </View>

              {/* Number of Recipients Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Number of Recipients</Text>
                <TextInput
                  style={styles.input}
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
                  maxLength={3} // Limit to 3 digits (max 100)
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
                  console.log("Submit butefwefton pressed")
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
  // Google Places Autocomplete styles
  autocompleteContainer: {
    flex: 1,
    position: "relative",
    zIndex: 1,
  },
  autocompleteInput: {
    backgroundColor: theme.colors.TaupeBlack,
    color: theme.colors.ivory,
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.ivory,
    borderRadius: 10,
    fontSize: 16,
    paddingHorizontal: 15,
  },
  autocompleteList: {
    backgroundColor: theme.colors.TaupeBlack,
    borderWidth: 1,
    borderColor: theme.colors.ivory,
    borderRadius: 10,
    marginTop: 5,
  },
  autocompleteRow: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ivory,
  },
  autocompleteDescription: {
    color: theme.colors.ivory,
    fontSize: 14,
  },
})

export default NGOProfileDetailsScreen;
