import React from 'react';
import { View, StyleSheet } from 'react-native';
import BubbleText from './BubbleText';
import { scale, verticalScale, moderateScaleFont } from '../scaling';

function Ticker({text, color = "#FFFFFF", ...otherProps}) {

    return (
        <View style={[styles.button, { backgroundColor: color }, otherProps]}>
                <BubbleText text = {text} color='#FFFFFF' size={moderateScaleFont(13)} />
        </View>
    );
}

const styles = StyleSheet.create({
  button: {
    height: verticalScale(25),
    width: scale(65),
    flex: 1,
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center"
    
    }  
}); 

export default Ticker;