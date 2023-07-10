import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Modal, Button } from "react-native";
import { Kids } from "../firebase";
import colors from "../config/colors";
import KidsView from "../components/KidsView";
import Screen from "../components/Screen";
import Card from "../components/Card";
import { TouchableOpacity } from "react-native-gesture-handler";
import AppButton from "../components/AppButton";

function KidsScreen({ navigation }) {
  function nav() {
    navigation.navigate("Stats");
  }

  const [kids, setKids] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  Kids(kids, setKids); // call Kids inside useEffect

  const handleEditContents = () => {
    setModalVisible(true);
  };

  const handleButtonPress = (screen) => {
    setModalVisible(false);
    navigation.navigate(screen , {isAdult: true});
  };

  return (
    <Screen style={{ backgroundColor: colors.light }}>
      <View style={styles.screen}>
        <Button title="Edit Contents" onPress={handleEditContents} />
        <Modal animationType="slide" visible={modalVisible}>
          <View style={{width:'80%', alignItems: "center", justifyContent:"center", flex:1, left: 40, marginVertical: 100}}>
          <AppButton
            title="Routines"
            onPress={() => handleButtonPress("RoutinesScreen")}
          />
          <AppButton
            title="Store"
            onPress={() => handleButtonPress("StoreScreen")}
          />
          <AppButton
            title="Task"
            onPress={() => handleButtonPress("TasksScreen")}
          />
          <AppButton title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
        <FlatList
          data={kids}
          keyExtractor={(kids) => kids.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Stats", {
                  minutes: item.minutes,
                  name: item.name,
                  weekly: item.WeeklyMinutesEarned,
                  spent: item.MinutesSpent,
                  earned: item.MinutesAccumalated,
                })
              }
            >
              <KidsView title={item.name} subtitle={item.minutes} />
            </TouchableOpacity>
          )}
        />
        <AppButton title="Back" onPress={()=> navigation.navigate("WelcomeScreen")}/>
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
