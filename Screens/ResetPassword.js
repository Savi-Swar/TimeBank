import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AppButton from "../components/AppButton";
import * as Animatable from "react-native-animatable";
import { auth } from "../firebase";
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from "firebase/auth";



function ResetPassword({ navigation }) {
  
  const [email, setEmail] = useState("");

  async function handleSendVerification() {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        alert("This email hasn't been signed up yet.");
      } else {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email has been sent!");
      }
    } catch (error) {
      console.error("Error in handleSendVerification: ", error);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Enter Email</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
              <Text style={styles.text_footer}>Email</Text>
              <View style={styles.action}>
                <FontAwesome name="user-o" size={20} />
                <TextInput
                  placeholder="Your Email"
                  style={styles.textInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
              </View>
              <AppButton
                title="Send Verification"
                color="secondary"
                onPress={handleSendVerification}/>
            <AppButton
                title="Sign In"
                color="secondary"
                onPress={() => navigation.navigate("SignInScreen")}
            />
      </Animatable.View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ResetPassword;
