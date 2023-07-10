import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Animated } from 'react-native';
import Screen from '../components/Screen';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from '../config/colors';
import Minutes from '../components/Minutes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as firebase from "../firebase";
import Bar from "../components/Bar";
import Logo from '../components/Logo';

function AccountScreen({ navigation }) {


  const logout = () => {
    Alert.alert("Delete", "Are you sure you want to logout?", [
      {
        text: "Yes",
        onPress: () => {
          navigation.navigate("WelcomeScreen");
          firebase.updateActiveUser("");
          firebase.signoutUser();
        },
      },
      { text: "No" },
    ]);
  };

  const [minutes, setMinutes] = useState(0);
  const [name, setName] = useState("def");

  // const storeUserDetails = async (userId, userType) => {
  //   try {
  //     await AsyncStorage.setItem('@user_id', userId);
  //     await AsyncStorage.setItem('@user_type', userType);
  //   } catch (e) {
  //     // saving error
  //   }
  // }
  const getData = async () => {
    try {
        const value = await AsyncStorage.getItem('@active_kid')
        if(value !== null) {
            // value previously stored
            console.log(value)
            firebase.Mins(minutes, setMinutes, value);
            setName(value)
        }
    } catch(e) {
        // error reading value
    }
}


  useEffect(() => {  
    getData()
    // console.log(name)
  }, []);
  let state = " Minutes: " + minutes;

 

  return (
    <Screen style={styles.screen}>

        <View style={{ top: 130, backgroundColor: colors.tercary }}>
          <Logo />
        </View>
        <View style = {{width: '100%'}}>
        <Bar title={name} icon="account" />
        <Bar title={state} icon="gold" />
        <Bar title="Settings" icon="cog" />
        <TouchableOpacity onPress={logout}>
          <Bar title="Logout" icon="logout" />
          
        </TouchableOpacity>
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.tercary,
    bottom: 30
  },
  container: {
    flexDirection: "row",
    backgroundColor: colors.light,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    bottom: 100,
  },
  detailsContainer: {
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontWeight: "500",
    fontSize: 35,
  },
  logOut: {
    alignItems: "center",
    bottom: 200
  }
});

export default AccountScreen;
