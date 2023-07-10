import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import AppButton from '../components/AppButton'; // ensure correct path
import * as firebase from "../firebase"
import Requester from '../components/Requester'; // Ensure correct path

function ActivityScreen({navigation, route}) {
    const [names, setNames] = useState([]);
    const [mins, setMins] = useState([])
    const [requests, setRequests] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        firebase.getRequests(setNames, setMins, route.params.name);
      }, [refresh]);
    
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
                firebase.addMins(mins, minutes, kid);
                firebase.removeRequest(kid, index);
                onRemoveRequest();
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
                firebase.removeRequest(kid, index);
                onRemoveRequest();
              }
            }
          ]
        );
      };
    const [len, setLen] = useState(0)
    useEffect(() => {
    if (names.length && mins.length) {
        const requests = names.map((name, index) => {
        return { name: name, minutes: mins[index], index: index };
        });
        setRequests(requests);
    }
    }, [names, mins, len]);
    // console.log(len)
      return (
        <View style={styles.container}>
          <Text style={styles.titleText}>{route.params.name}'s Activity</Text>
          <FlatList 
            data={requests}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => 
                <Requester 
                name={item.name} 
                kid={route.params.name} 
                minutes={item.minutes} 
                index={item.index}
                setLen = {setLen}
                onRemoveRequest={() => setRefresh(prevRefresh => !prevRefresh)}
                />
            }
            />
          <View style={styles.buttonContainer}>
            <AppButton 
              title='Back'
              onPress={() => navigation.navigate('KidsScreen')}
            />
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
    alignSelf: 'center',
  },
  buttonContainer: {
    marginBottom: 30
  }
});

export default ActivityScreen;
