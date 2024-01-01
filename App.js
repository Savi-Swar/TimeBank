import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import OnBoarding1 from "./Screens_v2/OnBoarding1";
import OnBoarding2 from "./Screens_v2/OnBoarding2";
import OnBoarding3 from "./Screens_v2/OnBoarding3";
import OnBoarding4 from "./Screens_v2/OnBoarding4";
import LoginScreen from "./Screens_v2/LoginScreen";
import * as Font from 'expo-font';
import ForgotPassword from "./Screens_v2/ForgotPassword";
import RegisterScreen from "./Screens_v2/RegisterScreen";
import StoreDetails from "./Screens_v2/StoreDetails";
import TaskDetails from "./Screens_v2/TaskDetails";
import RoutineView from "./Screens_v2/RoutineView";
import Activities from "./Screens_v2/Activities";
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
import CreateRoutineStep from "./Screens_v2/CreateRoutineStep";
import FinishRoutine from "./Screens_v2/FinishRoutine";
import RoutineStats from "./Screens_v2/RoutineStats";
import { loadSounds } from './audio'; 
import { playSound } from './audio'; 
const Stack = createNativeStackNavigator();

export default function App() {
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [areSoundsLoaded, setAreSoundsLoaded] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      await Font.loadAsync({
        'BubbleBobble': require('./assets/fonts/BubbleBobble.ttf'),
        // ... other fonts ...
      });
      await loadSounds();
      setIsFontLoaded(true);
      setAreSoundsLoaded(true);
    }

    loadAssets();
  }, []);

  useEffect(() => {
    if (areSoundsLoaded) {
      playSound('happyMusic');
      // Return a cleanup function to stop the music when the component unmounts
      return () => {
        playSound('happyMusic', false); // Stop the music
      };
    }
  }, [areSoundsLoaded]); // Depend on areSoundsLoaded

  if (!isFontLoaded || !areSoundsLoaded) {
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
          <Stack.Screen name = "RoutineStats" component = {RoutineStats}/>
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
        <Stack.Screen name="RoutineSteps" component={RoutineView} />
        <Stack.Screen name="FinishRoutine" component={FinishRoutine} />

        <Stack.Screen name="CreateRout" component={CreateRoutine2} />
        <Stack.Screen name="CreateRoutineStep" component={CreateRoutineStep} />

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

