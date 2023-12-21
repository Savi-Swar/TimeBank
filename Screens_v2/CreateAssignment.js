import React, {useState} from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import AppTextInput from '../Components_v2/AppTextInput';
import BigButton from '../Components_v2/BigButton';
import BubbleText from '../Components_v2/BubbleText';
import MediumButton from '../Components_v2/MediumButton';
import SmallButton from '../Components_v2/SmallButton';
import CustomButton from '../Components_v2/CustomButton';
import BackButton from '../Components_v2/BackButton';
import ImagePickerExample from '../components/ImagePicker';
import * as firebase from "../firebase"
import { getDatabase, ref, set } from 'firebase/database';
import MultiSelectDropdown from '../Components_v2/MultiSelect';
import BlankButton from '../Components_v2/BlankButton';
import DateTimePicker from '@react-native-community/datetimepicker';

function CreateAssignment({ navigation }) {

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
    
      // Check if image url is not null
      if(!url){
        Alert.alert('Missing Image', 'Please select an image');
        return;
      }
      const formattedDate = date.toISOString(); // Convert date to ISO string format

      const data = {
        image: url,
        minutes: minutesInputValue,
        title: nameInputValue,
        id: id,
        kids: selectedKids,
        date: formattedDate
      };
      console.log(url)
      // Get the current user's ID
      const userId = firebase.auth.currentUser.uid;
  
      // Reference the user's 'tasks' sub-collection
      const db = getDatabase();
      const tasksRef = ref(db, `Users/${userId}/assignment/${id}`);
      console.log("setting...")
      set(tasksRef, data)
        .then(() => {
          setNameInputValue("");
          setMinutesInputValue("");
          // Keyboard.dismiss();
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      console.log(minutesInputValue)
    }
  }
  const [kids, setKids] = useState([]);
  const [selectedKids, setSelectedKids] = useState([]);

    firebase.Kids(kids, setKids);
    let kidsName = []
    for (let i =0; i < kids.length; i++) {
        kidsName.push(kids[i].name);
    }
//   useEffect(() => {
//     // Transform the kids data into an array of names
//     const kidsNames = kids.map(kid => kid.name);
//     setKids(kidsNames);
//   }, [kids]); // Dependency on 'kids' ensures this runs when 'kids' changes
const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  // Function to handle date change
  const onChange = (event, selectedDate) => {
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
        
        <View style = {{top: -100}}>
          <Image style={styles.logo} source={require("../assets/icons/Logo.png")} />
          <Image style={styles.tagLine} source={require("../assets/icons/Tagline.png")} />
        </View>
        <View style = {{bottom:220, right: 170}}>
          <BackButton  onPress={() => navigation.navigate("ParentAssignment")}
            imageUrl={require("../assets/buttons/Back.png")}/>
        </View>
        <View style = {{top:-30, right: 100}}>
          <BubbleText size = {32} text = {"Upload Picture"}/>
        </View>
        
        <View style = {{flexDirection:"row", top:-140, right: 115}}>
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
        
        <View style = {{bottom: 55}}>
          <AppTextInput placeholder = "Name" value={nameInputValue} onChangeText={(text) => setNameInputValue(text)}
              iconSource = {require("../assets/icons/email.png")}/>
        </View>
        <View style = {{bottom: 125}}>
          <AppTextInput placeholder = "Minutes" value={minutesInputValue} onChangeText={(text) => setMinutesInputValue(text)}
          iconSource = {require("../assets/icons/lock.png")}/>
        </View>
        <View style = {{bottom: 160, left: 60}}>
          <BubbleText size = {24} text = {"Select Kids for Assignment"}/>
          <View style = {{ right: 60}}>
            <MultiSelectDropdown
                options={kidsName}
                onSelection={setSelectedKids}
                />
            </View>
        </View>
        <View style = {{bottom: 170}}>
            <BlankButton onPress={showDatePicker} text="Select Due Date" width={225}/>

            {show && (
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode='date'
                display='default'
                onChange={onChange}
            />
            )}
         </View>
        <View style = {{ bottom: 125}}>

          <BigButton 
              onPress={() => {
                addField();
                navigation.navigate("ParentAssignment");
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

export default CreateAssignment;
