import { getDownloadURL, ref, getStorage } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ImageBackground,

} from "react-native";
import colors from "../config/colors";
import * as firebase from "../firebase";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { doc, deleteDoc, getFirestore } from "firebase/firestore";
// import { Grayscale} from 'react-native-color-matrix-image-filters'
function Card({ title, subTitle, image, id, location }) {
  // for deleting tasks
  const handlePress = () => {
    Alert.alert("Delete", "Are you sure you want to delete this", [
      { text: "Yes", onPress: () => deleteTask() },
      { text: "No" },
    ]);
  };

  const [url, setUrl] = useState();
  let link = "/" + image;
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
  const deleteTask = async () => {
    const db = getFirestore();
    const colRef = (getFirestore(), location);

    const docRef = doc(db, colRef, id);
    await deleteDoc(docRef);

  };
  const [minutes, setMinutes] = useState(0);
  const [named, setName] = useState("def");
  // let minutes;
  firebase.retrieveUser(named, setName);

  firebase.Mins(minutes, setMinutes, named);
  let black = (minutes < subTitle && location == "store")
  return (
    <View style={styles.card}>
        { black == true ?
        (<>
        <Image source={{uri: url}} style={{ tintColor: 'gray', height: 200, width: "100%" }} />
        <Image source={{uri: url}} style={{ position: 'absolute', opacity: 0.3, height: 200, width: "100%"}} /> 
        </>) :
  
        (<Image source={{uri: url}} style={styles.image} /> )
        }

    <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
        }}
      >
        <TouchableOpacity onPress={() => handlePress()}>
          <Entypo name="circle-with-cross" size={35} color="red" />
        </TouchableOpacity>
      </View>

    {black == true ? <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          left: 133,
          top: 60
        }}
      >
       
          <Entypo name="lock" size={100} color="black" />
      </View> : null}

      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subTitle} minutes
        </Text>
      </View>
    </View>
  );
}

export default Card;

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  subtitle: {
    color: colors.primary,
    fontWeight: "bold",
  },
  title: {
    marginBottom: 7,
  },
  card: {
    backgroundColor: colors.white,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    borderColor: colors.dark,
    borderWidth: 1,

  },
  image: {
    height: 200,
    width: "100%",


  },
});
