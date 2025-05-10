"use client"

import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { theme } from "../core/theme";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Formik } from 'formik';
import CircleLogoStepper2 from '../components/CircleLogoStepper2';
import RowOptionButtons from '../components/RowOptionButtons';
import ImagePickerComponent from '../components/ImagePickerComponent';
import { addFoodDonation } from '../helpers/addFoodDonation';
import { AuthContext } from "../context/AuthContext";
import { t } from "../i18n";

// Translation mapping for form values
const valueTranslations = {
  // Meal Types
  "ناشتہ": "Breakfast",
  "برنچ": "Brunch",
  "دوپہر کا کھانا": "Lunch",
  "رات کا کھانا": "Dinner",

  // Food Types
  "خام": "Raw",
  "پکا ہوا": "Cooked",
  "پیکیج شدہ": "Packaged"
};

// Function to get English value from Urdu
const getEnglishValue = (urduValue) => {
  return valueTranslations[urduValue] || urduValue;
};

const UploadFood = ({navigation}) => {
  const { user, isRTL, language } = useContext(AuthContext);
  const tabBarHeight = useBottomTabBarHeight();
  const isUrdu = language === "ur";
  
  // Define options with translations
  const mealOptions = [
    { en: "Breakfast", ur: "ناشتہ" },
    { en: "Brunch", ur: "برنچ" },
    { en: "Lunch", ur: "دوپہر " },
    { en: "Dinner", ur: "رات" }
  ];
  
  const foodOptions = [
    { en: "Raw", ur: "خام" },
    { en: "Cooked", ur: "پکا ہوا" },
    { en: "Packaged", ur: "پیکیج شدہ" }
  ];
  
  // States for form field values and errors
  const [name, setName] = useState({ value: '', error: '' });
  const [desc, setDesc] = useState({ value: '', error: '' });
  const [selectedMeal, setSelectedMeal] = useState({ value: '', error: '' });
  const [foodType, setFoodType] = useState({ value: '', error: '' });
  const [quantity, setQuantity] = useState({ value: '1', error: '' });
  const [images, setImages] = useState([]);
  const [imageErrors, setImageErrors] = useState('');
  
  // Helper function to get display value based on language
  const getDisplayValue = (options, value) => {
    if (!value) return "";

    // If we're in Urdu mode, find the option with matching English value and return its Urdu value
    if (language === "ur") {
      const option = options.find((opt) => opt.en === value);
      return option ? option.ur : value;
    }

    return value;
  };

  // Helper function to get display text for a specific option
  const getOptionText = (option) => {
    return language === "ur" ? option.ur : option.en;
  };

  const validate = () => {
    let isValid = true;

    if (!name.value) {
      setName((prev) => ({ ...prev, error: t("uploadFood.errors.nameRequired", "Food Name is required") }));
      isValid = false;
    }
    if (name.value.length < 3 && name.value.length > 0) {
      setName((prev) => ({ ...prev, error: t("uploadFood.errors.nameTooShort", "Too short") }));
      isValid = false;
    }
    if (name.value.length > 15) {
      setName((prev) => ({ ...prev, error: t("uploadFood.errors.nameTooLong", "Too long") }));
      isValid = false;
    }

    if (!desc.value) {
      setDesc((prev) => ({ ...prev, error: t("uploadFood.errors.descriptionRequired", "Description is required") }));
      isValid = false;
    }
    if (desc.value.length > 40) {
      setDesc((prev) => ({ ...prev, error: t("uploadFood.errors.descriptionTooLong", "Too long") }));
      isValid = false;
    }
    if (desc.value.length < 3 && desc.value.length > 0) {
      setDesc((prev) => ({ ...prev, error: t("uploadFood.errors.descriptionTooShort", "Too short") }));
      isValid = false;
    }

    if (!selectedMeal.value) {
      setSelectedMeal((prev) => ({ ...prev, error: t("uploadFood.errors.mealRequired", "Meal Type is required") }));
      isValid = false;
    }

    if (!foodType.value) {
      setFoodType((prev) => ({ ...prev, error: t("uploadFood.errors.foodTypeRequired", "Food Type is required") }));
      isValid = false;
    }

    if (parseInt(quantity.value) <= 0) {
      setQuantity((prev) => ({ ...prev, error: t("uploadFood.errors.quantityPositive", "Quantity must be greater than 0") }));
      isValid = false;
    }
    if (parseInt(quantity.value) > 1000) {
      setQuantity((prev) => ({ ...prev, error: t("uploadFood.errors.quantityTooLarge", "Max limit exceeded") }));
      isValid = false;
    }
    if (!/^\d+$/.test(quantity.value)) {
      setQuantity((prev) => ({ ...prev, error: t("uploadFood.errors.quantityNumeric", "Quantity must be a numeric value") }));
      isValid = false;
    }

    if (images.length === 0) {
      setImageErrors(t("uploadFood.errors.imageRequired", "At least one image is required"));
      isValid = false;
    } else {
      setImageErrors('');
    }

    return isValid;
  };

  const onSubmitMethod = async () => {
    const isValid = validate();

    if (!isValid) return;

    // Convert Urdu values to English if needed
    const foodData = {
      foodName: name.value, // Keep original text
      description: desc.value, // Keep original text
      mealType: language === "ur" ? getEnglishValue(selectedMeal.value) : selectedMeal.value,
      foodType: language === "ur" ? getEnglishValue(foodType.value) : foodType.value,
      quantity: quantity.value,
      images: images,
      donorUsername: user.username,
      donorCity:user.username
    };

    try {
      await addFoodDonation(foodData);
      console.log('Food donation successfully submitted:', foodData);
      navigation.navigate("DonationSuccessScreen");
    } catch (error) {
      console.error('Error submitting food donation:', error);
    }
  };

  // Custom RowOptionButtons component that supports RTL and translations
  const BilingualRowOptionButtons = ({ heading, options, selectedValue, onSelect }) => {
    return (
      <View style={{ marginTop: 30 }}>
        <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{heading}</Text>
        <View style={Styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.en}
              style={[
                Styles.optionButton,
                selectedValue === option.en && Styles.selectedOption,
              ]}
              onPress={() => onSelect(option.en)}
            >
              <Text style={[
                Styles.optionText,
                isUrdu && Styles.urduOptionText,
                selectedValue === option.en && Styles.selectedOptionText,
                isRTL && { textAlign: "right" }
              ]}>
                {getOptionText(option)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={[Styles.container, { marginBottom: tabBarHeight }]}>
      <ScrollView>
        <CircleLogoStepper2 />
        <View style={Styles.line} />

        <Formik
          initialValues={{}}
          onSubmit={onSubmitMethod}
        >
          {({ handleSubmit }) => (
            <>
              {/* Meal Time Selection */}
              <BilingualRowOptionButtons
                heading={t("uploadFood.meal", "Meal")}
                options={mealOptions}
                selectedValue={selectedMeal.value}
                onSelect={(meal) => setSelectedMeal({ value: meal, error: '' })}
              />
              {selectedMeal.error && <Text style={[Styles.errorText]}>{selectedMeal.error}</Text>}

              {/* Food Name */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadFood.foodName", "Food Name")}</Text>
                <TextInput
                  placeholder={t("uploadFood.foodNamePlaceholder", "Rice")}
                  onChangeText={(text) => setName({ value: text, error: '' })}
                  value={name.value}
                  style={[Styles.name, isUrdu && Styles.urduInput]}
                  placeholderTextColor={theme.colors.ivory}
                  selectionColor={theme.colors.sageGreen}
                  textAlign={isUrdu ? 'right' : 'left'} // Add this line

                />
                {name.error && <Text style={[Styles.errorText]}>{name.error}</Text>}
              </View>

              {/* Food Type */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadFood.foodType", "Food Type")}</Text>
                <View style={Styles.radioContainer}>
                  {foodOptions.map((option) => (
                    <TouchableOpacity
                      key={option.en}
                      style={[Styles.radioOption]}
                      onPress={() => setFoodType({ value: option.en, error: '' })}
                    >
                      <View
                        style={[
                          Styles.radioCircle,
                          foodType.value === option.en && Styles.radioSelected,
                          isRTL && { marginRight: 0, marginLeft: 10 },
                        ]}
                      />
                      <Text style={[Styles.radioLabel, isUrdu && Styles.urduRadioLabel]}>{getOptionText(option)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {foodType.error && <Text style={[Styles.errorText]}>{foodType.error}</Text>}
              </View>

              {/* Quantity Selector */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadFood.servings", "Servings")}</Text>
                <View style={Styles.quantityContainer}>
                  <Text style={[Styles.quantityLabel, isUrdu && Styles.urduQuantityLabel]}>
                    {t("uploadFood.numberOfPeople", "Number of People:")}
                  </Text>

                  <TouchableOpacity
                    onPress={() => setQuantity({ value: Math.max(parseInt(quantity.value) - 1, 1).toString(), error:""})}
                    style={Styles.quantityButton}
                  >
                    <Text style={Styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[Styles.quantityInput]}
                    value={quantity.value}
                    keyboardType="numeric"
                    onChangeText={(text) => setQuantity({ value: text, error: '' })}

                  />
                  <TouchableOpacity
                    onPress={() => setQuantity({ value: (parseInt(quantity.value) + 1).toString(), error: '' })}
                    style={Styles.quantityButton}
                  >
                    <Text style={Styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                {quantity.error && <Text style={[Styles.errorText]}>{quantity.error}</Text>}
              </View>

              {/* Description */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadFood.description", "Description")}</Text>
                <TextInput
                  placeholder={t("uploadFood.descriptionPlaceholder", "Enter description here..")}
                  onChangeText={(text) => setDesc({ value: text, error: '' })}
                  value={desc.value}
                  style={[Styles.descri, isUrdu && Styles.urduInput]}
                  placeholderTextColor={theme.colors.ivory}
                  selectionColor={theme.colors.sageGreen}
                  multiline={true}
                  textAlign={isUrdu ? 'right' : 'left'} // Add this line

                />
                {desc.error && <Text style={[Styles.errorText]}>{desc.error}</Text>}
              </View>

              {/* Image Selection */}
              <ImagePickerComponent
                maxImages={3}
                selectedImages={images}
                onImagesChange={(updatedImages) => {
                  setImages(updatedImages);
                  setImageErrors("");
                }}
              />
              {imageErrors && <Text style={Styles.errorText}>{imageErrors}</Text>}

              {/* Submit Button */}
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={handleSubmit} style={Styles.submitButton}>
                  <Text style={[Styles.submitButtonText, isUrdu && Styles.urduSubmitButtonText]}>
                    {t("uploadFood.submit", "Submit")}
                  </Text>
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
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: theme.colors.TaupeBlack,
    borderWidth: 1,
    borderColor: theme.colors.ivory,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: '48%',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: theme.colors.sageGreen,
    borderColor: theme.colors.sageGreen,
  },
  optionText: {
    color: theme.colors.ivory,
    fontSize: 14,
  },
  urduOptionText: {
    fontSize: 16, // Increased font size for Urdu
    fontWeight: '500',
  },
  selectedOptionText: {
    fontWeight: 'bold',
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
  urduQuantityLabel: {
    fontSize: 18, // Increased font size for Urdu quantity label
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
  quantityInput: {
    color: theme.colors.ivory,
    fontSize: 18,
    textAlign: 'center',
    width: 50,
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
  urduSubmitButtonText: {
    fontSize: 20, // Increased font size for Urdu
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
    textAlignVertical: 'top',
    paddingTop: 15,
    marginTop: 10,
  },
  urduInput: {
    fontSize: 18, // Increased font size for Urdu input
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
  headings: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.ivory,
  },
  urduHeadings: {
    fontSize: 20, // Increased font size for Urdu headings
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
    borderRadius: 10, // Makes it circular
    borderWidth: 2,
    borderColor: theme.colors.sageGreen,
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: theme.colors.sageGreen, // Fill the circle when selected
    borderColor: theme.colors.sageGreen,
  },
  radioLabel: {
    color: theme.colors.ivory,
    fontSize: 16,
  },
  urduRadioLabel: {
    fontSize: 18, // Increased font size for Urdu radio labels
  },
  line: {
    borderBottomWidth: 1,
    borderColor: theme.colors.sageGreen,
    marginVertical: 10,
  },
  errorText: {
    color: 'red', // Adjust color for error messages
    fontSize: 12,
    marginTop: 5,
    marginLeft: 15,
  },
});

export default UploadFood;