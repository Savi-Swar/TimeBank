import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text, ScrollView } from 'react-native';
import BubbleText from '../Components_v2/BubbleText';
import BlankButton from '../Components_v2/BlankButton';
import { createRecordWithUserId } from '../firebase';
import { playSound } from '../audio';
import { scale, verticalScale, moderateScaleFont } from '../scaling';
import { FontAwesome } from '@expo/vector-icons';
function PrivacyPolicy({ navigation, route }) {
    const [agree, setAgree] = useState(false);

    const handleAgree = () => {setAgree(!agree), playSound("select")};

    const navigateToPrivacyPolicy = () => {
        if (agree) {
            const userId = route.params.userId;
            const display = route.params.displayName; // Adjust this value as needed
            createRecordWithUserId(userId, display)
            .then(() => {
                playSound("transition")
                navigation.navigate('ParentHome', { userId: userId, canFetchUserData: true });
            })
            .catch((error) => {
                console.error("Error signing in: ", error);
                // You may also want to show an error message to the user
            });
                } else {
            playSound("alert")
            alert('You must agree to the terms and conditions before proceeding.');
        }
    };

    return (
        <ImageBackground style={styles.background} source={require("../assets/backgrounds/terms_conditions.png")}>
            <ScrollView>
            <View style={{alignItems:"center", bottom: verticalScale(-60)}}>
                <BubbleText text={"Privacy Policy"} size={moderateScaleFont(28,1)}  color='#650000'/>
                <View style={{width: '90%', top: verticalScale(20)}}>
                 <BubbleText text={"Welcome to TimeBank, an app dedicated to providing a personalized and engaging experience for children. This privacy policy outlines how we handle the personal information we collect and receive from our users."} lineSpacing={5} size={moderateScaleFont(16,1)}/>
                <View style = {{top: verticalScale(20)}}>
                    
                    {/* Details of Information Collection and Use */}
                    <BubbleText text={"1. Collection of Information\nTimeBank collects the following personal information when voluntarily submitted by users:\n- Email Address: To manage user accounts and communicate important updates.\n- User-Specified Information: Including names, nicknames of children, and other identifiers to personalize the user experience.\n- Photographs: Users may upload photographs to enhance their experience with the app.\nWe may also collect non-personal information such as usage data, device information, and user preferences."} lineSpacing={5} size={moderateScaleFont(16,1)}/>
                    <BubbleText text={"2. Use of Information\nThe collected information is used to enhance user experience, provide personalized content, manage user accounts, and improve our app.\nWe do not share or sell personal information with third parties for their marketing purposes."} lineSpacing={5} size={moderateScaleFont(16,1)}/>
                    <BubbleText text={"3. Data Storage and Security\nTimeBank implements standard security measures to protect the information we collect.\nHowever, we cannot guarantee absolute security as no electronic storage is 100% secure."} lineSpacing={5} size={moderateScaleFont(16,1)}/>
                    <BubbleText text={"4. User Responsibility\nThe submission of personal information on JiroAi is done at the user's own risk.\nUsers are encouraged to monitor and supervise their children's use of the app."} lineSpacing={5} size={moderateScaleFont(16,1)}/>
                    <BubbleText text={"5. No Liability\nTimeBank is not liable for any breach of data or unauthorized access to personal information.\nUsers acknowledge that they use the app and submit information at their own risk."} lineSpacing={5} size={moderateScaleFont(16,1)}/>
                    <BubbleText text={"6. Changes to the Privacy Policy\nWe reserve the right to modify this privacy policy at any time. Users are encouraged to review it periodically."} lineSpacing={5} size={moderateScaleFont(16,1)}/>
                    <BubbleText text={"7. Contact Us\nIf you have any questions about this privacy policy, please contact us at JiroAISolutions@gmail.com."} lineSpacing={5} size={moderateScaleFont(16,1)}/>

                </View>
            </View>
            </View>
            <View style ={{top: verticalScale(100), paddingBottom: verticalScale(150)}}>
                <View style={styles.checkboxContainer}>
                        <TouchableOpacity onPress={handleAgree} style={styles.checkbox}>
                        {agree && (
                            <FontAwesome name="check" size={moderateScaleFont(20,1)} color="#28bc74" /> // Render the FontAwesome check icon
                        )}
                        </TouchableOpacity>
                        <BubbleText text="Yes, I read and I agree." size={moderateScaleFont(16,1)} />
                    </View>
                <View style ={{alignItems: "center"}}>
                    <BlankButton text={"Continue"} onPress={navigateToPrivacyPolicy}/>
                </View>
            </View>
            </ScrollView>
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
        height: verticalScale(24),
        width: scale(24),
        marginRight: scale(8),
        borderWidth: scale(1),
        bottom: verticalScale(5),
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
        fontSize: moderateScaleFont(16,1),
    },
    // ... other styles you might have ...
});

export default PrivacyPolicy;
