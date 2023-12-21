import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  Platform,
  TextInput,
  Image,
} from "react-native";
import Logo from "../components/Logo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import AppButton from "../components/AppButton";
import * as Animatable from "react-native-animatable";
import { auth, createRecordWithUserId } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [display, setDisplay] = useState("");

  const [data, setData] = React.useState({
    username: "",
    password: "",
    confirm_password: "",
    check_textInputChange: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true,
  });
  const textInputChange = (val) => {
    if (val.length > 0) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  const updateConfirmSecureTextEntry = () => {
    setData({
      ...data,
      confirm_secureTextEntry: !data.confirm_secureTextEntry,
    });
  };
  const handleSignUp = () => {
    if ((confPassword == password) && password.length > 7) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          sendEmailVerification(user).then(() => {
            alert('Verification Email Sent. Please verify your email.');
  
            // Start checking if the email is verified
            const checkEmailVerified = setInterval(() => {
              user.reload().then(() => {
                if (user.emailVerified) {
                  clearInterval(checkEmailVerified);
                  navigation.navigate('TermsAndConditionsScreen', { userId: user.uid, display: display });
                }
              });
            }, 3000); // Check every 3 seconds
          }).catch((error) => {
              alert(error.message)
          });
        })
        .catch((error) => alert(error.message));
    } else {
      alert("Passwords do not match or are too short");
    }
  };
  

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Register Now!</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <Text style={styles.text_footer}>Email</Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} />
          <TextInput
            placeholder="Your Email"
            style={styles.textInput}
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        <Text style={[styles.text_footer, { marginTop: 35 }]}>Password</Text>
        <View style={styles.action}>
          <Feather name="lock" size={20} />
          <TextInput
            placeholder="Your Password"
            style={styles.textInput}
            autoCapitalize="none"
            secureTextEntry={data.secureTextEntry ? true : false}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
        </View>
        <Text style={[styles.text_footer, { marginTop: 35 }]}>
          Confirm Password
        </Text>

        <View style={styles.action}>
          <Feather name="lock" size={20} />
          <TextInput
            placeholder="Confirm Your Password"
            style={styles.textInput}
            autoCapitalize="none"
            secureTextEntry={data.confirm_secureTextEntry ? true : false}
            onChangeText={(text) => setConfPassword(text)}
          />
          <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
            {data.confirm_secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
          
        </View>
        <Text style={styles.text_footer}>Display Name</Text>
        <View style={styles.action}>
        <TextInput
            placeholder="Enter Display Name (eg Mom/Dad/etc)"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(text) => setDisplay(text)}
          />
        </View>
        
        <AppButton title="Sign Up" color="secondary" onPress={handleSignUp} />
        <AppButton
          title="Go to Sign In"
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
    marginBottom: 10,
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

export default SignUpScreen;
