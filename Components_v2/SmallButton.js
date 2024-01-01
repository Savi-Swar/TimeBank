import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { playSound } from '../audio';
import { scale, verticalScale } from '../scaling';
function SmallButton({ onPress, imageUrl, height = verticalScale(180), width = scale(100), ...otherProps }) {
  const handlePress = () => {
    playSound('click'); // Play the click sound
    if (onPress) {
      onPress(); // If there's an onPress function passed, call it
    }
  };
  return (
    <TouchableOpacity onPress={handlePress} {...otherProps}>
      <Image source={imageUrl} style={[styles.button,{height: height, width: width}]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
   
    resizeMode: 'contain'
  }
});

export default SmallButton;
