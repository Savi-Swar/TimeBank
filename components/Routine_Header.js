import { NavigationContainer, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import colors from "../config/colors";
import { retrieveDays } from "../firebase";
import AppButton from "./AppButton";
import Screen from "./Screen";
import { Entypo } from "@expo/vector-icons";
import { getFirestore, doc, deleteDoc, collection } from "firebase/firestore";
import * as firebase from "../firebase";
function Routine_Header({ title, id, st, et }) {
  const [days, setDays] = useState([]);
  const [months, setMonths] = useState([]);
  const navigation = useNavigation();
  retrieveDays(setDays, id, setMonths);
  var week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var theMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let dayOfWeek = week[new Date().getDay()];
  let curMonth = theMonths[new Date().getMonth()];
  let length = 3;
  if (days.indexOf(dayOfWeek) != -1 && months.indexOf(curMonth) != -1) {
    length = 0;
  }
  const deleteTask = async () => {
    const db = getFirestore();
    const userId = firebase.auth.currentUser.uid;
  
    // This is how you reference a document in a collection
    const docRef = doc(db, `${userId}/storage`);
    
    // And this is how you reference a subcollection in a document
    const colRef = collection(docRef, 'routines');
  
    // This is how you reference a specific document in a subcollection
    const specificDocRef = doc(colRef, id);
    firebase.deleteKidsRoutine(title)
    // Now, you can delete the specific document
    await deleteDoc(specificDocRef);
  };
  
  const handlePress = () => {
    Alert.alert("Delete", "Are you sure you want to delete this", [
      { text: "Yes", onPress: () => deleteTask() },
      { text: "No" },
    ]);
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.text}>{title}</Text>
      </View>
      <TouchableOpacity onPress={() => handlePress()}>
          <Entypo name="circle-with-cross" size={35} color="red" />
        </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <AppButton
          borderColor={colors.primary}
          title="view"
          onPress={() =>
            navigation.navigate("RoutineViewScreen", {
              title: title,
              id: id,
              st: st,
              et: et,
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.light,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  titleContainer: {
    flex: 1,
  },
  text: {
    fontSize: 30,
  },
  buttonContainer: {
    paddingLeft: 10,
  },
});

export default Routine_Header;
