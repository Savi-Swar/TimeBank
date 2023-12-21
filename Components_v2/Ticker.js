import React from 'react';
import { View, StyleSheet } from 'react-native';
import BubbleText from './BubbleText';

function Ticker({text, color = "#FFFFFF", ...otherProps}) {
    return (
        <View style={[styles.button, { backgroundColor: color }, otherProps]}>
            <BubbleText text = {text} color='#FFFFFF' size={13} />
        </View>
    );
}

const styles = StyleSheet.create({
  button: {
    height: 25,
    width: 65,
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
    
    }  
}); 

export default Ticker;