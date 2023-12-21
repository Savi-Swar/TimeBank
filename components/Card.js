import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, Alert, Dimensions } from "react-native";
import colors from "../config/colors";
import * as firebase from "../firebase";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { getFirestore, collection, getDoc, deleteDoc, doc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as db from "firebase/database";
import { getDownloadURL, ref, getStorage, deleteObject } from "firebase/storage";

function Card({ title, subTitle, image, id, location, kid, due, isAdult, length }) {
  // for deleting tasks

  const defaultImageUrl = "Screenshot 2023-07-30 at 2.48.00 PM.png";

  const handlePress = () => {
    Alert.alert("Delete", "Are you sure you want to delete this", [
      { text: "Yes", onPress: () => deleteTask() },
      { text: "No" },
    ]);
  };

  const [url, setUrl] = useState();
  let link = "/" + image;
  useEffect(() => {
    const func = async () => {
      const storage = getStorage();
      const reference = ref(storage, link);
      await getDownloadURL(reference).then(x => {
        setUrl(x);
      });
    };
    func();
  }, []);
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
  const [minutes, setMinutes] = useState(0);
  const [named, setName] = useState("def");
  // let minutes;

  const getData = async () => {
    try {
        const value = await AsyncStorage.getItem('@active_kid')
        if(value !== null) {
            // value previously stored
            setName(value)
        }
    } catch(e) {
        // error reading value
    }
}
  useEffect(() => {  
    getData()
    // console.log(name)
  }, []);
  firebase.Mins(minutes, setMinutes, named);
  let black = (minutes < parseInt(subTitle) && location == "store" && (!isAdult || isAdult == undefined))
  const {width, height} = Dimensions.get('window');
  const maxCardsPerScreen = 6; // Limit the number of cards per screen
  const minCardsPerScreen = 2;
  let adjustedLength = length > maxCardsPerScreen ? maxCardsPerScreen : length;
  adjustedLength = length < minCardsPerScreen ? minCardsPerScreen : adjustedLength;
  const cardWidth = width - 50; // Fill the screen width
  let max = 250
  if (isAdult) {
    max = 310
  }
  const cardHeight = (height - max - adjustedLength*20)/adjustedLength; // Adjust height based on card count

  return (
    <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
      <View style={styles.imageContainer}>
        { black == true ?
          (<>
            <Image source={{uri: url}} style={{ tintColor: 'gray', width: '100%', height: '100%' }} />
            <Image source={{uri: url}} style={{ position: 'absolute', opacity: 0.3, width: '100%', height: '100%'}} /> 
          </>) :
          (<Image source={{uri: url}} style={styles.image} /> )
        }
        {(location!="assignments" || kid) && (
          <View style={styles.deleteButton}>
            <TouchableOpacity onPress={() => handlePress()}>
              <Entypo name="circle-with-cross" size={35} color="red" />
            </TouchableOpacity>
          </View>
        )}
        {black == true && 
          <View style={styles.lockIcon}>
            <Entypo name="lock" size={50} color="black" />
          </View>
        }
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>{subTitle} minutes</Text>
        {location === "assignments" && (
          <>
            {kid ? ( <Text style={styles.subtitle}>{kid}, Due: {due}</Text> ) : (
              <Text style={styles.subtitle}>Due: {due}</Text> 
            )}
          </>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    borderColor: colors.dark,
    borderWidth: 1,
  },
  imageContainer: {
    flex: 1, // Takes half the card
    position: 'relative'
  },
  detailsContainer: {
    flex: 1, // Takes the other half of the card
    padding: 20,
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  lockIcon: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: '50%',
    top: '50%',
    transform: [{translateX: -25}, {translateY: -25}]
  },
  title: {
    marginBottom: 7,
  },
  subtitle: {
    color: colors.primary,
    fontWeight: "bold",
  },
});

export default Card;