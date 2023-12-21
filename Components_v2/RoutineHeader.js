import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as firebase from "../firebase";
import { getDownloadURL, ref, getStorage, deleteObject } from "firebase/storage";
import { Switch } from "react-native-gesture-handler";
import CustomButton from "./CustomButton";
import MediumButton from "./MediumButton";
import BubbleText from "./BubbleText";
import Ticker from "./Ticker";

function RoutineHeader({ image, title, minutes, days, startTime,months, endTime, id, isAdult = true}) {
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
        
        console.log("Deleted"); // Or perform any other action after deleting.
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

    useEffect(() => {
        // Calculate if the routine is active today and now
        const isActiveToday = days.includes(dayOfWeek) && months.includes(curMonth);
        const isActiveNow = isActiveToday && currentTime >= routineStartTime && currentTime <= routineEndTime;
        setIsSwitchOn(isActiveNow);
        setIsActiveForToday(isActiveToday); // set the initial value based on routine's schedule
    }, [days, months, startTime, endTime]); //

    // Set ticker text and color
    let tickerText, tickerColor;
    if (isSwitchOn && isActiveForToday) {
      tickerText = "ACTIVE";
      tickerColor = "#21BF73";
    } else if (isActiveForToday) {
      tickerText = "ACTIVE TODAY";
      tickerColor = "cyan";
    } else {
      tickerText = "NOT TODAY";
      tickerColor = "#fe669f";
    }
    const handleSwitch = (value) => {
        if (value) {
            Alert.alert("Activate Today", "Do you want to activate this routine today?", [
                { 
                    text: "Yes", 
                    onPress: () => {
                        console.log("Activated");
                        setIsSwitchOn(true); 
                        setIsActiveForToday(true);
                    }
                },
                { 
                    text: "No", 
                    onPress: () => setIsSwitchOn(false)
                }
            ]);
        } else {
            Alert.alert("Deactivate Today", "Do you want to deactivate this routine today?", [
                { 
                    text: "Yes", 
                    onPress: () => {
                        console.log("Deactivated");
                        setIsSwitchOn(false);
                        setIsActiveForToday(false);
                    }
                },
                { 
                    text: "No", 
                    onPress: () => setIsSwitchOn(true)
                }
            ]);
        }
    };
    
    title = title.replace(/-/g, " ");
    return (

        <View style={styles.card}>
            <View style = {styles.miniCard}>
                <View style = {{top: 20, right: 10, flexDirection: "row"}}>
                        <Switch style={styles.switch} value={isSwitchOn} onValueChange={handleSwitch} />
                    <View style={{ left: 10}}>
                        <Ticker text={tickerText} color={tickerColor} />
                    </View>
                    
                </View>

                <View style={{ top: 25, right: 30 }}>
                    <Text style={styles.name}>{title}</Text>
                
                </View>
                
            </View>
            <Image source={{uri: url}} style={styles.image} />
            <TouchableOpacity style={styles.detailsButton} onPress={() => console.log("Nubboo")}>
                        <BubbleText text={"View Details ->"} color={"#21BF73"} size={18} />
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
        borderRadius: 20,
        width: 310,
        position: 'relative',
        shadowColor: "#0000001A",
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5, // for Android
        alignItems: 'center',
        height: 95,
        backgroundColor: '#FFFFFF', // it's good to set a background color for better shadow visibility
        right: 10,
        bottom: 20
        

    },
    detailsButton: {
        position: "absolute",
        bottom: 10,   // Adjust this value to move the label closer to the bottom edge
        right: 100,    // Adjust this value to move the label closer to the right edge
        // Add any other necessary styles
    },
    timer: {
        width: 30,
        height: 30,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
        width: 310,
        height: 121,
        backgroundColor: '#FFFFFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        top: 10,
        left: 60
        // Remove fixed width to allow for responsive design
    },
    image: {
        width: 121,
        height: 121,
        borderRadius: 60, // This will create a circle
        borderWidth: 4,
        borderColor: "#fbcb04",
        right:375
        // Remove right and bottom, use margin if needed
    },
    contentContainer: {
        flex: 1, // Take up remaining space
        paddingLeft: 10, // Add padding between image and text
        // Adjust other styles as necessary

    },
    name: {
        flex: 1,
        fontSize: 24,
        color: "#A74A29",
        // You'll need to link the 'Bubble Bobble' font for this to work
        fontFamily: 'BubbleBobble',
    },
    minutesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 10,
        right: 10
        
    },
    minutes: {
        marginLeft: 5,
        color: "#2bc37a",
        // You'll need to link the 'Bubble Bobble' font for this to work
        fontFamily: 'BubbleBobble',
        fontSize: 18,
        

    },
    x: {
        width: 40,
        height: 40,
    },
    pos: {
        position: "absolute",
        left: 275, // Adjust this value to move the button closer to the right edge
        bottom: 90,   // Adjust this value to move the button closer to the top edge
    },
    
});

export default RoutineHeader;
