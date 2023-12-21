import { NavigationContainer, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert, Switch } from "react-native";
import colors from "../config/colors";
import { retrieveDays } from "../firebase";
import AppButton from "./AppButton";
import Screen from "./Screen";
import { Entypo } from "@expo/vector-icons";
import { getFirestore, doc, deleteDoc, collection } from "firebase/firestore";
import * as firebase from "../firebase";
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Routine_Header({ title, id, st, et, days, months, isAdult = "false" }) {
  const navigation = useNavigation();
  const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const theMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let dayOfWeek = week[new Date().getDay()];
  let curMonth = theMonths[new Date().getMonth()];
  const currentHour = new Date().getHours();
  const currentMinutes = new Date().getMinutes();
  const currentTime = currentHour * 60 + currentMinutes;

  const [startTimeHour, startTimeMinutes] = st.split(':').map(Number);
  const startTime = startTimeHour * 60 + startTimeMinutes;
  
  const [endTimeHour, endTimeMinutes] = et.split(':').map(Number);
  const endTime = endTimeHour * 60 + endTimeMinutes;
  const [isActiveToday, setIsActiveToday] = useState(days.includes(dayOfWeek) && months.includes(curMonth));
  const [isSwitchOn, setIsSwitchOn] = useState(isActiveToday);
  
  const handleSwitch = (value) => {
      setIsSwitchOn(value);
      setIsActiveToday(value);
      
      if (value) {
        Alert.alert("Activate Today", "Do you want to activate this routine today?", [
          { text: "Yes", onPress: () => console.log("Activated") },
          { text: "No", onPress: () => {
            setIsSwitchOn(false); 
            setIsActiveToday(false);
          }}
        ]);
      } else {
        Alert.alert("Deactivate Today", "Do you want to deactivate this routine today?", [
          { text: "Yes", onPress: () => {
            console.log("Deactivated");
            setIsActiveToday(false);
          }},
          { text: "No", onPress: () => {
            setIsSwitchOn(true);
            setIsActiveToday(true);
          }}
        ]);
      }
    };
  
  const isActiveNow = isActiveToday && currentTime >= startTime && currentTime <= endTime;
  

  let circleColor, statusText;
  if (isActiveNow) {
    circleColor = 'green';
    statusText = 'Active';
  } else if (isActiveToday) {
    circleColor = 'cyan';
    statusText = 'Active Today';
  } else {
    circleColor = 'red';
    statusText = 'Not Today';
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
      <View style={styles.topRow}>
        {isAdult && <Switch style={styles.switch} value={isSwitchOn} onValueChange={handleSwitch} />}
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons name="circle" size={24} color={circleColor} />
          <Text>{statusText}</Text>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.text}>{title}</Text>
        </View>
        <TouchableOpacity onPress={handlePress}>
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
                isAdult: isAdult,
                isActive: isActiveNow
              })
            }
          />
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switch: {
    margin: 5,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5
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
