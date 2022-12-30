import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import Screen from "./Screen";
function Logo({ tagline }) {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/Logo.png")} style={styles.logo} />
      <Text style={styles.tagline}>Time Is Money!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { width: 200, height: 200, bottom: 100 },
  tagline: {
    fontSize: 25,
    fontWeight: "600",
    paddingVertical: 20,
    bottom: 125,
  },
  container: {
    alignItems: "center",
  },
});

export default Logo;
