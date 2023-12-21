import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import Screen from "../components/Screen";
import Card from "../components/Card";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as firebase from "../firebase";
import Minutes from "../components/Minutes";
function KidAssignScreen({ navigation, route }) {
  const [assignments, setAssignments] = useState([]);
  const [activeKid, setActiveKid] = useState(null);
  
  useEffect(() => {
    const fetchActiveKidAndAssignments = async () => {
      const activeKidName = await AsyncStorage.getItem('@active_kid');
      setActiveKid(activeKidName);
      
      const cleanup = firebase.Assignments((fetchedAssignments) => {
        const kidAssignments = fetchedAssignments.filter(
          (assignment) => assignment.kid === activeKidName
        );
        setAssignments(kidAssignments);
      });

      return cleanup; // Call cleanup function on component unmount
    };
  
    fetchActiveKidAndAssignments();
  }, []);

  return (
    <Screen style={{ backgroundColor: colors.light }}>
      <View style={styles.minutes}>
         <Minutes />
      </View>
      <View style={styles.screen}>
        <FlatList
          data={assignments}
          keyExtractor={(assignment) => assignment.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={()=>navigation.navigate("CompleteAssignment", {
                item: item,
              })}>
            <Card
              title={item.title}
              subTitle={item.minutes}
              image={item.image}
              id={item.id}
              location={"assignments"}
              due={item.dueDate}
              length = {assignments.length}
              numColumns = {2}
            />
            </TouchableOpacity>
          )}
        />
      </View>
    </Screen>
  );
}

export default KidAssignScreen;

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
