// screens/Feedbackss.tsx
import React, { useState, useEffect, useRef, useContext } from "react"
import { useRoute } from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native"
import { theme } from "../core/theme"
import i18n,{ t } from "../i18n"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import { AuthContext } from "../context/AuthContext"

// Modern star rating component with enhanced animations
const StarRating = ({ rating, setRating, maxStars = 5 }) => {
  const animatedValues = useRef([...Array(maxStars)].map(() => new Animated.Value(0))).current
  
  useEffect(() => {
    animatedValues.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i < rating ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }).start()
    })
  }, [rating])

  // Use translated rating labels
  const ratingLabels = [
    t("feedback.ratings.1"), // "Poor"
    t("feedback.ratings.2"), // "Fair"
    t("feedback.ratings.3"), // "Good"
    t("feedback.ratings.4"), // "Very Good"
    t("feedback.ratings.5")  // "Excellent"
  ]

  return (
    <View style={styles.ratingContainer}>
      <View style={styles.starsContainer}>
        {[...Array(maxStars)].map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setRating(i + 1)}
            style={styles.starButton}
            activeOpacity={0.7}
          >
            <Animated.View
              style={{
                transform: [
                  { 
                    scale: animatedValues[i].interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 1.4, 1.2]
                    })
                  },
                  {
                    rotate: animatedValues[i].interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: ['0deg', '30deg', '0deg']
                    })
                  }
                ],
                opacity: animatedValues[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1]
                })
              }}
            >
              <Text style={[styles.star, i < rating ? styles.starFilled : styles.starEmpty]}>
                ★
              </Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
      {rating > 0 && (
        <Animated.View 
          style={[
            styles.ratingLabelContainer,
            { 
              opacity: rating > 0 ? 1 : 0,
              transform: [{ 
                scale: rating > 0 ? 1 : 0.8 
              }]
            }
          ]}
        >
          <Text style={styles.ratingLabel}>
            {ratingLabels[rating - 1]}
          </Text>
        </Animated.View>
      )}
    </View>
  )
}

// Get category-specific colors based on theme
const getCategoryColors = (id) => {
  switch(id) {
    case 'food': return {
      primary: theme.colors.sageGreen,
      secondary: theme.colors.copper,
      icon: "🍽️"
    };
    case 'clothing': return {
      primary: theme.colors.sageGreen,
      secondary: theme.colors.copper,
      icon: "👕"
    };
    case 'education': return {
      primary: theme.colors.sageGreen,
      secondary: theme.colors.copper,
      icon: "📚"
    };
    default: return {
      primary: theme.colors.sageGreen,
      secondary: theme.colors.copper,
      icon: "📝"
    };
  }
}

