import React, {useState} from "react";
import { View, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import * as firebase from "../firebase";
import { remove, getDatabase, ref, get, set } from "firebase/database";
import BubbleText from "./BubbleText";
import { playSound } from "../audio";
import { scale, verticalScale, moderateScaleFont } from '../scaling';


function RoutineBar({ title, id, colId, index, isAdult = true }) {
    // ... existing logic for handlePress, deleteTask, rearrangeUp, rearrangeDown
    const handlePress = () => {
        playSound("alert"); // Play the alert sound
        Alert.alert("Delete", "Are you sure you want to delete this step?", [
          { text: "Yes", onPress: () => {deleteTask(), playSound('pop')} },
          { text: "No", onPress: () => playSound('minimise') },
        ]);
      };
      const deleteTask = async () => {
        const db = getDatabase();
        const userId = firebase.auth.currentUser.uid;
        const colRef = ref(db, `Users/${userId}/routines/${colId}/steps`);
        let im = index;
        // Get the snapshot of the collection
        get(colRef).then((snapshot) => {
          const data = snapshot.val();
          const keys = Object.keys(data);

      
          // Loop through each step
          keys.forEach((key) => {
            const stepData = data[key];
      
            // If the indx of the step is greater than the indx of the deleted step, decrement it
            if (stepData.indx > im) {
              const stepRef = ref(db, `Users/${userId}/routines/${colId}/steps/${key}`);
              set(stepRef, {
                ...stepData,
                indx: stepData.indx - 1,
              });
            }
          });
      
          // Delete the step
          const docRef = ref(db, `Users/${userId}/routines/${colId}/steps/${id}`);
          remove(docRef).catch((error) => {
            console.error("Error deleting document: ", error);
          });
        });
      };
      
      const rearrangeUp = () => {
        playSound("click"); // Play the click sound
        if (index != 1) {
          firebase.rearrangeRoutine(title, colId, id, index, true)
          console.log("Rearrange up");
        }
      };
      let x = firebase.getRoutineLength(colId);
      const rearrangeDown = () => {
        playSound("click"); // Play the click sound

        if (x != index) {
        firebase.rearrangeRoutine(title, colId, id, index, false)
    
        console.log("Rearrange down");
        } 
      };
    let barHeight = verticalScale(125); // Adjusted for new card style
    let fontSize = moderateScaleFont(25); // Original font size
    let iconSize = moderateScaleFont(40); // Adjusted icon size for new card style

    // Adjust font size based on card height
    fontSize = fontSize * (barHeight / 100);
    iconSize = iconSize * (barHeight / 100);
    const [isChecked, setIsChecked] = useState(false);
    const toggleCheckbox = () => {
        setIsChecked(!isChecked);
    };
    return (
        <View style={styles.card}>
            <View style={styles.arrowContainer}>
                <TouchableOpacity onPress={() => rearrangeUp(index)}>
                    <FontAwesome name="arrow-up" size={fontSize} color="#FFCD01" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => rearrangeDown(index)}>
                    <FontAwesome name="arrow-down" size={fontSize} color="#FFCD01" />
                </TouchableOpacity>
            </View>
            <View style = {{marginRight: scale(100)}}>
                <BubbleText text={title} size = {moderateScaleFont(24)} 
                  strikeThrough={isChecked ? styles.strikeThrough : null}
                  color = {isChecked ? "#A9A9A9" : "#000000"}/>
            </View>
            <TouchableOpacity onPress={toggleCheckbox} style={{position: "absolute", right: scale(20)}}>
                    {isChecked ? (
                        <FontAwesome5 name="check-square" size={iconSize/1.5} color="#000000" />
                    ) : (
                        <FontAwesome5 name="square" size={iconSize/1.5} color="#000000" />
                    )}
            </TouchableOpacity>
            {/* <Text style={[styles.text, { fontSize: fontSize }]}>"S"</Text> */}
            {isAdult && (
            <TouchableOpacity style={styles.pos} onPress={handlePress}>
                <Image source={require("../assets/icons/x.png")} style={styles.x} />
            </TouchableOpacity>
            )}

        </View>
    );
}

const styles = StyleSheet.create({

  strikeThrough: {
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
  },
    card: {
        width: scale(350),
        height: verticalScale(125),
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: scale(20),
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(10),
        borderWidth: scale(3),
        borderStyle: "dashed",
        backgroundColor: '#FFFFFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.25,
        shadowRadius: scale(3.84),
        elevation: scale(5),
        marginBottom: verticalScale(20)
    },
    arrowContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginRight: scale(10),
    },
    text: {
        flex: 1,
        fontSize: moderateScaleFont(25),
        paddingHorizontal: scale(10),
    },
    deleteButton: {
        marginRight: scale(5),
    },
    x: {
        width: scale(40),
        height: verticalScale(40),
    },
    pos: {
        position: "absolute",
        left: scale(313),
        bottom: verticalScale(92)
    },
});

export default RoutineBar;
