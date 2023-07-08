import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import AppButton from "../components/AppButton";
import Card from "../components/Card";
import { AntDesign } from "@expo/vector-icons";
import Minutes from "../components/Minutes";
import colors from "../config/colors";
import * as firebase from "../firebase";
import { getDownloadURL, ref, getStorage } from "firebase/storage";

function BuyScreen({ navigation, route }) {
  //count for addition

  let mins = parseInt(route.params.item.minutes) * -1;
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
  firebase.retrieveUser(named, setName);
  const [minutes, setMinutes] = useState(0);

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: url }} />
      <Text style={styles.text}>{route.params.item.title}</Text>
      <Text style={styles.subtitle}>price: {mins * -1} minutes</Text>
      <View style={styles.icons}>

        <View style={{ width: "30%", padding: 5, bottom: 20 }}>
          <AppButton
            color="secondary"
            title="Buy"
            onPress={() => firebase.updateRequest(named, mins, route.params.item.title)}
          />
        </View>
      </View>
      <View style={styles.button}>
        <AppButton
          title="Back to Store"
          onPress={() => navigation.navigate("HomeFile")}
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

export default BuyScreen;
