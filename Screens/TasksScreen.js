import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import colors from "../config/colors";
import Screen from "../components/Screen";
import Card from "../components/Card";
import AppButton from "../components/AppButton";
import Minutes from "../components/Minutes";
import * as firebase from "../firebase";
import { Firestore } from "firebase/firestore";
import { TabRouter } from "@react-navigation/native";

function TasksScreen({ navigation, route }) {
  const [tasks, setTasks] = useState([]); // Initial empty array of users
  firebase.Tasks(tasks, setTasks);
  const isAdult = route.params?.isAdult || false; // If isAdult is not passed or is undefined, it will default to false

  return (
    // <View></View>
    <Screen style = {{backgroundColor: colors.light}}>
      <View style={styles.minutes}>
      {isAdult ? <AppButton title="Back to Kids View" onPress={() => navigation.navigate("KidsScreen")} /> : <Minutes />}
      </View>
      <View style={styles.screen}>
        <FlatList
          data={tasks}
          keyExtractor={tasks => tasks.id}
          renderItem={({ item }) => (
            <TouchableOpacity
            onPress={() => {
              if (route.params?.isAdult === true) {
                navigation.navigate("CompleteTaskScreen", {
                  item: item,
                  isAdult: true
                });    
              } else {
                navigation.navigate("CompleteTaskScreen", {
                  item: item,
                });                }
              
            }}
            >
              <Card
                title={item.title}
                subTitle={item.minutes}
                image={item.image}
                id={item.id}
                location={"tasks"}
              />
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.button}>
        <AppButton
          color="secondary"
          title="Add More +"
          onPress={() => {
            if (route.params?.isAdult === true) {
              navigation.navigate("CreateTask", {
                location: "tasks",
                loconame: "TasksScreen",
                isAdult: true
              })             
            } else {
              navigation.navigate("CreateTask", {
                location: "tasks",
                loconame: "TasksScreen",
              })              
             }
            
          }}
        />
      </View>
    </Screen>
  );
}

export default TasksScreen;
const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
    paddingHorizontal: 20,
    flex: 0.8,
    top: 10,
  },
  minutes: { flex: 0.15 },
  button: { flex: 0.1, paddingHorizontal: 20, top: 5 },
});
