import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { getDownloadURL, ref, getStorage, deleteObject } from "firebase/storage";
import BubbleText from "./BubbleText";
import { playSound } from "../audio";
import { scale, verticalScale, moderateScaleFont } from "../scaling";
import { AntDesign } from '@expo/vector-icons'; 

function HomeViewer({ navigation, image, name, profilePic, minutes }) {
    const [url, setUrl] = useState();
    // if theres no url, set url to default image
    const defaultImageUrl = "GuZ6IdnQPdkKaRn.jpg"; // if the user doesnt set a photo
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
    }, [profilePic]);

    

   
    let r = Math.min(scale(135), verticalScale(135))
    return (

        <View style={[styles.card, {height:r}]}>
            
            <View style = {styles.miniCard}>
                
                <View style={{ top: verticalScale(45), left: scale(10) }}>
                    <Text style={styles.name}>{name}</Text>
                
                </View>
                
            </View>
            <Image source={{uri: url}} style={[styles.image, {width: r, height: r}]} />
            
        </View>
    );
    //change the fonts here gotta download new ones too
}
const styles = StyleSheet.create({
    miniCard: {
        borderRadius: scale(20),
        width: scale(310),
        position: 'relative',
        shadowColor: "#FFFFFF",
        shadowOffset: {
            width: 0,
            height: verticalScale(20),
        },
        shadowOpacity: 0.5,
        shadowRadius: scale(10),
        elevation: scale(5), // for Android
        alignItems: 'center',
        height: verticalScale(90),
        backgroundColor: '#FFFFFF', // it's good to set a background color for better shadow visibility
        right: scale(10),
        bottom: verticalScale(20)
        

    },
    detailsButton: {
        position: "absolute",
        bottom: verticalScale(10),   // Adjust this value to move the label closer to the bottom edge
        right: scale(90), 
        fontSize: moderateScaleFont(22)   // Adjust this value to move the label closer to the right edge
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
        elevation: 5,
        top: verticalScale(10),
        left: scale(60)
        // Remove fixed width to allow for responsive design
    },
    image: {
        borderRadius: scale(80), // This will create a circle
        borderWidth: scale(4),
        borderColor: "#fbcb04",
        right: scale(365),

        // Remove right and bottom, use margin if needed
    },
    contentContainer: {
        flex: 1, // Take up remaining space
        paddingLeft: scale(10), // Add padding between image and text
        // Adjust other styles as necessary

    },
    name: {
        flex: 1,
        fontSize: moderateScaleFont(30),
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
        bottom: verticalScale(105),   // Adjust this value to move the button closer to the top edge
    },
    
});

export default HomeViewer;
