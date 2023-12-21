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
import CustomButton from "../Components_v2/CustomButton";

export default function ImagePickerExample({
  setImage,
  image,
  bytes,
  url,
  setUrl,
  source
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
      setUrl(link) 

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
  
        const extension = mime.getExtension(type) || 'jpg';
        let link = makeid(15) + "." + extension;
    
        const storage = getStorage();
        const refer = ref(storage, link);
        const img = await fetch(uri);
        const bytes = await img.blob();
        await uploadBytes(refer, bytes);

        const uploadedFileURL = await getDownloadURL(refer);
        setPickedImagePath(uploadedFileURL);
        setUrl(link)
      }
    } catch (error) {
      console.error("Error picking and uploading image: ", error);
    }
};


  
  
  // for photos from library
  const handlePress = () => {
    Alert.alert("Delete", "Are you sure you want to delete this image?", [
      { text: "Yes", onPress: () => setPickedImagePath("") },
      { text: "No" },
    ]);
  };
  const change = source == "edit"
  return (
    <>
              
           
      {change && 
      <View style = {{left: 20, top: 120}}>
        <View >
          <CustomButton 
              onPress={takePhoto}
              imageUrl={require("../assets/buttons/Capture.png")}
              width={200}
              height={80}

          />
        </View>
        <CustomButton 
            onPress={pickImage}
            imageUrl={require("../assets/buttons/Gallery.png")}
            width={200}
            height={80}

          />
      </View>
    }
    {!change && 
      <>
        <CustomButton 
            onPress={takePhoto}
            imageUrl={require("../assets/buttons/Capture.png")}
            width={200}
            height={150}
            style={{ width: 200, height: 150, alignSelf: 'center' }}

        />
        <CustomButton 
            onPress={pickImage}
            imageUrl={require("../assets/buttons/Gallery.png")}
            width={200}
            height={150}
            style={{ width: 200, height: 150, alignSelf: 'center' }}

          />
      </>
    }

      <View style={{position: 'absolute', left: 175, top: 40}}>
        <TouchableWithoutFeedback onPress={handlePress}>
          <View>
            {pickedImagePath && (
              <Image
                source={{ uri: pickedImagePath }}
                style={{ width: 140, height: 140, left: 80, top: 90, borderRadius: 10}}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
        {pickedImagePath && (
          <TouchableOpacity 
            style={{position: 'absolute', left: 220, top: 80, height: 20}} 
            onPress={handlePress}
          >
            <Text style={{fontSize: 20}}>X</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}