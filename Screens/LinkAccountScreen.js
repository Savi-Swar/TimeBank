import React, { useState, useEffect } from "react";
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
import { Formik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "../components/ErrorMessage";
import { addKids, auth, createCollectionWithUserId, createRecordWithUserId, updateActiveUser } from "../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LinkAccountScreen({ navigation }) {
  const [data, setData] = React.useState({
    user: "",
    pass: "",
    check_textInputChange: false,
    secureTextEntry: true,
  });
  const [loginFailed, setLoginFailed] = useState(false);
  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  const storeData = async (value) => {
    try {
        await AsyncStorage.setItem('@active_kid', value)
    } catch (e) {
      console.log(e)
    }
  }
  const storeUserDetails = async (userId, userType) => {
    try {
      await AsyncStorage.setItem('@user_id', userId);
      await AsyncStorage.setItem('@user_type', userType);
      await AsyncStorage.setItem('@active_kid', name);
    } catch (e) {
      console.log(e)
    }
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  async function handleSignIn() {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        await storeData(name);
        await storeUserDetails(user.uid, "kid", name);
        try {
          await createRecordWithUserId(user.uid);
          console.log("Collection created successfully");
        } catch (error) {
          console.log("Error creating collection: ", error);
        }        
        // await updateActiveUser(name);
        await addKids(name);
        navigation.navigate("HomeFile");
      } else {
        console.log("User not authenticated");
      }
    } catch (error) {
      console.log("Error in handleSignIn function: ", error);
      alert("Invalid LogIn");
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
        >
          {({ setFieldTouched, errors, touched }) => (
            <>
              {/* <Text style={{ color: "red", padding: 5 }} visible={loginFailed}>
                Invalid email and/or password
              </Text> */}
              <Text style={styles.text_footer}>Email</Text>
              <View style={styles.action}>
                <FontAwesome name="user-o" size={20} />
                <TextInput
                  onBlur={() => setFieldTouched("email")}
                  placeholder="Your Email"
                  style={styles.textInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={text => setEmail(text)}
                />
                {data.check_textInputChange ? (
                  <Animatable.View animation="bounceIn">
                    <Feather name="check-circle" color="green" size={20} />
                  </Animatable.View>
                ) : null}
              </View>
              {touched.email && errors.email && email === "" && (
                <Text style={{ color: "red", top: 5 }}>{errors.email}</Text>
              )}
              
              <Text style={[styles.text_footer, { marginTop: 35 }]}>
                Password
              </Text>
              <View style={styles.action}>
                <Feather name="lock" size={20} />
                <TextInput
                  placeholder="Your Password"
                  style={styles.textInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={password}
                  onChangeText={text => setPassword(text)}
                  secureTextEntry={data.secureTextEntry ? true : false}
                  onBlur={() => setFieldTouched("password")}
                />
                <TouchableOpacity onPress={updateSecureTextEntry}>
                  {data.secureTextEntry ? (
                    <Feather name="eye-off" color="grey" size={20} />
                  ) : (
                    <Feather name="eye" color="grey" size={20} />
                  )}
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && password === "" && (
                <Text style={{ color: "red", top: 5 }}>{errors.password}</Text>
              )}
              <Text style={[styles.text_footer, { marginTop: 35 }]}>Name</Text>
              <View style={styles.action}>
                <Feather name="aperture" size={20} />
                <TextInput
                  placeholder="Your Name"
                  style={styles.textInput}
                  autoCorrect={false}
                  value={name}
                  onChangeText={text => setName(text)}
                  secureTextEntry={false}
                />
              </View>
              <AppButton
                title="Sign In"
                color="secondary"
                onPress={() => handleSignIn()}
              />
            </>
          )}
        </Formik>
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

export default LinkAccountScreen;
