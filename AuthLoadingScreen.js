import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

function AuthLoadingScreen({ navigation }) {
  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        // Check if user exists in the database
        const userRef = ref(db, `/Users/${user.uid}`);
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            // User exists in the database, meaning they have agreed to the terms
            navigation.replace('ParentHome', { canFetchUserData: true });
          } else {
            // User does not exist in the database
            // This could mean they haven't agreed to terms or their user data hasn't been created yet
            // Navigate them to the appropriate screen based on your app's flow
            navigation.replace('Terms'); // or any other initial setup screen
          }
        });
      } else if (user && !user.emailVerified) {
        // User is signed in but email is not verified
        navigation.replace('Register'); // Replace with your email verification screen
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
