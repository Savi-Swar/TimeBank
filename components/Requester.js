import React, { useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import * as firebase from '../firebase';
import AppButton from '../components/AppButton';
import colors from '../config/colors';

function Requester({ name, kid, minutes, index, setLen }) {
  const [mins, setMins] = useState(minutes);

    // Rest of the code ...
  
    const handleApprove = () => {
      Alert.alert(
        "Approve Request",
        "Are you sure you want to approve this request?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "OK",
            onPress: () => onApprove(index, kid, minutes)
          }
        ]
      );
    };
  
    const handleDeny = () => {
      Alert.alert(
        "Deny Request",
        "Are you sure you want to deny this request?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "OK",
            onPress: () => onDeny(index, kid)
          }
        ]
      );
    };
    
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {minutes > 0 
          ? `${kid} finished ${name} and is requesting ${minutes} minutes` 
          : `${kid} wants ${name} for ${-minutes} minutes`
        }
      </Text>
      <View style={styles.buttonContainer}>
        <AppButton title="Approve" onPress={handleApprove} color='primary'/>
        <AppButton title="Deny" onPress={handleDeny} color='secondary'/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 25,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    paddingHorizontal: 20
  },
});

export default Requester;
