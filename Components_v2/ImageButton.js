import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { playSound } from '../audio';
import { scale, verticalScale } from '../scaling'; // Import scaling functions

function ImageButton({ onPress, ...otherProps }) {
  const handlePress = () => {
    playSound('click'); // Play the click sound
    if (onPress) {
      onPress(); // If there's an onPress function passed, call it
    }
  };
  return (
    <TouchableOpacity onPress={handlePress} {...otherProps}>
      <Image source={require("../assets/StartButton.png")} style={styles.button} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: scale(65),
    height: verticalScale(65),
    resizeMode: 'contain',
    marginBottom: verticalScale(3),

  }
});


export default ImageButton;
