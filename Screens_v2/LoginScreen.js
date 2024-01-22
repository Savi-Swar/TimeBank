import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Image, ActivityIndicator, Alert } from 'react-native';
import BigButton from '../Components_v2/BigButton';
import AppTextInput from '../Components_v2/AppTextInput';
import MediumButton from '../Components_v2/MediumButton';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Make sure this path is correct
import { playSound } from '../audio';
import { scale, verticalScale } from '../scaling';
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setEmail("");
    setPassword("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigation.navigate("ParentHome", {canFetchUserData: true}); // Adjust this to the screen you want to navigate to upon success
    } catch (error) {
      playSound("alert");
      Alert.alert("Login Failed", "Invalid login credentials", [{ text: "OK" }]);
      setLoading(false);
    }
};

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/06_login.png")}>
      <Image style={styles.image} source={require("../assets/Text/BubbleText5.png")} />
      <View style={{ top: verticalScale(80) }}>
        <AppTextInput 
          placeholder="Email Address"
          iconSource={require("../assets/icons/email.png")}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
      </View>
      <View style={{ top: verticalScale(90) }}>
        <AppTextInput 
          placeholder="Password"
          iconSource={require("../assets/icons/lock.png")}
          onChangeText={setPassword}
          value={password}
          secureTextEntry // This is added to make the text input secure for password entry
        />
      </View>
      <View style={{ alignItems: "center", top: verticalScale(100) }}>
        <BigButton 
          onPress={handleSignIn}
          imageUrl={require("../assets/buttons/LoginButton.png")}
        />
      </View>
      <View style={styles.image2}>
        <MediumButton 
          onPress={() => navigation.navigate("ForgotPassword")}
          imageUrl={require("../assets/Text/BubbleText6.png")}
          width = {190}
          height = {60}
        />
      </View>
      <View style={{ alignItems: "center", top: verticalScale(100), right: scale(70) }}>
        <MediumButton 
          onPress={() => navigation.navigate("Register")}
          imageUrl={require("../assets/buttons/RegisterButton.png")}
        />
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
 background: {
    flex: 1,
    justifyContent: "center",
    width: scale(414),
    height: verticalScale(896),
    resizeMode: "stretch"
  },
  image: {
    width: scale(240),
    height: verticalScale(160),
    resizeMode: "contain",
    top: verticalScale(100),
    left: scale(5)
  },
  image2: {
    width: scale(240),
    height: verticalScale(120),
    resizeMode: "contain",
    alignItems: "center",
    top: verticalScale(80),
    left: scale(85)
  },
});

export default LoginScreen;