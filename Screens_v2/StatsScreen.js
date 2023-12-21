import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import StatCard from '../Components_v2/StatCard';
import BubbleText from '../Components_v2/BubbleText';
import BlankButton from '../Components_v2/BlankButton';

function StatsScreen({navigation, route}) {
  let title = route.params.name + "'s Stats";
  let t2 = route.params.name + "'s Activity";
    return (
        <ImageBackground style={styles.background} source={require("../assets/backgrounds/15_morning_routine.png")}>
          <View style={{alignItems: "center", top: 50}}>
          <View style={{marginBottom: 20}}>
            <BubbleText size = {40}  text={title} />
          </View>

            <View style={{marginBottom: 20}}>
              <StatCard stat = "Minutes" minutes={route.params.minutes} width = {100} icon = {require("../assets/icons/Monkey.png")}/>
            </View>
            <View style={{marginBottom: 20}}>
              <StatCard stat = "Minutes Earned This Week" minutes={route.params.weekly} width = {70} icon = {require("../assets/icons/baby.png")}/>
            </View>
            <View style={{marginBottom: 20}}>
              <StatCard stat = "Total Minutes Earned" minutes={route.params.earned} width = {90} icon = {require("../assets/icons/kid.png")}/>
            </View>
            <View style={{marginBottom: 20}}>
              <StatCard stat = "Total Minutes Spent" minutes = {route.params.spent} width = {70} icon = {require("../assets/icons/astronaut.png")}/>
            </View>
            <BlankButton text={"Back to Menu"} onPress={() => navigation.navigate("ParentMenu")}/>
            <BlankButton text={t2} onPress={() => navigation.navigate("Activities", {
              name: route.params.name
            
            })}/>

          </View>

        </ImageBackground>
        );
}

const styles = StyleSheet.create({
  background: {
    flex: 1
  },
});

export default StatsScreen;