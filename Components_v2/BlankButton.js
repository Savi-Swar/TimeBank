import React from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground, View } from 'react-native';
import BubbleText from './BubbleText';
import { playSound } from '../audio'; // Adjust the path to your audio.js file
import { scale, verticalScale, moderateScaleFont } from '../scaling'; // Adjust the path to your scaling.js file
function BlankButton({ onPress, width = scale(370), text, ...otherProps }) {
  // Define the dimensions of the button based on the passed width or a default value
  const buttonWidth = width; // Example default width
  const buttonHeight = verticalScale(67); // Replace yourAspectRatio with the width/height ratio of your image

  // Function to handle button press
  const handlePress = () => {
    playSound('click'); // Play the click sound
    if (onPress) {
      onPress(); // If there's an onPress function passed, call it
    }
  };
  
  return (
    <TouchableOpacity 
      onPress={handlePress} // Use the handlePress function here
      style={[styles.touchable, { width: buttonWidth, height: buttonHeight }]} 
      {...otherProps}
    >
      <ImageBackground 
        source={require("../assets/buttons/BlankButton.png")} 
        style={[styles.background, { width: buttonWidth, height: buttonHeight }]}
        resizeMode="contain"
      >
        <View style={styles.textContainer}>
          <BubbleText size={moderateScaleFont(24)} color='#FFFFFF' text={text}/>
        </View>
      </ImageBackground>
    </TouchableOpacity> 
  );
}
const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(3),
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
