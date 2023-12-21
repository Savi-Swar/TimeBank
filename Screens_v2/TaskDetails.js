import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ImageBackground,Image, Text } from 'react-native';
import AppTextInput from '../Components_v2/AppTextInput';
import BigButton from '../Components_v2/BigButton';
import MediumButton from '../Components_v2/MediumButton';
import SmallButton from '../Components_v2/SmallButton';
import { useFonts } from "expo-font";
import BackButton from '../Components_v2/BackButton';
import CustomButton from '../Components_v2/CustomButton';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { updateRequest } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    const taskName = route.params.title; // The task name
    await updateRequest(kidName, minutes, taskName);
    navigation.navigate("KidsNav");
    // Optionally add more logic if needed
  };
 
    return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/12_complete.png")}>
      <View style = {{bottom: 75, left: 25}}>
      <BackButton
             onPress={() => navigation.navigate("KidsNav")}
            imageUrl={require("../assets/buttons/Back.png")}
        />
      </View>
      <View style={{flexDirection: "row"}}>
      
      <View style={styles.circularImageView}>
          <Image style={styles.image2} source={{ uri: url }} />
        </View>
        <View style = {{top: 80, left: 50}}>
        <Image style={styles.monkey} source={require("../assets/Monkey2.png")} />
        </View>
        </View>
        <View style = {{alignItems: "center", top: 15, right: 90}}>
          
        <Text style = {{fontFamily: "BubbleBobble", fontSize: 47, left: 40, color: "#FFE57B"}}>{route.params.title}</Text>
        <View style = {{flexDirection: "row", left: 40, top: 10}}>
          <View style = {{left: 30, top: 15}}>
            <CustomButton onPress={() => setMinutes(minutes > 0 ? minutes-1 : minutes)} imageUrl={require("../assets/buttons/Minus.png")} width={40} height={40}/>
          </View>
          <Image style={styles.image3} source={require("../assets/Text/BubbleText13.png")} />
          <View style = {{flexDirection: "row", top: 30, right: 125}}>
            <Text style = {{fontFamily: "BubbleBobble", fontSize: 24, color: "#21bf73", top: 8, left: 29, paddingHorizontal:3}}>{minutes}</Text>
            <Image style={styles.image} source={require("../assets/Text/BubbleText12.png")} />
          </View>
          <View style = {{right: 85, top: 15}}>
            <CustomButton onPress={() => setMinutes(minutes- -1)} imageUrl={require("../assets/buttons/add.png")} width={40} height={40} />
          </View>        
        </View>

        <View style = {{right: 3, bottom: 20}}>
        <SmallButton 
            onPress={handleCompleteTask}
            imageUrl={require("../assets/buttons/Complete.png")}
        />
        </View>
        </View>

    </ImageBackground>
    );
}

const styles = StyleSheet.create({
 background: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 70,
    resizeMode: "contain",
    bottom: 15,
    left: 25
  },
  image3: {
    width: 140,
    height: 100,
    resizeMode: "contain",
    bottom: 30,
    left: 30

  },
  image2: {
    width: 440,
    height: 440,
    resizeMode: "cover",
    borderRadius: 220,
  },
  monkey: {
    width: 160,
    height: 250,
    resizeMode: "contain",
    right: 200,
  },
  circularImageView: {
    width: 400,
    height: 400,
    borderRadius: 220,
    borderWidth: 5,
    borderColor: 'black',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    right: 80,
  }
});

export default TaskDetails;