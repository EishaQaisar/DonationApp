import React, { useState, useEffect,useRef } from "react";
import { View, Text, Dimensions, Pressable, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Marker } from "react-native-maps"
import MapViewDirections from 'react-native-maps-directions';
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import NewOrderPopup from "../components/NewOrderPopup";
import * as Location from 'expo-location';


const GOOGLE_API_KEY = "AIzaSyB9irjntPHdEJf024h7H_XKpS11OeW1Nh8";
const origin = { latitude: 37.3318456, longitude: -122.0296002 };
const destination = { latitude: 37.771707, longitude: -122.4053769 };

               

const RiderFinalHomeScreen = ({ navigation }) => {
    const [myPosition, setMyPosition] = useState(null);
    const [routeInfo, setRouteInfo] = useState({ distance: 0, duration: 0 });
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [pickupDistance, setPickupDistance] = useState(null);
    const [pickupDuration, setPickupDuration] = useState(null);
    const [order, setOrder] = useState(null);
    const [newOrder, setNewOrder] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const mapRef = useRef(null);
    const [orderPickedUp, setOrderPickedUp] = useState(false);
    const [showPickupBanner, setShowPickupBanner] = useState(false);
    const [showDeliveryBanner, setShowDeliveryBanner] = useState(false);

    useEffect(() => {
        console.log("Connecting to Firestore...");
        
        const unsubscribe = firestore()
            .collection('orders')
            .where('status', '==', 'pending') // Get only unassigned orders
            .limit(1)
            .onSnapshot(snapshot => {
                console.log("Orders collection accessed.");
    
                if (snapshot.empty) {
                    console.log("No pending orders found.");
                    setOrder(null);
                    return;
                }
    
                console.log("Pending order found.");
                const newOrder = snapshot.docs[0].data();
                newOrder.id = snapshot.docs[0].id; // Get Firestore document ID
                setNewOrder(newOrder);
                console.log("Order details:", newOrder);
            }, error => {
                console.error("Error accessing Firestore:", error);
            });
    
        return () => unsubscribe(); // Cleanup subscription
    }, []);
    

    // Show pickup banner when order is accepted but not yet picked up
    useEffect(() => {
        setShowPickupBanner(order && !orderPickedUp);
        console.log("order is picked uo ?", orderPickedUp);
        setShowDeliveryBanner(orderPickedUp);
    }, [order, orderPickedUp]);

    // 📌 Rider Accepts Order
    const onAccept = async () => {

        console.log("Order accepted:", newOrder);
        setOrder(newOrder);
        setNewOrder(null);

        if (!order) return;
        
        await firestore().collection('orders').doc(order.id).update({
            status: 'accepted',
            riderId: 'rider123' // Assign the order to a rider (Replace with actual ID)
        });

        setOrderPickedUp(false);
        if (mapRef.current) {
            mapRef.current.fitToCoordinates(
                [origin, newOrder.origin],
                { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true }
            );
        }
    };




    // Show pickup banner when order is accepted but not yet picked up
    useEffect(() => {
        if (order && !orderPickedUp) {
            setShowPickupBanner(true);
        } else {
            setShowPickupBanner(false);
        }
    }, [order, orderPickedUp]);

    const onDecline = () => {
        setNewOrder(null);
    };

    // ✅ Rider Confirms Pickup
    const onPickupConfirm = async () => {
        if (!order) return;

        console.log("calleddddddddddddddddd");


        await firestore().collection('orders').doc(order.id).update({
            status: 'picked_up'
        });

        setOrderPickedUp(true);
        setShowPickupBanner(false);
        setShowDeliveryBanner(true);


        if (mapRef.current && myPosition) {
            console.log("thisbhjbjhbhjbhj",order.destination);
            console.log("thisbhjbjhbhjbhj go go go go my position",myPosition);
            mapRef.current.fitToCoordinates(
                [myPosition, order.destination], // Ensure order.destination is set
                { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true }
            );
        }
    };

    // ✅ Rider Marks Delivery as Done
    const onDeliveryDone = async () => {
        if (!order) return;

        await firestore().collection('orders').doc(order.id).update({
            status: 'delivered'
        });
        console.log("in delivery botton");

        setOrder(null);
        setShowDeliveryBanner(false);
        setOrderPickedUp(false);
    };

    const onGopress = () => {
        setIsOnline(!isOnline);
    };

    const onUserLocationChange = (event) => {
        const newLocation = event.nativeEvent.coordinate;
        console.log("📍 Updated Position:", newLocation);

        if (!order) return; // No order, no tracking needed

        setMyPosition(newLocation);

        // Compute remaining distance
        const distanceLeft = haversineDistance(newLocation, order.destination);
        const durationLeft = (distanceLeft / routeInfo.distance) * routeInfo.duration; 

        // console.log(`🚴 ${distanceLeft.toFixed(2)} km left, approx. ${durationLeft.toFixed(2)} min`);

        if (distanceLeft < 0.01) { 
            console.log("🎉 You have reached your destination!");
        }
    };

    const haversineDistance = (coord1, coord2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
        const dLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180);
        const lat1 = coord1.latitude * (Math.PI / 180);
        const lat2 = coord2.latitude * (Math.PI / 180);
    
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };
    
    const onDirectionFound = (event) => {
        console.log("user directions", event);
    };

    const renderBottomTitle = () => {
        if (order) {
            return (
                <View style={{ alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>
                            {orderPickedUp
                                ? (duration ? `${Math.round(duration)} min` : "Calculating...")
                                : (pickupDuration ? `${Math.round(pickupDuration)} min` : "Calculating...")}
                        </Text>
                        <View style={{
                            backgroundColor: '#48d42a', width: 34, height: 34,
                            alignItems: 'center', justifyContent: 'center',
                            borderRadius: 20, marginHorizontal: 10
                        }}>
                            <FontAwesome name={"user"} color={"white"} size={20} />
                        </View>
                        <Text>
                            {orderPickedUp
                                ? (distance ? `${distance.toFixed(1)} km` : "...")
                                : (pickupDistance ? `${pickupDistance.toFixed(1)} km` : "...")}
                        </Text>
                    </View>
                    <Text style={styles.bottomTextuser}>
                        {orderPickedUp 
                            ? `Delivering to destination` 
                            : `Picking up donation from DUMMY`}
                    </Text>
                </View>
            );
        }
        return <Text style={styles.bottomText}>{isOnline ? "You're Online" : "You're Offline"}</Text>;
    };
   
    return (
        <View style={styles.container}>
            {/* Pickup Banner */}
            {showPickupBanner && (
                <View style={styles.pickupBanner}>
                    <Text style={styles.pickupText}>Picking up the package</Text>
                    <Pressable 
                        style={styles.checkButton}
                        onPress={onPickupConfirm}
                    >
                        <Text style={styles.checkButtonText}>✓ Confirm Pickup</Text>
                    </Pressable>
                </View>
            )}

               {/* Delivery Banner (Only visible after pickup) */}
               {showDeliveryBanner && (
                <View style={styles.deliveryBanner}>
                    <Text style={styles.deliveryText}>Delivering the package</Text>
                    <Pressable 
                        style={styles.checkButton}
                        onPress={onPickupConfirm}
                    >
                        <Text style={styles.checkButtonText}>✓ Delivery Done</Text>
                    </Pressable>
                </View>
            )}
            
            <MapView
                ref={mapRef}
                style={{ 
                    width: '100%', 
                    height: showPickupBanner 
                        ? Dimensions.get('window').height - 170 
                        : Dimensions.get('window').height - 120 
                }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                followsUserLocation={true}
                onUserLocationChange={onUserLocationChange}
                initialRegion={{
                    latitude: myPosition?.latitude || 36.0,
                    longitude: myPosition?.longitude || -120.0,
                    latitudeDelta: 5.0,
                    longitudeDelta: 5.0,
                }}
            >
                
                {order && (
                    <>
                        {/* Route to pickup location */}
                        {!orderPickedUp && (
                            <MapViewDirections
                                origin={myPosition}
                                destination={order.origin}
                                apikey={GOOGLE_API_KEY}
                                strokeWidth={5}
                                strokeColor="blue"
                                onReady={(result) => {
                                    // console.log("Route to pickup found:", result);
                                    setPickupDistance(result.distance);
                                    setPickupDuration(result.duration);
                                    
                                    if (mapRef.current) {
                                        mapRef.current.fitToCoordinates(result.coordinates, {
                                            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                                            animated: true,
                                        });
                                    }
                                }}
                            />
                        )}
                        
                        {/* Route to destination (only shown after pickup) */}
                        {orderPickedUp && (
                            <MapViewDirections
                                origin={myPosition}
                                destination={order.destination}
                                apikey={GOOGLE_API_KEY}
                                strokeWidth={5}
                                strokeColor="red"
                                onReady={(result) => {
                                    // console.log("Route to destination found:", result);
                                    setDistance(result.distance);
                                    setDuration(result.duration);
                                    setRouteInfo({
                                        distance: result.distance,
                                        duration: result.duration
                                    });
                                    
                                    if (mapRef.current) {
                                        mapRef.current.fitToCoordinates(result.coordinates, {
                                            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                                            animated: true,
                                        });
                                    }
                                }}
                            />
                        )}
                    </>
                )}
            </MapView>
            
            <Pressable
                onPress={() => console.warn('Balance')}
                style={styles.balanceButton}>
                <Text style={styles.balanceText}>
                    <Text style={{ color: 'green' }}>$</Text>
                    {' '}
                    0.00
                </Text>
            </Pressable>
            
            <Pressable
                onPress={() => console.warn('Hey')}
                style={[styles.roundButton, { top: 10, left: 10 }]}
            >
                <Entypo name={"menu"} size={24} color={"black"} />
            </Pressable>

            <Pressable
                onPress={() => console.warn('Hey')}
                style={[styles.roundButton, { top: 10, right: 10 }]}
            >
                <Entypo name={"menu"} size={24} color={"black"} />
            </Pressable>

            <Pressable
                onPress={() => console.warn('Hey')}
                style={[styles.roundButton, { bottom: 110, left: 10 }]}
            >
                <Entypo name={"menu"} size={24} color={"black"} />
            </Pressable>

            <Pressable
                onPress={() => console.warn('Hey')}
                style={[styles.roundButton, { bottom: 110, right: 10 }]}
            >
                <Entypo name={"menu"} size={24} color={"black"} />
            </Pressable>

            <Pressable onPress={onGopress} style={styles.goButton}>
                <Text style={styles.goText}>{isOnline ? 'END' : 'GO'}</Text>
            </Pressable>

            <View style={styles.bottomContainer}>
                <Ionicons name={"options"} size={30} color={"black"} />
                {renderBottomTitle()}
                <Ionicons name={"options"} size={30} color={"black"} />
            </View>

            {newOrder && (
                <NewOrderPopup
                    newOrder={newOrder}
                    duration={8}
                    distance={5}
                    onDecline={onDecline}
                    onAccept={() => onAccept(newOrder)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    bottomContainer: {
        height: 100,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    bottomText: {
        fontSize: 22,
        color: '#4a4a4a',
    },
    bottomTextuser: {
        fontSize: 18,
        color: '#4a4a4a',
    },
    roundButton: {
        position: 'absolute',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 25,
    },
    goButton: {
        position: 'absolute',
        backgroundColor: '#1495ff',
        width: 75,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        bottom: 110,
        left: Dimensions.get('window').width / 2 - 37,
    },
    goText: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
    },

    balanceButton: {
        position: 'absolute',
        backgroundColor: '#1c1c1c',
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        top: 10,
        left: Dimensions.get('window').width / 2 - 50,
    },
    balanceText: {
        fontSize: 19,
        color: 'white',
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
    },
    pickupBanner: {
        backgroundColor: '#48d42a',
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        zIndex: 999,
    },
    pickupText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    checkButton: {
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    checkButtonText: {
        color: '#48d42a',
        fontWeight: 'bold',
    },
    deliveryBanner: {
        backgroundColor: '#48d42a',
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        zIndex: 999,
     
    },
    deliveryText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    },
});

export default RiderFinalHomeScreen;

//////////////////////////////////////////

// import { useState, useEffect, useRef } from "react";
// import { View, Dimensions, Alert } from "react-native";
// import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
// import * as Location from 'expo-location';  // ✅ Import Expo Location

// const RiderFinalHomeScreen = () => {
//     const [myPosition, setMyPosition] = useState(null);
//     const mapRef = useRef(null);

//     useEffect(() => {
//         (async () => {
//             let { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== 'granted') {
//                 Alert.alert("Permission Denied", "Enable location services to use this feature.");
//                 return;
//             }

//             let location = await Location.getCurrentPositionAsync({});
//             setMyPosition({
//                 latitude: location.coords.latitude,
//                 longitude: location.coords.longitude,
//             });
//             console.log("📍 Initial Position:", location.coords); // ✅ Debug log
//         })();
//     }, []);

//     const onUserLocationChange = (event) => {
//         const newLocation = event.nativeEvent.coordinate;
//         console.log("📍 New Position Update:", newLocation);

//         if (newLocation && newLocation.latitude && newLocation.longitude) {
//             setMyPosition(newLocation);
//             console.log("✅ Position updated in state:", newLocation);
//         } else {
//             console.log("⚠️ Position update failed!");
//         }
//     };

//     return (
//         <View style={{ flex: 1 }}>
//             <MapView
//                 ref={mapRef}
//                 style={{ width: '100%', height: Dimensions.get('window').height - 120 }}
//                 provider={PROVIDER_GOOGLE}
//                 showsUserLocation={true}  // ✅ Displays blue dot
//                 followsUserLocation={true} // ✅ Keeps camera centered on user
//                 onUserLocationChange={onUserLocationChange} // ✅ Handles movement updates
//                 initialRegion={{
//                     latitude: myPosition?.latitude || 36.0,  // ✅ Uses state if available
//                     longitude: myPosition?.longitude || -120.0,
//                     latitudeDelta: 5.0,
//                     longitudeDelta: 5.0,
//                 }}
//             />
//         </View>
//     );
// };

// export default RiderFinalHomeScreen;




// import react from "react";
// import { View, Text } from "react-native";
// import MapView ,{PROVIDER_GOOGLE} from "react-native-maps";
// import MapViewDirections from 'react-native-maps-directions';
// const GOOGLE_API_KEY = "AIzaSyB9irjntPHdEJf024h7H_XKpS11OeW1Nh8";
// const origin = { latitude: 37.3318456, longitude: -122.0296002};
// const destination = { latitude: 37.771707, longitude: -122.4053769 };

// const RiderFinalHomeScreen = ({ navigation }) => {
//     return(
//         <View>
//             <Text>fuck this </Text>
//             <MapView
//             style={{width:'100%',height:'100%'}}
//             provider={PROVIDER_GOOGLE}
//             initialRegion={{
//                 latitude: 37.78825,
//                 longitude: -122.4324,
//                 latitudeDelta: 0.0922,
//                 longitudeDelta: 0.0421,
//             }}
//             >

//                 <MapViewDirections 
//                 origin={origin}
//                 destination={destination}
//                 apikey={GOOGLE_API_KEY}/>


//             </MapView>
//         </View>
//     )
// }

// export default RiderFinalHomeScreen;