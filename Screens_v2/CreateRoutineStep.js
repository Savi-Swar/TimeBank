import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Text, Alert, Keyboard, ImageBackground, Image } from "react-native";
import AppButton from "../components/AppButton";
import Logo from "../components/Logo";
import Screen from "../components/Screen";
import colors from "../config/colors";
import AppTextInput from "../Components_v2/AppTextInput";
import * as firebase from "../firebase";
import { uploadBytes } from "firebase/storage";
import { push, set, ref, getDatabase } from "firebase/database";
import CustomButton from "../Components_v2/CustomButton";
import BlankButton from "../Components_v2/BlankButton";
import BubbleText from "../Components_v2/BubbleText";
import { playSound } from "../audio";
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';

function CreateRoutineStep({ navigation, route }) {
  const [nameInputValue, setNameInputValue] = useState("");
  const userId = firebase.auth.currentUser.uid;
  let id = firebase.makeid(20);
  let x = firebase.getRoutineLength(route.params.id);
  x+=1;
  const isAdult = route.params?.isAdult || false; // If isAdult is not passed or is undefined, it will default to false
  const navigateWithIsAdult = (screen, params = {}) => {
    // if (isAdult) {
    //   navigation.navigate(screen, { ...params, isAdult: true });
    // } else {
      navigation.navigate(screen, params);
    // }
  }

  function addField() {
    if (nameInputValue && nameInputValue.length > 0) {
      const data = {
        title: nameInputValue,
        indx: x,
      };
      const todoRef = ref(getDatabase(), `Users/${userId}/routines/${route.params.id}/steps/${id}`);
      playSound("pop")
      set(todoRef, data)
        .then(() => {
          Keyboard.dismiss();
          setNameInputValue(""); 
        })
        .then(() => {
          navigateWithIsAdult("RoutineSteps", {
            title: route.params.title,
            id: route.params.id,
            startTime: route.params.st,
            endTime: route.params.et,
            isActive: route.params.isActive,
            url: route.params.url,
            isAdult: route.params.isAdult
          });
        })
        .catch(error => {
          alert(error);
        });
    }
  }
  
  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/17_add.png")}>
        
        <View style = {{bottom: verticalScale(150), alignItems: "center"}}>
          <Image style={styles.logo} source={require("../assets/icons/Logo.png")} />
          <Image style={styles.tagLine} source={require("../assets/icons/Tagline.png")} />
        </View>
      <View style ={{bottom: verticalScale(70), alignItems: "center"}}>
        <View style = {{bottom: verticalScale(10)}}>
            <BubbleText size = {moderateScaleFont(30)} text = {"Add a Step"}/>
        </View>
        <AppTextInput
          iconSource = {require("../assets/icons/user.png")}
          onChangeText={text => setNameInputValue(text)}
          value={nameInputValue}
          placeholder="name"
        />

      </View>
      <View style={styles.buttons}>
        <BlankButton
            text={"Create"}
          onPress={() => 
            addField()
          }
        />
        <View style = {{top: verticalScale(10)}}>
         <BlankButton
            text={"Back"}
          onPress={() => 
            navigateWithIsAdult("RoutineSteps", {
              title: route.params.title,
              id: route.params.id,
              startTime: route.params.st,
              endTime: route.params.et,
              isActive: route.params.isActive,
              url: route.params.url,
              isAdult: route.params.isAdult

            })
          }
        />
        </View>
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
    
  buttons: {
    alignItems: "center",
    marginHorizontal: scale(20),
    marginVertical: verticalScale(10),
    bottom: verticalScale(-90)
  },
});

export default CreateRoutineStep;
