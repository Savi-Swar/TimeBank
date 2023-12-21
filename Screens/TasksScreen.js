import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import colors from "../config/colors";
import Screen from "../components/Screen";
import Card from "../components/Card";
import AppButton from "../components/AppButton";
import Minutes from "../components/Minutes";
import * as firebase from "../firebase";
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
                navigation.navigate("EditScreen", {
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
                length = {tasks.length}
                numColumns = {2}
              />
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.button}>
      {isAdult && 
        <AppButton
          color="secondary"
          title="Add More +"
          onPress={() => 
              navigation.navigate("CreateTask", {
                location: "tasks",
                loconame: "Tasks",
                isAdult: true
              })
      }/>
      }
      </View>
    </Screen>
  );
}

export default TasksScreen;
const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
    paddingHorizontal: 20,
    flex: 1,
  },
  button: {  paddingHorizontal:20 },
  minutes: {
    flex: 0.15,
    backgroundColor: colors.light
  }
});
