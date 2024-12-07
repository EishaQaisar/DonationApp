import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Image, TouchableOpacity, ScrollView, View, Animated } from 'react-native';
import { theme } from '../core/theme';
import BackButton from "../components/BackButton";
import Button from "../components/Button";

export default function NgoPostDetailsScreen({ route, navigation }) {
  const { title, description, image } = route.params;
  const [showButton, setShowButton] = useState(true);

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowButton(scrollY <= 50); // Hide the button if scrolled more than 50 pixels
  };

  return (
    <SafeAreaView style={styles.container}>
      {showButton && (
        <View style={styles.backButtonWrapper}>
          <BackButton goBack={navigation.goBack} />
        </View>
      )}
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16} // Improves scroll performance
      >
        <Image source={image} style={styles.detailsImage} />
        <Text style={styles.detailsTitle}>{title}</Text>
        <Text style={styles.detailsDescription}>{description}</Text>
        <Text style={styles.poeticLine}>
          "Extend your hand, where hope begins, and kindness wins."
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.button}
          >
            Donate Now
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
  detailsDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    marginVertical: 8,
    color: theme.colors.ivory,
  },
  backButtonWrapper: {
    position: 'absolute',
    marginTop:-10,
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
});
