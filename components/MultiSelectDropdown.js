import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../config/colors";

// The MultiSelectDropdown component receives an array of options and a function to handle the selection
function MultiSelectDropdown ({ options, onSelection }) {
  // A state variable to keep track of the selected items
  const [selectedItems, setSelectedItems] = useState([]);

  // A function to handle the item press event
  const handleItemPress = (item) => {
    let newSelectedItems = [...selectedItems];

    // Check if the item is already selected
    if (selectedItems.includes(item)) {
      // If it is, remove it from the selected items array
      newSelectedItems = newSelectedItems.filter((i) => i !== item);
    } else {
      // If not, add the item to the selected items array
      newSelectedItems.push(item);
    }

    // Update the state with the new selected items array
    setSelectedItems(newSelectedItems);

    // Call the onSelection function, passing the new selected items array
    onSelection(newSelectedItems);
  };

  return (
    <View style={styles.container}>
      {options.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.item,
            // If the item is selected, apply the selected item style
            selectedItems.includes(item) && styles.selectedItem,
          ]}
          onPress={() => handleItemPress(item)}
        >
          <Text style={styles.itemText}>{item}</Text>
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
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
  },
  selectedItem: {
    backgroundColor: colors.primary,
  },
  itemText: {
    color: "#333",
  },
});

export default MultiSelectDropdown;
