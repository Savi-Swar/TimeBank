import React from 'react';
import { View, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';

// Import the ImageButton component
import ImageButton from '../Components_v2/ImageButton';
import { playSound } from '../audio';
import BubbleText from '../Components_v2/BubbleText';
import { scale, verticalScale, moderateScaleFont } from '../scaling'; // Import scaling functions

function OnBoarding1({ navigation }) {
  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/02_onboarding.png")}>
      <TouchableOpacity onPress={() => {navigation.navigate("Login"), playSound("transition")}}>
        <Image style={styles.skip} source={require("../assets/skip.png")} />
      </TouchableOpacity>
        <View style = {{right: scale(20), bottom: verticalScale(280)}}>
          <BubbleText text = "TimeBank" size = {moderateScaleFont(40)}/>
          <View style={{top: verticalScale(30)}}>
            <BubbleText text = "Where Learning the Value of Time" size = {moderateScaleFont(24)} color="#650000"/>
          </View>
          <View style={{top: verticalScale(35)}}>
            <BubbleText text = "Becomes a Rewarding Adventure!" size = {moderateScaleFont(24)} color="#650000"/>
          </View>
        </View>

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
    resizeMode: 'stretch', // This will cover the entire screen
  },
  image: {
    width: scale(320),
    height: verticalScale(175),
    resizeMode: "contain",
    bottom: verticalScale(250),
    right: scale(20)
  },
  skip: {
    width: scale(70),
    height: verticalScale(35),
    resizeMode: "contain",
    bottom: verticalScale(320),
    left: scale(150)
  },
  imageButtonContainer: {
    position: 'absolute',
    top: verticalScale(220),
    left: scale(25),
    alignSelf: 'center',
    marginTop: verticalScale(100),
  }
});

export default OnBoarding1;