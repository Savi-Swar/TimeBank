import React from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';

// Import the ImageButton component
import ImageButton from '../Components_v2/ImageButton';

function OnBoarding1({ navigation }) {
  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/01_splash.png")}>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OnBoarding1;
