import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as firebase from "../firebase";
import { getDownloadURL, ref, getStorage, deleteObject } from "firebase/storage";
import CustomButton from "./CustomButton";
import MediumButton from "./MediumButton";
import BubbleText from "./BubbleText";
import Ticker from "./Ticker";
import { playSound } from "../audio";
import { scale, verticalScale, moderateScaleFont } from "../scaling";
import CustomSwitch from './CustomSwitch'; // import the custom switch component


function RoutineHeader({ isAdult, image, title, days, startTime,months, endTime, id, navigation}) {
    // const [loaded] = useFonts({
    //     BubbleBobble: require("../assets/fonts/BubbleBobble.ttf"),
    // });
    // if (!loaded) {
    //     return null;
    // }
    const [url, setUrl] = useState();
    useEffect(() => {
        const fetchImageUrl = async () => {
            const storage = getStorage();
            const reference = ref(storage, image);
            await getDownloadURL(reference).then(url => {
                setUrl(url);
            });
        };
        fetchImageUrl();
    }, [image]);

    const handlePress = () => {
        const storage = getStorage();
        const desertRef = ref(storage, image);
        
        // Delete the file
        deleteObject(desertRef).then(() => {
            console.log("DELETED IMAGE")
        }).catch(error => {
            console.log(error);
        });
        
    };

    // if (title.length > 22) {
    //     title = title.substring(0,22) + "..."
    // }
    const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const theMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let dayOfWeek = week[new Date().getDay()];
    let curMonth = theMonths[new Date().getMonth()];
    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();
    const currentTime = currentHour * 60 + currentMinutes;
    const [isActiveForToday, setIsActiveForToday] = useState(false); // new state for managing "active for today" status

    const [startTimeHour, startTimeMinutes] = startTime.split(':').map(Number);
    const routineStartTime = startTimeHour * 60 + startTimeMinutes;
    
    const [endTimeHour, endTimeMinutes] = endTime.split(':').map(Number);
    const routineEndTime = endTimeHour * 60 + endTimeMinutes;
    const [isSwitchOn, setIsSwitchOn] = useState(isActiveForToday);
    const [activeNow, setActiveNow] = useState(false);
    useEffect(() => {
        // Calculate if the routine is active today and now
        const isActiveToday = days.includes(dayOfWeek) && months.includes(curMonth);
        const isActiveNow = isActiveToday && currentTime >= routineStartTime && currentTime <= routineEndTime;
        setIsSwitchOn(isActiveToday);
        setActiveNow(isActiveNow);
        setIsActiveForToday(isActiveToday); // set the initial value based on routine's schedule
    }, [days, months, startTime, endTime]); //
    // Set ticker text and color
    let tickerText, tickerColor;
    if (activeNow && isActiveForToday) {
      tickerText = "ACTIVE";
      tickerColor = "#21BF73";
    } else if (isActiveForToday) {
      tickerText = "ACTIVE TODAY";
      tickerColor = "#198cb8"
    } else {
      tickerText = "NOT TODAY";
      tickerColor = "#fe669f";
    }
    const handleSwitch = (value) => {
        playSound('alert')
        if (value) {
            Alert.alert("Activate Today", "Do you want to activate this routine today?", [
                { 
                    text: "Yes", 
                    onPress: () => {
                        playSound("select")
                        setIsActiveForToday(true);
                        if (currentTime >= routineStartTime && currentTime <= routineEndTime) {    
                            setActiveNow(true);
                        }
                        setIsSwitchOn(true);
                    }
                },
                { 
                    text: "No", 
                    onPress: () => {setIsSwitchOn(false), playSound("minimise")}
                }
            ]);
        } else {
            Alert.alert("Deactivate Today", "Do you want to deactivate this routine today?", [
                { 
                    text: "Yes", 
                    onPress: () => {
                        setIsSwitchOn(false);
                        playSound("select")
                        setIsActiveForToday(false);
                    }
                },
                { 
                    text: "No", 
                    onPress: () => {setIsSwitchOn(true), playSound("minimise")}
                }
            ]);
        }
    };
    
    title = title.replace(/-/g, " ");
    let r= Math.min(scale(1), verticalScale(1))
    let x = 121*r;
    let multiplier = 1;
    // if the phone is an android
    if (Platform.OS === 'android') {
        multiplier = 1.5;
    }
    return (

        <View style={[styles.card, {height: x}]}>
            <View style = {[styles.miniCard, {height: 95*r}]}>
                <View style = {{position: "absolute", left: 120*r, bottom: 25*r}}>
                    <View style = {{top: verticalScale(20), flexDirection: "row", right: scale(32)}}>
                    <CustomSwitch
                        value={isSwitchOn}
                        onValueChange={handleSwitch}
                    />                
                    <View style={{ left: scale(8)}}>
                            <Ticker text={tickerText} color={tickerColor} />
                        </View>
                        
                    </View>

                    <View style={{ top: r*(23), right: r* (30) }}>
                        <Text style={styles.name}>{title}</Text>
                    
                    </View>
                </View>
            </View>
            <Image source={{uri: url}} style={[styles.image, {height: x, width: x, borderRadius: x/2}]} />
            <TouchableOpacity style={styles.detailsButton} onPress={() => {navigation.navigate("RoutineSteps", {
                id: id,
                title: title,
                startTime: startTime,
                endTime: endTime,
                url: url,
                isAdult: isAdult,
                isActive: isActiveForToday && activeNow
            }), playSound('transition')}}>
                        <BubbleText text={"View Details ->"} color={"#21BF73"} size={moderateScaleFont(18)} />
            </TouchableOpacity>
            {isAdult && (
            <TouchableOpacity style={styles.pos} onPress={handlePress}>
                        <Image source={require("../assets/icons/x.png")} style={styles.x} />
                </TouchableOpacity>
            )
            }
            
        </View>
    );
    //change the fonts here gotta download new ones too
}

