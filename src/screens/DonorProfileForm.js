import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Formik } from 'formik';
import { Picker } from "@react-native-picker/picker";
import { theme } from "../core/theme";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import ImagePickerComponent from '../components/ImagePickerComponent';

const DonorProfileForm = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();
  const [image, setImage] = useState(null);
  const genderOptions = ['Male', 'Female', 'Other'];
  const provinceOptions = ['Punjab', 'Kashmir', 'Sindh', 'KPK', 'Blochistan'];

  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = 'Name is required';
    if (!values.age) errors.age = 'Age is required';
    if (isNaN(values.age)) errors.age = 'Age must be a number';
    if (!values.gender) errors.gender = 'Gender is required';
    if (!values.occupation) errors.occupation = 'Occupation is required';
    if (!values.address) errors.address = 'Address is required';
    if (!values.province) errors.province = 'Province is required';
    if (!image) errors.image = 'Profile picture is required';
    return errors;
  };

  const onSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setSubmitting(false);
  };

  return (
    <View style={[styles.container, { marginBottom: tabBarHeight }]}>
      <ScrollView>
        <Text style={styles.title}>Donor Profile</Text>
        <View style={styles.line} />

        <Formik
          initialValues={{
            name: '',
            gender: '',
            occupation: '',
            age: '',
            address: '',
            province: '',
          }}
          validate={validate}
          onSubmit={onSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <>
              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.colors.ivory}
                />
                {errors.name && touched.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              {/* Age Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('age')}
                  onBlur={handleBlur('age')}
                  value={values.age}
                  placeholder="Enter Age"
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
                      onPress={() => setFieldValue('gender', option)}
                    >
                      <View
                        style={[
                          styles.radioCircle,
                          values.gender === option && styles.radioSelected,
                        ]}
                      />
                      <Text style={styles.radioLabel}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.gender && touched.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
              </View>

              {/* Occupation Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Occupation</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('occupation')}
                  onBlur={handleBlur('occupation')}
                  value={values.occupation}
                  placeholder="Enter your occupation"
                  placeholderTextColor={theme.colors.ivory}
                />
                {errors.occupation && touched.occupation && <Text style={styles.errorText}>{errors.occupation}</Text>}
              </View>

              {/* Address Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={styles.textArea}
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  value={values.address}
                  placeholder="Enter your full address"
                  placeholderTextColor={theme.colors.ivory}
                  multiline
                  numberOfLines={3}
                />
                {errors.address && touched.address && <Text style={styles.errorText}>{errors.address}</Text>}
              </View>
              
              {/* Province Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Province</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.province}
                    onValueChange={(itemValue) => setFieldValue('province', itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select your province" value="" />
                    {provinceOptions.map((province) => (
                      <Picker.Item key={province} label={province} value={province} />
                    ))}
                  </Picker>
                </View>
                {errors.province && touched.province && <Text style={styles.errorText}>{errors.province}</Text>}
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
              <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Save Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.charcoalBlack,
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.ivory,
    textAlign: 'center',
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
    fontWeight: 'bold',
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
    textAlignVertical: 'top',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
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
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    color: theme.colors.ivory,
    backgroundColor: theme.colors.TaupeBlack,
  },
  submitButton: {
    backgroundColor: theme.colors.sageGreen,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20, 
  },
  submitButtonText: {
    color: theme.colors.ivory,
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default DonorProfileForm;

