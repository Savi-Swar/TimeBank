import React, { useEffect, useState } from "react";
import colors from "../config/colors";
import { View, StyleSheet, Text } from "react-native";
import { useFonts } from "expo-font";
import * as firebase from "../firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';

function Minutes({ name }) {
  const [minutes, setMinutes] = useState(0);
  const [named, setName] = useState("def");

  // let minutes;
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
  // name(minutes)
  firebase.Mins(minutes, setMinutes, named);
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={{ fontFamily: "FredokaOne", fontSize: 50 }}>{minutes}</Text>
      <Text style={{ fontFamily: "FredokaOne", fontSize: 20 }}>minutes</Text>
    </View>
  );
}
export default Minutes;
