import React, {useState} from 'react';
import { View, StyleSheet, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import BigButton from '../Components_v2/BigButton';
import MediumButton from '../Components_v2/MediumButton';
import SmallButton from '../Components_v2/SmallButton';
import BackButton from '../Components_v2/BackButton';
import CustomButton from '../Components_v2/CustomButton';
import RoutineHeader from '../Components_v2/RoutineHeader';
import * as firebase from '../firebase'
import {scale, verticalScale, moderateScale, moderateScaleFont} from '../scaling';

function ParentRoutine({ navigation }) {
  const [routines, setRoutines] = useState([]);
  firebase.Routines(routines, setRoutines);

  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/20_parent's-routine.png")}>
      
      <View style={styles.bigButtonContainer}>
        <MediumButton 
          onPress={() => navigation.navigate("ParentMenu")} 
          imageUrl={require("../assets/buttons/BackToKids.png")} 
          height = {verticalScale(50)}
        />
      </View>
      
      <View style={styles.mediumButtonContainer}>
        <CustomButton onPress={() => navigation.navigate("CreateRout")} imageUrl={require("../assets/buttons/add.png")} />
      </View>

      <View style={styles.listContainer}>
        <FlatList 
          data={routines}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>

            <RoutineHeader 
              title={item.title} 
              image={item.image} 
              days={item.days} 
              months={item.months} 
              startTime={item.startTime} 
              endTime={item.endTime}
              navigation = {navigation}
              id = {item.id}
              isAdult={true}
            />
            </View>
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
    marginTop: verticalScale(215),
    position: 'absolute', // Set the position to absolute to keep it at the top
    left: scale(20),
    zIndex: 1, // Ensure the button is above the FlatList
  },
  mediumButtonContainer: {
    position: 'absolute', // Set the position to absolute to keep it at the top
    top: verticalScale(210),
    left: scale(330),
    zIndex: 1, // Ensure the button is above the FlatList

  },
  listContainer: {
    flex: 1, // take up all available space
    marginTop: verticalScale(275), // adjust the top margin as needed
  },
 
  cardContainer: {
    // other styles as needed
    marginHorizontal: scale(20),
  },
});

export default ParentRoutine;

