import React from 'react';
import { View, StyleSheet, ImageBackground, Image, Text, Alert } from 'react-native';
import CustomButton from './CustomButton';
// Import the ImageButton component

function Requests({ navigation, name, minutes, kid, onApprove, onDeny }) {
  let text ="";
  if (minutes > 0) {
    text = kid + " is requesting " + minutes + " minutes for \"" + name + "\"";
  } else {
    text = kid + " wants to \"" + name + "\" for " + minutes + " minutes";
  }
  return (
    <View style={styles.card}>
         <View style = {{ flexDirection: "row"}}>
           
            <Text style = {{fontFamily: "BubbleBobble", fontSize: 25, color: "#00000", bottom:20, left: 15}}>{text}</Text>

        </View>
        <View style = {{ flexDirection: "row", position: "absolute", top: 85, left: 120}}>
          <CustomButton imageUrl={require("../assets/buttons/Reject.png")} height={60} width={120} onPress={onDeny}/>
          <CustomButton imageUrl={require("../assets/buttons/Approve.png")} height={60} width={120} onPress={onApprove}/>

        </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  card: {
      width: 375,
      height: 150,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 20,
      padding: 10,
      position: 'relative',
      backgroundColor: '#FFFFFF', // it's good to set a background color for better shadow visibility
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5, // for Android
      marginBottom: 20,
  },
});

export default Requests;
