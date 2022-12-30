import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import colors from '../config/colors';

function Bar({icon, title}) {
    return (
        <View style={styles.container}>
            <View style = {{paddingRight: 10}}>
            <MaterialCommunityIcons name = {icon} size = {80} color = {colors.primary}/> 
            </View>
            <Text style = {styles.Text}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: 
  {flexDirection: "row", 
  height: 142, 
  alignItems: "center", 
  padding: 20, 
  borderColor: "black", 
  borderWidth: 2,
  backgroundColor: colors.light,
  
},
  Text: { fontSize: 40}
  
});

export default Bar;