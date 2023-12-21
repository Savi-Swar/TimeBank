import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import Screen from "../components/Screen";
import Minutes from "../components/Minutes";
import Routine_Header from "../components/Routine_Header";
import * as firebase from "../firebase";
import LottieView from "lottie-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, onValue } from "firebase/database";
const db = getDatabase();

function RoutinesScreen({ navigation, route}) {  // Set default value here
  const [routines, setRoutines] = useState([]);
  const isAdult = route.params?.isAdult || false; // If isAdult is not passed or is undefined, it will default to false
  const [kidName, setKidName] = useState(null);
  const [loading, setLoading] = useState(true);
  const getActiveKid = async () => {
    try {
      const value = await AsyncStorage.getItem('@active_kid');
      if(value !== null) {
        setKidName(value);
      } else {
        console.log('Value is null')
      }
    } catch(e) {
      console.log('Error:', e); // Log the error
    }
  }
  useEffect(() => {
    getActiveKid();

    const userId = firebase.auth.currentUser.uid;
    const routinesRef = ref(db, `Users/${userId}/routines`);
    onValue(routinesRef, (snapshot) => {
      let fetchedRoutines = [];
      snapshot.forEach((childSnapshot) => {
        fetchedRoutines.push({ ...childSnapshot.val(), id: childSnapshot.key });
      });

      let filteredRoutines = fetchedRoutines;
      if (!isAdult && kidName) {
        filteredRoutines = fetchedRoutines.filter((routine) =>
            routine.kids && routine.kids.includes(kidName)
        );
    }

      setRoutines(filteredRoutines);
      setLoading(false);
    });
  }, [isAdult, kidName]);
  
 
  return (
    <Screen style = {styles.fullScreen}>
      <View style={styles.MinBar}>
      {isAdult ? <AppButton title="Back to Kids View" onPress={() => navigation.navigate("KidsScreen")} /> : <Minutes />}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.text}>Routines</Text>
      </View>
      <View style={styles.screen}>
        {routines.length > 0 ? (
          <FlatList
            data={routines}
            keyExtractor={(routines) => routines.id}
            renderItem={({ item }) => (
              <Routine_Header isAdult = {isAdult}       title={item.title.replace(/-/g, ' ')} // replaces dashes with spaces
              id={item.id}
               st = {item.startTime} et = {item.endTime} days = {item.days} months = {item.months}/>
            )}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <LottieView
              source={require("../animations/no_routine.json")}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.emptyStateText}>
              No routines found. Ask your parents to add one!
            </Text>
          </View>
        )}
      </View>
      <View style={styles.addButton}>
        {isAdult && 
        <AppButton
          title="Add+"
          onPress={() => navigation.navigate("CreateRoutineSet", {isAdult: true})}
        />
        }
      </View>
    </Screen>
  );
}

export default RoutinesScreen;

const styles = StyleSheet.create({
  fullScreen: {
    backgroundColor: colors.light,
  },
  screen: {
    backgroundColor: colors.light,
    top: 20,
    flex: 1,
  },
  MinBar: {
    flex: 0.2,
    alignItems: "center",
    padding: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 30,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark
  },
  emptyStateText: {
    fontSize: 20,
    color: colors.medium,
    textAlign: "center",
    marginTop: 20,
  },
  lottie: {
    width: 250,
    height: 250,
  },
  addButton: {
    padding: 20,
    paddingBottom: 40,
  },
});
