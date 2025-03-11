"use client"

import { createContext, useState, useEffect, useContext } from "react"
import firestore from "@react-native-firebase/firestore"
import { AuthContext } from "./AuthContext" // Import AuthContext

export const UserProfileContext = createContext()

// Base khair points per member
const BASE_KHAIR_POINTS = 100

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null)
  const { user } = useContext(AuthContext) // Get user from AuthContext
  const [loading, setLoading] = useState(true)

  // Function to check if a month has passed since the last reassignment
  const hasMonthPassed = (lastReassignmentDate) => {
    if (!lastReassignmentDate) return true

    const now = new Date()
    const lastDate = new Date(lastReassignmentDate.toDate ? lastReassignmentDate.toDate() : lastReassignmentDate)

    // Check if it's a different month or year
    return now.getMonth() !== lastDate.getMonth() || now.getFullYear() !== lastDate.getFullYear()
  }

  // Function to calculate khair points based on family members
  const calculateKhairPoints = ( childrenCount) => {
    // Base points for the parent
    let totalPoints = BASE_KHAIR_POINTS
    

    // Add points for children
    if (childrenCount && childrenCount > 0) {
      if (user.recipientType==='individual'){
        totalPoints += BASE_KHAIR_POINTS * childrenCount

      }
      else if(user.recipientType==='ngo'){
        totalPoints=totalPoints*childrenCount
      }
      
    }
    // If membersCount is provided and different from children+1, use that instead
    

    return totalPoints
  }

  // Function to reassign khair points
  const reassignMonthlyKhairPoints = async (userId, userData, childrenProfiles) => {
    try {
      const now = new Date()

      // Calculate the number of family members
      let childrenCount 
      childrenCount= childrenProfiles?.length || userData.children || 0
      if (user.recipientType==='ngo'){
        childrenCount=userProfile.membersCount;
      }

      // Calculate khair points based on family members
      const newKhairPoints = calculateKhairPoints( childrenCount)

      if (user.recipientType==='individual'){
        await firestore().collection("individual_profiles").doc(userId).update({
          khairPoints: newKhairPoints,
          lastPointsReassignmentDate: now,
        })

      }
      else if (user.recipientType==='ngo'){
        await firestore().collection("ngo_profiles").doc(userId).update({
          khairPoints: newKhairPoints,
          lastPointsReassignmentDate: now,
        })

      }
     

      console.log("Monthly khair points reassigned successfully:", newKhairPoints)
      return newKhairPoints
    } catch (error) {
      console.error("Error reassigning monthly khair points:", error)
      return null
    }
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setUserProfile(null)
        setLoading(false)
        return
      }

      console.log("Fetching user profile for:", user.uid)
      try {
        let userDoc
        // Fetch parent profile
        if (user.recipientType==='individual'){
          userDoc = await firestore().collection("individual_profiles").doc(user.uid).get()
        }
        else {
          userDoc = await firestore().collection("ngo_profiles").doc(user.uid).get()

          
        }

        if (userDoc.exists) {
          let userData = userDoc.data()
          console.log("User profile set:", userData)

          // Fetch children profiles
          let childrenProfiles = []
          const childrenDoc = await firestore().collection("children_profiles").doc(user.uid).get()

          if (childrenDoc.exists) {
            childrenProfiles = childrenDoc.data().children || []
            userData = { ...userData, childrenProfiles }
          } else {
            userData = { ...userData, childrenProfiles: [] } // No children data
          }

          // Check if we need to reassign monthly khair points
          if (user.role === "recipient" && hasMonthPassed(userData.lastPointsReassignmentDate)) {
            const newKhairPoints = await reassignMonthlyKhairPoints(user.uid, userData, childrenProfiles)

            if (newKhairPoints !== null) {
              userData.khairPoints = newKhairPoints
              userData.lastPointsReassignmentDate = new Date()
            }
          }

          // Make sure to include the uid in the userProfile
          userData = { ...userData, uid: user.uid }

          setUserProfile(userData)
        } else {
          console.log("User profile not found in Firestore")
          setUserProfile(null)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [user]) // Runs whenever the user changes

  // Add a function to update khair points in the context
  const updateUserKhairPoints = async (newPoints) => {
    if (!user) return false

    try {
      if (user.recipientType==='individual'){
        await firestore().collection("individual_profiles").doc(user.uid).update({
          khairPoints: newPoints,
        })

      }

      else if (user.recipientType==='ngo'){
        await firestore().collection("ngo_profiles").doc(user.uid).update({
          khairPoints: newPoints,
        })

      }
      // Update in Firestore
     

      // Update local state using functional update
      setUserProfile((prevProfile) => {
        if (!prevProfile) return null
        return {
          ...prevProfile,
          khairPoints: newPoints,
        }
      })

      return true
    } catch (error) {
      console.error("Error updating khair points:", error)
      return false
    }
  }

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        setUserProfile,
        updateUserKhairPoints,
        loading,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export const useUserProfile = () => useContext(UserProfileContext)