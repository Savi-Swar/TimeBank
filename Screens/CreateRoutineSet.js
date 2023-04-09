import React, { Component, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Alert,
  Keyboard,
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

function CreateRoutineSet({ navigation, route }) {
  const [nameInputValue, setNameInputValue] = useState("");

  const todoRef = firebase.firebase.firestore().collection("routines");
  let id = firebase.makeid(20);

  function addField() {
    const data = {
      title: nameInputValue,
      days: daysOfWeek,
      months: monthsOfYear,
    };

    todoRef
      .doc(id)
      .set(data)
      .then(() => {
        Keyboard.dismiss();
        setDaysOfWeek([]);
        setMonthsOfYear([]);
        setNameInputValue("");
      })
      .catch((error) => {
        alert(error);
      });
  }

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

  return (
    <Screen style = {styles.screen}>
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
            addField(), navigation.navigate("HomeFile");
          }}
        />
        <AppButton
          title="Back"
          onPress={() => {
            navigation.navigate("HomeFile");
          }}
        />
      </View>
    </Screen>
  );
}

export default CreateRoutineSet;

const styles = StyleSheet.create({
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

