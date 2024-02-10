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
import EditItem from "./Screens_v2/EditItem";
import EditAssignment from "./Screens_v2/EditAssignment";
import EditKid from "./Screens_v2/EditKid";
import { loadSounds, sounds } from './audio'; 
import { playSound, setSound } from './audio'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import EditRoutine from "./Screens_v2/EditRoutine";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";


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
    const initializeSoundSettings = async () => {
      // Check if the settings already exist
      const musicSetting = await AsyncStorage.getItem('music');
      const audioSetting = await AsyncStorage.getItem('audio');
      if (musicSetting === null) {
        // Set default to true if not yet initialized
        await AsyncStorage.setItem('music', 'true');
      }

      if (audioSetting === null) {
        // Set default to true if not yet initialized
        await AsyncStorage.setItem('audio', 'true');
      }
      if (areSoundsLoaded) {
        setSound(audioSetting !== 'false')
        if (musicSetting !== 'false') {
          sounds['happyMusic'].playAsync(); // Play music if enabled
        }
        // Return a cleanup function to stop the music when the component unmounts
        return () => {
          playSound('happyMusic', false); // Stop the music
        };
      }
    };

    initializeSoundSettings();
  }, [areSoundsLoaded]);


  if (!isFontLoaded || !areSoundsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
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
            <Stack.Screen name = "EditItem" component = {EditItem}/>
            <Stack.Screen name = "EditAssignment" component = {EditAssignment}/>
            <Stack.Screen name = "EditRoutine" component = {EditRoutine}/>
            <Stack.Screen name = "EditKidScreen" component = {EditKid}/>
          
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    );
  }