// Modern category selector with theme colors
const CategorySelector = ({ selectedCategory, setSelectedCategory }) => {
  // Updated with translations
  const categories = [
    { 
      id: 'food', 
      label: t("feedback.categories.food.label"), // "Culinary Experience"
      description: t("feedback.categories.food.description"), // "Quality, taste, and presentation of food items"
    },
    { 
      id: 'clothing', 
      label: t("feedback.categories.clothing.label"), // "Fashion & Apparel"
      description: t("feedback.categories.clothing.description"), // "Quality, fit, and style of clothing products"
    },
    { 
      id: 'education', 
      label: t("feedback.categories.education.label"), // "Educational Content"
      description: t("feedback.categories.education.description"), // "Quality and effectiveness of learning materials"
    },
  ]

  return (
    <View style={styles.categoriesContainer}>
      <Text style={styles.sectionTitle}>{t("feedback.selectCategory")}</Text>
      <View style={styles.categoryButtonsContainer}>
        {categories.map((category) => {
          const colors = getCategoryColors(category.id);
          const isSelected = selectedCategory === category.id;
          
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                isSelected && [styles.categoryButtonSelected, { backgroundColor: colors.primary }]
              ]}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.8}
            >
              <View style={[
                styles.categoryIconContainer,
                isSelected && { backgroundColor: theme.colors.copper }
              ]}>
                <Text style={styles.categoryIcon}>{colors.icon}</Text>
              </View>
              <View style={styles.categoryTextContainer}>
                <Text
                  style={[
                    styles.categoryButtonText,
                    isSelected && styles.categoryButtonTextSelected
                  ]}
                >
                  {category.label}
                </Text>
                {isSelected && (
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                )}
              </View>
              {isSelected && (
                <View style={styles.categorySelectedIndicator}>
                  <Text style={styles.categorySelectedIcon}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  )
}

// Main Feedback component - now accepts donationData as a prop
const Feedbackss = ({route}) => {
  const { item } = route.params || {}; // Ensure fallback to avoid crash
  const donationData = item;
  const { user } = useContext(AuthContext);
  
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [category, setCategory] = useState("")
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const shakeAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  
  const MAX_CHARS = 500

  useEffect(() => {
    // Initial animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true
    }).start();
    
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  // Reset animations when submitted state changes back to false
  useEffect(() => {
    if (!submitted) {
      fadeAnim.setValue(0)
      slideAnim.setValue(50)
    }
  }, [submitted])

  // Enhanced pulse animation for submit button
  useEffect(() => {
    const pulseTiming = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    )
    
    if (feedback.trim().length > 0 && !submitted && rating > 0 && category) {
      pulseTiming.start()
      
      // Add rotation animation for extra flair
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start()
    } else {
      pulseAnim.setValue(1)
      rotateAnim.setValue(0)
      pulseTiming.stop()
    }
    
    return () => pulseTiming.stop()
  }, [feedback, submitted, rating, category])

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      // Enhanced shake animation for validation error
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 5, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
      ]).start()
      
      Alert.alert(
        t("feedback.missingInfo"), 
        t("feedback.provideFeedback")
      )
      return
    }

    if (rating === 0) {
      Alert.alert(
        t("feedback.missingInfo"), 
        t("feedback.provideRating")
      )
      return
    }

    if (!category) {
      Alert.alert(
        t("feedback.missingInfo"), 
        t("feedback.selectCategoryPrompt")
      )
      return
    }

    setLoading(true)

    try {
      // Get current user if logged in
      const currentUser = auth().currentUser;
      const userId = currentUser ? currentUser.uid : 'anonymous';

      // Create feedback data object with recipient and donor information
      const feedbackData = {
        recipientId: userId,
        recipientName: user?.username || "",
        recipientFullName: user?.name || "",
        
        donorUsername: item.donorUsername || "",
        donationId: item.id || "",
        donationTitle: item.itemName || "",
        
        category: item.donationType,
        itemID: item.itemId,
        rating: rating,
        comment: feedback,
        timestamp: firestore.FieldValue.serverTimestamp(),
      };
      
      // Add additional user details if available
      if (currentUser) {
        try {
          const userDoc = await firestore().collection('users').doc(userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            feedbackData.recipientPhone = userData.phone || '';
            // Don't overwrite the username if it's already set from AuthContext
            if (!feedbackData.recipientName) {
              feedbackData.recipientName = userData.username || '';
            }
            if (!feedbackData.recipientFullName) {
              feedbackData.recipientFullName = userData.name || '';
            }
          }
        } catch (userError) {
          console.log("Error fetching user details:", userError);
          // Continue even if we can't get user details
        }
      }
      
      // Add to Firestore
      await firestore()
        .collection('feedbacks') // Changed from 'feedback' to 'feedbacks' to match the collection name in ClaimsHistory
        .add(feedbackData);
      
      console.log("Feedback saved to Firebase:", feedbackData);
      
      setLoading(false)
      setSubmitted(true);
      
      // Enhanced success animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.poly(4)),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]).start();

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFeedback("");
        setRating(0);
        setCategory("");
      }, 3000);
      
    } catch (error) {
      setLoading(false)
      console.error("Error saving feedback to Firebase:", error);
      Alert.alert(
        t("feedback.error"),
        t("feedback.errorSubmitting")
      );
    }
  }

  const getCharCountColor = () => {
    const remaining = MAX_CHARS - feedback.length
    if (remaining < 50) return theme.colors.error
    if (remaining < 100) return theme.colors.placeholder
    return theme.colors.sageGreen
  }

  const getCategoryTitle = () => {
    switch(category) {
      case 'food': return t("feedback.categories.food.title"); // "Culinary Feedback"
      case 'clothing': return t("feedback.categories.clothing.title"); // "Fashion Feedback"
      case 'education': return t("feedback.categories.education.title"); // "Educational Feedback"
      default: return t("feedback.yourComments"); // "Your Comments"
    }
  }

  const getPlaceholder = () => {
    switch(category) {
      case 'food': 
        return t("feedback.categories.food.placeholder");
      case 'clothing': 
        return t("feedback.categories.clothing.placeholder");
      case 'education': 
        return t("feedback.categories.education.placeholder");
      default: 
        return t("feedback.categories.default.placeholder");
    }
  }

  const getCategoryColor = () => {
    return theme.colors.sageGreen;
  }

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.backgroundContainer}>
        <ScrollView 
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={[
              styles.formContainer,
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.headerEmoji}>💬</Text>
              <Text style={styles.headerTitle}>
                {t("feedback.title")}
              </Text>
              <Text style={styles.headerSubtitle}>
                {t("feedback.subtitle")}
              </Text>
            </View>

            {/* Display donation info if available */}
            {donationData && (
              <View style={styles.donationInfoContainer}>
                <Text style={styles.donationInfoTitle}>
                  {t("feedback.donationInfo")}
                </Text>
                <Text style={styles.donationInfoText}>
                  {donationData.itemName || t("feedback.unnamedDonation")}
                </Text>
                <Text style={styles.donationInfoSubtext}>
                  {t("feedback.byDonor")} {donationData.donorUsername || t("feedback.anonymousDonor")}
                </Text>
              </View>
            )}

            <CategorySelector 
              selectedCategory={category} 
              setSelectedCategory={setCategory} 
            />

            <View style={styles.ratingSection}>
              <Text style={styles.sectionTitle}>
                {t("feedback.rateExperience")}
              </Text>
              <StarRating rating={rating} setRating={setRating} />
            </View>

            <View style={styles.feedbackSection}>
              <Text style={[styles.sectionTitle, { color: getCategoryColor() }]}>
                {category ? getCategoryTitle() : t("feedback.yourComments")}
              </Text>
              <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      category && { borderColor: getCategoryColor() }
                    ]}
                    multiline
                    numberOfLines={6}
                    maxLength={MAX_CHARS}
                    placeholder={getPlaceholder()}
                    placeholderTextColor={theme.colors.placeholder}
                    value={feedback}
                    onChangeText={setFeedback}
                  />
                </View>
              </Animated.View>
              <Text style={[styles.charCount, { color: getCharCountColor() }]}>
                {MAX_CHARS - feedback.length} {t("feedback.charactersRemaining")}
              </Text>
            </View>

            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity 
                style={[
                  styles.button,
                  { backgroundColor: getCategoryColor() },
                  (!feedback.trim() || !rating || !category || loading) && styles.buttonDisabled
                ]} 
                onPress={handleSubmit}
                disabled={!feedback.trim() || !rating || !category || loading}
                activeOpacity={0.8}
              >
                <Animated.View 
                  style={[
                    styles.buttonIconContainer,
                    { transform: [{ rotate: loading ? '0deg' : spin }] }
                  ]}
                >
                  <Text style={styles.buttonIcon}>{loading ? "..." : "✓"}</Text>
                </Animated.View>
                <Text style={styles.buttonText}>
                  {loading ? t("feedback.submitting") : t("feedback.submitFeedback")}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Text style={styles.privacyNote}>
              {t("feedback.privacyNote")}
            </Text>
          </Animated.View>

          {submitted && (
            <Animated.View 
              style={[
                styles.successBox, 
                { 
                  opacity: fadeAnim, 
                  transform: [{ translateY: slideAnim }] 
                }
              ]}
            >
              <View style={styles.successContent}>
                <View style={styles.successIconContainer}>
                  <Text style={styles.successIcon}>✓</Text>
                </View>
                <Text style={styles.successTitle}>
                  {t("feedback.thankYou")}
                </Text>
                <Text style={styles.successText}>
                  {t("feedback.successMessage")}
                </Text>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  // All styles remain the same
  backgroundContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
    borderRadius: theme.roundness,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginVertical: 20,
    paddingBottom: 20,
  },
  headerContainer: {
    padding: 25,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: theme.colors.outerSpace,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.ivory,
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    lineHeight: 22,
  },
  donationInfoContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: theme.colors.outerSpace + '30',
    borderRadius: theme.roundness,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.sageGreen,
  },
  donationInfoTitle: {
    fontSize: 14,
    color: theme.colors.ivory,
    opacity: 0.7,
    marginBottom: 4,
  },
  donationInfoText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.ivory,
    marginBottom: 2,
  },
  donationInfoSubtext: {
    fontSize: 14,
    color: theme.colors.ivory,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.ivory,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  ratingSection: {
    marginBottom: 30,
    padding: 20,
    paddingTop: 0,
  },
  ratingContainer: {
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 44,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  starEmpty: {
    color: theme.colors.outerSpace,
  },
  starFilled: {
    color: theme.colors.sageGreen,
  },
  ratingLabelContainer: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: theme.colors.copper,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.ivory,
    textAlign: 'center',
  },
  categoriesContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  categoryButtonsContainer: {
    flexDirection: "column",
    gap: 12,
  },
  categoryButton: {
    borderRadius: theme.roundness,
    overflow: 'hidden',
    backgroundColor: theme.colors.outerSpace,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryButtonSelected: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    marginRight: 16,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryButtonText: {
    color: theme.colors.ivory,
    fontWeight: "600",
    fontSize: 18,
  },
  categoryButtonTextSelected: {
    color: theme.colors.pearlWhite,
    fontWeight: "700",
  },
  categoryDescription: {
    color: theme.colors.pearlWhite,
    fontSize: 14,
    marginTop: 4,
  },
  categorySelectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.copper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categorySelectedIcon: {
    color: theme.colors.ivory,
    fontSize: 14,
    fontWeight: 'bold',
  },
  feedbackSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  inputContainer: {
    borderRadius: theme.roundness,
  },
  input: {
    width: "100%",
    backgroundColor: theme.colors.outerSpace + '20',
    color: theme.colors.ivory,
    padding: 16,
    borderRadius: theme.roundness,
    textAlignVertical: "top",
    fontSize: 16,
    minHeight: 140,
    borderWidth: 1,
    borderColor: theme.colors.outerSpace,
  },
  charCount: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 8,
    fontStyle: "italic",
  },
  button: {
    borderRadius: theme.roundness,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  buttonIcon: {
    color: theme.colors.pearlWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: theme.colors.pearlWhite,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  privacyNote: {
    fontSize: i18n.locale=='ur'?14:12,
    color: theme.colors.placeholder,
    textAlign: "center",
    marginBottom: 10,
    fontStyle: "italic",
    paddingHorizontal: 20,
  },
  successBox: {
    width: '90%',
    maxWidth: 400,
    borderRadius: theme.roundness,
    overflow: 'hidden',
    backgroundColor: theme.colors.sageGreen,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    marginTop: 20,
  },
  successContent: {
    padding: 30,
    alignItems: "center",
  },
  successIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.copper,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  successIcon: {
    fontSize: 40,
    color: theme.colors.pearlWhite,
  },
  successTitle: {
    color: theme.colors.pearlWhite,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  successText: {
    color: theme.colors.pearlWhite,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 24,
  },
})

export default Feedbackss