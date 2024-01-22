// AuthLoadingScreen.js
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function AuthLoadingScreen({ navigation }) {
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        // User is signed in and email is verified
        // change back to ParentHome
        navigation.replace('ParentHome', {canFetchUserData: true});
      } else if (user && !user.emailVerified) {
        // User is signed in but email is not verified
        navigation.replace('VerifyEmail'); // Replace with your verification screen
      } else {
        // No user is signed in
        navigation.replace('OnBoarding1');
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, [navigation]);

  // While waiting for the check to complete, show an ActivityIndicator
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default AuthLoadingScreen;
