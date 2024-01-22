import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Image, Alert } from 'react-native';
import AppTextInput from '../Components_v2/AppTextInput';
import BigButton from '../Components_v2/BigButton';
import SmallButton from '../Components_v2/SmallButton';
import { auth } from "../firebase"; // Make sure this path is correct
import { sendPasswordResetEmail } from "firebase/auth";
import { playSound } from '../audio';
import { scale, verticalScale } from '../scaling';

function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");

  const handleSendVerification = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      playSound("alert")
      Alert.alert("Check your email", "A link to reset your password has been sent to your email.", [{ text: "OK" }]);
    } catch (error) {
      playSound("alert")
      Alert.alert("Error", "User not found", [{ text: "OK" }]);
    }
  };

  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/08_forgot_password.png")}>
      <Image style={styles.image} source={require("../assets/Text/BubbleText9.png")} />
      <View style={{ bottom: verticalScale(150) }}>
        <AppTextInput 
          placeholder="Email Address" 
          iconSource={require("../assets/icons/email.png")}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={{ alignItems: "center", bottom: verticalScale(145) }}>
        <BigButton 
          onPress={handleSendVerification} // Use the actual password reset function here
          imageUrl={require("../assets/buttons/Verification.png")}
        />
      </View>
      <View style={styles.image2}>
        <SmallButton 
          onPress={() => {navigation.goBack()}} // Adjust if you have specific back navigation requirements
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
    width: scale(350),
    height: verticalScale(220),
    resizeMode: "contain",
    bottom: verticalScale(100),
    left: scale(30)
  },
  image2: {
    resizeMode: "contain",
    width: scale(140),
    top: verticalScale(160),
    left: scale(30)
  },
});

export default ForgotPassword;