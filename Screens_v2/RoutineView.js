import React from 'react';
import { View, StyleSheet, ImageBackground,Image } from 'react-native';
import AppTextInput from '../Components_v2/AppTextInput';
import BigButton from '../Components_v2/BigButton';
import MediumButton from '../Components_v2/MediumButton';
import BackButton from '../Components_v2/BackButton';
function RoutineView({ navigation }) {
    return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/15_morning_routine.png")}
    >
        {/* <View style = {{bottom: 80, left: 25}}> */}
      <BackButton 
             onPress={() => navigation.navigate("Login")}
            imageUrl={require("../assets/buttons/Back.png")}
        />
      {/* </View> */}
        <Image style={styles.image} source={require("../assets/Text/BubbleText10.png")} />

        <View style = {{top: 230}}>
        <AppTextInput placeholder = "Email Address" iconSource = {require("../assets/icons/email.png")}/>
        </View>
        <View style = {{top: 160}}>
        <AppTextInput placeholder = "Password" iconSource = {require("../assets/icons/lock.png")}/>
        </View>
        <View style = {{alignItems: "center", top: 10}}>
        <BigButton 
             onPress={() => navigation.navigate("TaskDetails")}
            imageUrl={require("../assets/buttons/Complete2.png")}
        />
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
    width: 240,
    height: 160,
    resizeMode: "contain",
    top: 280,
    left: 5
  },
  image2: {
    width: 240,
    height: 120,
    resizeMode: "contain",
    left: 80,
    bottom: 160
  },
});

export default RoutineView;