import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image, Text, FlatList } from 'react-native';
import Requests from '../Components_v2/Requests'; // Ensure this component can accept props and render a list
import { useFonts } from 'expo-font';
import * as firebase from "../firebase"; // ensure correct path
import BlankButton from '../Components_v2/BlankButton';
import { playSound } from '../audio';
import { scale, verticalScale, moderateScaleFont } from '../scaling';

function Activities({ navigation, route }) {
  const [loaded] = useFonts({
    BubbleBobble: require("../assets/fonts/BubbleBobble.ttf"),
  });

  // State to hold the fetched requests
  const [requests, setRequests] = useState([]);
  const [names, setNames] = useState([]);
  const [mins, setMins] = useState([]);
  const [isAssignment, setIsAssignment] = useState(false);
  // Fetch requests when the component mounts or the route.params.name changes
  const combineData = (names, minutes, assignments) => {
    return names.map((name, index) => {
      return { name: name, minutes: minutes[index], isAssignment: assignments[index] };
    });
  };
  
  // ...
  useEffect(() => {
    // Fetch the requests once component mounts
    const unsubscribe = firebase.getRequests(setNames, setMins, setIsAssignment, route.params.name);
  
    return () => unsubscribe(); // Unsubscribe when the component unmounts
  }, []);
  
  useEffect(() => {
    // Combine names and minutes into a single array of objects when either updates
    const combinedData = combineData(names, mins, isAssignment);
    setRequests(combinedData);
  }, [names, mins, isAssignment]);
  

  if (!loaded) {
    return null;
  }

  const removeRequestFromState = (index) => {
    setRequests((currentRequests) => currentRequests.filter((_, i) => i !== index));
  };

  const handleApprove = (index, kid, minutes) => {
    // Convert minutes to a number if it's a string
    const numericMinutes = parseInt(minutes, 10);
    playSound('approve')
    // Check if numericMinutes is a valid number
    if (isNaN(numericMinutes)) {
      console.error("Invalid minutes value:", minutes);
      return; // Exit the function if numericMinutes is not valid
    }
    
    firebase.addMins(numericMinutes, kid)

    if (!(requests[index].isAssignment == "false")) {
      firebase.completeAssignmentForKid(requests[index].isAssignment, kid)
    }
    firebase.removeRequest(kid, index)

      .then(() => {
        removeRequestFromState(index);
      })
      .catch((error) => {
        console.error('Error adding minutes:', error);
      });
  };

  const handleDeny = (index, kid) => {
    firebase.removeRequest(kid, index)
    playSound('deny')
      .then(() => {
        removeRequestFromState(index);
      })
      .catch((error) => {
        console.error('Error denying request:', error);
      });
  };

  let empty = requests.length == 0;

  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/18_Max'sActivities.png")}>
      <View style = {{alignItems:"center", position: "absolute", top: verticalScale(40)}}>

        <Text style={{fontFamily: "BubbleBobble", fontSize: moderateScaleFont(35), color: "#00000"}}>
          {route.params.name}'s Activities
        </Text>
      </View>
      <View style={{top: verticalScale(100), marginBottom: verticalScale(200)}}>
        {empty ? ( 
          <View style= {{alignItems: "center", bottom: verticalScale(140)}}>
          <Text style={{fontFamily: "BubbleBobble", fontSize: moderateScaleFont(30), color: "#00000"}}>
            There are no Requests from 
          </Text>
          <Text style={{fontFamily: "BubbleBobble", fontSize: moderateScaleFont(30), color: "#00000"}}>
          {route.params.name}
        </Text>
        </View>
         ) : (

        <FlatList
          data={requests}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Requests
              name={item.name}
              kid={route.params.name}
              minutes={item.minutes}
              isAssignment = {item.isAssignment}
              onApprove={() => handleApprove(index, route.params.name, item.minutes)}
              onDeny={() => handleDeny(index, route.params.name)}
            />
          )}
        />
          )}
      </View>
      <View style = {{position: "absolute", top: verticalScale(800)}}>
        <BlankButton 
          onPress={() => {navigation.navigate("ParentMenu")}}
          text = {"Back to Menu"}
        />
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
  image: {
    width: scale(320),
    height: verticalScale(175),
    resizeMode: "contain",
    bottom: verticalScale(250),
    right: scale(20)
  },
  skip: {
    width: scale(70),
    height: verticalScale(35),
    resizeMode: "contain",
    bottom: verticalScale(280),
    left: scale(150)
  },
  // Add a new container style for the ImageButton to position it 100px below the BubbleText image
  imageButtonContainer: {
    position: 'absolute',
    top: verticalScale(220),      // Adjust this value to perfectly center the button below the BubbleText
    left: scale(25),
    alignSelf: 'center',
    marginTop: verticalScale(100),  // This moves the button 100px below
  }
});

export default Activities;
