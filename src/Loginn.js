import React, {useState} from "react";
import {View, Text, TextInput, TouchableOpacity } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function Loginn(){
    const [phoneNumber, setPhoneNumber]=useState("");
    const [code, setCode]=useState("");
    const [confirm, setConfirm]=useState(null);
    const navigation=useNavigation();

    const signInWithPhoneNumber= async()=>{
        try {
            const confirmation=await auth().signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation);
            console.log('here');
            console.log("Phone Number:", phoneNumber);
            console.log('herwedwede');


            
        } catch (error) {
            console.log("Error sending code", error);
            
        }
    };

    const confirmCode = async () => {
        if (!confirm) {
            console.log("No confirmation object. Call signInWithPhoneNumber first.");
            return;
        }
        try {
            const userCredential = await confirm.confirm(code);
             console.log("okkk")
            const user = userCredential.user;
    
            // Check if user exists in Firestore
            const userDocument = await firestore()
                .collection("users")
                .doc(user.uid)
                .get();
    
            if (userDocument.exists) {
                navigation.navigate("Dashboard");
            } else {
                navigation.navigate("Detail", { uid: user.uid });
            }
        } catch (error) {
            console.log("Invalid verification code:", error);
        }
    };
    

    return(
        <View style={{flex:1, padding:10, backgroundColor:'white'}}>
            <Text>Phone number authentication</Text>
            

                <TextInput
                style={{
                    height:50,
                    width:'100%',
                    borderColor:'black'
                }}
                placeholder="number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                >

                </TextInput>
                <TouchableOpacity onPress={signInWithPhoneNumber} 
                style={{backgroundColor:'yellow', height:50}}>

                </TouchableOpacity>

                <TextInput
                style={{
                    height:50,
                    width:'100%',
                    borderColor:'black'
                }}
                placeholder="number"
                onChangeText={setCode}
                >

                </TextInput>
                <TouchableOpacity onPress={confirmCode} 
                style={{backgroundColor:'yellow', height:50}}>

                </TouchableOpacity>

                
                
        </View>
    );
}