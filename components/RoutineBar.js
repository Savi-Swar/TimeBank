import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import Screen from "./Screen";
import { doc, deleteDoc, getFirestore, collection } from "firebase/firestore";

import { MaterialCommunityIcons, Entypo, FontAwesome } from "@expo/vector-icons";
import colors from "../config/colors";
import { getRoutineLength, rearrangeRoutine } from "../firebase";
import AppButton from "./AppButton";
import * as firebase from "../firebase";
import { remove, getDatabase, ref, get, set } from "firebase/database";

function RoutineBar({
  title,
  graphic,
  time,
  id,
  color = "primary",
  colTitle,
  colId,
  im,
  routinesLength
  
}) {
  const handlePress = () => {
    Alert.alert("Delete", "Are you sure you want to delete this step?", [
      { text: "Yes", onPress: () => deleteTask() },
      { text: "No", onPress: () => console.log("Sch") },
    ]);
  };
  const deleteTask = async () => {
    const db = getDatabase();
    const userId = firebase.auth.currentUser.uid;
    const colRef = ref(db, `Users/${userId}/routines/${colId}/${colTitle}`);
  
    // Get the snapshot of the collection
    get(colRef).then((snapshot) => {
      const data = snapshot.val();
      const keys = Object.keys(data);
  
      // Loop through each step
      keys.forEach((key) => {
        const stepData = data[key];
  
        // If the indx of the step is greater than the indx of the deleted step, decrement it
        if (stepData.indx > im) {
          const stepRef = ref(db, `Users/${userId}/routines/${colId}/${colTitle}/${key}`);
          set(stepRef, {
            ...stepData,
            indx: stepData.indx - 1,
          });
        }
      });
  
      // Delete the step
      const docRef = ref(db, `Users/${userId}/routines/${colId}/${colTitle}/${id}`);
      remove(docRef).catch((error) => {
        console.error("Error deleting document: ", error);
      });
    });
  };
    
  
  const rearrangeUp = () => {
    if (im != 1) {
      rearrangeRoutine(colTitle, title, colId, id, im, true)
      console.log("Rearrange up");
    }
  };
  let x = getRoutineLength(colTitle, colId);
  const rearrangeDown = () => {
    if (x != im) {
    rearrangeRoutine(colTitle, title, colId, id, im, false)

    console.log("Rearrange down");
    } 
  };
  let barHeight = 560 / routinesLength;
  let fontSize = 25; // Original font size
  let iconSize = 80; // Original icon size

  if (barHeight > 100) {
    barHeight = 100;
  } else { // Adjust the sizes accordingly
    if (barHeight < 50) {
      barHeight = 50;
    }
    fontSize = fontSize * (barHeight / 100);
    iconSize = iconSize * (barHeight / 100);
  }
  return (
    <Screen>
      <View style={[styles.container, { backgroundColor: colors[color], height: barHeight }]}>
        <MaterialCommunityIcons name={graphic} size={iconSize} color="gold" />
        <View style={styles.arrowContainer}>
          <TouchableOpacity onPress={rearrangeUp}>
            <FontAwesome name="arrow-up" size={fontSize} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={rearrangeDown}>
            <FontAwesome name="arrow-down" size={fontSize} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.text, {fontSize: fontSize}]}>{title}</Text>
        </View>
        <TouchableOpacity
          onPress={() => 
            handlePress()}
          style={styles.deleteButton}
        >
          <Entypo name="circle-with-cross" size={fontSize} color="red" />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
    backgroundColor: colors.primary,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  arrowContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  text: {
    fontSize: 25,
  }, 
  deleteButton: {
    marginRight: 5,
  },
});

export default RoutineBar;
