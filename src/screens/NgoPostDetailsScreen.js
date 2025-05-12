import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, Image, TouchableOpacity, ScrollView, View, Alert, ActivityIndicator } from 'react-native';
import { theme } from '../core/theme';
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import axios from 'axios';
import { getBaseUrl } from "../helpers/deviceDetection";
import { AuthContext } from "../context/AuthContext";
import { t } from "../i18n";

export default function NgoPostDetailsScreen({ route, navigation }) {
  // Get the campaign details from route params
  const { 
    id, 
    title, 
    description, 
    image, 
    ngoName, 
    phoneNumber, 
    email, 
    bankAccount, 
    createdAt, 
    claimStatus, 
    campaignCreatorUsername 
  } = route.params;
  
  const [showButton, setShowButton] = useState(true);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [loading, setLoading] = useState(false); // Changed to false since we have route params
  const { isRTL, language } = useContext(AuthContext);
  const isUrdu = language === "ur";
  
  const [campaignDetails, setCampaignDetails] = useState({
    title: title || '',
    description: description || '',
    image: image || '',
    ngoName: ngoName || '',
    phoneNumber: phoneNumber || '',
    email: email || '',
    bankAccount: bankAccount || '',
    createdAt: createdAt || '',
    claimStatus: claimStatus || '',
    campaignCreatorUsername: campaignCreatorUsername || ''
  });

  // Log the route params and initial state for debugging
  useEffect(() => {
    console.log("Route params:", route.params);
    console.log("Initial campaign details:", campaignDetails);
  }, []);

  // Fetch campaign details from the database only if needed
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      // If we already have all the data from route params, skip the fetch
      if (title && description && image && ngoName && phoneNumber && email && bankAccount) {
        console.log("Using data from route params");
        setLoading(false);
        return;
      }
      
      if (!id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const BASE_URL = await getBaseUrl();
        const response = await axios.get(`${BASE_URL}/api/get-campaign-details/${id}`);
        console.log("Campaign details response:", response.data);
        
        setCampaignDetails({
          title: response.data.campaignTitle || title || '',
          description: response.data.fullDescription || description || '',
          image: response.data.image || image || '',
          ngoName: response.data.ngoName || ngoName || '',
          phoneNumber: response.data.phoneNumber || phoneNumber || '',
          email: response.data.email || email || '',
          bankAccount: response.data.bankAccount || bankAccount || '',
          createdAt: response.data.createdAt || createdAt || '',
          claimStatus: response.data.claimStatus || claimStatus || '',
          campaignCreatorUsername: response.data.campaignCreatorUsername || campaignCreatorUsername || ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching campaign details:', error);
        // If fetching fails, ensure we're still using the data passed in route.params
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id]);

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowButton(scrollY <= 50); // Hide the button if scrolled more than 50 pixels
  };

  // Format date if createdAt exists
  const formattedDate = campaignDetails.createdAt ? new Date(campaignDetails.createdAt).toLocaleDateString(
    isUrdu ? 'ur-PK' : 'en-US'
  ) : '';

  const handleSupportNow = () => {
    console.log("Support Now button clicked");
    console.log("Current contact info:", {
      phone: campaignDetails.phoneNumber,
      email: campaignDetails.email,
      bank: campaignDetails.bankAccount
    });
    
    // Toggle the display of contact information
    setShowContactInfo(!showContactInfo);
    
    // If there's no contact information available, show an alert
    if (!campaignDetails.phoneNumber && !campaignDetails.email && !campaignDetails.bankAccount) {
      Alert.alert(
        t("ngoPost.contactUnavailableTitle", "Contact Information Unavailable"),
        t("ngoPost.contactUnavailableMessage", "Sorry, no contact information is available for this campaign."),
        [{ text: t("common.ok", "OK") }]
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.sageGreen} />
        <Text style={{ color: theme.colors.ivory }}>
          {t("ngoPost.loading", "Loading campaign details...")}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16} // Improves scroll performance
      >
        {/* Displaying the image of the campaign */}
        <Image 
          source={{ uri: campaignDetails.image }} 
          style={styles.detailsImage} 
          resizeMode="cover"
        />
        
        {/* Displaying the title of the campaign */}
        <Text style={[
          styles.detailsTitle,
          isUrdu && styles.urduTitle
        ]}>
          {campaignDetails.title}
        </Text>

        {/* Display NGO name if available */}
        {campaignDetails.ngoName && (
          <Text style={[
            styles.ngoName,
            isUrdu && styles.urduText
          ]}>
            {t("ngoPost.byNgo", "By NGO:")} {campaignDetails.ngoName}
          </Text>
        )}

        {/* Display creation date if available */}
        {formattedDate && (
          <Text style={[
            styles.dateText,
            isUrdu && styles.urduSmallText
          ]}>
            {t("ngoPost.postedOn", "Posted on:")} {formattedDate}
          </Text>
        )}

        {/* Displaying the full description */}
        <Text style={[
          styles.detailsDescription,
          isUrdu && styles.urduText
        ]}>
          {campaignDetails.description}
        </Text>

        {/* Display contact information if button is clicked */}
        {showContactInfo && (
          <View style={[
            styles.contactContainer,
          ]}>
            <Text style={[
              styles.contactTitle,
              isUrdu && styles.urduText
            ]}>
              {t("ngoPost.contactInfo", "Contact Information:")}
            </Text>
            {campaignDetails.phoneNumber ? (
              <Text style={[
                styles.contactText,
                isUrdu && styles.urduSmallText
              ]}>
                {t("ngoPost.phone", "Phone:")} {campaignDetails.phoneNumber}
              </Text>
            ) : (
              <Text style={[
                styles.contactTextUnavailable,
                isUrdu && styles.urduSmallText
              ]}>
                {t("ngoPost.phone", "Phone:")} {t("ngoPost.notAvailable", "Not available")}
              </Text>
            )}
            
            {campaignDetails.email ? (
              <Text style={[
                styles.contactText,
                isUrdu && styles.urduSmallText
              ]}>
                {t("ngoPost.email", "Email:")} {campaignDetails.email}
              </Text>
            ) : (
              <Text style={[
                styles.contactTextUnavailable,
                isUrdu && styles.urduSmallText
              ]}>
                {t("ngoPost.email", "Email:")} {t("ngoPost.notAvailable", "Not available")}
              </Text>
            )}
            
            {campaignDetails.bankAccount ? (
              <Text style={[
                styles.contactText,
                isUrdu && styles.urduSmallText
              ]}>
                {t("ngoPost.bankAccount", "Bank Account:")} {campaignDetails.bankAccount}
              </Text>
            ) : (
              <Text style={[
                styles.contactTextUnavailable,
                isUrdu && styles.urduSmallText
              ]}>
                {t("ngoPost.bankAccount", "Bank Account:")} {t("ngoPost.notAvailable", "Not available")}
              </Text>
            )}
          </View>
        )}

        {/* A poetic line for better engagement */}
        <Text style={[
          styles.poeticLine,
          isUrdu && styles.urduPoetic
        ]}>
          {t("ngoPost.poeticLine", "\"Extend your hand, where hope begins, and kindness wins.\"")}
        </Text>
        
        {/* Support Now button that shows contact information when clicked */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.button}
            onPress={handleSupportNow}
          >
            {showContactInfo 
              ? t("ngoPost.hideContactInfo", "Hide Contact Info") 
              : t("ngoPost.supportNow", "Support Now")}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.outerSpace,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.TaupeBlack,
  },
  detailsImage: {
    height: 300,
    width: '100%',
    marginBottom: 16,
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
    color: theme.colors.ivory,
  },
  urduTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  ngoName: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.sageGreen,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    color: theme.colors.ivory,
    opacity: 0.7,
  },
  detailsDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    marginVertical: 8,
    color: theme.colors.ivory,
  },
  urduText: {
    fontSize: 18,
    lineHeight: 28,
  },
  urduSmallText: {
    fontSize: 16,
  },
  contactContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.sageGreen,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.ivory,
  },
  contactText: {
    fontSize: 14,
    marginBottom: 4,
    color: theme.colors.ivory,
  },
  contactTextUnavailable: {
    fontSize: 14,
    marginBottom: 4,
    color: theme.colors.ivory,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  backButtonWrapper: {
    position: 'absolute',
    marginTop: -10,
    left: 2,
    zIndex: 100,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: theme.colors.sageGreen,
    width: '80%',
  },
  poeticLine: {
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
    color: theme.colors.ivory,
  },
  urduPoetic: {
    fontSize: 22,
    fontStyle: 'normal',
  },
});