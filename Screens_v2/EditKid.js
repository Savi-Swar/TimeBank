import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image, Alert } from 'react-native';
import AppTextInput from '../Components_v2/AppTextInput';
import BigButton from '../Components_v2/BigButton';
import BubbleText from '../Components_v2/BubbleText';
import BackButton from '../Components_v2/BackButton';
import ImagePickerExample from '../Components_v2/ImagePicker';
import * as firebase from "../firebase";
import { deleteObject, ref as StoreRef, getStorage } from "firebase/storage";
import { getDatabase, ref, update } from 'firebase/database';
import { playSound } from '../audio';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';
import BlankButton from '../Components_v2/BlankButton';

function EditKid({ navigation, route }) {
  // Assuming the data is passed via route.params
  const defaultImageUrl = "GuZ6IdnQPdkKaRn.jpg";

  // Initialize your state with itemData
  const [initialImageUrl, setInitialImageUrl] = useState(route.params.profilePic);
  const [minutesInputValue, setMinutesInputValue] = useState(route.params.minutes.toString());
  const [imageLink, setImageLink] = useState(route.params.profilePic);
  const [url, setUrl] = useState(route.params.profilePic); 
  const id = route.params.name; // Assuming this is how you get the id
  // The rest of your component logic goes here...
  const addField = () => {
    if (!minutesInputValue) {
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
        'Image Changed',
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
  console.log(initialImageUrl)
  const handleSubmit = (imageUrl) => {
    if (imageUrl !== initialImageUrl && initialImageUrl !== defaultImageUrl) {
        // Delete the previous image from storage
        const storage = getStorage();
        const prevImageRef = StoreRef(storage, initialImageUrl);
        deleteObject(prevImageRef).then(() => {
          console.log("Previous image deleted successfully.");
        }).catch((error) => {
          console.error("Error deleting previous image: ", error);
        });
      }
    
    const updatedData = {
      minutes: parseInt(minutesInputValue, 10),
      profilePic: imageUrl,
    };
  
    const db = getDatabase();
    const kidRef = ref(db, `Users/${firebase.auth.currentUser.uid}/kids/${id}`);
  
    update(kidRef, updatedData)
      .then(() => {
        playSound("pop");
        Alert.alert('Success', 'Kid profile updated successfully');
        navigation.navigate("ParentMenu");
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };
  
  return (
        <ImageBackground style={styles.background} source={require("../assets/backgrounds/17_add.png")}>
            
        <View style = {{top: verticalScale(-80), alignItems: "center"}}>
        <Image style={styles.logo} source={require("../assets/icons/Logo.png")} />
        <Image style={styles.tagLine} source={require("../assets/icons/Tagline.png")} />
        </View>
        <View style = {{bottom:verticalScale(270), right: scale(170)}}>
        <BackButton  onPress={() => {navigation.navigate("ParentMenu")}}
            imageUrl={require("../assets/buttons/Back.png")}/>
        </View>
        <View style = {{top:verticalScale(-80), right: scale(45)}}>
        <BubbleText size = {moderateScaleFont(32)} text = {"Change Profile Picture"}/>
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
        
       
        <View style = {{bottom: verticalScale(10)}}>
        <View style = {{top:verticalScale(-10), right: scale(-25)}}>
            <BubbleText size = {moderateScaleFont(32)} text = {"Edit Minutes"}/>
        </View>
        <AppTextInput placeholder = "Minutes" value={minutesInputValue} onChangeText={(text) => setMinutesInputValue(text)}
        iconSource = {require("../assets/icons/Timer2.png")}/>
        </View>
        <View style = {{ bottom: verticalScale(-30)}}>
        <BlankButton 
            onPress={() => {
                addField();
            }}              
            text = "Save"
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
  
export default EditKid;
