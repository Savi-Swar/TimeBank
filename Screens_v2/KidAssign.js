import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import MediumButton from '../Components_v2/MediumButton';
import CustomButton from '../Components_v2/CustomButton';
import Card from '../Components_v2/Card';
import * as firebase from '../firebase';
import { ScrollView } from 'react-native-gesture-handler';
import Minutes from '../Components_v2/Minutes';
import AsyncStorage from '@react-native-async-storage/async-storage';
function KidAssign({ navigation }) {
  const [assignments, setAssignments] = useState([]);
  const [kidName, setKidName] = useState("");
  const fetchKidDetails = async () => {
    try {
      const storedName = await AsyncStorage.getItem('@active_kid');
      if (storedName !== null) {
        // We have data!!
        setKidName(storedName);
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };
  useEffect(() => {
    fetchKidDetails();
    // Use the Assignments function and pass setAssignments as the callback
    const unsubscribeAssignments = firebase.Assignments(setAssignments);

    
    return () => unsubscribeAssignments();
  }, []);
  const correctAssignments = assignments.filter(assignment => assignment.kids.includes(kidName)) // Filter assignments that include the active kid's name
  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/10_tasks.png")}>
   <View style={{top:120}}>
      <Minutes/>
     </View>
    <FlatList 
      style={styles.flatList}
      data={correctAssignments}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.cardContainer} onPress={() => {
          // Handle navigation and passing data to detail screen
        }}>
          <Card 
            image={item.image} 
            title={item.title} 
            minutes={item.minutes}
            kids={item.kids}
            due = {item.date}
            location = "assignments"
            id = {item.id}
            isAdult = {false}
            // Add any other fields you need to display
          />
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
    />
  </ImageBackground>
  
  );
}

// Add styles for FlatList and CardContainer similar to ParentStore
const styles = StyleSheet.create({
  background: {
    flex: 1, // Ensure the background takes up the full screen
  },
  bigButtonContainer: {
    // Adjust as needed
    position: "absolute", // Use absolute positioning
    top: 180, // Adjust top position
    left: 20,
  },
  mediumButtonContainer: {
    // Adjust as needed
    position: "absolute", // Use absolute positioning
    top: 240, // Adjust top position
    right: 20, // Position to the right
  },
  flatList: {
    flex: 1, // Let the FlatList expand to fill available space
    top: 180, // Adjust top margin to avoid overlapping with buttons
  },
  cardContainer: {
    marginBottom: 25, // Spacing between cards
    // other styles as needed
    marginHorizontal:40,
    marginTop: 5
  },
});

export default KidAssign;
