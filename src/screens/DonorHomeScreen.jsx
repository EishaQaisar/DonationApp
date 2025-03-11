import React ,{useState, useContext,useEffect}from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { theme } from "../core/theme";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from "../context/AuthContext";
import { ngoPostsData } from './ViewNgoPostsScreen';
import { getBaseUrl } from "../helpers/deviceDetection";
import axios from 'axios';



const DonorHomeScreen = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();
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
        <Image source={require('../../assets/items/donorp1.jpg') } style={{opacity:0.3, width:'100%', height:'100%',              position: 'relative'
        }} >

        </Image>
<Text style={Styles.heroText1}>
              Hi Donor  {user.username}
            </Text>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 50,
          }}>
            <View>
            </View>
          </View>
        </View>

        <View style={{ color: theme.colors.ivory }}>
        <Text style={[Styles.headings, {marginTop:0}]}>Donations</Text>

        <View style={Styles.iconContainer}>
                 
                        <TouchableOpacity onPress={() => navigation.navigate('Education')}>
                            <Icon
                                name="school"
                                size={40}
                                color={theme.colors.sageGreen}
                                style={Styles.icon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Clothes')}>
                            <Icon
                                name="checkroom"
                                size={40}
                                color={ theme.colors.sageGreen} // Highlight if on Clothing page
                                style={Styles.icon} // Apply active style if on Clothing page
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Food')}>
                            <Icon
                                name="local-dining"
                                size={40}
                                color={theme.colors.sageGreen}
                                style={Styles.icon}
                            />
                        </TouchableOpacity>
                        
                    </View>
        </View>

        <View style={Styles.hero}>
          <View>
            <Image source={require('../../assets/items/give.jpg')} style={{
              height: '100%',
              width: '100%',
              borderRadius: 20,
              position: 'relative'
            }} />
            <Text style={Styles.heroText}>
              Give to{"\n"}make a{"\n"}difference
            </Text>

            <Pressable
              style={({ pressed }) => [
                Styles.heroBttn,
                { backgroundColor: pressed ? theme.colors.sageGreen : 'rgba(0, 0, 0, 0.5)' } // Changes to sage green when pressed
              ]}
              onPress={() => navigation.navigate('ChooseCategory')}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Donate Now</Text>
            </Pressable>
          </View>
        </View>

        <Text style={[Styles.headings, {marginTop:20}]}>Features</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("ScheduleRDeliveryScreen")}
            style={Styles.optionCards}
          >
            <Image source={require('../../assets/items/sch4.jpg')} style={{
              width: '100%',
              opacity: 0.8,
              height: '80%',
              borderColor: 'black',
              borderTopLeftRadius: 17.5,
              borderTopRightRadius: 17.5,
            }} />
            <Text style={{padding:5, color: theme.colors.ivory }}>Schedule Delivery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("DonorOrderTrackingScreen")}
            style={Styles.optionCards}
          >
            <Image source={require('../../assets/items/moni.jpg')} style={{
              width: '100%',
              opacity: 0.8,
              height: '80%',
              borderColor: 'black',
              borderTopLeftRadius: 17.5,
              borderTopRightRadius: 17.5,
            }} />
            <Text style={{padding:5, color: theme.colors.ivory }}>Monitor Delivery</Text>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => navigation.navigate("DonorOrderTrcaking")}
            style={Styles.optionCards}
          >
            <Image source={require('../../assets/items/viewanalytics2.jpg')} style={{
              width: '100%',
              opacity: 0.8,
              height: '80%',
              borderColor: 'black',
              borderTopLeftRadius: 17.5,
              borderTopRightRadius: 17.5,
            }} />
            <Text style={{padding:5, color: theme.colors.ivory }}>View Analytics</Text>
          </TouchableOpacity>

          

        
        </ScrollView>
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
  heroImg: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    position: 'relative',
  },
  heroBttn: {
    position: 'absolute',
    bottom: 10, // You can adjust the position as needed
    left: '65%',   // You can adjust the position as needed
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: make button semi-transparent
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  heroText: {
    position: 'absolute',
    top: 60,
    left: 20,
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  heroText1: {
    position: 'absolute',
    top: 70,
    left: 10,
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  optionCards: {
    height: 150,
    backgroundColor: theme.colors.TaupeBlack,
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 20,
    width: 160,
    borderColor: theme.colors.sageGreen,
    borderWidth: 3,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
  headings:{ color: theme.colors.ivory, fontSize: 23, paddingTop:20, fontWeight:"bold", marginLeft:10 },
  categories:{
    width: 70,
    height: 70,
    borderRadius: 35, // Half of width/height for perfect circle
    marginBottom: 8,
    position: 'relative',
    backgroundColor:theme.colors.sageGreen
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center icons with minimal spacing
    backgroundColor: theme.colors.charcoalBlack,
},
icon: {
    backgroundColor: theme.colors.outerSpace,
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 5,
    marginTop:5
},
campaignContent: {
  padding: 10,
},
campaignTitle: {
  color: theme.colors.ivory,
  fontSize: 16,
  alignSelf: "center",
},
viewAllButton: {
  color: theme.colors.ivory,
  fontSize: 16,
  paddingTop: 20,
  marginLeft: 10,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: 10,
},
campaignDescription: {
  color: theme.colors.ivory,
  fontSize: 14,
  marginTop: 5,
},
});

export default DonorHomeScreen;
