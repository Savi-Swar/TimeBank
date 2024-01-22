import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
  Text
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { makeid } from "../firebase";
import mime from 'mime';
import CustomButton from "./CustomButton";
import { playSound } from "../audio";
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';
import * as ImageManipulator from 'expo-image-manipulator';

export default function ImagePickerExample({ setImage, image, url, setUrl, source }) {
  const [pickedImagePath, setPickedImagePath] = useState("");

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (url) {
        const storage = getStorage();
        const reference = ref(storage, url);
        const imageURL = await getDownloadURL(reference);
        setPickedImagePath(imageURL);
      }
    };
    fetchImageUrl();
  }, [url]);



  const uploadImage = async (uri, link) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, link);
  
      let blob;
      if (uri.startsWith('file://')) {
        // The image is a local file, read it as a blob directly
        const response = await fetch(uri);
        blob = await response.blob();
      } else {
        // Handle remote images if needed
        const img = await fetch(uri);
        blob = await img.blob();
      }
  
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error; // Rethrow to handle in calling function
    }
  };
  


  const resizeAndCropImage = async (uri) => {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: scale(500), height: verticalScale(500) } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipResult.uri;
  };
  

  
const processImage = async (uri) => {
  if (!uri) {
    console.error("No image URI available");
    return;
  }

  try {
    // Since the URI is local, directly resize and crop the image
    const resizedImageUri = await resizeAndCropImage(uri);
  
    if (!resizedImageUri) {
      console.error("Resized image URI is undefined");
      return;
    }
  
    const baseLink = makeid(15) + ".jpeg";
    await uploadImage(resizedImageUri, baseLink);

    setPickedImagePath(resizedImageUri); // Update with the resized image URL
    setUrl(baseLink); // Update with the resized image link
  } catch (error) {
    console.error("Error processing image: ", error);
  }
};



const takePhoto = async () => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  if (permissionResult.granted === false) {
    playSound("alert")
    alert("Camera Access disabled; Go to settings to enable!");
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true, // Enable cropping
    aspect: [1, 1],
    quality: 0.2,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    await processImage(result.assets[0].uri);
  }
};



  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      playSound("alert")
      Alert.alert("Permissions required", "You need to grant gallery access to use this feature.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
    });

    if (!result.canceled) {
      await processImage(result.assets[0].uri);
    }
  };

  const deleteImage = async () => {
    if (url) {
      const storage = getStorage();
      const imageRef = ref(storage, url);
      try {
        await deleteObject(imageRef);
        setPickedImagePath("");
        setUrl("");
        playSound("pop");
      } catch (error) {
        console.error("Error deleting image: ", error);
      }
    }
  };

  const handlePress = () => {
    playSound('alert');
    Alert.alert("Delete", "Are you sure you want to delete this image?", [
      { text: "Yes", onPress: () => deleteImage() },
      { text: "No", onPress: () => playSound("minimise") },
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