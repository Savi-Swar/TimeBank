import React, {useState} from 'react';
import { View, StyleSheet, ImageBackground, Image, Alert } from 'react-native';
import AppTextInput from '../Components_v2/AppTextInput';
import BigButton from '../Components_v2/BigButton';
import BubbleText from '../Components_v2/BubbleText';

import BackButton from '../Components_v2/BackButton';
import ImagePickerExample from '../Components_v2/ImagePicker';
import * as firebase from "../firebase"
import { getDatabase, ref, set } from 'firebase/database';
import { playSound } from '../audio';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';
function CreateItem({ navigation, route}) {
  let location = route.params.location; 
  const [nameInputValue, setNameInputValue] = useState("");
  const [minutesInputValue, setMinutesInputValue] = useState("");
  const [imageLink, setImageLink] = useState(null);
  const defaultImageUrl = "GuZ6IdnQPdkKaRn.jpg";
  const [url, setUrl] = useState("");
  let bytes;
  let id = firebase.makeid(20);

  const addField = () => {
    if (!nameInputValue || !minutesInputValue) {
      Alert.alert('Missing Fields', 'Please fill all the fields');
      return;
    }

    if (!Number.isInteger(Number(minutesInputValue))) {
      Alert.alert('Invalid Input', 'Minutes should be a whole number');
      return;
    }

    if (!url) {
      playSound("deny");
      Alert.alert(
        'No Image Selected',
        'Do you want to use the default image?',
        [
          { text: 'Yes', onPress: () => setUrl(defaultImageUrl) },
          { text: 'No', style: 'cancel' }
        ]
      );
      return;
    }

    // Proceed with current URL
    if (url) {
      handleSubmit(url);
    }
  };

  const handleSubmit = (imageUrl) => {
    const data = {
      image: imageUrl,
      minutes: minutesInputValue,
      title: nameInputValue,
      id: id,
    };

    const db = getDatabase();
    const tasksRef = ref(db, `Users/${firebase.auth.currentUser.uid}/${location}/${id}`);
    set(tasksRef, data)
      .then(() => {
        playSound("pop");
        Alert.alert('Success', 'Item created successfully');
        navigation.navigate(location === "store" ? "ParentStore" : "ParentTask");
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  let text1 = location == "store" ? "Name (e.g. Trip to the Movies)" : "Name (e.g. Set Dinner Table)";
  let text2 = location == "store" ? "Minutes (e.g. 120)" : "Minutes (e.g. 5)";
  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/17_add.png")}>
        
        <View style = {{top: verticalScale(-80), alignItems: "center"}}>
          <Image style={styles.logo} source={require("../assets/icons/Logo.png")} />
          <Image style={styles.tagLine} source={require("../assets/icons/Tagline.png")} />
        </View>
        <View style = {{bottom:verticalScale(270), right: scale(170)}}>
          <BackButton  onPress={() => {navigation.navigate(location == "store" ? "ParentStore" : "ParentTask")}}
            imageUrl={require("../assets/buttons/Back.png")}/>
        </View>
        <View style = {{top:verticalScale(-80), right: scale(100)}}>
          <BubbleText size = {moderateScaleFont(32)} text = {"Upload Picture"}/>
        </View>
        
        <View style = {{flexDirection:"row", top:verticalScale(-180), right: scale(115)}}>
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
        
        <View style = {{bottom: verticalScale(50)}}>
          <AppTextInput placeholder = {text1} value={nameInputValue} onChangeText={(text) => setNameInputValue(text)}
              iconSource = {require("../assets/icons/email.png")}/>
        </View>
        <View style = {{bottom: verticalScale(50)}}>
          <AppTextInput placeholder = {text2} value={minutesInputValue} onChangeText={(text) => setMinutesInputValue(text)}
          iconSource = {require("../assets/icons/lock.png")}/>
        </View>
        <View style = {{ bottom: verticalScale(10)}}>
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
  }
});

export default CreateItem;
