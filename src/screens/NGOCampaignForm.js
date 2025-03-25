import { useEffect, useState, useContext, useCallback } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Formik } from 'formik';
import { theme } from "../core/theme";
import axios from "axios"
import { getBaseUrl } from "../helpers/deviceDetection"
import { AuthContext } from "../context/AuthContext"
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import ImagePickerComponent from '../components/ImagePickerComponent';
import { t } from "../i18n";

const NGOCampaignForm = ({ navigation }) => {
    const tabBarHeight = useBottomTabBarHeight();
    const [image, setImage] = useState(null);
    const { user, isRTL, language } = useContext(AuthContext);
    const isUrdu = language === "ur";
    
    const validate = (values) => {
        const errors = {};
        if (!values.email) {
          errors.email = t("ngoCampaign.errors.emailRequired", "Email is required");
        } else if (!/^[A-Z0-9._%+-]+@gmail\.com$/i.test(values.email)) {
          errors.email = t("ngoCampaign.errors.invalidGmail", "Invalid Gmail address");
        }
        if (!values.phoneNumber) {
          errors.phoneNumber = t("ngoCampaign.errors.phoneRequired", "Phone number is required");
        } else if (!/^\+92\d{10}$/.test(values.phoneNumber)) {
          errors.phoneNumber = t("ngoCampaign.errors.invalidPhone", "Invalid phone number format. Use \"+92485255947\"");
        }
        if (!values.bankAccount) {
          errors.bankAccount = t("ngoCampaign.errors.bankRequired", "Bank account number is required");
        } else if (!/^\d{16}$/.test(values.bankAccount)) {
          errors.bankAccount = t("ngoCampaign.errors.invalidBank", "Invalid bank account number (16 digits required)");
        }
        if (!values.campaignTitle) {
          errors.campaignTitle = t("ngoCampaign.errors.titleRequired", "Campaign title is required");
        } else if (values.campaignTitle.length > 30) {
          errors.campaignTitle = t("ngoCampaign.errors.titleTooLong", "Campaign title must be 30 characters or less");
        } else if (values.campaignTitle.length < 2) {
          errors.campaignTitle = t("ngoCampaign.errors.titleTooFewWords", "Campaign title must contain at least 2 words");
        }
        if (!values.shortDescription) {
          errors.shortDescription = t("ngoCampaign.errors.shortDescRequired", "Short description is required");
        } else if (values.shortDescription.length > 50) {
          errors.shortDescription = t("ngoCampaign.errors.shortDescTooLong", "Short description must be 50 characters or less");
        } else if (values.shortDescription.length < 10) {
          errors.shortDescription = t("ngoCampaign.errors.shortDescTooShort", "Short description must be at least 10 characters");
        }
        if (!values.fullDescription) {
          errors.fullDescription = t("ngoCampaign.errors.fullDescRequired", "Full description is required");
        } else if (values.fullDescription.length > 200) {
          errors.fullDescription = t("ngoCampaign.errors.fullDescTooLong", "Full description must be 200 characters or less");
        } else if (values.fullDescription.length < 30) {
          errors.fullDescription = t("ngoCampaign.errors.fullDescTooShort", "Full description must be at least 30 characters");
        }
        if (!image) errors.image = t("ngoCampaign.errors.imageRequired", "Campaign image is required");
        return errors;
      };

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            const formData = {
                ...values,
                image,
                campaignCreatorUsername: user.username,
            };
    
            console.log('Form data being sent:', formData);
            const BASE_URL = await getBaseUrl();
    
            const response = await axios.post(`${BASE_URL}/api/add-ngo-campaign`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 200 || response.status === 201) {
                console.log('Success:', response.data);
                navigation.navigate("DonationSuccessScreen");
            } else {
                throw new Error('Failed to create campaign');
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response from API:', error.response.data);
            } else {
                console.error('Error submitting form:', error.message);
            }
        } finally {
            setSubmitting(false);
        }
    };
    
    const formatPhoneNumber = (value) => {
        const cleaned = value.replace(/[^\d]/g, '');
        const countryCode = "+92";
        if (cleaned.startsWith("92")) {
            return `+${cleaned}`;
        } else if (cleaned.startsWith("0")) {
            return `${countryCode}${cleaned.slice(1)}`;
        } else {
            return `${countryCode}${cleaned}`;
        }
    };

    return (
        <View style={[styles.container, { marginBottom: tabBarHeight }]}>
            <ScrollView>
                <Text style={styles.title}>{t("ngoCampaign.createCampaign", "Create Campaign")}</Text>
                <View style={styles.line} />

                <Formik
                    initialValues={{
                        ngoName: user.name,
                        email: '',
                        phoneNumber: '',
                        bankAccount: '',
                        campaignTitle: '',
                        shortDescription: '',
                        fullDescription: '',
                    }}
                    validate={validate}
                    onSubmit={onSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <>
                           

                            {/* Email Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>{t("ngoCampaign.email", "Email (Gmail only)")}</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        isUrdu && styles.urduInput
                                    ]}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    placeholder={t("ngoCampaign.emailPlaceholder", "Enter Gmail address")}
                                    placeholderTextColor={theme.colors.ivory}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    textAlign={isRTL ? 'right' : 'left'}
                                />
                                {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}
                            </View>

                            {/* Phone Number Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>{t("ngoCampaign.phoneNumber", "Phone Number")}</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        isUrdu && styles.urduInput
                                    ]}
                                    onChangeText={(value) => {
                                        const formatted = formatPhoneNumber(value);
                                        setFieldValue('phoneNumber', formatted);
                                    }}
                                    onBlur={handleBlur('phoneNumber')}
                                    value={values.phoneNumber}
                                    placeholder={t("ngoCampaign.phonePlaceholder", "Enter phone number (e.g., +92485255947)")}
                                    placeholderTextColor={theme.colors.ivory}
                                    keyboardType="phone-pad"
                                    textAlign={isRTL ? 'right' : 'left'}
                                />
                                {errors.phoneNumber && touched.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
                            </View>

                            {/* Bank Account Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>{t("ngoCampaign.bankAccount", "Bank Account Number (16 digits)")}</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        isUrdu && styles.urduInput
                                    ]}
                                    onChangeText={(value) => {
                                        const numericValue = value.replace(/\D/g, '');
                                        setFieldValue('bankAccount', numericValue.slice(0, 16));
                                    }}
                                    onBlur={handleBlur('bankAccount')}
                                    value={values.bankAccount}
                                    placeholder={t("ngoCampaign.bankPlaceholder", "Enter 16-digit bank account number")}
                                    placeholderTextColor={theme.colors.ivory}
                                    keyboardType="numeric"
                                    maxLength={16}
                                    textAlign={isRTL ? 'right' : 'left'}
                                />
                                {errors.bankAccount && touched.bankAccount && <Text style={styles.errorText}>{errors.bankAccount}</Text>}
                            </View>

                            {/* Campaign Title Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>{t("ngoCampaign.campaignTitle", "Campaign Title (max 30 characters)")}</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        isUrdu && styles.urduInput
                                    ]}
                                    onChangeText={handleChange('campaignTitle')}
                                    onBlur={handleBlur('campaignTitle')}
                                    value={values.campaignTitle}
                                    placeholder={t("ngoCampaign.titlePlaceholder", "Enter campaign title")}
                                    placeholderTextColor={theme.colors.ivory}
                                    maxLength={30}
                                    textAlign={isRTL ? 'right' : 'left'}
                                />
                                <Text style={[styles.charCount, isRTL && styles.rtlText]}>{values.campaignTitle.length}/30</Text>
                                {errors.campaignTitle && touched.campaignTitle && <Text style={styles.errorText}>{errors.campaignTitle}</Text>}
                            </View>

                            {/* Short Description Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>{t("ngoCampaign.shortDescription", "Short Description (max 50 characters)")}</Text>
                                <TextInput
                                    style={[
                                        styles.textArea,
                                        isUrdu && styles.urduTextArea
                                    ]}
                                    onChangeText={handleChange('shortDescription')}
                                    onBlur={handleBlur('shortDescription')}
                                    value={values.shortDescription}
                                    placeholder={t("ngoCampaign.shortDescPlaceholder", "Enter short description")}
                                    placeholderTextColor={theme.colors.ivory}
                                    multiline
                                    numberOfLines={3}
                                    maxLength={50}
                                    textAlign={isRTL ? 'right' : 'left'}
                                    textAlignVertical="top"
                                />
                                <Text style={[styles.charCount, isRTL && styles.rtlText]}>{values.shortDescription.length}/50</Text>
                                {errors.shortDescription && touched.shortDescription && <Text style={styles.errorText}>{errors.shortDescription}</Text>}
                            </View>

                            {/* Full Description Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>{t("ngoCampaign.fullDescription", "Full Description (max 200 characters)")}</Text>
                                <TextInput
                                    style={[
                                        styles.textArea,
                                        isUrdu && styles.urduTextArea
                                    ]}
                                    onChangeText={handleChange('fullDescription')}
                                    onBlur={handleBlur('fullDescription')}
                                    value={values.fullDescription}
                                    placeholder={t("ngoCampaign.fullDescPlaceholder", "Enter full description")}
                                    placeholderTextColor={theme.colors.ivory}
                                    multiline
                                    numberOfLines={6}
                                    maxLength={200}
                                    textAlign={isRTL ? 'right' : 'left'}
                                    textAlignVertical="top"
                                />
                                <Text style={[styles.charCount, isRTL && styles.rtlText]}>{values.fullDescription.length}/200</Text>
                                {errors.fullDescription && touched.fullDescription && <Text style={styles.errorText}>{errors.fullDescription}</Text>}
                            </View>

                            {/* Campaign Image Upload */}
                            <View style={styles.inputContainer}>
                                <ImagePickerComponent
                                    maxImages={1}
                                    selectedImages={image ? [image] : []}
                                    onImagesChange={(images) => setImage(images[0])}
                                />
                                {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
                            </View>

                            {/* Wrapper for Submit Button */}
                            <View style={styles.buttonWrapper}>
                                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                                    <Text style={styles.submitButtonText}>{t("ngoCampaign.createCampaignButton", "Create Campaign")}</Text>
                                </TouchableOpacity>
                            </View>
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
        paddingTop: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.ivory,
        textAlign: 'center',
        marginBottom: 5,
    },
    line: {
        borderBottomWidth: 1,
        borderColor: theme.colors.sageGreen,
        marginVertical: 10,
    },
    inputContainer: {
        marginBottom: 10,
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
    urduInput: {
        fontSize: 18,
        textAlign: 'right',
    },
    textArea: {
        backgroundColor: theme.colors.TaupeBlack,
        height: 100,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: theme.colors.ivory,
        paddingHorizontal: 15,
        paddingTop: 10,
        color: theme.colors.ivory,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    urduTextArea: {
        fontSize: 18,
        textAlign: 'right',
    },
    submitButton: {
        backgroundColor: theme.colors.sageGreen,
        padding: 13,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
        width: '90%',
    },
    submitButtonText: {
        color: theme.colors.ivory,
        fontWeight: 'bold',
        fontSize: 18,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 1,
    },
    charCount: {
        color: theme.colors.ivory,
        fontSize: 12,
        textAlign: 'right',
        marginTop: 5,
    },
    rtlText: {
        textAlign: 'left',
    },
    buttonWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NGOCampaignForm;