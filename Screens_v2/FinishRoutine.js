import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Alert, ImageBackground } from "react-native";
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
import BlankButton from "../Components_v2/BlankButton";
import BubbleText from "../Components_v2/BubbleText";
import { playSound } from "../audio";
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';

function FinishRoutine({ navigation, route }) {
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
    const isAndroid = Platform.OS === 'android';
    if (isAndroid && event.type === 'dismissed') {
      setShowTimePicker(false);
      return;
    }
    setShowTimePicker(isAndroid ? false : showTimePicker); // Hide picker on Android after selection

    const currentTime = selectedDate || finishedTime;
    setFinishedTime(currentTime);
    playSound("select");
    // Parse the HH:MM time from route.params.st and route.params.et
    const [startHours, startMinutes] = route.params.st.split(':').map(Number);
    const [endHours, endMinutes] = route.params.et.split(':').map(Number);

    // Create Date objects for both times
    const startTime = new Date();
    startTime.setHours(startHours);
    startTime.setMinutes(startMinutes);

    const endTime = new Date();
    endTime.setHours(endHours);
    endTime.setMinutes(endMinutes);

    // Calculate the difference in minutes
    const mins = Math.floor((endTime - currentTime) / (1000 * 60));
    console.log(mins)
    if (mins < 0) {
      setMinutes(0)
      return;
    }
    setMinutes(mins);
  };
//   const [kids, setKids] = useState([])
//   firebase.Kids(kids, setKids)
  const formatTime = (time) => {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  let titleText = route.params.name + " Routine";
  let timeText = route.params.st + " - " + route.params.et;
  return (
    <ImageBackground style={styles.background}  source={require("../assets/backgrounds/17_add.png")}>
       <View style = {{top: verticalScale(50), alignItems: "center"}}>
        <Image style={styles.image} source={{ uri: route.params.url }} />
        <BubbleText size={moderateScaleFont(45)} text={titleText} />
        <View style={styles.timeContainer}>
          <Image style={styles.image2} source={require("../assets/icons/Timer.png")} />
          <BubbleText color="#21BF73" size={moderateScaleFont(24)} text={timeText} />
        </View>
      </View>
      <View style={styles.minutes}>
        <BubbleText text = "Enter Completion time" size = {moderateScaleFont(30)}/>
        <BlankButton style={styles.button2} onPress={() => setShowTimePicker(true)} text="Completed At: " />
        {showTimePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={finishedTime}
            mode={'time'}
            display="clock"
            onChange={handleEndChange}

          />
        )}
        {Platform.OS === 'android' && (
        <Text style={styles.finishTimeText}>
          Finished At: {formatTime(finishedTime)}
        </Text>
      )}

      </View>

      <View style={styles.button}>
        <BlankButton  
          text="Complete"
          onPress={() => {
            const [startHours, startMinutes] = route.params.st.split(':').map(Number);
            const [endHours, endMinutes] = route.params.et.split(':').map(Number);

            const startTime = new Date();
            startTime.setHours(startHours);
            startTime.setMinutes(startMinutes);

            const endTime = new Date();
            endTime.setHours(endHours);
            endTime.setMinutes(endMinutes);

            if (finishedTime <= startTime || finishedTime > endTime) {
              Alert.alert('Invalid Time', `Finish time must be between ${route.params.st} and ${route.params.et}`);
              return;
            }
            playSound("complete")
            // if (isAdult) {
            //   firebase.addMins( minutes, selectedKid);
            // } else {
            firebase.updateRequest(named, minutes, route.params.name, "false");
            // }
            console.log(minutes, named, route.params.name, route.params.et)
            firebase.finishRoutine(minutes, named, route.params.name, route.params.st, route.params.et);
          }}
        />
      </View>
      <View style={styles.button}>
        <BlankButton
          text="Back to Routines"
          onPress = {() => navigation.navigate("KidsNav")}
        />
      </View>
    </ImageBackground>
  );
}

let r = Math.min(scale(1), verticalScale(1));

const styles = StyleSheet.create({
  image2: {
    width: 35*r,
    height: 35*r,
    resizeMode: "contain",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(10),
  },
  image: {
    width: 240*r,
    height: 240*r,
    borderRadius: 120*r,
  },
  background: {
    
    flex: 1
  },
  
  button2: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignItems:"center",
    top: verticalScale(200)
  },
  text: { 
    fontSize: moderateScaleFont(30),
    marginHorizontal: scale(10),
    marginVertical: verticalScale(10),
  },
  subtitle: {
    fontSize: moderateScaleFont(20),
    marginHorizontal: scale(10),
    marginVertical: verticalScale(10),
  },
  icons: {
    flexDirection: "row",
  },
  name: {
    backgroundColor: colors.grey,
    borderRadius: scale(25),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(15),
    marginHorizontal: scale(20),
    marginVertical: verticalScale(20),
  },
  minutes: {
    justifyContent: "center",
    alignItems: 'center',
    width: "70%",
    left: scale(50),
    top: verticalScale(70),

    marginHorizontal: scale(15),
  },
  finishTimeText: {
    fontSize: moderateScaleFont(20),
    color: '#000', // Choose an appropriate color
    marginTop: verticalScale(10),
    alignSelf: 'center',
  },
});

export default FinishRoutine;
