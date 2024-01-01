import React from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity, FlatList } from 'react-native';
import BlankButton from '../Components_v2/BlankButton';
import RoutineStat from '../Components_v2/RoutineStat';
import { scale, verticalScale, moderateScale, moderateScaleFont } from '../scaling';

function RoutineStats({ route, navigation }) {
  const routineStats = route.params.routineStats;

  // Filter and convert routineStats object into an array for FlatList
  const routinesArray = Object.keys(routineStats)
    .filter(key => routineStats[key].timesCompleted > 0) // Filter out routines with 0 times completed
    .map(key => ({
      id: key,
      ...routineStats[key]
    }));



  return (
    <ImageBackground style={styles.container} source={require("../assets/backgrounds/15_morning_routine.png")}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Routine Stats
        </Text>
      </View>
      <FlatList
        data={routinesArray}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <RoutineStat 
              name={item.id} 
              st={item.st} 
              et={item.et} 
              times={item.times} 
              timesCompleted={item.timesCompleted}
              averageTime={item.averageTime} 
              lastCompleted={item.lastCompleted}
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.footer}>
        <BlankButton text={"Back to Menu"} onPress={() => navigation.navigate("ParentMenu")} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: "center",
    paddingVertical: verticalScale(20),
    top: verticalScale(20)
  },
  headerText: {
    fontFamily: "BubbleBobble",
    fontSize: moderateScaleFont(45),
    color: "#00000",
  },
  listItem: {
    marginHorizontal: scale(20), // Margin on sides for each item
    marginVertical: verticalScale(10),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: scale(20), // Padding on sides for the entire list
    paddingBottom: verticalScale(80), // Extra padding for the bottom
  },
  footer: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(30),
  },
});

export default RoutineStats;