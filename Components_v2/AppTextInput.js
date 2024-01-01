import React from 'react';
import { View, StyleSheet, ImageBackground, TextInput, Image } from 'react-native';
import { useFonts } from "expo-font";
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling'; // Import scaling functions
function AppTextInput({ iconSource, placeholder, value, onChangeText, width=450 }) {
  const [loaded] = useFonts({
    BubbleBobble: require("../assets/fonts/BubbleBobble.ttf"),
  });

  width = scale(width)
  if (!loaded) {
    return null;
  }
  let minHeight = Math.max(70, verticalScale(70))
  return (
    <ImageBackground source={require("../assets/textinput.png")} style={[styles.container, {height: minHeight}]}>
        {iconSource && <Image source={iconSource} style={styles.icon} />}
        <TextInput 
          placeholder={placeholder} 
          placeholderTextColor="#D2623A"
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          autoCorrect = {false}
          autoCapitalize='none'
          autoComplete='off'
          spellCheck={false}
        />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
   
  },
  textInput: {
    flex: 1,
    width: '100%', // This ensures the TextInput fills its container
    fontFamily: 'BubbleBobble',
    fontSize: moderateScaleFont(20, 1),
    left: scale(70),
    bottom: verticalScale(3),
    backgroundColor: 'transparent',
    color: '#D2623A',
    zIndex: 1,  // Make sure the text input appears above the icon
  },
  icon: {
                  // Adjust this value as needed
    left: scale(60),              // Adjust this value as needed
    width: scale(25),
    height: verticalScale(25),
    top: verticalScale(-3),
    zIndex: 0,  // Make sure the icon appears below the text input
    resizeMode: "contain"
  },
});

export default AppTextInput;
