import React from "react";
import { View, Text, Pressable } from "react-native";
import { StyleSheet } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const NewOrderPopup = ({newOrder,onAccept,onDecline, duration, distance }) => {
   
  

    return (
        <View style={styles.root}>
        <Pressable onPress={onDecline} style={styles.declineButton}>
        <Text style={styles.declineText}>Decline</Text>
      </Pressable>

      <Pressable onPress={onAccept} style={styles.popupContainer}>

            
                <View style={styles.row}>

                    <Text style={styles.rideType}>{newOrder.type}</Text>
                    <View style={styles.userBg}>
                        <FontAwesome name={"user"} color ={"lightgrey"} size={35}>

                        </FontAwesome>
                    </View>
                    <Text style={styles.rideType}>
                        <AntDesign name={"star"} size={18}/>
                        4
                        {/* ///{newOrder.user.rating} */}
                    </Text>
                </View>
            




                <Text style={styles.minutes}> {duration}min</Text>
                <Text style={styles.distance}>{distance} mi</Text>

          
                </Pressable>
           
        </View>
       
  
       
    );
};
const styles = StyleSheet.create({
    root: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        height: '100%',
        justifyContent: 'space-between',
        backgroundColor: '#00000099',
    },
    popupContainer: {
        backgroundColor: 'black',
        borderRadius: 10,
        height: 250,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    minutes: {
        color: 'lightgrey',
        fontSize: 36
    },
    distance: {
        color: 'lightgrey',
        fontSize: 26
    },
    rideType: {
        color: 'lightgrey',
        fontSize: 20,
        marginHorizontal: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userBg: {
        backgroundColor: '#008bff',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 60
    },
    declineButton: {
        backgroundColor: 'black',
        padding: 20,
        borderRadius: 50,
        width: 100,
        alignItems: 'center',
    },
    declineText: {
        color: 'white',
        fontWeight: 'bold',
    }
});


export default NewOrderPopup;