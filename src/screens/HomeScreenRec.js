import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { theme } from "../core/theme";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { getBaseUrl } from "../helpers/deviceDetection";
import { AuthContext } from "../context/AuthContext";

const HomeScreenRec = ({ navigation, route }) => {
  const tabBarHeight = useBottomTabBarHeight();
  const { role, type } = route.params;  // Assuming `role` and `type` are passed in params
  const { user } = useContext(AuthContext);
  
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch campaigns data when component mounts
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const BASE_URL = await getBaseUrl();
        const response = await axios.get(`${BASE_URL}/api/get-ngo-campaigns`);
        setCampaigns(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <View style={[Styles.container, { marginBottom: tabBarHeight }]}>
      <ScrollView>
        <View style={Styles.banner}>
          <Image source={require('../../assets/items/hi_rec.jpg')} style={{ opacity: 0.3, width: '100%', height: '100%', position: 'relative' }} />
          <Text style={Styles.heroText}>Hi {"\n"}Recipient!</Text>
        </View>

        <View style={{ color: theme.colors.ivory }}>
          <Text style={[Styles.headings, { marginTop: 0 }]}>Available Donations</Text>
          <View style={Styles.iconContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Education')}>
              <Icon name="school" size={40} color={theme.colors.sageGreen} style={Styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Clothes')}>
              <Icon name="checkroom" size={40} color={theme.colors.sageGreen} style={Styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Food')}>
              <Icon name="local-dining" size={40} color={theme.colors.sageGreen} style={Styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={Styles.hero}>
          <View>
            <Image source={require('../../assets/items/poor.jpeg')} style={{ height: '100%', width: '100%', borderRadius: 20, position: 'relative' }} />
            <Text style={Styles.herooText}>
              "Your journey to a{"\n"} better {"\n"}tomorrow starts here"{"\n"}Claim now!
            </Text>

            <Pressable
              style={({ pressed }) => [
                Styles.heroBttn,
                { backgroundColor: pressed ? theme.colors.sageGreen : 'rgba(0, 0, 0, 0.5)' }
              ]}
              onPress={() => navigation.navigate('RecepientStartScreen')}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Claim Now</Text>
            </Pressable>
          </View>
        </View>

        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10, marginTop: 10 }}> */}
          {/* <Text style={[Styles.headings, { marginTop: 0 }]}>Campaigns</Text> */}
          {/* <TouchableOpacity onPress={() => navigation.navigate("ViewNgoPostsScreen")}> */}
            {/* <Text style={[Styles.viewAllButton, { marginTop: 0 }]}>View All</Text> */}
          {/* </TouchableOpacity> */}
        {/* </View> */}

        {/* Only show campaigns section if role is not recipient or if type is ngo */}
{!(role === 'recipient' && user.recipientType !== 'ngo') && (
  <>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10, marginTop: 10 }}>
      <Text style={[Styles.headings, { marginTop: 0 }]}>Campaigns</Text>
      <TouchableOpacity onPress={() => navigation.navigate("ViewNgoPostsScreen")}>
        <Text style={[Styles.viewAllButton, { marginTop: 0 }]}>View All</Text>
      </TouchableOpacity>
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {!loading && campaigns.length > 0 ? (
        campaigns.slice(0, 3).map((campaign) => (
          <TouchableOpacity
            key={campaign.id}
            onPress={() => navigation.navigate('NgoPostDetailsScreen', {
              id: campaign.id, // Make sure to pass the ID
              title: campaign.campaignTitle,
              description: campaign.fullDescription,
              image: campaign.image,
              phoneNumber: campaign.phoneNumber,
              email: campaign.email,
              bankAccount: campaign.bankAccount,
              ngoName: campaign.ngoName,
              createdAt: campaign.createdAt,
            })}
            style={Styles.CampCards}
          >
            {/* Display campaign image */}
            <Image
              source={{ uri: campaign.image }}
              style={{
                width: '100%',
                opacity: 0.8,
                height: '80%',
                borderColor: 'black',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            />
            <View style={Styles.campaignContent}>
              {/* Display campaign title */}
              <Text style={Styles.campaignTitle} numberOfLines={1}>{campaign.campaignTitle}</Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={Styles.CampCards}>
          <Text style={Styles.campaignTitle}>
            {loading ? "Loading campaigns..." : "No campaigns available"}
          </Text>
        </View>
      )}
    </ScrollView>
  </>
)}
        {role === 'recipient' && user.recipientType === 'ngo' && (
          <View style={Styles.campaignButtonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('NGOCampaignForm')}
              style={Styles.campaignButton}
            >
              <Text style={Styles.campaignButtonText}>Post Campaign</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};




const Styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.charcoalBlack,
    flex: 1,
  },
  banner: {
    backgroundColor: theme.colors.TaupeBlack,
    height: 170,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  hero: {
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    marginTop: 30,
    height: 210,
    borderRadius: 20,
  },
  heroText: {
    position: 'absolute',
    top: 60,
    left: 20,
    color: theme.colors.sageGreen,
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  herooText: {
    position: 'absolute',
    top: 60,
    left: 20,
    color: theme.colors.pearlWhite,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroBttn: {
    position: 'absolute',
    bottom: 10,
    left: '65%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: theme.colors.charcoalBlack,
  },
  icon: {
    backgroundColor: theme.colors.outerSpace,
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 5,
    marginTop: 5,
  },
  campaignContent: {
    padding: 10,
  },
  campaignTitle: {
    color: theme.colors.ivory,
    fontSize: 16,
    alignSelf: "center",
  },
  campaignButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  campaignButton: {
    width: '90%',
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: theme.colors.sageGreen,
    alignItems: 'center',
  },
  campaignButtonText: {
    color: theme.colors.ivory,
    fontSize: 18,
    fontWeight: 'bold',
  },
  CampCards: {
    height: 220,
    backgroundColor: theme.colors.TaupeBlack,
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 20,
    width: 300,
    borderColor: theme.colors.sageGreen,
    borderWidth: 3,
    alignItems: 'center',
  },
  headings: { color: theme.colors.ivory, fontSize: 23, paddingTop: 20, fontWeight: "bold", marginLeft: 10 },
  viewAllButton: {
    color: theme.colors.ivory,
    fontSize: 16,
    paddingTop: 20,
    marginLeft: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
});

export default HomeScreenRec;