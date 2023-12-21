import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

function ImageButton({ onPress, ...otherProps }) {
  return (
    <TouchableOpacity onPress={onPress} {...otherProps}>
      <Image source={require("../assets/StartButton.png")} style={styles.button} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 65, // Adjust based on your image dimensions
    height: 65,    // Adjust based on your image dimensions
    resizeMode: 'contain'
  }
});

export default ImageButton;
