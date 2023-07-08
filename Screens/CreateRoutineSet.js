import React, { Component, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Alert,
  Keyboard,
  Button
} from "react-native";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import Logo from "../components/Logo";
import Screen from "../components/Screen";
import colors from "../config/colors";
import TasksScreen from "./TasksScreen";
import StoreScreen from "./StoreScreen";
import ImagePickerExample from "../components/ImagePicker";
import * as firebase from "../firebase";
import { uploadBytes } from "firebase/storage";
import LottieView from "lottie-react-native";
import RoutineViewScreen from "./RoutineViewScreen";
import MultiSelectDropdown from "../components/MultiSelectDropdown.js";
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from "react-native-gesture-handler";

function CreateRoutineSet({ navigation, route }) {
  const [nameInputValue, setNameInputValue] = useState("");
  const [triggerEffect, setTriggerEffect] = useState(false);
  const userId = firebase.auth.currentUser.uid;

  const todoRef = firebase.firebase.firestore().collection(userId + "/storage/routines");
  let id = firebase.makeid(20);
  const [st, setST] = useState(new Date());
  const [et, setET] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  const onStartTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || st;
    setST(currentDate);
  };
  
  const onEndTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || et;
    setET(currentDate);
  };

  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [monthsOfYear, setMonthsOfYear] = useState([]);

  const daysOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const monthsOptions = [
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

  function addField() {
    const data = {
      title: nameInputValue,
      days: daysOfWeek,
      months: monthsOfYear,
      startTime: st.toString().substring(16,21),
      endTime: et.toString().substring(16,21),
    };

    todoRef
      .doc(id)
      .set(data)
      .then(() => {
        Keyboard.dismiss();
        firebase.kidsRoutine(nameInputValue);

        setDaysOfWeek([]);
        setMonthsOfYear([]);
      })
      .catch((error) => {
        alert(error);
      });
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView>
        <View style={styles.container}>
          <Logo />
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 14, paddingBottom: 10, alignItems: 'center'}}>Enter routine name and active days/months</Text>
        </View>
        <View style={styles.name}>
          <TextInput
            onChangeText={(text) => setNameInputValue(text)}
            value={nameInputValue}
            placeholder="name"
          />
        </View>

        <View style={styles.times}>
          <AppButton style={styles.button} onPress={() => setShowStartPicker(true)} title="Start Time" />
          {showStartPicker && (
            <DateTimePicker
              testID="startTimePicker"
              value={st}
              mode="time"
              display="default"
              onChange={onStartTimeChange}
            />
          )}

          <AppButton onPress={() => setShowEndPicker(true)} title="End Time" />
          {showEndPicker && (
            <DateTimePicker
              testID="endTimePicker"
              value={et}
              mode="time"
              display="default"
              onChange={onEndTimeChange}
            />
          )}
        </View>

        <View style={styles.title}>
          <Text style={styles.text}>Days of Week</Text>
          <MultiSelectDropdown
            options={daysOptions}
            onSelection={setDaysOfWeek}
          />
          <Text style={styles.text}>Months of Year</Text>
          <MultiSelectDropdown
            options={monthsOptions}
            onSelection={setMonthsOfYear}
          />
        </View>

        <View style={styles.buttons}>
         <AppButton
            title="Create"
            onPress={() => {
              addField();
              setTriggerEffect(true); // setting triggerEffect to true when the button is pressed
              // if (route.params?.isAdult === true) {
              //   navigation.navigate("RoutinesScreen", { isAdult: true });
              // } else {
                navigation.navigate("HomeFile");
           
            }}
          />
          <AppButton
            title="Back"
            onPress={() => {
              if (route.params?.isAdult === true) {
                navigation.navigate("RoutinesScreen", { isAdult: true });
              } else {
                navigation.navigate("HomeFile");
              }
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

export default CreateRoutineSet;

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  times: {
    justifyContent: "center",
    alignItems: 'center',
    width: "70%",
    left: 50,
    marginHorizontal: 15,
  },
  screen: {
    backgroundColor: colors.light
  },
  container: { top: 100 },
  name: {
    backgroundColor: colors.grey,
    borderRadius: 25,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  minutes: {
    backgroundColor: colors.grey,
    borderRadius: 25,
    padding: 15,
    marginHorizontal: 15,
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 10,
  },
  buttons: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  imagePicker: {
    marginBottom: 20,
  },
});
