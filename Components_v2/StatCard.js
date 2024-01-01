import React from 'react';
import { View, StyleSheet, ImageBackground, Text, Image } from 'react-native';
import BubbleText from './BubbleText';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';

function StatCard({ minutes, stat, icon, width = scale(100) }) {
  let left = scale(250);
  if (width < scale(80)) {
    left+=scale(20);
  }
    return (
        <ImageBackground
            style={styles.background}
            source={require("../assets/StatBg.png")}
            imageStyle={styles.imageBackground} // Apply the borderRadius to the image background
        >
            {/* Add your content here */}

                {/* Icon */}
                {/* Minutes and Stat */}
            <View style = {{flexDirection: "row"}}> 
                <View>              
                    <View  style={{left: scale(10)}}>
                        <BubbleText size = {moderateScaleFont(20)} color="#650000" text={stat} />
                      </View>
                      <View  style={{ top: verticalScale(5), left: scale(10)}}>
                        <BubbleText size = {35} text={minutes} />
                    </View>
                </View> 
              <View style = {{position: "absolute", left: left, top: verticalScale(-25)}}>
                <Image source={icon} style={[styles.icon, {width: width}]} />
              </View>
            </View>

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
  background: {
    width: scale(350), // Set to the specific dimensions if needed
    height: verticalScale(110), // Set to the specific dimensions if needed
    justifyContent: "center",
    // Add borderRadius and overflow properties
    borderRadius: scale(10), // Adjust to your desired curvature
    overflow: 'hidden', // Make sure the inner content respects the borderRadius
  },
  imageBackground: {
    // Set the borderRadius for the image itself
    borderRadius: scale(20), // This should match the borderRadius of the container
  },
  icon: {
    // Style your icon image
    width: "800%", // Adjust to your icon's dimensions
    height: Math.max(105, verticalScale(105)), // Adjust to your icon's dimensions
    marginRight: scale(10), // Add some spacing between icon and text
  },
  minutes: {
    // Style for the minutes text
    fontSize: moderateScaleFont(24), // Adjust to your preference
    fontWeight: 'bold', // Adjust to your preference
    color: '#000', // Adjust to your preference
  },
  stat: {
    // Style for the stat text
    fontSize: moderateScaleFont(18), // Adjust to your preference
    color: '#000', // Adjust to your preference
  },
});

export default StatCard;
