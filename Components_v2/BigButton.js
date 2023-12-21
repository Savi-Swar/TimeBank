import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

function BigButton({ onPress, imageUrl, width, ...otherProps }) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
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

  },
  button: {
    width: 350, // Adjust based on your image dimensions
    height: 100, // Adjust based on your image dimensions
    resizeMode: 'contain'
  }
});

export default BigButton;
