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
  return (
    // <View></View>
    <Screen>
      <View style={styles.minutes}>
        <Minutes />
      </View>
      <View style={styles.screen}>
        <FlatList
          data={tasks}
          keyExtractor={tasks => tasks.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("CompleteTaskScreen", {
                  item: item,
                });
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
          onPress={() =>
            navigation.navigate("CreateTask", {
              location: "tasks",
              loconame: "TasksScreen",
            })
          }
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
