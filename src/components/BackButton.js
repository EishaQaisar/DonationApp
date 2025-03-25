import React, { useEffect, useState } from "react";
import { TouchableOpacity, Image, StyleSheet, I18nManager } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import i18n from "../i18n";

export default function BackButton({ goBack }) {
  const [isRTL, setIsRTL] = useState(i18n.locale === "ur");

  useEffect(() => {
    const checkLocale = () => {
      setIsRTL(i18n.locale === "ur");
    };

    // Listen for changes in locale
    checkLocale();
  }, [i18n.locale]); // Dependency on i18n.locale


  return (
    <TouchableOpacity onPress={goBack} style={styles.container}>
      <Image
        style={[styles.image, isRTL && styles.imageRTL]}
        source={require("../../assets/items/arrow-icon-direction-icon-left-icon-pointing-icon-white-black-text-logo-line-png-clipart-thumbnail Background Removed.png")}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10 + getStatusBarHeight(),
    left: 4,
  },
  image: {
    width: 24,
    height: 24,
  },
  imageRTL: {
    transform: [{ rotate: "180deg" }],
  },
});
