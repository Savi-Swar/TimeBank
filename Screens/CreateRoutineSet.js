import React, { Component, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Alert,
  Keyboard,
} from "react-native";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import Logo from "../components/Logo";
import Screen from "../components/Screen";
import colors from "../config/colors";
import TasksScreen from "./TasksScreen";
import StoreScreen from "./StoreScreen";
import ImagePickerExample from "../components/ImagePicker";
import * as firebase from "../firebase";
import { uploadBytes } from "firebase/storage";
import LottieView from "lottie-react-native";
import RoutineViewScreen from "./RoutineViewScreen";
function CreateRoutineSet({ navigation, route }) {
  // This screen is actualy for creating steps in a routine mb g
  // I had to make two useState variables so I could use both of them on this screen
  const [nameInputValue, setNameInputValue] = useState("");

  const todoRef = firebase.firebase.firestore().collection("routines");
  let id = firebase.makeid(20);
  // add a new field
  function createDaysOfWeek(daysOfWeek) {
    let index1 = 0;
    if (pressedMon) {
      daysOfWeek[index1] = "Monday"
      index1++;
    }
    if (pressedTue) {
      daysOfWeek[index1] = "Tuesday"
      index1++;
    }
    if (pressedWed) {
      daysOfWeek[index1] = "Wednesday"
      index1++;
    }
    if (pressedThu) {
      daysOfWeek[index1] = "Thursday"
      index1++;
    }
    if (pressedFri) {
      daysOfWeek[index1] = "Friday"
      index1++;
    }
    if (pressedSat) {
      daysOfWeek[index1] = "Saturday"
      index1++;
    }
    if (pressedSun) {
      daysOfWeek[index1] = "Sunday"
      index1++;
    }
  }
  function createMonthsOfYear(months) {
    let index = 0;
    if (pressedJan) {
      months[index] = "January"
      index++;
    }
    if (pressedFeb) {
      months[index] = "February"
      index++;
    }
    if (pressedMar) {
      months[index] = "March"
      index++;
    }
    if (pressedApr) {
      months[index] = "April"
      index++;
    }
    if (pressedMay) {
      months[index] = "May"
      index++;
    }
    if (pressedJun) {
      months[index] = "June"
      index++;
    }
    if (pressedJul) {
      months[index] = "July"
      index++;
    }
    if (pressedAug) {
      months[index] = "Aug"
      index++;
    }
    if (pressedSep) {
      months[index] = "September"
      index++;
    }
    if (pressedOct) {
      months[index] = "October"
      index++;
    }
    if (pressedNov) {
      months[index] = "November"
      index++;
    }
    if (pressedDec) {
      months[index] = "December"
      index++;
    }
  }

  function addField() {


    createMonthsOfYear(monthsOfYear)
    createDaysOfWeek(daysOfWeek)

    for (let i = 0; i < daysOfWeek.length; i++) {
      console.log(daysOfWeek[i]);
    }
    if (nameInputValue && nameInputValue.length > 0) {
      const data = {
        title: nameInputValue,
        days: daysOfWeek,
        months: monthsOfYear,
      };

      todoRef
        .doc(id)
        .set(data)
        .then(() => {
          Keyboard.dismiss();
          daysOfWeek = [];
          monthsOfYear = [];
          setPressedMon(false);
          setPressedTue(false);
          setPressedWed(false);
          setPressedThu(false);
          setPressedFri(false);
          setPressedSat(false);
          setPressedSun(false);
          setPressedJan(false);
          setPressedFeb(false);
          setPressedMar(false);
          setPressedApr(false);
          setPressedMay(false);
          setPressedJun(false);
          setPressedJul(false);
          setPressedAug(false);
          setPressedSep(false);
          setPressedOct(false);
          setPressedNov(false);
          setPressedDec(false);
          setNameInputValue("");
        })
        .catch(error => {
          alert(error);
        });
      
    }
  }
  // Couldn't think of more efficient way ;(
  const [pressedMon, setPressedMon] = useState(false)
  const [pressedTue, setPressedTue] = useState(false)
  const [pressedWed, setPressedWed] = useState(false)
  const [pressedThu, setPressedThu] = useState(false)
  const [pressedFri, setPressedFri] = useState(false)
  const [pressedSat, setPressedSat] = useState(false)
  const [pressedSun, setPressedSun] = useState(false)
  // Months
  const [pressedJan, setPressedJan] = useState(false)
  const [pressedFeb, setPressedFeb] = useState(false)
  const [pressedMar, setPressedMar] = useState(false)
  const [pressedApr, setPressedApr] = useState(false)
  const [pressedMay, setPressedMay] = useState(false)
  const [pressedJun, setPressedJun] = useState(false)
  const [pressedJul, setPressedJul] = useState(false)
  const [pressedSep, setPressedSep] = useState(false)
  const [pressedAug, setPressedAug] = useState(false)
  const [pressedOct, setPressedOct] = useState(false)
  const [pressedNov, setPressedNov] = useState(false)
  const [pressedDec, setPressedDec] = useState(false)
  let daysOfWeek = [];
  let monthsOfYear = [];
  return (
    <Screen>
      <View style={styles.container}>
        <Logo />
      </View>
      <Text style={styles.text}>Name</Text>

      <View style={styles.name}>

        <TextInput
          onChangeText={text => setNameInputValue(text)}
          value={nameInputValue}
          placeholder="name"
        />
      </View>
      <View style={styles.title}>
        <Text style={styles.text}>Days of Week</Text>
        <View style={{ marginHorizontal: 140, flexDirection: "row" }}>
          <View>
            
            <AppButton
              title="Monday"
              color="secondary"
              borderWidth={pressedMon === true ? 2 : 0}
              onPress={() => setPressedMon(!pressedMon)}
            />
            <AppButton title="Thursday" color="secondary"
              borderWidth={pressedThu === true ? 2 : 0}
              onPress={() => setPressedThu(!pressedThu)} />
          </View>
          <View>
            <AppButton title="Tuesday" color="secondary"
              borderWidth={pressedTue === true ? 2 : 0}
              onPress={() => setPressedTue(!pressedTue)} />
            <AppButton title="Friday" color="secondary" 
              borderWidth={pressedFri === true ? 2 : 0}
              onPress={() => setPressedFri(!pressedFri)}/>

            <AppButton title="Sunday" color="secondary"
              borderWidth={pressedSun === true ? 2 : 0}
              onPress={() => setPressedSun(!pressedSun)} />
          </View>

          <View>
            <AppButton title="Wednesday" color="secondary" 
              borderWidth={pressedWed === true ? 2 : 0}
              onPress={() => setPressedWed(!pressedWed)}/>

            <AppButton title="Saturday" color="secondary"
              borderWidth={pressedSat === true ? 2 : 0}
              onPress={() => setPressedSat(!pressedSat)} />
          </View>
        </View>
      
        <Text style={styles.text}>Months of Year</Text>
        <View style={{ marginHorizontal: 140, flexDirection: "row" }}>
          <View>
            
            <AppButton
              title="January"
              color="secondary"
              borderWidth={pressedJan === true ? 2 : 0}
              onPress={() => setPressedJan(!pressedJan)}
            />
            <AppButton title="April" color="secondary"
              borderWidth={pressedApr === true ? 2 : 0}
              onPress={() => setPressedApr(!pressedApr)} />
            <AppButton title="July" color="secondary"
              borderWidth={pressedJul === true ? 2 : 0}
              onPress={() => setPressedJul(!pressedJul)} />
            <AppButton title="October" color="secondary" 
              borderWidth={pressedOct === true ? 2 : 0}
              onPress={() => setPressedOct(!pressedOct)}/>
          </View>
          <View>


            <AppButton title="Feburary" color="secondary"
              borderWidth={pressedFeb === true ? 2 : 0}
              onPress={() => setPressedFeb(!pressedFeb)} />
            <AppButton title="May" color="secondary"
              borderWidth={pressedMay === true ? 2 : 0}
              onPress={() => setPressedMay(!pressedMay)} />
            <AppButton title="August" color="secondary"
              borderWidth={pressedAug === true ? 2 : 0}
              onPress={() => setPressedAug(!pressedAug)} />
            <AppButton title="November" color="secondary"
              borderWidth={pressedNov === true ? 2 : 0}
              onPress={() => setPressedNov(!pressedNov)} />
          </View>

          <View>
            <AppButton title="March" color="secondary" 
              borderWidth={pressedMar === true ? 2 : 0}
              onPress={() => setPressedMar(!pressedMar)}/>

            <AppButton title="June" color="secondary"
              borderWidth={pressedJun === true ? 2 : 0}
              onPress={() => setPressedJun(!pressedJun)} />
            <AppButton title="September" color="secondary"
              borderWidth={pressedSep === true ? 2 : 0}
              onPress={() => setPressedSep(!pressedSep)} />
            <AppButton title="December" color="secondary"
              borderWidth={pressedDec === true ? 2 : 0}
              onPress={() => setPressedDec(!pressedDec)} />
          </View>
        </View>
      </View>
      <View style={styles.buttons}>
        <AppButton
          title="Create"
          onPress={() => {
            addField(), navigation.navigate("HomeFile");
          }}
        />
      </View>
    </Screen>
  );
}

//similarly I had to create multiple stylesheets to format

const styles = StyleSheet.create({
  container: { top: 100 },
  name: {
    backgroundColor: colors.grey,
    borderRadius: 25,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  minutes: {
    backgroundColor: colors.grey,
    borderRadius: 25,
    padding: 15,
    marginHorizontal: 15,
  },
  buttons: {
    margin: 20,
    top: 200
  },
  title: {
    alignItems: "center",
    flex: 0.5
  },
  text: {
    fontSize: 25,
  },
});

export default CreateRoutineSet;
