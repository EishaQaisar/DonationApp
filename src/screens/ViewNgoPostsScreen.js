import React, { useEffect, useState, useContext } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  View, 
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { theme } from "../core/theme";
import BackButton from "../components/BackButton";
import axios from 'axios';
import { getBaseUrl } from "../helpers/deviceDetection";
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { AuthContext } from "../context/AuthContext";
import { t } from "../i18n";

const { width } = Dimensions.get('window');

export default function ViewNgoPostsScreen({ navigation }) {
  const [ngoCampaigns, setNgoCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const { isRTL, language } = useContext(AuthContext);
  const isUrdu = language === "ur";

  useEffect(() => {
    const fetchNgoCampaigns = async () => {
      try {
        const BASE_URL = await getBaseUrl();
        const response = await axios.get(`${BASE_URL}/api/get-ngo-campaigns`);
        setNgoCampaigns(response.data);
        setLoading(false);
        
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Error fetching NGO campaigns:', error);
        setLoading(false);
      }
    };

    fetchNgoCampaigns();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.sageGreen} />
        <Text style={styles.loadingText}>
          {t("ngoPost.loading", "Loading NGO campaigns...")}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {ngoCampaigns.length > 0 ? (
            ngoCampaigns.map((campaign) => (
              <TouchableOpacity
                key={campaign.id}
                style={styles.cardWrapper}
                activeOpacity={0.9}
                onPress={() => {
                  navigation.navigate('NgoPostDetailsScreen', {
                    id: campaign.id,
                    title: campaign.campaignTitle,
                    description: campaign.fullDescription,
                    image: campaign.image,
                    ngoName: campaign.ngoName,
                    phoneNumber: campaign.phoneNumber,
                    email: campaign.email,
                    bankAccount: campaign.bankAccount,
                    createdAt: campaign.createdAt,
                    claimStatus: campaign.claimStatus,
                    campaignCreatorUsername: campaign.campaignCreatorUsername,
                  });
                }}
              >
                <Card style={styles.card}>
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ uri: campaign.image }} 
                      style={styles.image} 
                      resizeMode="cover"
                    />
                    <View style={styles.overlay}>
                      <Text style={[
                        styles.ngoName,
                        isUrdu && styles.urduText
                      ]}>
                        {campaign.ngoName}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.cardContent}>
                    <Text style={[
                      styles.title,
                      isUrdu && styles.urduTitle,
                    ]}>
                      {campaign.campaignTitle}
                    </Text>
                    <Text style={[
                      styles.description,
                      isUrdu && styles.urduText,
                    ]} numberOfLines={2}>
                      {campaign.shortDescription}
                    </Text>
                    
                    <Divider style={styles.divider} />
                    
                    <View style={styles.contactInfo}>
                      <View style={[
                        styles.contactItem,
                      ]}>
                        <Ionicons name="call" size={16} color={theme.colors.sageGreen} />
                        <Text style={[
                          styles.contactText,
                          isUrdu && styles.urduSmallText,
                        ]}>
                          {campaign.phoneNumber}
                        </Text>
                      </View>
                      
                      <View style={[
                        styles.contactItem,
                      ]}>
                        <MaterialIcons name="email" size={16} color={theme.colors.sageGreen} />
                        <Text style={[
                          styles.contactText,
                          isUrdu && styles.urduSmallText,
                        ]}>
                          {campaign.email}
                        </Text>
                      </View>
                      
                      <View style={[
                        styles.contactItem,
                      ]}>
                        <FontAwesome name="bank" size={14} color={theme.colors.sageGreen} />
                        <Text style={[
                          styles.contactText,
                          isUrdu && styles.urduSmallText,
                        ]}>
                          {campaign.bankAccount.substring(0, 4)}****{campaign.bankAccount.substring(campaign.bankAccount.length - 4)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={[
                      styles.buttonContainer,
                    ]}>
                      <Text style={[
                        styles.viewDetailsText,
                        isUrdu && styles.urduSmallText,
                      ]}>
                        {t("ngoPost.viewDetails", "View Details")}
                      </Text>
                      <Ionicons 
                        name={isRTL ? "chevron-back" : "chevron-forward"} 
                        size={16} 
                        color={theme.colors.sageGreen} 
                      />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="alert-circle-outline" size={60} color={theme.colors.sageGreen} />
              <Text style={[
                styles.noDataText,
                isUrdu && styles.urduTitle
              ]}>
                {t("ngoPost.noCampaigns", "No campaigns available")}
              </Text>
              <Text style={[
                styles.noDataSubText,
                isUrdu && styles.urduText
              ]}>
                {t("ngoPost.checkLater", "Check back later for new campaigns")}
              </Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.charcoalBlack,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: theme.colors.outerSpace,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.ivory,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  cardWrapper: {
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: theme.colors.sageGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme.colors.outerSpace,
    borderWidth: 1,
    borderColor: 'rgba(178, 172, 136, 0.3)', // sageGreen with opacity
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  ngoName: {
    color: theme.colors.sageGreen,
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.ivory,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: theme.colors.pearlWhite,
    marginBottom: 12,
    lineHeight: 20,
  },
  divider: {
    backgroundColor: 'rgba(178, 172, 136, 0.2)',
    height: 1,
    marginVertical: 12,
  },
  contactInfo: {
    marginTop: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 13,
    color: theme.colors.pearlWhite,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  viewDetailsText: {
    fontSize: 14,
    color: theme.colors.sageGreen,
    fontWeight: '600',
    marginRight: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.charcoalBlack,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.ivory,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
  },
  noDataText: {
    color: theme.colors.ivory,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  noDataSubText: {
    color: theme.colors.pearlWhite,
    fontSize: 14,
    marginTop: 8,
    opacity: 0.7,
  },
  urduTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  urduText: {
    fontSize: 16,
  },
  urduSmallText: {
    fontSize: 14,
  },
});