import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { playSound } from '../audio';
import { scale, verticalScale } from '../scaling';

function MediumButton({ onPress, imageUrl, height = verticalScale(175), width = scale(240), ...otherProps }) {
  const handlePress = () => {
    playSound('click'); // Play the click sound
    if (onPress) {
      onPress(); // If there's an onPress function passed, call it
    }
  };
  
  return (
    <TouchableOpacity onPress={handlePress} {...otherProps}>
      <Image source={imageUrl} style={{ resizeMode: "contain", height: height, width: width}} />
    </TouchableOpacity>
  );
}




export default MediumButton;
