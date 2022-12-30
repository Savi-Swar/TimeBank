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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AppButton from "./AppButton";
import initalizeApp from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { firebaseConfig } from "../firebase";
import { makeid } from "../firebase";
export default function ImagePickerExample({
  setImage,
  image,
  bytes,
  url,
  setUrl,
}) {
  const [pickedImagePath, setPickedImagePath] = useState("");

  const takePhoto = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.canceled) {
      setPickedImagePath(result.uri); // may have to fix
      console.log(result.uri);
      const storage = getStorage();
      const refer = ref(storage, link);
      const img = await fetch(result.uri);
      const bytes = await img.blob();
      await uploadBytes(refer, bytes);
    }
  };
  const requestPermission = async () => {
    const option = await ImagePicker.requestCameraPermissionsAsync();
    if (!option.granted)
      alert("You need to enable permisson to access this library");
  };
  useEffect(() => {
    requestPermission();
  });
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    let link = makeid(15) + ".jpg";
    setUrl(link);

    if (!result.canceled) {
      setImage(result.uri);

      const storage = getStorage();
      const refer = ref(storage, link);
      const img = await fetch(result.uri);
      const bytes = await img.blob();
      await uploadBytes(refer, bytes);
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

      <AppButton title="Add Image from library" onPress={pickImage} />

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
    </>
  );
}
