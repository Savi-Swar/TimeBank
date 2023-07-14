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
import RoutineStats from "./Screens/RoutineStats";
import ActivityScreen from "./Screens/ActivityScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AppRegistry } from 'react-native';
import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';
const Stack = createNativeStackNavigator();

export default function App() {

  AppRegistry.registerComponent('App', () => App);

  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      const auth = getAuth();
      // console.log(auth)
      onAuthStateChanged(auth, (firebaseUser) => {
        // console.log("firebaseUser=>", firebaseUser);
        setUser(firebaseUser);

        if (firebaseUser) {
          // Firebase User is signed in
          getUserType();
        } else {
          // Firebase User is signed out
          setUserType(null);
          setIsLoading(false);
        }
      });
    };
    bootstrapAsync();
  }, []);

  const getUserType = async () => {
    try {
      const storedUserType = await AsyncStorage.getItem('@user_type');
      setUserType(storedUserType);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      // Render some sort of loading component
      <ActivityIndicator />
    );
  } else {
    return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
         {user !== null && userType !== null ? (
          <>
            <Stack.Screen name="HomeFile" component={Tabs} />

            <Stack.Screen name="KidsScreen" component={KidsScreen} />

            <Stack.Screen name="LinkAccountScreen" component={LinkAccountScreen} />
 
            <Stack.Screen name="IDS" component={IdentificationScreen} />
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="CompleteTaskScreen" component={CompleteTaskScreen} />
            <Stack.Screen name="CreateTask" component={CreateTask} />
            <Stack.Screen name="Stats" component={KidsStats} />
            <Stack.Screen name="RoutineStats" component={RoutineStats} />

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
            <Stack.Screen name = "ActivityScreen" component={ActivityScreen}/>

          </>
          ) : (
            <>

            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} /> 
            <Stack.Screen name="LinkAccountScreen" component={LinkAccountScreen} />
            <Stack.Screen name="RoutineStats" component={RoutineStats} />
            <Stack.Screen name="KidsScreen" component={KidsScreen} />
            <Stack.Screen name="HomeFile" component={Tabs} />

            <Stack.Screen name = "ActivityScreen" component={ActivityScreen}/>

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
}

