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
import { addEduDonation } from '../helpers/addEduDonations';

const UploadEdu = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const tabBarHeight = useBottomTabBarHeight();
  const subjectOptions = [
    "English", "Urdu", "Mathematics", "Science", "Islamiyat",
    "History","Physics", "Chemistry","Business Studies","Economics","Accounting", "Other"
  ];
  const eduTypeOptions = ['Books', 'Stationary', 'Other'];
  const conditionOptions = ['New', 'Gently Used', 'Well Used'];
  const eduLevelOptions = ['Primary', 'Secondary', 'Higher Education', 'Special Education'];

  // State for form fields
  // State for form field values and errors
  const [educType, setEducType] = useState({ value: '', error: '' });
  const [eduLevel, setLevel] = useState({ value: '', error: '' });
  const [subject, setSubject] = useState({ value: '', error: '' });

  const [condition, setCondition] = useState({ value: '', error: '' });
  const [quantity, setQuantity] = useState({ value: '1', error: '' });
  const [itemName, setItemName] = useState({ value: '', error: '' });
  const [description, setDescription] = useState({ value: '', error: '' });
  const [images, setImages] = useState([]);

  const [imageErrors, setImageErrors] = useState('');


  const validate = () => {
    let isValid = true;

    if (!educType.value) {
      setEducType((prev) => ({ ...prev, error: 'Type is required' }));

      isValid = false;
    }
    
   
    if (!eduLevel.value) {
      setLevel((prev) => ({ ...prev, error: 'Level is required' }));
      isValid = false;
    }
    if (!condition.value) {
      setCondition((prev) => ({ ...prev, error: 'Condition is required' }));
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
    
    if (!itemName.value) {
      setItemName((prev) => ({ ...prev, error: 'Item name is required' }));
      isValid = false;
    }
    if (itemName.value.length>30) {
      setItemName((prev) => ({ ...prev, error: 'Too long' }));
      isValid = false;
    }
    if (itemName.value.length<3 && itemName.value.length>0) {
      setItemName((prev) => ({ ...prev, error: 'Too short' }));
      isValid = false;
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


    return isValid;
  };

  const onSubmitMethod = async () => {

    const isValid = validate();


    if (!isValid) return;
    const eduData = {
     
      type: educType.value,
      level: eduLevel.value,
      c_condition: condition.value,
      quantity: quantity.value,
      itemName: itemName.value,
      description:  description.value,
      images:images,
      subject:subject.value,
      donorUsername: user.username,

    };

    try {
      await addEduDonation(eduData);
      console.log('Education donation successfully submitted:', eduData);
      navigation.navigate("DonationSuccessScreen")
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
        


         {/* Food Type */}
         <View style={{ marginTop: 30 }}>
                <Text style={Styles.headings}>Type</Text>
                <View style={Styles.radioContainer}>
                  {eduTypeOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={Styles.radioOption}
                      onPress={() => setEducType({ value: option, error: '' })} 
                    >
                      <View
                        style={[
                          Styles.radioCircle,
                          educType.value === option && Styles.radioSelected,
                        ]}
                      />
                      <Text style={Styles.radioLabel}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {educType.error && <Text style={Styles.errorText}>{educType.error}</Text>}
              </View>

      
        {/* Level Selection */}
        <View style={{ marginTop: 30 }}>
          <Text style={Styles.headings}>Level</Text>
          <View style={Styles.dropdownContainer}>
            <Picker
              selectedValue={eduLevel.value}
              onValueChange={(itemValue) => setLevel({ value: itemValue, error: '' })}

              style={Styles.picker}
            >
              <Picker.Item label="Select Education Level" value="" />
              {eduLevelOptions.map((eduLevel) => (
                <Picker.Item key={eduLevel} label={eduLevel} value={eduLevel} />
              ))}
            </Picker>
          </View>
          {eduLevel.error && <Text style={Styles.errorText}>{eduLevel.error}</Text>}

        </View>

         {/* Subject */}
         <View style={{ marginTop: 30 }}>
          <Text style={Styles.headings}>Subject</Text>
          <View style={Styles.dropdownContainer}>
            <Picker
              selectedValue={subject.value}
              onValueChange={(itemValue) => setSubject({ value: itemValue, error: '' })}

              style={Styles.picker}
            >
              <Picker.Item label="Select Subject" value="" />
              {subjectOptions.map((subject) => (
                <Picker.Item key={subject} label={subject} value={subject} />
              ))}
            </Picker>
          </View>
          {subject.error && <Text style={Styles.errorText}>{subject.error}</Text>}

        </View>

          
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
         
       
        {/* Item Name */}
        <View style={{ marginTop: 30 }}>
          <Text style={Styles.headings}>Item Name</Text>
          <TextInput
            placeholder="e.g Punjab Textbook"
            value={itemName.value}
            onChangeText={(text) => setItemName({ value: text, error: '' })}

            style={Styles.name}
            placeholderTextColor={theme.colors.ivory}
            selectionColor={theme.colors.sageGreen}
          />
                    {itemName.error && <Text style={Styles.errorText}>{itemName.error}</Text>}

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
    backgroundColor: theme.colors.TaupeBlack,
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

export default UploadEdu;
