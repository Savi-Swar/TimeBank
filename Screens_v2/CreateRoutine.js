import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Image, Alert, Platform, Text, TouchableOpacity } from 'react-native';
import AppTextInput from '../Components_v2/AppTextInput';
import BigButton from '../Components_v2/BigButton';
import BubbleText from '../Components_v2/BubbleText';
import BackButton from '../Components_v2/BackButton';
import MultiSelectDropdown from '../Components_v2/MultiSelect';
import BlankButton from '../Components_v2/BlankButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePickerExample from '../Components_v2/ImagePicker';
import { getDatabase, ref, set } from 'firebase/database';
import * as firebase from "../firebase";
import { ScrollView } from 'react-native-gesture-handler';
import { playSound } from '../audio';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';


function CreateRoutine({ navigation }) {
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
    let defaultImage = "GuZ6IdnQPdkKaRn.jpg";
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [routineName, setRoutineName] = useState('');
    const [imageLink, setImageLink] = useState(null); // State for image link
    const [url, setUrl] = useState(""); // State for image URL
    const [selectedKids, setSelectedKids] = useState([]); // State for selected kids
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
          'No Image Selected',
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
        // kids: selected,
      };
    
      const db = getDatabase();
      let ids = firebase.makeid(20);
      const newRoutineRef = ref(db, `Users/${firebase.auth.currentUser.uid}/routines/${ids}`);
      playSound("pop")
      set(newRoutineRef, routineData)
        .then(() => {
          
          Alert.alert('Success', 'Routine created successfully');
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
    let top = showEndTimePicker || showStartTimePicker ? verticalScale(-235) : verticalScale(-200);
    let t2 = top - verticalScale(5);
    if (Platform.OS === 'android') {
      top = verticalScale(-250)
      t2 = top+verticalScale(5);
    }

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
            <View style={{left: scale(48)}}>
              {Platform.OS === 'android' && <Text style={styles.timeText}>End: {formatTime(endTime)}</Text>}
            </View>
          </View>
          </View>
        </View>
        
        <View style = {{top: t2, right: scale(-20)}}>
          <BubbleText size = {moderateScaleFont(24)} text = {"Enter Name"}/>
        </View>
        <View style = {{top: top, zIndex: 0}}> 
          <AppTextInput 

            placeholder="Name (e.g. Morning Routine)" 
            iconSource={require("../assets/icons/email.png")}
            onChangeText={(text) => setRoutineName(text)}
            value={routineName}
          />        
        </View> 
        <View style = {{alignItems: "center"}}>   
        <View style = {{top: verticalScale(100), left: scale(10)}}>
          <BubbleText size = {moderateScaleFont(24)} text = {"Select Days of the Week"}/>
          <MultiSelectDropdown
              selected={[]}

            options={daysOptions}
            onSelection={setDaysOfWeek}
            />
        </View>
        <View style = {{top: verticalScale(110), left: scale(0)}}>
          <View style = {{left: scale(10)}}>
             <BubbleText size = {moderateScaleFont(24)} text = {"Select Months of the Year"}/>
          </View>
            
            <MultiSelectDropdown
            selected={[]}
            options={monthsOptions}
            onSelection={setMonthsOfYear}
            />
        </View>
        <View style={{top: verticalScale(125)}}>
            <View style = {{right: scale(-10)}}>
                <BubbleText size={moderateScaleFont(24)} text={"Select Kids for Routine"} />
            </View>
                <MultiSelectDropdown
                    selected={[]}
                    options={kidsName}
                    onSelection={setSelectedKids}
                />
            </View>
        </View>
        <View style = {{alignItems: "center", top: verticalScale(150), paddingBottom: verticalScale(180)}}>
          <BigButton 
              onPress={addField}
              imageUrl={require("../assets/buttons/Create.png")}

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

export default CreateRoutine;
