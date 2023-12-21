import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importing screens from Screens_v2 folder
import StoreScreen from '../Screens_v2/StoreScreen';
import TasksScreen from '../Screens_v2/TasksScreen';
import RoutinesScreen from '../Screens_v2/RoutinesScreen';
import KidAssignScreen from '../Screens_v2/KidAssign';
import KidHome from '../Screens_v2/KidHome';
const Tab = createBottomTabNavigator();

// Function to choose the icon based on route name
const tabBarIcon = (route, focused) => {
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
  const iconStyle = {
    width: focused ? 50 : 40,
    height: focused ? 50 : 40,
    top: 2
  };

  return <Image source={iconName} style={iconStyle} resizeMode="contain" />;
};

const KidsNav = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => tabBarIcon(route),
          headerShown: false,
        //   tabBarShowLabel: false,
         
        tabBarStyle: {
            height: 80, // Adjust the height as needed
            backgroundColor: '#fff', // Background color of the tab bar
            borderTopLeftRadius: 25, // Curved top left corner
            borderTopRightRadius: 25, // Curved top right corner
            position: 'absolute', // Needed for curved corners
            paddingBottom: 20, // Padding at the bottom if needed
            shadowColor: '#000000',
            shadowRadius: 5
            // Add other styling properties as required
          },
          tabBarBackground: () => (
            <Image 
              source={require('../assets/backgrounds/navBar.png')} 
              style={StyleSheet.absoluteFillObject} 
            />
          ),
        })}
      >
        <Tab.Screen name="Home" component={KidHome} />
        <Tab.Screen name="Store" component={StoreScreen} />
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="Routines" component={RoutinesScreen} />
        <Tab.Screen name="Assignments" component={KidAssignScreen} />
  
      </Tab.Navigator>
    );
  };

export default KidsNav;