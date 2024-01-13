import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ImageBackground,Image, Text } from 'react-native';

import SmallButton from '../Components_v2/SmallButton';
import { useFonts } from "expo-font";
import BackButton from '../Components_v2/BackButton';
import CustomButton from '../Components_v2/CustomButton';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { updateRequest } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playSound } from '../audio';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';
function TaskDetails({ navigation, route }) {
  const [minutes, setMinutes] = useState(route.params.minutes);
  const [url, setUrl] = useState();
  const [kidName, setKidName] = useState('');

  const fetchKidDetails = async () => {
  try {
    const storedName = await AsyncStorage.getItem('@active_kid');
    if (storedName !== null) {
      // We have data!!
      setKidName(storedName);
    }
  } catch (error) {
    // Error retrieving data
    console.log(error);
  }
};

useEffect(() => {
  fetchKidDetails();
  // Add any other logic that needs to run on component mount
}, []); 
  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const storage = getStorage();
        const reference = ref(storage, route.params.imageUri);
        const url = await getDownloadURL(reference);
        setUrl(url);
      } catch (error) {
        console.error("Error fetching image URL:", error);
        // Handle the error or set a default image URL
      }
    };
  
    fetchImageUrl();
  }, [route.params.imageUri]);


  const [loaded] = useFonts({
    BubbleBobble: require("../assets/fonts/BubbleBobble.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const handleCompleteTask = async () => {
    playSound("complete")

    const taskName = route.params.title; // The task name
    if (assignment) {
      await updateRequest(kidName, minutes, taskName, route.params.id);
    } else {
      await updateRequest(kidName, minutes, taskName, "false");
    }
    
    navigation.navigate("KidsNav");
    // Optionally add more logic if needed
  };
  let assignment = route.params?.assignment || false;
    return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/12_complete.png")}>
      <View style = {{bottom: verticalScale(80), left: scale(25)}}>
      <BackButton
             onPress={() => navigation.navigate("KidsNav")}
            imageUrl={require("../assets/buttons/Back.png")}
        />
      </View>
      <View style={{flexDirection: "row"}}>
      
      <View style={styles.circularImageView}>
          <Image style={styles.image2} source={{ uri: url }} />
        </View>
        <View style = {{top: verticalScale(80), left: scale(50)}}>
        <Image style={styles.monkey} source={require("../assets/Monkey2.png")} />
        </View>
        </View>
        <View style = {{left: scale(30), top: verticalScale(560), position: "absolute"}}>
          <Text style = {{fontFamily: "BubbleBobble", fontSize: moderateScaleFont(47), color: "#FFE57B"}}>{route.params.title}</Text>
        </View>
        <View style = {{alignItems: "center", top: verticalScale(10), right: scale(90)}}>
          
        <View style = {{flexDirection: "row", left: scale(40), top: verticalScale(50)}}>
          <View style = {{left: scale(25), top: verticalScale(15)}}>
            <CustomButton onPress={() => setMinutes(minutes > 0 ? minutes-1 : minutes)} imageUrl={require("../assets/buttons/Minus.png")} width={scale(40)} height={verticalScale(40)}/>
          </View>
          <Text style = {{fontFamily: "BubbleBobble", fontSize: moderateScaleFont(24), color: "#9b8da2", top: verticalScale(8), left: scale(29), paddingHorizontal:scale(3)}}>Time Taken</Text>
          <View style = {{flexDirection: "row", top: verticalScale(30), right: scale(105)}}>
            <Text style = {{fontFamily: "BubbleBobble", fontSize: moderateScaleFont(24), color: "#21bf73", top: verticalScale(8), left: scale(29), paddingHorizontal:scale(3)}}>{minutes} Minutes</Text>
          </View>
          <View style = {{right: scale(60), top: verticalScale(15)}}>
            <CustomButton onPress={() => setMinutes(minutes- -1)} imageUrl={require("../assets/buttons/add.png")} width={scale(40)} height={verticalScale(40)} />
          </View>   
        </View>

        <View style = {{right: scale(3), bottom: verticalScale(-100)}}>
        <SmallButton 
            width = {scale(141)}
            height = {verticalScale(66)}
            onPress={handleCompleteTask}
            imageUrl={require("../assets/buttons/Complete.png")}
        />
        </View>
        </View>

    </ImageBackground>
    );
}

let r = Math.min(scale(1, verticalScale(1)));
const styles = StyleSheet.create({
 background: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: scale(100),
    height: verticalScale(70),
    resizeMode: "contain",
    bottom: verticalScale(15),
    left: scale(25)
  },
  image3: {
    width: scale(140),
    height: verticalScale(100),
    resizeMode: "contain",
    bottom: verticalScale(30),
    left: scale(30)

  },
  image2: {
    width: 440 * r,
    height: 440*r,
    resizeMode: "cover",
    borderRadius: 220*r,
  },
  monkey: {
    width: scale(167),
    height: verticalScale(190),
    resizeMode: "contain",
    right: scale(200),
  },
  circularImageView: {
    width: 400*r,
    height: 400*r,
    borderRadius: 220*r,
    borderWidth: 5*r,
    borderColor: 'black',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    right: scale(80),
    bottom: scale(50)
  }
});

export default TaskDetails;