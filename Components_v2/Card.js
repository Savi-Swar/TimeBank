import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { useFonts } from "expo-font";
import * as firebase from "../firebase";
import { getDownloadURL, ref, getStorage, deleteObject } from "firebase/storage";
import { playSound } from "../audio";
import { getDatabase, ref as dbRef, remove } from 'firebase/database';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';


function Card({ image, id, title, minutes, location = "store", kids = [], due, isAdult = true }) {
    const [loaded] = useFonts({
        BubbleBobble: require("../assets/fonts/BubbleBobble.ttf"),
    });
   
    let defaultImageUrl = "GuZ6IdnQPdkKaRn.jpg"

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
        playSound('alert'); // Play the click sound
        Alert.alert("Delete", "Are you sure you want to delete this", [
          { text: "Yes", onPress: () => {deleteTask(), playSound('pop')} },
          { text: "No", onPress : () => playSound('minimise') },
        ]);
      };
    
      const deleteTask = async () => {
        const userId = firebase.auth.currentUser.uid;
        const database = getDatabase();
        if (location === "assignments") {
          location = "assignment"
        }
        console.log(location)
        const taskRef = dbRef(database, `Users/${userId}/${location}/${id}`);
      
        // Only proceed with deleting the image if it's not the default image
        if (image !== defaultImageUrl && image !== "WaffleSundae.jpeg" && image !== "HappyMeal.jpeg"
        && image !== "Starbucks.webp" && image !== "Monopoly.jpeg" && image !== "table.jpeg"
        && image !== "Room.jpeg" && image !== "bed.jpeg") {
          const storage = getStorage();
      
          // Create a reference to the file to delete
          const desertRef = ref(storage, image);
      
          // Delete the file
          deleteObject(desertRef)
            .then(() => {
              console.log("DELETED IMAGE");
            })
            .catch((error) => {
              console.error("Error deleting image:", error);
            });
        }
      
        // Delete the task
        remove(taskRef)
          .then(() => {
            console.log("Task deleted successfully");
          })
          .catch((error) => {
            console.error("Error deleting task:", error);
          });
      };

    if (!loaded) {
        return null;
    }
    if (title.length > 22) {
        title = title.substring(0,22) + "..."
    }
    let kidsString = "";
    for (let i = 0; i < kids.length; i++) { 
        kidsString += kids[i].replace(/_/g, ' ');
        if (i!= kids.length-1) {
         kidsString +=  ", "
        }
    }
    let offset = -1;
    if (due != undefined) {
        due = due.substring(5, 7) + "/" + due.substring(8, 10)
        offset = -25;
    }
    let r = Math.min(scale(98), verticalScale(98))
    let top = 10;
    if (location === "assignments") {
      if(isAdult) {
        top = 4;
      } else {
        top = 8;
      }
    }
    let top2 = 0;
    if (location === "assignments") {
        top2 = -5;
    }
    if (kidsString.length > 30) {
        kidsString = kidsString.substring(0,30) + "..."
    } 
    return (
        <View style={[styles.card, {height: r}]}>
            <Image source={{uri: url}} style={[styles.image, {height: r, width: r}]} />
            <View style={{ right: scale(20), top: verticalScale(top2) }}>
                <Text style={styles.name}>{title}</Text>
                <View style={styles.minutesContainer}>
                  <View style = {{ top: verticalScale(top), flexDirection: "row"}}>
                    <Image source={require("../assets/icons/Timer.png")} style={styles.timer} />
                    <View style = {{right: scale(3), top: verticalScale(7)}}>
                      <Text style={styles.minutes}>{minutes} minutes</Text>
                    </View>
                  </View>
                  <View style ={{bottom: verticalScale(offset), right: scale(80)}}>
                    
                    
                    {location === "assignments" && (
                    <>
                        {isAdult ? (
                          <>
                        <Text style={styles.subtitle}>Kids: {kidsString}</Text>
                        <Text style={styles.subtitle}>Due: {due}</Text>
                        </>
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
    width: '95%', // Use the full width provided by the parent container
    flexDirection: 'row',
    alignItems: 'center',
    left: scale(10),
    borderRadius: scale(20),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
    position: 'relative',
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.25,
    shadowRadius: scale(3.84),
    elevation: scale(5), // for Android shadow
    marginVertical: verticalScale(15), // Add vertical margin for spacing between cards
    marginHorizontal: scale(10), // Add horizontal margin for spacing from screen edges
  },
  timer: {
    width: scale(30),
    height: verticalScale(30),
    bottom: verticalScale(4)
  },
  image: {

    borderRadius: scale(49), // Half the width and height to create a circle
    right: scale(35),
    borderWidth: scale(4),
    borderColor: "#fbcb04"
  },
  name: {
    fontSize: moderateScaleFont(24),
    color: "#A74A29",
    fontFamily: 'BubbleBobble',
  },
  minutesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: verticalScale(5),
    right: scale(10)
  },
  minutes: {
    marginLeft: scale(5),
    color: "#2bc37a",
    fontFamily: 'BubbleBobble',
    fontSize: moderateScaleFont(18),
    bottom: verticalScale(5)
  },
  x: {
    width: scale(40),
    height: verticalScale(40),
  },
  pos: {
    position: "absolute",
    left: scale(316.5),
    bottom: verticalScale(68)
  },
  subtitle: {
    top: verticalScale(2),
    right: scale(22),
    fontFamily: "BubbleBobble",
  }
});


export default Card;
