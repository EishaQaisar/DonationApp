import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import { theme } from "../core/theme";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Formik } from 'formik';
import CircleLogoStepper2 from '../components/CircleLogoStepper2';
import RowOptionButtons from '../components/RowOptionButtons';
import ImagePickerComponent from '../components/ImagePickerComponent'; // Import the new component
import { addFoodDonation } from '../helpers/addFoodDonation';
import { AuthContext } from "../context/AuthContext";


const UploadFood = ({navigation}) => {
  const { user } = useContext(AuthContext);
  const tabBarHeight = useBottomTabBarHeight();
  const mealOptions = ['Breakfast', 'Brunch', 'Lunch', 'Dinner'];
  const [images, setImages] = useState([]);
  
  // States for form field values and errors
  const [name, setName] = useState({ value: '', error: '' });
  const [desc, setDesc] = useState({ value: '', error: '' });
  const [selectedMeal, setSelectedMeal] = useState({ value: '', error: '' });
  const [foodType, setFoodType] = useState({ value: '', error: '' });
  const [quantity, setQuantity] = useState({ value: '1', error: '' });
  const [imageErrors, setImageErrors] = useState('');
  
  const foodOptions = ['Raw', 'Cooked', 'Packaged'];

  const validate = () => {
    let isValid = true;

    if (!name.value) {
      setName((prev) => ({ ...prev, error: 'Food Name is required' }));
      isValid = false;
    }
    if (name.value.length<3 && name.value.length>0) {
      setName((prev) => ({ ...prev, error: 'Too short' }));
      isValid = false;
    }
    if (name.value.length>15) {
      setName((prev) => ({ ...prev, error: 'Too long' }));
      isValid = false;
    }

    if (!desc.value) {
      setDesc((prev) => ({ ...prev, error: 'Description is required' }));
      isValid = false;
    }
    if (desc.value.length>40) {
      setDesc((prev) => ({ ...prev, error: 'Too long' }));
      isValid = false;
    }
    if (desc.value.length<3 && desc.value.length>0) {
      setDesc((prev) => ({ ...prev, error: 'Too short' }));
      isValid = false;
    }

    if (!selectedMeal.value) {
      setSelectedMeal((prev) => ({ ...prev, error: 'Meal Type is required' }));
      isValid = false;
    }

    if (!foodType.value) {
      setFoodType((prev) => ({ ...prev, error: 'Food Type is required' }));
      isValid = false;
    }

    if (parseInt(quantity.value) <= 0) {
      setQuantity((prev) => ({ ...prev, error: 'Quantity must be greater than 0' }));
      isValid = false;
    }
    if (parseInt(quantity.value) > 1000) {
      setQuantity((prev) => ({ ...prev, error: 'Max limit exceeded' }));
      isValid = false;
    }
    if (!/^\d+$/.test(quantity.value)) {
      setQuantity((prev) => ({ ...prev, error: 'Quantity must be a numeric value' }));
      isValid = false;
    }

    if (images.length === 0) {
      setImageErrors('At least one image is required');
      isValid = false;
    } else {
      setImageErrors('');
    }

    return isValid;
  };

  const onSubmitMethod = async () => {
    const isValid = validate();

    if (!isValid) return;

    const foodData = {
      foodName: name.value,
      description: desc.value,
      mealType: selectedMeal.value,
      foodType: foodType.value,
      quantity: quantity.value,
      images: images,
      donorUsername: user.username,
    };

    try {
      await addFoodDonation(foodData);
      console.log('Food donation successfully submitted:', foodData);
      navigation.navigate("DonationSuccessScreen");
    } catch (error) {
      console.error('Error submitting food donation:', error);
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
              {/* Meal Time Selection */}
              <RowOptionButtons
                heading="Meal"
                options={mealOptions}
                selectedValue={selectedMeal.value}
                onSelect={(meal) => setSelectedMeal({ value: meal, error: '' })}
              />
              {selectedMeal.error && <Text style={Styles.errorText}>{selectedMeal.error}</Text>}

              {/* Food Name */}
              <View style={{ marginTop: 30 }}>
                <Text style={Styles.headings}>Food Name</Text>
                <TextInput
                  placeholder="Rice"
                  onChangeText={(text) => setName({ value: text, error: '' })}
                  value={name.value}
                  style={Styles.name}
                  placeholderTextColor={theme.colors.ivory}
                  selectionColor={theme.colors.sageGreen}
                />
                {name.error && <Text style={Styles.errorText}>{name.error}</Text>}
              </View>

              {/* Food Type */}
              <View style={{ marginTop: 30 }}>
                <Text style={Styles.headings}>Food Type</Text>
                <View style={Styles.radioContainer}>
                  {foodOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={Styles.radioOption}
                      onPress={() => setFoodType({ value: option, error: '' })} // Update food type
                    >
                      <View
                        style={[
                          Styles.radioCircle,
                          foodType.value === option && Styles.radioSelected,
                        ]}
                      />
                      <Text style={Styles.radioLabel}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {foodType.error && <Text style={Styles.errorText}>{foodType.error}</Text>}
              </View>

              {/* Quantity Selector */}
              <View style={{ marginTop: 30 }}>
          <Text style={Styles.headings}>Servings</Text>
          <View style={Styles.quantityContainer}>
          <Text style={Styles.quantityLabel}>Number of People:</Text>

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
                  onChangeText={(text) => setDesc({ value: text, error: '' })}
                  value={desc.value}
                  style={Styles.descri}
                  placeholderTextColor={theme.colors.ivory}
                  selectionColor={theme.colors.sageGreen}
                  multiline={true}
                />
                {desc.error && <Text style={Styles.errorText}>{desc.error}</Text>}
              </View>

              {/* Image Selection */}
              <ImagePickerComponent
                maxImages={3}
                selectedImages={images}
                onImagesChange={(updatedImages) => {setImages(updatedImages);
                   setImageErrors("");
                }}
              />
              {imageErrors && <Text style={Styles.errorText}>{imageErrors}</Text>}

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
    paddingTop:15
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
