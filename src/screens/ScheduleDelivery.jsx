import React, { useState } from "react";
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import CalendarPicker from "react-native-calendar-picker";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { theme } from  "../core/theme";
import { Dimensions } from 'react-native';
import Button from "../components/Button";

// Get screen width
const screenWidth = Dimensions.get('window').width;

import DateTimePicker from "@react-native-community/datetimepicker";

export default function ScheduleDelivery({ navigation }) {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropOffLocation, setDropOffLocation] = useState("");
  const [pickupTime, setPickupTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateChange = (date) => setSelectedStartDate(date);
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setPickupTime(selectedTime);
  };

  const startDate = selectedStartDate ? selectedStartDate.toString() : "";

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Select delivery specification</Text>

          {/* Wrapper for Calendar Picker with complete background coverage */}
          <View style={styles.calendarContainer}>
            <CalendarPicker
              onDateChange={onDateChange}
              textStyle={styles.calendarText} // Apply custom text style
              todayBackgroundColor={theme.colors.sageGreen}
              selectedDayColor={theme.colors.background}
              selectedDayTextColor="white"
              selectedBackgroundColor={theme.colors.sageGreen}
              width={260} // Adjust width to fit screen
              height={350} 
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
              display="default"
              onChange={onTimeChange}
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

          <TextInput
            style={styles.input}
            placeholder="Enter Drop-Off Location"
            placeholderTextColor={theme.colors.placeholder}
            value={dropOffLocation}
            onChangeText={(text) => setDropOffLocation(text)}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.tabNavigatorPlaceholder}>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.01,
    paddingBottom: 20,
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
    height: '40%',
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
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.sageGreen,
    borderRadius: 5,
    backgroundColor: "white",
  },
  dateContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
    color: theme.colors.ivory,
    textAlign: 'center',
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
});


