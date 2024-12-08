import React, { useState } from "react";
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import CalendarPicker from "react-native-calendar-picker";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform ,Dimensions} from "react-native";
import { theme } from  "../core/theme";
import Button from "../components/Button";
import MapPicker from "../components/MapPicker";
import TextInput from "../components/TextInput";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from 'axios';
import { Alert } from 'react-native';




export default function ScheduleRDeliveryScreen({ navigation }) {


  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropOffLocation, setDropOffLocation] = useState("");
  const [error, setError] = useState(null); 
  const [address, setAddress] = useState('');
  const [pickupTime, setPickupTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [pickupCoordinates, setPickupCoordinates] = useState(null); // New state for pickup coordinates
  const [dropOffCoordinates, setDropOffCoordinates] = useState(null);


  const getAddressFromCoordinates = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'dast-e-khair/1.0 (zhalaym@gmaile.com)', // Replace with your app name and email
        },
      });
  
      const fetchedAddress = response.data.display_name;
      // const filteredAddress = fetchedAddress.replace(/[^a-zA-Z0-9 ,.-]/g, '');
      // const filteredAddress = fetchedAddress.replace(/[^a-zA-Z0-9,.-]/g, '').replace(/\s+/g, '');
      const filteredAddress = fetchedAddress
      .replace(/[^a-zA-Z0-9,.-]/g, '') // Remove unwanted characters
      .replace(/\s+/g, '') // Remove spaces
      .replace(/,+/g, ',') // Replace multiple consecutive commas with a single comma
      .replace(/^,|,$/g, ''); // Remove leading or trailing commas

      setAddress(filteredAddress);
      console.log("Filtered Address:", filteredAddress);
      return filteredAddress;
    } catch (error) {
      setError('Error fetching address');
      console.error("Error fetching address:", error.message || error);
      return 'Unknown Address';
    }
  };
  
  




  const onDateChange = (date) => setSelectedStartDate(date);
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setPickupTime(selectedTime);
  };

  const startDate = selectedStartDate ? selectedStartDate.toString() : "";

  const [isPickupMapVisible, setIsPickupMapVisible] = useState(false); // Separate state for pickup map visibility
  const [isDropoffMapVisible, setIsDropoffMapVisible] = useState(false); 

  const handleLocationSelect = async (location, type) => {
    const address = await getAddressFromCoordinates(location.latitude, location.longitude); // Get address from coordinates
    
    console.log("this is the addddddd",address);
    if (type === 'pickup') {
      setPickupLocation(address);
      setPickupCoordinates({ latitude: location.latitude, longitude: location.longitude });
    } else if (type === 'dropoff') {
      setDropOffLocation(address);
      setDropOffCoordinates({ latitude: location.latitude, longitude: location.longitude });
    }

    // Hide the map after selection
    setIsPickupMapVisible(false);
    setIsDropoffMapVisible(false);
  };

  const handleCancel = () => {
    setIsPickupMapVisible(false);
    setIsDropoffMapVisible(false);
  };
  const handleSaveDelivery = () => {

    // Show an alert
  Alert.alert(
    'Delivery Scheduled',
    'Your delivery has been successfully scheduled!',
    [
      {
        text: 'OK',
        onPress: () => {
          // Just display "Okay" message after pressing OK
          console.log('Okay');
        },
      },
    ],
    { cancelable: false }
  );
 
  };


  return (
    <Background>
       
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Select Delivery Details</Text>
          {/* Wrapper for Calendar Picker with complete background coverage */}
          <View style={styles.calendarContainer}>
            <CalendarPicker
              onDateChange={onDateChange}
              textStyle={styles.calendarText} 
              todayBackgroundColor={theme.colors.sageGreen}
              selectedDayColor={theme.colors.background}
              selectedDayTextColor="white"
              selectedBackgroundColor={theme.colors.sageGreen}
              width={260} // Adjust width to fit screen
              height={300} 
              style={styles.calendar}  // Apply general calendar styling
            />
          </View>

          {startDate ? (
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>Pickup Date: {startDate}</Text>
            </View>
          ) : null}


          {/* the time button */}
          <Button
            mode="contained"
            onPress={() => setShowTimePicker(true)}  // Show the time picker on press
            style={styles.Button}
          >
            Set Pickup Time
          </Button>

          {showTimePicker && (
            <DateTimePicker
              value={pickupTime}
              mode="time"
              display="spinner" // Use spinner for more color control
              onChange={onTimeChange}
              themeVariant="dark" // Set theme variant
              accentColor={theme.colors.sageGreen} // Apply custom color to the clock
              // display="default"
              // onChange={onTimeChange}
            />
          )}
          <Text style={styles.dateText}>Pickup Time: {pickupTime.toLocaleTimeString()}</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Pickup Location"
            placeholderTextColor={theme.colors.placeholder}
            value={pickupLocation}
            onChangeText={(text) => setPickupLocation(text)}
          />
           <Button
            mode="contained"
            onPress={() => setIsPickupMapVisible(true)}
            style={styles.Button}
          >
            Select a Pickup Location on Map
          </Button>

          <TextInput
            style={styles.input}
            placeholder="Enter Drop-Off Location"
            placeholderTextColor={theme.colors.placeholder}
            value={dropOffLocation}
            onChangeText={(text) => setDropOffLocation(text)}
          />
            <Button
            mode="contained"
            onPress={() => setIsDropoffMapVisible(true)}
            style={styles.Button}
          >
            Select a drop off Location on Map
          </Button>

          <Button
            mode="contained"
            onPress={handleSaveDelivery}
            style={styles.Button}
          
          >
            Save Delivery
          </Button>






  
        </ScrollView>


    

      
      {isPickupMapVisible && (
        <View style={styles.mapOverlay}>
          <MapPicker onLocationSelect={(location) => handleLocationSelect(location, "pickup")} onCancel={handleCancel} />
        </View>
      )}
      {isDropoffMapVisible && (
        <View style={styles.mapOverlay}>
          <MapPicker onLocationSelect={(location) => handleLocationSelect(location, "dropoff")} onCancel={handleCancel} />
        </View>
      )}
    </Background>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.ivory,
    textAlign: 'center',
    marginBottom: 20,
    marginTop:20,
  },
  calendarContainer: {
    backgroundColor: theme.colors.ivory,
    width: '100%',
    height: '30%',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 4,
    borderColor: theme.colors.sageGreen,
    borderRadius: 8,
    padding: 10,
  },
  calendar: {
    width: '100%',
    height: 390,
  },
  calendarText: {
    fontSize: 14, // Change the font size for calendar dates
    color: theme.colors.background,
  },
  dateContainer: {
    marginTop: 20,
    alignItems: "left",
  },
  dateText: {
    fontSize: 18,
    color: theme.colors.ivory,
    textAlign: 'left',
    paddingLeft:5,
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
    width: "90%",
    height: 25,
    padding: 15,
    borderWidth: 1,
    borderColor: theme.colors.sageGreen,
    borderRadius: 7,
    backgroundColor: theme.colors.ivory,
  },

  mapOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  backButtonWrapper: {
    position: 'absolute',
    top: 5, 
    left: 0, 
  },
});
