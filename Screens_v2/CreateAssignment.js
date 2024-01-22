import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ImageBackground, Image, Alert } from 'react-native';
import AppTextInput from '../Components_v2/AppTextInput';
import BigButton from '../Components_v2/BigButton';
import BubbleText from '../Components_v2/BubbleText';

import BackButton from '../Components_v2/BackButton';
import ImagePickerExample from '../Components_v2/ImagePicker';
import * as firebase from "../firebase"
import { getDatabase, ref, set } from 'firebase/database';
import MultiSelectDropdown from '../Components_v2/MultiSelect';
import BlankButton from '../Components_v2/BlankButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import { playSound } from '../audio';
import { scale, verticalScale, moderateScaleFont } from '../scaling';

function CreateAssignment({ navigation }) {

  const [nameInputValue, setNameInputValue] = useState("");
  const [minutesInputValue, setMinutesInputValue] = useState("");
  const [imageLink, setImageLink] = useState(null);
  const defaultImageUrl = "GuZ6IdnQPdkKaRn.jpg";
  const [url, setUrl] = useState("");
  let bytes;
  let id = firebase.makeid(20);

  function addField() {
    if (
      minutesInputValue &&
      minutesInputValue.length > 0 &&
      nameInputValue &&
      nameInputValue.length > 0
    ) {
      console.log("Hello")
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
      if (kids.length === 0) {
        playSound("deny");
        Alert.alert(
          'No Kids Selected',
        );
        return;
      }
      // Check if image url is not null
      if (!url) {
        playSound("deny");
        Alert.alert(
          'No Image Selected',
          'Do you want to use the default image?',
          [
            { text: 'Yes', onPress: () => setUrl(defaultImageUrl) },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'  }
          ]
        );
      }
      

      const formattedDate = date.toISOString(); // Convert date to ISO string format

      if (url) {
        const data = {
          image: url,
          minutes: minutesInputValue,
          title: nameInputValue,
          id: id,
          kids: selectedKids,
          date: formattedDate
        };
        // Get the current user's ID
        const userId = firebase.auth.currentUser.uid;
    
        // Reference the user's 'tasks' sub-collection
        const db = getDatabase();
        const tasksRef = ref(db, `Users/${userId}/assignment/${id}`);
        console.log("setting...")
        playSound('pop')
        set(tasksRef, data)
          .then(() => {
            setNameInputValue("");
            setMinutesInputValue("");
            navigation.navigate("ParentAssignment");

            // Keyboard.dismiss();
          })
          .catch((error) => {
            alert(error);
          });
      } 
    } else {
      Alert.alert("Minutes and/or Name is empty")
    }
  }
  const [kids, setKids] = useState([]);
  const [selectedKids, setSelectedKids] = useState([]);

    firebase.Kids(kids, setKids);
    let kidsName = []
    for (let i =0; i < kids.length; i++) {
        kidsName.push(kids[i].name);
    }

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  // Function to format and set date

  // Function to handle date change
  const onChange = (event, selectedDate) => {
    playSound('select')
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  // Function to show date picker
  const showDatePicker = () => {
    setShow(true);
  };
  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/17_add.png")}>
        
        <View style = {{top: verticalScale(10), alignItems: "center"}}>
          <Image style={styles.logo} source={require("../assets/icons/Logo.png")} />
          <Image style={styles.tagLine} source={require("../assets/icons/Tagline.png")} />
        </View>
        <View style = {{bottom:verticalScale(185), right: scale(170)}}>
          <BackButton  onPress={() => navigation.navigate("ParentAssignment")}
            imageUrl={require("../assets/buttons/Back.png")}/>
        </View>
        <View style = {{top:verticalScale(-10), right: scale(120)}}>
          <BubbleText size = {moderateScaleFont(24)} text = {"Upload Picture"}/>
        </View>
        
        <View style = {{flexDirection:"row", top:verticalScale(-122), right: scale(115)}}>
          <View>
            {/* <View style = {{alignItems: "center", top: 80, left: 30}}>
            <View style={{ paddingHorizontal: 20 }}> */}
            <ImagePickerExample
              setImage={setImageLink}
              image={imageLink}
              url={url}
              setUrl={setUrl}
              source="edit"  // or source="add" depending on your need
            />
          </View>

        </View>
        
        <View style = {{bottom: verticalScale(-5)}}>
          <AppTextInput placeholder = "Name (e.g. Pack Suitcase)" value={nameInputValue} onChangeText={(text) => setNameInputValue(text)}
              iconSource = {require("../assets/icons/email.png")}/>
        </View>
        <View style = {{bottom: verticalScale(-5)}}>
          <AppTextInput placeholder = "Minutes (e.g. 10)" value={minutesInputValue} onChangeText={(text) => setMinutesInputValue(text)}
          iconSource = {require("../assets/icons/lock.png")}/>
        </View>
        <View style = {{bottom: verticalScale(-10), alignItems: "center"}}>
            <BubbleText size = {moderateScaleFont(24)} text = {"Select Kids for Assignment"}/>
            <MultiSelectDropdown
                selected={[]}
                options={kidsName}
                onSelection={setSelectedKids}
                kids = {true}
                />
        </View>
        <View style={{ bottom: verticalScale(-10) }}>
          <BlankButton onPress={showDatePicker} text="Select Due Date" width={scale(225)}/>
          {show && (
             <View style={styles.dateTimePickerContainer}>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode='date'
                display='default'
                onChange={onChange}
                minimumDate={new Date()}
              />
           </View>
          )}
        </View>
        <View style = {{ bottom: verticalScale(-20)}}>

          <BigButton 
              onPress={() => {
                addField();
              }}              
              imageUrl={require("../assets/buttons/Create.png")}
          />
        </View>
        
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
  dateTimePickerContainer: {
    right: scale(45)
  },
});

export default CreateAssignment;
