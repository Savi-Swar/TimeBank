import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { playSound } from '../audio';
import { scale, verticalScale } from '../scaling';
function CustomButton({ onPress, imageUrl, width = scale(60), height = verticalScale(60), ...otherProps }) {
  const handlePress = () => {
    playSound('click'); // Play the click sound
    if (onPress) {
      onPress(); // If there's an onPress function passed, call it
    }
  };
  return (
    <TouchableOpacity onPress={handlePress} {...otherProps}>
      <Image source={imageUrl} style={[styles.button, { width: width, height: height }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    resizeMode: 'contain',
    marginBottom: verticalScale(3),
  },
});

export default CustomButton;
