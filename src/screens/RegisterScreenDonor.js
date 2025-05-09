"use client"

import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import { useState, useRef } from "react"
import { TouchableOpacity, StyleSheet, View, ImageBackground, Modal, Alert } from "react-native"
import { Text } from "react-native-paper"
import TextInput from "../components/TextInput"
import Button from "../components/Button"
import BackButton from "../components/BackButton"
import { theme } from "../core/theme"
import { nameValidator } from "../helpers/nameValidator"
import { idCardValidator } from "../helpers/idCardValidator"
import { passwordValidator } from "../helpers/passwordValidator"
import { usernameValidator } from "../helpers/usernameValidator"
import { numberValidator } from "../helpers/numberValidator"
import { ScrollView } from "react-native-gesture-handler"
import { IsCnicUnique } from "../helpers/IsCnicUnique"
import { IsUsernameUnique } from "../helpers/IsUsernameUnique"
import { IsUniqueNumber } from "../helpers/isUniqueNumber"
import CryptoJS from "crypto-js"
import { t } from "../i18n" // Import the translation function
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import axios from "axios"

// Google API Key
const GOOGLE_API_KEY = "w"

export default function RegisterScreenDonor({ navigation }) {
  const [name, setName] = useState({ value: "", error: "" })
  const [username, setUsername] = useState({ value: "", error: "" })
  const [phoneNumber, setPhoneNumber] = useState({ value: "", error: "" })
  const [password, setPassword] = useState({ value: "", error: "" })
  const [idCard, setidCard] = useState({ value: "", error: "" })
  const [address, setAddress] = useState("") // Simple string for address
  const [addressError, setAddressError] = useState("") // Separate error state
  const [code, setCode] = useState("")
  const [confirm, setConfirm] = useState("")
  const [approved] = useState({ value: "false" })
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [addressCoordinates, setAddressCoordinates] = useState(null)

  // Add city selection state
  const [selectedCity, setSelectedCity] = useState("")
  const [cityError, setCityError] = useState("")
  const [showCityModal, setShowCityModal] = useState(false)

  // Define the three cities
  const cities = ["Karachi", "Lahore", "Islamabad"]

  // Ref for GooglePlacesAutocomplete
  const googlePlacesRef = useRef(null)

  // Validate address and get coordinates using Google Maps API
  const validateAndGetCoordinates = async (address) => {
    console.log("Validating address:", address)
    if (!address) return null

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`,
      )

      if (response.data.status === "OK" && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location
        const coordinates = {
          latitude: location.lat,
          longitude: location.lng,
        }

        // Format the address
        const formattedAddress = response.data.results[0].formatted_address
        console.log("Formatted address:", formattedAddress)
        console.log("Coordinates:", coordinates)

        setAddressCoordinates(coordinates)
        return coordinates
      } else {
        console.error("Address validation failed:", response.data.status)
        Alert.alert("Invalid Address", "Please enter a valid address")
        return null
      }
    } catch (error) {
      console.error("Error validating address:", error)
      Alert.alert("Error", "Failed to validate address")
      return null
    }
  }

  const validateFields = async (username, phoneNumber, cnic) => {
    const isUsernameUnique = await IsUsernameUnique(username)
    const isPhoneUnique = await IsUniqueNumber(phoneNumber)
    const isCnicUnique = await IsCnicUnique(cnic)

    return {
      isUsernameUnique,
      isPhoneUnique,
      isCnicUnique,
    }
  }

  // Validate if the selected city is in the address
  const validateCityInAddress = () => {
    if (!selectedCity) {
      setCityError("Please select a city")
      return false
    }

    if (!address) {
      setAddressError("Address is required")
      return false
    }

    // Check if the selected city is in the address string
    if (!address.includes(selectedCity)) {
      setAddressError(`Your address must include ${selectedCity}`)
      return false
    }

    return true
  }

  const onSignUpPressed = async () => {
    console.log("Signup pressed")

    const usernameError = usernameValidator(username.value)
    const nameError = nameValidator(name.value)
    const numberError = numberValidator(phoneNumber.value)
    const passwordError = passwordValidator(password.value)
    const idCardError = idCardValidator(idCard.value)
    const addrError = !address ? t("auth.errors.addressRequired") || "Address is required" : ""

    // Reset city error
    setCityError("")

    if (!selectedCity) {
      setCityError("Please select a city")
      return
    }

    if (nameError || idCardError || passwordError || usernameError || numberError || addrError) {
      setName({ ...name, error: nameError })
      setidCard({ ...idCard, error: idCardError })
      setPassword({ ...password, error: passwordError })
      setUsername({ ...username, error: usernameError })
      setPhoneNumber({ ...phoneNumber, error: numberError })
      setAddressError(addrError)
      return
    }

    // Validate address coordinates
    if (!addressCoordinates) {
      setAddressError("Please select a valid address from the suggestions")
      return
    }

    // Validate if the selected city is in the address
    if (!validateCityInAddress()) {
      return
    }

    const { isUsernameUnique, isPhoneUnique, isCnicUnique } = await validateFields(
      username.value,
      phoneNumber.value,
      idCard.value,
    )

    if (!isUsernameUnique) {
      console.log("in set username wali if")
      setUsername({ ...username, error: t("auth.errors.usernameExists") })
      return
    }
    if (!isPhoneUnique) {
      console.log("in set phone wali if")
      setPhoneNumber({ ...phoneNumber, error: t("auth.errors.phoneExists") })
      return
    }
    if (!isCnicUnique) {
      console.log("in set id card wali if")
      setidCard({ ...idCard, error: t("auth.errors.cnicExists") })
      return
    }

    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber.value)
      setConfirm(confirmation)
      console.log("Phone Number:", phoneNumber)
    } catch (error) {
      console.log("Error sending code", error)
    }
  }

  const confirmCode = async () => {
    if (!confirm) {
      console.log("No confirmation object. Call signInWithPhoneNumber first.")
      return
    }

    try {
      const userCredential = await confirm.confirm(code)
      const user = userCredential.user

      const userDocument = await firestore().collection("users").doc(user.uid).get()
      console.log(userDocument)

      if (userDocument.exists) {
        navigation.navigate("TabNavigator")
      } else {
        const hashedPassword = CryptoJS.SHA256(password.value).toString()

        try {
          await firestore().collection("users").doc(user.uid).set({
            name: name.value,
            username: username.value,
            phone: phoneNumber.value,
            idCard: idCard.value,
            address: address,
            city: selectedCity,
            addressCoordinates: addressCoordinates,
            password: hashedPassword,
            approved: approved.value,
          })

          console.log("in navigation say oper if")
          console.log("Saved address:", address)
          console.log("Saved city:", selectedCity)
          console.log("Saved coordinates:", addressCoordinates)

          navigation.navigate("DonorProfileForm")
        } catch (error) {
          console.log("Error saving details", error)
        }
      }
    } catch (error) {
      console.log("Invalid verification code:", error)
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
          <Text style={styles.modalTitle}>{t("auth.searchAddress") || "Search Address"}</Text>
          <TouchableOpacity onPress={() => setShowLocationModal(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>{t("common.close") || "Close"}</Text>
          </TouchableOpacity>
        </View>

        <GooglePlacesAutocomplete
          ref={googlePlacesRef}
          placeholder={t("auth.enterAddress") || "Enter your address"}
          minLength={2}
          fetchDetails={true}
          onPress={(data, details = null) => {
            console.log("Place selected:", data.description)

            if (details) {
              const location = details.geometry.location
              const formattedAddress = details.formatted_address

              console.log("Setting address to:", formattedAddress)
              console.log("Setting coordinates to:", location)

              // Set address as a string
              setAddress(formattedAddress)
              setAddressError("") // Clear any error

              setAddressCoordinates({
                latitude: location.lat,
                longitude: location.lng,
              })

              // Check if the selected city is in the address
              if (selectedCity && !formattedAddress.includes(selectedCity)) {
                setAddressError(`Your address must include ${selectedCity}`)
              } else {
                setAddressError("")
              }

              // Log after setting state to verify
              console.log("Address state after setting:", formattedAddress)

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
          <Text style={styles.cityModalTitle}>Select Your City</Text>

          {cities.map((city) => (
            <TouchableOpacity
              key={city}
              style={[styles.cityOption, selectedCity === city && styles.selectedCityOption]}
              onPress={() => {
                setSelectedCity(city)
                setCityError("")

                // Check if the current address includes the selected city
                if (address && !address.includes(city)) {
                  setAddressError(`Your address must include ${city}`)
                } else {
                  setAddressError("")
                }

                setShowCityModal(false)
              }}
            >
              <Text style={[styles.cityOptionText, selectedCity === city && styles.selectedCityOptionText]}>
                {city}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.closeCityModalButton} onPress={() => setShowCityModal(false)}>
            <Text style={styles.closeCityModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  return (
    <ImageBackground
      source={require("../../assets/items/0d59de270836b6eafe057c8afb642e77.jpg")}
      style={styles.imageBackground}
      blurRadius={8}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <BackButton goBack={navigation.goBack} />

        {/* Location Search Modal */}
        <LocationSearchModal />

        {/* City Selection Modal */}
        <CitySelectionModal />

        <View style={styles.container}>
          <Text style={styles.header}>{t("auth.hello")}</Text>
          {!confirm ? (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  label={t("auth.name")}
                  returnKeyType="next"
                  value={name.value}
                  style={styles.input}
                  onChangeText={(text) => setName({ value: text, error: "" })}
                  error={!!name.error}
                  errorText={name.error ? <Text style={styles.errorText}>{name.error}</Text> : null}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  label={t("auth.username")}
                  returnKeyType="next"
                  value={username.value}
                  style={styles.input}
                  onChangeText={(text) => setUsername({ value: text, error: "" })}
                  error={!!username.error}
                  errorText={username.error ? <Text style={styles.errorText}>{username.error}</Text> : null}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  label={t("auth.phoneNumber")}
                  returnKeyType="next"
                  value={phoneNumber.value}
                  style={styles.input}
                  onChangeText={(text) => setPhoneNumber({ value: text, error: "" })}
                  error={!!phoneNumber.error}
                  errorText={phoneNumber.error ? <Text style={styles.errorText}>{phoneNumber.error}</Text> : null}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  label={t("auth.password")}
                  returnKeyType="done"
                  value={password.value}
                  style={styles.input}
                  onChangeText={(text) => setPassword({ value: text, error: "" })}
                  error={!!password.error}
                  errorText={password.error ? <Text style={styles.errorText}>{password.error}</Text> : null}
                  secureTextEntry
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  label={t("auth.idCard")}
                  returnKeyType="done"
                  value={idCard.value}
                  style={styles.input}
                  onChangeText={(text) => setidCard({ value: text, error: "" })}
                  error={!!idCard.error}
                  errorText={idCard.error ? <Text style={styles.errorText}>{idCard.error}</Text> : null}
                />
              </View>

              {/* City Selection Field */}
              <View style={styles.inputContainer}>
                <View style={styles.addressInputWrapper}>
                  <TextInput
                    label="City"
                    returnKeyType="done"
                    value={selectedCity}
                    style={[styles.input, cityError ? { borderColor: "red" } : null]}
                    editable={false}
                    error={!!cityError}
                    errorText={cityError ? <Text style={styles.errorText}>{cityError}</Text> : null}
                  />
                  <TouchableOpacity
                    style={styles.searchIconButton}
                    onPress={() => {
                      console.log("Opening city modal")
                      setShowCityModal(true)
                    }}
                  >
                    <Text style={styles.searchIconText}>🔍</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Address Input */}
              <View style={styles.inputContainer}>
                <View style={styles.addressInputWrapper}>
                  <TextInput
                    label={t("auth.address") || "Address"}
                    returnKeyType="done"
                    value={address}
                    style={[styles.input, addressError ? { borderColor: "red" } : null]}
                    editable={false}
                    error={!!addressError}
                    errorText={addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
                  />
                  <TouchableOpacity
                    style={styles.searchIconButton}
                    onPress={() => {
                      console.log("Opening location modal")
                      setShowLocationModal(true)
                    }}
                  >
                    <Text style={styles.searchIconText}>🔍</Text>
                  </TouchableOpacity>
                </View>
                {addressCoordinates && !addressError && <Text style={styles.coordinatesText}>Address validated ✓</Text>}
              </View>

              <Button mode="contained" onPress={onSignUpPressed} style={{ marginTop: 24 }}>
                {t("auth.next")}
              </Button>
            </>
          ) : (
            <>
              <Text>{t("auth.enterCode")}</Text>
              <TextInput label={t("auth.confirmCode")} value={code} onChangeText={setCode} style={styles.input} />
              <TouchableOpacity onPress={confirmCode}>
                <Text style={styles.link}>{t("auth.confirmCode")}</Text>
              </TouchableOpacity>
            </>
          )}
          <View style={styles.row}>
            <Text style={styles.footerText}>{t("auth.alreadyHaveAccount")}</Text>
            <TouchableOpacity onPress={() => navigation.replace("LoginScreen", { role: "donor" })}>
              <Text style={styles.link}>{t("auth.login")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    justifyContent: "center",
    flexGrow: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  container: {
    alignItems: "center",
    marginTop: 40,
    backgroundColor: theme.colors.background,
    borderRadius: 60,
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  input: {
    alignSelf: "center",
    width: "100%",
    marginBottom: 3,
    backgroundColor: "white",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme.colors.sageGreen,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  footerText: {
    fontSize: 13,
    color: theme.colors.ivory,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.sageGreen,
  },
  errorText: {
    fontSize: 13,
    marginTop: -5,
    color: "red",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
    position: "relative",
  },
  forgotPassword: {
    fontSize: 13,
    color: theme.colors.ivory,
    marginTop: -10,
    marginBottom: 20,
  },
  // Improved styles for address input with sleek search button
  addressInputWrapper: {
    position: "relative",
    width: "100%",
  },
  searchIconButton: {
    position: "absolute",
    right: 10,
    bottom: 23,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.sageGreen,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIconText: {
    color: "white",
    fontSize: 16,
  },
  coordinatesText: {
    color: theme.colors.sageGreen,
    fontSize: 12,
    marginTop: 2,
    marginLeft: 5,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background || "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.sageGreen,
    backgroundColor: theme.colors.sageGreen,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  // Autocomplete styles
  autocompleteContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 15,
  },
  autocompleteInput: {
    height: 50,
    fontSize: 16,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: theme.colors.sageGreen,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  autocompleteList: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: theme.colors.sageGreen,
    borderRadius: 5,
    marginTop: 5,
  },
  autocompleteRow: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  autocompleteDescription: {
    fontSize: 16,
    color: "#333",
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
