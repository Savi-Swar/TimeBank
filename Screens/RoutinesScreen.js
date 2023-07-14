import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import Screen from "../components/Screen";
import Minutes from "../components/Minutes";
import Routine_Header from "../components/Routine_Header";
import * as firebase from "../firebase";
import LottieView from "lottie-react-native";

function RoutinesScreen({ navigation, route}) {  // Set default value here
  const [routines, setRoutines] = useState([]);
  const isAdult = route.params?.isAdult || false; // If isAdult is not passed or is undefined, it will default to false

  firebase.Routines(routines, setRoutines);
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
              <Routine_Header isAdult = {isAdult} title={item.title} id={item.id}
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
              No routines found. Add one below!
            </Text>
          </View>
        )}
      </View>
      <View style={styles.addButton}>
        <AppButton
          title="Add+"
          onPress={() => navigation.navigate("CreateRoutineSet", {isAdult: true})}
        />
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
