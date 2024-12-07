import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Formik } from 'formik';
import { theme } from "../core/theme";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import ImagePickerComponent from '../components/ImagePickerComponent';

const NGOCampaignForm = ({ navigation }) => {
    const tabBarHeight = useBottomTabBarHeight();
    const [image, setImage] = useState(null);

    const validate = (values) => {
        const errors = {};
        if (!values.ngoName) errors.ngoName = 'NGO name is required';
        if (!values.email) {
            errors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@gmail\.com$/i.test(values.email)) {
            errors.email = 'Invalid Gmail address';
        }
        if (!values.phoneNumber) {
            errors.phoneNumber = 'Phone number is required';
        } else if (!/^\+92\d{9}$/.test(values.phoneNumber)) {
            errors.phoneNumber = 'Invalid phone number format. Use "+92485255947"';
        }
        if (!values.bankAccount) {
            errors.bankAccount = 'Bank account number is required';
        } else if (!/^\d{16}$/.test(values.bankAccount)) {
            errors.bankAccount = 'Invalid bank account number (16 digits required)';
        }
        if (!values.campaignTitle) {
            errors.campaignTitle = 'Campaign title is required';
        } else if (values.campaignTitle.length > 30) {
            errors.campaignTitle = 'Campaign title must be 30 characters or less';
        }
        if (!values.shortDescription) {
            errors.shortDescription = 'Short description is required';
        } else if (values.shortDescription.length > 50) {
            errors.shortDescription = 'Short description must be 50 characters or less';
        }
        if (!values.fullDescription) {
            errors.fullDescription = 'Full description is required';
        } else if (values.fullDescription.length > 200) {
            errors.fullDescription = 'Full description must be 200 characters or less';
        }
        if (!image) errors.image = 'Campaign image is required';
        return errors;
    };

    const onSubmit = (values, { setSubmitting }) => {
        console.log({ ...values, image });
        setSubmitting(false);
    };

    const formatPhoneNumber = (value) => {
        const cleaned = value.replace(/[^\d]/g, ''); // Remove all non-numeric characters
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
                <Text style={styles.title}>Create Campaign</Text>
                <View style={styles.line} />

                <Formik
                    initialValues={{
                        ngoName: '',
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
                            {/* NGO Name Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>NGO Name</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('ngoName')}
                                    onBlur={handleBlur('ngoName')}
                                    value={values.ngoName}
                                    placeholder="Enter NGO name"
                                    placeholderTextColor={theme.colors.ivory}
                                />
                                {errors.ngoName && touched.ngoName && <Text style={styles.errorText}>{errors.ngoName}</Text>}
                            </View>

                            {/* Email Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email (Gmail only)</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    placeholder="Enter Gmail address"
                                    placeholderTextColor={theme.colors.ivory}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}
                            </View>

                            {/* Phone Number Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Phone Number</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(value) => {
                                        const formatted = formatPhoneNumber(value);
                                        setFieldValue('phoneNumber', formatted);
                                    }}
                                    onBlur={handleBlur('phoneNumber')}
                                    value={values.phoneNumber}
                                    placeholder="Enter phone number (e.g., +92485255947)"
                                    placeholderTextColor={theme.colors.ivory}
                                    keyboardType="phone-pad"
                                />
                                {errors.phoneNumber && touched.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
                            </View>

                            {/* Bank Account Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Bank Account Number (16 digits)</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(value) => {
                                        const numericValue = value.replace(/\D/g, '');
                                        setFieldValue('bankAccount', numericValue.slice(0, 16));
                                    }}
                                    onBlur={handleBlur('bankAccount')}
                                    value={values.bankAccount}
                                    placeholder="Enter 16-digit bank account number"
                                    placeholderTextColor={theme.colors.ivory}
                                    keyboardType="numeric"
                                    maxLength={16}
                                />
                                {errors.bankAccount && touched.bankAccount && <Text style={styles.errorText}>{errors.bankAccount}</Text>}
                            </View>

                            {/* Campaign Title Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Campaign Title (max 30 characters)</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('campaignTitle')}
                                    onBlur={handleBlur('campaignTitle')}
                                    value={values.campaignTitle}
                                    placeholder="Enter campaign title"
                                    placeholderTextColor={theme.colors.ivory}
                                    maxLength={30}
                                />
                                <Text style={styles.charCount}>{values.campaignTitle.length}/30</Text>
                                {errors.campaignTitle && touched.campaignTitle && <Text style={styles.errorText}>{errors.campaignTitle}</Text>}
                            </View>

                            {/* Short Description Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Short Description (max 50 characters)</Text>
                                <TextInput
                                    style={styles.textArea}
                                    onChangeText={handleChange('shortDescription')}
                                    onBlur={handleBlur('shortDescription')}
                                    value={values.shortDescription}
                                    placeholder="Enter short description"
                                    placeholderTextColor={theme.colors.ivory}
                                    multiline
                                    numberOfLines={3}
                                    maxLength={50}
                                />
                                <Text style={styles.charCount}>{values.shortDescription.length}/50</Text>
                                {errors.shortDescription && touched.shortDescription && <Text style={styles.errorText}>{errors.shortDescription}</Text>}
                            </View>

                            {/* Full Description Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Full Description (max 200 characters)</Text>
                                <TextInput
                                    style={styles.textArea}
                                    onChangeText={handleChange('fullDescription')}
                                    onBlur={handleBlur('fullDescription')}
                                    value={values.fullDescription}
                                    placeholder="Enter full description"
                                    placeholderTextColor={theme.colors.ivory}
                                    multiline
                                    numberOfLines={6}
                                    maxLength={200}
                                />
                                <Text style={styles.charCount}>{values.fullDescription.length}/200</Text>
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
                                    <Text style={styles.submitButtonText}>Create Campaign</Text>
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
    buttonWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NGOCampaignForm;

