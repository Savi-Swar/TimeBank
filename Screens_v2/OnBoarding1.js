import React from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';

// Import the ImageButton component
import ImageButton from '../Components_v2/ImageButton';

function OnBoarding1({ navigation }) {
  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/02_onboarding.png")}>
      <Image style={styles.skip} source={require("../assets/skip.png")} />
      <Image style={styles.image} source={require("../assets/Text/BubbleText1.png")} />

      {/* Place the ImageButton 100px below the BubbleText image */}
      <View style={styles.imageButtonContainer}>
        <ImageButton onPress={() => navigation.navigate("OnBoarding2")} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 320,
    height: 175,
    resizeMode: "contain",
    bottom: 250,
    right: 20
  },
  skip: {
    width: 70,
    height: 35,
    resizeMode: "contain",
    bottom: 280,
    left: 150
  },
  // Add a new container style for the ImageButton to position it 100px below the BubbleText image
  imageButtonContainer: {
    position: 'absolute',
    top: 220,      // Adjust this value to perfectly center the button below the BubbleText
    left: 25,
    alignSelf: 'center',
    marginTop: 100,  // This moves the button 100px below
  }
});

export default OnBoarding1;
