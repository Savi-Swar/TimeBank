import WelcomeScreen from "./Screens/WelcomeScreen";
import StoreScreen from "./Screens/StoreScreen";
import IdentificationScreen from "./Screens/IdentificationScreen";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TasksScreen from "./Screens/TasksScreen";
import CreateTask from "./Screens/CreateTask";
import CompleteTaskScreen from "./Screens/CompleteTaskScreen";
import RoutinesScreen from "./Screens/RoutinesScreen";
import SplashScreen from "./Screens/SplashScreen";
import SignInScreen from "./Screens/SignInScreen";
import React, { useEffect, useState } from "react";
import SignUpScreen from "./Screens/SignUpScreen";
import RoutineViewScreen from "./Screens/RoutineViewScreen";
import CreateRoutine from "./Screens/CreateRoutine";
import BuyScreen from "./Screens/BuyScreen";
import CreateRoutineSet from "./Screens/CreateRoutineSet";
import LinkAccountScreen from "./Screens/LinkAccountScreen";
import Tabs from "./Navigator/tabs";
import AccountScreen from "./Screens/AccountScreen";
import { retrieveUserId, createCollectionWithUserId } from "./firebase";
import FinishRoutineScreen from "./Screens/FinishRoutineScreen";
import KidsScreen from "./Screens/KidsScreen";
import { getAdditionalUserInfo } from "firebase/auth";
import KidsStats from "./Screens/KidsStats";
const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState("");
  const [isUserLoaded, setIsUserLoaded] = useState(false); // Add this line
    useEffect(() => {
      const unsubscribe = retrieveUserId(user, setUser);
      return () => {
        unsubscribe && unsubscribe();
      };
    }, []);

  useEffect(() => {
    if (user == null) {
      setIsUserLoaded(false);
    } else if (user.uid && user.uid.length > 0) {
      setIsUserLoaded(true);
    }
  }, [user]);

  if (isUserLoaded) {
    createCollectionWithUserId(user.uid);
  }
  useEffect(() => {
    // if (isUserLoaded) {
    //   navigation.navigate('HomeFile');
    // }
    // console.log(user)
  }, [isUserLoaded]);
  //Fix the is loaded issue 

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
         {isUserLoaded ? (
          <>
            <Stack.Screen name="HomeFile" component={Tabs} />
            <Stack.Screen name="LinkAccountScreen" component={LinkAccountScreen} />
 
            <Stack.Screen name="IDS" component={IdentificationScreen} />
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="CompleteTaskScreen" component={CompleteTaskScreen} />
            <Stack.Screen name="CreateTask" component={CreateTask} />
            <Stack.Screen name="KidsScreen" component={KidsScreen} />
            <Stack.Screen name="Stats" component={KidsStats} />
            <Stack.Screen name="RoutinesScreen" component={RoutinesScreen} />
            <Stack.Screen name = "FinishedRoutineScreen" component={FinishRoutineScreen}/>
            <Stack.Screen name = "Home" component = {AccountScreen}/>
            <Stack.Screen name="StoreScreen" component={StoreScreen} />
            <Stack.Screen name="TasksScreen" component={TasksScreen} />
            <Stack.Screen name="RoutineViewScreen" component={RoutineViewScreen} />
            <Stack.Screen name="CreateRoutine" component={CreateRoutine} />
            <Stack.Screen name="CreateRoutineSet" component={CreateRoutineSet} />
            <Stack.Screen name = "BuyScreen" component = {BuyScreen} />
            <Stack.Screen name= "WelcomeScreen" component={WelcomeScreen} />

          </>
          ) : (
            <>

            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} /> 
            <Stack.Screen name="LinkAccountScreen" component={LinkAccountScreen} />
            <Stack.Screen name="HomeFile" component={Tabs} />
            <Stack.Screen name="KidsScreen" component={KidsScreen} />


            <Stack.Screen name="IDS" component={IdentificationScreen} />
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="CompleteTaskScreen" component={CompleteTaskScreen} />
            <Stack.Screen name="CreateTask" component={CreateTask} />
            <Stack.Screen name="Stats" component={KidsStats} />
            <Stack.Screen name="RoutinesScreen" component={RoutinesScreen} />
            <Stack.Screen name = "FinishedRoutineScreen" component={FinishRoutineScreen}/>
            <Stack.Screen name = "Home" component = {AccountScreen}/>
            <Stack.Screen name="StoreScreen" component={StoreScreen} />
            <Stack.Screen name="TasksScreen" component={TasksScreen} />
            <Stack.Screen name="RoutineViewScreen" component={RoutineViewScreen} />
            <Stack.Screen name="CreateRoutine" component={CreateRoutine} />
            <Stack.Screen name="CreateRoutineSet" component={CreateRoutineSet} />
            <Stack.Screen name = "BuyScreen" component = {BuyScreen} />
            </>
          )}


       
        </Stack.Navigator>
    </NavigationContainer>
  );
}

