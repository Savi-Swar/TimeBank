import React, {useState} from 'react';
import { View, StyleSheet, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import MediumButton from '../Components_v2/MediumButton';
import CustomButton from '../Components_v2/CustomButton';
import Card from '../Components_v2/Card';
import * as firebase from '../firebase'
import { ScrollView } from 'react-native-gesture-handler';
import {scale, verticalScale, moderateScaleFont} from '../scaling';

function ParentTask({ navigation }) {
  const [store, setStore] = useState([]);
  firebase.Tasks(store, setStore);
  // console.log(store);
  return (
    <ImageBackground style={styles.backgroundImage} source={require("../assets/backgrounds/16_parent_dashboard.png")}>
      <View style={styles.topContainer}>
        <View style={styles.bigButtonContainer}>
          <MediumButton 
            onPress={() => navigation.navigate("ParentMenu")} 
            imageUrl={require("../assets/buttons/BackToKids.png")} 
          />
        </View>
        <View style={styles.mediumButtonContainer}>
          <CustomButton onPress={() => navigation.navigate("Create", {
            location: "tasks"
          })} imageUrl={require("../assets/buttons/add.png")} />
        </View>
      </View>
      
      <FlatList 
        style={styles.flatList}  // Use style instead of contentContainerStyle here
        data={store}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.cardContainer}>
            <Card 
              image={item.image} 
              title={item.title} 
              minutes={item.minutes}
              id = {item.id}
            />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </ImageBackground>
  );
}
// make the rescaled version of the component available to other parts of the app
const styles = StyleSheet.create({
  // put the scale, verticalScale functions for the styles kid
  backgroundImage: {
    flex: 1
  },
  topContainer: {
    height: verticalScale(280),  // This height will be static and can be adjusted based on your needs
    flexDirection: "row"
  },
  bigButtonContainer: {
    alignItems: "center",
    marginTop: verticalScale(153),
    left: scale(20)
  },
  mediumButtonContainer: {
    marginTop: verticalScale(210),
    left: scale(90)
  },
  flatList: {
    flex: 1,
  },
  cardContainer: {
    // other styles as needed
    marginHorizontal: scale(22),
  },
});


export default ParentTask;
