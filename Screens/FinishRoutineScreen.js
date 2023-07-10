import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import AppButton from "../components/AppButton";
import Card from "../components/Card";
import { AntDesign } from "@expo/vector-icons";
import Minutes from "../components/Minutes";
import colors from "../config/colors";
import * as firebase from "../firebase";
import { getDownloadURL, ref, getStorage } from "firebase/storage";
import Logo from "../components/Logo";
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select'; // Import the Picker component
import AsyncStorage from '@react-native-async-storage/async-storage';

function FinishRoutineScreen({ navigation, route }) {
  const [finishedTime, setFinishedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedKid, setSelectedKid] = useState(""); // Store the selected kid
  const [holder, setHolder] = useState(""); // New holder state

  const [named, setName] = useState("def");
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
  const [minutes, setMinutes] = useState(0);

  const handleEndChange = (event, selectedDate) => {
    const currentDate = selectedDate || finishedTime;
    setFinishedTime(currentDate);
   
    // Parse the HH:MM time from route.params.st and route.params.obj
    const [startHours, startMinutes] = route.params.st.split(':').map(Number);
    const [endHours, endMinutes] = route.params.obj.split(':').map(Number);

    // Create Date objects for both times
    const startTime = new Date();
    startTime.setHours(startHours);
    startTime.setMinutes(startMinutes);

    const endTime = new Date();
    endTime.setHours(endHours);
    endTime.setMinutes(endMinutes);

    // Ensure that the chosen time is between the start time and end time
    if (currentDate < startTime || currentDate > endTime) {
      Alert.alert('Invalid Time', `Finish time must be between ${route.params.st} and ${route.params.obj}`);
      return;
    }

    // Calculate the difference in minutes
    const mins = Math.floor((endTime - currentDate) / (1000 * 60));
    setMinutes(mins);
  };
  const isAdult = route.params?.isAdult || false; // If isAdult is not passed or is undefined, it will default to false
  const [kids, setKids] = useState([])
  firebase.Kids(kids, setKids)
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Logo />
      </View>

      {isAdult && (
        <RNPickerSelect
          onValueChange={(value) => setSelectedKid(value)}
          items={kids.map((kid) => ({ label: kid.name, value: kid.name }))}
          placeholder={{ label: "Select a kid...", value: null }}
        />
      )}

      <View style={styles.minutes}>
        <AppButton style={styles.button2} onPress={() => setShowTimePicker(true)} title="Completed At: " />
        {showTimePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={finishedTime}
            mode={'time'}
            display="default"
            onChange={handleEndChange}
          />
        )}
      </View>

      <View style={styles.button}>
        <AppButton  
          color="secondary"
          title="Complete"
          onPress={() => {
            if (isAdult) {
              firebase.addMins(holder, minutes, selectedKid);
            } else {
              firebase.updateRequest(named, minutes, route.params.name);
            }
            firebase.finishRoutine(minutes, named, route.params.name, route.params.obj);
          }}
        />
      </View>

      <View style={styles.button}>
        <AppButton
          title="Back to Routines"

          onPress={() => { if (isAdult) {
            navigation.navigate("RoutinesScreen", { isAdult: true })
          } else {
            navigation.navigate("HomeFile")
          }}}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
  },
  button2: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
paddingHorizontal: 20, justifyContent:"center"  },
  text: { fontSize: 30, margin: 10 },
  subtitle: {
    fontSize: 20,
    margin: 10,
  },
  icons: {
    flexDirection: "row",
  },
  container: { top: 100 },
  name: {
    backgroundColor: colors.grey,
    borderRadius: 25,
    padding: 15,
    marginHorizontal: 15,
    margin: 20,
  },
  minutes: {
    justifyContent: "center",
    alignItems: 'center',
    width: "70%",
    left: 50,
    marginHorizontal: 15,
  },
});

export default FinishRoutineScreen;
