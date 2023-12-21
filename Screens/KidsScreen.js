import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Modal, Button } from "react-native";
import { Kids } from "../firebase";
import colors from "../config/colors";
import KidsView from "../components/KidsView";
import Screen from "../components/Screen";
import Card from "../components/Card";
import { TouchableOpacity } from "react-native-gesture-handler";
import AppButton from "../components/AppButton";
import * as firebase from "../firebase";
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
        <Button title="What Would You Like to Do?" onPress={handleEditContents} />
        <Modal animationType="slide" visible={modalVisible}>
          <View style={{width:'80%', alignItems: "center", justifyContent:"center", flex:1, left: 40, marginVertical: 100}}>
          <AppButton
            title="Assignments"
            onPress = {()=> handleButtonPress("AssignmentScreen")}
            />
          <AppButton
            title="Routines"
            onPress={() => handleButtonPress("Routines")}
          />
          <AppButton
            title="Store"
            onPress={() => handleButtonPress("Store")}
          />
          <AppButton
            title="Task"
            onPress={() => handleButtonPress("Tasks")}
          />
          <AppButton title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
        <FlatList
          data={kids}
          keyExtractor={(kids) => kids.id}
          renderItem={({ item }) => (
            
              <KidsView 
              title={item.name} 
              minutes={item.minutes}
              weekly={item.WeeklyMinutesEarned} 
              spent = {item.MinutesSpent}
              earned = {item.MinutesAccumulated}
              weeklyArray = {item.WeeklyArray}
              />
          )}
        />
        <AppButton title="Back" 
        onPress={()=> {navigation.navigate("EnterScreen");
        }}/>
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
