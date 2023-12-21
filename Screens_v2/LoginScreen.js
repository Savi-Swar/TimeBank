import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Image, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import BigButton from '../Components_v2/BigButton';
import AppTextInput from '../Components_v2/AppTextInput';
import MediumButton from '../Components_v2/MediumButton';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Make sure this path is correct

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigation.navigate("ParentHome"); // Adjust this to the screen you want to navigate to upon success
    } catch (error) {
      console.error(error);
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
      <View style={{ top: 135 }}>
        <AppTextInput 
          placeholder="Email Address"
          iconSource={require("../assets/icons/email.png")}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
      </View>
      <View style={{ top: 70 }}>
        <AppTextInput 
          placeholder="Password"
          iconSource={require("../assets/icons/lock.png")}
          onChangeText={setPassword}
          value={password}
          secureTextEntry // This is added to make the text input secure for password entry
        />
      </View>
      <View style={{ alignItems: "center", top: 40 }}>
        <BigButton 
          onPress={handleSignIn}
          imageUrl={require("../assets/buttons/LoginButton.png")}
        />
      </View>
      <View style={styles.image2}>
        <MediumButton 
          onPress={() => navigation.navigate("ForgotPassword")}
          imageUrl={require("../assets/Text/BubbleText6.png")}
        />
      </View>
      <View style={{ alignItems: "center", top: 20, right: 70 }}>
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
  },
  image: {
    width: 240,
    height: 160,
    resizeMode: "contain",
    top: 180,
    left: 5
  },
  image2: {
    width: 240,
    height: 120,
    resizeMode: "contain",
    left: 80,
    bottom: 30
  },
});

export default LoginScreen;