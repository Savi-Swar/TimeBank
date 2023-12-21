import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ImageBackground,Image, Text } from 'react-native';
import AppTextInput from '../Components_v2/AppTextInput';
import BigButton from '../Components_v2/BigButton';
import MediumButton from '../Components_v2/MediumButton';
import SmallButton from '../Components_v2/SmallButton';
import { useFonts } from "expo-font";
import BackButton from '../Components_v2/BackButton';
import { getDownloadURL, ref, getStorage } from "firebase/storage";

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
    await updateRequest(kidName, minutes, itemName);
    navigation.navigate("Login"); // or wherever you need to navigate after buying
    // Optionally add more logic if needed
  };
    return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/11_store_details.png")}>
      <View style = {{bottom: 50, left: 25}}>
      <BackButton 
             onPress={() => navigation.navigate("ParentStore")}
            imageUrl={require("../assets/buttons/Back.png")}
        />
      </View>
      <View style={{flexDirection: "row"}}>
        <View style={styles.circularImageView}>
          <Image style={styles.image2} source={{ uri: url }} />
        </View>
        <Image style={styles.monkey} source={require("../assets/Monkey.png")} />
        </View>
        <View style = {{alignItems: "center", top: 15, right: 90}}>
          
        <Text style={{fontFamily: "BubbleBobble", fontSize: 47, color: "#FFE57B"}}>{title}</Text>
        <View style = {{flexDirection: "row"}}>
          <Image style={styles.image} source={require("../assets/Text/BubbleText11.png")} />
          <Text style={{fontFamily: "BubbleBobble", fontSize: 20, color: "#21bf73", top: 15, left: 2, paddingHorizontal:3}}>{minutes}</Text>
          <Image style={styles.image} source={require("../assets/Text/BubbleText12.png")} />


        </View>
        <View style = {{right: 3, bottom: 15}}>
        <SmallButton 
            onPress={handleBuyItem}
            imageUrl={require("../assets/buttons/Buy.png")}
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
    width: 80,
    height: 50,
    resizeMode: "contain",

  },
  image2: {
    width: 440,
    height: 440,
    resizeMode: "cover",
    borderRadius: 220,
  },
  monkey: {
    width: 170,
    height: 140,
    resizeMode: "contain",
    right: 200,
  },
  circularImageView: {
    width: 440,
    height: 440,
    borderRadius: 220,
    borderWidth: 5,
    borderColor: 'black',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    right: 80,
  }

});

export default StoreScreen;