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
  const [times, setTimes] = useState([]);

  // Fetch requests when the component mounts or the route.params.name changes
  const combineData = (names, minutes, assignments, times) => {
    return names.map((name, index) => {
      return { 
        name: name, 
        minutes: minutes[index], 
        isAssignment: assignments[index], 
        time: times[index]  // Add the time here
      };
    });
  };
  
  
  // ...
  useEffect(() => {
    // Fetch the requests once component mounts
    const unsubscribe = firebase.getRequests(setNames, setMins, setIsAssignment, route.params.name, setTimes);
  
    return () => unsubscribe(); // Unsubscribe when the component unmounts
  }, []);
  
  useEffect(() => {
    // Combine names, minutes, assignments, and times into a single array of objects
    const combinedData = combineData(names, mins, isAssignment, times);
    setRequests(combinedData);
  }, [names, mins, isAssignment, times]); // Include times in the dependency array
  
  

  if (!loaded) {
    return null;
  }

  
const removeRequestFromState = (identifier) => {
  setRequests((currentRequests) => currentRequests.filter(request => request.time !== identifier));
};

  const handleApprove = async (index, kid, minutes) => {
    const numericMinutes = parseInt(minutes, 10);
    playSound('approve');
    if (isNaN(numericMinutes)) {
      console.error("Invalid minutes value:", minutes);
      return;
    }
    try {
      await firebase.addMins(numericMinutes, kid);
      if (requests[index].isAssignment !== "false") {
        await firebase.completeAssignmentForKid(requests[index].isAssignment, kid);
      }
      await firebase.removeRequest(kid, index);
      removeRequestFromState(requests[index].time);
    } catch (error) {
      console.error('Error handling approve:', error);
    }
};

const handleDeny = async (index, kid) => {
    playSound('deny');
    try {
      await firebase.removeRequest(kid, index);
      removeRequestFromState(requests[index].time);
    } catch (error) {
      console.error('Error handling deny:', error);
    }
};


  let empty = requests.length == 0;
  let name = route.params.name.replace(/_/g, ' ');
  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/18_Max'sActivities.png")}>
      <View style = {{alignItems:"center", position: "absolute", top: verticalScale(40)}}>

        <Text style={{fontFamily: "BubbleBobble", fontSize: moderateScaleFont(35), color: "#000000"}}>
          {name}'s Activity
        </Text>
      </View>
      <View style={{top: verticalScale(130), marginBottom: verticalScale(200)}}>
        {empty ? ( 
          <View style= {{alignItems: "center", bottom: verticalScale(140)}}>
          <Text style={{fontFamily: "BubbleBobble", fontSize: moderateScaleFont(30), color: "#000000"}}>
            There are no Requests from 
          </Text>
          <Text style={{fontFamily: "BubbleBobble", fontSize: moderateScaleFont(30), color: "#000000"}}>
          {name}
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
              time = {item.time}
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
