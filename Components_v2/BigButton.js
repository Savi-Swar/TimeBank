import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { playSound } from '../audio';
import { scale, verticalScale } from '../scaling';
function BigButton({ onPress, imageUrl, width, ...otherProps }) {

  const handlePress = () => {
    playSound('click'); // Play the click sound
    if (onPress) {
      onPress(); // If there's an onPress function passed, call it
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={styles.touchable} 
      {...otherProps}
    >
      <Image source={imageUrl} style={styles.button} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(15),


  },
  button: {
    width: scale(370), // Adjust based on your image dimensions
    height: verticalScale(69), // Adjust based on your image dimensions
    resizeMode: 'contain'
  }
});

export default BigButton;