const styles = StyleSheet.create({
    miniCard: {
        borderRadius: scale(20),
        width: scale(310),
        position: 'relative',
        shadowColor: "#0000001A",
        shadowOffset: {
            width: 0,
            height: verticalScale(20),
        },
        shadowOpacity: 0.5,
        shadowRadius: scale(10),
        elevation: scale(5), // for Android
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // it's good to set a background color for better shadow visibility
        right: scale(10),
        bottom: verticalScale(20)
        

    },
    detailsButton: {
        position: "absolute",
        bottom: verticalScale(5),   // Adjust this value to move the label closer to the bottom edge
        right: scale(100),    // Adjust this value to move the label closer to the right edge
        // Add any other necessary styles
    },
    timer: {
        width: scale(30),
        height: verticalScale(30),
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: scale(20),
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(10),
        width: scale(310),
        backgroundColor: '#FFFFFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.25,
        shadowRadius: scale(3.84),
        elevation: scale(5),
        top: verticalScale(10),
        left: scale(60),
        marginBottom: verticalScale(20)
        // Remove fixed width to allow for responsive design
    },
    image: {
        
        borderWidth: scale(4),
        borderColor: "#fbcb04",
        right: scale(365)
        // Remove right and bottom, use margin if needed
    },
    contentContainer: {
        flex: 1, // Take up remaining space
        paddingLeft: scale(10), // Add padding between image and text
        // Adjust other styles as necessary

    },
    name: {
        flex: 1,
        fontSize: moderateScaleFont(24),
        color: "#A74A29",
        // You'll need to link the 'Bubble Bobble' font for this to work
        fontFamily: 'BubbleBobble',
    },
    minutesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        bottom: verticalScale(10),
        right: scale(10)
        
    },
    minutes: {
        marginLeft: scale(5),
        color: "#2bc37a",
        // You'll need to link the 'Bubble Bobble' font for this to work
        fontFamily: 'BubbleBobble',
        fontSize: moderateScaleFont(18),
        

    },
    x: {
        width: scale(40),
        height: verticalScale(40),
    },
    pos: {
        position: "absolute",
        left: scale(275), // Adjust this value to move the button closer to the right edge
        bottom: verticalScale(90),   // Adjust this value to move the button closer to the top edge
    },
    
});

export default RoutineHeader;
