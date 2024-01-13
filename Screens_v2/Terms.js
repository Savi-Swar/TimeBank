import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import BubbleText from '../Components_v2/BubbleText';
import BlankButton from '../Components_v2/BlankButton';
import { FontAwesome } from '@expo/vector-icons';
import { playSound } from '../audio';
import { scale, verticalScale, moderateScaleFont } from '../scaling';

function Terms({ navigation, route }) {
    const [agree, setAgree] = useState(false);

    const handleAgree = () => {
        setAgree(!agree);
        playSound("select");
    };

    const navigateToPrivacyPolicy = () => {
        if (agree) {
            navigation.navigate('PrivacyPolicy', { userId: route.params.userId, displayName: route.params.displayName });
        } else {
            alert('You must agree to the terms and conditions before proceeding.');
        }
    };

    return (
        <ImageBackground style={styles.background} source={require("../assets/backgrounds/terms_conditions.png")}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.contentContainer}>
                    <BubbleText text={"TERMS & CONDITIONS"} size={moderateScaleFont(28,1)}/>
                    
                    {/* New Terms and Conditions Content */}
                    <BubbleText text={"Terms and Conditions for TimeBank"} size={moderateScaleFont(22,1)} color='#650000'/>
                    <BubbleText text={"1. Acceptance of Terms\nBy accessing and using TimeBank (\"the App\"), users (\"Users\") agree to comply with and be bound by the following terms and conditions (\"Terms\"). If the User does not agree to these Terms, they should refrain from using the App."} lineSpacing={5} size={moderateScaleFont(16,1)}/>
                    <BubbleText text={"2. Data Collection and Use\nThe App collects personal information, such as email addresses, and allows Users to upload photographs. This data will be used to enhance User experience and for the operation of the App. By using the App, Users consent to this collection and use of personal data as described."} lineSpacing={5} size={moderateScaleFont(16,1)}/>
                    <BubbleText text={"3. User Obligations\nUsers agree not to use the App for any unlawful purpose, and not to upload any content that is illegal, offensive, or infringes on the rights of others."} lineSpacing={5} size={moderateScaleFont(16,1)}/>
                    <BubbleText text={"4. Data Security\nThe App employs reasonable security measures to protect the data collected. However, Users acknowledge that no internet transmission is completely secure or error-free and that the security of their data cannot be guaranteed."} lineSpacing={5} size={moderateScaleFont(16,1)}/>
                    <BubbleText text={"5. Limitation of Liability\nJiroAI (or \"Developer\"), its affiliates, officers, employees, agents, partners, and licensors are not liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to, any loss of data, resulting from (a) the use or inability to use the App; (b) unauthorized access to or alteration of Users’ transmissions or data; (c) any other matter relating to the App."} lineSpacing={5} size={moderateScaleFont(16,1)}/>
                    <BubbleText text={"6. Indemnification\nUsers agree to indemnify and hold harmless the Developer from any claim or demand, including reasonable attorneys’ fees, made by any third party due to or arising out of User’s use of the App, User’s violation of these Terms, or User’s violation of any rights of another."} lineSpacing={5} size={moderateScaleFont(16,1)}/>
                    <BubbleText text={"7. Modifications to the App and Terms\nThe Developer reserves the right, at its sole discretion, to modify or replace the App or these Terms at any time. Users are responsible for reviewing and becoming familiar with any such modifications."} lineSpacing={5} size={moderateScaleFont(16,1)}/>
                    <BubbleText text={"8. Contact Information\nFor any questions about these Terms, please contact +6584092871."} lineSpacing={5} size={moderateScaleFont(16,1)}/>

                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity onPress={handleAgree} style={styles.checkbox}>
                            {agree && (
                                <FontAwesome name="check" size={scale(20)} color="#28bc74" />
                            )}
                        </TouchableOpacity>
                        <BubbleText text="Yes, I read and I agree." size={moderateScaleFont(16, 1)} />
                    </View>

                    <View style={styles.buttonContainer}>
                        <BlankButton text={"Continue"} onPress={navigateToPrivacyPolicy} />
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
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        alignItems: "center",
        marginHorizontal: scale(20),
        marginVertical: verticalScale(10),
        top: verticalScale(50),
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(20),
        marginLeft: scale(20),
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
        paddingHorizontal: scale(2),
    },
    buttonContainer: {
        alignItems: "center",
        marginVertical: verticalScale(10),
        marginBottom: verticalScale(80),
    },
});

export default Terms;
