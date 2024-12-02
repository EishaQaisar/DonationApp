import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { theme } from "../core/theme";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Formik } from 'formik';
import CircleLogoStepper2 from '../components/CircleLogoStepper2';
import { Picker } from "@react-native-picker/picker";
import ImagePickerComponent from '../components/ImagePickerComponent'; // Import the new component
import RowOptionButtons from '../components/RowOptionButtons';

const UploadEdu = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const ageCategories = [
    "0-6 months", "6-9 months", "9-12 months", "1 year", "2 year",
    "3 year", "4 year", "5 year", "6-8 year", "8-12 year",
    "12-18 year", "18-25 year", "25 year onwards"
  ];
  const gender = ['Male', 'Female', 'Unisex'];
  const [images, setImages] = useState([]);
  const season = ['Summers', 'Spring', 'Autumn', 'Winter'];
  const condition = ['New', 'Used Once/Twice', 'Heavily Used'];
  const size=['XS','S','M','L','XL','XXL']

  const onSubmitMethod = (value) => {
    value.image = images;
    console.log(value);
  };

  return (
    <View style={[Styles.container, { marginBottom: tabBarHeight }]}>
      <ScrollView>
        <CircleLogoStepper2/>
        <View style={Styles.line} />

        {/* Form */}
        <Formik
          initialValues={{
            fabric: "",
            size: "",
            condition: "",
            gender: "",
            quantity: 1,
            season: "",
            descri: "",
            ageCategory: "",
          }}
          onSubmit={value => onSubmitMethod(value)}
          style={{ height: '100%' }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
            <>
              {/* Season Selection */}
              <RowOptionButtons
                heading="Season"
                options={season}
                selectedValue={values.season}
                onSelect={(selectedSeason) => setFieldValue('season', selectedSeason)}
              />

              {/* Gender Selection */}
              <View style={{ marginTop: 30 }}>
                <Text style={Styles.headings}>Gender</Text>
                <View style={Styles.radioContainer}>
                  {gender.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={Styles.radioOption}
                      onPress={() => setFieldValue('gender', option)}
                    >
                      <View
                        style={[
                          Styles.radioCircle,
                          values.gender === option && Styles.radioSelected,
                        ]}
                      />
                      <Text style={Styles.radioLabel}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Age Selection */}
              <View style={{ marginTop: 30 }}>
                <Text style={Styles.headings}>Age </Text>
                <View style={Styles.dropdownContainer}>
                  <Picker
                    selectedValue={values.ageCategory}
                    onValueChange={(itemValue) => setFieldValue("ageCategory", itemValue)}
                    style={Styles.picker}
                    dropdownStyle={Styles.dropdownBox}
                    itemStyle={Styles.itemStyle}
                  >
                    <Picker.Item label="Select an age category" value="" />
                    {ageCategories.map((category) => (
                      <Picker.Item key={category} label={category} value={category} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Size Selection */}
              <View style={{ marginTop: 30 }}>
                <Text style={Styles.headings}>Size</Text>
                <View style={Styles.dropdownContainer}>
                  <Picker
                    selectedValue={values.size}
                    onValueChange={(itemValue) => setFieldValue("size", itemValue)}
                    style={Styles.picker}
                    dropdownStyle={Styles.dropdownBox}
                    itemStyle={Styles.itemStyle}
                  >
                    <Picker.Item label="Select Size" value="" />
                    {size.map((size) => (
                      <Picker.Item key={size} label={size} value={size} />
                    ))}
                  </Picker>
                </View>
              </View>


              {/* Condition Selection */}
              <View style={{ marginTop: 30 }}>
                <Text style={Styles.headings}>Condition</Text>
                <View style={Styles.radioContainer}>
                  {condition.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={Styles.radioOption}
                      onPress={() => setFieldValue('condition', option)}
                    >
                      <View
                        style={[
                          Styles.radioCircle,
                          values.condition === option && Styles.radioSelected,
                        ]}
                      />
                      <Text style={Styles.radioLabel}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* Quantity Selector */}
              <View style={{ marginTop: 30 }}>
                <Text style={Styles.headings}>Quantity</Text>
                <View style={Styles.quantityContainer}>
                  <Text style={Styles.quantityLabel}>Number of Items:</Text>
                  <TouchableOpacity
                    onPress={() => setFieldValue('quantity', Math.max(values.quantity - 1, 1))}
                    style={Styles.quantityButton}
                  >
                    <Text style={Styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={Styles.quantityText}>{values.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => setFieldValue('quantity', values.quantity + 1)}
                    style={Styles.quantityButton}
                  >
                    <Text style={Styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>


              {/* Fabric Name */}
              <View style={{ marginTop: 30 }}>
                <Text style={Styles.headings}>Fabric</Text>
                <TextInput
                  placeholder="Lawn"
                  onChangeText={handleChange('fabric')}
                  value={values.name}
                  style={Styles.name}
                  placeholderTextColor={theme.colors.ivory}
                  selectionColor={theme.colors.sageGreen}
                />
              </View>
              
              {/* Description */}
              <View style={{ marginTop: 30 }}>
                <Text style={Styles.headings}>Description</Text>
                <TextInput
                  placeholder="Enter description here.."
                  value={values.desc}
                  style={Styles.descri}
                  onChangeText={handleChange('desc')}
                  placeholderTextColor={theme.colors.ivory}
                  selectionColor={theme.colors.sageGreen}
                  keyboardType="default" 
                  editable={true}
                  
                />
              </View>

              {/* Image Selection */}
              <ImagePickerComponent
                maxImages={3}
                selectedImages={values.images}
                onImagesChange={(updatedImages) => setFieldValue('images', updatedImages)}
              />

              {/* Submit Button */}
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={handleSubmit} style={Styles.submitButton}>
                  <Text style={Styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.charcoalBlack,
    flex: 1,
    padding: 10,
    paddingTop: 30,
  },
  submitButton: {
    backgroundColor: theme.colors.sageGreen,
    padding: 10,
    marginTop: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '90%',
  },
  submitButtonText: {
    color: theme.colors.ivory,
    fontWeight: 'bold',
    fontSize: 18,
  },
  headings: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.ivory,
  },
  descri: {
    backgroundColor: theme.colors.TaupeBlack,
    height: 150,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.colors.ivory,
    paddingHorizontal: 17,
    color: theme.colors.ivory,
    fontSize: 16,
    marginTop: 10,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  name: {
    backgroundColor: theme.colors.TaupeBlack,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.colors.ivory,
    paddingHorizontal: 17,
    color: theme.colors.ivory,
    fontSize: 16,
    marginTop: 10,
  },
  line: {
    borderBottomWidth: 1,
    borderColor: theme.colors.sageGreen,
    marginVertical: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    borderColor: theme.colors.sageGreen,
  },
  radioLabel: {
    color: theme.colors.ivory,
    fontSize: 16,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: theme.colors.sageGreen,
    borderRadius: 5,
    backgroundColor: theme.colors.charcoalBlack,
    marginTop: 10,
  },
  picker: {
    height: 50,
    color: theme.colors.ivory,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 20,
    borderRadius: 10,
    borderColor: theme.colors.sageGreen,
    borderWidth: 1,
  },
  quantityLabel: {
    color: theme.colors.ivory,
    fontSize: 16,
    marginRight: 10,
  },
  quantityButton: {
    backgroundColor: theme.colors.sageGreen,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityButtonText: {
    color: theme.colors.ivory,
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    color: theme.colors.ivory,
    fontSize: 15,
  },
});

export default UploadEdu;
