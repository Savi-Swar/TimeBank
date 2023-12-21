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
import { getDatabase, ref, set } from "firebase/database";
import { uploadBytes } from "firebase/storage";
import LottieView from "lottie-react-native";


function CreateTask({ navigation, route }) {
  // I had to make two useState variables so I could use both of them on this screen
  const [nameInputValue, setNameInputValue] = useState("");
  const [minutesInputValue, setMinutesInputValue] = useState("");
  const [imageLink, setImageLink] = useState(null);
  const defaultImageUrl = "Screenshot 2023-07-30 at 2.48.00 PM.png";
  const [url, setUrl] = useState(defaultImageUrl);
  let bytes;
  let id = firebase.makeid(20);

  function addField() {
    if (
      minutesInputValue &&
      minutesInputValue.length > 0 &&
      nameInputValue &&
      nameInputValue.length > 0
    ) {
      // Check if the minutesInputValue is an integer
      if(!Number.isInteger(Number(minutesInputValue))){
        Alert.alert('Invalid Input', 'Minutes should be an integer');
        return;
      }
  
      // Check if the nameInputValue is a string
      if(typeof nameInputValue !== 'string'){
        Alert.alert('Invalid Input', 'Name should be a string');
        return;
      }
    
      // Check if image url is not null
      if(!url){
        Alert.alert('Missing Image', 'Please select an image');
        return;
      }
  
      const data = {
        image: url,
        minutes: minutesInputValue,
        title: nameInputValue,
        id: id,
      };
      console.log(url)
      // Get the current user's ID
      const userId = firebase.auth.currentUser.uid;
  
      // Reference the user's 'tasks' sub-collection
      const db = getDatabase();
      const tasksRef = ref(db, `Users/${userId}/${route.params.location}/${id}`);
      console.log("setting...")
      set(tasksRef, data)
        .then(() => {
          setNameInputValue("");
          setMinutesInputValue("");
          Keyboard.dismiss();
        })
        .catch((error) => {
          alert(error);
        });
      if (isAdult === true) {
              if (route.params.location == "store") {
                navigation.navigate("Store",
              {
                url: url,
                isAdult: true
              });    
            } else {
              navigation.navigate("Tasks",
              {
                url: url,
                isAdult: true
              });   
            }        
            } else {
              navigation.navigate("HomeFile")            
             }
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
