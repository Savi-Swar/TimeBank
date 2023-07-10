import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  Platform,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Text
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AppButton from "./AppButton";
import initalizeApp from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseConfig } from "../firebase";
import { makeid } from "../firebase";
import mime from 'mime';

export default function ImagePickerExample({
  setImage,
  image,
  bytes,
  url,
  setUrl,
}) {
  const [pickedImagePath, setPickedImagePath] = useState("");


  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const type = result.assets[0].type;
      setPickedImagePath(uri);

      const extension = mime.getExtension(type) || 'jpg';
      const link = makeid(15) + "." + extension;

      const storage = getStorage();
      const refer = ref(storage, link);
      const img = await fetch(uri);
      const bytes = await img.blob();
      await uploadBytes(refer, bytes);

      const uploadedFileURL = await getDownloadURL(refer);
      setPickedImagePath(uploadedFileURL);
    }
};

  
  const requestPermission = async () => {
    const option = await ImagePicker.requestCameraPermissionsAsync();
    if (!option.granted)
      alert("You need to enable permisson to access this library");
  };
  
  useEffect(() => {
    requestPermission();
  }, []);
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
  
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const type = result.assets[0].type;
        console.log("Picked image URI: ", uri);
  
        const extension = mime.getExtension(type) || 'jpg';
        let link = makeid(15) + "." + extension;
        console.log("Generated link: ", link);
    
        const storage = getStorage();
        const refer = ref(storage, link);
        const img = await fetch(uri);
        const bytes = await img.blob();
        console.log("Got image blob, starting upload...");
        await uploadBytes(refer, bytes);
        console.log("Upload finished");

        const uploadedFileURL = await getDownloadURL(refer);
        console.log("Uploaded file URL: ", uploadedFileURL);
        setImage(uploadedFileURL);
        setUrl(link)
      }
    } catch (error) {
      console.error("Error picking and uploading image: ", error);
    }
};


  
  
  // for photos from library
  const handlePress = () => {
    Alert.alert("Delete", "Are you sure you want to delete this image?", [
      { text: "Yes", onPress: () => setImage(null) },
      { text: "No" },
    ]);
  };
  //for camera photos
  const handlePress2 = () => {
    Alert.alert("Delete", "Are you sure you want to delete this image?", [
      { text: "Yes", onPress: () => setPickedImagePath("") },
      { text: "No" },
    ]);
  };

  return (
    <>
      <AppButton title="Take Photo" onPress={takePhoto} />

      <View style={{position: 'relative'}}>
        <TouchableWithoutFeedback onPress={handlePress2}>
          <View>
            {pickedImagePath !== "" && (
              <Image
                source={{ uri: pickedImagePath }}
                style={{ width: 180, height: 100 }}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
        {pickedImagePath !== "" && (
          <TouchableOpacity 
            style={{position: 'absolute', right: 0, top: 0}} 
            onPress={handlePress2}
          >
            <Text style={{fontSize: 20}}>X</Text>
          </TouchableOpacity>
        )}
      </View>

      <AppButton title="Add Image from library" onPress={pickImage} />

      <View style={{position: 'relative'}}>
        <TouchableWithoutFeedback onPress={handlePress}>
          <View>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 180, height: 100 }}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
        {image && (
          <TouchableOpacity 
            style={{position: 'absolute', right: 0, top: 0}} 
            onPress={handlePress}
          >
            <Text style={{fontSize: 20}}>X</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}