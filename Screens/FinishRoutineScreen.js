import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from "react-native";
import AppButton from "../components/AppButton";
import Card from "../components/Card";
import { AntDesign } from "@expo/vector-icons";
import Minutes from "../components/Minutes";
import colors from "../config/colors";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as firebase from "../firebase";
import { getDownloadURL, ref, getStorage } from "firebase/storage";
import Logo from "../components/Logo";

function FinishRoutineScreen({ navigation, route }) {
  console.log(route.params.obj.time)
    const [named, setName] = useState("");
  firebase.retrieveUser(named, setName);
  const [minutes, setMinutes] = useState(0);
  const [timeInputValue, setTimeInputValue] = useState("");
  let mins = route.params.obj.time - timeInputValue;
  console.log(mins);
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Logo />
      </View>
      <Text style={styles.subtitle}>Completed At:</Text>

      <View style={styles.minutes}>

        <TextInput
          onChangeText={text => setTimeInputValue(text)}
          value={timeInputValue}
          placeholder="time"
        />
      </View>

        <View style={styles.button}>
          <AppButton
            color="secondary"
            title="Complete"
            onPress={() => firebase.addMins(minutes, mins, named)}
          />
        </View>
      <View style={styles.button}>
        <AppButton
          title="Back to Routines"
          onPress={() => navigation.navigate("HomeFile")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
  },
  button: {
paddingHorizontal: 20, justifyContent:"center"  },
  text: { fontSize: 30, margin: 10 },
  subtitle: {
    fontSize: 20,
    margin: 10,
  },
  icons: {
    flexDirection: "row",
  },
  container: { top: 100 },
  name: {
    backgroundColor: colors.grey,
    borderRadius: 25,
    padding: 15,
    marginHorizontal: 15,
    margin: 20,
  },
  minutes: {
    backgroundColor: colors.grey,
    borderRadius: 25,
    padding: 15,
    margin: 15,
  },
});

export default FinishRoutineScreen;
