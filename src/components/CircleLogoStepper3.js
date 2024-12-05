import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { theme } from '../core/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';


const CircleLogoStepper3 = () => {
  return (
    
    <View style={styles.container}>
      <View style={styles.step}>
        <View style={styles.circleContainer}>
          <View style={[styles.circle,{ backgroundColor:theme.colors.pearlWhite}]}>
            <MaterialCommunityIcons name="cursor-default-click-outline" size={30} color="black" />
          </View>
          <Text style={styles.circleText}>Select Category</Text>
        </View>
        
      </View>
      <View>
        <Text style={styles.arrow}>{'--------->'}</Text>
        </View>

      <View style={styles.step}>
        <View style={styles.circleContainer}>
        <View style={[styles.circle,{ backgroundColor:theme.colors.pearlWhite}]}>

            <MaterialIcons name="add" size={30} color="black" />
          </View>
          <Text style={styles.circleText}>Add Details</Text>
        </View>
       
      </View>
      <View>
        <Text style={[styles.arrow, {marginLeft:12, marginRight:6}]}>{'--------->'}</Text>
        </View>

      <View style={styles.step}>
        <View style={styles.circleContainer}>
        <View style={[styles.circle,{ backgroundColor:theme.colors.pearlWhite}]}>

          <Ionicons name="checkmark-done" size={30} color="black" />

          </View>
          <Text style={styles.circleText}>Confirm </Text>
        </View>
      </View>



      



    </View>


  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor:theme.colors.copper,
    justifyContent:'center'
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent:'center'
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.sageGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categories: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.sageGreen,
  },
  circleText: {
    marginTop: 5,
    fontSize: 14,
    color: theme.colors.ivory, // Change color as needed
  },
  arrow: {
    fontSize: 20,
    color: '#ccc',
    marginLeft: 0,
  },
 
});

export default CircleLogoStepper3;
