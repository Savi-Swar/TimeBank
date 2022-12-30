import React, { useState } from 'react';
import { View, Text,StyleSheet, Alert } from 'react-native';
import Screen from '../components/Screen';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from '../config/colors';
import Minutes from '../components/Minutes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as firebase from "../firebase"
import Bar from "../components/Bar"
import Logo from '../components/Logo';
function AccountScreen({navigation}) {
    const logout = () => {
        Alert.alert("Delete", "Are you sure you want to logout?", [
            { text: "Yes", onPress: () =>  {navigation.navigate("WelcomeScreen"), 
            firebase.updateActiveUser("")}},
            { text: "No" },
          ]);
    }  
    const [name, setName] = useState("def");
    firebase.retrieveUser(name, setName) 
    const resetUser = () => {
    
    }
    const [minutes, setMinutes] = useState(0);
    firebase.Mins(minutes, setMinutes, name);
    let state = " Minutes: " + minutes
    return (
    <Screen >
        {/* <Minutes/>
        <View style={styles.container}>

        <MaterialCommunityIcons
            color={colors.medium}
            name="account"
            size={40}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.title} numberOfLines={1}>
              Hello {name}!
            </Text>

          </View>

        </View>  
        <TouchableOpacity onPress={logout}>

        <View style = {styles.logOut}>
        <MaterialCommunityIcons
            color={colors.dark}
            name="logout"
            size={250}
          />  
        </View>   
        </TouchableOpacity>
      */}
      <View style = {{bottom: 70, backgroundColor: colors.tercary}}>
      <View style={{top: 130, backgroundColor: colors.tercary}}>
      <Logo/>
      </View>
      <Bar title =  {name} icon = "account"/>
      <Bar title = {state} icon = "gold"/>
      <Bar title = "Settings" icon = "cog"/>
      <TouchableOpacity onPress={logout}>   
        <Bar title = "Logout" icon = "logout"/>
        </TouchableOpacity>
   
      </View>

    </Screen>
    );
}

const styles = StyleSheet.create({
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
        fontSize:35,
      },
      logOut: {
          alignItems: "center",
          bottom: 200
      }
    });

export default AccountScreen;