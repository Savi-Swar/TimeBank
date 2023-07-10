import { getDownloadURL, ref, getStorage, deleteObject } from "firebase/storage";
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
import { doc, deleteDoc, getFirestore, collection, getDoc } from "firebase/firestore";
// import { } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';


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
    const userId = firebase.auth.currentUser.uid;

    const docRef = doc(db, userId, "storage", location, id);
    const docSnap = await getDoc(docRef);

    const img = docSnap.data().image
    const storage = getStorage();

    // Create a reference to the file to delete
    const desertRef = ref(storage, img);
    
    // Delete the file
    deleteObject(desertRef).then(() => {
      // File deleted successfully
      console.log("DELETED IMAGE")
    }).catch((error) => {
      // Uh-oh, an error occurred!
      console.log(error)
    });
    await deleteDoc(docRef);

  };
  const [minutes, setMinutes] = useState(0);
  const [named, setName] = useState("def");
  // let minutes;
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
  firebase.Mins(minutes, setMinutes, named);
  let black = (minutes < parseInt(subTitle) && location == "store")
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
