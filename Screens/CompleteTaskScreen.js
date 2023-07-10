import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import AppButton from "../components/AppButton";
import Card from "../components/Card";
import { AntDesign } from "@expo/vector-icons";
import Minutes from "../components/Minutes";
import colors from "../config/colors";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as firebase from "../firebase";
import { getDownloadURL, ref, getStorage } from "firebase/storage";
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CompleteTaskScreen({ navigation, route }) {
  //count for addition
  const [count, setCount] = useState(0);
  // count for subtraction
  const [subCount, setSubCount] = useState(0);
  let mins = parseInt(route.params.item.minutes);
  let total = count + mins + subCount;
  const [url, setUrl] = useState();
  let link = "/" + route.params.item.image;
  useEffect(() => {
    const func = async () => {
      const storage = getStorage();
      const reference = ref(storage, link);
      await getDownloadURL(reference).then(x => {
        setUrl(x);
      });
    };
    func();
  }, []);
  const [named, setName] = useState("def");
  const getData = async () => {
    try {
        const value = await AsyncStorage.getItem('@active_kid')
        if(value !== null) {
            // value previously stored
            console.log(value)
            setName(value)
        }
    } catch(e) {
        // error reading value
    }
}
  useEffect(() => {  
    getData()
    // console.log(name)
  }, []);  
  const [minutes, setMinutes] = useState(0);
  const isAdult = route.params?.isAdult || false;
  const [selectedKid, setSelectedKid] = useState(null);
  const [kids, setKids] = useState([])
  firebase.Kids(kids, setKids)
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: url }} />
      <Text style={styles.text}>{route.params.item.title}</Text>
      <Text style={styles.subtitle}>time taken: {total} minutes</Text>
      
      {isAdult && (
        <RNPickerSelect
          onValueChange={(value) => setSelectedKid(value)}
          items={kids.map((kid) => ({ label: kid.name, value: kid.name }))}
          placeholder={{ label: "Select a kid...", value: null }}
        />
      )}

      <View style={styles.icons}>
        <TouchableOpacity onPress={() => setCount(count + 1)}>
          <AntDesign
            style={{ marginHorizontal: 5 }}
            name="pluscircleo"
            size={40}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => total > 0 && setSubCount(subCount - 1)}
        >
          <AntDesign name="minuscircleo" size={40} color="black" />
        </TouchableOpacity>
        <View style={{ width: "30%", padding: 5, bottom: 20 }}>
          <AppButton
            color="secondary"
            title="Complete"
            onPress={() => {
              if (isAdult) {
                firebase.addMins(minutes, total, selectedKid);
              } else {
                firebase.updateRequest(named, total, route.params.item.title);
              }
            }}
          />
        </View>
      </View>
      <View style={styles.button}>
        <AppButton
          title="Back to Tasks"
          onPress={() => {{ if (isAdult) {
            navigation.navigate("TasksScreen", { isAdult: true })
          } else {
            navigation.navigate("HomeFile")
          }}}}
        />
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
  },
  button: {
    width: "90%",
    bottom: 20,
  },
  text: { fontSize: 30, margin: 10 },
  subtitle: {
    fontSize: 20,
    margin: 10,
  },
  icons: {
    flexDirection: "row",
  },
});

export default CompleteTaskScreen;
