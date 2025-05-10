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
import i18n, { t } from "../i18n"

// You would replace this with your actual API key
const GOOGLE_API_KEY = "";


const RecipientProfileForm = ({ navigation }) => {
  const [khairPoints] = useState({value:100});
  
  const { user } = useContext(AuthContext)
  const [image, setImage] = useState(null)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [currentField, setCurrentField] = useState(null)
  const googlePlacesRef = useRef(null)
  const [addressCoordinates, setAddressCoordinates] = useState(null)
  
  // Add city selection state
  const [selectedCity, setSelectedCity] = useState("")
  const [cityError, setCityError] = useState("")
  const [showCityModal, setShowCityModal] = useState(false)
  
  // Define the cities with their translations
  const cities = [
    { value: "Karachi", label: i18n.locale === "ur" ? t("options.cities.karachi") : "Karachi" },
    { value: "Lahore", label: i18n.locale === "ur" ? t("options.cities.lahore") : "Lahore" },
    { value: "Islamabad", label: i18n.locale === "ur" ? t("options.cities.islamabad") : "Islamabad" }
  ]

  // Define options with their translations
  const genderOptions = [
    { value: "Male", label: i18n.locale === "ur"  ? t("options.gender.male") : "Male" },
    { value: "Female", label: i18n.locale === "ur" ? t("options.gender.female") : "Female" },
    { value: "Other", label: i18n.locale === "ur" ? t("options.gender.other") : "Other" }
  ]
  
  const maritalStatusOptions = [
    { value: "Single", label: i18n.locale === "ur" ? t("options.marital_status.single") : "Single" },
    { value: "Married", label: i18n.locale === "ur" ? t("options.marital_status.married") : "Married" },
    { value: "Divorced", label: i18n.locale === "ur"  ? t("options.marital_status.divorced") : "Divorced" },
    { value: "Widowed", label: i18n.locale === "ur"  ? t("options.marital_status.widowed") : "Widowed" }
  ]
  
  const occupationStatusOptions = [
    { value: "Student", label: i18n.locale === "ur" ? t("options.occupation.student") : "Student" },
    { value: "Employed", label: i18n.locale === "ur"  ? t("options.occupation.employed") : "Employed" },
    { value: "Unemployed", label: i18n.locale === "ur"  ? t("options.occupation.unemployed") : "Unemployed" }
  ]
  
  const educationalStatusOptions = [
    { value: "School", label: i18n.locale === "ur"  ? t("options.education.school") : "Schorgrgol" },
    { value: "College", label: i18n.locale === "ur" ? t("options.education.college") : "College" },
    { value: "University", label: i18n.locale === "ur" ? t("options.education.university") : "University" },
    { value: "Special Education", label: i18n.locale === "ur"  ? t("options.education.special") : "Special Education" }
  ]
  
  const clothingSizes = [
    { value: "S", label: i18n.locale === "ur"  ? t("options.clothing_sizes.S") : "S" },
    { value: "M", label: i18n.locale === "ur" ? t("options.clothing_sizes.M") : "M" },
    { value: "L", label: i18n.locale === "ur"  ? t("options.clothing_sizes.L") : "L" },
    { value: "XL", label: i18n.locale === "ur"  ? t("options.clothing_sizes.XL") : "XL" },
    { value: "XXL", label: i18n.locale === "ur"  ? t("options.clothing_sizes.XXL") : "XXL" }
  ]
  
  // Numeric sizes remain the same in both languages
  const shirtSizes = ["36", "38", "40", "42", "44", "46", "48"]
  const shoeSizes = ["34", "36", "38", "40", "42", "44", "46"]
  const trouserSizes = ["28", "30", "32", "34", "36", "38", "40", "42"]
  
  const gradeOption = [
    { value: "Nursery", label: i18n.locale === "ur" ? t("options.grades.nursery") : "Nursery" },
    { value: "KG", label: i18n.locale === "ur" ? t("options.grades.kg") : "KG" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" }
  ]
  
  const uniYearOption = [
    { value: "1st", label: i18n.locale === "ur"  ? t("options.university_years.1st") : "1st" },
    { value: "2nd", label: i18n.locale === "ur" ? t("options.university_years.2nd") : "2nd" },
    { value: "3rd", label: i18n.locale === "ur" ? t("options.university_years.3rd") : "3rd" },
    { value: "4th", label: i18n.locale === "ur"  ? t("options.university_years.4th") : "4th" }
  ]
  
  const collegeYearOption = [
    { value: "1st Year", label: i18n.locale === "ur"  ? t("options.college_years.1st_year") : "1st Year" },
    { value: "2nd Year", label: i18n.locale === "ur"  ? t("options.college_years.2nd_year") : "2nd Year" }
  ]

  // Helper function to get English value from translated label
  const getEnglishValue = (translatedValue, optionsArray) => {
    const option = optionsArray.find(opt => opt.label === translatedValue);
    return option ? option.value : translatedValue;
  }

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
  
  // Validate if the selected city is in the address
  const validateCityInAddress = (address) => {
    if (!selectedCity) {
      setCityError(t("errors.city_required"));
      return false;
    }

    if (!address) {
      return false;
    }

    // Get the English city name
    const cityObj = cities.find(city => city.value === selectedCity || city.label === selectedCity);
    const cityName = cityObj ? cityObj.value : selectedCity;

    // Check if the selected city is in the address string
    if (!address.includes(cityName)) {
      return false;
    }

    return true;
  };

  const validate = (values) => {
    console.log("HFEE")
    const errors = {}
  
    // Age validation
    const ageError = validateAge(values.age)
    if (ageError) errors.age = ageError
  
    if (!values.age) errors.age = t("errors.age_required")
    if (isNaN(values.age)) errors.age = t("errors.age_number")
    if (values.age < 18) errors.age = t("errors.age_min")
    if (!values.gender) errors.gender = t("errors.gender_required")
    if (!values.maritalStatus) errors.maritalStatus = t("errors.marital_status_required")
    
    // Get English values for comparison
    const marriedValue = maritalStatusOptions.find(opt => opt.value === "Married").label;
    const widowedValue = maritalStatusOptions.find(opt => opt.value === "Widowed").label;
    const divorcedValue = maritalStatusOptions.find(opt => opt.value === "Divorced").label;
    
    if (values.maritalStatus === marriedValue || 
        values.maritalStatus === widowedValue || 
        values.maritalStatus === divorcedValue ||
        values.maritalStatus === "Married" ||
        values.maritalStatus === "Widowed" ||
        values.maritalStatus === "Divorced") {
      if (!values.children) errors.children = t("errors.children_required")
      if (isNaN(values.children)) errors.children = t("errors.children_number")
      if (values.children < 0) errors.children = t("errors.children_negative")
      if (Number(values.children) !== Number.parseInt(values.children))
        errors.children = t("errors.children_whole")
      if (Number.parseInt(values.children) > Number.parseInt(values.membersCount)) {
        errors.children = t("errors.children_exceed")
      }
    }
    
    if (!values.occupation || values.occupation === "notsel") {
      errors.occupation = t("errors.occupation_required")
    }
    
    // Get English value for employed
    const employedValue = occupationStatusOptions.find(opt => opt.value === "Employed").label;
    
    if (values.occupation === employedValue || values.occupation === "Employed") {
      if (!values.income) errors.income = t("errors.income_required")
      if (values.income.trim() === "") {
        errors.income = t("errors.income_spaces")
      }
      if (isNaN(values.income)) errors.income = t("errors.income_number")
      if (values.income < 0) {
        errors.income = t("errors.income_negative")
      }
    }
    
    // City validation
    if (!selectedCity) {
      errors.city = t("errors.city_required");
    }
  
    // Address validation
    if (!values.address) errors.address = t("errors.address_required")
    if (!addressCoordinates && values.address) {
      errors.address = t("errors.address_invalid")
    }
    
    // Check if address contains the selected city
    if (selectedCity && values.address) {
      const cityObj = cities.find(city => city.value === selectedCity || city.label === selectedCity);
      const cityName = cityObj ? cityObj.value : selectedCity;
      
      if (!values.address.includes(cityName)) {
        errors.address = `${t("errors.address_city")} ${cityObj ? cityObj.label : selectedCity}`;
      }
    }
    
    // Get English value for student
    const studentValue = occupationStatusOptions.find(opt => opt.value === "Student").label;
  
    // Only validate education-related fields if occupation is "Student"
    if (values.occupation === studentValue || values.occupation === "Student") {
      if (!values.educationLevel) errors.educationLevel = t("errors.education_required")
      if (!values.institution) errors.institution = t("errors.institution_required")
      if (!values.class) errors.class = t("errors.class_required")
    }
  
    if (!values.shoeSize) errors.shoeSize = t("errors.shoe_size_required")
    if (!values.clothingSize) errors.clothingSize = t("errors.clothing_size_required")
    if (!values.shirtSize) errors.shirtSize = t("errors.shirt_size_required")
    if (!values.trouserSize) errors.trouserSize = t("errors.trouser_size_required")
  
    if (!values.membersCount && values.membersCount !== 0) errors.membersCount = t("errors.members_required")
    if (isNaN(values.membersCount)) errors.membersCount = t("errors.members_number")
    if (values.membersCount < 0) errors.membersCount = t("errors.members_negative")
    if (Number(values.membersCount) !== Number.parseInt(values.membersCount))
      errors.membersCount = t("errors.members_whole")
    if (values.membersCount > 10) errors.membersCount = t("errors.members_max")
  
    console.log(errors)
  
    return errors
  }
  
  const onSubmit = async (values, { setSubmitting }) => {
    console.log("Form submitted with values:", values)
    console.log(values)
    
    // Check if address contains the selected city
    if (!validateCityInAddress(values.address)) {
      const cityObj = cities.find(city => city.value === selectedCity || city.label === selectedCity);
      Alert.alert('Address Error', `${t("errors.address_city")} ${cityObj ? cityObj.label : selectedCity}`);
      return;
    }
    
    // Convert translated values to English before saving to Firestore
    const englishGender = getEnglishValue(values.gender, genderOptions);
    const englishMaritalStatus = getEnglishValue(values.maritalStatus, maritalStatusOptions);
    const englishOccupation = getEnglishValue(values.occupation, occupationStatusOptions);
    const englishEducationLevel = getEnglishValue(values.educationLevel, educationalStatusOptions);
    const englishClothingSize = getEnglishValue(values.clothingSize, clothingSizes);
    
    // Get English value for city
    const cityObj = cities.find(city => city.value === selectedCity || city.label === selectedCity);
    const englishCity = cityObj ? cityObj.value : selectedCity;
    
    // Convert class/year to English if needed
    let englishClass = values.class;
    if (values.educationLevel === educationalStatusOptions.find(opt => opt.value === "College").label || 
        values.educationLevel === "College") {
      englishClass = getEnglishValue(values.class, collegeYearOption);
    } else if (values.educationLevel === educationalStatusOptions.find(opt => opt.value === "University").label || 
               values.educationLevel === "University") {
      englishClass = getEnglishValue(values.class, uniYearOption);
    } else if (values.educationLevel === educationalStatusOptions.find(opt => opt.value === "School").label || 
               values.educationLevel === "School") {
      englishClass = getEnglishValue(values.class, gradeOption);
    }
    
    if (Number.parseInt(values.children) > 0) {
      // Create a new values object with English values
      const englishValues = {
        ...values,
        gender: englishGender,
        maritalStatus: englishMaritalStatus,
        occupation: englishOccupation,
        educationLevel: englishEducationLevel,
        class: englishClass,
        clothingSize: englishClothingSize,
        city: englishCity,
        addressCoordinates: addressCoordinates, // Add coordinates

      };
      
      navigation.navigate("ChildrenProfiles", { ParentValues: englishValues })
    } else {
      setSubmitting(false)
      try {
        await firestore()
          .collection("individual_profiles")
          .doc(user.uid)
          .set({
            age: Number.parseInt(values.age), // Convert to integer
            gender: englishGender,
            maritalStatus: englishMaritalStatus,
            children: Number.parseInt(values.children) || 0, // Convert to integer, default to 0
            occupation: englishOccupation,
            income: Number.parseFloat(values.income) || 0, // Convert to decimal
            educationLevel: englishEducationLevel,
            institution: values.institution,
            class: englishClass,
            shoeSize: values.shoeSize,
            clothingSize: englishClothingSize,
            shirtSize: values.shirtSize,
            trouserSize: values.trouserSize,
            address: values.address,
            city: englishCity, // Add the selected city in English
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
          <Text style={styles.modalTitle}>{t("location_modal.title")}</Text>
          <TouchableOpacity onPress={() => setShowLocationModal(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>{t("location_modal.close")}</Text>
          </TouchableOpacity>
        </View>

        <GooglePlacesAutocomplete
          ref={googlePlacesRef}
          placeholder={t("recipient_profile.search_address")}
          minLength={2}
          fetchDetails={true}
          onPress={(data, details = null) => {
            if (details && currentField) {
              const location = details.geometry.location;
              const formattedAddress = details.formatted_address;
              
              currentField.setFieldValue("address", formattedAddress);
              setAddressCoordinates({
                latitude: location.lat,
                longitude: location.lng
              });
              
              // Check if the selected city is in the address
              if (selectedCity) {
                const cityObj = cities.find(city => city.value === selectedCity || city.label === selectedCity);
                const cityName = cityObj ? cityObj.value : selectedCity;
                
                if (!formattedAddress.includes(cityName)) {
                  Alert.alert('Address Error', `${t("errors.address_city")} ${cityObj ? cityObj.label : selectedCity}`);
                }
              }
              
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
              backgroundColor: theme.colors.pearlWhite,
              borderTopWidth: 0,
              borderBottomWidth: 0,
            },
            textInput: {
              backgroundColor: theme.colors.pearlWhite,
              color: theme.colors.ivory,
              height: 50,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: theme.colors.ivory,
              fontSize: i18n.locale === "ur" ? 16 : 16,
              marginLeft: 0,
              marginRight: 0,
            },
            listView: {
              backgroundColor: theme.colors.pearlWhite,
              borderWidth: 1,
              borderColor: theme.colors.ivory,
              borderRadius: 5,
              marginTop: 5,
            },
            row: {
              backgroundColor: theme.colors.pearlWhite,
              padding: 13,
              height: 'auto',
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
              backgroundColor: theme.colors.pearlWhite,
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
  
  // City selection modal component
  const CitySelectionModal = () => (
    <Modal
      visible={showCityModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCityModal(false)}
    >
      <View style={styles.cityModalContainer}>
        <View style={styles.cityModalContent}>
          <Text style={styles.cityModalTitle}>{t("city_modal.title")}</Text>

          {cities.map((city) => (
            <TouchableOpacity
              key={city.value}
              style={[styles.cityOption, selectedCity === city.value && styles.selectedCityOption]}
              onPress={() => {
                setSelectedCity(city.value)
                setCityError("")
                setShowCityModal(false)
              }}
            >
              <Text style={[styles.cityOptionText, selectedCity === city.value && styles.selectedCityOptionText]}>
                {city.label}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.closeCityModalButton} onPress={() => setShowCityModal(false)}>
            <Text style={styles.closeCityModalButtonText}>{t("city_modal.close")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  const [selectedOption, setSelectedOption] = useState("option1")
  const [inputValue, setInputValue] = useState("")

  return (
    <View style={[styles.container, { marginBottom: 20 }]}>
      <ScrollView>
        <Text style={styles.title}>{t("recipient_profile.title")}</Text>
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
                <Text style={styles.label}>{t("recipient_profile.age")}</Text>
                <TextInput
                  style={[styles.input, { fontSize: i18n.locale === "ur" ? 18 : 15 , textAlign: i18n.locale === "ur"  ? "right": "left"}]}
                  onChangeText={handleChange("age")}
                  onBlur={handleBlur("age")}
                  value={values.age}
                  placeholder={t("recipient_profile.age")}
                  placeholderTextColor={theme.colors.ivory}
                  keyboardType="numeric"
                />
                {errors.age && touched.age && <Text style={[styles.errorText, { fontSize: i18n.locale === "ur"  ? 14 : 12 }]}>{errors.age}</Text>}
              </View>

              {/* Gender Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("recipient_profile.gender")}</Text>
                <View style={[styles.radioContainer, {  }]}>
                  {genderOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.radioOption, {}]}
                      onPress={() => setFieldValue("gender", option.label)}
                    >
                      <View style={[styles.radioCircle, values.gender === option.label && styles.radioSelected, { marginRight: i18n.locale === "ur" ? 0 : 10, marginLeft: i18n.locale === "ur" ? 10 : 0 }]} />
                      <Text style={[styles.radioLabel, {  }]}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.gender && touched.gender && <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.gender}</Text>}
              </View>
              
              {/* City Selection Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("recipient_profile.city")}</Text>
                <View style={styles.addressContainer}>
                  <TextInput
                    style={[
                      styles.addressInput,
                      cityError ? { borderColor: "red" } : null,
                      { fontSize: i18n.locale === "ur"  ? 16 : 15 }
                    ]}
                    value={selectedCity ? cities.find(city => city.value === selectedCity).label : ""}
                    placeholder={t("recipient_profile.select_city")}
                    placeholderTextColor={theme.colors.ivory}
                    editable={false}
                  />
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => {
                      setShowCityModal(true)
                    }}
                  >
                    <Text style={styles.searchButtonText}>{t("recipient_profile.select")}</Text>
                  </TouchableOpacity>
                </View>
                {cityError && <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{cityError}</Text>}
              </View>

              {/* Address Input with Location Search */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("recipient_profile.address")}</Text>
                <View style={styles.addressContainer}>
                  <TextInput
                    style={[
                      styles.addressInput,
                      errors.address && touched.address && styles.errorBorder,
                      {  fontSize: i18n.locale === "ur"  ? 16 : 15 }
                    ]}
                    value={values.address}
                    placeholder={t("recipient_profile.search_address")}
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
                    <Text style={styles.searchButtonText}>{t("recipient_profile.search")}</Text>
                  </TouchableOpacity>
                </View>
                {errors.address && touched.address && <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur"  ? 14 : 12 }]}>{errors.address}</Text>}
                {addressCoordinates && (
                  <Text style={[styles.coordinatesText, {  }]}>
                    {t("recipient_profile.address_validated")}
                  </Text>
                )}
              </View>

              {/* Number of Family Members Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("recipient_profile.family_members")}</Text>
                <TextInput
                  style={[styles.input, {  fontSize: i18n.locale === "ur"  ? 16 : 15 , textAlign: i18n.locale === "ur"  ? "right": "left"}]}
                  onChangeText={handleChange("membersCount")}
                  onBlur={handleBlur("membersCount")}
                  value={values.membersCount.toString()}
                  placeholder={t("recipient_profile.family_members")}
                  placeholderTextColor={theme.colors.ivory}
                  keyboardType="numeric"
                />
                {errors.membersCount && touched.membersCount && (
                  <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur"  ? 14 : 12 }]}>{errors.membersCount}</Text>
                )}
              </View>

              {/* Marital Status Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("recipient_profile.marital_status")}</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.maritalStatus}
                    onValueChange={(itemValue) => setFieldValue("maritalStatus", itemValue)}
                    style={[styles.picker1, {}]}
                  >
                    <Picker.Item label={t("recipient_profile.marital_status")} value="" />
                    {maritalStatusOptions.map((status) => (
                      <Picker.Item key={status.value} label={status.label} value={status.label} />
                    ))}
                  </Picker>
                </View>
                {errors.maritalStatus && touched.maritalStatus && (
                  <Text style={[styles.errorText, { fontSize: i18n.locale === "ur"  ? 14 : 12 }]}>{errors.maritalStatus}</Text>
                )}
              </View>

              {/* Children Input (Conditional) */}
              {(values.maritalStatus === maritalStatusOptions.find(opt => opt.value === "Married")?.label ||
                values.maritalStatus === maritalStatusOptions.find(opt => opt.value === "Divorced")?.label ||
                values.maritalStatus === maritalStatusOptions.find(opt => opt.value === "Widowed")?.label ||
                values.maritalStatus === "Married" ||
                values.maritalStatus === "Divorced" ||
                values.maritalStatus === "Widowed") && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>{t("recipient_profile.children")}</Text>
                  <TextInput
                    style={[styles.input, {  fontSize: i18n.locale === "ur"  ? 16 : 15 ,textAlign: i18n.locale === "ur"  ? "right": "left"}]}
                    onChangeText={handleChange("children")}
                    onBlur={handleBlur("children")}
                    value={values.children}
                    placeholder={t("recipient_profile.children")}
                    placeholderTextColor={theme.colors.ivory}
                    keyboardType="numeric"
                  />
                  {errors.children && touched.children && <Text style={[styles.errorText, { fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.children}</Text>}
                </View>
              )}

              {/* occupation Status Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("recipient_profile.occupation")}</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.occupation}
                    onValueChange={(itemValue) => setFieldValue("occupation", itemValue)}
                    style={[styles.picker1, { }]}
                  >
                    <Picker.Item label={t("recipient_profile.occupation")} value="" />
                    {occupationStatusOptions.map((status) => (
                      <Picker.Item key={status.value} label={status.label} value={status.label} />
                    ))}
                  </Picker>
                </View>
                {errors.occupation && touched.occupation && <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.occupation}</Text>}
              </View>

              {/* Income Input */}
              {(values.occupation === occupationStatusOptions.find(opt => opt.value === "Employed")?.label ||
                values.occupation === "Employed") && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>{t("recipient_profile.income")}</Text>
                  <TextInput
                    style={[styles.input, {  fontSize: i18n.locale === "ur"  ? 16 : 15,textAlign: i18n.locale === "ur"  ? "right": "left" }]}
                    onChangeText={handleChange("income")}
                    onBlur={handleBlur("income")}
                    value={values.income}
                    placeholder={t("recipient_profile.income")}
                    placeholderTextColor={theme.colors.ivory}
                    keyboardType="numeric"
                  />
                  {errors.income && touched.income && <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur"  ? 14 : 12 }]}>{errors.income}</Text>}
                </View>
              )}

              {/* Student-specific fields (Conditional) */}
              {(values.occupation === occupationStatusOptions.find(opt => opt.value === "Student")?.label ||
                values.occupation === "Student") && (
                <>
                  {/* Educational level Status Selection */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t("recipient_profile.education_level")}</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={values.educationLevel}
                        onValueChange={(itemValue) => setFieldValue("educationLevel", itemValue)}
                        style={[styles.picker1, { }]}
                      >
                        <Picker.Item label={t("recipient_profile.education_level")} value="" />
                        {educationalStatusOptions.map((status) => (
                          <Picker.Item key={status.value} label={status.label} value={status.label} />
                        ))}
                      </Picker>
                    </View>
                    {errors.educationLevel && touched.educationLevel && (
                      <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur"  ? 14 : 12 }]}>{errors.educationLevel}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t("recipient_profile.institution")}</Text>
                    <TextInput
                      style={[styles.input, {  fontSize: i18n.locale === "ur"  ? 16 : 15 ,textAlign: i18n.locale === "ur"  ? "right": "left"}]}
                      onChangeText={handleChange("institution")}
                      onBlur={handleBlur("institution")}
                      value={values.institution}
                      placeholder={t("recipient_profile.institution")}
                      placeholderTextColor={theme.colors.ivory}
                    />
                    {errors.institution && touched.institution && (
                      <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur"  ? 14 : 12 }]}>{errors.institution}</Text>
                    )}
                  </View>

                  {(values.educationLevel === educationalStatusOptions.find(opt => opt.value === "College")?.label || 
                    values.educationLevel === educationalStatusOptions.find(opt => opt.value === "University")?.label || 
                    values.educationLevel === educationalStatusOptions.find(opt => opt.value === "Special Education")?.label ||
                    values.educationLevel === "College" ||
                    values.educationLevel === "University" ||
                    values.educationLevel === "Special Education") && (
                    <>
                      {/* Year of Study */}
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("recipient_profile.year_of_study")}</Text>
                        <View style={styles.pickerContainer}>
                          {(values.educationLevel === educationalStatusOptions.find(opt => opt.value === "College")?.label ||
                            values.educationLevel === "College") && (
                            <>
                              <Picker
                                selectedValue={values.class}
                                onValueChange={(itemValue) => setFieldValue("class", itemValue)}
                                style={[styles.picker1, {  }]}
                              >
                                <Picker.Item label={t("recipient_profile.year_of_study")} value="" />
                                {collegeYearOption.map((year) => (
                                  <Picker.Item key={year.value} label={year.label} value={year.label} />
                                ))}
                              </Picker>
                            </>
                          )}
                          {(values.educationLevel === educationalStatusOptions.find(opt => opt.value === "University")?.label ||
                            values.educationLevel === "University") && (
                            <>
                              <Picker
                                selectedValue={values.class}
                                onValueChange={(itemValue) => setFieldValue("class", itemValue)}
                                style={[styles.picker1, {  }]}
                              >
                                <Picker.Item label={t("recipient_profile.year_of_study")} value="" />
                                {uniYearOption.map((year) => (
                                  <Picker.Item key={year.value} label={year.label} value={year.label} />
                                ))}
                              </Picker>
                            </>
                          )}

                          {(values.educationLevel === educationalStatusOptions.find(opt => opt.value === "Special Education")?.label ||
                            values.educationLevel === "Special Education") && (
                            <>
                              <Picker
                                selectedValue={values.class}
                                onValueChange={(itemValue) => setFieldValue("class", itemValue)}
                                style={[styles.picker1, {  }]}
                              >
                                <Picker.Item label={educationalStatusOptions.find(opt => opt.value === "Special Education")?.label || "Special Education"} 
                                             value={educationalStatusOptions.find(opt => opt.value === "Special Education")?.label || "Special Education"} />
                              </Picker>
                            </>
                          )}
                        </View>
                        {errors.class && touched.class && <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.class}</Text>}
                      </View>
                    </>
                  )}
                </>
              )}

              {/* Shoe Size Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("recipient_profile.shoe_size")}</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.shoeSize}
                    onValueChange={(itemValue) => setFieldValue("shoeSize", itemValue)}
                    style={[styles.picker1, { }]}
                  >
                    <Picker.Item label={t("recipient_profile.shoe_size")} value="" />
                    {shoeSizes.map((size) => (
                      <Picker.Item key={size} label={size} value={size} />
                    ))}
                  </Picker>
                </View>
                {errors.shoeSize && touched.shoeSize && <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.shoeSize}</Text>}
              </View>

              {/* Clothing Size Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("recipient_profile.clothing_size")}</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.clothingSize}
                    onValueChange={(itemValue) => setFieldValue("clothingSize", itemValue)}
                    style={[styles.picker1, {  }]}
                  >
                    <Picker.Item label={t("recipient_profile.clothing_size")} value="" />
                    {clothingSizes.map((size) => (
                      <Picker.Item key={size.value} label={size.label} value={size.label} />
                    ))}
                  </Picker>
                </View>
                {errors.clothingSize && touched.clothingSize && (
                  <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.clothingSize}</Text>
                )}
              </View>

              {/* Shirt Size Selection */}
             <View style={styles.inputContainer}>
  <Text style={styles.label}>{t("recipient_profile.shirt_size")}</Text>
  <View style={styles.pickerContainer}>
    <Picker
      selectedValue={values.shirtSize}
      onValueChange={(itemValue) => setFieldValue("shirtSize", itemValue)}
      style={[styles.picker1, { }]}
    >
      <Picker.Item label={t("recipient_profile.shirt_size")} value="" />
      {shirtSizes.map((size) => (
        <Picker.Item key={size} label={size} value={size} />
      ))}
    </Picker>
  </View>
  {errors.shirtSize && touched.shirtSize && (
    <Text style={[styles.errorText, { fontSize: i18n.locale === "ur" ? 14 : 12 }]}>
      {errors.shirtSize}
    </Text>
  )}
</View>

              {/* Trouser Size Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("recipient_profile.trouser_size")}</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.trouserSize}
                    onValueChange={(itemValue) => setFieldValue("trouserSize", itemValue)}
                    style={[styles.picker1, {  }]}
                  >
                    <Picker.Item label={t("recipient_profile.trouser_size")} value="" />
                    {trouserSizes.map((size) => (
                      <Picker.Item key={size} label={size} value={size} />
                    ))}
                  </Picker>
                </View>
                {errors.trouserSize && touched.trouserSize && (
                  <Text style={[styles.errorText, { fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.trouserSize}</Text>
                )}
              </View>

              {/* Profile Picture Upload */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("recipient_profile.profile_picture")}</Text>
                <ImagePickerComponent
                  maxImages={1}
                  selectedImages={image ? [image] : []}
                  onImagesChange={(images) => setImage(images[0])}
                />
                {errors.image && <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur"  ? 14 : 12 }]}>{errors.image}</Text>}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={() => {
                  console.log("Submit button pressed")
                  handleSubmit()
                }}
                style={styles.submitButton}
              >
                <Text style={[styles.submitButtonText, { fontSize: i18n.locale === "ur"  ? 18 : 16 }]}>{t("recipient_profile.save_profile")}</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ScrollView>

      {/* Location Search Modal */}
      <LocationSearchModal />
      
      {/* City Selection Modal */}
      <CitySelectionModal />
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
  fontSize: i18n.locale === "ur" ? 18: 16,
    
    fontWeight: "bold",
    color: theme.colors.ivory,
    marginBottom: 5,
  },
  input: {
    backgroundColor: theme.colors.pearlWhite,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.colors.ivory,
    paddingHorizontal: 15,
    color: theme.colors.ivory,
    fontSize: i18n.locale === "ur" ? 18: 16,
    
  },
  textArea: {
    backgroundColor: theme.colors.pearlWhite,
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
        fontSize: i18n.locale === "ur" ? 18: 16,
    
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
    backgroundColor: theme.colors.pearlWhite,
  },
  picker1: {
    height: 50,
    color: theme.colors.ivory,
    backgroundColor: theme.colors.pearlWhite,
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
        fontSize: i18n.locale === "ur" ? 14: 12,
    
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
    backgroundColor: theme.colors.pearlWhite,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.colors.ivory,
    paddingHorizontal: 15,
    color: theme.colors.ivory,
    fontSize: i18n.locale === "ur" ? 16: 12,
    
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
  // City modal styles
  cityModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  cityModalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cityModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: theme.colors.sageGreen,
  },
  cityOption: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  selectedCityOption: {
    backgroundColor: theme.colors.sageGreen,
    borderColor: theme.colors.sageGreen,
  },
  cityOptionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedCityOptionText: {
    color: "white",
    fontWeight: "bold",
  },
  closeCityModalButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  closeCityModalButtonText: {
    color: "#333",
    fontSize: 16,
  },
})

export default RecipientProfileForm