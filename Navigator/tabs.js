import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import StoreScreen from '../Screens/StoreScreen';
import TasksScreen from '../Screens/TasksScreen';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AccountScreen from '../Screens/AccountScreen';
import RoutinesScreen from '../Screens/RoutinesScreen';
import AssignmentScreen from '../Screens/AssignmentScreen';
import KidAssignScreen from '../Screens/KidAssignScreen';
const Tab = createBottomTabNavigator();

const screenOptions = (route, color) => {
    let iconName;
  
    switch (route.name) {
      case 'Home':
        iconName = 'home';
        break;
      case 'Store':
        iconName = 'shopping';
        break;
      case 'Tasks':
        iconName = 'broom';
        break;
    case 'Routines':
        iconName = 'bowl';
        break;
    case 'Assignments':
        iconName = "clock-outline"
        break;

      default:
        break;
    }
  
    return <Icon name={iconName} color={color} size={30} />;
  };
  

const Tabs = () => {
    return(
        <Tab.Navigator
        
        screenOptions={({route}) => ({
            tabBarIcon: ({color}) => screenOptions(route, color), headerShown: false
          })}>

            <Tab.Screen name = "Home" component = {AccountScreen}/>
            <Tab.Screen name="Store" component={StoreScreen} />
            <Tab.Screen name="Tasks" component={TasksScreen} />
            <Tab.Screen name="Routines" component={RoutinesScreen} />
            <Tab.Screen name = "Assignments" component = {KidAssignScreen}/>

   
        </Tab.Navigator>
    );
}

export default Tabs;