import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import colors from "../config/colors";
import BubbleText from './BubbleText';
import { Dimensions } from 'react-native';
import { scale, verticalScale, moderateScaleFont } from '../scaling';


const carImage = require("../assets/icons/racing-car.png"); // Replace with the path to your car image asset

function TimeProgressBar({ startTime, endTime }) {
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [minutesLeft, setMinutesLeft] = useState('');
  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width); // Initial width

  useEffect(() => {
    updateProgress();
    const interval = setInterval(updateProgress, 1000); // Update every second for smooth animation
    return () => clearInterval(interval);
  }, [startTime, endTime]); // Make sure to re-run this effect if startTime or endTime changes

 

  const updateProgress = () => {
    const currentTime = new Date();
    const start = new Date();
    const end = new Date();
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    start.setHours(startHours, startMinutes, 0, 0);
    end.setHours(endHours, endMinutes, 0, 0);

    const duration = end.getTime() - start.getTime();
    const elapsed = currentTime.getTime() - start.getTime();
    const progressValue = elapsed > 0 ? Math.min(elapsed / duration, 1) : 0;
    

    Animated.timing(progress, {
      toValue: progressValue,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Calculate minutes left
    const remaining = end.getTime() - currentTime.getTime();
    const minutes = Math.round(remaining / 60000);
    setMinutesLeft(minutes > 0 ? `${minutes} min` : 'Time is up!');
  };

  const progressInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  
  const carWidth = scale(140); // Update this to match your car image's actual width

  const carLeftInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-carWidth / 2, containerWidth - carWidth / 2], // Adjusted to center the car
    extrapolate: 'clamp',
  });

  return (
    <View>
      <View style={styles.container}>
        <Animated.View style={[styles.progressBar, { width: progressInterpolate }]} />
        <Animated.Image source={carImage} style={[styles.car, { left: carLeftInterpolate}]} />
      </View>
      <View style={styles.minutesLeftContainer}>
        <BubbleText size={moderateScaleFont(16)} text={"Minutes Left: " + minutesLeft} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      position: 'relative',
      height: verticalScale(30),
      width: '100%',
      backgroundColor: '#ffebee', // This is the background color of the whole bar
      borderColor: '#c62828',
      borderWidth: scale(2),
      borderRadius: scale(15),
      overflow: 'hidden',
      alignSelf: 'center',
      marginVertical: verticalScale(20),
    },
    stripedBackground: {
      ...StyleSheet.absoluteFillObject,
      // The background here should have some visible pattern or gradient
      // For example, you might use an actual striped image here or create a striped effect using a LinearGradient component
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.secondary, // This should be a solid contrasting color to show progress
    },
    car: {
      position: 'absolute',
      top: verticalScale(-7), // Adjust if necessary
      width: scale(50),
      height: verticalScale(40),
      resizeMode: 'contain',
    },
    minutesLeftContainer: {
      alignItems: 'center',
      marginTop: verticalScale(-10), // Adjust this value to position the text correctly
    },
    minutesLeft: {
      fontSize: moderateScaleFont(16),
      fontWeight: 'bold',
      color: colors.primary,
    },
  });

export default TimeProgressBar;
