import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Screen from "./Screen";
import { doc, deleteDoc, getFirestore } from "firebase/firestore";

import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import colors from "../config/colors";
import { updateTimes } from "../firebase";
import AppButton from "./AppButton";

function RoutineBar({
  title,
  graphic,
  time,
  id,
  color = "primary",
  colTitle,
  colId,
}) {
  let val = time;
  const handlePress = () => {
    Alert.alert("Delete", "Are you sure you want to delete this step?", [
      { text: "Yes", onPress: () => deleteTask() },
      { text: "No" },
    ]);
  };
  const deleteTask = async () => {
    const db = getFirestore();

    let path = colId + "/" + colTitle + "/" + id;
    const colRef = (getFirestore(), "routines");

    const docRef = doc(db, colRef, path);
    await deleteDoc(docRef);
  };
  const [textInputValue, setTextInputValue] = useState(val);
  function update() {
    updateTimes(textInputValue, title, graphic, id, colTitle);
  }
  let str = "" + val;
  return (
    <Screen>
      <View style={[styles.container, { backgroundColor: colors[color] }]}>
        <MaterialCommunityIcons name={graphic} size={80} color="gold" />
        <Text style={styles.text}>{title}</Text>
        <View>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              fontSize: 30,
            }}
            onChangeText={text => setTextInputValue(text)}
            value={"" + textInputValue}
            placeholder={str}
            placeholderTextColor="black"
          />
          <AppButton title="Change time" onPress={() => update()} />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
          }}
        ></View>
        <TouchableOpacity onPress={() => handlePress()}>
          <Entypo name="circle-with-cross" size={35} color="red" />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100,
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
  },
  text: { fontSize: 25, paddingHorizontal: 10 },
  time: {
    height: 50,
    justifyContent: "center",
  },
});

export default RoutineBar;
