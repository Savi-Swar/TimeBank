
import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Modal, Button, ImageBackground, Text } from "react-native";
import { Kids } from "../firebase";
import colors from "../config/colors";
import Screen from "../components/Screen";
import KidsViewer from "../Components_v2/KidViewer";
import Card from "../components/Card";
import { TouchableOpacity } from "react-native-gesture-handler";
import AppButton from "../components/AppButton";
import * as firebase from "../firebase";
import BlankButton from "../Components_v2/BlankButton";
import BubbleText from "../Components_v2/BubbleText";
function ParentMenu({ navigation }) {
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
      <ImageBackground style={styles.background} source={require("../assets/backgrounds/17_add.png")}>
        <TouchableOpacity onPress={handleEditContents} style={{top:50, left: 1, marginBottom: 50, alignItems: "center"}}>
          <BubbleText text={"Edit Contents"} size={30} underline= {true} color="#21BF73"/>
        </TouchableOpacity>
        <Modal animationType="slide" visible={modalVisible}>
          <View style={{width:'80%', alignItems: "center", justifyContent:"center", flex:1, left: 40, marginVertical: 100}}>
          
          <BlankButton
            text="Routines"
            onPress={() => handleButtonPress("ParentRoutine")}
          />
          <BlankButton
            text="Store"
            onPress={() => handleButtonPress("ParentStore")}
          />
          <BlankButton
            text="Task"
            onPress={() => handleButtonPress("ParentTask")}
          />
          <BlankButton
            text="Assignments"
            onPress={() => handleButtonPress("ParentAssignment")}
            />
          <BlankButton text="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>

        <FlatList
          data={kids}
          keyExtractor={(kids) => kids.id}
          renderItem={({ item }) => (
            <View style={{marginVertical: 10}}>
              <KidsViewer 
              name={item.name} 
              minutes={item.minutes}
              profilePic={item.profilePic}
              navigation={navigation}
              weekly={item.WeeklyMinutesEarned} 
              spent = {item.MinutesSpent}
              earned = {item.MinutesAccumulated}
              weeklyArray = {item.WeeklyArray}
              />
              </View>
          )}
        />
        <View style={{alignItems: "center", bottom: 20}}>
          <BlankButton text="Back" 
          onPress={()=> {navigation.navigate("ParentHome");
          }}/>
        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});

export default ParentMenu;
