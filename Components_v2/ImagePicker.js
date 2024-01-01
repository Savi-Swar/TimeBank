import React, { useState } from "react";
import {
  Image,
  View,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
  Text
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { makeid } from "../firebase";
import mime from 'mime';
import CustomButton from "./CustomButton";
import { playSound } from "../audio";
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';

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
      playSound("alert")
      alert("Camera Access disabled; Go to settings to enable!");
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

  

  

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      playSound("alert")
      Alert.alert("Permissions required", "You need to grant gallery access to use this feature.");
      return;
    }
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
        console.log(uploadedFileURL)
        setPickedImagePath(uploadedFileURL);
        setUrl(link)
        playSound("pop")
      }
    } catch (error) {
      console.error("Error picking and uploading image: ", error);
    }
};


  
  
  // for photos from library
  const handlePress = () => {
    playSound('alert'); // Play the click sound
    Alert.alert("Delete", "Are you sure you want to delete this image?", [
      { text: "Yes", onPress: () => {setPickedImagePath(""), playSound("pop")} },
      { text: "No", onPress: () => playSound("minimise")},
    ]);
  };
  const change = source == "edit"
  return (
    <>
              
           
      {change && 
      <View style = {{left: scale(20), top: verticalScale(120)}}>
        <View >
          <CustomButton 
              onPress={takePhoto}
              imageUrl={require("../assets/buttons/Capture.png")}
              width={scale(200)}
              height={verticalScale(67)}

          />
        </View>
        <CustomButton 
            onPress={pickImage}
            imageUrl={require("../assets/buttons/Gallery.png")}
            width={scale(200)}
            height={verticalScale(67)}

          />
      </View>
    }
    {!change && 
      <>
        <CustomButton 
            onPress={takePhoto}
            imageUrl={require("../assets/buttons/Capture.png")}
            width={scale(200)}
            height={verticalScale(67)}

        />
        <CustomButton 
            onPress={pickImage}
            imageUrl={require("../assets/buttons/Gallery.png")}
            width={scale(200)}
            height={verticalScale(67)}

          />
      </>
    }

      <View style={{position: 'absolute', left: scale(175), top: verticalScale(40)}}>
        <TouchableWithoutFeedback onPress={handlePress}>
          <View>
            {pickedImagePath && (
              <Image
                source={{ uri: pickedImagePath }}
                style={{ width: scale(120), height: verticalScale(120), left: scale(60), top: verticalScale(85), borderRadius: scale(10)}}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
        {pickedImagePath && (
          <TouchableOpacity 
            style={{position: 'absolute', left: scale(170), top: verticalScale(75)}} 
            onPress={handlePress}
          >
            <Text style={{fontSize: moderateScaleFont(20)}}>X</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}