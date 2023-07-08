import React, { useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import * as firebase from '../firebase';
import AppButton from '../components/AppButton';
import colors from '../config/colors';

function Requester({ name, kid, minutes, index }) {
  const [mins, setMins] = useState(minutes);

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
          onPress: () => {
            // Approve request: call firebase.minutes and pass the current state of 'mins', the 'minutes' prop, and the 'kid' prop
            firebase.addMins(mins, minutes, kid);
            // TODO: Remove the request from the array
            firebase.removeRequest(kid, index);
          }
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
          onPress: () => {
            // TODO: Remove the request from the array
            firebase.removeRequest(kid, index);
          }
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
