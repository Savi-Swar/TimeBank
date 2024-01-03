import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Alert, ScrollView, Image } from 'react-native';
import AppTextInput from '../Components_v2/AppTextInput';
import BigButton from '../Components_v2/BigButton';
import BubbleText from '../Components_v2/BubbleText';
import BackButton from '../Components_v2/BackButton';
import ImagePickerExample from '../Components_v2/ImagePicker';
import MultiSelectDropdown from '../Components_v2/MultiSelect';
import BlankButton from '../Components_v2/BlankButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDatabase, ref, set } from 'firebase/database';
import * as firebase from "../firebase";
import { playSound } from '../audio';
import { scale, verticalScale, moderateScaleFont } from '../scaling';
import { deleteObject, ref as StoreRef, getStorage } from "firebase/storage";

function EditRoutine({ navigation, route }) {
  // Assuming the data is passed via route.params
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

  // Initialize your state with routineData
    const startString = route.params.startTime; // This is the time string you receive
    const [hours, minutes] = startString.split(':').map(Number);

    // Create a new date object for today
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0); // Set hours and minutes, seconds and milliseconds to 0

    const endString = route.params.endTime; // This is the time string you receive
    const [h2, m2] = endString.split(':').map(Number);

    // Create a new date object for today
    const endDate = new Date();
    endDate.setHours(h2, m2, 0, 0); // Set hours and minutes, seconds and milliseconds to 0

  const [initialImageUrl, setInitialImageUrl] = useState(route.params.image);

  const [routineName, setRoutineName] = useState(route.params.title);
  const [daysOfWeek, setDaysOfWeek] = useState(route.params.days);
  const [monthsOfYear, setMonthsOfYear] = useState(route.params.months);
  const [selectedKids, setSelectedKids] = useState(route.params.kids);
  const [startTime, setStartTime] = useState(startDate);
  const [endTime, setEndTime] = useState(endDate);
  const [url, setUrl] = useState(route.params.image);
  const [imageLink, setImageLink] = useState(route.params.image);
  const [steps, setSteps] = useState(route.params.steps || []); 
  const id = route.params.id; 
  const [showStartTimePicker, setShowStartTimePicker] = useState(true);
  const [showEndTimePicker, setShowEndTimePicker] = useState(true);
  const defaultImage = "GuZ6IdnQPdkKaRn.jpg";
  const onChangeStartTime = (event, selectedTime) => {
    const isAndroid = Platform.OS === 'android';
    if (isAndroid && event.type === 'dismissed') {
      setShowStartTimePicker(false);
      return;
    }
    playSound("select");
    setShowStartTimePicker(isAndroid ? false : showStartTimePicker); // Hide picker on Android after selection
    setStartTime(selectedTime || startTime);
  };
  
  const onChangeEndTime = (event, selectedTime) => {
    const isAndroid = Platform.OS === 'android';
    if (isAndroid && event.type === 'dismissed') {
      setShowEndTimePicker(false);
      return;
    }
    playSound("select");
    setShowEndTimePicker(isAndroid ? false : showEndTimePicker); // Hide picker on Android after selection
    setEndTime(selectedTime || endTime);
  };
  const addField = () => {

    if (!routineName) {
      playSound("alert")
      Alert.alert('Error', 'Please enter a routine name');
      return;
    }
    if (!url) {
      playSound("deny");
      Alert.alert(
        'Image Changed',
        'Do you want to use the default image?',
        [
          { text: 'Yes', onPress: () => setUrl(defaultImage) },
          { text: 'No', style: 'cancel' }
        ]
      );
      return;
    }
    if (daysOfWeek.length == 0) {
      playSound("alert")
      Alert.alert('Error', 'Please select at least one day of the week');
      return;
    }
    if (monthsOfYear.length == 0) {
      playSound("alert")
      Alert.alert('Error', 'Please select at least one month of the year');
      return;
    }
    if (startTime >= endTime) {
      playSound("alert")
      Alert.alert('Error', 'Start time must be before end time');
      return;
    }
    if (selectedKids.length == 0) {
      playSound("alert")
      Alert.alert('Error', 'Please select at least one kid. If you have none, then go back and create one in the Parents Home.');
      return;
    }
    const routineData = {
      title: routineName.replace(/ /g, "-"),
      days: daysOfWeek,
      months: monthsOfYear,
      startTime: startTime.toString().substring(16,21),
      endTime: endTime.toString().substring(16,21),
      image: url, // Add image URL to the routine data
      kids: selectedKids, // Add selected kids to the routine data
      steps: steps,
      // kids: selected,
    };
  
    if (url !== initialImageUrl && initialImageUrl !== defaultImage) {
      // Delete the previous image from storage
      const storage = getStorage();
      const prevImageRef = StoreRef(storage, initialImageUrl);
      deleteObject(prevImageRef).then(() => {
        console.log("Previous image deleted successfully.");
      }).catch((error) => {
        console.error("Error deleting previous image: ", error);
      });
    }
    const db = getDatabase();
    const newRoutineRef = ref(db, `Users/${firebase.auth.currentUser.uid}/routines/${id}`);
    playSound("pop")
    set(newRoutineRef, routineData)
      .then(() => {
        
        Alert.alert('Success', 'Routine Saved');
        navigation.navigate("ParentRoutine"); // Or the appropriate screen
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  const [kids, setKids] = useState([]);
  firebase.Kids(kids, setKids);
  let kidsName = []
  for (let i =0; i < kids.length; i++) {
      kidsName.push(kids[i].name);
  }
  const formatTime = (time) => {
    let hours = time.getHours().toString().padStart(2, '0');
    let minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  let top = showEndTimePicker || showStartTimePicker ? verticalScale(-230) : verticalScale(-200);
  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/21_add-routine.png")}>
       <ScrollView >
        <View style = {{bottom: verticalScale(-50), alignItems: "center"}}>
          <Image style={styles.logo} source={require("../assets/icons/Logo.png")} />
          <Image style={styles.tagLine} source={require("../assets/icons/Tagline.png")} />
        </View>
        <View style = {{bottom:verticalScale(130), right: scale(-40)}}>
          <BackButton  onPress={() => navigation.navigate("ParentRoutine")}
            imageUrl={require("../assets/buttons/Back.png")}/>
        </View>
        <View style = {{top:verticalScale(130), right: scale(-20)}}>
          <BubbleText size = {moderateScaleFont(32)} text = {"Upload Picture"}/>
        </View>
        <View style={{right: scale(0), bottom: verticalScale(-15)}}>
          <ImagePickerExample
                setImage={setImageLink}
                image={imageLink}
                url={url}
                setUrl={setUrl}
                source="edit" // or "add", depending on your need
            />
        </View>
        <View style = {{top: verticalScale(145), right: scale(-10)}}>
          <BubbleText size = {moderateScaleFont(24)} text = {"Enter Start/End Times"}/>
        </View>
        <View style={{flexDirection: 'row', marginHorizontal: scale(10), top: verticalScale(150), left: scale(10), zIndex: 1}}>
            <View style={{right: scale(10)}}>
          <BlankButton width = {scale(175)} height = {verticalScale(35)}  text="Start Time" onPress={() => setShowStartTimePicker(!showStartTimePicker)} />
          <View style = {{right: scale(36), bottom: verticalScale(-5)}}>

          {showStartTimePicker && (
            <DateTimePicker 
              value={startTime}
              mode="time"
              display="default"
              onChange={onChangeStartTime}
            />
          )}
          <View style={{left: scale(38)}}>
            {Platform.OS === 'android' && <Text style={styles.timeText}>Start: {formatTime(startTime)}</Text>}
            </View>

          </View>
        </View>
        <View>
          <BlankButton text="End Time" width = {scale(190)} height = {verticalScale(35)} onPress={() => setShowEndTimePicker(!showEndTimePicker)} />
          <View style = {{right: scale(55), bottom: verticalScale(-5)}}>
          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display="default"
              onChange={onChangeEndTime}
            />
          )}
            <View style={{left: scale(38)}}>
              {Platform.OS === 'android' && <Text style={styles.timeText}>End: {formatTime(endTime)}</Text>}
            </View>
          </View>
          </View>
        </View>
        
        <View style = {{top:verticalScale(top-verticalScale(5)), right: scale(-20)}}>
          <BubbleText size = {moderateScaleFont(24)} text = {"Enter Name"}/>
        </View>
        <View style = {{top: verticalScale(top), zIndex: 0}}> 
          <AppTextInput 

            placeholder="Name" 
            iconSource={require("../assets/icons/email.png")}
            onChangeText={(text) => setRoutineName(text)}
            value={routineName}
          />        
        </View> 
        <View style = {{alignItems: "center"}}>   
        <View style = {{top: verticalScale(100), left: scale(10)}}>
          <BubbleText size = {24} text = {"Select Days of the Week"}/>
          <MultiSelectDropdown
            options={daysOptions}
            onSelection={setDaysOfWeek}
            selected = {daysOfWeek}
            />
        </View>
        <View style = {{top: verticalScale(110), left: scale(0)}}>
          <View style = {{left: 10}}>
             <BubbleText size = {moderateScaleFont(24)} text = {"Select Months of the Year"}/>
          </View>
            
            <MultiSelectDropdown
            options={monthsOptions}
            onSelection={setMonthsOfYear}
            selected = {monthsOfYear}
            />
        </View>
        <View style={{top: verticalScale(125)}}>
            <View style = {{marginRight: scale(145)}}>
                <BubbleText size={moderateScaleFont(24)} text={"Select Kids for Routine"} />
            </View>
                <MultiSelectDropdown
                    options={kidsName}
                    onSelection={setSelectedKids}
                    selected={selectedKids}
                />
            </View>
        </View>
        <View style = {{alignItems: "center", top: verticalScale(150), paddingBottom: verticalScale(180)}}>
          <BlankButton 
            onPress={() => {
                addField();
            }}              
            text = "Save"
        />
        </View>
      </ScrollView>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: scale(250),
    height: verticalScale(173),
    resizeMode: "contain",
  },
  tagLine: {
    width: scale(215),
    height: verticalScale(40),
    resizeMode: "contain",
  },
  image: {
    top: verticalScale(85),
    width: scale(250),
    height: verticalScale(250)
  },
  timeText: {
    fontSize: moderateScaleFont(18),
    marginTop: verticalScale(5),
    alignSelf: 'center',
    color: '#000', // Adjust as needed
  },
});

export default EditRoutine;
