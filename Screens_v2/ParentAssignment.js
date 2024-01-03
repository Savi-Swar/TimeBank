import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Text } from 'react-native';
import MediumButton from '../Components_v2/MediumButton';
import CustomButton from '../Components_v2/CustomButton';
import Card from '../Components_v2/Card';
import * as firebase from '../firebase';
import {scale, verticalScale, moderateScaleFont} from '../scaling';

function ParentAssignment({ navigation }) {
  const [assignments, setAssignments] = useState([]);


  useEffect(() => {
    // Use the Assignments function and pass setAssignments as the callback
    const unsubscribe = firebase.Assignments(setAssignments);

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, []);
  let empty = assignments.length === 0;
  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/16_parent_dashboard.png")}>
    <View style={styles.bigButtonContainer}>
      <MediumButton 
        onPress={() => navigation.navigate("ParentMenu")} 
        imageUrl={require("../assets/buttons/BackToKids.png")} 
      />
    </View>
  
    <View style={styles.mediumButtonContainer}>
      <CustomButton onPress={() => navigation.navigate("CreateAssignment")} width={scale(54)} height = {verticalScale(54)} imageUrl={require("../assets/buttons/add.png")} />
    </View>
    {empty ? ( 
          <View style= {{alignItems: "center", bottom: verticalScale(-400)}}>
          <Text style={{fontFamily: "BubbleBobble", fontSize: moderateScaleFont(30), color: "#000000"}}>
            There are no Assignments 
          </Text>
          <Text style={{fontFamily: "BubbleBobble", fontSize: moderateScaleFont(30), color: "#000000"}}>
          Add Using the + Button
        </Text>
        </View>
         ) : (
    <FlatList 
      style={styles.flatList}
      data={assignments}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.cardContainer} 
          onPress={() => navigation.navigate("EditAssignment", {
            assignmentData: item,
          })}>
          <Card 
            image={item.image} 
            title={item.title} 
            minutes={item.minutes}
            kids={item.kids}
            due = {item.date}
            location = "assignments"
            id = {item.id}
            // Add any other fields you need to display
          />
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
    />)}
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
    top: verticalScale(165), // Adjust top position
    left: scale(20),
  },
  mediumButtonContainer: {
    // Adjust as needed
    position: "absolute", // Use absolute positioning
    top: verticalScale(225), // Adjust top position
    right: scale(20), // Position to the right
  },
  flatList: {
    flex: 1, // Let the FlatList expand to fill available space
    top: verticalScale(280), // Adjust top margin to avoid overlapping with buttons
  },
  cardContainer: {
    // other styles as needed
    marginHorizontal: scale(22),
    marginTop: verticalScale(5)
  },
});

export default ParentAssignment;
