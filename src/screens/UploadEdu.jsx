"use client"

import { useState, useContext } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native"
import { theme } from "../core/theme"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import CircleLogoStepper2 from "../components/CircleLogoStepper2"
import { Picker } from "@react-native-picker/picker"
import ImagePickerComponent from "../components/ImagePickerComponent"
import { Formik } from "formik"
import { AuthContext } from "../context/AuthContext"
import { addEduDonation } from "../helpers/addEduDonations"
import { t } from "../i18n"

// Translation mapping for form values
const valueTranslations = {
  // Education Type
  کتابیں: "Books",
  اسٹیشنری: "Stationary",
  دیگر: "Other",

  // Education Level
  اسکول: "School",
  کالج: "College",
  یونیورسٹی: "University",
  "خصوصی تعلیم": "Special Education",

  // Condition
  نیا: "New",
  "ہلکا استعمال شدہ": "Gently Used",
  "اچھی طرح استعمال شدہ": "Well Used",

  // Subjects
  انگریزی: "English",
  اردو: "Urdu",
  ریاضی: "Mathematics",
  سائنس: "Science",
  اسلامیات: "Islamiyat",
  تاریخ: "History",
  طبیعیات: "Physics",
  کیمیا: "Chemistry",
  "بزنس اسٹڈیز": "Business Studies",
  معاشیات: "Economics",
  اکاؤنٹنگ: "Accounting",

  // Grades
  نرسری: "Nursery",
  "کے جی": "KG",
  "پہلا سال": "1st Year",
  "دوسرا سال": "2nd Year",
  "تیسرا سال": "3rd Year",
  "چوتھا سال": "4th Year",
  پہلا: "1st",
  دوسرا: "2nd",
  تیسرا: "3rd",
  چوتھا: "4th",
}

// Function to get English value from Urdu
const getEnglishValue = (urduValue) => {
  return valueTranslations[urduValue] || urduValue
}

