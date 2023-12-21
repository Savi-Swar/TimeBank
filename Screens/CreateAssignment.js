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
import RNPickerSelect from 'react-native-picker-select'; // Import the Picker component
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from "react-native-gesture-handler";

function CreateAssignment({ navigation, route }) {
  // I had to make two useState variables so I could use both of them on this screen
  const [nameInputValue, setNameInputValue] = useState("");
  const [minutesInputValue, setMinutesInputValue] = useState("");
  const [imageLink, setImageLink] = useState(null);
  const [url, setUrl] = useState("");
  const [selectedKid, setSelectedKid] = useState(""); // Store the selected kid

  let bytes;
  let id = firebase.makeid(20);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };
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
        kid: selectedKid,
        dueDate: date.toLocaleDateString(), // Add due date to data

      };
  
      // Get the current user's ID
      const userId = firebase.auth.currentUser.uid;
  
      // Reference the user's 'tasks' sub-collection
      const db = getDatabase();
      const tasksRef = ref(db, `Users/${userId}/assignments/${id}`);
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
    } else {
        if (nameInputValue.length === 0) {
          Alert.alert('Validation Error', 'Name field is not filled');
        } else if (minutesInputValue.length === 0) {
          Alert.alert('Validation Error', 'Minutes field is not filled');
        } else if (selectedKid.length === 0) {
          Alert.alert('Validation Error', 'No kid is selected');
        } else if (url.length === 0) {
          Alert.alert('Validation Error', 'No image is selected');
        }
      }
  }


  const [kids, setKids] = useState([])
  firebase.Kids(kids, setKids)
  return (
    <ScrollView>
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
   
        <View style={{width: "60%", flexDirection: "row"}}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedKid(value)}
          items={kids.map((kid) => ({ label: kid.name, value: kid.name }))}
          placeholder={{ label: "Select a kid...", value: null }}
          style={{
            inputIOS: {
              color: 'black',
              paddingHorizontal: 10,
              borderRadius: 5,
              backgroundColor: 'white',
            },
            inputAndroid: {
              color: 'black',
              paddingHorizontal: 10,
              borderRadius: 5,
              backgroundColor: 'white',
            },
          }}
        />
        <AppButton onPress={showDatePicker} title="Due Date!" />
      </View>
       {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode='date'
          display='default'
          onChange={onChange}
        />
      )}
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
            navigation.navigate("AssignmentScreen")       
          }}
        />
        <AppButton
          title="Back"
          onPress={() => {
            navigation.navigate("AssignmentScreen")       
          }}
        />
      </View>
    </Screen>
    </ScrollView>
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

export default CreateAssignment;
