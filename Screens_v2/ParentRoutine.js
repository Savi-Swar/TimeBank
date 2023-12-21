import React, {useState} from 'react';
import { View, StyleSheet, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import BigButton from '../Components_v2/BigButton';
import MediumButton from '../Components_v2/MediumButton';
import SmallButton from '../Components_v2/SmallButton';
import BackButton from '../Components_v2/BackButton';
import CustomButton from '../Components_v2/CustomButton';
import RoutineHeader from '../Components_v2/RoutineHeader';
import * as firebase from '../firebase'

function ParentRoutine({ navigation }) {
  const [routines, setRoutines] = useState([]);
  firebase.Routines(routines, setRoutines);

  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/20_parent's-routine.png")}>
      
      <View style={styles.bigButtonContainer}>
        <MediumButton 
          onPress={() => navigation.navigate("ParentMenu")} 
          imageUrl={require("../assets/buttons/BackToKids.png")} 
          height = {50}
        />
      </View>
      
      <View style={styles.mediumButtonContainer}>
        <CustomButton onPress={() => navigation.navigate("CreateRout")} imageUrl={require("../assets/buttons/add.png")} />
      </View>

      <View style={styles.listContainer}>
        <FlatList 
          data={routines}
          renderItem={({ item }) => (
            
            <RoutineHeader 
              title={item.title} 
              image={item.image} 
              days={item.days} 
              months={item.months} 
              startTime={item.startTime} 
              endTime={item.endTime}
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
    marginTop: 245,
    position: 'absolute', // Set the position to absolute to keep it at the top
    left: 20,
    zIndex: 1, // Ensure the button is above the FlatList
  },
  mediumButtonContainer: {
    position: 'absolute', // Set the position to absolute to keep it at the top
    top: 240,
    left: 330,
    zIndex: 1, // Ensure the button is above the FlatList

  },
  listContainer: {
    flex: 1, // take up all available space
    marginTop: 300, // adjust the top margin as needed
    paddingHorizontal: 20, // adjust the padding as needed
  },
  flatList: {
    paddingHorizontal: 20,
  },
});

export default ParentRoutine;

