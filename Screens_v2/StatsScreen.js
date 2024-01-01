import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ImageBackground, Text, ActivityIndicator, Platform } from 'react-native';
import StatCard from '../Components_v2/StatCard';
import BubbleText from '../Components_v2/BubbleText';
import BlankButton from '../Components_v2/BlankButton';
import Graphs from '../Components_v2/Graph';
import { ScrollView } from 'react-native-gesture-handler';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';
import { Kids, useRoutineTitles, kidData } from "../firebase"; // Importing the Kids function


function StatsScreen({navigation, route}) {
  let title = route.params.name + "'s Stats";
  let t2 = route.params.name + "'s Activity";
  const [kids, setKids] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  kidData(kids, setKids, route.params.name); 
  const { titles, loading } = useRoutineTitles();
 
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
      setIsLoading(false);
    }
  }, [kids, titles, loading, needsOrganization]); // Now depends on needsOrganization

  // Remember to reset needsOrganization when kids data changes
  useEffect(() => {
    setNeedsOrganization(true);
  }, [kids]);
    // console.log(organizedKids)
    

    
    let kidsData = kids[0];
    let organizedKidsData = organizedKids[0];
    if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
    let android = Platform.OS === 'android';
    return (
        <ImageBackground style={styles.background} source={require("../assets/backgrounds/15_morning_routine.png")}>
          <ScrollView>
          <View style={{alignItems: "center", top: verticalScale(50)}}>
          <View style={{marginBottom: verticalScale(20)}}>
            <BubbleText size = {moderateScaleFont(40)}  text={title} />
          </View>

            <View style={{marginBottom: verticalScale(20)}}>
              <StatCard stat = "Minutes" minutes={kidsData.minutes} width = {(100)} icon = {require("../assets/icons/Monkey.png")}/>
            </View>
            <View style={{marginBottom: verticalScale(20)}}>
              <StatCard stat = "Minutes Earned This Week" minutes={kidsData.WeeklyMinutesEarned} width = {(70)} icon = {require("../assets/icons/baby.png")}/>
            </View>
            <View style={{marginBottom: verticalScale(20)}}>
              <StatCard stat = "Total Minutes Earned" minutes={kidsData.MinutesAccumulated} width = {(90)} icon = {require("../assets/icons/kid.png")}/>
            </View>
            <View style={{marginBottom: verticalScale(20)}}>
              <StatCard stat = "Total Minutes Spent" minutes = {kidsData.MinutesSpent} width = {(70)} icon = {require("../assets/icons/astronaut.png")}/>
            </View>
             
              { !android && (
                <View style={{marginBottom: verticalScale(20), right: 5, flexDirection: "row"}}>   
                  <View style = {{left: scale(30), top: verticalScale(170)}}>
                    <Text style = {styles.yAxisLabel}>Minutes</Text>   
                  </View>   
                <Graphs weeklyArray={kidsData.WeeklyArray} title = "Last 10 Weeks" Yaxis={"Minutes"} Xaxis={"Weeks"}/> 
              </View>

              )}
            <BlankButton text={"Routine Stats"} onPress={() => navigation.navigate("RoutineStats",
            {routineStats: organizedKidsData.routineStats}
            )}/>

            <BlankButton text={t2} onPress={() => navigation.navigate("Activities", {
              name: route.params.name
            
            })}/>
            <BlankButton text={"Back to Menu"} onPress={() => navigation.navigate("ParentMenu")}/>

            <View style={{marginBottom: verticalScale(50)}}>

            </View>

          </View>
          </ScrollView>
        </ImageBackground>
        );
}

const styles = StyleSheet.create({
  background: {
    flex: 1
  },
  yAxisLabel: {
    // Style for the Y-axis label "Minutes"
    color: '#650000', // Color of the text
    fontSize: moderateScaleFont(20), // Size of the font
    transform: [{ rotate: '-90deg' }], // Rotate the text to align vertically
    textAlign: 'center', // Center the text in the rotated view
  },
});

export default StatsScreen;