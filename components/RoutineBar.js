import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import Screen from "./Screen";
import { doc, deleteDoc, getFirestore } from "firebase/firestore";

import { MaterialCommunityIcons, Entypo, FontAwesome } from "@expo/vector-icons";
import colors from "../config/colors";
import { updateTimes } from "../firebase";
import AppButton from "./AppButton";

function RoutineBar({
  title,
  graphic,
  time,
  id,
  color = "primary",
  colTitle,
  colId,
}) {
  const handlePress = () => {
    Alert.alert("Delete", "Are you sure you want to delete this step?", [
      { text: "Yes", onPress: () => deleteTask() },
      { text: "No" },
    ]);
  };

  const deleteTask = async () => {
    const db = getFirestore();

    let path = colId + "/" + colTitle + "/" + id;
    const colRef = (getFirestore(), "routines");

    const docRef = doc(db, colRef, path);
    await deleteDoc(docRef);
  };

  const rearrangeUp = () => {
    console.log("Rearrange up");
  };

  const rearrangeDown = () => {
    console.log("Rearrange down");
  };

  return (
    <Screen>
      <View style={[styles.container, { backgroundColor: colors[color] }]}>
        <MaterialCommunityIcons name={graphic} size={80} color="gold" />
        <View style={styles.arrowContainer}>
          <TouchableOpacity onPress={rearrangeUp}>
            <FontAwesome name="arrow-up" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={rearrangeDown}>
            <FontAwesome name="arrow-down" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{title}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handlePress()}
          style={styles.deleteButton}
        >
          <Entypo name="circle-with-cross" size={35} color="red" />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100,
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
