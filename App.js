import { NavigationContainer, CommonActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AppRegistry } from 'react-native';
import { registerRootComponent } from 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from "./Screens/WelcomeScreen";
import StoreScreen from "./Screens/StoreScreen";
import TasksScreen from "./Screens/TasksScreen";
import CreateTask from "./Screens/CreateTask";
import CompleteTaskScreen from "./Screens/CompleteTaskScreen";
import RoutinesScreen from "./Screens/RoutinesScreen";
// import SplashScreen from "./Screens/SplashScreen";
import SignInScreen from "./Screens/SignInScreen";
import SignUpScreen from "./Screens/SignUpScreen";
import RoutineViewScreen from "./Screens/RoutineViewScreen";
import CreateRoutine from "./Screens/CreateRoutine";
import BuyScreen from "./Screens/BuyScreen";
import CreateRoutineSet from "./Screens/CreateRoutineSet";
import LinkAccountScreen from "./Screens/LinkAccountScreen";
import Tabs from "./Navigator/tabs";
import AccountScreen from "./Screens/AccountScreen";
import FinishRoutineScreen from "./Screens/FinishRoutineScreen";
import KidsScreen from "./Screens/KidsScreen";
import KidsStats from "./Screens/KidsStats";
import ActivityScreen from "./Screens/ActivityScreen";
import { LogBox } from 'react-native';
import AssignmentScreen from "./Screens/AssignmentScreen";
// import CreateAssignment from "./Screens/CreateAssignment";
import KidAssignScreen from "./Screens/KidAssignScreen";
import OnBoarding1 from "./Screens_v2/OnBoarding1";
import OnBoarding2 from "./Screens_v2/OnBoarding2";
import CompleteAssignment from "./Screens/CompleteAssignment";
import ResetPassword from "./Screens/ResetPassword";
import EnterScreen from "./Screens/EnterScreen";
import EditTask from "./Screens/EditTask";
import TermsAndConditionsScreen from "./Screens/Terms";
import OnBoarding3 from "./Screens_v2/OnBoarding3";
import OnBoarding4 from "./Screens_v2/OnBoarding4";
import LoginScreen from "./Screens_v2/LoginScreen";
import * as Font from 'expo-font';
import ForgotPassword from "./Screens_v2/ForgotPassword";
import RegisterScreen from "./Screens_v2/RegisterScreen";
import StoreDetails from "./Screens_v2/StoreDetails";
import ss2 from "./Screens_v2/StoreScreen"
import TaskDetails from "./Screens_v2/TaskDetails";
import RoutineView from "./Screens_v2/RoutineView";
import Activities from "./Screens_v2/Activities";
import TabsNav from "./Navigator/tabsNav";
import ParentStore from "./Screens_v2/ParentStore";
import ParentTask from "./Screens_v2/ParentTask";
import ParentRoutine from "./Screens_v2/ParentRoutine";
import CreateRoutine2 from "./Screens_v2/CreateRoutine";
import CreateItem from "./Screens_v2/CreateItem";
import ParentHome from "./Screens_v2/ParentHome";
import ParentMenu from "./Screens_v2/ParentMenu";
import PrivacyPolicy from "./Screens_v2/PrivacyPolicy";
import Terms from './Screens_v2/Terms'
import AuthLoadingScreen from './AuthLoadingScreen';
import ParentAssignment from "./Screens_v2/ParentAssignment";
import CreateAssignment from "./Screens_v2/CreateAssignment";
import kidsNav from "./Navigator/kidsNav";
import {View} from "react-native";
import StatsScreen from "./Screens_v2/StatsScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'BubbleBobble': require('./assets/fonts/BubbleBobble.ttf'), // Update the path to your font file
        // Include any other fonts you want to load
      });
      setIsFontLoaded(true);
    }

    loadFonts();
  }, []);

  if (!isFontLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} >
          {/* {!isSignedIn ? ( */}
          {/* <> */}
          <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />

         <Stack.Screen name="OnBoarding1" component={OnBoarding1} />

          <Stack.Screen name="OnBoarding2" component={OnBoarding2} />
          <Stack.Screen name="OnBoarding3" component={OnBoarding3} />
          <Stack.Screen name="OnBoarding4" component={OnBoarding4} />
          <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ParentMenu" component={ParentMenu} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Register" component={RegisterScreen} />
         <Stack.Screen name="ParentRoutine" component={ParentRoutine} />
         <Stack.Screen name="Terms" component={Terms} />
         <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />

        <Stack.Screen name="StoreDetails" component={StoreDetails} />
        <Stack.Screen name="Create" component={CreateItem} />
        <Stack.Screen name="StatsScreen" component={StatsScreen} />

        <Stack.Screen name="CreateRout" component={CreateRoutine2} />
        <Stack.Screen name="ParentHome" component={ParentHome} />
        <Stack.Screen name="ParentStore" component={ParentStore} />
        <Stack.Screen name="ParentTask" component={ParentTask} />
        <Stack.Screen name="ParentAssignment" component={ParentAssignment} />
        <Stack.Screen name="CreateAssignment" component={CreateAssignment} />
        <Stack.Screen name="KidsNav" component={kidsNav} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} />
        <Stack.Screen name="Activities" component={Activities} />

        {/* </>
       ) : emailVerified ? (

        <>
          <Stack.Screen name="ParentMenu" component={ParentMenu} />
          <Stack.Screen name="OnBoarding1" component={OnBoarding1} />
          <Stack.Screen name="OnBoarding2" component={OnBoarding2} />
          <Stack.Screen name="OnBoarding3" component={OnBoarding3} />
          <Stack.Screen name="OnBoarding4" component={OnBoarding4} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ParentRoutine" component={ParentRoutine} />
          <Stack.Screen name="Terms" component={Terms} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />

          <Stack.Screen name="StoreDetails" component={StoreDetails} />
          <Stack.Screen name="Create" component={CreateItem} />

          <Stack.Screen name="CreateRout" component={CreateRoutine2} />
          <Stack.Screen name="ParentHome" component={ParentHome} />
          {/* ... other main app screens ... */}
        {/* </>

        ) : (
          // If signed in but email is NOT verified, redirect to a verification screen
          <>
            <Stack.Screen name="Register" component={RegisterScreen} />

            <Stack.Screen name="ParentMenu" component={ParentMenu} />
            <Stack.Screen name="OnBoarding1" component={OnBoarding1} />
            <Stack.Screen name="OnBoarding2" component={OnBoarding2} />
            <Stack.Screen name="OnBoarding3" component={OnBoarding3} />
            <Stack.Screen name="OnBoarding4" component={OnBoarding4} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ParentRoutine" component={ParentRoutine} />
            <Stack.Screen name="Terms" component={Terms} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />

            <Stack.Screen name="StoreDetails" component={StoreDetails} />
            <Stack.Screen name="Create" component={CreateItem} />

            <Stack.Screen name="CreateRout" component={CreateRoutine2} />
            <Stack.Screen name="ParentHome" component={ParentHome} />
          </>
        )} */} 
          {/* <Stack.Screen name="TabsNav" component={TabsNav} />

          <Stack.Screen name="OnBoarding1" component={OnBoarding1} />
          <Stack.Screen name="Create" component={CreateItem} />
        <Stack.Screen name="Activities" component={Activities} />
          <Stack.Screen name="CreateRout" component={CreateRoutine} />

          <Stack.Screen name="OnBoarding2" component={OnBoarding2} />
          <Stack.Screen name="OnBoarding3" component={OnBoarding3} />
          <Stack.Screen name="OnBoarding4" component={OnBoarding4} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="TaskDetails" component={TaskDetails} />
          <Stack.Screen name="RoutineView" component={RoutineView} />
          <Stack.Screen name="ParentStore" component={ParentStore} />
          <Stack.Screen name="ParentTask" component={ParentTask} />
          <Stack.Screen name="ParentRoutine" component={ParentRoutine} />

          <Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="AssignmentScreen" component={AssignmentScreen} />
          <Stack.Screen name="SignInScreen" component={SignInScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="LinkAccountScreen" component={LinkAccountScreen} />
          <Stack.Screen name="EnterScreen" component={EnterScreen} />
          <Stack.Screen name="EditScreen" component={EditTask} />
          <Stack.Screen name="StoreDetails" component={StoreDetails} />

          <Stack.Screen name="CreateAssignment" component={CreateAssignment} />
          <Stack.Screen name="KidsScreen" component={KidsScreen} />
          <Stack.Screen name="HomeFile" component={Tabs} />
          <Stack.Screen name="ActivityScreen" component={ActivityScreen}/>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="CompleteTaskScreen" component={CompleteTaskScreen} />
          <Stack.Screen name="RoutineViewScreen" component={RoutineViewScreen} />

          <Stack.Screen name="CreateTask" component={CreateTask} />
          <Stack.Screen name="Stats" component={KidsStats} />
          <Stack.Screen name="Routines" component={RoutinesScreen} />
          <Stack.Screen name="FinishedRoutineScreen" component={FinishRoutineScreen}/>
          <Stack.Screen name="TermsAndConditionsScreen" component={TermsAndConditionsScreen}/>

          <Stack.Screen name="Home" component={AccountScreen}/>
          <Stack.Screen name="Store" component={StoreScreen} />
          <Stack.Screen name="Tasks" component={TasksScreen} />
          <Stack.Screen name="Assignments" component={KidAssignScreen} />
          <Stack.Screen name="CompleteAssignment" component={CompleteAssignment} />

          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="CreateRoutine" component={CreateRoutine} />
          <Stack.Screen name="CreateRoutineSet" component={CreateRoutineSet} />
          <Stack.Screen name="BuyScreen" component={BuyScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

