import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image, Alert } from 'react-native';
import AppTextInput from '../Components_v2/AppTextInput';
import BigButton from '../Components_v2/BigButton';
import BubbleText from '../Components_v2/BubbleText';
import BackButton from '../Components_v2/BackButton';
import ImagePickerExample from '../Components_v2/ImagePicker';
import * as firebase from "../firebase";
import { getDatabase, ref, set } from 'firebase/database';
import { playSound } from '../audio';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';
import BlankButton from '../Components_v2/BlankButton';
import { deleteObject, ref as StoreRef, getStorage } from "firebase/storage";

function EditItem({ navigation, route }) {
  // Assuming the data is passed via route.params
  const { itemData, location } = route.params;
  const defaultImageUrl = "GuZ6IdnQPdkKaRn.jpg";
  const [initialImageUrl, setInitialImageUrl] = useState(itemData.image);

  // Initialize your state with itemData
  const [nameInputValue, setNameInputValue] = useState(itemData.title);
  const [minutesInputValue, setMinutesInputValue] = useState(itemData.minutes.toString());
  const [imageLink, setImageLink] = useState(itemData.image);
  const [url, setUrl] = useState(itemData.image); 
  const id = itemData.id; // Assuming this is how you get the id

  // The rest of your component logic goes here...
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
  const handleSubmit = (imageUrl) => {

    if (imageUrl !== initialImageUrl && initialImageUrl !== defaultImageUrl && 
        initialImageUrl !== "WaffleSundae.jpeg" && initialImageUrl !== "HappyMeal.jpeg" && initialImageUrl !== "Starbucks.webp" && 
        initialImageUrl !== "Monopoly.jpeg" && initialImageUrl !== "table.jpeg"
    && initialImageUrl !== "Room.jpeg" && initialImageUrl !== "bed.jpeg") {
        // Delete the previous image from storage
        const storage = getStorage();
        const prevImageRef = StoreRef(storage, initialImageUrl);
        deleteObject(prevImageRef).then(() => {
          console.log("Previous image deleted successfully.");
        }).catch((error) => {
          console.error("Error deleting previous image: ", error);
        });
      }
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
        Alert.alert('Success', 'Item Saved');
        navigation.navigate(location === "store" ? "ParentStore" : "ParentTask");
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
        <AppTextInput placeholder = "Name" value={nameInputValue} onChangeText={(text) => setNameInputValue(text)}
            iconSource = {require("../assets/icons/email.png")}/>
        </View>
        <View style = {{bottom: verticalScale(50)}}>
        <AppTextInput placeholder = "Minutes" value={minutesInputValue} onChangeText={(text) => setMinutesInputValue(text)}
        iconSource = {require("../assets/icons/Timer2.png")}/>
        </View>
        <View style = {{ bottom: verticalScale(10)}}>
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
  
export default EditItem;
