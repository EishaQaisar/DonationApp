// src/screens/donor/Home.js

import React ,{useState, useContext}from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { theme } from "../core/theme";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from "../context/AuthContext";


const DonorHomeScreen = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();
  const { user } = useContext(AuthContext);

  return (

    <View style={[Styles.container, { marginBottom: tabBarHeight }]}>
      <ScrollView>
        <View style={Styles.banner}>
        <Image source={require('../../assets/items/don1.jpg') } style={{opacity:0.3, width:'100%', height:'100%',              position: 'relative'
        }} >

        </Image>
<Text style={Styles.heroText}>
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
            <Image source={require('../../assets/items/don1.jpg')} style={{
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
            <Image source={require('../../assets/items/scheduleDelivery.jpg')} style={{
              width: '100%',
              opacity: 0.8,
              height: '80%',
              borderColor: 'black',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }} />
            <Text style={{ color: theme.colors.ivory }}>Delivery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Detail")}
            style={Styles.optionCards}
          >
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Detail")}
            style={Styles.optionCards}
          >
          </TouchableOpacity>
        </ScrollView>
        <Text style={[Styles.headings, {marginTop:20}]}>Campaigns</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("ScheduleDelivery")}
            style={Styles.CampCards}
          >
            <Image source={require('../../assets/items/ngo1.jpg')} style={{
              width: '100%',
              opacity: 0.8,
              height: '80%',
              borderColor: 'black',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }} />
            <Text style={{ color: theme.colors.ivory }}>Delivery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Detail")}
            style={Styles.CampCards}
          >
          <Image source={require('../../assets/items/ngo3.jpg')} style={{
              width: '100%',
              opacity: 0.8,
              height: '80%',
              borderColor: 'black',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Detail")}
            style={Styles.CampCards}
          >
            <Image source={require('../../assets/items/ngo2.jpg')} style={{
              width: '100%',
              opacity: 0.8,
              height: '80%',
              borderColor: 'black',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }} />
          </TouchableOpacity>
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
});

export default DonorHomeScreen;
