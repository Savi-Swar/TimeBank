import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from "react-native";
import AppButton from "../components/AppButton";
import Card from "../components/Card";
import { AntDesign } from "@expo/vector-icons";
import Minutes from "../components/Minutes";
import colors from "../config/colors";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as firebase from "../firebase";
import { getDownloadURL, ref, getStorage } from "firebase/storage";
import Logo from "../components/Logo";
import DateTimePicker from '@react-native-community/datetimepicker';

function FinishRoutineScreen({ navigation, route }) {
  const [st, setST] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [named, setName] = useState("");
  const [cur, setCur] = useState("")
  firebase.retrieveUser(named, setName);
  const [minutes, setMinutes] = useState(0);
  const [tot, setTot] = useState(new Date());

  const onEndChange = (event, selectedDate) => {
    const currentDate = selectedDate || st;
    setST(currentDate);
    console.log(route.params.obj)
    // Parse the HH:MM time from route.params.obj
    const [routineHours, routineMinutes] = route.params.obj.split(':').map(Number);

    // Create Date objects for both times
    const routineTime = new Date();
    routineTime.setHours(routineHours);
    routineTime.setMinutes(routineMinutes);

    const currentTime = new Date(currentDate);

    // Calculate the difference in minutes
    let mins = Math.floor((routineTime - currentTime) / (1000 * 60));
    setCur(currentTime)
    setMinutes(mins);  // assuming you want to update the minutes state
  };
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Logo />
      </View>

      <View style={styles.minutes}>
        <AppButton style={styles.button2} onPress={() => setShowTimePicker(true)} title="Completed At: " />
        {showTimePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={st}
            mode={'time'}
            display="default"
            onChange={onEndChange}
          />
        )}
      </View>

      <View style={styles.button}>
        <AppButton  
          color="secondary"
          title="Complete"
          onPress={() => {
            firebase.addMins(tot, minutes, named);
            firebase.finishRoutine(minutes, named, route.params.name, route.params.obj);
          }
            }
        />
      </View>
      <View style={styles.button}>
        <AppButton
          title="Back to Routines"
          onPress={() => navigation.navigate("HomeFile")}
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
