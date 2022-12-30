import WelcomeScreen from "./Screens/WelcomeScreen";
import StoreScreen from "./Screens/StoreScreen";
import IdentificationScreen from "./Screens/IdentificationScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TasksScreen from "./Screens/TasksScreen";
import CreateTask from "./Screens/CreateTask";
import CompleteTaskScreen from "./Screens/CompleteTaskScreen";
import RoutinesScreen from "./Screens/RoutinesScreen";
import SplashScreen from "./Screens/SplashScreen";
import SignInScreen from "./Screens/SignInScreen";
import React, {  useState } from "react";
import SignUpScreen from "./Screens/SignUpScreen";
import RoutineViewScreen from "./Screens/RoutineViewScreen";
import CreateRoutine from "./Screens/CreateRoutine";
import BuyScreen from "./components/BuyScreen";
import CreateRoutineSet from "./Screens/CreateRoutineSet";
import LinkAccountScreen from "./Screens/LinkAccountScreen";
import Tabs from "./Navigator/tabs";
import AccountScreen from "./Screens/AccountScreen";
import { retrieveUser } from "./firebase";
import FinishRoutineScreen from "./Screens/FinishRoutineScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState("");
  retrieveUser(user,setUser);

  let x = Tabs;

  if (user.length < 1) {
    x = WelcomeScreen;
  }

  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName = {x} screenOptions={{
        headerShown: false
      }}>

        <Stack.Screen name = {"HomeFile"} component={x} />


        <Stack.Screen name="LinkAccountScreen" component={LinkAccountScreen} />
 
        <Stack.Screen name="IDS" component={IdentificationScreen} />
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="CompleteTaskScreen" component={CompleteTaskScreen} />
        <Stack.Screen name="CreateTask" component={CreateTask} />
        <Stack.Screen name="RoutinesScreen" component={RoutinesScreen} />
        <Stack.Screen name = "FinishedRoutineScreen" component={FinishRoutineScreen}/>
        <Stack.Screen name = "Home" component = {AccountScreen}/>
            <Stack.Screen name="StoreScreen" component={StoreScreen} />
            <Stack.Screen name="TasksScreen" component={TasksScreen} />
        <Stack.Screen name="RoutineViewScreen" component={RoutineViewScreen} />
        <Stack.Screen name="CreateRoutine" component={CreateRoutine} />
        <Stack.Screen name="CreateRoutineSet" component={CreateRoutineSet} />
        <Stack.Screen name = "BuyScreen" component = {BuyScreen} />
        <Stack.Screen name={"WelcomeScreen"} component={WelcomeScreen} />

      </Stack.Navigator>
    </NavigationContainer>


  );
}

