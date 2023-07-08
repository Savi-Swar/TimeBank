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
function CreateTask({ navigation, route }) {
  // I had to make two useState variables so I could use both of them on this screen
  const [nameInputValue, setNameInputValue] = useState("");
  const [minutesInputValue, setMinutesInputValue] = useState("");
  const [imageLink, setImageLink] = useState(null);
  const [url, setUrl] = useState("");
  const todoRef = firebase.firebase
    .firestore()
    .collection(route.params.location);
  let bytes;
  let id = firebase.makeid(20);

  function addField() {
    if (
      minutesInputValue &&
      minutesInputValue.length > 0 &&
      nameInputValue &&
      nameInputValue.length > 0
    ) {
      const data = {
        image: url,
        minutes: minutesInputValue,
        title: nameInputValue,
        id: id,
      };
  
      // Get the current user's ID
      const userId = firebase.auth.currentUser.uid;
  
      // Reference the user's 'tasks' sub-collection
      const tasksRef = firebase.firestores.collection(userId).doc('storage').collection(route.params.location);
  
      tasksRef
        .doc(id)
        .set(data)
        .then(() => {
          setNameInputValue("");
          setMinutesInputValue("");
          Keyboard.dismiss();
        })
        .catch(error => {
          alert(error);
        });
    }
  }
  
  const isAdult = route.params?.isAdult || false; // If isAdult is not passed or is undefined, it will default to false
  return (
    <Screen>
      <View style={styles.container}>
        <Logo />
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <ImagePickerExample
          setImage={setImageLink}
          image={imageLink}
          bytes={bytes}
          url={url}
          setUrl={setUrl}
        />
      </View>
      <View style={styles.name}>
        <TextInput
          onChangeText={text => setNameInputValue(text)}
          value={nameInputValue}
          placeholder="name"
        />
      </View>
      <View style={styles.minutes}>
        <TextInput
          onChangeText={text => setMinutesInputValue(text)}
          value={minutesInputValue}
          placeholder="minutes"
        />
      </View>
      <View style={styles.buttons}>
        <AppButton
          title="Create"
          onPress={() => {
            addField()
            if (isAdult === true) {
              if (route.params.location == "store") {
                navigation.navigate("StoreScreen",
              {
                url: url,
                isAdult: true
              });    
            } else {
              navigation.navigate("TasksScreen",
              {
                url: url,
                isAdult: true
              });   
            }        
            } else {
              navigation.navigate("HomeFile")            
             }
            
          }}
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

export default CreateTask;
