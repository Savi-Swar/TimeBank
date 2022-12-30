import react from "react";
import AppButton from "../components/AppButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { View, StyleSheet, Text, ImageBackground } from "react-native";
import Screen from "../components/Screen";
import LinkAccountScreen from "./LinkAccountScreen";

function IdentificationScreen({ navigation }) {
  return (
    <ImageBackground style={styles.screen}>
      <Text style={styles.text}>Which One are You?</Text>
      <View style={styles.container}>
        <AppButton
          title="I am a Parent"
          onPress={() => navigation.navigate("SplashScreen")}
        />
        <AppButton
          title="I am a Child"
          onPress={() => navigation.navigate("LinkAccountScreen")}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.secondary,
    flex: 1,
    alignItems: "center",
  },
  container: {
    width: "80%",
    flex: 1,
    bottom: 80,
  },
  text: {
    padding: 100,
    fontSize: 20,
    color: colors.dark,
    textAlign: "center",
  },
});

export default IdentificationScreen;
