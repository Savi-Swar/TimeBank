import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text } from 'react-native';
import BubbleText from '../Components_v2/BubbleText';
import BlankButton from '../Components_v2/BlankButton';
import { FontAwesome } from '@expo/vector-icons';
import { playSound } from '../audio';
import { scale, verticalScale, moderateScaleFont } from '../scaling';
function Terms({ navigation, route }) {
    const [agree, setAgree] = useState(false);

    const handleAgree = () => {setAgree(!agree), playSound("select")};

    const navigateToPrivacyPolicy = () => {
        if (agree) {
            navigation.navigate('PrivacyPolicy', { userId: route.params.userId, displayName: route.params.displayName });
        } else {
            alert('You must agree to the terms and conditions before proceeding.');
        }
    };
    return (
        <ImageBackground style={styles.background} source={require("../assets/backgrounds/terms_conditions.png")}>
            <View style={{alignItems:"center", bottom: verticalScale(10)}}>
                <BubbleText text={"TERMS & CONDITIONS"} size={moderateScaleFont(28,1)}/>
                <View style={{width: '90%', top: verticalScale(5)}}>
                <BubbleText text={"Welcome to TimeBank, a mobile application designed to instill the habit of time-saving in young children. Before using TimeBank, please read these Terms and Conditions carefully. By accessing or using the TimeBank mobile application, you agree to be bound by these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use TimeBank."} lineSpacing={5} size={moderateScaleFont(19,1)}/>
                <View style = {{top: verticalScale(5)}}>
                    <BubbleText text={"1. Acceptance of Terms"} size={moderateScaleFont(28,1)} color='#650000'/>
                    <View style = {{top:verticalScale(10)}}>
                    <BubbleText text={"By using TimeBank, you confirm that you are either the legal guardian of the child using the application or that you are of legal age to form a binding contract. If you are the legal guardian, you are responsible for ensuring that your child complies with these Terms and Conditions."} lineSpacing={5} size={moderateScaleFont(19,1)}/>
                    </View>
                </View>
                <View style = {{top: verticalScale(25) }}>
                    <BubbleText text={"2. Use of TimeBank:**"} size={moderateScaleFont(28, 1)} color='#650000'/>
                    <View style = {{top:verticalScale(8)}}>

                    <BubbleText text={"TimeBank is intended for educational purposes and encouraging time-saving habits in young children. You agree not to use it for any other reason."} lineSpacing={5} size={moderateScaleFont(19,1)}/>
                    </View>
                </View>
            </View>
            </View>
            <View style={styles.checkboxContainer}>
                    <TouchableOpacity onPress={handleAgree} style={styles.checkbox}>
                    {agree && (
                        <FontAwesome name="check" size={scale(20)} color="#28bc74" /> // Render the FontAwesome check icon
                    )}
                    </TouchableOpacity>
                    <BubbleText text="Yes, I read and I agree." size={moderateScaleFont(16, 1)} />
                </View>

            <View style ={{alignItems: "center", top: verticalScale(5)}}>
                <BlankButton text={"Continue"} onPress={navigateToPrivacyPolicy}/>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(20), // Adjust as needed
        marginLeft: scale(20), // Adjust as needed
        left: scale(90)
    },
    checkbox: {
        width: scale(24),
        height: verticalScale(24),
        marginRight: scale(8),
        borderWidth: scale(1),
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(2), // Adjust padding to fit the check icon nicely
      },
    checkboxInner: {
        width: scale(12),
        height: verticalScale(12),
        backgroundColor: '#000',
    },
    button: {
        backgroundColor: '#000', // Choose your button color
        paddingHorizontal: scale(15), 
        paddingVertical: verticalScale(15),         
        marginTop: verticalScale(20), // Adjust as needed
        borderRadius: scale(5),
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff', // Choose your text color
        fontSize: moderateScaleFont(16,0.9),
    },
});

export default Terms;
