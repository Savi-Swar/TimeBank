import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ImageBackground,Image, FlatList } from 'react-native';
import BigButton from '../Components_v2/BigButton';
import BackButton from '../Components_v2/BackButton';
import BubbleText from '../Components_v2/BubbleText';
import * as firebase from "../firebase";
import RoutineBar from '../Components_v2/RoutineBar';
import BlankButton from '../Components_v2/BlankButton';
import TimeProgressBar from '../Components_v2/TimeProgressBar';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';
function RoutineView({ navigation, route }) {
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    return () => {
      setRoutines([]); // This worked for me
    };
  }, []);
  useEffect(() => {
    firebase.RoutinesCollections(
      setRoutines,
      route.params.id,
    );
  }, [route.params.title, route.params.id]);
  const isAdult = route.params.isAdult; // If isAdult is not passed or is undefined, it will default to false
  let titleText = route.params.title
  let timeText = route.params.startTime + " - " + route.params.endTime;
  let active = route.params.isActive;
  let margin = active ? 10: 40;

  let empty = routines.length == 0;
  let text = isAdult ? "No Steps, Add Some Below!" : "No Steps, Ask your Parent to Add Some!";
  return (
    <ImageBackground style={styles.background} source={require("../assets/backgrounds/15_morning_routine.png")}>

      
      <View style={styles.header}>
        {isAdult ? (
        <BackButton 
          onPress={() => navigation.navigate("ParentRoutine")}
          imageUrl={require("../assets/buttons/Back.png")}
        />
        ) : (
        <BackButton 
          onPress={() => navigation.navigate("KidsNav")}
          imageUrl={require("../assets/buttons/Back.png")}/>
        )}
      </View>
      {active && (
      <View style={styles.progressBarContainer}>
        <TimeProgressBar startTime={route.params.startTime} endTime={route.params.endTime} />
      </View>
    )}
      <View style={{alignItems: "center", marginTop: margin}}>
        
        <Image style={styles.image} source={{ uri: route.params.url }} />
        <BubbleText size={moderateScaleFont(32)} text={titleText} />
        <View style={styles.timeContainer}>
          <Image style={styles.image2} source={require("../assets/icons/Timer.png")} />
          <BubbleText color="#21BF73" size={moderateScaleFont(24)} text={timeText} />
        </View>
      </View>

      <View style={styles.listContainer}>
        {empty ? (
          <BubbleText size={moderateScaleFont(24)} text={text} />
        ) : (
        <FlatList 
          data={routines}
          renderItem={({ item }) => (
            <RoutineBar 
              title={item.title}
              id={item.id}
              index={item.indx}
              colId={route.params.id}
              isAdult={isAdult}
            />
          )}
          keyExtractor={item => item.id}
        />
        )}
      </View>

      <View style={styles.footer}>
        {isAdult ? (
          <BlankButton 
            onPress={() => navigation.navigate("CreateRoutineStep", {
              title: route.params.title,
              id: route.params.id,
              et: route.params.endTime,
              st: route.params.startTime,
              isActive: route.params.isActive,
              url: route.params.url,
              isAdult: isAdult,
            })}
            text={"Add Steps"}
          />
        ) : (
          <BigButton 
            onPress={() => navigation.navigate("FinishRoutine", 
            {
              name: route.params.title,
              id: route.params.id,
              et: route.params.endTime,
              st: route.params.startTime,
              isAdult: isAdult,
              isActive: route.params.isActive,
              url: route.params.url,

            }
            )}
            imageUrl={require("../assets/buttons/Complete2.png")}
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: Math.min(scale(150), verticalScale(150)),
    height: Math.min(scale(150), verticalScale(150)),
    borderRadius: scale(120),
  },
  image2: {
    width: scale(35),
    height: verticalScale(35),
    resizeMode: "contain",
  },
  header: {
    position: 'absolute',
    top: verticalScale(50),
    left: scale(20),
  },
  progressBarContainer: {
    width: '90%', // Stretch across the full width
    marginTop: verticalScale(60), // Adjust this to position just above the image without overlap
    paddingHorizontal: 0, // Ensure there's no horizontal padding constraining the bar
  },
  
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(2),
    right: scale(10),
  },
  listContainer: {
    flex: 1,
    top: verticalScale(20),
    width: '100%',
    alignItems: "center"
  },
  footer: {
    marginTop: verticalScale(23),
    marginBottom: verticalScale(20),
    alignItems: "center",
  },
});


export default RoutineView;