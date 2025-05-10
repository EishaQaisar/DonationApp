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
import i18n, { t } from "../i18n"


const ChildrenProfiles = ({ navigation, route }) => {
  const { ParentValues} = route.params
  const numberOfChildren=ParentValues.children
  const { user } = useContext(AuthContext)
  const [khairPoints] = useState({value:100});
  

  useEffect(() => {
  }, [numberOfChildren])

  // Define options with their translations
  const genderOptions = [
    { value: "Male", label:i18n.locale === "ur" ? t("options.gender.male") : "Male" },
    { value: "Female", label: i18n.locale === "ur"? t("options.gender.female") : "Female" },
    { value: "Other", label: i18n.locale === "ur"? t("options.gender.other") : "Other" }
  ]
  
  const enrollmentOptions = [
    { value: "Enrolled", label:i18n.locale === "ur" ? t("options.enrollment.enrolled") : "Enrolled" },
    { value: "Not Enrolled", label: i18n.locale === "ur"? t("options.enrollment.not_enrolled") : "Not Enrolled" }
  ]
  
  const educationalStatusOptions = [
    { value: "School", label: i18n.locale === "ur" ? t("options.education.school") : "School" },
    { value: "College", label: i18n.locale === "ur" ? t("options.education.college") : "College" },
    { value: "Special Education", label:i18n.locale === "ur"? t("options.education.special") : "Special Education" }
  ]
  
  const clothingSizes = [
    { value: "S", label: i18n.locale === "ur" ? t("options.clothing_sizes.S") : "S" },
    { value: "M", label: i18n.locale === "ur"? t("options.clothing_sizes.M") : "M" },
    { value: "L", label: i18n.locale === "ur" ? t("options.clothing_sizes.L") : "L" },
    { value: "XL", label: i18n.locale === "ur" ? t("options.clothing_sizes.XL") : "XL" },
    { value: "XXL", label: i18n.locale === "ur"? t("options.clothing_sizes.XXL") : "XXL" }
  ]
  
  // Numeric sizes remain the same in both languages
  const shirtSizes = ["36", "38", "40", "42", "44", "46", "48"]
  const shoeSizes = ["34", "36", "38", "40", "42", "44", "46"]
  const trouserSizes = ["28", "30", "32", "34", "36", "38", "40", "42"]
  
  const gradeOption = [
    { value: "Nursery", label:i18n.locale === "ur" ? t("options.grades.nursery") : "Nursery" },
    { value: "KG", label: i18n.locale === "ur" ? t("options.grades.kg") : "KG" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" }
  ]
  
  const collegeYearOption = [
    { value: "1st Year", label:i18n.locale === "ur" ? t("options.college_years.1st_year") : "1st Year" },
    { value: "2nd Year", label: i18n.locale === "ur"? t("options.college_years.2nd_year") : "2nd Year" }
  ]

  // Helper function to get English value from translated label
  const getEnglishValue = (translatedValue, optionsArray) => {
    const option = optionsArray.find(opt => opt.label === translatedValue);
    return option ? option.value : translatedValue;
  }

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
      if (!child.age) childErrors.age = t("errors.age_required")
      if (isNaN(child.age)) childErrors.age = t("errors.age_number")
      if (child.age>=18) childErrors.age = t("errors.age_child_max")
      if (child.age && child.age<1) childErrors.age = t("errors.age_child_min")

      if (!child.gender) childErrors.gender = t("errors.gender_required")
      if (!child.enrollmentStatus) childErrors.enrollmentStatus = t("errors.required")
      
      // Only validate education fields if child is enrolled
      const enrolledValue = enrollmentOptions.find(opt => opt.value === "Enrolled").label;
      if (child.enrollmentStatus === enrolledValue || child.enrollmentStatus === "Enrolled") {
        if (!child.educationLevel) childErrors.educationLevel = t("errors.education_required")
        if (!child.institution) childErrors.institution = t("errors.institution_required")
        if (!child.class) childErrors.class = t("errors.class_required")
      }
      
      if (!child.shoeSize) childErrors.shoeSize = t("errors.shoe_size_required")
      if (!child.clothingSize) childErrors.clothingSize = t("errors.clothing_size_required")
      if (!child.shirtSize) childErrors.shirtSize = t("errors.shirt_size_required")
      if (!child.trouserSize) childErrors.trouserSize = t("errors.trouser_size_required")
      if (!child.idCard) childErrors.idCard = t("errors.id_card_required")
      else {
        const idCardError = idCardValidator(child.idCard)
        if (idCardError) {
          childErrors.idCard = idCardError
        } else if (isDuplicateIdCard(child.idCard, index, values.children)) {
          childErrors.idCard = t("errors.id_card_duplicate")
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
          city:ParentValues.city,
          addressCoordinates: ParentValues.addressCoordinates, // Add coordinates

          });
          
      } catch (error) {
        console.log("Error saving details of parent", error);
      }
        
      // Convert translated values to English before saving to Firestore
      const childrenProfiles = values.children.map((child) => ({
        ...child,
        age: Number.parseInt(child.age),
        gender: getEnglishValue(child.gender, genderOptions),
        enrollmentStatus: getEnglishValue(child.enrollmentStatus, enrollmentOptions),
        educationLevel: getEnglishValue(child.educationLevel, educationalStatusOptions),
        clothingSize: getEnglishValue(child.clothingSize, clothingSizes),
        class: child.class ? (
          educationalStatusOptions.find(opt => opt.label === child.educationLevel || opt.value === child.educationLevel)?.value === "School" ? 
            getEnglishValue(child.class, gradeOption) : 
          educationalStatusOptions.find(opt => opt.label === child.educationLevel || opt.value === child.educationLevel)?.value === "College" ? 
            getEnglishValue(child.class, collegeYearOption) : 
            child.class
        ) : ""
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
        <Text style={styles.title}>{t("children_profiles.title")}</Text>
        <Text style={styles.subtitle}>{t("children_profiles.number_of_children")}: {numberOfChildren}</Text>
        <View style={styles.line} />

        <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <FieldArray
              name="children"
              render={(arrayHelpers) => (
                <>
                  {values.children.map((child, index) => (
                    <View key={index} style={styles.childContainer}>
                      <Text style={styles.childTitle}>{t("children_profiles.child")} {index + 1}</Text>

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("children_profiles.age")}</Text>
                        <TextInput
                          style={[styles.input, {  fontSize: i18n.locale === "ur" ? 16 : 15 ,textAlign: i18n.locale === "ur"  ? "right": "left"}]}
                          onChangeText={handleChange(`children[${index}].age`)}
                          onBlur={handleBlur(`children[${index}].age`)}
                          value={child.age}
                          placeholder={t("children_profiles.age")}
                          placeholderTextColor={theme.colors.ivory}
                          keyboardType="numeric"
                        />
                        {errors.children?.[index]?.age && touched.children?.[index]?.age && (
                          <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.children[index].age}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("children_profiles.gender")}</Text>
                        <View style={[styles.radioContainer, { }]}>
                          {genderOptions.map((option) => (
                            <TouchableOpacity
                              key={option.value}
                              style={[styles.radioOption, {  }]}
                              onPress={() => setFieldValue(`children[${index}].gender`, option.label)}
                            >
                              <View style={[styles.radioCircle, child.gender === option.label && styles.radioSelected, { marginRight: i18n.locale === "ur" ? 0 : 10, marginLeft: i18n.locale === "ur"? 10 : 0 }]} />
                              <Text style={[styles.radioLabel, { }]}>{option.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        {errors.children?.[index]?.gender && touched.children?.[index]?.gender && (
                          <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.children[index].gender}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("children_profiles.id_card")}</Text>
                        <TextInput
                          style={[styles.input, { fontSize: i18n.locale === "ur" ? 16 : 15 ,textAlign: i18n.locale === "ur"  ? "right": "left"}]}
                          onChangeText={handleChange(`children[${index}].idCard`)}
                          onBlur={async (e) => {
                            handleBlur(`children[${index}].idCard`)(e)
                            // Check for uniqueness when field loses focus
                            if (child.idCard && !idCardValidator(child.idCard)) {
                              // First check if it's duplicate within the form
                              if (isDuplicateIdCard(child.idCard, index, values.children)) {
                                setFieldValue(`children[${index}].idCardError`, t("errors.id_card_duplicate"))
                                return
                              }
                              
                              // Then check if it's unique in the database
                              const isUnique = await IsCnicUnique(child.idCard)
                              if (!isUnique) {
                                setFieldValue(`children[${index}].idCardError`, t("errors.id_card_registered"))
                              } else {
                                setFieldValue(`children[${index}].idCardError`, "")
                              }
                            }
                          }}
                          value={child.idCard}
                          placeholder={t("children_profiles.id_card_format")}
                          placeholderTextColor={theme.colors.ivory}
                        />
                        {errors.children?.[index]?.idCard && touched.children?.[index]?.idCard && (
                          <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.children[index].idCard}</Text>
                        )}
                        {child.idCardError && (
                          <Text style={[styles.errorText, { fontSize: i18n.locale === "ur"? 14 : 12 }]}>{child.idCardError}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("children_profiles.enrollment_status")}</Text>
                        <View style={[styles.radioContainer, {  }]}>
                          {enrollmentOptions.map((option) => (
                            <TouchableOpacity
                              key={option.value}
                              style={[styles.radioOption, {  }]}
                              onPress={() => {
                                setFieldValue(`children[${index}].enrollmentStatus`, option.label)
                                // Clear education fields if changing to Not Enrolled
                                if (option.value === "Not Enrolled") {
                                  setFieldValue(`children[${index}].educationLevel`, "")
                                  setFieldValue(`children[${index}].institution`, "")
                                  setFieldValue(`children[${index}].class`, "")
                                }
                              }}
                            >
                              <View style={[styles.radioCircle, child.enrollmentStatus === option.label && styles.radioSelected, { marginRight: i18n.locale === "ur" ? 0 : 10, marginLeft: i18n.locale === "ur" ? 10 : 0 }]} />
                              <Text style={[styles.radioLabel, {  }]}>{option.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        {errors.children?.[index]?.enrollmentStatus && touched.children?.[index]?.enrollmentStatus && (
                          <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.children[index].enrollmentStatus}</Text>
                        )}
                      </View>

                      {(child.enrollmentStatus === enrollmentOptions.find(opt => opt.value === "Enrolled")?.label ||
                        child.enrollmentStatus === "Enrolled") && (
                        <>
                          <View style={styles.inputContainer}>
                            <Text style={styles.label}>{t("children_profiles.educational_level")}</Text>
                            <View style={styles.pickerContainer}>
                              <Picker
                                selectedValue={child.educationLevel}
                                onValueChange={(itemValue) => setFieldValue(`children[${index}].educationLevel`, itemValue)}
                                style={[styles.picker1, { }]}
                              >
                                <Picker.Item label={t("children_profiles.educational_level")} value="" />
                                {educationalStatusOptions.map((status) => (
                                  <Picker.Item key={status.value} label={status.label} value={status.label} />
                                ))}
                              </Picker>
                            </View>
                            {errors.children?.[index]?.educationLevel && touched.children?.[index]?.educationLevel && (
                              <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.children[index].educationLevel}</Text>
                            )}
                          </View>

                          <View style={styles.inputContainer}>
                            <Text style={styles.label}>{t("children_profiles.institution")}</Text>
                            <TextInput
                              style={[styles.input, { fontSize: i18n.locale === "ur" ? 16 : 15 ,textAlign: i18n.locale === "ur"  ? "right": "left"}]}
                              onChangeText={handleChange(`children[${index}].institution`)}
                              onBlur={handleBlur(`children[${index}].institution`)}
                              value={child.institution}
                              placeholder={t("children_profiles.institution")}
                              placeholderTextColor={theme.colors.ivory}
                            />
                            {errors.children?.[index]?.institution && touched.children?.[index]?.institution && (
                              <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.children[index].institution}</Text>
                            )}
                          </View>
                          
                          <View style={styles.inputContainer}>
                            <Text style={styles.label}>{t("children_profiles.class_year")}</Text>
                            <View style={styles.pickerContainer}>
                              <Picker
                                selectedValue={child.class}
                                onValueChange={(itemValue) => setFieldValue(`children[${index}].class`, itemValue)}
                                style={[styles.picker1, { }]}
                              >
                                <Picker.Item label={t("children_profiles.class_year")} value="" />
                                {(child.educationLevel === educationalStatusOptions.find(opt => opt.value === "School")?.label ||
                                  child.educationLevel === "School") && (
                                  gradeOption.map((grade) => (
                                    <Picker.Item key={grade.value} label={grade.label} value={grade.label} />
                                  ))
                                )}
                                {(child.educationLevel === educationalStatusOptions.find(opt => opt.value === "College")?.label ||
                                  child.educationLevel === "College") && (
                                  collegeYearOption.map((year) => (
                                    <Picker.Item key={year.value} label={year.label} value={year.label} />
                                  ))
                                )}
                              
                                {(child.educationLevel === educationalStatusOptions.find(opt => opt.value === "Special Education")?.label ||
                                  child.educationLevel === "Special Education") && (
                                  <Picker.Item 
                                    label={educationalStatusOptions.find(opt => opt.value === "Special Education")?.label || "Special Education"} 
                                    value={educationalStatusOptions.find(opt => opt.value === "Special Education")?.label || "Special Education"} 
                                  />
                                )}
                              </Picker>
                            </View>
                            {errors.children?.[index]?.class && touched.children?.[index]?.class && (
                              <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.children[index].class}</Text>
                            )}
                          </View>
                        </>
                      )}

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("children_profiles.shoe_size")}</Text>
                        <View style={styles.pickerContainer}>
                          <Picker
                            selectedValue={child.shoeSize}
                            onValueChange={(itemValue) => setFieldValue(`children[${index}].shoeSize`, itemValue)}
                            style={[styles.picker1, { }]}
                          >
                            <Picker.Item label={t("children_profiles.shoe_size")} value="" />
                            {shoeSizes.map((size) => (
                              <Picker.Item key={size} label={size} value={size} />
                            ))}
                          </Picker>
                        </View>
                        {errors.children?.[index]?.shoeSize && touched.children?.[index]?.shoeSize && (
                          <Text style={[styles.errorText, { fontSize:i18n.locale === "ur" ? 14 : 12 }]}>{errors.children[index].shoeSize}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("children_profiles.clothing_size")}</Text>
                        <View style={styles.pickerContainer}>
                          <Picker
                            selectedValue={child.clothingSize}
                            onValueChange={(itemValue) => setFieldValue(`children[${index}].clothingSize`, itemValue)}
                            style={[styles.picker1, { }]}
                          >
                            <Picker.Item label={t("children_profiles.clothing_size")} value="" />
                            {clothingSizes.map((size) => (
                              <Picker.Item key={size.value} label={size.label} value={size.label} />
                            ))}
                          </Picker>
                        </View>
                        {errors.children?.[index]?.clothingSize && touched.children?.[index]?.clothingSize && (
                          <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.children[index].clothingSize}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("children_profiles.shirt_size")}</Text>
                        <View style={styles.pickerContainer}>
                          <Picker
                            selectedValue={child.shirtSize}
                            onValueChange={(itemValue) => setFieldValue(`children[${index}].shirtSize`, itemValue)}
                            style={[styles.picker1, {  }]}
                          >
                            <Picker.Item label={t("children_profiles.shirt_size")} value="" />
                            {shirtSizes.map((size) => (
                              <Picker.Item key={size} label={size} value={size} />
                            ))}
                          </Picker>
                        </View>
                        {errors.children?.[index]?.shirtSize && touched.children?.[index]?.shirtSize && (
                          <Text style={[styles.errorText, {  fontSize: i18n.locale === "ur"? 14 : 12 }]}>{errors.children[index].shirtSize}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("children_profiles.trouser_size")}</Text>
                        <View style={styles.pickerContainer}>
                          <Picker
                            selectedValue={child.trouserSize}
                            onValueChange={(itemValue) => setFieldValue(`children[${index}].trouserSize`, itemValue)}
                            style={[styles.picker1, { }]}
                          >
                            <Picker.Item label={t("children_profiles.trouser_size")} value="" />
                            {trouserSizes.map((size) => (
                              <Picker.Item key={size} label={size} value={size} />
                            ))}
                          </Picker>
                        </View>
                        {errors.children?.[index]?.trouserSize && touched.children?.[index]?.trouserSize && (
                          <Text style={[styles.errorText, { fontSize: i18n.locale === "ur" ? 14 : 12 }]}>{errors.children[index].trouserSize}</Text>
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
                    <Text style={[styles.submitButtonText, { fontSize: i18n.locale === "ur" ? 18 : 16 }]}>{t("children_profiles.save_profiles")}</Text>
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
    backgroundColor: theme.colors.pearlWhite,
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
    backgroundColor: theme.colors.pearlWhite,
  },
  picker1: {
    height: 50,
    color: theme.colors.ivory,
    backgroundColor: theme.colors.pearlWhite,
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