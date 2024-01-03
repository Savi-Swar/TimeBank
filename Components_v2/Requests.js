import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CustomButton from './CustomButton';
import {scale, verticalScale, moderateScale, moderateScaleFont} from '../scaling';
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
           
            <Text style = {{fontFamily: "BubbleBobble", fontSize: moderateScaleFont(25), color: "#000000", bottom: verticalScale(20), left: scale(15)}}>{text}</Text>

        </View>
        <View style = {{ flexDirection: "row", position: "absolute", top: verticalScale(95), left: scale(110)}}>
          <CustomButton imageUrl={require("../assets/buttons/Reject.png")} height={verticalScale(40)} width={scale(129)} onPress={onDeny}/>
          <CustomButton imageUrl={require("../assets/buttons/Approve.png")} height={verticalScale(40)} width={scale(129)} onPress={onApprove}/>

        </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  card: {
      width: scale(375),
      height: verticalScale(150),
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: scale(20),
      paddingHorizontal: scale(10),
      paddingVertical: verticalScale(10),
      position: 'relative',
      backgroundColor: '#FFFFFF', // it's good to set a background color for better shadow visibility
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: verticalScale(2),
      },
      shadowOpacity: 0.25,
      shadowRadius: scale(3.84),
      elevation: scale(5), // for Android
      marginBottom: verticalScale(20),
  },
});

export default Requests;
