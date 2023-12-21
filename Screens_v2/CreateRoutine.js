import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Image, Alert } from 'react-native';
import AppTextInput from '../Components_v2/AppTextInput';
import BigButton from '../Components_v2/BigButton';
import BubbleText from '../Components_v2/BubbleText';
import BackButton from '../Components_v2/BackButton';
import MultiSelectDropdown from '../Components_v2/MultiSelect';
import BlankButton from '../Components_v2/BlankButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePickerExample from '../components/ImagePicker';
import { getDatabase, ref, set } from 'firebase/database';
import * as firebase from "../firebase";
import { ScrollView } from 'react-native-gesture-handler';
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
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [routineName, setRoutineName] = useState('');
    const [imageLink, setImageLink] = useState(null); // State for image link
    const [url, setUrl] = useState(""); // State for image URL
    const [selectedKids, setSelectedKids] = useState([]); // State for selected kids
    const onChangeStartTime = (event, selectedTime) => {
      const currentTime = selectedTime || startTime;
      setStartTime(currentTime);
    };
    
    const onChangeEndTime = (event, selectedTime) => {
      const currentTime = selectedTime || endTime;
      setEndTime(currentTime);
    };
    const addField = () => {
      if (!routineName) {
        Alert.alert('Validation Error', 'Please enter a routine name');
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
      let ids = firebase.makeid();
      const newRoutineRef = ref(db, `Users/${firebase.auth.currentUser.uid}/routines/${ids}`);
    
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
  return (
  <ScrollView >
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/17_add.png")}>
        <View style = {{bottom: 200}}>
          <Image style={styles.logo} source={require("../assets/icons/Logo.png")} />
          <Image style={styles.tagLine} source={require("../assets/icons/Tagline.png")} />
        </View>
        <View style = {{bottom:310, right: 170}}>
          <BackButton  onPress={() => navigation.navigate("ParentRoutine")}
            imageUrl={require("../assets/buttons/Back.png")}/>
        </View>
        <View style={{right: 110, bottom: 250}}>
          <ImagePickerExample
                setImage={setImageLink}
                image={imageLink}
                url={url}
                setUrl={setUrl}
                source="edit" // or "add", depending on your need
            />
        </View>
        <View style = {{top: -120, right: 0}}>
          <BubbleText size = {24} text = {"Enter Start/End Times & Name"}/>
        </View>
        <View style={{flexDirection: 'row', marginHorizontal: 10, bottom: 120, left: 10}}>
            <View style={{right: 10}}>
          <BlankButton width = {175} text="Start Time" onPress={() => setShowStartTimePicker(!showStartTimePicker)} />
          <View style = {{right: 36, bottom: 15}}>

          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display="default"
              onChange={onChangeStartTime}
            />
          )}
          </View>
        </View>
        <View>
          <BlankButton text="End Time" width = {190} onPress={() => setShowEndTimePicker(!showEndTimePicker)} />
          <View style = {{right: 42, bottom: 15}}>
          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display="default"
              onChange={onChangeEndTime}
            />
          )}
          </View>
          </View>
        </View>
        <View style = {{top: -150}}>
          <AppTextInput
            placeholder="Name"
            iconSource={require("../assets/icons/email.png")}
            onChangeText={(text) => setRoutineName(text)}
            value={routineName}
          />        
        </View>    
        <View style = {{bottom: 155, left: 10}}>
          <BubbleText size = {24} text = {"Select Days of the Week"}/>
          <MultiSelectDropdown
            options={daysOptions}
            onSelection={setDaysOfWeek}
            />
        </View>
        <View style = {{bottom: 130, left: 10}}>
             <BubbleText size = {24} text = {"Select Months of the Year"}/>

            
            <MultiSelectDropdown
            options={monthsOptions}
            onSelection={setMonthsOfYear}
            />
        </View>
        <View style={{bottom: 105, left: 10}}>
                <BubbleText size={24} text={"Select Kids for Routine"} />
                <MultiSelectDropdown
                    options={kidsName}
                    onSelection={setSelectedKids}
                />
            </View>
        <View style = {{alignItems: "center", bottom: 60}}>
          <BigButton 
              onPress={addField}
              imageUrl={require("../assets/buttons/Create.png")}

          />
        </View>
    </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 300,
    resizeMode: "contain",
    top:200
  },
  tagLine: {
    width: 200,
    height: 80,
    resizeMode: "contain",
    top:110
  },
  image: {
    top: 85,
    width: 250,
    height: 250
  }
});

export default CreateRoutine;
