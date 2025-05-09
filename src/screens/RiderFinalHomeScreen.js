"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { View, Text, Dimensions, Pressable, StyleSheet } from "react-native"
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import Ionicons from "react-native-vector-icons/Ionicons"
import firestore from "@react-native-firebase/firestore"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import NewOrderPopup from "../components/NewOrderPopup"
import { AuthContext } from "../context/AuthContext"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import RiderLocationService from "../components/rider-location-service"



const GOOGLE_API_KEY = "AIzaSyAAt8OqnkBGVGHVGHVHGVHGhbhjbhjbbhbbhjbbbjhhoCTZw"
// const originrider = { latitude: 31.362987553740638, longitude: 72.98790695201525}
const originrider = { latitude: 37.3318456, longitude: -122.0296002 }
const destination = { latitude: 37.771707, longitude: -122.4053769 }

const RiderFinalHomeScreen = ({ navigation, route }) => {
  const tabBarHeight = useBottomTabBarHeight()
  const { user } = useContext(AuthContext)

  const [myPosition, setMyPosition] = useState(null)
  const [routeInfo, setRouteInfo] = useState({ distance: 0, duration: 0 })
  const [distance, setDistance] = useState(null)
  const [duration, setDuration] = useState(null)
  const [pickupDistance, setPickupDistance] = useState(null)
  const [pickupDuration, setPickupDuration] = useState(null)
  const [order, setOrder] = useState(null)
  const [newOrder, setNewOrder] = useState(null)
  const [isOnline, setIsOnline] = useState(false)
  const [declinedOrders, setDeclinedOrders] = useState([])
  const mapRef = useRef(null)
  const [orderPickedUp, setOrderPickedUp] = useState(false)
  const [showPickupBanner, setShowPickupBanner] = useState(false)
  const [showDeliveryBanner, setShowDeliveryBanner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [locationService, setLocationService] = useState(null)

  // Initialize location service when component mounts
  useEffect(() => {
    const service = new RiderLocationService(user.username)
    console.log("this is what is in the service",service)
    setLocationService(service)
    console.log("setting location service", locationService)

    return () => {
      // Clean up by stopping tracking when component unmounts
      if (service) {
        service.stopTracking()
      }
    } 
  }, [user.username])

  // Load declined orders from Firestore on component mount
  useEffect(() => {
    const loadDeclinedOrders = async () => {
      try {
        setIsLoading(true)
        // Get the rider's document from Firestore
        const riderDoc = await firestore().collection("riders").doc(user.username).get()

        if (riderDoc.exists) {
          const riderData = riderDoc.data()
          // If the rider has declined orders, set them in state
          if (riderData && riderData.declinedOrders) {
            setDeclinedOrders(riderData.declinedOrders)
            console.log("Loaded declined orders from Firestore:", riderData.declinedOrders)
          }
        } else {
          // If the rider document doesn't exist yet, create it
          await firestore().collection("riders").doc(user.username).set({
            declinedOrders: [],
            createdAt: firestore.FieldValue.serverTimestamp(),
          })
          console.log("Created new rider document in Firestore")
        }
        console.log("Declined orders loaded successfully")
      } catch (error) {
        console.error("Error loading declined orders from Firestore:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDeclinedOrders()

    // Set up a real-time listener for the rider's declined orders
    const unsubscribe = firestore()
      .collection("riders")
      .doc(user.username)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            const data = doc.data()
            if (data && data.declinedOrders) {
              setDeclinedOrders(data.declinedOrders)
              console.log("Real-time update of declined orders:", data.declinedOrders)
            }
          }
        },
        (error) => {
          console.error("Error in declined orders listener:", error)
        },
      )

    return () => unsubscribe() // Clean up the listener
  }, [user.username])

  // Function to check if there's a valid route between two locations
  const checkValidRoute = async (origin, destination) => {
    if(origin){
      console.log("origin exits")
    }
    else{
      console.log("origin does not exist")
      origin= originrider;
    }
    if(destination){
      console.log("destination exits")
    }
    else{
      console.log("destination does not exits")
    }
    try {
      console.log("origin in checkValidity",origin,origin.latitude,origin.longitude)
      console.log("destination in checkValidity",destination,destination.latitude,destination.longitude)
  
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_API_KEY}`,
      )

      console.log("the result of the fetch call", data)

      const data = await response.json()
      console.log("the result of the fetch call", data)


      // Check if a route was found
      if (data.status === "OK" && data.routes && data.routes.length > 0) {
        console.log("Valid route found between rider and order")
        return true
      } else {
        console.log("No valid route found between rider and order")
        return false
      }
    } catch (error) {
      console.error("Error checking route validity:", error)
      return false // Assume no valid route in case of error
    }
  }

  // Listen for pending orders
  useEffect(() => {
    if (isLoading) return // Don't fetch orders until declined orders are loaded

    console.log("Connecting to Firestore for orders...")

    const unsubscribe = firestore()
      .collection("orders")
      .where("status", "==", "pending") // Get only unassigned orders
      .limit(10) // Fetch more orders to filter from
      .onSnapshot(
        async (snapshot) => {
          // Added async here
          console.log("Orders collection accessed.")

          if (snapshot.empty) {
            console.log("No pending orders found.")
            setNewOrder(null)
            return
          }

          // Filter out orders that this rider has previously declined
          const availableOrders = snapshot.docs
            .map((doc) => {
              const data = doc.data()
              const now = new Date()
            
              // Parse pickup date and time
              let pickupDate = data.pickupDate ? new Date(data.pickupDate) : null
              let pickupTime = data.pickupTime ? new Date(data.pickupTime) : null

              console.log("this is date from doc" , data.pickupDate)
              console.log("this is date after parsing" , pickupDate)
              console.log("this is time from doc" , data.pickupTime)
              console.log("this is time after parsing" , pickupTime)
            
              // Default to current date/time if missing
              if (!pickupDate) pickupDate = now
              if (!pickupTime) pickupTime = now
            
              const isToday = pickupDate.toDateString() === now.toDateString()
              const isTodayOrPast = pickupDate.setHours(0, 0, 0, 0) <= now.setHours(0, 0, 0, 0)

              const isValidTime = pickupTime.getHours() > now.getHours() || 
                                  (pickupTime.getHours() === now.getHours() && pickupTime.getMinutes() >= now.getMinutes())

              console.log("is today wala variabel", isToday)
            
              const isPickupValid = isTodayOrPast && isValidTime

              console.log("variable isPickupValid values= ",isPickupValid )
            
              return {
                ...data,
                id: doc.id,
                pickupDate,
                pickupTime,
                isPickupValid,
              }
            })
            
            .filter((order) => 
            (!declinedOrders.includes(order.id)) && 
            (order.isPickupValid || (!order.pickupDate && !order.pickupTime))
          )
          

          console.log(
            `Found ${snapshot.docs.length} pending orders, ${availableOrders.length} available after filtering declined orders`,
          )

          if (availableOrders.length > 0) {
            // Check for valid routes for each available order
            const ordersWithRouteInfo = await Promise.all(
              availableOrders.map(async (order) => {
                // Check if there's a valid route between rider and order origin
                console.log("this is my position",myPosition)
                if(myPosition==null){
                  setMyPosition(originrider)
                  console.log("this is my position after setting it after null ",myPosition)
                }
                const hasValidRoute = await checkValidRoute(myPosition, order.destination)
                return { ...order, hasValidRoute }
              }),
            )
            

            // Filter orders that have a valid route
            const ordersWithValidRoutes = ordersWithRouteInfo.filter((order) => order.hasValidRoute)

            if (ordersWithValidRoutes.length > 0) {
              // Get the first available order with a valid route
              const newOrderData = ordersWithValidRoutes[0]
              setNewOrder(newOrderData)
              console.log("Order with valid route found:", newOrderData)
            } else {
              console.log("No orders with valid routes available")
              setNewOrder(null)
            }
          } else {
            setNewOrder(null)
          }
        },
        (error) => {
          console.error("Error accessing Firestore orders:", error)
        },
      )

    return () => unsubscribe() // Cleanup subscription
  }, [declinedOrders, isLoading, myPosition])

  // Update banners based on order status
  useEffect(() => {
    if (order && !orderPickedUp) {
      setShowPickupBanner(true)
      setShowDeliveryBanner(false)
    } else if (order && orderPickedUp) {
      setShowPickupBanner(false)
      setShowDeliveryBanner(true)
    } else {
      setShowPickupBanner(false)
      setShowDeliveryBanner(false)
    }

    console.log("Order status updated - Picked up:", orderPickedUp)
    console.log("Pickup banner:", showPickupBanner)
    console.log("Delivery banner:", showDeliveryBanner)
  }, [order, orderPickedUp])

  // 📌 Rider Accepts Order
  const onAccept = async () => {
    if (!newOrder) return

    console.log("Order accepted:", newOrder)
    // Ensure location tracking is active when accepting an order
    if (locationService && !locationService.isCurrentlyTracking()) {
      await locationService.startTracking()
    }

    try {
      // Update the order in Firestore with the current rider's ID
      await firestore().collection("orders").doc(newOrder.id).update({
        status: "accepted",
        riderId: user.username, // Set the rider ID from the authenticated user
        acceptedAt: firestore.FieldValue.serverTimestamp(), // Add timestamp for when order was accepted
      })

      // Update the rider's document to track their accepted orders
      await firestore()
        .collection("riders")
        .doc(user.username)
        .update({
          activeOrder: newOrder.id,
          acceptedOrders: firestore.FieldValue.arrayUnion(newOrder.id),
          lastActiveAt: firestore.FieldValue.serverTimestamp(),
        })

      setOrder(newOrder)
      setNewOrder(null)
      setOrderPickedUp(false)

      if (mapRef.current && myPosition) {
        mapRef.current.fitToCoordinates([myPosition, newOrder.origin], {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        })
      }
    } catch (error) {
      console.error("Error accepting order:", error)
    }
  }

  // 🚫 Rider Declines Order - Updated to store declined orders in Firestore only
  const onDecline = async () => {
    if (!newOrder) return

    try {
      console.log(`Declining order ${newOrder.id}`)

      // Update Firestore with the declined order ID
      await firestore()
        .collection("riders")
        .doc(user.username)
        .update({
          declinedOrders: firestore.FieldValue.arrayUnion(newOrder.id),
          lastDeclinedAt: firestore.FieldValue.serverTimestamp(),
        })

      // Also update the order to mark it as declined by this rider
      await firestore()
        .collection("orders")
        .doc(newOrder.id)
        .update({
          declinedBy: firestore.FieldValue.arrayUnion(user.username),
          lastDeclinedAt: firestore.FieldValue.serverTimestamp(),
        })

      console.log(`Order ${newOrder.id} declined and added to declined orders list in Firestore`)

      // Clear the current new order from UI
      setNewOrder(null)
    } catch (error) {
      console.error("Error storing declined order in Firestore:", error)
      // Still clear the order from UI even if storage fails
      setNewOrder(null)
    }
  }

  // ✅ Rider Confirms Pickup
  const onPickupConfirm = async () => {
    if (!order) return

    console.log("Pickup confirmed")

    try {
      await firestore().collection("orders").doc(order.id).update({
        status: "picked_up",
        pickedUpAt: firestore.FieldValue.serverTimestamp(),
      })

      // Update rider status
      await firestore().collection("riders").doc(user.username).update({
        status: "delivering",
        lastStatusUpdate: firestore.FieldValue.serverTimestamp(),
      })

      setOrderPickedUp(true)

      // Log to verify the state is updated
      console.log("Order picked up state set to true")
      console.log("Order destination:", order.destination)
      console.log("Current position:", myPosition)

      // Force re-render of the map
      if (mapRef.current && myPosition && order.destination) {
        setTimeout(() => {
          mapRef.current.fitToCoordinates([myPosition, order.destination], {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          })
        }, 500) // Small delay to ensure state is updated
      }
    } catch (error) {
      console.error("Error confirming pickup:", error)
    }
  }

  // ✅ Rider Marks Delivery as Done
  const onDeliveryDone = async () => {
    if (!order) return

    console.log("Delivery completed")

    try {
      await firestore().collection("orders").doc(order.id).update({
        status: "delivered",
        deliveredAt: firestore.FieldValue.serverTimestamp(),
      })

      // Update rider status and clear active order
      await firestore()
        .collection("riders")
        .doc(user.username)
        .update({
          status: "available",
          activeOrder: null,
          completedOrders: firestore.FieldValue.arrayUnion(order.id),
          lastStatusUpdate: firestore.FieldValue.serverTimestamp(),
        })

      setOrder(null)
      setOrderPickedUp(false)
      setShowDeliveryBanner(false)
    } catch (error) {
      console.error("Error completing delivery:", error)
    }
  }

  const onGopress = async () => {
    const newStatus = !isOnline
    setIsOnline(newStatus)

    // Start or stop location tracking based on online status
    if (newStatus && locationService) {
      const started = await locationService.startTracking()
      if (!started) {
        console.error("Failed to start location tracking")
        // Optionally show an alert to the user
      }
    } else if (locationService) {
      locationService.stopTracking()
    }

    // Update rider's online status in Firestore
    try {
      await firestore()
        .collection("riders")
        .doc(user.username)
        .update({
          isOnline: newStatus,
          status: newStatus ? "available" : "offline",
          lastStatusUpdate: firestore.FieldValue.serverTimestamp(),
        })
      console.log(`Rider status updated to ${newStatus ? "online" : "offline"}`)
    } catch (error) {
      console.error("Error updating rider status:", error)
    }
  }

  const onUserLocationChange = (event) => {
    const newLocation = event.nativeEvent.coordinate
    console.log("📍 Updated Position:", newLocation)

    setMyPosition(newLocation)

    if (!order) return // No order, no tracking needed

    // Compute remaining distance
    if (order.destination) {
      const distanceLeft = haversineDistance(newLocation, order.destination)
      const durationLeft = routeInfo.distance > 0 ? (distanceLeft / routeInfo.distance) * routeInfo.duration : 0

      console.log(`🚴 ${distanceLeft.toFixed(2)} km left, approx. ${durationLeft.toFixed(2)} min`)

      if (distanceLeft < 0.01) {
        console.log("🎉 You have reached your destination!")
      }
    }
  }

  const haversineDistance = (coord1, coord2) => {
    if (!coord1 || !coord2) return 0

    const R = 6371 // Radius of the Earth in km
    const dLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180)
    const dLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180)
    const lat1 = coord1.latitude * (Math.PI / 180)
    const lat2 = coord2.latitude * (Math.PI / 180)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  const renderBottomTitle = () => {
    if (order) {
      return (
        <View style={{ alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>
              {orderPickedUp
                ? duration
                  ? `${Math.round(duration)} min`
                  : "Calculating..."
                : pickupDuration
                  ? `${Math.round(pickupDuration)} min`
                  : "Calculating..."}
            </Text>
            <View
              style={{
                backgroundColor: "#48d42a",
                width: 34,
                height: 34,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
                marginHorizontal: 10,
              }}
            >
              <FontAwesome name={"user"} color={"white"} size={20} />
            </View>
            <Text>
              {orderPickedUp
                ? distance
                  ? `${distance.toFixed(1)} km`
                  : "..."
                : pickupDistance
                  ? `${pickupDistance.toFixed(1)} km`
                  : "..."}
            </Text>
          </View>
          <Text style={styles.bottomTextuser}>
            {orderPickedUp ? `Delivering to destination` : `Picking up donation from ${order.user?.name || "Customer"}`}
          </Text>
        </View>
      )
    }
    return <Text style={styles.bottomText}>{isOnline ? "You're Online" : "You're Offline"}</Text>
  }

  // Show loading indicator while initializing
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { marginBottom: tabBarHeight }]}>
      {/* Pickup Banner */}
      {showPickupBanner && (
        <View style={styles.pickupBanner}>
          <Text style={styles.pickupText}>Picking up the package</Text>
          <Pressable style={styles.checkButton} onPress={onPickupConfirm}>
            <Text style={styles.checkButtonText}>✓ Confirm Pickup</Text>
          </Pressable>
        </View>
      )}

      {/* Delivery Banner (Only visible after pickup) */}
      {showDeliveryBanner && (
        <View style={styles.deliveryBanner}>
          <Text style={styles.deliveryText}>Delivering the package</Text>
          <Pressable style={styles.checkButton} onPress={onDeliveryDone}>
            <Text style={styles.checkButtonText}>✓ Delivery Done</Text>
          </Pressable>
        </View>
      )}

      <MapView
        ref={mapRef}
        style={{
          width: "100%",
          height:
            showPickupBanner || showDeliveryBanner
              ? Dimensions.get("window").height - 170
              : Dimensions.get("window").height - 120,
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
        {order && myPosition && (
          <>
            {/* Route to pickup location - only show when not picked up */}
            {!orderPickedUp && order.origin && (
              <MapViewDirections
                origin={myPosition}
                destination={order.origin}
                apikey={GOOGLE_API_KEY}
                strokeWidth={5}
                strokeColor="blue"
                onReady={(result) => {
                  console.log("Route to pickup found:", result)
                  setPickupDistance(result.distance)
                  setPickupDuration(result.duration)

                  if (mapRef.current) {
                    mapRef.current.fitToCoordinates(result.coordinates, {
                      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                      animated: true,
                    })
                  }
                }}
              />
            )}

            {/* Route to destination - only show after pickup */}
            {orderPickedUp && order.destination && (
              <MapViewDirections
                origin={myPosition}
                destination={order.destination}
                apikey={GOOGLE_API_KEY}
                strokeWidth={5}
                strokeColor="red"
                onReady={(result) => {
                  console.log("Route to destination found:", result)
                  setDistance(result.distance)
                  setDuration(result.duration)
                  setRouteInfo({
                    distance: result.distance,
                    duration: result.duration,
                  })

                  if (mapRef.current) {
                    mapRef.current.fitToCoordinates(result.coordinates, {
                      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                      animated: true,
                    })
                  }
                }}
                onError={(error) => {
                  console.error("MapViewDirections error:", error)
                }}
              />
            )}
          </>
        )}
      </MapView>

      <Pressable onPress={() => console.warn("Balance")} style={styles.balanceButton}>
        <Text style={styles.balanceText}>
          <Text style={{ color: "green" }}>$</Text> 0.00
        </Text>
      </Pressable>

      <Pressable onPress={onGopress} style={styles.goButton}>
        <Text style={styles.goText}>{isOnline ? "END" : "GO"}</Text>
      </Pressable>

      <View style={styles.bottomContainer}>
        <Ionicons name={"options"} size={30} color={"black"} />
        {renderBottomTitle()}
        <Ionicons name={"options"} size={30} color={"black"} />

      </View>
  

      {newOrder && (
        <NewOrderPopup newOrder={newOrder} duration={8} distance={5} onDecline={onDecline} onAccept={onAccept} />
      )}
    </View>
  )
}


const styles = StyleSheet.create({
  bottomContainer: {
    bottom: 40,
    height: 100,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  bottomText: {
    fontSize: 22,
    color: "#4a4a4a",
  },
  bottomTextuser: {
    fontSize: 18,
    color: "#4a4a4a",
  },
  roundButton: {
    position: "absolute",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 25,
  },
  goButton: {
    position: "absolute",
    backgroundColor: "#1495ff",
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    bottom: 110,
    left: Dimensions.get("window").width / 2 - 37,
  },
  goText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },

  balanceButton: {
    position: "absolute",
    backgroundColor: "#1c1c1c",
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    top: 10,
    left: Dimensions.get("window").width / 2 - 50,
  },
  balanceText: {
    fontSize: 19,
    color: "white",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
  },
  pickupBanner: {
    backgroundColor: "#48d42a",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    zIndex: 999,
  },
  pickupText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  checkButton: {
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  checkButtonText: {
    color: "#48d42a",
    fontWeight: "bold",
  },
  deliveryBanner: {
    backgroundColor: "#48d42a",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    zIndex: 999,
  },
  deliveryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
})

export default RiderFinalHomeScreen

