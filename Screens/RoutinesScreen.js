import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import Screen from "../components/Screen";
import Card from "../components/Card";
import Minutes from "../components/Minutes";
import Routine_Header from "../components/Routine_Header";
import * as firebase from "../firebase";

function RoutinesScreen({ navigation }) {
  const [routines, setRoutines] = useState([]); // Initial empty array of users

  firebase.Routines(routines, setRoutines);
  return (
    <Screen>
      <View style={styles.MinBar}>
        <Minutes />
      </View>

      <View style={{  alignItems: "center" }}>
        <Text style={styles.text}>Routines</Text>
      </View>
      <View style={styles.screen}>
        <FlatList
          data={routines}
          keyExtractor={routines => routines.id}
          renderItem={({ item }) => (
            <Routine_Header
              title={item.title}
              id={item.id}
            />
          )}
        /> 
      </View>
      <View style={{ padding: 20 }}>
        <AppButton
          title="Add+"
          onPress={() => navigation.navigate("CreateRoutineSet")}
        />
      </View>
    </Screen>
  );
}

export default RoutinesScreen;
const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
    top: 20,
  },
  MinBar: {
    flex: 0.2,
    alignItems: "center",
    padding:20

  },
  text: {
    fontSize: 30,
  },
});
