import React from 'react';
import { View, StyleSheet, ImageBackground, TextInput, Image } from 'react-native';
import { useFonts } from "expo-font";

function AppTextInput({ iconSource, placeholder, value, onChangeText, width="125%" }) {
  const [loaded] = useFonts({
    BubbleBobble: require("../assets/fonts/BubbleBobble.ttf"),
  });

  if (!loaded) {
    return null;
  }
  
  return (
    <ImageBackground source={require("../assets/textinput.png")} style={[styles.container, { width: width }]} resizeMode="contain">
      {iconSource && <Image source={iconSource} style={styles.icon} />}
      <TextInput 
        placeholder={placeholder} 
        placeholderTextColor="#D2623A"
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 150, // Adjusted height to make it longer
    right: 65,
    alignSelf: 'center',
    // padding: 15,
    // marginVertical: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: 'BubbleBobble',
    fontSize: 20,
    left: 215,
    bottom: 3,
    backgroundColor: 'transparent',
    color: '#D2623A',
    zIndex: 1,  // Make sure the text input appears above the icon
  },
  icon: {
    position: 'absolute',  // Position the icon absolutely to appear on top
                  // Adjust this value as needed
    left: 175,              // Adjust this value as needed
    width: 25,
    height: 25,
    top: 59,
    zIndex: 0,  // Make sure the icon appears below the text input
    resizeMode: "contain"
  },
});

export default AppTextInput;
