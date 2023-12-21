import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import Screen from "../components/Screen";
import Card from "../components/Card";
import Minutes from "../components/Minutes";
import * as firebase from "../firebase";
import AppButton from "../components/AppButton";
import AsyncStorage from '@react-native-async-storage/async-storage';

// import {Picker} from '@react-native-picker/picker';

function StoreScreen({ navigation, route }) {
  const [store, setStore] = useState([]);
  firebase.Store(store, setStore);

  const isAdult = route.params?.isAdult || false; // If isAdult is not passed or is undefined, it will default to false
  const [minutes, setMinutes] = useState(0);
  const [named, setName] = useState("def");

  // let minutes;
  const getData = async () => {
    try {
        const value = await AsyncStorage.getItem('@active_kid')
        if(value !== null) {
            setName(value)
            firebase.Mins(minutes, setMinutes, named);  

        }
    } catch(e) {
      console.log(e)
    }
}


  useEffect(() => {  
    getData()
  }, []);
  return (

    <Screen style = {{backgroundColor: colors.light}}>
      <View style={styles.minutes}>
      {isAdult ? <AppButton title="Back to Kids View" onPress={() => navigation.navigate("KidsScreen")} /> : <Minutes />}
      </View>
      <View style={styles.screen}>
        <FlatList
          data={store}
          keyExtractor={tasks => tasks.id}
          renderItem={({ item }) => (
            <TouchableOpacity
            onPress={() => {
              if (route.params?.isAdult === true) {
                navigation.navigate("EditScreen", {
                  item: item,
                  isAdult: true,
                  location: "store"
                });  
              } else {
                if (item.minutes > minutes) {
                  alert("You don't have enough minutes to buy this item")
                } else {
                navigation.navigate("BuyScreen", {
                  item: item,
                });                }
              }
              
            }}
            >
              <Card
                title={item.title}
                subTitle={item.minutes}
                image={item.image}
                id={item.id}
                location={"store"}
                isAdult = {isAdult}
                length = {store.length}
                numColumns = {2}
              />
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.button}>
      {isAdult && 

        <AppButton
          color="secondary"
          title="Add More +"
          onPress={() => {
            if (route.params?.isAdult === true) {
              navigation.navigate("CreateTask", {
                location: "store",
                loconame: "Store",
                isAdult: true
              })             
            } else {
              navigation.navigate("CreateTask", {
                location: "store",
                loconame: "Store",
              })              
             }
            
          }}
        />
      }
      </View>
    </Screen>
  );
}

export default StoreScreen;
const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
    paddingHorizontal: 20,
    flex: 1,
  },
  button: {  paddingHorizontal:20 },
  minutes: {
    flex: 0.15,
    backgroundColor: colors.light
  }
});
