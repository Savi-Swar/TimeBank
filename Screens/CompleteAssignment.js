import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import AppButton from "../components/AppButton";
import Card from "../components/Card";
import { AntDesign } from "@expo/vector-icons";
import Minutes from "../components/Minutes";
import colors from "../config/colors";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as firebase from "../firebase";
import * as st  from "firebase/storage";
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, remove as dbRemove } from "firebase/database";

function CompleteAssignment({ navigation, route }) {
  let mins = parseInt(route.params.item.minutes);
  const [url, setUrl] = useState();
  let link = "/" + route.params.item.image;
  useEffect(() => {
    const func = async () => {
      const storage = st.getStorage();
      const reference = st.ref(storage, link);
      await st.getDownloadURL(reference).then(x => {
        setUrl(x);
      });
    };
    func();
  }, []);
  const deleteAssignment = async () => {
    const userId = firebase.auth.currentUser.uid;
  
    // Define the path to the assignment in the Realtime Database
    const assignmentDbRef = ref(getDatabase(), `Users/${userId}/assignments/${route.params.item.id}`);
  
    // Delete the assignment from Realtime Database
    await dbRemove(assignmentDbRef);
  };
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: url }} />
      <Text style={styles.text}>{route.params.item.title}</Text>
      <Text style={styles.subtitle}>time taken: {mins} minutes</Text>

      <View style={styles.icons}>
        <View style={{ width: "30%", padding: 5, bottom: 20 }}>
          <AppButton
            color="secondary"
            title="Complete"
            onPress={() => {
                firebase.updateRequest(route.params.item.kid, mins, route.params.item.title);
                deleteAssignment();

            }}
          />
        </View>
      </View>
      <View style={styles.button}>
        <AppButton
          title="Back"
          onPress={() => 
            navigation.navigate("HomeFile")}
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
    width: "90%",
    bottom: 20,
  },
  text: { fontSize: 30, margin: 10 },
  subtitle: {
    fontSize: 20,
    margin: 10,
  },
  icons: {
    flexDirection: "row",
  },
});

export default CompleteAssignment;
