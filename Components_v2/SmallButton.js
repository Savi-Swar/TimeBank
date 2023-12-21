import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

function SmallButton({ onPress, imageUrl, width, ...otherProps }) {
  return (
    <TouchableOpacity onPress={onPress} {...otherProps}>
      <Image source={imageUrl} style={styles.button} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 140, // Adjust based on your image dimensions
    height: 100, // Adjust based on your image dimensions
    resizeMode: 'contain'
  }
});

export default SmallButton;
