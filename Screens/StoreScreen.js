import React, { useState } from "react";
import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import Screen from "../components/Screen";
import Card from "../components/Card";
import Minutes from "../components/Minutes";
import * as firebase from "../firebase";
import AppButton from "../components/AppButton";
// import {Picker} from '@react-native-picker/picker';

function StoreScreen({ navigation, minutes }) {
  const [store, setStore] = useState([]);
  firebase.Store(store, setStore);

  // const [selected, setSelected] = useState(undefined);
  // const data = [
  //   { label: 'One', value: '1' },
  //   { label: 'Two', value: '2' },
  //   { label: 'Three', value: '3' },
  //   { label: 'Four', value: '4' },
  //   { label: 'Five', value: '5' },
  // ];

  return (
 
    <Screen style = {{backgroundColor: colors.light}}>
      <View style={styles.minutes}>
        <Minutes />
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
                navigation.navigate("BuyScreen", {
                  item: item,
                });
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
          onPress={() =>
            navigation.navigate("CreateTask", {
              location: "store",
              loconame: "StoreScreen",
            })
          }
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
