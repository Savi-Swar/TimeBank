import React, { useEffect, useState } from "react";
import colors from "../config/colors";
import { View, StyleSheet, Text } from "react-native";
import { useFonts } from "expo-font";
import * as firebase from "../firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';

function Minutes({ name }) {
  const [minutes, setMinutes] = useState(0);
  const [named, setName] = useState("def");

  const getData = async () => {
    try {
        const value = await AsyncStorage.getItem('@active_kid')
        if(value !== null) {
            setName(value)
        }
    } catch(e) {
      console.log(e)
    }
}


  useEffect(() => {  
    getData()
  }, []);
  const [loaded] = useFonts({
    FredokaOne: require("../assets/fonts/FredokaOne_400Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  firebase.Mins(minutes, setMinutes, named);
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontFamily: "FredokaOne", color: "#371A45", fontSize: verticalScale(80) }}>{minutes}</Text>
      <View style={{bottom: verticalScale(18)}}>
      <Text style={{ fontFamily: "FredokaOne", color: "#371A45", fontSize: verticalScale(32) }}>minutes</Text>
      </View>
    </View>
  );
}
export default Minutes;
