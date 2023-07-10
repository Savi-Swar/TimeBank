import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, FlatList, Button } from "react-native";
import RoutineBar from "../components/RoutineBar";
import Screen from "../components/Screen";
import colors from "../config/colors";
import * as firebase from "../firebase";
import AppButton from "../components/AppButton";
import LottieView from "lottie-react-native";
import { MaterialIcons } from '@expo/vector-icons'; 
import TimeProgressBar from "../components/TimeProgressBar";

function RoutineViewScreen({ navigation, route }) {
  const [routines, setRoutines] = useState([]);
  const [showBar, setShowBar] = useState(false);
  const [iconName, setIconName] = useState('alarm-off');

  useEffect(() => {
    return () => {
      setRoutines([]); // This worked for me
    };
  }, []);

  useEffect(() => {
    updateRoutineBar();
    const interval = setInterval(updateRoutineBar, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const updateRoutineBar = () => {
    const currentTime = new Date();
    const start = new Date(currentTime.toDateString() + ' ' + route.params.st);
    const end = new Date(currentTime.toDateString() + ' ' + route.params.et);

    if (currentTime >= start && currentTime <= end) {
      setShowBar(true);
      setIconName('alarm');
    } else {
      setShowBar(false);
      setIconName('alarm-off');
    }
  };

  firebase.RoutinesCollections(
    routines,
    setRoutines,
    route.params.title,
    route.params.id,
  );
  const isAdult = route.params?.isAdult || false; // If isAdult is not passed or is undefined, it will default to false

  const navigateWithIsAdult = (screen, params = {}) => {
    if (isAdult) {
      navigation.navigate(screen, { ...params, isAdult: true });
    } else {
      navigation.navigate(screen, params);
    }
  }

  function nav() {
    navigation.navigate("HomeFile")
  }
  return (
    <Screen style={styles.container}>
      <View style={[styles.title, { backgroundColor: colors["secondary"] }]}>
        <AppButton title="Back" color = "secondary" onPress = {() =>  {if (isAdult) {
          navigation.navigate("RoutinesScreen", {isAdult: true})
         } else {
          navigation.navigate("HomeFile")
         }}}/>
        <Text style={styles.text}>{route.params.title}</Text>
        <View style = {{flexDirection: 'row', paddingVertical: 5}}>
          <View style = {{paddingHorizontal: 5}}>
            <MaterialIcons name={iconName} size={24} color="black" />
          </View>
          <Text style={styles.text2}>{route.params.st} - {route.params.et}</Text>
        </View>
        {showBar && <TimeProgressBar startTime={route.params.st} endTime={route.params.et} />}
      </View>
      <View style={styles.screen}>
        {routines.length > 0 ? (
          <FlatList
            data={routines}
            keyExtractor={(routines) => routines.id}
            renderItem={({ item }) => (
                <RoutineBar
              title={item.title}
              graphic={item.graphic}
              time={item.time}
              id={item.id}
              im = {item.indx}  
              colTitle={route.params.title}
              colId={route.params.id}
            />
            )}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <LottieView
              source={require("../animations/empty_routine.json")}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.emptyStateText}>
              This routine is empty, click ADD+ to add some steps!
            </Text>
          </View>
        )}
      </View>
      <View style={{ padding: 20, }}>
        <AppButton
          title="Add+"
          onPress={() =>
            navigateWithIsAdult("CreateRoutine", {
              name: route.params.title,
              id: route.params.id,
              et: route.params.et,
              st: route.params.st,
            })
          }
        />
           {!isAdult && (
          <AppButton 
            title="Complete"
            onPress={() =>
              navigateWithIsAdult("FinishedRoutineScreen", {
                obj: route.params.et,
                st: route.params.st,
                name: route.params.title
              })
            }
          />
        )}
        {isAdult && (
           <AppButton 
           title="Complete"
           onPress={() =>
             navigateWithIsAdult("FinishedRoutineScreen", {
               obj: route.params.et,
               st: route.params.st,
               name: route.params.title,
               isAdult: true
             })
           }
         />
        )
        }
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.secondary },
  text: {
    fontSize: 30,
  },
  text2: {
    fontSize: 15,

  },
  title: {
    alignItems: "center",
    paddingTop: 10,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary
  },
  screen: {
    backgroundColor: colors.light,
    flex: 1,
  },
  emptyStateText: {
    fontSize: 20,
    color: colors.dark,
    textAlign: "center",
    top: 180
  },
  lottie: {
    flex: 1,
  },
});

export default RoutineViewScreen;
