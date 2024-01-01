import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';

const CustomSwitch = ({ value, onValueChange }) => {
  const iconName = value ? 'ios-toggle' : 'ios-toggle-outline';
  const iconColor = value ? 'green' : 'grey';
  const iconStyle = value ? styles.iconOn : styles.iconOff;
  let r = Math.min(scale(35), verticalScale(35));

  return (
    <TouchableOpacity  onPress={() => onValueChange(!value)}>
      <Ionicons name={iconName} size={r} color={iconColor} style={iconStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconOn: {
     
  },
  iconOff: {
    transform: [{ rotate: '180deg' }],
  },
});

export default CustomSwitch;
