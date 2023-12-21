import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import CustomCheckbox from '../components/CustomCheckbox';
import { createRecordWithUserId } from '../firebase';
function TermsAndConditionsScreen({navigation, route}) {
    const [isSelected, setSelection] = useState(false); // Added state declaration here

    return (
        <Screen>
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Terms and Conditions</Text>
            <Text style={styles.paragraph}>
                1. Introduction
                {"\n\n"}
                Welcome to our mobile application. By accessing and using our services, you agree to abide by the terms and conditions herein. 
                {"\n\n"}
                2. Privacy Policy
                {"\n\n"}
                Our privacy policy explains the data we collect, use, store, and process while you use and access our application. We respect your privacy and make significant efforts to protect all your data. 
                {"\n\n"}
                3. Services
                {"\n\n"}
                We strive to provide the best services to our users. However, the operation and availability of the services covered in our app can vary and are subject to our sole discretion. 
                {"\n\n"}
                4. Changes to Terms
                {"\n\n"}
                We reserve the right to modify these terms from time to time at our sole discretion. Therefore, you should review this page periodically. 
                {"\n\n"}
                5. Contact Us
                {"\n\n"}
                For any questions or clarifications, you may contact us through the contact information provided on our application.
            </Text>
            <View style={styles.checkboxContainer}>
                <CustomCheckbox
                    value={isSelected}
                    onValueChange={setSelection}
                    label="I have read and I agree"
                />
                </View>
                <AppButton
                    title="Sign In"
                    color="secondary"
                    onPress={() => {
                        const userId = route.params.userId;
                        const display = route.params.display; // Adjust this value as needed
                        createRecordWithUserId(userId, display)
                        .then(() => {
                            navigation.navigate('EnterScreen', { userId: userId });
                        })
                        .catch((error) => {
                            console.error("Error signing in: ", error);
                            // You may also want to show an error message to the user
                        });
                    }}
                    disabled={!isSelected} // the button is disabled if the checkbox isn't selected
                />
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    paragraph: {
        fontSize: 18,
        marginBottom: 10,
        lineHeight: 24,
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: "center",
    },
    label: {
        margin: 8,
    },
});

export default TermsAndConditionsScreen;





