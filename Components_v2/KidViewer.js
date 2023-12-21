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
import { set } from "firebase/database";
import { NavigationContainer } from "@react-navigation/native";

function KidsViewer({ navigation, image, name, profilePic, weekly, spent, earned, minutes }) {
    // const [loaded] = useFonts({
    //     BubbleBobble: require("../assets/fonts/BubbleBobble.ttf"),
    // });
    // if (!loaded) {
    //     return null;
    // }
    const [url, setUrl] = useState();
    // if theres no url, set url to default image
    const defaultImageUrl = "4fjVI8Z0e4ntlHx.jpg"; // if the user doesnt set a photo
    if (!profilePic) { 
        profilePic = defaultImageUrl;
    }
    useEffect(() => {
        const fetchImageUrl = async () => {
            const storage = getStorage();
            const reference = ref(storage, profilePic);
            await getDownloadURL(reference).then(url => {
                setUrl(url);
            });
        };
        fetchImageUrl();
    }, [image]);

    

    // if (title.length > 22) {
    //     title = title.substring(0,22) + "..."
    // }

    return (

        <View style={styles.card}>
            <View style = {styles.miniCard}>
                <View style={{ top: 30, left: 10 }}>
                    <Text style={styles.name}>{name}</Text>
                
                </View>
                
            </View>
            <Image source={{uri: url}} style={styles.image} />
            <TouchableOpacity style={styles.detailsButton} onPress={() => navigation.navigate("StatsScreen",
            {
                name: name,
                weekly: weekly,
                spent: spent,
                earned: earned,
                minutes: minutes
            }
            )}>
                        <BubbleText text={"View Stats ->"} color={"#21BF73"} size={19} />
            </TouchableOpacity>
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
        height: 90,
        backgroundColor: '#FFFFFF', // it's good to set a background color for better shadow visibility
        right: 10,
        bottom: 20
        

    },
    detailsButton: {
        position: "absolute",
        bottom: 10,   // Adjust this value to move the label closer to the bottom edge
        right: 90, 
        fontSize: 22   // Adjust this value to move the label closer to the right edge
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
        height: 135,
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
        width: 135,
        height: 135,
        borderRadius: 80, // This will create a circle
        borderWidth: 4,
        borderColor: "#fbcb04",
        right:365,

        // Remove right and bottom, use margin if needed
    },
    contentContainer: {
        flex: 1, // Take up remaining space
        paddingLeft: 10, // Add padding between image and text
        // Adjust other styles as necessary

    },
    name: {
        flex: 1,
        fontSize: 30,
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
        bottom: 105,   // Adjust this value to move the button closer to the top edge
    },
    
});

export default KidsViewer;
