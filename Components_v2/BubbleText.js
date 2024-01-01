import React from 'react';
import { Text, StyleSheet } from 'react-native';
function BubbleText({ text, size, color = 'black', underline = false, lineSpacing = 0 }) {
  // Add a default lineSpacing prop if you want to have the option to adjust line spacing per use case
  const styles = StyleSheet.create({
    bubbleText: {
      fontFamily: 'BubbleBobble',
      fontSize: size,
      
      color: color,
      lineHeight: size + lineSpacing, // Calculate line height by adding lineSpacing to fontSize
      textDecorationLine: underline ? 'underline' : 'none'
    },
  });

  return (
    <Text style={styles.bubbleText}>
      {text}
    </Text>
  );
}

export default BubbleText;
