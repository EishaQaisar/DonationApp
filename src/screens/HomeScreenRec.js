// src/screens/donor/Home.js

import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { theme } from "../core/theme";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';


const HomeScreenRec = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={[Styles.container, { marginBottom: tabBarHeight }]}>
      <ScrollView>
        <View style={Styles.banner}>
          <Image source={require('../../assets/items/hi_rec.jpg')} style={{ opacity: 0.3, width: '100%', height: '100%', position: 'relative' }} />

          <Text style={Styles.heroText}>
            Hi {"\n"}Recepient!
          </Text>

          
        </View>

        <View style={{ color: theme.colors.ivory }}>
          <Text style={[Styles.headings, { marginTop: 0 }]}>Available Donations</Text>

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
                color={theme.colors.sageGreen}
                style={Styles.icon}
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
            <Image source={require('../../assets/items/poor.jpeg')} style={{ height: '100%', width: '100%', borderRadius: 20, position: 'relative' }} />
            <Text style={Styles.herooText}>
            "Your journey to a{"\n"} better {"\n"}tomorrow starts here"{"\n"}Claim now!             </Text>

            <Pressable
              style={({ pressed }) => [
                Styles.heroBttn,
                { backgroundColor: pressed ? theme.colors.sageGreen : 'rgba(0, 0, 0, 0.5)' } // Changes to sage green when pressed
              ]}
              onPress={() => navigation.navigate('RecepientStartScreen')}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Claim Now</Text>
            </Pressable>
          </View>
        </View>

        <Text style={[Styles.headings, { marginTop: 20 }]}>Features</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => navigation.navigate("ScheduleDelivery")} style={Styles.optionCards}>
            <Image source={require('../../assets/items/poor.jpeg')} style={{ width: '100%', opacity: 0.8, height: '80%', borderColor: 'black', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} />
            <Text style={{ color: theme.colors.ivory }}>Delivery</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Detail")} style={Styles.optionCards}>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Detail")} style={Styles.optionCards}>
          </TouchableOpacity>
        </ScrollView>

        <Text style={[Styles.headings, { marginTop: 20 }]}>Campaigns</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => navigation.navigate("ScheduleDelivery")} style={Styles.CampCards}>
            <Image source={require('../../assets/items/poor.jpeg')} style={{ width: '100%', opacity: 0.8, height: '80%', borderColor: 'black', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} />
            <Text style={{ color: theme.colors.ivory }}>Delivery</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Detail")} style={Styles.CampCards}>
            <Image source={require('../../assets/items/poor.jpeg')} style={{ width: '100%', opacity: 0.8, height: '80%', borderColor: 'black', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Detail")} style={Styles.CampCards}>
            <Image source={require('../../assets/items/poor.jpeg')} style={{ width: '100%', opacity: 0.8, height: '80%', borderColor: 'black', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} />
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
  heroText: {
    position: 'absolute',
    top: 60,
    left: 20,
    color: theme.colors.sageGreen,  // Changed to sage green for a more prominent look
    fontSize: 30,                  // Increased font size for emphasis
    fontWeight: 'bold',
    fontFamily: 'Roboto',          // Keeps the same font or can be changed to any preferred font
    textTransform: 'uppercase',    // Makes the text uppercase for a bolder appearance
    letterSpacing: 1,              // Adds some spacing between letters
  },
  herooText: {
    position: 'absolute',
    top: 60,
    left: 20,
    color: theme.colors.pearlWhite,  // Changed to pearl white
    fontSize: 16,                   // Smaller font size
    fontWeight: 'bold',
    fontFamily: 'Roboto',           // Keeps the same font or can be changed to any preferred font
    fontStyle: 'italic',           // Makes the text italic
    textTransform: 'uppercase',    // Makes the text uppercase for a bolder appearance
    letterSpacing: 1,              // Adds some spacing between letters
  },
  // heroText: {
  //   position: 'absolute',
  //   top: 60,
  //   left: 20,
  //   color: 'white',
  //   fontSize: 22,
  //   fontWeight: 'bold',
  //   fontFamily: 'Roboto',  // You can change this to any font you want
  // },
  attractiveLine: {
    position: 'absolute',
    top: 100, // Adjust the position as needed
    left: 20,
    color: theme.colors.sageGreen,
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',  // Makes it look more attractive
    textDecorationLine: 'underline', // Adds an underline effect
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
  headings: { color: theme.colors.ivory, fontSize: 23, paddingTop: 20, fontWeight: "bold", marginLeft: 10 },
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
});

export default HomeScreenRec;
