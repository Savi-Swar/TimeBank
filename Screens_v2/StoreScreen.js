import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Alert } from 'react-native';

import Card from '../Components_v2/Card';
import * as firebase from '../firebase'
import Minutes from '../Components_v2/Minutes';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playSound } from '../audio';

function StoreScreen({ navigation }) {
  const [store, setStore] = useState([]);
  firebase.Store(store, setStore);
  // get kid Name
  const [kidName, setKidName] = useState("");
  const [minutes, setMinutes] = useState(0);
  const fetchKidDetails = async () => {
    try {
      const storedName = await AsyncStorage.getItem('@active_kid');
      if (storedName !== null) {
        // We have data!!
        setKidName(storedName);
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };
  useEffect(() => {
    fetchKidDetails();
  }, [])
  firebase.Mins(minutes, setMinutes, kidName);

  return (
    <ImageBackground style={styles.backgroundImage} source={require("../assets/backgrounds/09_store.png")}>
      <View style={styles.minutesContainer}>
        <Minutes />
      </View>
      <FlatList 
        data={store}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => {
              if (minutes >= item.minutes) {
              playSound("transition")
              navigation.navigate('StoreDetails', {
              title: item.title,
              imageUri: item.image,
              minutes: item.minutes
            })
              } else {
                playSound("alert")
                Alert.alert("You don't have enough minutes to buy this item!")
              }}}
            style={styles.cardContainer}
          >
            <Card 
              image={item.image} 
              title={item.title} 
              minutes={item.minutes}
              isAdult={false}
              id={item.id}
            />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  minutesContainer: {
    paddingTop: verticalScale(80), // Adjust this value as needed
    alignItems: 'center', // Center the minutes container horizontally
  },
  listContent: {
    paddingBottom: verticalScale(85), // Padding for top and bottom inside the list
  },
  cardContainer: {
    marginHorizontal: scale(20), // Margin on the sides for each card
    top: scale(75),


  },
});


export default StoreScreen;
