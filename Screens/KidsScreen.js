import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Kids } from "../firebase";
import colors from "../config/colors";
import KidsView from "../components/KidsView";
import Screen from "../components/Screen";
import Card from "../components/Card";

function KidsScreen() {
  const [kids, setKids] = useState([]);
  Kids(kids, setKids);
  return (
    <Screen>
      <View style={styles.screen}>
        <FlatList
          data={kids}
          keyExtractor={(kids) => kids.id}
          renderItem={({ item }) => (
            <KidsView title={item.name} subtitle={item.minutes} />
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
    paddingHorizontal: 20,
    flex: 0.8,
    top: 10,
  },
});

export default KidsScreen;
