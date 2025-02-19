import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import React, { useState,useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Formik } from 'formik';
import { Picker } from "@react-native-picker/picker";
import { theme } from "../core/theme";
import ImagePickerComponent from '../components/ImagePickerComponent';
import { nameValidator } from '../helpers/nameValidator';
import { validateAge } from '../helpers/ageValidator';
import { addressValidator } from '../helpers/addressValidator';
import { AuthContext } from "../context/AuthContext";


const RecipientProfileForm = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState(null);

  const genderOptions = ['Male', 'Female', 'Other'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
  const occupationStatusOptions = ['Student', 'Employed', 'Unemployed'];
  const educationalStatusOptions = ['School', 'College', 'University'];
  const clothingSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const shirtSizes = ['36', '38', '40', '42', '44', '46', '48'];
  const shoeSizes = ['34','36', '38', '40', '42', '44', '46'];

  const trouserSizes = ['28', '30', '32', '34', '36', '38', '40', '42'];

  const validate = (values) => {
    const errors = {};
  
  
    // Age validation
    const ageError = validateAge(values.age);
    if (ageError) errors.age = ageError;
  
    if (!values.age) errors.age = 'Age is required';
    if (isNaN(values.age)) errors.age = 'Age must be a number';
    if (!values.gender) errors.gender = 'Gender is required';
    if (!values.maritalStatus) errors.maritalStatus = 'Marital status is required';
    if (values.maritalStatus=="Married" || values.maritalStatus=="Widowed" || values.maritalStatus=="Divorced"){
      if (!values.children) errors.children = 'Number of children is required';
    if (isNaN(values.children)) errors.children = 'Number of children must be a number';
    if (values.children<0) errors.children = 'Number of children can not be negative';

    }
    if (!values.occupation || values.occupation === 'notsel') {
      errors.occupation = 'Occupation is required';
    }
    if (values.occupation==='Employed'){
      if (!values.income) errors.income = 'Income is required';
      if (values.income.trim() === "") {
        errors.income = "Income cannot contain only spaces.";
      }
      if (isNaN(values.income)) errors.income = 'Income must be a number';
      if (values.income <0){
        errors.income='Income can not be negative';
      }

    }
    
  
    const addressError = addressValidator(values.address);
    if (addressError) errors.address = addressError;
    if (!values.address) errors.address = 'Address is required';
  
    // Only validate education-related fields if occupation is "Student"
    if (values.occupation === 'Student') {
      if (!values.educationLevel) errors.educationLevel = 'Education level is required';
      if (!values.institution) errors.institution = 'Institution is required';
      if (!values.class) errors.class = 'Class/Year is required';
    }
  
    if (!values.shoeSize) errors.shoeSize = 'Shoe size is required';
    if (!values.clothingSize) errors.clothingSize = 'Clothing size is required';
    if (!values.shirtSize) errors.shirtSize = 'Shirt size is required';
    if (!values.trouserSize) errors.trouserSize = 'Trouser size is required';
    console.log(errors);
  
    return errors;
  };

  const onSubmit = async (values, { setSubmitting }) =>  {
    console.log('Form submitted with values:', values);
    console.log(values);
    // Handle form submission
    /*
    setSubmitting(false);
    try {
      await firestore()
        .collection("individual_profiles")
        .doc(user.uid)
        .set({
        name: values.name,
        age: parseInt(values.age), // Convert to integer
        gender: values.gender,
        maritalStatus: values.maritalStatus,
        children: parseInt(values.children) || 0, // Convert to integer, default to 0
        occupation: values.occupation,
        income: parseFloat(values.income) || 0, // Convert to decimal
        educationLevel: values.educationLevel,
        institution: values.institution,
        class: values.class,
        shoeSize: values.shoeSize,
        clothingSize: values.clothingSize,
        shirtSize: values.shirtSize,
        trouserSize: values.trouserSize,
        address: values.address,
        profileImage: values.profileImage || "", // Ensure string (or default empty)
        createdAt: firestore.FieldValue.serverTimestamp(), // Timestamp for when the profile is created
          
        });


        
    } catch (error) {
      console.log("Error saving details", error);
    }
      
    navigation.navigate('WaitForApprovalScreen');
    */
    if (parseInt(values.children) > 0) {
      navigation.navigate("ChildrenProfiles", {ParentValues: values});
    } 
    else{
      setSubmitting(false);
    try {
      await firestore()
        .collection("individual_profiles")
        .doc(user.uid)
        .set({
        age: parseInt(values.age), // Convert to integer
        gender: values.gender,
        maritalStatus: values.maritalStatus,
        children: parseInt(values.children) || 0, // Convert to integer, default to 0
        occupation: values.occupation,
        income: parseFloat(values.income) || 0, // Convert to decimal
        educationLevel: values.educationLevel,
        institution: values.institution,
        class: values.class,
        shoeSize: values.shoeSize,
        clothingSize: values.clothingSize,
        shirtSize: values.shirtSize,
        trouserSize: values.trouserSize,
        address: values.address,
        profileImage: values.profileImage || "", // Ensure string (or default empty)
        createdAt: firestore.FieldValue.serverTimestamp(), // Timestamp for when the profile is created
          
        });


        
    } catch (error) {
      console.log("Error saving details", error);
    }
      
    navigation.navigate('WaitForApprovalScreen');

    }
    

  };

  const [selectedOption, setSelectedOption] = useState('option1');
  const [inputValue, setInputValue] = useState('');

  return (
    <View style={[styles.container, { marginBottom: 20 }]}>
      <ScrollView>
        <Text style={styles.title}>Recipient Profile</Text>
        <View style={styles.line} />

        <Formik
          initialValues={{
            age: '',
            gender: '',
            maritalStatus: '',
            children: '',
            occupation: '',
            income: '',
            educationLevel: '',
            institution: '',
            class: '',
            shoeSize: '',
            clothingSize: '',
            shirtSize: '',
            trouserSize: '',
            address: '',
          }}
          validate={validate}
          onSubmit={onSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <>
            

              {/* Age Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('age')}
                  onBlur={handleBlur('age')}
                  value={values.age}
                  placeholder="Enter your age"
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

              {/* Marital Status Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Marital Status</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.maritalStatus}
                    onValueChange={(itemValue) => setFieldValue('maritalStatus', itemValue)}
                    style={styles.picker1}
                  >
                    <Picker.Item label="Select marital status" value="" />
                    {maritalStatusOptions.map((status) => (
                      <Picker.Item key={status} label={status} value={status} />
                    ))}
                  </Picker>
                </View>
                {errors.maritalStatus && touched.maritalStatus && <Text style={styles.errorText}>{errors.maritalStatus}</Text>}
              </View>

              {/* Children Input (Conditional) */}
              {(values.maritalStatus === 'Married' || values.maritalStatus === 'Divorced' ||values.maritalStatus === 'Widowed') && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Number of Children</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange('children')}
                    onBlur={handleBlur('children')}
                    value={values.children}
                    placeholder="Enter number of children"
                    placeholderTextColor={theme.colors.ivory}
                    keyboardType="numeric"
                  />
                  {errors.children && touched.children && <Text style={styles.errorText}>{errors.children}</Text>}

                </View>
              )}



              {/* occupation Status Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Occupation</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.occupation}
                    onValueChange={(itemValue) => setFieldValue('occupation', itemValue)}
                    style={styles.picker1}
                  >
                    <Picker.Item label="Select Occupation status" value="" />
                    {occupationStatusOptions.map((status) => (
                      <Picker.Item key={status} label={status} value={status} />
                    ))}
                  </Picker>
                </View>
                {errors.occupation && touched.occupation && <Text style={styles.errorText}>{errors.occupation}</Text>}
              </View>


              {/* Income Input */}
              {values.occupation === 'Employed' && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Monthly Income</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('income')}
                  onBlur={handleBlur('income')}
                  value={values.income}
                  placeholder="Enter your monthly income"
                  placeholderTextColor={theme.colors.ivory}
                  keyboardType="numeric"
                />
                {errors.income && touched.income && <Text style={styles.errorText}>{errors.income}</Text>}
              </View>
              )}


              {/* Student-specific fields (Conditional) */}
              {values.occupation === 'Student' && (
                <>

                  {/* Educational level Status Selection */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Educationl Level</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={values.educationLevel}
                        onValueChange={(itemValue) => setFieldValue('educationLevel', itemValue)}
                        style={styles.picker}
                      >
                        <Picker.Item label="Select Educational Level" value="" />
                        {educationalStatusOptions.map((status) => (
                          <Picker.Item key={status} label={status} value={status} />
                        ))}
                      </Picker>
                    </View>
                    {errors.educationLevel && touched.educationLevel && <Text style={styles.errorText}>{errors.educationLevel}</Text>}

                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Institution Name</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange('institution')}
                      onBlur={handleBlur('institution')}
                      value={values.institution}
                      placeholder="Enter institution name"
                      placeholderTextColor={theme.colors.ivory}
                    />
                    {errors.institution && touched.institution && <Text style={styles.errorText}>{errors.institution}</Text>}
                  </View>

                  {values.educationLevel === 'School' && (
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Class/Standard</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange('class')}
                        onBlur={handleBlur('class')}
                        value={values.class}
                        placeholder="Enter your class or standard"
                        placeholderTextColor={theme.colors.ivory}
                      />
                      {errors.class && touched.class && <Text style={styles.errorText}>{errors.class}</Text>}
                    </View>
                  )}

                  {(values.educationLevel === 'College' || values.educationLevel === 'University') && (
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Year of Study</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange('class')}
                        onBlur={handleBlur('class')}
                        value={values.class}
                        placeholder="Enter your year of study"
                        placeholderTextColor={theme.colors.ivory}
                      />
                      {errors.class && touched.class && <Text style={styles.errorText}>{errors.class}</Text>}
                    </View>
                  )}
                </>
              )}


              
              {/* Shoe Size Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Shoe Size</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.shoeSize}
                    onValueChange={(itemValue) => setFieldValue('shoeSize', itemValue)}
                    style={styles.picker1}
                  >
                    <Picker.Item label="Select shoe size" value="" />
                    {shoeSizes.map((size) => (
                      <Picker.Item key={size} label={size} value={size} />
                    ))}
                  </Picker>
                </View>
                {errors.shoeSize && touched.shoeSize && <Text style={styles.errorText}>{errors.shoeSize}</Text>}
              </View>


              {/* Clothing Size Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Clothing Size</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.clothingSize}
                    onValueChange={(itemValue) => setFieldValue('clothingSize', itemValue)}
                    style={styles.picker1}
                  >
                    <Picker.Item label="Select clothing size" value="" />
                    {clothingSizes.map((size) => (
                      <Picker.Item key={size} label={size} value={size} />
                    ))}
                  </Picker>
                </View>
                {errors.clothingSize && touched.clothingSize && <Text style={styles.errorText}>{errors.clothingSize}</Text>}
              </View>

              {/* Shirt Size Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Shirt Size</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.shirtSize}
                    onValueChange={(itemValue) => setFieldValue('shirtSize', itemValue)}
                    style={styles.picker1}
                  >
                    <Picker.Item label="Select shirt size" value="" />
                    {shirtSizes.map((size) => (
                      <Picker.Item key={size} label={size} value={size} />
                    ))}
                  </Picker>
                </View>
                {errors.shirtSize && touched.shirtSize && <Text style={styles.errorText}>{errors.shirtSize}</Text>}
              </View>

              {/* Trouser Size Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Trouser Size</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.trouserSize}
                    onValueChange={(itemValue) => setFieldValue('trouserSize', itemValue)}
                    style={styles.picker1}
                  >
                    <Picker.Item label="Select trouser size" value="" />
                    {trouserSizes.map((size) => (
                      <Picker.Item key={size} label={size} value={size} />
                    ))}
                  </Picker>
                </View>
                {errors.trouserSize && touched.trouserSize && <Text style={styles.errorText}>{errors.trouserSize}</Text>}
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
              <TouchableOpacity
                onPress={() => {
                  console.log('Submit button pressed');
                  handleSubmit();
                }}
                style={styles.submitButton}
              >
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
  picker1: {
    height: 50,
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

export default RecipientProfileForm;

