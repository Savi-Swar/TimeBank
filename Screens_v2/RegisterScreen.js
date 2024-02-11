import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image, Alert } from 'react-native';
import AppTextInput from '../Components_v2/AppTextInput';
import BigButton from '../Components_v2/BigButton';
import MediumButton from '../Components_v2/MediumButton';
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // Make sure this path is correct
import { playSound } from '../audio';
import { scale, verticalScale } from '../scaling';
import AsyncStorage from '@react-native-async-storage/async-storage';

function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [verificationCheckIntervalId, setVerificationCheckIntervalId] = useState(null);

  useEffect(() => {
    // This effect sets up the listener only once when the component mounts
    // because the empty dependency array [] ensures it only runs after the first render.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        if (user.emailVerified) {

          clearInterval(verificationCheckIntervalId);
          playSound("transition")
          navigation.navigate('Terms', { userId: user.uid, displayName: displayName });
        }
      }
    });

    return () => {
      // Cleanup function: called when the component unmounts
      unsubscribe();
      if (verificationCheckIntervalId) {
        clearInterval(verificationCheckIntervalId);
      }
    };
  }, [verificationCheckIntervalId, navigation, displayName]);

  const handleSignUp = () => {
    // Check for input errors first
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "The passwords you entered do not match.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Password Too Short", "The password must be at least 8 characters long.");
      return;
    }

    // Create the user with email and password
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        await AsyncStorage.setItem('@displayName', displayName);

        // Send email verification
        sendEmailVerification(userCredentials.user)
          .then(() => {
            Alert.alert(
              'Verification Pending',
              'Please verify your email to activate your account.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // Optionally navigate to a "Waiting for verification" screen
                    // or stay on the same screen.
                  },
                },
              ],
            );

            // Here we set up the interval to check for verification
            const intervalId = setInterval(() => {
              userCredentials.user.reload().then(() => {
                if (userCredentials.user.emailVerified) {
                  clearInterval(intervalId);
                  // Once verified, you can create user records or proceed as needed
                  // For example: createRecordWithUserId(user.uid, { displayName });
                  playSound("transition")
                  navigation.navigate('Terms', { userId: userCredentials.user.uid, displayName: displayName });
                }
              });
            }, 3000); // Check every 3 seconds

            setVerificationCheckIntervalId(intervalId);
          })
          .catch((error) => {
            playSound("alert")
            Alert.alert('Error', error.message);
          });
      })
      .catch((error) => {
        playSound("alert")
        Alert.alert("Registration Error", error.message);
      });
  };
  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/07_register.png")}>
      <Image style={styles.image} source={require("../assets/Text/BubbleText10.png")} />
      <View style={{ top: verticalScale(40) }}>
        <AppTextInput 
          placeholder="Email Address"
          iconSource={require("../assets/icons/email.png")}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={{ top: verticalScale(40) }}>
        <AppTextInput 
          placeholder="Password"
          iconSource={require("../assets/icons/lock.png")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={{ top: verticalScale(42) }}>
        <AppTextInput 
          placeholder="Confirm Password"
          iconSource={require("../assets/icons/lock.png")}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      <View style={{ top: verticalScale(45) }}>
        <AppTextInput 
          placeholder="Display Name (Mom, Dad, etc.)"
          iconSource={require("../assets/icons/user.png")}
          value={displayName}
          onChangeText={setDisplayName}
        />
      </View>
      <View style={{ alignItems: "center", bottom: verticalScale(-60) }}>
        <BigButton 
          onPress={handleSignUp}
          imageUrl={require("../assets/buttons/Register.png")}
        />
          {/* {user && !user.emailVerified && ( // Show this only if there is a user who has not verified their email
          <BlankButton 
            onPress={checkEmailVerification}
            text={"I've Verified"}
          />
          )} */}
      </View>
      <View style={{ alignItems: "center", bottom: verticalScale(-80), right: scale(70) }}>
        <MediumButton 
          onPress={() => navigation.navigate("Login")}
          imageUrl={require("../assets/buttons/Login.png")}
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
    width: scale(240),
    height: verticalScale(160),
    resizeMode: "contain",
    top: verticalScale(40),
    left: scale(30)
  },
  image2: {
    width: scale(240),
    height: verticalScale(120),
    resizeMode: "contain",
    left: scale(80),
    bottom: verticalScale(160)
  },
});

export default RegisterScreen;