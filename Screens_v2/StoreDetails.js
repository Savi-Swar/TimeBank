import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ImageBackground,Image, Text } from 'react-native';
import SmallButton from '../Components_v2/SmallButton';
import { useFonts } from "expo-font";
import BackButton from '../Components_v2/BackButton';
import { getDownloadURL, ref, getStorage } from "firebase/storage";
import { playSound } from '../audio';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';
import { updateRequest } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

function StoreScreen({ route, navigation }) {
  const [loaded] = useFonts({
    BubbleBobble: require("../assets/fonts/BubbleBobble.ttf"),
  });
  const { title, imageUri, minutes } = route.params;
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
          const storage = getStorage();
          const reference = ref(storage, imageUri);
          await getDownloadURL(reference).then(url => {
              setUrl(url);
          });
      };
      fetchImageUrl();
  }, [imageUri]);

  if (!loaded) {
    return null;
  }
  const handleBuyItem = async () => {
    const itemName = title; // The item name
    playSound("complete")
    await updateRequest(kidName, -1*minutes, itemName, "false");
    navigation.navigate("KidsNav"); // or wherever you need to navigate after buying
    // Optionally add more logic if needed
  };
    return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/11_store_details.png")}>
      <View style = {{bottom: verticalScale(90), left: scale(25)}}>
      <BackButton 
             onPress={() => navigation.navigate("KidsNav")}
            imageUrl={require("../assets/buttons/Back.png")}
        />
      </View>
      <View style={{flexDirection: "row"}}>
        <View style={styles.circularImageView}>
          <Image style={styles.image2} source={{ uri: url }} />
        </View>
        <Image style={styles.monkey} source={require("../assets/Monkey.png")} />
        </View>
        <Text style={{fontFamily: "BubbleBobble", fontSize: moderateScaleFont(47), color: "#FFE57B", position: "absolute",
      left: scale(40), top: verticalScale(590)}}>{title}</Text>
        <View style = {{alignItems: "center", top: verticalScale(20), right: scale(90)}}>       
        <View style = {{flexDirection: "row", top: verticalScale(10)}}>
          <Text style={{fontFamily: "BubbleBobble", 
            fontSize: moderateScaleFont(23), color: "#9b8da2"}}>Price: </Text>
          <View style = {{top: verticalScale(1), left: scale(3)}}>
            <Text style={{fontFamily: "BubbleBobble", 
            fontSize: moderateScaleFont(23), color: "#21bf73"}}>{minutes} Minutes</Text>
          </View>
        </View>
        <View style = {{right: scale(3), bottom: verticalScale(-30)}}>
        <SmallButton 
            width = {scale(141)}
            height = {verticalScale(66)}
            onPress={handleBuyItem}
            imageUrl={require("../assets/buttons/Buy.png")}
        />
        </View>
        </View>

    </ImageBackground>
    );
}

let r = Math.min(scale(1), verticalScale(1));
const styles = StyleSheet.create({
 background: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: scale(103),
    height: verticalScale(31),
    resizeMode: "contain",

  },
  image2: {
    width: 440 * r,
    height: 440 * r,
    resizeMode: "cover",
    borderRadius: 220 * r,
  },
  monkey: {
    width: scale(170),
    height: verticalScale(140),
    resizeMode: "contain",
    right: scale(200),
  },
  circularImageView: {
    width: 440*r,
    height: 440*r,
    borderRadius: 220*r,
    borderWidth: scale(5),
    borderColor: 'black',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    right: scale(80),
    bottom: scale(50)
  }

});

export default StoreScreen;