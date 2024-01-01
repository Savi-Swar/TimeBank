import React, {useState} from 'react';
import { View, StyleSheet, ImageBackground, FlatList, TouchableOpacity } from 'react-native';

import Card from '../Components_v2/Card';
import * as firebase from '../firebase'
import Minutes from '../Components_v2/Minutes';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';
function TaskScreen({ navigation }) {
  const [store, setStore] = useState([]);
  firebase.Tasks(store, setStore);

  return (
    <ImageBackground style={styles.backgroundImage} source={require("../assets/backgrounds/10_tasks.png")}>
      <View style={styles.minutesContainer}>
        <Minutes />
      </View>
      <View style = {styles.flatListContainer}>
      <FlatList 
        data={store}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('TaskDetails', {
              title: item.title,
              imageUri: item.image,
              minutes: item.minutes
            })}
            style={styles.cardContainer}
          >
            <Card 
              image={item.image} 
              title={item.title} 
              minutes={item.minutes}
              id={item.id}
              isAdult={false}
            />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
      </View>
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
    paddingBottom: verticalScale(100), // Padding for top and bottom inside the list
  },
  cardContainer: {
    marginHorizontal: scale(20), // Margin on the sides for each card

  },
  flatListContainer: {
    height: verticalScale(500),
    top: verticalScale(70),

  }
});


export default TaskScreen;
