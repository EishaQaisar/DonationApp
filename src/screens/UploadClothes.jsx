import React, { useState , useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import { theme } from "../core/theme";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import CircleLogoStepper2 from '../components/CircleLogoStepper2';
import { Picker } from "@react-native-picker/picker";
import ImagePickerComponent from '../components/ImagePickerComponent'; // Import the new component
import RowOptionButtons from '../components/RowOptionButtons';
import { Formik } from 'formik';

import { AuthContext } from "../context/AuthContext";
import { addClothesDonation } from '../helpers/addClothesDonation';

const UploadClothes = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const tabBarHeight = useBottomTabBarHeight();
  const ageCategories = [
    "0-6 months", "6-9 months", "9-12 months", "1 year", "2 year",
    "3 year", "4 year", "5 year", "6-8 year", "8-12 year",
    "12-18 year", "18-25 year", "25 year onwards"
  ];
  const genderOptions = ['Male', 'Female', 'Unisex'];
  const seasonOptions = ['Summers', 'Spring', 'Autumn', 'Winter'];
  const conditionOptions = ['New', 'Used Once/Twice', 'Heavily Used'];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const itemCategoryOptions=['Clothes', 'Shoes'];
  const clothesCategoryOptions=['Upper Wear', 'Bottom Wear', 'Full Outfit', 'Accessories'];
  const clothingSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const shirtSizes = ['36', '38', '40', '42', '44', '46', '48'];
  const shoeSizes = ['34', '36', '38', '40', '42', '44', '46'];
  const trouserSizes = ['28', '30', '32', '34', '36', '38', '40', '42'];

  // State for form fields
  // State for form field values and errors
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


  const validate = () => {
    let isValid = true;

    if (!season.value) {
      setSeason((prev) => ({ ...prev, error: 'Season is required' }));

      isValid = false;
    }
   
    if (!gender.value) {
      setGender((prev) => ({ ...prev, error: 'Gender is required' }));


      isValid = false;
    }
    if (!ageCategory.value) {
      setAgeCategory((prev) => ({ ...prev, error: 'Age category is required' }));

      isValid = false;
    }
    if (!itemCategory.value) {
      setItemCategory((prev) => ({ ...prev, error: 'Item Category is required' }));

      isValid = false;
    }
    if (itemCategory.value==='Clothes'){
      if (!clothesCategory.value) {
        setClothesCategory((prev) => ({ ...prev, error: 'Clothes Category is required' }));

        isValid = false;
      }
      if (clothesCategory.value==='Upper Wear'){
        if (!upperWearSize.value) {
          setUpperWearSize((prev) => ({ ...prev, error: 'Size is required' }));

          isValid = false;
        }

      }
      if (clothesCategory.value==='Bottom Wear'){
        if (!bottomWearSize.value) {
          setBottomWearSize((prev) => ({ ...prev, error: 'Size is required' }));
          isValid = false;
        }

      }
      if (clothesCategory.value==='Full Outfit'){
        if (!clothingSize.value) {
          setClothingSize((prev) => ({ ...prev, error: 'Size is required' }));

          isValid = false;
        }

      }

    }
    if (itemCategory.value==='Shoes'){
      if (!shoeSize.value){
        setShoeSize((prev) => ({ ...prev, error: 'Size is required' }));
          isValid = false;

      }


    }

    if (!condition.value) {
      setCondition((prev) => ({ ...prev, error: 'Condition is required' }));

      isValid = false;
    }
    if (parseInt(quantity.value) <= 0) {
      setQuantity((prev) => ({ ...prev, error: 'Quantity must be greater than 0' }));
      isValid = false;
    }
    if (parseInt(quantity.value) >1000) {
      setQuantity((prev) => ({ ...prev, error: 'Max limit exceeded' }));
      isValid = false;
    }
    if (!/^\d+$/.test(quantity.value)) {
      setQuantity((prev) => ({ ...prev, error: 'Quantity must be a numeric value' }));
      isValid = false;
    }
    if (clothesCategory.value != 'Accessories' && itemCategory.value!='Shoes'){
      if (!fabric.value) {
        setFabric((prev) => ({ ...prev, error: 'Fabric is required' }));
        isValid = false;
      }
      if (fabric.value.length>20) {
        setFabric((prev) => ({ ...prev, error: 'Too long' }));
        isValid = false;
      }
      if (fabric.value.length<3 && fabric.value.length>0) {
        setFabric((prev) => ({ ...prev, error: 'Too short' }));
        isValid = false;
      }

    }
    
    if (!description.value) {
      setDescription((prev) => ({ ...prev, error: 'Description is required' }));
      isValid = false;
    }
    if (description.value.length>40) {
      setDescription((prev) => ({ ...prev, error: 'Too long' }));
      isValid = false;
    }
    if (description.value.length<3 && description.value.length>0) {
      setDescription((prev) => ({ ...prev, error: 'Too short' }));
      isValid = false;
    }
    if (images.length === 0) {
      setImageErrors('At least one image is required');
      isValid = false;
    } else {
      setImageErrors('');
    }
    console.log("weferf");


    return isValid;
  };

  const onSubmitMethod = async () => {

    const isValid = validate();



    if (!isValid) return;

    const clothesData = {
     
      season: season.value,
      gender: gender.value,
      ageCategory: ageCategory.value,
      itemCategory:itemCategory.value,
      clothesCategory:clothesCategory.value,
      shoeSize:shoeSize.value,
      upperWearSize:upperWearSize.value,
      bottomWearSize:bottomWearSize.value,
      clothingSize:clothingSize.value,

      c_condition: condition.value,
      quantity: quantity.value,
      fabric: fabric.value,
      description:  description.value,
      images:images,
      donorUsername: user.username,

    };

    try {
      await addClothesDonation(clothesData)
      console.log('Clothes donation successfully submitted:', clothesData);
      navigation.navigate("DonationSuccessScreen");
    } catch (error) {
      console.error('Error submitting clothes donation:', error);
    }

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
        <RowOptionButtons
          heading="Season"
          options={seasonOptions}
          selectedValue={season.value}
          onSelect={(value) => setSeason({ value, error: '' })}

        />
        {season.error && <Text style={Styles.errorText}>{season.error}</Text>}

         

         {/*Gender */}
         <View style={{ marginTop: 30 }}>
                <Text style={Styles.headings}>Gender</Text>
                <View style={Styles.radioContainer}>
                  {genderOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={Styles.radioOption}
                      onPress={() => setGender({ value: option, error: '' })} // Update food type
                    >
                      <View
                        style={[
                          Styles.radioCircle,
                          gender.value === option && Styles.radioSelected,
                        ]}
                      />
                      <Text style={Styles.radioLabel}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {gender.error && <Text style={Styles.errorText}>{gender.error}</Text>}
              </View>

        {/* Age Selection */}
        <View style={{ marginTop: 30 }}>
          <Text style={Styles.headings}>Age</Text>
          <View style={Styles.dropdownContainer}>
            <Picker
              selectedValue={ageCategory.value}
              onValueChange={(itemValue) => setAgeCategory({ value: itemValue, error: '' })}

              style={Styles.picker}
            >
              <Picker.Item label="Select an age category" value="" />
              {ageCategories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>
          {ageCategory.error && <Text style={Styles.errorText}>{ageCategory.error}</Text>}

        </View>
         {/*Item Category */}
         <View style={{ marginTop: 30 }}>
          <Text style={Styles.headings}>Item Category</Text>
          <View style={Styles.dropdownContainer}>
            <Picker
              selectedValue={itemCategory.value}
              onValueChange={(itemValue) => setItemCategory({ value: itemValue, error: '' })}

              style={Styles.picker}
            >
              <Picker.Item label="Select Item Category" value="" />
              {itemCategoryOptions.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>
          {itemCategory.error && <Text style={Styles.errorText}>{itemCategory.error}</Text>}

        </View>

        {(itemCategory.value === 'Clothes' ) && (
  <>
    {/* Clothes Category*/}
    <View style={{ marginTop: 30 }}>
      <Text style={Styles.headings}>Clothes Category</Text>
      <View style={Styles.dropdownContainer}>
        <Picker
          selectedValue={clothesCategory.value}
          onValueChange={(itemValue) => setClothesCategory({ value: itemValue, error: '' })}
          style={Styles.picker}
        >
          <Picker.Item label="Select Clothes Category" value="" />
          {clothesCategoryOptions.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>
      {clothesCategory.error && <Text style={Styles.errorText}>{clothesCategory.error}</Text>}
    </View>

    {/* Conditional Size Options based on Clothes Category */}
    {clothesCategory.value === 'Upper Wear' && (
      <View style={{ marginTop: 30 }}>
        <Text style={Styles.headings}>Size</Text>
        <View style={Styles.dropdownContainer}>
          <Picker
            selectedValue={upperWearSize.value}
            onValueChange={(itemValue) => setUpperWearSize({ value: itemValue, error: '' })}
            style={Styles.picker}
          >
            <Picker.Item label="Select Size" value="" />
            {shirtSizes.map((size) => (
              <Picker.Item key={size} label={size} value={size} />
            ))}
          </Picker>
        </View>
        {upperWearSize.error && <Text style={Styles.errorText}>{upperWearSize.error}</Text>}
      </View>
    )}

    {clothesCategory.value === 'Bottom Wear' && (
      <View style={{ marginTop: 30 }}>
        <Text style={Styles.headings}>Size</Text>
        <View style={Styles.dropdownContainer}>
          <Picker
            selectedValue={bottomWearSize.value}
            onValueChange={(itemValue) => setBottomWearSize({ value: itemValue, error: '' })}
            style={Styles.picker}
          >
            <Picker.Item label="Select Size" value="" />
            {trouserSizes.map((size) => (
              <Picker.Item key={size} label={size} value={size} />
            ))}
          </Picker>
        </View>
        {bottomWearSize.error && <Text style={Styles.errorText}>{bottomWearSize.error}</Text>}
      </View>
    )}

    {clothesCategory.value === 'Full Outfit' && (
      <View style={{ marginTop: 30 }}>
        <Text style={Styles.headings}>Size</Text>
        <View style={Styles.dropdownContainer}>
          <Picker
            selectedValue={clothingSize.value}
            onValueChange={(itemValue) => setClothingSize({ value: itemValue, error: '' })}
            style={Styles.picker}
          >
            <Picker.Item label="Select Size" value="" />
            {clothingSizes.map((size) => (
              <Picker.Item key={size} label={size} value={size} />
            ))}
          </Picker>
        </View>
        {clothingSize.error && <Text style={Styles.errorText}>{clothingSize.error}</Text>}
      </View>
    )}
    {/* Fabric Name */}
    {clothesCategory.value != 'Accessories' && (
      <>
      <View style={{ marginTop: 30 }}>
          <Text style={Styles.headings}>Fabric</Text>
          <TextInput
            placeholder="e.g Lawn"
            value={fabric.value}
            onChangeText={(text) => setFabric({ value: text, error: '' })}

            style={Styles.name}
            placeholderTextColor={theme.colors.ivory}
            selectionColor={theme.colors.sageGreen}
          />
                    {fabric.error && <Text style={Styles.errorText}>{fabric.error}</Text>}

        </View>

      </>
    )}
    
  </>
)}
 {(itemCategory.value === 'Shoes' ) && (
  <>
   <View style={{ marginTop: 30 }}>
          <Text style={Styles.headings}>Size</Text>
          <View style={Styles.dropdownContainer}>
            <Picker
              selectedValue={shoeSize.value}
              onValueChange={(itemValue) => setShoeSize({ value: itemValue, error: '' })}

              style={Styles.picker}
            >
              <Picker.Item label="Select Size" value="" />
              {shoeSizes.map((size) => (
                <Picker.Item key={size} label={size} value={size} />
              ))}
            </Picker>
          </View>
          {shoeSize.error && <Text style={Styles.errorText}>{shoeSize.error}</Text>}

        </View>

    </>
 )}

        
       
          
         {/* Condtion */}
         <View style={{ marginTop: 30 }}>
                <Text style={Styles.headings}>Condtion</Text>
                <View style={Styles.radioContainer}>
                  {conditionOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={Styles.radioOption}
                      onPress={() => setCondition({ value: option, error: '' })} 
                    >
                      <View
                        style={[
                          Styles.radioCircle,
                          condition.value === option && Styles.radioSelected,
                        ]}
                      />
                      <Text style={Styles.radioLabel}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {condition.error && <Text style={Styles.errorText}>{condition.error}</Text>}
              </View>

        {/* Quantity Selector */}
        <View style={{ marginTop: 30 }}>
          <Text style={Styles.headings}>Quantity</Text>
          <View style={Styles.quantityContainer}>
          <Text style={Styles.quantityLabel}>Number of Items:</Text>

            <TouchableOpacity
              onPress={() => setQuantity({ value: Math.max(parseInt(quantity.value) - 1, 1).toString(), error:""})}

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
          <Text style={Styles.headings}>Description</Text>
          <TextInput
            placeholder="Enter description here.."
            value={description.value}
            onChangeText={(text) => setDescription({ value: text, error: '' })}

            style={Styles.descri}
            placeholderTextColor={theme.colors.ivory}
            selectionColor={theme.colors.sageGreen}
            multiline={true}
          />
          {description.error && <Text style={Styles.errorText}>{description.error}</Text>}

        </View>

        {/* Image Selection */}
        <ImagePickerComponent
                maxImages={3}
                selectedImages={images}
                onImagesChange={(updatedImages) => {
                  setImageErrors("");
                  setImages(updatedImages)}}
              />
              {imageErrors && <Text style={Styles.errorText}>{imageErrors}</Text>}
        {/* Submit Button */}
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
  quantityInput: {
    color: theme.colors.ivory,
    fontSize: 18,
    textAlign: 'center',
    width: 50,
  },

  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default UploadClothes;
