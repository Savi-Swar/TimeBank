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

function CreateRoutine({ navigation, route }) {
  // This screen is actualy for creating steps in a ROUTINE 
  // I had to make two useState variables so I could use both of them on this screen
  const [nameInputValue, setNameInputValue] = useState("");
  // console.log(route.params.name);
  // console.log(route.params.identification);
  const userId = firebase.auth.currentUser.uid;

  let path = userId +  "/storage/routines/" + route.params.id + "/" + route.params.name;
  const todoRef = firebase.firebase.firestore().collection(path);
  let id = firebase.makeid(20);
  let x = firebase.getRoutineLength(route.params.name, route.params.id);
  // add a new field
  x+=1;
  function addField() {
    if (
      // timeInputValue &&
      // timeInputValue.length > 0 &&
      // validateTimeInput(timeInputValue) && // Call validateTimeInput here
      nameInputValue &&
      nameInputValue.length > 0
    ) {
      const data = {
     
        title: nameInputValue,
        indx: x
      };
  
      todoRef
        .doc(id)
        .set(data)
        .then(() => {
          setNameInputValue("");
          Keyboard.dismiss();
          console.log("Yo");
          nav();
        })
        .catch(error => {
          alert(error);
        });
    } 
  }
  // function validateTimeInput(inputValue) {
  //   // Check if the input is empty
  //   if (inputValue.length === 0) {
  //     return false;
  //   }
  
  //   // Check if the input is in the correct format
  //   const timeRegex = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
  //   if (!timeRegex.test(inputValue)) {
  //     return false;
  //   }
  
  //   // Split the input into hours and minutes
  //   const [hours, minutes] = inputValue.split(':');
  
  //   // Check if the hours and minutes are valid
  //   if (Number(hours) > 23 || Number(minutes) > 59) {
  //     return false;
  //   }
  
  //   // Return true if the input is valid
  //   return true;
  // }
  

  
  function nav() {
    navigation.navigate("RoutineViewScreen", {
      title: route.params.name,
      id: route.params.id,
    })
  } 
  
  return (
    <Screen>
      <View style={styles.container}>
        <Logo />
      </View>
      <View style={styles.name}>
        <TextInput
          onChangeText={text => setNameInputValue(text)}
          value={nameInputValue}
          placeholder="name"
        />
      </View>
      {/* <View style={styles.minutes}>
        <TextInput
          onChangeText={text => setTimeInputValue(text)}
          value={timeInputValue}
          placeholder="time (enter in HH:MM) "
        />
      </View> */}
      <View style={styles.buttons}>
        <AppButton
          title="Create"
          onPress={() => 
            addField()
          }
        />
      </View>
    </Screen>
  );
}

//similarly I had to create multiple stylesheets to format

const styles = StyleSheet.create({
  container: { top: 100 },
  name: {
    backgroundColor: colors.grey,
    borderRadius: 25,
    padding: 15,
    marginHorizontal: 15,
    margin: 20,
  },
  minutes: {
    backgroundColor: colors.grey,
    borderRadius: 25,
    padding: 15,
    marginHorizontal: 15,
  },
  buttons: {
    alignItems: "center",
    margin: 20,
  },
});

export default CreateRoutine;
