import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {  get, update} from "firebase/database";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
export async function sendPushNotification(expoPushToken, title, msg) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: msg,
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export async function registerForPushNotificationsAsync(userRef) {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  const initialData = {
    token: token,
  };
  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      update(userRef, initialData).catch((error) => {
        console.error("Error creating user: ", error);
      });
    } 
  }).catch((error) => {
    console.error("Error fetching user: ", error);
  });
  return token;
}



export default {
    registerForPushNotificationsAsync,
    sendPushNotification,
}