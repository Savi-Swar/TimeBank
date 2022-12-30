import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, FlatList, Button } from "react-native";
import RoutineBar from "../components/RoutineBar";
import Screen from "../components/Screen";
import colors from "../config/colors";
import * as firebase from "../firebase";
import AppButton from "../components/AppButton";
import CreateRoutine from "./CreateRoutine";
function RoutineViewScreen({ navigation, route }) {
  const [routines, setRoutines] = useState([]);
  useEffect(() => {
    return () => {
      setRoutines([]); // This worked for me
    };
  }, []);
    firebase.RoutinesCollections(
      routines,
      setRoutines,
      route.params.title,
      route.params.id,
    );
  
      let x = routines.length
    function nav() {
      navigation.navigate("HomeFile")
    }
  return (
    <Screen style={styles.container}>
      <View style={[styles.title, { backgroundColor: colors["primary"] }]}>
        <AppButton title="Back" onPress = { ( ) => nav()}/>
        <Text style={styles.text}>{route.params.title}</Text>
      </View>
      <FlatList
        data={routines}
        keyExtractor={routines => routines.id}
        renderItem={({ item }) => (
          <RoutineBar
            title={item.title}
            graphic={item.graphic}
            time={item.time}
            id={item.id}
            colTitle={route.params.title}
            colId={route.params.id}
          />
        )}
      />
      <View style={{ padding: 20, }}>
        <AppButton
          title="Add+"
          onPress={() =>
            navigation.navigate("CreateRoutine", {
              name: route.params.title,
              id: route.params.id,
            })
          }
        />
        <AppButton title = "Complete" onPress={() =>
            navigation.navigate("FinishedRoutineScreen", {
              obj: routines[x-1]
            })
            }
          />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  text: {
    fontSize: 30,
  },
  title: {
    alignItems: "center",
    padding: 10,
  },
});

export default RoutineViewScreen;
