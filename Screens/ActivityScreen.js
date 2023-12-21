import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import AppButton from '../components/AppButton'; // ensure correct path
import * as firebase from "../firebase"
import Requester from '../components/Requester'; // Ensure correct path

function ActivityScreen({navigation, route}) {
    const [mins, setMins] = useState([])
    const [names, setNames] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [data, setData] = useState([]);

    
    useEffect(() => {
      const unsubscribe = firebase.getRequests(setNames, setMins, route.params.name);
      return () => unsubscribe();
    }, []);
    
    
    useEffect(() => {
      if (names.length && mins.length) {
        let d = names.map((name, index) => {
          return { name: name, minutes: mins[index] };
        });
        setData(d);
      }
    }, [names, mins]);
    
  
    const handleRemove = (index) => {
      setData(data.filter((_, i) => i !== index));
    };
  
    const handleApprove = (index, kid, minutes) => {
      firebase.addMins(minutes, kid);
      firebase.removeRequest(kid, index);

      handleRemove(index);
    };
  
    const handleDeny = (index, kid) => {
      firebase.removeRequest(kid, index);
      handleRemove(index);
    };
  

      return (
        <View style={styles.container}>
          <Text style={styles.titleText}>{route.params.name}'s Activity</Text>
          <FlatList 
            data={data}
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
