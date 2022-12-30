import React from "react";
import colors from "../config/colors";
import Screen from "./Screen";
import { View, StyleSheet, Text } from "react-native";

function KidsView({ title, subtitle }) {
  return (
    <Screen style={styles.card}>
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle} minutes
        </Text>
      </View>
    </Screen>
  );
}

export default KidsView;

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  subtitle: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 15,
  },
  title: {
    marginBottom: 7,
    fontSize: 30,
  },
  card: {
    backgroundColor: colors.white,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  image: {
    height: 200,
    width: "100%",
  },
});
