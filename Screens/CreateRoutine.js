import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Text, Alert, Keyboard } from "react-native";
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
  const [nameInputValue, setNameInputValue] = useState("");
  const userId = firebase.auth.currentUser.uid;

  let path = userId +  "/storage/routines/" + route.params.id + "/" + route.params.name;
  const todoRef = firebase.firebase.firestore().collection(path);
  let id = firebase.makeid(20);
  let x = firebase.getRoutineLength(route.params.name, route.params.id);
  x+=1;
  
  const isAdult = route.params?.isAdult || false; // If isAdult is not passed or is undefined, it will default to false
  const navigateWithIsAdult = (screen, params = {}) => {
    if (isAdult) {
      navigation.navigate(screen, { ...params, isAdult: true });
    } else {
      navigation.navigate(screen, params);
    }
  }

  function addField() {
    if (nameInputValue && nameInputValue.length > 0) {
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
          navigateWithIsAdult("RoutinesScreen");
        })
        .catch(error => {
          alert(error);
        });
    } 
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

const styles = StyleSheet.create({
  container: { top: 100 },
  name: {
    backgroundColor: colors.grey,
    borderRadius: 25,
    padding: 15,
    marginHorizontal: 15,
    margin: 20,
  },
  buttons: {
    alignItems: "center",
    margin: 20,
  },
});

export default CreateRoutine;
