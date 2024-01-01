
import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Modal, Button, ImageBackground, Text, TouchableOpacity } from "react-native";
import { Kids, useRoutineTitles } from "../firebase";
import colors from "../config/colors";
import Screen from "../components/Screen";
import KidsViewer from "../Components_v2/KidViewer";
import Card from "../components/Card";
import AppButton from "../components/AppButton";
import * as firebase from "../firebase";
import BlankButton from "../Components_v2/BlankButton";
import BubbleText from "../Components_v2/BubbleText";
import { playSound } from "../audio";
import { scale, verticalScale, moderateScaleFont } from "../scaling";
function ParentMenu({ navigation }) {
  const [kids, setKids] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  Kids(kids, setKids); 
  const { titles, loading } = useRoutineTitles();
 
  const handleEditContents = () => {
    playSound("click")
    setModalVisible(true);
  };

  const handleButtonPress = (screen) => {
    setModalVisible(false);
    navigation.navigate(screen , {isAdult: true});
  };
  function organizeKidsData(kids, routineTitles) {
    // Go through each kid's data
    return kids.map(kid => {
      // Initialize an empty object for routineStats
      const routineStats = {};
  
      // Make a shallow copy of the kid object to avoid mutation
      let kidCopy = { ...kid };
  
      // Iterate over each property in the kid object
      for (let key in kidCopy) {
        // If the key matches one of the routine titles, move it to routineStats
        if (routineTitles.includes(key) && typeof kidCopy[key] === 'object') {
          // Directly assign the routine data to routineStats
          routineStats[key] = { ...kidCopy[key] }; // Spread operator to copy the routine data
          delete kidCopy[key]; // Remove the routine data from the copy of the kid object
        }
      }
  
      // Return the modified copy of the kid object with a new routineStats property
      return { ...kidCopy, routineStats };
    });
  }
  
  
  
  const [needsOrganization, setNeedsOrganization] = useState(true);
  const [organizedKids, setOrganizedKids] = useState([]);
  useEffect(() => {
    if (!loading && kids.length > 0 && needsOrganization) {
      const organized = organizeKidsData(kids, titles);
      setOrganizedKids(organized);
      setNeedsOrganization(false); // Set to false to prevent re-organizing on every render
    }
  }, [kids, titles, loading, needsOrganization]); // Now depends on needsOrganization

  // Remember to reset needsOrganization when kids data changes
  useEffect(() => {
    setNeedsOrganization(true);
  }, [kids]);
  
  return (
      <ImageBackground style={styles.background} source={require("../assets/backgrounds/17_add.png")}>
        <TouchableOpacity onPress={handleEditContents} style={{top: verticalScale(50), left: scale(1), marginBottom: verticalScale(50), alignItems: "center"}}>
          <BubbleText text={"Edit Contents"} size={moderateScaleFont(30)} underline= {true} color="#21BF73"/>
        </TouchableOpacity>
        <Modal animationType="slide" visible={modalVisible}>
          <View style={{width:'80%', alignItems: "center", justifyContent:"center", flex:1, left: scale(40), marginVertical: verticalScale(100)}}>
          
          <BlankButton
            text="Routines"
            onPress={() => handleButtonPress("ParentRoutine")}
          />
          <BlankButton
            text="Store"
            onPress={() => handleButtonPress("ParentStore")}
          />
          <BlankButton
            text="Task"
            onPress={() => handleButtonPress("ParentTask")}
          />
          <BlankButton
            text="Assignments"
            onPress={() => handleButtonPress("ParentAssignment")}
            />
          <BlankButton text="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>

        <FlatList
          data={organizedKids}
          keyExtractor={(kids) => kids.id}
          renderItem={({ item }) => (
            <View style={{marginVertical: verticalScale(10), left: scale(10)}}>
              <KidsViewer 
              name={item.name} 
              // minutes={item.minutes}
              profilePic={item.profilePic}
              navigation={navigation}
              // weekly={item.WeeklyMinutesEarned} 
              // spent = {item.MinutesSpent}
              // earned = {item.MinutesAccumulated}
              // weeklyArray = {item.WeeklyArray}
              // routineStats = {item.routineStats}
              />
              </View>
          )}
        />
        <View style={{alignItems: "center", bottom: verticalScale(20)}}>
          <BlankButton text="Back" 
          onPress={()=> {navigation.navigate("ParentHome");
          }}/>
        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});

export default ParentMenu;
