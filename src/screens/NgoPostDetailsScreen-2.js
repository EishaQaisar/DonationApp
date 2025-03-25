import React, { useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, Image, TouchableOpacity, ScrollView, View, Animated } from 'react-native';
import { theme } from '../core/theme';
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import { AuthContext } from "../context/AuthContext";
import { t } from "../i18n";

export default function NgoPostDetailsScreen({ route, navigation }) {
  const { title, description, image } = route.params;
  const [showButton, setShowButton] = useState(true);
  const { isRTL, language } = useContext(AuthContext);
  const isUrdu = language === "ur";

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowButton(scrollY <= 50); // Hide the button if scrolled more than 50 pixels
  };

  return (
    <SafeAreaView style={styles.container}>
      {showButton && (
        <View style={[
          styles.backButtonWrapper,
          isRTL && { right: 2, left: 'auto' }
        ]}>
          <BackButton goBack={navigation.goBack} />
        </View>
      )}
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16} // Improves scroll performance
      >
        <Image source={image} style={styles.detailsImage} />
        <Text style={[
          styles.detailsTitle,
          isUrdu && styles.urduTitle
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.detailsDescription,
          isRTL && { textAlign: isRTL ? 'right' : 'justify' },
          isUrdu && styles.urduText
        ]}>
          {description}
        </Text>
        <Text style={[
          styles.poeticLine,
          isUrdu && styles.urduPoetic
        ]}>
          {t("ngoPost.poeticLine", "\"Extend your hand, where hope begins, and kindness wins.\"")}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.button}
          >
            {t("ngoPost.donateNow", "Donate Now")}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.TaupeBlack,
    padding: 20,
  },
  detailsImage: {
    height: 300,
    width: '100%',
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
    color: theme.colors.ivory,
  },
  urduTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  detailsDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    marginVertical: 8,
    color: theme.colors.ivory,
  },
  urduText: {
    fontSize: 18,
    lineHeight: 28,
  },
  backButtonWrapper: {
    position: 'absolute',
    marginTop: -10,
    left: 2,
    zIndex: 100,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
    paddingBottom: 20,
  },
  poeticLine: {
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
    color: theme.colors.ivory,
  },
  urduPoetic: {
    fontSize: 22,
    fontStyle: 'normal',
  },
});