import { NavigationContainer, useNavigation } from "@react-navigation/native";
import React, {useState} from "react";
import { View, StyleSheet, Text, ImageBackground } from "react-native";
import colors from "../config/colors";
import { retrieveDays } from "../firebase";
import AppButton from "./AppButton";
import Screen from "./Screen";
function Routine_Header({ title, id }) {
  const [days, setDays] = useState([]);
  const [months, setMonths] = useState([]);
  const navigation = useNavigation(); 

  retrieveDays(setDays, id, setMonths);
    var week = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var theMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let dayOfWeek = week[new Date().getDay()];
    let curMonth = theMonths[new Date().getMonth()];
    let length = 3;
    if (days.indexOf(dayOfWeek) != -1 && months.indexOf(curMonth) !=-1) {
      length = 0;
    }

    const styles = StyleSheet.create({
      container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "lime",
        borderWidth: length,
      
      },
      text: {
        fontSize: 30,
      },
    });

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.text}>{title}</Text>
        <View style={{ left: 10 }}>
          <AppButton
            borderColor = {colors.primary}
            title="view"
            onPress={() => 
              {
                navigation.navigate("RoutineViewScreen", {
                  title: title,
                  id: id,
                });
              }
            }
          />
        </View>
      </View>
    </Screen>
  );
}



export default Routine_Header;
