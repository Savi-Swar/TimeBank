import React,{useState} from 'react';
import { View, StyleSheet, ImageBackground, TextInput, Image, TouchableOpacity } from 'react-native';
import { useFonts } from "expo-font";
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling'; // Import scaling functions
import { Feather } from '@expo/vector-icons';
function AppTextInput({ iconSource, placeholder, value, onChangeText, width=450, secureTextEntry=false }) {
  const [finSecureTextEntry, setSecureTextEntry] = useState(secureTextEntry);

  const [loaded] = useFonts({
    BubbleBobble: require("../assets/fonts/BubbleBobble.ttf"),
  });

  width = scale(width)
  if (!loaded) {
    return null;
  }

  let minHeight = Math.max(70, verticalScale(70))
  const toggleSecureEntry = () => {
    setSecureTextEntry(!finSecureTextEntry);
  };
  return (
    <ImageBackground source={require("../assets/textinput.png")} style={[styles.container, {height: minHeight}]}>
        {iconSource && <Image source={iconSource} style={styles.icon} />}
        <TextInput 
          placeholder={placeholder} 
          placeholderTextColor="#D2623A"
          style={[styles.textInput, {paddingRight: secureTextEntry ? scale(165): scale(120)}]}
          value={value}
          onChangeText={onChangeText}
          autoCorrect = {false}
          autoCapitalize='none'
          autoComplete='off'
          spellCheck={false}
          secureTextEntry={finSecureTextEntry}
        />
        {secureTextEntry && <TouchableOpacity onPress={toggleSecureEntry}>
          <Feather name={finSecureTextEntry ? "eye-off" : "eye"} size={moderateScaleFont(24)} color="#D2623A" style={styles.eyeIcon} />
        </TouchableOpacity>}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
   
  },
  eyeIcon: {
    position: "absolute",
    right: scale(60), // Adjust the positioning as needed
    bottom: verticalScale(-8),
  },
  textInput: {
    height: Math.max(verticalScale(70),70),
    width: scale(380),
    fontFamily: 'BubbleBobble',
    fontSize: moderateScaleFont(20, 1),
    left: scale(70),
    bottom: verticalScale(3),
    backgroundColor: 'transparent',
    color: '#D2623A',
    zIndex: 0,  // Make sure the text input appears above the icon
  },
  icon: {
                  // Adjust this value as needed
    left: scale(60),              // Adjust this value as needed
    width: scale(25),
    height: verticalScale(25),
    top: verticalScale(-3),
    zIndex: 1,  // Make sure the icon appears below the text input
    resizeMode: "contain"
  },
});

export default AppTextInput;
