import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Kids } from "../firebase";
import colors from "../config/colors";
import KidsView from "../components/KidsView";
import Screen from "../components/Screen";
import Card from "../components/Card";
import { TouchableOpacity } from "react-native-gesture-handler";
 
function KidsScreen({navigation}) {
  function nav() {
    navigation.navigate("Stats")
  }
  const [kids, setKids] = useState([]);

  Kids(kids, setKids);  // call Kids inside useEffect
  return (
    <Screen  style = {{backgroundColor: colors.light}}>
      <View style={styles.screen}>
          <FlatList
            data={kids}
            keyExtractor={(kids) => kids.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress = {() => navigation.navigate("Stats", 
              {minutes: item.minutes, 
              name: item.name, 
              weekly: item.WeeklyMinutesEarned,
              spent: item.MinutesSpent,
              earned: item.MinutesAccumalated,
              })}>
                <KidsView title={item.name} subtitle={item.minutes} />
              </TouchableOpacity>
            )}
          />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    flex: 1,
    top: 10,
  },
});

export default KidsScreen;
