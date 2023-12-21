import React from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground, View } from 'react-native';
import BubbleText from './BubbleText';

function BlankButton({ onPress, width = 350, text, ...otherProps }) {
  // Define the dimensions of the button based on the passed width or a default value
  const buttonWidth = width; // Example default width
  const buttonHeight = 75; // Replace yourAspectRatio with the width/height ratio of your image
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.touchable, { width: buttonWidth, height: buttonHeight }]} 
      {...otherProps}
    >
      <ImageBackground 
        source={require("../assets/buttons/BlankButton.png")} 
        style={[styles.background, { width: buttonWidth, height: buttonHeight }]}
        resizeMode="contain"
      >
        <View style={styles.textContainer}>
          <BubbleText size={24} color='#FFFFFF' text={text}/>
        </View>
      </ImageBackground>
    </TouchableOpacity> 
  );
}

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    width: '100%', // Set to the specific dimensions if needed
    height: '100%', // Set to the specific dimensions if needed
    justifyContent: "center",
    alignItems: "center",
    

  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BlankButton;
