import React, {useEffect, useState} from 'react';
import { View, StyleSheet, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import BigButton from '../Components_v2/BigButton';
import MediumButton from '../Components_v2/MediumButton';
import SmallButton from '../Components_v2/SmallButton';
import BackButton from '../Components_v2/BackButton';
import CustomButton from '../Components_v2/CustomButton';
import RoutineHeader from '../Components_v2/RoutineHeader';
import * as firebase from '../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';

function RoutineScreen({ navigation }) {
  const [routines, setRoutines] = useState([]);
  const [kidName, setKidName] = useState("");
  const fetchKidDetails = async () => {
    try {
      const storedName = await AsyncStorage.getItem('@active_kid');
      if (storedName !== null) {
        setKidName(storedName);

      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };
  firebase.Routines(routines, setRoutines);

  useEffect(() => {
    fetchKidDetails();
  }, []);
  const correctRoutines = routines.filter(routines => routines.kids.includes(kidName)) // Filter assignments that include the active kid's name

  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/20_parent's-routine.png")}>
      <View style={styles.listContainer}>
        <FlatList 
          data={correctRoutines}
          renderItem={({ item }) => (
            
            <RoutineHeader 
              title={item.title} 
              image={item.image} 
              days={item.days} 
              months={item.months} 
              startTime={item.startTime} 
              endTime={item.endTime}
              id = {item.id}
              isAdult = {false}
              navigation = {navigation}

            />
          )}
          keyExtractor={item => item.id}
        />
      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column", // Changed to column so that elements stack vertically
  },
  bigButtonContainer: {
    alignItems: "center",
    marginTop: verticalScale(245),
    position: 'absolute', // Set the position to absolute to keep it at the top
    left: scale(20),
    zIndex: 1, // Ensure the button is above the FlatList
  },
  mediumButtonContainer: {
    position: 'absolute', // Set the position to absolute to keep it at the top
    top: verticalScale(240),
    left: scale(330),
    zIndex: 1, // Ensure the button is above the FlatList

  },
  listContainer: {
    flex: 1, // take up all available space
    marginTop: verticalScale(240), // adjust the top margin as needed
    paddingHorizontal: scale(20), // adjust the padding as needed
  },
  flatList: {
    paddingHorizontal: scale(20)  ,
  },
});

export default RoutineScreen;

