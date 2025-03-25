"use client"
import firestore from "@react-native-firebase/firestore"
import { useState, useContext, useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal, Alert } from "react-native"
import { Formik } from "formik"
import { Picker } from "@react-native-picker/picker"
import { theme } from "../core/theme"
import ImagePickerComponent from "../components/ImagePickerComponent"
import { validateAge } from "../helpers/ageValidator"
import { addressValidator } from "../helpers/addressValidator"
import { AuthContext } from "../context/AuthContext"
import { UserProfileContext } from "../context/UserProfileContext"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import axios from 'axios'

// You would replace this with your actual API key
const GOOGLE_API_KEY = "AIzaSyB9irjntPHdEJf024h7H_XKpS11OeW1Nh8";

const RecipientProfileForm = ({ navigation }) => {
  const [khairPoints] = useState({value:100});
  
  const { user } = useContext(AuthContext)
  const [image, setImage] = useState(null)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [currentField, setCurrentField] = useState(null)
  const googlePlacesRef = useRef(null)
  const [addressCoordinates, setAddressCoordinates] = useState(null)

  const genderOptions = ["Male", "Female", "Other"]
  const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"]
  const occupationStatusOptions = ["Student", "Employed", "Unemployed"]
  const educationalStatusOptions = ["College", "University", "Special Education"]
  const clothingSizes = ["S", "M", "L", "XL", "XXL"]
  const shirtSizes = ["36", "38", "40", "42", "44", "46", "48"]
  const shoeSizes = ["34", "36", "38", "40", "42", "44", "46"]
  const trouserSizes = ["28", "30", "32", "34", "36", "38", "40", "42"]
  const gradeOption = ["Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]
  const uniYearOption = ["1st", "2nd", "3rd", "4th"]
  const collegeYearOption = ["1st Year", "2nd Year"]

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
    console.log("HFEE")
    const errors = {}
  
    // Age validation
    const ageError = validateAge(values.age)
    if (ageError) errors.age = ageError
  
    if (!values.age) errors.age = "Age is required"
    if (isNaN(values.age)) errors.age = "Age must be a number"
    if (values.age < 18) errors.age = "Age must be greater than 18"
    if (!values.gender) errors.gender = "Gender is required"
    if (!values.maritalStatus) errors.maritalStatus = "Marital status is required"
    if (values.maritalStatus == "Married" || values.maritalStatus == "Widowed" || values.maritalStatus == "Divorced") {
      if (!values.children) errors.children = "Number of children is required"
      if (isNaN(values.children)) errors.children = "Number of children must be a number"
      if (values.children < 0) errors.children = "Number of children can not be negative"
      if (Number(values.children) !== Number.parseInt(values.children))
        errors.children = "Number of children must be a whole number"
      if (Number.parseInt(values.children) > Number.parseInt(values.membersCount)) {
        errors.children = "Number of children can not exceed number of family members"
      }
    }
    if (!values.occupation || values.occupation === "notsel") {
      errors.occupation = "Occupation is required"
    }
    if (values.occupation === "Employed") {
      if (!values.income) errors.income = "Income is required"
      if (values.income.trim() === "") {
        errors.income = "Income cannot contain only spaces."
      }
      if (isNaN(values.income)) errors.income = "Income must be a number"
      if (values.income < 0) {
        errors.income = "Income can not be negative"
      }
    }
  
    // Address validation
    if (!values.address) errors.address = "Address is required"
    if (!addressCoordinates && values.address) {
      errors.address = "Please select a valid address from the suggestions"
    }
  
    // Only validate education-related fields if occupation is "Student"
    if (values.occupation === "Student") {
      if (!values.educationLevel) errors.educationLevel = "Education level is required"
      if (!values.institution) errors.institution = "Institution is required"
      if (!values.class) errors.class = "Class/Year is required"
    }
  
    if (!values.shoeSize) errors.shoeSize = "Shoe size is required"
    if (!values.clothingSize) errors.clothingSize = "Clothing size is required"
    if (!values.shirtSize) errors.shirtSize = "Shirt size is required"
    if (!values.trouserSize) errors.trouserSize = "Trouser size is required"
  
    if (!values.membersCount && values.membersCount !== 0) errors.membersCount = "Number of family members is required"
    if (isNaN(values.membersCount)) errors.membersCount = "Number of family members must be a number"
    if (values.membersCount < 0) errors.membersCount = "Number of family members cannot be negative"
    if (Number(values.membersCount) !== Number.parseInt(values.membersCount))
      errors.membersCount = "Number of family members must be a whole number"
    if (values.membersCount > 10) errors.membersCount = "Number of family members should be less than 10"
  
    console.log(errors)
  
    return errors
  }
  
  const onSubmit = async (values, { setSubmitting }) => {
    console.log("Form submitted with values:", values)
    console.log(values)
    
    if (Number.parseInt(values.children) > 0) {
      navigation.navigate("ChildrenProfiles", { ParentValues: values })
    } else {
      setSubmitting(false)
      try {
        await firestore()
          .collection("individual_profiles")
          .doc(user.uid)
          .set({
            age: Number.parseInt(values.age), // Convert to integer
            gender: values.gender,
            maritalStatus: values.maritalStatus,
            children: Number.parseInt(values.children) || 0, // Convert to integer, default to 0
            occupation: values.occupation,
            income: Number.parseFloat(values.income) || 0, // Convert to decimal
            educationLevel: values.educationLevel,
            institution: values.institution,
            class: values.class,
            shoeSize: values.shoeSize,
            clothingSize: values.clothingSize,
            shirtSize: values.shirtSize,
            trouserSize: values.trouserSize,
            address: values.address,
            addressCoordinates: addressCoordinates, // Add coordinates
            profileImage: values.profileImage || "", // Ensure string (or default empty)
            createdAt: firestore.FieldValue.serverTimestamp(), // Timestamp for when the profile is created
            membersCount: Number.parseInt(values.membersCount) || 0, // Convert to integer, default to 0
            khairPoints: khairPoints.value,
            lastPointsReassignmentDate: firestore.FieldValue.serverTimestamp(),
          })
      } catch (error) {
        console.log("Error saving details", error)
      }

      navigation.navigate("WaitForApprovalScreen")
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
          <Text style={styles.modalTitle}>Search Location</Text>
          <TouchableOpacity onPress={() => setShowLocationModal(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

        <GooglePlacesAutocomplete
          ref={googlePlacesRef}
          placeholder="Enter your address"
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

  const [selectedOption, setSelectedOption] = useState("option1")
  const [inputValue, setInputValue] = useState("")

  return (
    <View style={[styles.container, { marginBottom: 20 }]}>
      <ScrollView>
        <Text style={styles.title}>Recipient Profile</Text>
        <View style={styles.line} />

        <Formik
          initialValues={{
            age: "",
            gender: "",
            maritalStatus: "",
            children: "",
            occupation: "",
            income: "",
            educationLevel: "",
            institution: "",
            class: "",
            shoeSize: "",
            clothingSize: "",
            shirtSize: "",
            trouserSize: "",
            address: "",
            membersCount: "",
          }}
          validate={validate}
          onSubmit={onSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <>
              {/* Age Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("age")}
                  onBlur={handleBlur("age")}
                  value={values.age}
                  placeholder="Enter your age"
                  placeholderTextColor={theme.colors.ivory}
                  keyboardType="numeric"
                />
                {errors.age && touched.age && <Text style={styles.errorText}>{errors.age}</Text>}
              </View>

              {/* Gender Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.radioContainer}>
                  {genderOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.radioOption}
                      onPress={() => setFieldValue("gender", option)}
                    >
                      <View style={[styles.radioCircle, values.gender === option && styles.radioSelected]} />
                      <Text style={styles.radioLabel}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.gender && touched.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
              </View>

              {/* Address Input with Location Search */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Address</Text>
                <View style={styles.addressContainer}>
                  <TextInput
                    style={[
                      styles.addressInput,
                      errors.address && touched.address && styles.errorBorder
                    ]}
                    value={values.address}
                    placeholder="Search your address"
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

              {/* Number of Family Members Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Number of Family Members</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("membersCount")}
                  onBlur={handleBlur("membersCount")}
                  value={values.membersCount.toString()}
                  placeholder="Enter number of family members"
                  placeholderTextColor={theme.colors.ivory}
                  keyboardType="numeric"
                />
                {errors.membersCount && touched.membersCount && (
                  <Text style={styles.errorText}>{errors.membersCount}</Text>
                )}
              </View>

              {/* Marital Status Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Marital Status</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.maritalStatus}
                    onValueChange={(itemValue) => setFieldValue("maritalStatus", itemValue)}
                    style={styles.picker1}
                  >
                    <Picker.Item label="Select marital status" value="" />
                    {maritalStatusOptions.map((status) => (
                      <Picker.Item key={status} label={status} value={status} />
                    ))}
                  </Picker>
                </View>
                {errors.maritalStatus && touched.maritalStatus && (
                  <Text style={styles.errorText}>{errors.maritalStatus}</Text>
                )}
              </View>

              {/* Children Input (Conditional) */}
              {(values.maritalStatus === "Married" ||
                values.maritalStatus === "Divorced" ||
                values.maritalStatus === "Widowed") && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Number of Children *under 18*</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("children")}
                    onBlur={handleBlur("children")}
                    value={values.children}
                    placeholder="Enter number of children"
                    placeholderTextColor={theme.colors.ivory}
                    keyboardType="numeric"
                  />
                  {errors.children && touched.children && <Text style={styles.errorText}>{errors.children}</Text>}
                </View>
              )}

              {/* occupation Status Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Occupation</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.occupation}
                    onValueChange={(itemValue) => setFieldValue("occupation", itemValue)}
                    style={styles.picker1}
                  >
                    <Picker.Item label="Select Occupation status" value="" />
                    {occupationStatusOptions.map((status) => (
                      <Picker.Item key={status} label={status} value={status} />
                    ))}
                  </Picker>
                </View>
                {errors.occupation && touched.occupation && <Text style={styles.errorText}>{errors.occupation}</Text>}
              </View>

              {/* Income Input */}
              {values.occupation === "Employed" && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Monthly Income</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("income")}
                    onBlur={handleBlur("income")}
                    value={values.income}
                    placeholder="Enter your monthly income"
                    placeholderTextColor={theme.colors.ivory}
                    keyboardType="numeric"
                  />
                  {errors.income && touched.income && <Text style={styles.errorText}>{errors.income}</Text>}
                </View>
              )}

              {/* Student-specific fields (Conditional) */}
              {values.occupation === "Student" && (
                <>
                  {/* Educational level Status Selection */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Educationl Level</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={values.educationLevel}
                        onValueChange={(itemValue) => setFieldValue("educationLevel", itemValue)}
                        style={styles.picker1}
                      >
                        <Picker.Item label="Select Educational Level" value="" />
                        {educationalStatusOptions.map((status) => (
                          <Picker.Item key={status} label={status} value={status} />
                        ))}
                      </Picker>
                    </View>
                    {errors.educationLevel && touched.educationLevel && (
                      <Text style={styles.errorText}>{errors.educationLevel}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Institution Name</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("institution")}
                      onBlur={handleBlur("institution")}
                      value={values.institution}
                      placeholder="Enter institution name"
                      placeholderTextColor={theme.colors.ivory}
                    />
                    {errors.institution && touched.institution && (
                      <Text style={styles.errorText}>{errors.institution}</Text>
                    )}
                  </View>

                  {(values.educationLevel === "College" || values.educationLevel === "University" || values.educationLevel==="Special Education") && (
                    <>
                      {/* Year of Study */}
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Year Of Study</Text>
                        <View style={styles.pickerContainer}>
                          {values.educationLevel === "College" && (
                            <>
                              <Picker
                                selectedValue={values.educationLevel}
                                onValueChange={(itemValue) => setFieldValue("class", itemValue)}
                                style={styles.picker1}
                              >
                                <Picker.Item label="Select Year of Study" value="" />
                                {collegeYearOption.map((status) => (
                                  <Picker.Item key={status} label={status} value={status} />
                                ))}
                              </Picker>
                            </>
                          )}
                          {values.educationLevel === "University" && (
                            <>
                              <Picker
                                selectedValue={values.educationLevel}
                                onValueChange={(itemValue) => setFieldValue("class", itemValue)}
                                style={styles.picker1}
                              >
                                <Picker.Item label="Select Year of Study" value="" />
                                {uniYearOption.map((status) => (
                                  <Picker.Item key={status} label={status} value={status} />
                                ))}
                              </Picker>
                            </>
                          )}

                          {values.educationLevel === "Special Education" && (
                            <>
                              <Picker
                                selectedValue={values.educationLevel}
                                onValueChange={(itemValue) => setFieldValue("class", itemValue)}
                                style={styles.picker1}
                              >
                                <Picker.Item label="Special Education" value="Special Education" />
                              </Picker>
                            </>
                          )}
                        </View>
                        {errors.class && touched.class && <Text style={styles.errorText}>{errors.class}</Text>}
                      </View>
                    </>
                  )}
                </>
              )}

              {/* Shoe Size Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Shoe Size</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.shoeSize}
                    onValueChange={(itemValue) => setFieldValue("shoeSize", itemValue)}
                    style={styles.picker1}
                  >
                    <Picker.Item label="Select shoe size" value="" />
                    {shoeSizes.map((size) => (
                      <Picker.Item key={size} label={size} value={size} />
                    ))}
                  </Picker>
                </View>
                {errors.shoeSize && touched.shoeSize && <Text style={styles.errorText}>{errors.shoeSize}</Text>}
              </View>

              {/* Clothing Size Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Clothing Size</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.clothingSize}
                    onValueChange={(itemValue) => setFieldValue("clothingSize", itemValue)}
                    style={styles.picker1}
                  >
                    <Picker.Item label="Select clothing size" value="" />
                    {clothingSizes.map((size) => (
                      <Picker.Item key={size} label={size} value={size} />
                    ))}
                  </Picker>
                </View>
                {errors.clothingSize && touched.clothingSize && (
                  <Text style={styles.errorText}>{errors.clothingSize}</Text>
                )}
              </View>

              {/* Shirt Size Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Shirt Size</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.shirtSize}
                    onValueChange={(itemValue) => setFieldValue("shirtSize", itemValue)}
                    style={styles.picker1}
                  >
                    <Picker.Item label="Select shirt size" value="" />
                    {shirtSizes.map((size) => (
                      <Picker.Item key={size} label={size} value={size} />
                    ))}
                  </Picker>
                </View>
                {errors.shirtSize && touched.shirtSize && <Text style={styles.errorText}>{errors.shirtSize}</Text>}
              </View>

              {/* Trouser Size Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Trouser Size</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.trouserSize}
                    onValueChange={(itemValue) => setFieldValue("trouserSize", itemValue)}
                    style={styles.picker1}
                  >
                    <Picker.Item label="Select trouser size" value="" />
                    {trouserSizes.map((size) => (
                      <Picker.Item key={size} label={size} value={size} />
                    ))}
                  </Picker>
                </View>
                {errors.trouserSize && touched.trouserSize && (
                  <Text style={styles.errorText}>{errors.trouserSize}</Text>
                )}
              </View>

              {/* Profile Picture Upload */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Profile Picture</Text>
                <ImagePickerComponent
                  maxImages={1}
                  selectedImages={image ? [image] : []}
                  onImagesChange={(images) => setImage(images[0])}
                />
                {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={() => {
                  console.log("Submit button pressed")
                  handleSubmit()
                }}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Save Profile</Text>
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
    height: 80,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.colors.ivory,
    paddingHorizontal: 15,
    paddingTop: 10,
    color: theme.colors.ivory,
    fontSize: 16,
    textAlignVertical: "top",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.sageGreen,
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: theme.colors.sageGreen,
  },
  radioLabel: {
    color: theme.colors.ivory,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.ivory,
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: {
    height: 40,
    color: theme.colors.ivory,
    backgroundColor: theme.colors.TaupeBlack,
  },
  picker1: {
    height: 50,
    color: theme.colors.ivory,
    backgroundColor: theme.colors.TaupeBlack,
  },
  submitButton: {
    backgroundColor: theme.colors.sageGreen,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
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
  // New styles for address autocomplete
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

export default RecipientProfileForm