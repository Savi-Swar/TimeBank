import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importing screens from Screens_v2 folder
import StoreScreen from '../Screens_v2/StoreScreen';
import TasksScreen from '../Screens_v2/TasksScreen';
import AccountScreen from '../Screens_v2/OnBoarding2';
import RoutinesScreen from '../Screens_v2/RoutinesScreen';
import KidAssignScreen from '../Screens_v2/OnBoarding4';

const Tab = createBottomTabNavigator();

// Function to choose the icon based on route name
const tabBarIcon = (route) => {
  let iconName;
  
  switch (route.name) {
    case 'Home':
      iconName = require('../assets/icons/Home.png');
      break;
    case 'Store':
      iconName = require('../assets/icons/Store.png');
      break;
    case 'Tasks':
      iconName = require('../assets/icons/Tasks.png');
      break;
    case 'Routines':
      iconName = require('../assets/icons/Routines.png');
      break;
    case 'Assignments':
      iconName = require('../assets/icons/Assignments.png');
      break;
    default:
      break;
  }

  return <Image source={iconName} style={{ width: 60, height: 60, top: 10 }} resizeMode="contain" />;
};

const TabsNav = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => tabBarIcon(route),
          headerShown: false,
        })}
        tabBarOptions={{
          showLabel: false, // Hides the text
          style: {
            borderTopLeftRadius: 20, // Adds curves to the navigator
            borderTopRightRadius: 20,
            // Add any other styling properties as per your needs
          },
          tabBarBackground: () => (
            <Image 
              source={require('../assets/backgrounds/navBar.png')} 
              style={StyleSheet.absoluteFillObject} 
            />
          ),
        }}
      >
        <Tab.Screen name="Home" component={AccountScreen} />
        <Tab.Screen name="Store" component={StoreScreen} />
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="Routines" component={RoutinesScreen} />
        <Tab.Screen name="Assignments" component={KidAssignScreen} />
  
      </Tab.Navigator>
    );
  };
  
  export default TabsNav;