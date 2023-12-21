import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

function MediumButton({ onPress, imageUrl, height = 175, width = 240, ...otherProps }) {
  return (
    <TouchableOpacity onPress={onPress} {...otherProps}>
      <Image source={imageUrl} style={{ resizeMode: "contain", height: height, width: width}} />
    </TouchableOpacity>
  );
}




export default MediumButton;
