import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../config/colors";
import BubbleText from "./BubbleText";
import { playSound } from "../audio";
import { scale, verticalScale, moderateScaleFont } from "../scaling";
function MultiSelect ({ options, onSelection }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleItemPress = (item) => {
    playSound("select"); // Play the click sound
    let newSelectedItems = [...selectedItems];

    if (selectedItems.includes(item)) {
      newSelectedItems = newSelectedItems.filter((i) => i !== item);
    } else {
      newSelectedItems.push(item);
    }

    setSelectedItems(newSelectedItems);
    onSelection(newSelectedItems);
  };

  const handleSelectAllPress = () => {
    playSound("select"); // Play the click sound
    // If all items are already selected, deselect all. Otherwise, select all.
    if (selectedItems.length === options.length) {
      setSelectedItems([]);
      onSelection([]);
    } else {
      setSelectedItems(options);
      onSelection(options);
    }
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        key={"Select All"}
        style={[
          styles.item,
          selectedItems.length === options.length && styles.selectedItem,
        ]}
        onPress={handleSelectAllPress}
      >
         <Text style = {styles.itemText}>{selectedItems.length === options.length ? "Unselect All" : "Select All"}</Text> 
      </TouchableOpacity>
      {options.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.item,
            selectedItems.includes(item) && styles.selectedItem,
          ]}
          onPress={() => handleItemPress(item)}
        >
          <Text style = {styles.itemText}>{item}</Text>
        </TouchableOpacity>
      ))} 
   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  item: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: scale(20),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    backgroundColor: "#ffe57b",
    marginHorizontal: scale(4),
    marginVertical: verticalScale(4),
  },
  selectedItem: {
    backgroundColor:  "#d2623a",
  },
  itemText: {
    color: "#21BF73",
    fontFamily: "BubbleBobble"
  },
});

export default MultiSelect;
