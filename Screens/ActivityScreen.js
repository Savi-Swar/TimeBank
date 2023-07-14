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
      // add the function to set requests inside the callback
      firebase.getRequests(setRequests, setMins, route.params.name);
    }, []);
  
    const handleRemove = (index) => {
      setRequests(requests.filter((_, i) => i !== index));
    };
  
    const handleApprove = (index, kid, minutes) => {
      firebase.addMins(minutes, kid);
      handleRemove(index);
    };
  
    const handleDeny = (index, kid) => {
      firebase.removeRequest(kid, index);
      handleRemove(index);
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
            renderItem={({ item, index }) => 
              <Requester 
                name={item.name} 
                kid={route.params.name} 
                minutes={item.minutes} 
                index={index}
                onApprove={handleApprove}
                onDeny={handleDeny}
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
