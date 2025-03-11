"use client"

import { useContext, useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native"
import { Formik, FieldArray } from "formik"
import { Picker } from "@react-native-picker/picker"
import { theme } from "../core/theme"
import ImagePickerComponent from "../components/ImagePickerComponent"
import { AuthContext } from "../context/AuthContext"
import firestore from "@react-native-firebase/firestore"
import { IsCnicUnique } from "../helpers/IsCnicUnique";
import { idCardValidator } from "../helpers/idCardValidator";



const ChildrenProfiles = ({ navigation, route }) => {
  const { ParentValues} = route.params
  const numberOfChildren=ParentValues.children
  const { user } = useContext(AuthContext)
  const [khairPoints] = useState({value:100});
  

  useEffect(() => {
  }, [numberOfChildren])

  const genderOptions = ["Male", "Female", "Other"]
  const enrollmentOptions = ["Enrolled", "Not Enrolled"]
  const educationalStatusOptions = ["School", "College", "Special Education"]
  const clothingSizes = ["S", "M", "L", "XL", "XXL"]
  const shirtSizes = ["36", "38", "40", "42", "44", "46", "48"]
  const shoeSizes = ["34", "36", "38", "40", "42", "44", "46"]
  const trouserSizes = ["28", "30", "32", "34", "36", "38", "40", "42"]
  const gradeOption = ['Nursery', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
  const uniYearOption = ['1st', '2nd', '3rd', '4th'];
  const collegeYearOption = ['1st Year', '2nd Year'];

  // Function to check if ID card is duplicate within the form
  const isDuplicateIdCard = (idCard, currentIndex, allChildren) => {
    if (!idCard) return false
    
    return allChildren.some((child, index) => 
      index !== currentIndex && child.idCard === idCard
    )
  }

  const validate = (values) => {
    const errors = {}
    values.children.forEach((child, index) => {
      const childErrors = {}
      if (!child.age) childErrors.age = "Age is required"
      if (isNaN(child.age)) childErrors.age = "Age must be a number"
      if (child.age>=18)childErrors.age="Child older than 18 can not be registered"
      if (child.age>=18)childErrors.age="Child older than 18 can not be registered"
      if (child.age && child.age<1)childErrors.age="Child younger than 1 year can not be registered"


      if (!child.gender) childErrors.gender = "Gender is required"
      if (!child.enrollmentStatus) childErrors.enrollmentStatus = "Enrollment status is required"
      
      // Only validate education fields if child is enrolled
      if (child.enrollmentStatus === "Enrolled") {
        if (!child.educationLevel) childErrors.educationLevel = "Education level is required"
        if (!child.institution) childErrors.institution = "Institution is required"
        if (!child.class) childErrors.class = "Class/Year is required"
      }
      
      if (!child.shoeSize) childErrors.shoeSize = "Shoe size is required"
      if (!child.clothingSize) childErrors.clothingSize = "Clothing size is required"
      if (!child.shirtSize) childErrors.shirtSize = "Shirt size is required"
      if (!child.trouserSize) childErrors.trouserSize = "Trouser size is required"
      if (!child.idCard) childErrors.idCard = "ID Card is required"
      else {
        const idCardError = idCardValidator(child.idCard)
        if (idCardError) {
          childErrors.idCard = idCardError
        } else if (isDuplicateIdCard(child.idCard, index, values.children)) {
          childErrors.idCard = "This ID Card is already used for another child"
        }
      }
      if (Object.keys(childErrors).length > 0) {
        errors.children = errors.children || []
        errors.children[index] = childErrors
      }
    })
    return errors
  }

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true)
    
    // Check ID card uniqueness for all children
    const uniquenessChecks = await Promise.all(
      values.children.map(async (child) => {
        if (child.idCard && !idCardValidator(child.idCard)) {
          return await IsCnicUnique(child.idCard)
        }
        return true
      })
    )
    
    // If any ID card is not unique, stop submission
    if (uniquenessChecks.includes(false)) {
      setSubmitting(false)
      return
    }

    try {
      setSubmitting(false);
      try {
        await firestore()
          .collection("individual_profiles")
          .doc(user.uid)
          .set({
          age: parseInt(ParentValues.age), // Convert to integer
          gender: ParentValues.gender,
          maritalStatus: ParentValues.maritalStatus,
          children: parseInt(ParentValues.children) || 0, // Convert to integer, default to 0
          occupation: ParentValues.occupation,
          income: parseFloat(ParentValues.income) || 0, // Convert to decimal
          educationLevel: ParentValues.educationLevel,
          institution: ParentValues.institution,
          class: ParentValues.class,
          shoeSize: ParentValues.shoeSize,
          clothingSize: ParentValues.clothingSize,
          shirtSize: ParentValues.shirtSize,
          trouserSize: ParentValues.trouserSize,
          address: ParentValues.address,
          profileImage: ParentValues.profileImage || "", // Ensure string (or default empty)
          createdAt: firestore.FieldValue.serverTimestamp(), // Timestamp for when the profile is created
          membersCount: Number.parseInt(ParentValues.membersCount) || 0,
          khairPoints:khairPoints.value + (khairPoints.value * numberOfChildren),
          lastPointsReassignmentDate:firestore.FieldValue.serverTimestamp(),

          

            
          });
          
      } catch (error) {
        console.log("Error saving details of parent", error);
      }
        
      const childrenProfiles = values.children.map((child) => ({
        ...child,
        age: Number.parseInt(child.age),
      }))

      await firestore().collection("children_profiles").doc(user.uid).set({ children: childrenProfiles })

      navigation.navigate("WaitForApprovalScreen")
    } catch (error) {
      console.log("Error saving details", error)
    }
    setSubmitting(false)
  }

  const initialValues = {
    children: Array.from({ length: numberOfChildren }, () => ({
      age: "",
      gender: "",
      enrollmentStatus: "",
      educationLevel: "",
      institution: "",
      class: "",
      shoeSize: "",
      clothingSize: "",
      shirtSize: "",
      trouserSize: "",
      idCard:""
    })),
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Children Profiles</Text>
        <Text style={styles.subtitle}>Number of children: {numberOfChildren}</Text>
        <View style={styles.line} />

        <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <FieldArray
              name="children"
              render={(arrayHelpers) => (
                <>
                  {values.children.map((child, index) => (
                    <View key={index} style={styles.childContainer}>
                      <Text style={styles.childTitle}>Child {index + 1}</Text>

                     

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Age</Text>
                        <TextInput
                          style={styles.input}
                          onChangeText={handleChange(`children[${index}].age`)}
                          onBlur={handleBlur(`children[${index}].age`)}
                          value={child.age}
                          placeholder="Enter child's age"
                          placeholderTextColor={theme.colors.ivory}
                          keyboardType="numeric"
                        />
                        {errors.children?.[index]?.age && touched.children?.[index]?.age && (
                          <Text style={styles.errorText}>{errors.children[index].age}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Gender</Text>
                        <View style={styles.radioContainer}>
                          {genderOptions.map((option) => (
                            <TouchableOpacity
                              key={option}
                              style={styles.radioOption}
                              onPress={() => setFieldValue(`children[${index}].gender`, option)}
                            >
                              <View style={[styles.radioCircle, child.gender === option && styles.radioSelected]} />
                              <Text style={styles.radioLabel}>{option}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        {errors.children?.[index]?.gender && touched.children?.[index]?.gender && (
                          <Text style={styles.errorText}>{errors.children[index].gender}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>ID Card</Text>
                        <TextInput
                          style={styles.input}
                          onChangeText={handleChange(`children[${index}].idCard`)}
                          onBlur={async (e) => {
                            handleBlur(`children[${index}].idCard`)(e)
                            // Check for uniqueness when field loses focus
                            if (child.idCard && !idCardValidator(child.idCard)) {
                              // First check if it's duplicate within the form
                              if (isDuplicateIdCard(child.idCard, index, values.children)) {
                                setFieldValue(`children[${index}].idCardError`, "This ID Card is already used for another child")
                                return
                              }
                              
                              // Then check if it's unique in the database
                              const isUnique = await IsCnicUnique(child.idCard)
                              if (!isUnique) {
                                setFieldValue(`children[${index}].idCardError`, "This ID Card is already registered")
                              } else {
                                setFieldValue(`children[${index}].idCardError`, "")
                              }
                            }
                          }}
                          value={child.idCard}
                          placeholder="Format: 34101-7678623-8"
                          placeholderTextColor={theme.colors.ivory}
                        />
                        {errors.children?.[index]?.idCard && touched.children?.[index]?.idCard && (
                          <Text style={styles.errorText}>{errors.children[index].idCard}</Text>
                        )}
                        {child.idCardError && (
                          <Text style={styles.errorText}>{child.idCardError}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Enrollment Status</Text>
                        <View style={styles.radioContainer}>
                          {enrollmentOptions.map((option) => (
                            <TouchableOpacity
                              key={option}
                              style={styles.radioOption}
                              onPress={() => {
                                setFieldValue(`children[${index}].enrollmentStatus`, option)
                                // Clear education fields if changing to Not Enrolled
                                if (option === "Not Enrolled") {
                                  setFieldValue(`children[${index}].educationLevel`, "")
                                  setFieldValue(`children[${index}].institution`, "")
                                  setFieldValue(`children[${index}].class`, "")
                                }
                              }}
                            >
                              <View style={[styles.radioCircle, child.enrollmentStatus === option && styles.radioSelected]} />
                              <Text style={styles.radioLabel}>{option}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        {errors.children?.[index]?.enrollmentStatus && touched.children?.[index]?.enrollmentStatus && (
                          <Text style={styles.errorText}>{errors.children[index].enrollmentStatus}</Text>
                        )}
                      </View>

                      {child.enrollmentStatus === "Enrolled" && (
                        <>
                          <View style={styles.inputContainer}>
                            <Text style={styles.label}>Educational Level</Text>
                            <View style={styles.pickerContainer}>
                              <Picker
                                selectedValue={child.educationLevel}
                                onValueChange={(itemValue) => setFieldValue(`children[${index}].educationLevel`, itemValue)}
                                style={styles.picker1}
                              >
                                <Picker.Item label="Select Educational Level" value="" />
                                {educationalStatusOptions.map((status) => (
                                  <Picker.Item key={status} label={status} value={status} />
                                ))}
                              </Picker>
                            </View>
                            {errors.children?.[index]?.educationLevel && touched.children?.[index]?.educationLevel && (
                              <Text style={styles.errorText}>{errors.children[index].educationLevel}</Text>
                            )}
                          </View>

                          <View style={styles.inputContainer}>
                            <Text style={styles.label}>Institution Name</Text>
                            <TextInput
                              style={styles.input}
                              onChangeText={handleChange(`children[${index}].institution`)}
                              onBlur={handleBlur(`children[${index}].institution`)}
                              value={child.institution}
                              placeholder="Enter institution name"
                              placeholderTextColor={theme.colors.ivory}
                            />
                            {errors.children?.[index]?.institution && touched.children?.[index]?.institution && (
                              <Text style={styles.errorText}>{errors.children[index].institution}</Text>
                            )}
                          </View>
                          
                          <View style={styles.inputContainer}>
                            <Text style={styles.label}>Class/Year</Text>
                            <View style={styles.pickerContainer}>
                              <Picker
                                selectedValue={child.class}
                                onValueChange={(itemValue) => setFieldValue(`children[${index}].class`, itemValue)}
                                style={styles.picker1}
                              >
                                <Picker.Item label="Select Class/Year" value="" />
                                {child.educationLevel === 'School' && (
                                  gradeOption.map((grade) => (
                                    <Picker.Item key={grade} label={grade} value={grade} />
                                  ))
                                )}
                                {child.educationLevel === 'College' && (
                                  collegeYearOption.map((year) => (
                                    <Picker.Item key={year} label={year} value={year} />
                                  ))
                                )}
                              
                                {child.educationLevel === 'Special Education' && (
                                  <Picker.Item label="Special Education" value="Special Education" />
                                )}
                              </Picker>
                            </View>
                            {errors.children?.[index]?.class && touched.children?.[index]?.class && (
                              <Text style={styles.errorText}>{errors.children[index].class}</Text>
                            )}
                          </View>
                        </>
                      )}

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Shoe Size</Text>
                        <View style={styles.pickerContainer}>
                          <Picker
                            selectedValue={child.shoeSize}
                            onValueChange={(itemValue) => setFieldValue(`children[${index}].shoeSize`, itemValue)}
                            style={styles.picker1}
                          >
                            <Picker.Item label="Select shoe size" value="" />
                            {shoeSizes.map((size) => (
                              <Picker.Item key={size} label={size} value={size} />
                            ))}
                          </Picker>
                        </View>
                        {errors.children?.[index]?.shoeSize && touched.children?.[index]?.shoeSize && (
                          <Text style={styles.errorText}>{errors.children[index].shoeSize}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Clothing Size</Text>
                        <View style={styles.pickerContainer}>
                          <Picker
                            selectedValue={child.clothingSize}
                            onValueChange={(itemValue) => setFieldValue(`children[${index}].clothingSize`, itemValue)}
                            style={styles.picker1}
                          >
                            <Picker.Item label="Select clothing size" value="" />
                            {clothingSizes.map((size) => (
                              <Picker.Item key={size} label={size} value={size} />
                            ))}
                          </Picker>
                        </View>
                        {errors.children?.[index]?.clothingSize && touched.children?.[index]?.clothingSize && (
                          <Text style={styles.errorText}>{errors.children[index].clothingSize}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Shirt Size</Text>
                        <View style={styles.pickerContainer}>
                          <Picker
                            selectedValue={child.shirtSize}
                            onValueChange={(itemValue) => setFieldValue(`children[${index}].shirtSize`, itemValue)}
                            style={styles.picker1}
                          >
                            <Picker.Item label="Select shirt size" value="" />
                            {shirtSizes.map((size) => (
                              <Picker.Item key={size} label={size} value={size} />
                            ))}
                          </Picker>
                        </View>
                        {errors.children?.[index]?.shirtSize && touched.children?.[index]?.shirtSize && (
                          <Text style={styles.errorText}>{errors.children[index].shirtSize}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Trouser Size</Text>
                        <View style={styles.pickerContainer}>
                          <Picker
                            selectedValue={child.trouserSize}
                            onValueChange={(itemValue) => setFieldValue(`children[${index}].trouserSize`, itemValue)}
                            style={styles.picker1}
                          >
                            <Picker.Item label="Select trouser size" value="" />
                            {trouserSizes.map((size) => (
                              <Picker.Item key={size} label={size} value={size} />
                            ))}
                          </Picker>
                        </View>
                        {errors.children?.[index]?.trouserSize && touched.children?.[index]?.trouserSize && (
                          <Text style={styles.errorText}>{errors.children[index].trouserSize}</Text>
                        )}
                      </View>

                
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() => {
                      console.log("Submit button pressed")
                      handleSubmit()
                    }}
                    style={styles.submitButton}
                  >
                    <Text style={styles.submitButtonText}>Save Profiles</Text>
                  </TouchableOpacity>
                </>
              )}
            />
          )}
        </Formik>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.charcoalBlack,
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.ivory,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.ivory,
    textAlign: "center",
    marginBottom: 20,
  },
  line: {
    borderBottomWidth: 1,
    borderColor: theme.colors.sageGreen,
    marginVertical: 20,
  },
  childContainer: {
    marginBottom: 30,
    borderWidth: 1,
    borderColor: theme.colors.sageGreen,
    borderRadius: 10,
    padding: 15,
  },
  childTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.ivory,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
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
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  radioOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
    overflow: "hidden",
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
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: theme.colors.ivory,
    fontWeight: "bold",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
})

export default ChildrenProfiles
