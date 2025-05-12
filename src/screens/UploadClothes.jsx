"use client"

import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { theme } from "../core/theme";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import CircleLogoStepper2 from '../components/CircleLogoStepper2';
import { Picker } from "@react-native-picker/picker";
import ImagePickerComponent from '../components/ImagePickerComponent';
import RowOptionButtons from '../components/RowOptionButtons';
import { Formik } from 'formik';
import { AuthContext } from "../context/AuthContext";
import { addClothesDonation } from '../helpers/addClothesDonation';
import i18n,{ t } from "../i18n";

// Translation mapping for form values
const valueTranslations = {
  // Season
  "موسم گرما": "Summers",
  "بہار": "Spring",
  "خزاں": "Autumn",
  "سردی": "Winter",

  // Gender
  "مرد": "Male",
  "عورت": "Female",
  "دونوں کے لیے": "Unisex",

  // Condition
  "نیا": "New",
  "ایک/دو بار استعمال شدہ": "Used Once/Twice",
  "زیادہ استعمال شدہ": "Heavily Used",

  // Item Category
  "کپڑے": "Clothes",
  "جوتے": "Shoes",

  // Clothes Category
  "اوپری پہناوا": "Upper Wear",
  "نچلا پہناوا": "Bottom Wear",
  "مکمل لباس": "Full Outfit",
  "اسیسریز": "Accessories"
};

// Function to get English value from Urdu
const getEnglishValue = (urduValue) => {
  return valueTranslations[urduValue] || urduValue;
};

