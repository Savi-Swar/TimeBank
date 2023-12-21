import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

function CustomCheckbox({ value, onValueChange, label }) {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={() => onValueChange(!value)}>
      <View style={[styles.checkbox, value ? styles.checked : null]} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 8,
  },
  checked: {
    backgroundColor: '#000',
  },
  label: {
    fontSize: 16,
  },
});

export default CustomCheckbox;
