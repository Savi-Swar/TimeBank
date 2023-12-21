import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

function BackButton({ onPress, imageUrl, width, ...otherProps }) {
  return (
    <TouchableOpacity onPress={onPress} {...otherProps}>
      <Image source={imageUrl} style={styles.button} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 30, // Adjust based on your image dimensions
    height: 20, // Adjust based on your image dimensions
    resizeMode: 'contain'
  }
});

export default BackButton;