const UploadClothes = ({ navigation }) => {
  const { user, language } = useContext(AuthContext);
  const tabBarHeight = useBottomTabBarHeight();
  const isUrdu = language === "ur";

  // Define options with translations
  const seasonOptions = [
    { en: "Summers", ur: "موسم گرما" },
    { en: "Spring", ur: "بہار" },
    { en: "Autumn", ur: "خزاں" },
    { en: "Winter", ur: "سردی" }
  ];

  const genderOptions = [
    { en: "Male", ur: "مرد" },
    { en: "Female", ur: "عورت" },
    { en: "Unisex", ur: "دونوں کے لیے" }
  ];

  const conditionOptions = [
    { en: "New", ur: "نیا" },
    { en: "Used Once/Twice", ur: "ایک/دو بار استعمال شدہ" },
    { en: "Heavily Used", ur: "زیادہ استعمال شدہ" }
  ];

  const itemCategoryOptions = [
    { en: "Clothes", ur: "کپڑے" },
    { en: "Shoes", ur: "جوتے" }
  ];

  const clothesCategoryOptions = [
    { en: "Upper Wear", ur: "اوپری پہناوا" },
    { en: "Bottom Wear", ur: "نچلا پہناوا" },
    { en: "Full Outfit", ur: "مکمل لباس" },
    { en: "Accessories", ur: "اسیسریز" }
  ];

  // Age categories with translations
  const ageCategories = [
    { en: "0-6 months", ur: "0-6 مہینے" },
    { en: "6-9 months", ur: "6-9 مہینے" },
    { en: "9-12 months", ur: "9-12 مہینے" },
    { en: "1 year", ur: "1 سال" },
    { en: "2 year", ur: "2 سال" },
    { en: "3 year", ur: "3 سال" },
    { en: "4 year", ur: "4 سال" },
    { en: "5 year", ur: "5 سال" },
    { en: "6-8 year", ur: "6-8 سال" },
    { en: "8-12 year", ur: "8-12 سال" },
    { en: "12-18 year", ur: "12-18 سال" },
    { en: "18-25 year", ur: "18-25 سال" },
    { en: "25 year onwards", ur: "25 سال سے آگے" }
  ];

  // Size categories with translations
  const clothingSizes = [
    { en: 'S', ur: 'S' },
    { en: 'M', ur: 'M'},
    { en: 'L', ur: 'L' },
    { en: 'XL', ur:'XL' },
    { en: 'XXL', ur: 'XXL' }
  ];
  
  const shirtSizes = [
    { en: '36', ur: '36' },
    { en: '38', ur: '38' },
    { en: '40', ur: '40' },
    { en: '42', ur: '42' },
    { en: '44', ur: '44' },
    { en: '46', ur: '46' },
    { en: '48', ur: '48' }
  ];
  
  const shoeSizes = [
    { en: '34', ur: '34' },
    { en: '36', ur: '36' },
    { en: '38', ur: '38' },
    { en: '40', ur: '40' },
    { en: '42', ur: '42' },
    { en: '44', ur: '44' },
    { en: '46', ur: '46' }
  ];
  
  const trouserSizes = [
    { en: '28', ur: '28' },
    { en: '30', ur: '30' },
    { en: '32', ur: '32' },
    { en: '34', ur: '34' },
    { en: '36', ur: '36' },
    { en: '38', ur: '38' },
    { en: '40', ur: '40' },
    { en: '42', ur: '42' }
  ];

  // State for form fields
  const [season, setSeason] = useState({ value: '', error: '' });
  const [gender, setGender] = useState({ value: '', error: '' });
  const [ageCategory, setAgeCategory] = useState({ value: '', error: '' });
  const [condition, setCondition] = useState({ value: '', error: '' });
  const [quantity, setQuantity] = useState({ value: '1', error: '' });
  const [fabric, setFabric] = useState({ value: '', error: '' });
  const [description, setDescription] = useState({ value: '', error: '' });
  const [images, setImages] = useState([]);
  const [itemCategory, setItemCategory] = useState({ value: '', error: '' });
  const [clothesCategory, setClothesCategory] = useState({ value: '', error: '' });
  const [upperWearSize, setUpperWearSize] = useState({ value: '', error: '' });
  const [bottomWearSize, setBottomWearSize] = useState({ value: '', error: '' });
  const [clothingSize, setClothingSize] = useState({ value: '', error: '' });
  const [shoeSize, setShoeSize] = useState({ value: '', error: '' });
  const [imageErrors, setImageErrors] = useState('');

  // Helper function to get display text for a specific option
  const getOptionText = (option) => {
    return language === "ur" ? option.ur : option.en;
  };

  // Helper function to get option value
  const getOptionValue = (option) => {
    return option.en; // Always store English value in state
  };

  const validate = () => {
    let isValid = true;

    if (!season.value) {
      setSeason((prev) => ({ ...prev, error: t("uploadClothes.errors.seasonRequired", "Season is required") }));
      isValid = false;
    }
   
    if (!gender.value) {
      setGender((prev) => ({ ...prev, error: t("uploadClothes.errors.genderRequired", "Gender is required") }));
      isValid = false;
    }
    
    if (!ageCategory.value) {
      setAgeCategory((prev) => ({ ...prev, error: t("uploadClothes.errors.ageRequired", "Age category is required") }));
      isValid = false;
    }
    
    if (!itemCategory.value) {
      setItemCategory((prev) => ({ ...prev, error: t("uploadClothes.errors.itemCategoryRequired", "Item Category is required") }));
      isValid = false;
    }
    
    if (itemCategory.value === 'Clothes' || getEnglishValue(itemCategory.value) === 'Clothes') {
      if (!clothesCategory.value) {
        setClothesCategory((prev) => ({ ...prev, error: t("uploadClothes.errors.clothesCategoryRequired", "Clothes Category is required") }));
        isValid = false;
      }
      
      if (clothesCategory.value === 'Upper Wear' || getEnglishValue(clothesCategory.value) === 'Upper Wear') {
        if (!upperWearSize.value) {
          setUpperWearSize((prev) => ({ ...prev, error: t("uploadClothes.errors.sizeRequired", "Size is required") }));
          isValid = false;
        }
      }
      
      if (clothesCategory.value === 'Bottom Wear' || getEnglishValue(clothesCategory.value) === 'Bottom Wear') {
        if (!bottomWearSize.value) {
          setBottomWearSize((prev) => ({ ...prev, error: t("uploadClothes.errors.sizeRequired", "Size is required") }));
          isValid = false;
        }
      }
      
      if (clothesCategory.value === 'Full Outfit' || getEnglishValue(clothesCategory.value) === 'Full Outfit') {
        if (!clothingSize.value) {
          setClothingSize((prev) => ({ ...prev, error: t("uploadClothes.errors.sizeRequired", "Size is required") }));
          isValid = false;
        }
      }
    }
    
    if (itemCategory.value === 'Shoes' || getEnglishValue(itemCategory.value) === 'Shoes') {
      if (!shoeSize.value) {
        setShoeSize((prev) => ({ ...prev, error: t("uploadClothes.errors.sizeRequired", "Size is required") }));
        isValid = false;
      }
    }

    if (!condition.value) {
      setCondition((prev) => ({ ...prev, error: t("uploadClothes.errors.conditionRequired", "Condition is required") }));
      isValid = false;
    }
    
    if (parseInt(quantity.value) <= 0) {
      setQuantity((prev) => ({ ...prev, error: t("uploadClothes.errors.quantityPositive", "Quantity must be greater than 0") }));
      isValid = false;
    }
    
    if (parseInt(quantity.value) > 1000) {
      setQuantity((prev) => ({ ...prev, error: t("uploadClothes.errors.quantityTooLarge", "Max limit exceeded") }));
      isValid = false;
    }
    
    if (!/^\d+$/.test(quantity.value)) {
      setQuantity((prev) => ({ ...prev, error: t("uploadClothes.errors.quantityNumeric", "Quantity must be a numeric value") }));
      isValid = false;
    }
    
    if ((clothesCategory.value !== 'Accessories' && getEnglishValue(clothesCategory.value) !== 'Accessories') && 
        (itemCategory.value !== 'Shoes' && getEnglishValue(itemCategory.value) !== 'Shoes')) {
      if (!fabric.value) {
        setFabric((prev) => ({ ...prev, error: t("uploadClothes.errors.fabricRequired", "Fabric is required") }));
        isValid = false;
      }
      if (fabric.value.trim() === "") {
        setFabric((prev) => ({
          ...prev,
          error: t("uploadClothes.errors.fabricWhitespace", "Fabric cannot contain only spaces"),
        }))
        isValid = false
      } 
      if (fabric.value.length > 20) {
        setFabric((prev) => ({ ...prev, error: t("uploadClothes.errors.fabricTooLong", "Too long") }));
        isValid = false;
      }
      
      if (fabric.value.length < 3 && fabric.value.length > 0) {
        setFabric((prev) => ({ ...prev, error: t("uploadClothes.errors.fabricTooShort", "Too short") }));
        isValid = false;
      }
    }
    
    if (!description.value) {
      setDescription((prev) => ({ ...prev, error: t("uploadClothes.errors.descriptionRequired", "Description is required") }));
      isValid = false;
    }
    if (description.value.trim() === "") {
      setDescription((prev) => ({
        ...prev,
        error: t("uploadClothes.errors.descriptionWhitespace", "Description cannot contain only spaces"),
      }))
      isValid = false
    }
    
    if (description.value.length > 40) {
      setDescription((prev) => ({ ...prev, error: t("uploadClothes.errors.descriptionTooLong", "Too long") }));
      isValid = false;
    }
    
    if (description.value.length < 3 && description.value.length > 0) {
      setDescription((prev) => ({ ...prev, error: t("uploadClothes.errors.descriptionTooShort", "Too short") }));
      isValid = false;
    }
    
    if (images.length === 0) {
      setImageErrors(t("uploadClothes.errors.imageRequired", "At least one image is required"));
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
    const clothesData = {
      season: language === "ur" ? getEnglishValue(season.value) : season.value,
      gender: language === "ur" ? getEnglishValue(gender.value) : gender.value,
      ageCategory: ageCategory.value,
      itemCategory: language === "ur" ? getEnglishValue(itemCategory.value) : itemCategory.value,
      clothesCategory: language === "ur" ? getEnglishValue(clothesCategory.value) : clothesCategory.value,
      shoeSize: shoeSize.value,
      upperWearSize: upperWearSize.value,
      bottomWearSize: bottomWearSize.value,
      clothingSize: clothingSize.value,
      c_condition: language === "ur" ? getEnglishValue(condition.value) : condition.value,
      quantity: quantity.value,
      fabric: fabric.value,
      description: description.value,
      images: images,
      donorUsername: user.username,
      donorCity:user.city
    };

    try {
      await addClothesDonation(clothesData);
      console.log('Clothes donation successfully submitted:', clothesData);
      navigation.navigate("DonationSuccessScreen");
    } catch (error) {
      console.error('Error submitting clothes donation:', error);
    }
  };

  // Custom RowOptionButtons component that supports translations
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
                selectedValue === option.en && Styles.selectedOptionText
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
              {/* Season Selection */}
              <BilingualRowOptionButtons
                heading={t("uploadClothes.season", "Season")}
                options={seasonOptions}
                selectedValue={season.value}
                onSelect={(value) => setSeason({ value, error: '' })}
              />
              {season.error && <Text style={Styles.errorText}>{season.error}</Text>}

              {/* Gender */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadClothes.gender", "Gender")}</Text>
                <View style={Styles.radioContainer}>
                  {genderOptions.map((option) => (
                    <TouchableOpacity
                      key={option.en}
                      style={Styles.radioOption}
                      onPress={() => setGender({ value: option.en, error: '' })}
                    >
                      <View
                        style={[
                          Styles.radioCircle,
                          gender.value === option.en && Styles.radioSelected
                        ]}
                      />
                      <Text style={[
                        Styles.radioLabel,
                        isUrdu && Styles.urduRadioLabel
                      ]}>
                        {getOptionText(option)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {gender.error && <Text style={Styles.errorText}>{gender.error}</Text>}
              </View>

              {/* Age Selection */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadClothes.age", "Age")}</Text>
                <View style={Styles.dropdownContainer}>
                  <Picker
                    selectedValue={ageCategory.value}
                    onValueChange={(itemValue) => setAgeCategory({ value: itemValue, error: '' })}
                    style={[Styles.picker, isUrdu && Styles.urduPicker]}
                  >
                    <Picker.Item label={t("uploadClothes.selectAge", "Select an age category")} value="" />
                    {ageCategories.map((category) => (
                      <Picker.Item 
                        key={category.en} 
                        label={language === "ur" ? category.ur : category.en} 
                        value={category.en} 
                      />
                    ))}
                  </Picker>
                </View>
                {ageCategory.error && <Text style={Styles.errorText}>{ageCategory.error}</Text>}
              </View>

              {/* Item Category */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadClothes.itemCategory", "Item Category")}</Text>
                <View style={Styles.dropdownContainer}>
                  <Picker
                    selectedValue={itemCategory.value}
                    onValueChange={(itemValue) => setItemCategory({ value: itemValue, error: '' })}
                    style={[Styles.picker, isUrdu && Styles.urduPicker]}
                  >
                    <Picker.Item label={t("uploadClothes.selectItemCategory", "Select Item Category")} value="" />
                    {itemCategoryOptions.map((option) => (
                      <Picker.Item key={option.en} label={getOptionText(option)} value={option.en} />
                    ))}
                  </Picker>
                </View>
                {itemCategory.error && <Text style={Styles.errorText}>{itemCategory.error}</Text>}
              </View>

              {(itemCategory.value === 'Clothes' || getEnglishValue(itemCategory.value) === 'Clothes') && (
                <>
                  {/* Clothes Category*/}
                  <View style={{ marginTop: 30 }}>
                    <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadClothes.clothesCategory", "Clothes Category")}</Text>
                    <View style={Styles.dropdownContainer}>
                      <Picker
                        selectedValue={clothesCategory.value}
                        onValueChange={(itemValue) => setClothesCategory({ value: itemValue, error: '' })}
                        style={[Styles.picker, isUrdu && Styles.urduPicker]}
                      >
                        <Picker.Item label={t("uploadClothes.selectClothesCategory", "Select Clothes Category")} value="" />
                        {clothesCategoryOptions.map((option) => (
                          <Picker.Item key={option.en} label={getOptionText(option)} value={option.en} />
                        ))}
                      </Picker>
                    </View>
                    {clothesCategory.error && <Text style={Styles.errorText}>{clothesCategory.error}</Text>}
                  </View>

                  {/* Conditional Size Options based on Clothes Category */}
                  {(clothesCategory.value === 'Upper Wear' || getEnglishValue(clothesCategory.value) === 'Upper Wear') && (
                    <View style={{ marginTop: 30 }}>
                      <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadClothes.size", "Size")}</Text>
                      <View style={Styles.dropdownContainer}>
                        <Picker
                          selectedValue={upperWearSize.value}
                          onValueChange={(itemValue) => setUpperWearSize({ value: itemValue, error: '' })}
                          style={[Styles.picker, isUrdu && Styles.urduPicker]}
                        >
                          <Picker.Item label={t("uploadClothes.selectSize", "Select Size")} value="" />
                          {shirtSizes.map((size) => (
                            <Picker.Item 
                              key={size.en} 
                              label={language === "ur" ? size.ur : size.en} 
                              value={size.en} 
                            />
                          ))}
                        </Picker>
                      </View>
                      {upperWearSize.error && <Text style={Styles.errorText}>{upperWearSize.error}</Text>}
                    </View>
                  )}

                  {(clothesCategory.value === 'Bottom Wear' || getEnglishValue(clothesCategory.value) === 'Bottom Wear') && (
                    <View style={{ marginTop: 30 }}>
                      <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadClothes.size", "Size")}</Text>
                      <View style={Styles.dropdownContainer}>
                        <Picker
                          selectedValue={bottomWearSize.value}
                          onValueChange={(itemValue) => setBottomWearSize({ value: itemValue, error: '' })}
                          style={[Styles.picker, isUrdu && Styles.urduPicker]}
                        >
                          <Picker.Item label={t("uploadClothes.selectSize", "Select Size")} value="" />
                          {trouserSizes.map((size) => (
                            <Picker.Item 
                              key={size.en} 
                              label={language === "ur" ? size.ur : size.en} 
                              value={size.en} 
                            />
                          ))}
                        </Picker>
                      </View>
                      {bottomWearSize.error && <Text style={Styles.errorText}>{bottomWearSize.error}</Text>}
                    </View>
                  )}

                  {(clothesCategory.value === 'Full Outfit' || getEnglishValue(clothesCategory.value) === 'Full Outfit') && (
                    <View style={{ marginTop: 30 }}>
                      <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadClothes.size", "Size")}</Text>
                      <View style={Styles.dropdownContainer}>
                        <Picker
                          selectedValue={clothingSize.value}
                          onValueChange={(itemValue) => setClothingSize({ value: itemValue, error: '' })}
                          style={[Styles.picker, isUrdu && Styles.urduPicker]}
                        >
                          <Picker.Item label={t("uploadClothes.selectSize", "Select Size")} value="" />
                          {clothingSizes.map((size) => (
                            <Picker.Item 
                              key={size.en} 
                              label={language === "ur" ? size.ur : size.en} 
                              value={size.en} 
                            />
                          ))}
                        </Picker>
                      </View>
                      {clothingSize.error && <Text style={Styles.errorText}>{clothingSize.error}</Text>}
                    </View>
                  )}

                  {/* Fabric Name */}
                  {(clothesCategory.value !== 'Accessories' && getEnglishValue(clothesCategory.value) !== 'Accessories') && (
                    <View style={{ marginTop: 30 }}>
                      <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadClothes.fabric", "Fabric")}</Text>
                      <TextInput
                        placeholder={t("uploadClothes.fabricPlaceholder", "e.g Lawn")}
                        value={fabric.value}
                        onChangeText={(text) => setFabric({ value: text, error: '' })}
                        style={[Styles.name, isUrdu && Styles.urduInput]}
                        placeholderTextColor={theme.colors.ivory}
                        selectionColor={theme.colors.sageGreen}
                        textAlign={isUrdu ? 'right' : 'left'} // Add this line

                      />
                      {fabric.error && <Text style={Styles.errorText}>{fabric.error}</Text>}
                    </View>
                  )}
                </>
              )}

              {(itemCategory.value === 'Shoes' || getEnglishValue(itemCategory.value) === 'Shoes') && (
                <View style={{ marginTop: 30 }}>
                  <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadClothes.size", "Size")}</Text>
                  <View style={Styles.dropdownContainer}>
                    <Picker
                      selectedValue={shoeSize.value}
                      onValueChange={(itemValue) => setShoeSize({ value: itemValue, error: '' })}
                      style={[Styles.picker, isUrdu && Styles.urduPicker]}
                    >
                      <Picker.Item label={t("uploadClothes.selectSize", "Select Size")} value="" />
                      {shoeSizes.map((size) => (
                        <Picker.Item 
                          key={size.en} 
                          label={language === "ur" ? size.ur : size.en} 
                          value={size.en} 
                        />
                      ))}
                    </Picker>
                  </View>
                  {shoeSize.error && <Text style={Styles.errorText}>{shoeSize.error}</Text>}
                </View>
              )}

              {/* Condition */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadClothes.condition", "Condition")}</Text>
                <View style={Styles.radioContainer}>
                  {conditionOptions.map((option) => (
                    <TouchableOpacity
                      key={option.en}
                      style={Styles.radioOption}
                      onPress={() => setCondition({ value: option.en, error: '' })}
                    >
                      <View
                        style={[
                          Styles.radioCircle,
                          condition.value === option.en && Styles.radioSelected
                        ]}
                      />
                      <Text style={[
                        Styles.radioLabel,
                        isUrdu && Styles.urduRadioLabel
                      ]}>
                        {getOptionText(option)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {condition.error && <Text style={Styles.errorText}>{condition.error}</Text>}
              </View>

              {/* Quantity Selector */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadClothes.quantity", "Quantity")}</Text>
                <View style={Styles.quantityContainer}>
                  <Text style={[
                    Styles.quantityLabel,
                    isUrdu && Styles.urduQuantityLabel
                  ]}>
                    {t("uploadClothes.numberOfItems", "Number of Items:")}
                  </Text>

                  <TouchableOpacity
                    onPress={() => setQuantity({ value: Math.max(parseInt(quantity.value) - 1, 1).toString(), error: "" })}
                    style={Styles.quantityButton}
                  >
                    <Text style={Styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={Styles.quantityInput}
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
                {quantity.error && <Text style={Styles.errorText}>{quantity.error}</Text>}
              </View>

              {/* Description */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>{t("uploadClothes.description", "Description")}</Text>
                <TextInput
                  placeholder={t("uploadClothes.descriptionPlaceholder", "Enter description here..")}
                  value={description.value}
                  onChangeText={(text) => setDescription({ value: text, error: '' })}
                  style={[Styles.descri, isUrdu && Styles.urduInput]}
                  placeholderTextColor={theme.colors.ivory}
                  selectionColor={theme.colors.sageGreen}
                  multiline={true}
                  textAlign={isUrdu ? 'right' : 'left'} // Add this line

                />
                {description.error && <Text style={Styles.errorText}>{description.error}</Text>}
              </View>

              {/* Image Selection */}
              <ImagePickerComponent
                maxImages={3}
                selectedImages={images}
                onImagesChange={(updatedImages) => {
                  setImageErrors("");
                  setImages(updatedImages);
                }}
              />
              {imageErrors && <Text style={Styles.errorText}>{imageErrors}</Text>}

              {/* Submit Button */}
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={handleSubmit} style={Styles.submitButton}>
                  <Text style={[Styles.submitButtonText, isUrdu && Styles.urduSubmitButtonText]}>
                    {t("uploadClothes.submit", "Submit")}
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
    backgroundColor: theme.colors.pearlWhite,
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
    backgroundColor: theme.colors.outerSpace,
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
  headings: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.ivory,
  },
  urduHeadings: {
    fontSize: 20, // Increased font size for Urdu headings
  },
  descri: {
    backgroundColor: theme.colors.outerSpace,
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
  urduInput: {
    fontSize: 18, // Increased font size for Urdu input
  },
  name: {
    backgroundColor: theme.colors.pearlWhite,
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
  urduRadioLabel: {
    fontSize: 18, // Increased font size for Urdu radio labels
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
  urduPicker: {
    fontSize: 18, // Increased font size for Urdu picker
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
  errorText: {
    color: 'red',
    fontSize: i18n.locale=='ur'?14:12,
    marginTop: 5,
  },
});

export default UploadClothes;