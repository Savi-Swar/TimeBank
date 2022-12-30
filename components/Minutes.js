import React, { useEffect, useState } from "react";
import colors from "../config/colors";
import { View, StyleSheet, Text } from "react-native";
import { useFonts } from "expo-font";
import * as firebase from "../firebase";

function Minutes({ name }) {
  const [minutes, setMinutes] = useState(0);
  const [named, setName] = useState("def");
  // let minutes;
  firebase.retrieveUser(name, setName);

  const [loaded] = useFonts({
    FredokaOne: require("../assets/fonts/FredokaOne_400Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }
  firebase.Mins(minutes, setMinutes, named);
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={{ fontFamily: "FredokaOne", fontSize: 50 }}>{minutes}</Text>
      <Text style={{ fontFamily: "FredokaOne", fontSize: 20 }}>minutes</Text>
    </View>
  );
}
export default Minutes;