const UploadEdu = ({ navigation }) => {
  const { user, isRTL, language } = useContext(AuthContext)
  const tabBarHeight = useBottomTabBarHeight()
  const isUrdu = language === "ur"

  // Define options with translations
  const subjectOptions = [
    { en: "English", ur: "انگریزی" },
    { en: "Urdu", ur: "اردو" },
    { en: "Mathematics", ur: "ریاضی" },
    { en: "Science", ur: "سائنس" },
    { en: "Islamiyat", ur: "اسلامیات" },
    { en: "History", ur: "تاریخ" },
    { en: "Physics", ur: "طبیعیات" },
    { en: "Chemistry", ur: "کیمیا" },
    { en: "Business Studies", ur: "بزنس اسٹڈیز" },
    { en: "Economics", ur: "معاشیات" },
    { en: "Accounting", ur: "اکاؤنٹنگ" },
    { en: "Other", ur: "دیگر" },
  ]

  const eduTypeOptions = [
    { en: "Books", ur: "کتابیں" },
    { en: "Stationary", ur: "اسٹیشنری" },
    { en: "Other", ur: "دیگر" },
  ]

  const conditionOptions = [
    { en: "New", ur: "نیا" },
    { en: "Gently Used", ur: "ہلکا استعمال شدہ" },
    { en: "Well Used", ur: "اچھی طرح استعمال شدہ" },
  ]

  const eduLevelOptions = [
    { en: "School", ur: "اسکول" },
    { en: "College", ur: "کالج" },
    { en: "University", ur: "یونیورسٹی" },
    { en: "Special Education", ur: "خصوصی تعلیم" },
  ]

  const gradeOption = [
    { en: "Nursery", ur: "نرسری" },
    { en: "KG", ur: "کے جی" },
    { en: "1", ur: "1" },
    { en: "2", ur: "2" },
    { en: "3", ur: "3" },
    { en: "4", ur: "4" },
    { en: "5", ur: "5" },
    { en: "6", ur: "6" },
    { en: "7", ur: "7" },
    { en: "8", ur: "8" },
    { en: "9", ur: "9" },
    { en: "10", ur: "10" },
    { en: "11", ur: "11" },
  ]

  const uniYearOption = [
    { en: "1st", ur: "پہلا" },
    { en: "2nd", ur: "دوسرا" },
    { en: "3rd", ur: "تیسرا" },
    { en: "4th", ur: "چوتھا" },
  ]

  const collegeYearOption = [
    { en: "1st Year", ur: "پہلا سال" },
    { en: "2nd Year", ur: "دوسرا سال" },
  ]

  // State for form fields
  const [educType, setEducType] = useState({ value: "", error: "" })
  const [eduLevel, setLevel] = useState({ value: "", error: "" })
  const [subject, setSubject] = useState({ value: "", error: "" })
  const [institution, setInstitution] = useState({ value: "", error: "" })
  const [grade, setGrade] = useState({ value: "", error: "" })
  const [condition, setCondition] = useState({ value: "", error: "" })
  const [quantity, setQuantity] = useState({ value: "1", error: "" })
  const [itemName, setItemName] = useState({ value: "", error: "" })
  const [description, setDescription] = useState({ value: "", error: "" })
  const [images, setImages] = useState([])
  const [imageErrors, setImageErrors] = useState("")

  // Helper function to get display value based on language
  const getDisplayValue = (options, value) => {
    if (!value) return ""

    // If we're in Urdu mode, find the option with matching English value and return its Urdu value
    if (language === "ur") {
      const option = options.find((opt) => opt.en === value)
      return option ? option.ur : value
    }

    return value
  }

  // Helper function to get display text for a specific option
  const getOptionText = (option) => {
    return language === "ur" ? option.ur : option.en
  }

  const validate = () => {
    let isValid = true

    if (!educType.value) {
      setEducType((prev) => ({ ...prev, error: t("uploadEdu.errors.typeRequired", "Type is required") }))
      isValid = false
    }

    if (educType.value === "Books" || getEnglishValue(educType.value) === "Books") {
      if (!institution.value) {
        setInstitution((prev) => ({
          ...prev,
          error: t("uploadEdu.errors.institutionRequired", "Institution is required"),
        }))
        isValid = false
      }

      if (!grade.value) {
        setGrade((prev) => ({ ...prev, error: t("uploadEdu.errors.gradeRequired", "Grade is required") }))
        isValid = false
      }

      if (!subject.value) {
        setSubject((prev) => ({ ...prev, error: t("uploadEdu.errors.subjectRequired", "Subject is required") }))
        isValid = false
      }
    }

    if (!eduLevel.value) {
      setLevel((prev) => ({ ...prev, error: t("uploadEdu.errors.levelRequired", "Level is required") }))
      isValid = false
    }

    if (!condition.value) {
      setCondition((prev) => ({ ...prev, error: t("uploadEdu.errors.conditionRequired", "Condition is required") }))
      isValid = false
    }

    if (Number.parseInt(quantity.value) <= 0) {
      setQuantity((prev) => ({
        ...prev,
        error: t("uploadEdu.errors.quantityPositive", "Quantity must be greater than 0"),
      }))
      isValid = false
    }

    if (Number.parseInt(quantity.value) > 1000) {
      setQuantity((prev) => ({ ...prev, error: t("uploadEdu.errors.quantityTooLarge", "Max limit exceeded") }))
      isValid = false
    }

    if (!/^\d+$/.test(quantity.value)) {
      setQuantity((prev) => ({
        ...prev,
        error: t("uploadEdu.errors.quantityNumeric", "Quantity must be a numeric value"),
      }))
      isValid = false
    }

    if (!itemName.value) {
      setItemName((prev) => ({ ...prev, error: t("uploadEdu.errors.itemNameRequired", "Item name is required") }))
      isValid = false
    }

    if (itemName.value.length > 30) {
      setItemName((prev) => ({ ...prev, error: t("uploadEdu.errors.itemNameTooLong", "Too long") }))
      isValid = false
    }

    if (itemName.value.length < 3 && itemName.value.length > 0) {
      setItemName((prev) => ({ ...prev, error: t("uploadEdu.errors.itemNameTooShort", "Too short") }))
      isValid = false
    }

    if (!description.value) {
      setDescription((prev) => ({
        ...prev,
        error: t("uploadEdu.errors.descriptionRequired", "Description is required"),
      }))
      isValid = false
    }

    if (description.value.length > 40) {
      setDescription((prev) => ({ ...prev, error: t("uploadEdu.errors.descriptionTooLong", "Too long") }))
      isValid = false
    }

    if (description.value.length < 3 && description.value.length > 0) {
      setDescription((prev) => ({ ...prev, error: t("uploadEdu.errors.descriptionTooShort", "Too short") }))
      isValid = false
    }

    if (images.length === 0) {
      setImageErrors(t("uploadEdu.errors.imageRequired", "At least one image is required"))
      isValid = false
    } else {
      setImageErrors("")
    }

    return isValid
  }

  const onSubmitMethod = async () => {
    const isValid = validate()

    if (!isValid) return

    // Convert Urdu values to English if needed
    const eduData = {
      type: language === "ur" ? getEnglishValue(educType.value) : educType.value,
      level: language === "ur" ? getEnglishValue(eduLevel.value) : eduLevel.value,
      c_condition: language === "ur" ? getEnglishValue(condition.value) : condition.value,
      quantity: quantity.value,
      itemName: itemName.value, // Keep original text
      description: description.value, // Keep original text
      images: images,
      subject: language === "ur" ? getEnglishValue(subject.value) : subject.value,
      institution: institution.value, // Keep original text
      grade: language === "ur" ? getEnglishValue(grade.value) : grade.value,
      donorUsername: user.username,
    }

    try {
      await addEduDonation(eduData)
      console.log("Education donation successfully submitted:", eduData)
      navigation.navigate("DonationSuccessScreen")
    } catch (error) {
      console.error("Error submitting education donation:", error)
    }
  }

  return (
    <View style={[Styles.container, { marginBottom: tabBarHeight }]}>
      <ScrollView>
        <CircleLogoStepper2 />
        <View style={Styles.line} />

        <Formik initialValues={{}} onSubmit={onSubmitMethod}>
          {({ handleSubmit }) => (
            <>
              {/* Education Type */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>
                  {t("uploadEdu.type", "Type")}
                </Text>
                <View style={[Styles.radioContainer]}>
                  {eduTypeOptions.map((option) => (
                    <TouchableOpacity
                      key={option.en}
                      style={[Styles.radioOption]}
                      onPress={() => setEducType({ value: option.en, error: "" })}
                    >
                      <View
                        style={[
                          Styles.radioCircle,
                          educType.value === option.en && Styles.radioSelected,
                        ]}
                      />
                      <Text style={[
                        Styles.radioLabel, 
                        isUrdu && Styles.urduRadioLabel,
                        
                      ]}>
                        {getOptionText(option)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {educType.error && (
                  <Text style={[Styles.errorText]}>{educType.error}</Text>
                )}
              </View>

              {/* Level Selection */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>
                  {t("uploadEdu.level", "Level")}
                </Text>
                <View style={Styles.dropdownContainer}>
                  <Picker
                    selectedValue={eduLevel.value}
                    onValueChange={(itemValue) => setLevel({ value: itemValue, error: "" })}
                    style={[Styles.picker, isUrdu && Styles.urduPicker]}
                  >
                    <Picker.Item label={t("uploadEdu.selectLevel", "Select Education Level")} value="" />
                    {eduLevelOptions.map((level) => (
                      <Picker.Item key={level.en} label={getOptionText(level)} value={level.en} />
                    ))}
                  </Picker>
                </View>
                {eduLevel.error && (
                  <Text style={[Styles.errorText]}>{eduLevel.error}</Text>
                )}
              </View>

              {(educType.value === "Books" || getEnglishValue(educType.value) === "Books") && (
                <>
                  {/* Institute Name */}
                  <View style={{ marginTop: 30 }}>
                    <Text style={[Styles.headings, isUrdu && Styles.urduHeadings]}>
                      {t("uploadEdu.institute", "Institute")}
                    </Text>
                    <TextInput
                      placeholder={t("uploadEdu.institutePlaceholder", "e.g Punjab College")}
                      value={institution.value}
                      onChangeText={(text) => setInstitution({ value: text, error: "" })}
                      style={[Styles.name, isUrdu && Styles.urduInput,]}
                      placeholderTextColor={theme.colors.ivory}
                      selectionColor={theme.colors.sageGreen}
                      textAlign={isUrdu ? 'right' : 'left'} // Add this line

                    />
                    {institution.error && (
                      <Text style={[Styles.errorText, ]}>{institution.error}</Text>
                    )}
                  </View>

                  {/* Grade/Year */}
                  <View style={{ marginTop: 30 }}>
                    <Text style={[Styles.headings, isUrdu && Styles.urduHeadings, ]}>
                      {eduLevel.value === "School" || getEnglishValue(eduLevel.value) === "School"
                        ? t("uploadEdu.classGrade", "Class / Grade")
                        : eduLevel.value === "College" || getEnglishValue(eduLevel.value) === "College"
                          ? t("uploadEdu.year", "Year")
                          : eduLevel.value === "University" || getEnglishValue(eduLevel.value) === "University"
                            ? t("uploadEdu.year", "Year")
                            : t("uploadEdu.program", "Program")}
                    </Text>
                    <View style={Styles.dropdownContainer}>
                      <Picker
                        selectedValue={grade.value}
                        onValueChange={(itemValue) => setGrade({ value: itemValue, error: "" })}
                        style={[Styles.picker, isUrdu && Styles.urduPicker,]}
                      >
                        <Picker.Item
                          label={
                            eduLevel.value === "School" || getEnglishValue(eduLevel.value) === "School"
                              ? t("uploadEdu.selectGrade", "Select Class/Grade")
                              : eduLevel.value === "College" || getEnglishValue(eduLevel.value) === "College"
                                ? t("uploadEdu.selectYear", "Select Year")
                                : eduLevel.value === "University" || getEnglishValue(eduLevel.value) === "University"
                                  ? t("uploadEdu.selectYear", "Select Year")
                                  : t("uploadEdu.selectProgram", "Select Program")
                          }
                          value=""
                        />
                        {(eduLevel.value === "School" || getEnglishValue(eduLevel.value) === "School") &&
                          gradeOption.map((grade) => (
                            <Picker.Item key={grade.en} label={getOptionText(grade)} value={grade.en} />
                          ))}
                        {(eduLevel.value === "College" || getEnglishValue(eduLevel.value) === "College") &&
                          collegeYearOption.map((year) => (
                            <Picker.Item key={year.en} label={getOptionText(year)} value={year.en} />
                          ))}
                        {(eduLevel.value === "University" || getEnglishValue(eduLevel.value) === "University") &&
                          uniYearOption.map((year) => (
                            <Picker.Item key={year.en} label={getOptionText(year)} value={year.en} />
                          ))}
                        {(eduLevel.value === "Special Education" ||
                          getEnglishValue(eduLevel.value) === "Special Education") && (
                          <Picker.Item
                            label={t("uploadEdu.Special Education", "Special Education")}
                            value="Special Education"
                          />
                        )}
                      </Picker>
                    </View>
                    {grade.error && (
                      <Text style={[Styles.errorText, ]}>{grade.error}</Text>
                    )}
                  </View>

                  {/* Subject */}
                  <View style={{ marginTop: 30 }}>
                    <Text style={[Styles.headings, isUrdu && Styles.urduHeadings, ]}>
                      {t("uploadEdu.subject", "Subject")}
                    </Text>
                    <View style={Styles.dropdownContainer}>
                      <Picker
                        selectedValue={subject.value}
                        onValueChange={(itemValue) => setSubject({ value: itemValue, error: "" })}
                        style={[Styles.picker, isUrdu && Styles.urduPicker, ]}
                      >
                        <Picker.Item label={t("uploadEdu.selectSubject", "Select Subject")} value="" />
                        {subjectOptions.map((subject) => (
                          <Picker.Item key={subject.en} label={getOptionText(subject)} value={subject.en} />
                        ))}
                      </Picker>
                    </View>
                    {subject.error && (
                      <Text style={[Styles.errorText, ]}>{subject.error}</Text>
                    )}
                  </View>
                </>
              )}

              {/* Condition */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings, ]}>
                  {t("uploadEdu.condition", "Condition")}
                </Text>
                <View style={[Styles.radioContainer, ]}>
                  {conditionOptions.map((option) => (
                    <TouchableOpacity
                      key={option.en}
                      style={[Styles.radioOption, ]}
                      onPress={() => setCondition({ value: option.en, error: "" })}
                    >
                      <View
                        style={[
                          Styles.radioCircle,
                          condition.value === option.en && Styles.radioSelected,
                         
                        ]}
                      />
                      <Text style={[
                        Styles.radioLabel, 
                        isUrdu && Styles.urduRadioLabel,
                       
                      ]}>
                        {getOptionText(option)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {condition.error && (
                  <Text style={[Styles.errorText, ]}>{condition.error}</Text>
                )}
              </View>

              {/* Quantity Selector */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings, ]}>
                  {t("uploadEdu.quantity", "Quantity")}
                </Text>
                <View style={[Styles.quantityContainer, ]}>
                  <Text style={[
                    Styles.quantityLabel, 
                    isUrdu && Styles.urduQuantityLabel,
                   
                  ]}>
                    {t("uploadEdu.numberOfItems", "Number of Items:")}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      setQuantity({ value: Math.max(Number.parseInt(quantity.value) - 1, 1).toString(), error: "" })
                    }
                    style={Styles.quantityButton}
                  >
                    <Text style={Styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[Styles.quantityInput, ]}
                    value={quantity.value}
                    keyboardType="numeric"
                    onChangeText={(text) => setQuantity({ value: text, error: "" })}
                  />
                  <TouchableOpacity
                    onPress={() => setQuantity({ value: (Number.parseInt(quantity.value) + 1).toString(), error: "" })}
                    style={Styles.quantityButton}
                  >
                    <Text style={Styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                {quantity.error && (
                  <Text style={[Styles.errorText, ]}>{quantity.error}</Text>
                )}
              </View>

              {/* Item Name */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings, ]}>
                  {t("uploadEdu.itemName", "Item Name")}
                </Text>
                <TextInput
                  placeholder={t("uploadEdu.itemNamePlaceholder", "e.g Punjab Textbook")}
                  value={itemName.value}
                  onChangeText={(text) => setItemName({ value: text, error: "" })}
                  style={[Styles.name, isUrdu && Styles.urduInput,]}
                  placeholderTextColor={theme.colors.ivory}
                  selectionColor={theme.colors.sageGreen}
                  textAlign={isUrdu ? 'right' : 'left'} // Add this line

                />
                {itemName.error && (
                  <Text style={[Styles.errorText, ]}>{itemName.error}</Text>
                )}
              </View>

              {/* Description */}
              <View style={{ marginTop: 30 }}>
                <Text style={[Styles.headings, isUrdu && Styles.urduHeadings,]}>
                  {t("uploadEdu.description", "Description")}
                </Text>
                <TextInput
                  placeholder={t("uploadEdu.descriptionPlaceholder", "Enter description here..")}
                  value={description.value}
                  onChangeText={(text) => setDescription({ value: text, error: "" })}
                  style={[Styles.descri, isUrdu && Styles.urduInput, ]}
                  placeholderTextColor={theme.colors.ivory}
                  selectionColor={theme.colors.sageGreen}
                  multiline={true}
                  textAlign={isUrdu ? 'right' : 'left'} // Add this line

                />
                {description.error && (
                  <Text style={[Styles.errorText, ]}>{description.error}</Text>
                )}
              </View>

              {/* Image Selection */}
              <ImagePickerComponent
                maxImages={3}
                selectedImages={images}
                onImagesChange={(updatedImages) => {
                  setImageErrors("")
                  setImages(updatedImages)
                }}
              />
              {imageErrors && <Text style={[Styles.errorText, ]}>{imageErrors}</Text>}

              {/* Submit Button */}
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity onPress={handleSubmit} style={Styles.submitButton}>
                  <Text style={[Styles.submitButtonText, isUrdu && Styles.urduSubmitButtonText]}>
                    {t("uploadEdu.submit", "Submit")}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  )
}

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
    alignItems: "center",
    width: "90%",
  },
  submitButtonText: {
    color: theme.colors.ivory,
    fontWeight: "bold",
    fontSize: 18,
  },
  urduSubmitButtonText: {
    fontSize: 20, // Increased font size for Urdu
  },
  headings: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.ivory,
  },
  urduHeadings: {
    fontSize: 20, // Increased font size for Urdu headings
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
    textAlignVertical: "top",
    paddingTop: 15,
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
  line: {
    borderBottomWidth: 1,
    borderColor: theme.colors.sageGreen,
    marginVertical: 10,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  radioOption: {
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
    backgroundColor: theme.colors.TaupeBlack,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "bold",
  },
  quantityText: {
    color: theme.colors.ivory,
    fontSize: 15,
  },
  quantityInput: {
    color: theme.colors.ivory,
    fontSize: 18,
    textAlign: "center",
    width: 50,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
})

export default UploadEdu