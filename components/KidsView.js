import React, { useState, useEffect } from "react";
import colors from "../config/colors";
import Screen from "./Screen";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import AppButton from "../components/AppButton";
import { useNavigation } from "@react-navigation/native";
import * as firebase from "../firebase";
import { remove, ref, getDatabase } from "firebase/database";
import { Entypo } from '@expo/vector-icons';

function KidsView({ title, minutes, name, weekly, spent, earned, weeklyArray }) {
  const [names, setNames] = useState([]);
  const [mins, setMins] = useState([]);
  const userId = firebase.auth.currentUser.uid;
  let navigation = useNavigation();
  useEffect(() => {
    firebase.getRequests(setNames, setMins, title);
  }, []);

  const handleDelete = () => {
    Alert.alert(
      "Delete Kid",
      `Are you sure you want to delete ${title}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK", 
          onPress: () => {
            const kidRef = ref(getDatabase(), `Users/${userId}/kids/${title}`);
            remove(kidRef)
              .then(() => {
                console.log(`${title} removed from database`);
              })
              .catch((error) => {
                console.error("Error removing document: ", error);
              });
          }
        }
      ]
    );
  };
  return (
    <Screen style={styles.card}>
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title} - {names.length} Requests
        </Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Entypo name="circle-with-cross" size={35} color="red" />
        </TouchableOpacity>
      </View>
      <View style = {{width: "90%", alignItems:"center", justifyContent: "center", padding: 20, left: 15}}>
      <AppButton title = "view" style={styles.button}  
            onPress={() =>
                navigation.navigate("Stats", {
                  minutes: minutes,
                  name: title,
                  weekly: weekly,
                  spent: spent,
                  earned: earned,
                  weeklyArray: weeklyArray,
                })
              }/>
      </View>
    </Screen>
  );
}
export default KidsView;

// Add to your styles
const styles = StyleSheet.create({
  deleteButton: {
    position: "absolute",
    right: 20, // Adjust as needed
    top: 20, // Adjust as needed
  },
 
  deleteText: {
    color: colors.primary,
    fontWeight: "bold",
  },
  detailsContainer: {
    padding: 20,
  },
  subtitle: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 15,
  },
  title: {
    marginBottom: 7,
    fontSize: 30,
  },
  card: {
    backgroundColor: colors.white,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  image: {
    height: 200,
    width: "100%",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,  },
  text: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "bold",
  },
});
