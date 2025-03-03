import React, { createContext, useState, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { AuthContext } from "./AuthContext"; // Import AuthContext

export const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const { user } = useContext(AuthContext); // Get user from AuthContext

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setUserProfile(null);
        return;
      }

      console.log("Fetching user profile for:", user.uid);
      try {
        // Fetch parent profile
        const userDoc = await firestore()
          .collection("individual_profiles")
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          let userData = userDoc.data();
          console.log("User profile set:", userData);

          // Fetch children profiles from `children_profiles` collection
          const childrenDoc = await firestore()
            .collection("children_profiles")
            .doc(user.uid)
            .get();

          if (childrenDoc.exists) {
            const childrenProfiles = childrenDoc.data().children || [];
            userData = { ...userData, childrenProfiles };
          } else {
            userData = { ...userData, childrenProfiles: [] }; // No children data
          }

          setUserProfile(userData);
        } else {
          console.log("User profile not found in Firestore");
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [user]); // Runs whenever the user changes

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
