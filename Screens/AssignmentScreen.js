import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import colors from "../config/colors";
import Screen from "../components/Screen";
import Card from "../components/Card";
import AppButton from "../components/AppButton";
import Minutes from "../components/Minutes";
import * as firebase from "../firebase";


function AssignmentScreen({ navigation, route }) {
    const [assignments, setAssignments] = useState([]);
  
    useEffect(() => {
      // Call firebase function and store the returned cleanup function
      const cleanup = firebase.Assignments(setAssignments);
      return cleanup; // Call cleanup function on component unmount
    }, []);

  return (
    <Screen style={{ backgroundColor: colors.light }}>
      <View style={styles.minutes}>
        <AppButton
          title="Back to Kids View"
          onPress={() => navigation.navigate("KidsScreen")}
        />
      </View>
      <View style={styles.screen}>
        <FlatList
          data={assignments}
          keyExtractor={(assignment) => assignment.id}
          renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
                navigation.navigate("EditScreen", {
                  item: item,
                  isAdult: true
                });    
            }}
            >
              <Card
                title={item.title}
                subTitle={item.minutes}
                image={item.image}
                id={item.id}
                location={"assignments"}
                kid={item.kid}
                due={item.dueDate}
                length = {assignments.length}
                numColumns = {2}
              />
              </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.button}>
        <AppButton
          color="secondary"
          title="Add More +"
          onPress={() => navigation.navigate("CreateAssignment")}
        />
      </View>
    </Screen>
  );
}

export default AssignmentScreen;

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
