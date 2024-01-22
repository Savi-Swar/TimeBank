import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import BlankButton from '../Components_v2/BlankButton';
import Card from '../Components_v2/Card';
import * as firebase from '../firebase';
import BubbleText from '../Components_v2/BubbleText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale, verticalScale, moderateScaleFont } from '../scaling';
import { playSound } from '../audio';

function KidHome({ navigation }) {

  const [kidName, setKidName] = useState('');
  const [kidMinutes, setKidMinutes] = useState(0);
  const [assignments, setAssignments] = useState([]);
  const [storeItems, setStoreItems] = useState([]);

  const [minutes, setMinutes] = useState(0);
  firebase.Store(storeItems, setStoreItems);
  const fetchKidDetails = async () => {
    try {
      const storedName = await AsyncStorage.getItem('@active_kid');
      if (storedName !== null) {
        // We have data!!
        setKidName(storedName);
        firebase.Mins(minutes, setMinutes, storedName);
        setKidName(storedName)
        setKidMinutes(minutes); 

      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchKidDetails();
    const unsubscribeAssignments = firebase.Assignments(setAssignments);

    
    return () => unsubscribeAssignments();
  }, []);
  
  // Determine the closest store item
  const closestStoreItem = storeItems
    .filter(item => item.minutes > kidMinutes)
    .sort((a, b) => a.minutes - b.minutes)[0] || 
    storeItems.sort((a, b) => b.minutes - a.minutes)[0];

  // Sort assignments by due date and find the closest one
  // Assuming kidName holds the name of the active kid
  const closestAssignment = assignments
  .filter(assignment => Array.isArray(assignment.kids) && assignment.kids.includes(kidName))
  .sort((a, b) => new Date(a.due) - new Date(b.due))[0];
  let name = kidName.replace(/_/g, ' ');

  if (name.length > 20) {
    name = name.substring(0, 20) + "...";
  }
  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/17_add.png")}>
      
      <View style = {{bottom: verticalScale(100), alignItems: "center"}}>
        <View style ={{top: verticalScale(-10)}}>
          <BubbleText style={styles.welcomeText} text={"Welcome " + name + "!"}  size={moderateScaleFont(40)}/>
        </View>
        <BubbleText style={styles.welcomeText} text={"You have " + minutes + " minutes"} size={moderateScaleFont(25)}/>
      </View>
      <View style = {{bottom: verticalScale(90), alignItems: "center"}}>
          <Image style={styles.logo} source={require("../assets/icons/Logo.png")} />
          <Image style={styles.tagLine} source={require("../assets/icons/Tagline.png")} />
        </View>
      <View style={{bottom: verticalScale(70)}}>
      <View style={{bottom: verticalScale(0), alignItems: "center"}}>
        <BubbleText style={styles.welcomeText} text={"Next Assignment Due"} size={moderateScaleFont(28)}/>
      </View>
      {closestAssignment ? (
        <TouchableOpacity onPress={() => {navigation.navigate("TaskDetails", {
          title: closestAssignment.title,
          minutes: closestAssignment.minutes,
          imageUri: closestAssignment.image,
          assignment: true,
          id: closestAssignment.id,
          isAdult: false,
      }), playSound("transition")}}>
        <Card 
          image={closestAssignment.image} 
          title={closestAssignment.title} 
          minutes={closestAssignment.minutes}
          due={closestAssignment.date}
          location = "assignments"
          id = {closestAssignment.id}
          kids = {closestAssignment.kids}
          isAdult = {false}
        />
        </TouchableOpacity>
      ) : (
        <BubbleText style={styles.welcomeText} text={"No Assignments due; Great Job!"} size={20}/>
      )}
      </View>
      <View style={{bottom: verticalScale(60)}}>
      <View style={{bottom: verticalScale(0), alignItems: "center"}}>
        <BubbleText style={styles.welcomeText} text={"Next item to buy"} size={moderateScaleFont(28)}/>
      </View>

      {closestStoreItem ? (
        <TouchableOpacity 
        onPress={() => {
          if (minutes >= closestStoreItem.minutes) {
          playSound("transition")
          navigation.navigate('StoreDetails', {
          title: closestStoreItem.title,
          imageUri: closestStoreItem.image,
          minutes: closestStoreItem.minutes
        })
          } else {
            playSound("alert")
            Alert.alert("You don't have enough minutes to buy this item!")
          }}}
        style={styles.cardContainer}
      >
          <Card 
            image={closestStoreItem.image} 
            title={closestStoreItem.title} 
            minutes={closestStoreItem.minutes}
            isAdult = {false}
          />
        </TouchableOpacity>
      ) : (
        <BubbleText style={styles.welcomeText} text={"No Items in store; Ask a parent to add them!"} size={20}/>
      )}
      </View>
      <View style = {{position: "absolute", bottom: verticalScale(125)}}>
      <BlankButton onPress={() => navigation.replace('ParentHome', {canFetchUserData: true})} text="Log Out" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
 
  },
  noItemsText: {
    // Add your styles for no items text
  },
  logo: {
    width: scale(250),
    height: verticalScale(173),
    resizeMode: "contain",
  },
  tagLine: {
    width: scale(215),
    height: verticalScale(40),
    resizeMode: "contain",
  },
  // ... other styles ...
});
export default KidHome;