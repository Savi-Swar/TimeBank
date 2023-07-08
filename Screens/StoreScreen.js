import React, { useState } from "react";
import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import Screen from "../components/Screen";
import Card from "../components/Card";
import Minutes from "../components/Minutes";
import * as firebase from "../firebase";
import AppButton from "../components/AppButton";
// import {Picker} from '@react-native-picker/picker';

function StoreScreen({ navigation, minutes, route }) {
  const [store, setStore] = useState([]);
  firebase.Store(store, setStore);
  const isAdult = route.params?.isAdult || false; // If isAdult is not passed or is undefined, it will default to false

  return (
 
    <Screen style = {{backgroundColor: colors.light}}>
      <View style={styles.minutes}>
      {isAdult ? <AppButton title="Back to Kids View" onPress={() => navigation.navigate("KidsScreen")} /> : <Minutes />}
      </View>
      {/* <View style={styles.container}>
      {!!selected && (
        <Text>
          Selected: label = {selected.label} and value = {selected.value}
        </Text>
      )}
      <Dropdown label="Select Item" data={data} onSelect={setSelected} />
      <Text>This is the rest of the form.</Text>
    </View> */}
      <View style={styles.screen}>
        <FlatList
          data={store}
          keyExtractor={tasks => tasks.id}
          renderItem={({ item }) => (
            <TouchableOpacity
            onPress={() => {
              if (route.params?.isAdult === true) {
              } else {
                navigation.navigate("BuyScreen", {
                  item: item,
                });                }
              
            }}
            >
              <Card
                title={item.title}
                subTitle={item.minutes}
                image={item.image}
                id={item.id}
                location={"store"}
              />
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.button}>
        <AppButton
          color="secondary"
          title="Add More +"
          onPress={() => {
            if (route.params?.isAdult === true) {
              navigation.navigate("CreateTask", {
                location: "store",
                loconame: "StoreScreen",
                isAdult: true
              })             
            } else {
              navigation.navigate("CreateTask", {
                location: "store",
                loconame: "StoreScreen",
              })              
             }
            
          }}
        />
      </View>
    </Screen>
  );
}

export default StoreScreen;
const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
    paddingHorizontal: 20,
    flex: 0.85,
  },
  MinBar: {
    flex: 0.15,
  },
  button: { flex: 0.1, paddingHorizontal: 20, top: 5 },
  minutes: {
    flex: 0.15,
    backgroundColor: colors.light
  }
});
