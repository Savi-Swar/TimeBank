import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as firebase from "../firebase";
import { getDownloadURL, ref, getStorage, deleteObject } from "firebase/storage";
import * as db from "firebase/database";

function Card({ image, id, title, minutes, location = "store", kids = [], due, isAdult = true }) {
    const [loaded] = useFonts({
        BubbleBobble: require("../assets/fonts/BubbleBobble.ttf"),
    });
   
    let defaultImageUrl = "Screenshot 2023-07-30 at 2.48.00 PM.png"; // if the user doesnt set a photo

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
        Alert.alert("Delete", "Are you sure you want to delete this", [
          { text: "Yes", onPress: () => deleteTask() },
          { text: "No" },
        ]);
      };
    
      const deleteTask = async () => {
        const userId = firebase.auth.currentUser.uid;
      
        // Define the path to the task in the Realtime Database
        const taskRef = db.ref(db.getDatabase(), `Users/${userId}/${location}/${id}`);
      
        const storage = getStorage();
      
        // Create a reference to the file to delete
        const desertRef = ref(storage, image);
      
        // Delete the file
        if (image !== defaultImageUrl) {
          deleteObject(desertRef).then(() => {
            console.log("DELETED IMAGE")
          }).catch((error) => {
            console.log(error)
          });
        }
      
        // Delete the task
        await db.remove(taskRef);
      };

    if (!loaded) {
        return null;
    }
    if (title.length > 22) {
        title = title.substring(0,22) + "..."
    }
    let kidsString = "";
    for (let i = 0; i < kids.length; i++) { 
        kidsString += kids[i]
        if (i!= kids.length-1) {
         kidsString +=  ", "
        }
    }
    let offset = -1;
    if (due != undefined) {
        due = due.substring(5, 7) + "/" + due.substring(8, 10)
        offset = -10;
    }
    return (
        <View style={styles.card}>
            <Image source={{uri: url}} style={styles.image} />
            <View style={{ right: 20, top: 5 }}>
                <Text style={styles.name}>{title}</Text>
                <View style={styles.minutesContainer}>
                    <Image source={require("../assets/icons/Timer.png")} style={styles.timer} />
                    <View style ={{bottom: offset}}>
                    
                    <Text style={styles.minutes}>{minutes} minutes</Text>
                    {location === "assignments" && (
                    <>
                        {isAdult ? (
                        <Text style={styles.subtitle}>Kids: {kidsString}, Due: {due}</Text>
                        
                            ) :
                            (
                                <Text style={styles.subtitle}>Due: {due}</Text>
                            )
                            }
                    </>
                    )}
                    </View>
                </View>
            </View>
            {isAdult && (
            <TouchableOpacity style={styles.pos} onPress={handlePress}>
                <Image source={require("../assets/icons/x.png")} style={styles.x} />
            </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 350,
        height: 90,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
        position: 'relative',
        backgroundColor: '#FFFFFF', // it's good to set a background color for better shadow visibility
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // for Android
    },
    timer: {
        width: 30,
        height: 30,
        bottom: 4
    },
    image: {
        width: 98,
        height: 98,
        borderRadius: 49, // Half the width and height to create a circle
        right: 35,
        borderWidth: 4,
        borderColor: "#fbcb04"
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
        bottom: 5
        

    },
    x: {
        width: 40,
        height: 40,
    },
    pos: {
        position: "absolute",
        left: 315,
        bottom: 60
    },
    subtitle: {
        top: 2,
        right: 22,
        fontFamily: "BubbleBobble",

    }
});

export default Card;
