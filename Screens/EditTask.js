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
import ImagePickerExample from "../Components_v2/ImagePicker";
import * as firebase from "../firebase";
import { getDatabase, ref, set, update } from "firebase/database";


function EditTask({ navigation, route }) {
  const [nameInputValue, setNameInputValue] = useState(route.params.item.title);
  const [minutesInputValue, setMinutesInputValue] = useState(route.params.item.minutes);
  const defaultImageUrl = "Screenshot 2023-07-30 at 2.48.00 PM.png";
  const [url, setUrl] = useState(route.params.item.image != defaultImageUrl ? route.params.item.image : null);
  let id = route.params.item.id;
  
  function updateField() {
    if (
      minutesInputValue &&
      minutesInputValue.length > 0 &&
      nameInputValue &&
      nameInputValue.length > 0
    ) {
      if(!Number.isInteger(Number(minutesInputValue))){
        Alert.alert('Invalid Input', 'Minutes should be an integer');
        return;
      }
  
      if(typeof nameInputValue !== 'string'){
        Alert.alert('Invalid Input', 'Name should be a string');
        return;
      }
  
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
  
      const userId = firebase.auth.currentUser.uid;
      const db = getDatabase();
      const tasksRef = ref(db, `Users/${userId}/${route.params.location}/${id}`);
      update(tasksRef, data)
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
          navigation.navigate("Store", { url: url, isAdult: true });
        } else {
          navigation.navigate("Tasks", { url: url, isAdult: true });   
        }
      } else {
        navigation.navigate("HomeFile");            
      }
    }
  }

  const isAdult = route.params?.isAdult || false;
  console.log(url)
  return (
    <Screen>
      <View style={styles.container}>
        <Logo />
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <ImagePickerExample
          setImage={setUrl}
          image={url}
          setUrl={setUrl}
          source = {"edit"}
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
          title="Update"
          onPress={() => {
            updateField();
          }}
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

export default EditTask;
