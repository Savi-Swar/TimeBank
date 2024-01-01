import React, {useState} from 'react';
import { View, StyleSheet, ImageBackground, Image, TouchableOpacity, Text, Platform } from 'react-native';
import BubbleText from './BubbleText';
import StatCard from './StatCard';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from react-native-vector-icons
import Graphs from './Graph';
import { playSound } from '../audio';
import { scale, verticalScale, moderateScaleFont } from '../scaling';

function RoutineStat({name, st, et, times, timesCompleted, averageTime, lastCompleted}) {
    if (name.indexOf("Routine") == -1) {
        name += " Routine"

    }
    let timeText = st + " - " + et;
    const [showStats, setShowStats] = useState(false); // State to toggle stats visibility

    function calculateAverageCompletionTime(et, averageMinutesEarly) {
        // Split the end time into hours and minutes
        const [hours, minutes] = et.split(':').map(Number);
    
        // Convert end time to total minutes
        const totalEndMinutes = hours * 60 + minutes;
    
        // Subtract the average minutes completed early from the total end time minutes
        let averageCompletionTotalMinutes = totalEndMinutes - averageMinutesEarly;
    
        // Handle cases where subtraction results in negative minutes
        if (averageCompletionTotalMinutes < 0) {
            averageCompletionTotalMinutes += 24 * 60; // Add a day's worth of minutes
        }
    
        // Convert back to hours and minutes
        const averageCompletionHours = Math.floor(averageCompletionTotalMinutes / 60);
        const averageCompletionMinutes = averageCompletionTotalMinutes % 60;
    
        // Format the time back into "HH:mm" format
        return `${averageCompletionHours.toString().padStart(2, '0')}:${averageCompletionMinutes.toString().padStart(2, '0')}`;
    }
    const averageCompletionTime = calculateAverageCompletionTime(et, averageTime);
    const calculateMinutesEarly = (completionTimes, endTime) => {
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        const endTotalMinutes = endHours * 60 + endMinutes;

        return completionTimes.map(time => {
            const [hours, minutes] = time.split(':').map(Number);
            const totalMinutes = hours * 60 + minutes;
            return endTotalMinutes - totalMinutes; // Minutes finished early
        });
    };

    // Ensuring the array has 10 elements
    const minutesEarlyArray = calculateMinutesEarly(times, et);
    while (minutesEarlyArray.length < 10) {
        minutesEarlyArray.push(0);
    }
    let compl = averageCompletionTime
    if (averageCompletionTime.indexOf(".") != -1) {
        compl = averageCompletionTime.substring(0, averageCompletionTime.indexOf("."));
    }
    let android = Platform.OS === 'android';
    return (
    <View style = {{alignItems: "center"}}>
        <ImageBackground
            style={styles.background}
            source={require("../assets/StatBg.png")}
            imageStyle={styles.imageBackground} // Apply the borderRadius to the image background
        >
            <View  style={{alignItems: "center"}}>
                <BubbleText size = {moderateScaleFont(30)} color="#650000" text={name} />
            </View>
            <View style={styles.timeContainer}>
                <Image style={styles.image2} source={require("../assets/icons/Timer.png")} />
                <BubbleText color="#21BF73" size={scale(24)} text={timeText} />
            </View>
            <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => {setShowStats(!showStats), playSound('select')}}
                >
                    <FontAwesome
                        name={showStats ? "chevron-up" : "chevron-down"}
                        size={scale(24)}
                        color="black"
                    />
            </TouchableOpacity>
                      
        </ImageBackground>
        {showStats && (

        <View>
            <View style = {{alignItems: "center"}}>
                <View style={{marginBottom: verticalScale(20)}}>
                    <StatCard stat = "Total Times Completed" minutes = {timesCompleted} width = {70} icon = {require("../assets/icons/astronaut.png")}/>
                </View>
                <View style={{marginBottom: verticalScale(20)}}>
                    <StatCard stat = "Average Time Completed" minutes={compl} width = {70} icon = {require("../assets/icons/baby.png")}/>
                </View>
                <View style={{marginBottom: verticalScale(20)}}>
                    <StatCard stat = "Last Completion" minutes={lastCompleted} width = {100} icon = {require("../assets/icons/Monkey.png")}/>
                </View>
            </View>
                
                {!android && (
                <View style={{marginBottom: verticalScale(20), flexDirection: "row"}}>
                    <View style = {{left: scale(30), top: verticalScale(170)}}>
                        <Text style = {styles.yAxisLabel}>Minutes</Text>   
                    </View>  
                    <Graphs weeklyArray={minutesEarlyArray} title = "Last 10 Times" Yaxis={"Saved Minutes"} Xaxis={"Times Completed"}/>
                </View>

                )}
        </View>
        )}
    </View>
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
        marginBottom: verticalScale(20),
      },
      imageBackground: {
        // Set the borderRadius for the image itself
        borderRadius: scale(20), // This should match the borderRadius of the container
      },
      image2: {
        width: verticalScale(35),
        height: scale(35),
        resizeMode: "contain",
      },
      timeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: verticalScale(10),
        right: scale(5)
      },
      toggleButton: {
        position: 'absolute',
        right: scale(10),
        top: verticalScale(10),
    },
    toggleIcon: {
        width: scale(30),
        height: verticalScale(30),
    },
    yAxisLabel: {
        // Style for the Y-axis label "Minutes"
        color: '#650000', // Color of the text
        fontSize: moderateScaleFont(20), // Size of the font
        transform: [{ rotate: '-90deg' }], // Rotate the text to align vertically
        textAlign: 'center', // Center the text in the rotated view
      },
});

export default RoutineStat;