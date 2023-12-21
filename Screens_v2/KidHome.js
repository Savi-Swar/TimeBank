import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text, FlatList, Image } from 'react-native';
import BlankButton from '../Components_v2/BlankButton';
import Card from '../Components_v2/Card';
import * as firebase from '../firebase';
import BubbleText from '../Components_v2/BubbleText';
import AsyncStorage from '@react-native-async-storage/async-storage';
function KidHome({ navigation }) {
  
  // hey pilot
  // why do i have a hook issue
  // i have a hook issue
  // i have a hook issue
  // because in your useEffect you are calling setKidName and setKidMinutes
  // which are hooks
  // and you can't call hooks inside of useEffect
  // so you need to move that logic outside of useEffect
  // and then call the hooks inside of useEffect
  // so you can do something like this:
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
.filter(assignment => assignment.kids.includes(kidName)) // Filter assignments that include the active kid's name
.sort((a, b) => new Date(a.due) - new Date(b.due))[0]; // Sort by due date and get the first item


  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/17_add.png")}>
      
      <View style = {{bottom: 40, alignItems: "center"}}>
        <View style ={{top:-10}}>
          <BubbleText style={styles.welcomeText} text={"Welcome " + kidName + "!"}  size={40}/>
        </View>
        <BubbleText style={styles.welcomeText} text={"You have " + kidMinutes + " minutes"} size={25}/>
      </View>
      <View style = {{bottom: 80}}>
          <Image style={styles.logo} source={require("../assets/icons/Logo.png")} />
          <Image style={styles.tagLine} source={require("../assets/icons/Tagline.png")} />
        </View>
      <View style={{bottom: 140}}>
      <View style={{bottom:10, right: 15}}>
        <BubbleText style={styles.welcomeText} text={"Next Assignment Due..."} size={28}/>
      </View>
      {closestAssignment ? (
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
      ) : (
        <BubbleText style={styles.welcomeText} text={"No Assignments due; Great Job!"} size={20}/>
      )}
      </View>
      <View style={{bottom: 110}}>
      <View style={{bottom:10, right: 10}}>
      <BubbleText style={styles.welcomeText} text={"Next item to buy..."} size={28}/>
      </View>

      {closestStoreItem ? (
        <Card 
          image={closestStoreItem.image} 
          title={closestStoreItem.title} 
          minutes={closestStoreItem.minutes}
        />
      ) : (
        <BubbleText style={styles.welcomeText} text={"No Items in store; Ask a parent to add them!"} size={20}/>
      )}
      </View>
      <BlankButton onPress={() => navigation.navigate("ParentHome")} text="Log Out" />
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
    // Add your styles for welcome text
  },
  noItemsText: {
    // Add your styles for no items text
  },
  logo: {
    width: 200,
    height: 300,
    resizeMode: "contain",
  },
  tagLine: {
    width: 200,
    height: 80,
    resizeMode: "contain",
    bottom:90
  },
  // ... other styles ...
});
export default KidHome;