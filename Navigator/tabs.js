import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import StoreScreen from '../Screens/StoreScreen';
import TasksScreen from '../Screens/TasksScreen';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AccountScreen from '../Screens/AccountScreen';
import RoutinesScreen from '../Screens/RoutinesScreen';
const Tab = createBottomTabNavigator();

const screenOptions = (route, color) => {
    let iconName;
  
    switch (route.name) {
      case 'Home':
        iconName = 'home';
        break;
      case 'StoreScreen':
        iconName = 'shopping';
        break;
      case 'TasksScreen':
        iconName = 'broom';
        break;
    case 'RoutinesScreen':
        iconName = 'bowl';
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
            <Tab.Screen name="StoreScreen" component={StoreScreen} />
            <Tab.Screen name="TasksScreen" component={TasksScreen} />
            <Tab.Screen name="RoutinesScreen" component={RoutinesScreen} />
   
        </Tab.Navigator>
    );
}

export default Tabs;