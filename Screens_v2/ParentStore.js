import React, {useState} from 'react';
import { View, StyleSheet, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import MediumButton from '../Components_v2/MediumButton';
import CustomButton from '../Components_v2/CustomButton';
import Card from '../Components_v2/Card';
import * as firebase from '../firebase'
import { ScrollView } from 'react-native-gesture-handler';

function ParentStore({ navigation }) {
  const [store, setStore] = useState([]);
  firebase.Store(store, setStore);
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
            location: "store"
          })} imageUrl={require("../assets/buttons/add.png")} />
        </View>
      </View>
      
      <FlatList 
        style={styles.flatList}  // Use style instead of contentContainerStyle here
        data={store}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.cardContainer}  onPress={() => navigation.navigate('StoreDetails', {
            title: item.title,
            imageUri: item.image,
            minutes: item.minutes
          })}>
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

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1
  },
  topContainer: {
    height: 320,  // This height will be static and can be adjusted based on your needs
    flexDirection: "row"
  },
  bigButtonContainer: {
    alignItems: "center",
    marginTop: 183,
    left: 20
  },
  mediumButtonContainer: {
    marginTop: 240,
    left: 90
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 20,
    left: 20
  },
  cardContainer: {
    marginBottom: 30  // margin at the bottom of each card
  }
});

export default ParentStore;
