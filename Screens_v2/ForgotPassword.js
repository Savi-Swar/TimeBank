import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Image, Alert } from 'react-native';
import AppTextInput from '../Components_v2/AppTextInput';
import BigButton from '../Components_v2/BigButton';
import SmallButton from '../Components_v2/SmallButton';
import { auth } from "../firebase"; // Make sure this path is correct
import { sendPasswordResetEmail } from "firebase/auth";

function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");

  const handleSendVerification = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Check your email", "A link to reset your password has been sent to your email.", [{ text: "OK" }]);
    } catch (error) {
      Alert.alert("Error", error.message, [{ text: "OK" }]);
    }
  };

  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/08_forgot_password.png")}>
      <Image style={styles.image} source={require("../assets/Text/BubbleText9.png")} />
      <View style={{ bottom: 60 }}>
        <AppTextInput 
          placeholder="Email Address" 
          iconSource={require("../assets/icons/email.png")}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={{ alignItems: "center", bottom: 100 }}>
        <BigButton 
          onPress={handleSendVerification} // Use the actual password reset function here
          imageUrl={require("../assets/buttons/Verification.png")}
        />
      </View>
      <View style={styles.image2}>
        <SmallButton 
          onPress={() => navigation.goBack()} // Adjust if you have specific back navigation requirements
          imageUrl={require("../assets/Text/BubbleText8.png")}
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
    width: 350,
    height: 220,
    resizeMode: "contain",
    top: 20,
    left: 30
  },
  image2: {
    resizeMode: "contain",
    width: 140,
    top:120
  },
});

export default ForgotPassword;