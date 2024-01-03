import React from 'react';
import { Text, StyleSheet } from 'react-native';
function BubbleText({ text, size, color = 'black', underline = false, lineSpacing = 0, strikeThrough = false }) {
  // Add a default lineSpacing prop if you want to have the option to adjust line spacing per use case
  let textDecorationLine = 'none';
  if (underline) {
    textDecorationLine = 'underline';
  }
  if (strikeThrough) {
    textDecorationLine = 'line-through';
  }
  const styles = StyleSheet.create({
    bubbleText: {
      fontFamily: 'BubbleBobble',
      fontSize: size,
      color: color,
      lineHeight: size + lineSpacing, // Calculate line height by adding lineSpacing to fontSize
      textDecorationLine: textDecorationLine,

    

    },
  });

  return (
    <Text style={styles.bubbleText}>
      {text}
    </Text>
  );
}

export default BubbleText;
