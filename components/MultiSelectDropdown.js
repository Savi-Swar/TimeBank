import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../config/colors";

function MultiSelectDropdown ({ options, onSelection }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleItemPress = (item) => {
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
        <Text style={styles.itemText}>
          {/* Change button text based on whether all items are selected */}
          {selectedItems.length === options.length ? "Unselect All" : "Select All"}
        </Text>
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
