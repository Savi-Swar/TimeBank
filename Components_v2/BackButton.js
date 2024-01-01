import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { playSound } from '../audio';
import { scale, verticalScale } from '../scaling';
function BackButton({ onPress, imageUrl, width, ...otherProps }) {

  const handlePress = () => {
    playSound('click'); // Play the click sound
    if (onPress) {
      onPress(); // If there's an onPress function passed, call it
    }
  };
  return (
    <TouchableOpacity onPress={handlePress} {...otherProps}>
      <Image source={imageUrl} style={styles.button} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: scale(23), // Adjust based on your image dimensions
    height: verticalScale(17), // Adjust based on your image dimensions
    resizeMode: 'contain'
  }
});

export default BackButton;
