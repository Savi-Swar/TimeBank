import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

function CustomButton({ onPress, imageUrl, width = 60, height = 60, ...otherProps }) {
  return (
    <TouchableOpacity onPress={onPress} {...otherProps}>
      <Image source={imageUrl} style={[styles.button, { width, height }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    resizeMode: 'contain',
  },
});

export default CustomButton;
