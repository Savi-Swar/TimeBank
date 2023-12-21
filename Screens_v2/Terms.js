import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text } from 'react-native';
import BubbleText from '../Components_v2/BubbleText';
import BlankButton from '../Components_v2/BlankButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome

function Terms({ navigation, route }) {
    const [agree, setAgree] = useState(false);

    const handleAgree = () => setAgree(!agree);

    const navigateToPrivacyPolicy = () => {
        if (agree) {
            navigation.navigate('PrivacyPolicy', { userId: route.params.userId, displayName: route.params.displayName });
        } else {
            alert('You must agree to the terms and conditions before proceeding.');
        }
    };
    return (
        <ImageBackground style={styles.background} source={require("../assets/backgrounds/terms_conditions.png")}>
            <View style={{alignItems:"center", bottom: 45}}>
                <BubbleText text={"TERMS & CONDITIONS"} size={28}/>
                <View style={{width: '90%', top: 15}}>
                <BubbleText text={"Welcome to TimeBank, a mobile application designed to instill the habit of time-saving in young children. Before using TimeBank, please read these Terms and Conditions carefully. By accessing or using the TimeBank mobile application, you agree to be bound by these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use TimeBank."} lineSpacing={5} size={20}/>
                <View style = {{top: 20}}>
                    <BubbleText text={"1. Acceptance of Terms"} size={28} color='#650000'/>
                    <View style = {{top:10}}>
                    <BubbleText text={"By using TimeBank, you confirm that you are either the legal guardian of the child using the application or that you are of legal age to form a binding contract. If you are the legal guardian, you are responsible for ensuring that your child complies with these Terms and Conditions."} lineSpacing={5} size={20}/>
                    </View>
                </View>
                <View style = {{top: 40 }}>
                    <BubbleText text={"2. Use of TimeBank:**"} size={28} color='#650000'/>
                    <View style = {{top:8}}>

                    <BubbleText text={"TimeBank is intended for educational purposes and encouraging time-saving habits in young children. You agree not to use it for any other reason."} lineSpacing={5} size={20}/>
                    </View>
                </View>
            </View>
            </View>
            <View style={styles.checkboxContainer}>
                    <TouchableOpacity onPress={handleAgree} style={styles.checkbox}>
                    {agree && (
                        <FontAwesome name="check" size={20} color="#28bc74" /> // Render the FontAwesome check icon
                    )}
                    </TouchableOpacity>
                    <BubbleText text="Yes, I read and I agree." size={16} />
                </View>

            <View style ={{alignItems: "center"}}>
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
        marginTop: 20, // Adjust as needed
        marginLeft: 20, // Adjust as needed
        left: 90
    },
    checkbox: {
        width: 24,
        height: 24,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2, // Adjust padding to fit the check icon nicely
      },
    checkboxInner: {
        width: 12,
        height: 12,
        backgroundColor: '#000',
    },
    button: {
        backgroundColor: '#000', // Choose your button color
        padding: 15,
        marginTop: 20, // Adjust as needed
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff', // Choose your text color
        fontSize: 16,
    },
    // ... other styles you might have ...
});

export default Terms;
