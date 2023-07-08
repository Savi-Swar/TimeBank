import {
  collection,
  getDocs,
  setDoc,
  doc,
  orderBy,
  query,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";
import { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaUGJXtf1E8zDzxi3d98S4oW-IR7HgR_Q",
  authDomain: "timebank-2bf8a.firebaseapp.com",
  projectId: "timebank-2bf8a",
  storageBucket: "timebank-2bf8a.appspot.com",
  messagingSenderId: "1057985279971",
  appId: "1:1057985279971:web:064ac7201d33f936c452d6",
  measurementId: "G-1XMB0MDWKC",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
const storage = firebase.storage();
const db = firebase.database();
const auth = firebase.auth();
const firestores = firebase.firestore();
const colRef = firestores.collection("tasks");
const storeRef = firestores.collection("store");
const routineRefs = firestores.collection("routines");
const kidsRef = firestores.collection("kids");
const activeRef = firestores.collection("Active");

// ... (rest of your code)

export const retrieveUserId = (user, setUser) => {
  const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    // delay of 500 milliseconds
  });

  return unsubscribe;
};


export function Tasks(tasks, setTasks) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const userId = firebase.auth().currentUser.uid;
  const colRef = firebase.firestore().collection(userId).doc('storage').collection('tasks');

  useEffect(() => {
    const item = getDocs(colRef).then(snapshot => {
      tasks = [];
      snapshot.docs.forEach(doc => {
        tasks.push({ ...doc.data(), id: doc.id });
      });

      setTasks(tasks);
      setLoading(false);
    });

    // Unsubscribe from events when no longer in use
  });

  if (loading) {
    return <ActivityIndicator />;
  }

  // ...
}

export async function updateRequest(kidName, reqMinutes, taskName) {
  // Current userId
  const userId = firebase.auth().currentUser.uid;

  // Point to the correct document
  const docRef = doc(firestores,  userId, "storage", "kids", kidName);

  // Get the current state of the 'requests' field
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
      // If the document exists, get the current 'names', 'reqMinutes', and 'signs' arrays
      let currentNames = Array.isArray(docSnap.data().names) ? docSnap.data().names : [];
      let currentReqMinutes = Array.isArray(docSnap.data().reqMinutes) ? docSnap.data().reqMinutes : [];

      // Prepend the new values to each array
      let updatedNames = [taskName, ...currentNames];
      let updatedReqMinutes = [reqMinutes, ...currentReqMinutes];

      // Update the fields in the document
      await updateDoc(docRef, { names: updatedNames, reqMinutes: updatedReqMinutes});

  } else {
      // If the document does not exist, set each field to an array containing the new value
      await updateDoc(docRef, { names: [taskName], reqMinutes: [reqMinutes]});
  }
}
export async function getRequests(setNames, setMins, kidName) {
  // Current userId
  const userId = firebase.auth().currentUser.uid;

  // Point to the correct document
  const docRef = doc(firestores, userId, "storage", "kids", kidName);

  // Get the document
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // If the document exists, get the current 'names' and 'reqMinutes' arrays
    let currentNames = Array.isArray(docSnap.data().names) ? docSnap.data().names : [];
    let currentReqMinutes = Array.isArray(docSnap.data().reqMinutes) ? docSnap.data().reqMinutes : [];

    // Update the state variables with these values
    setNames(currentNames);
    setMins(currentReqMinutes);
  } else {
    // If the document does not exist, clear the state variables
    setNames([]);
    setMins([]);
  }
}

export async function createCollectionWithUserId(userId) {
  // Get a reference to the Firestore service

  // Use the set method with a dummy document to create the collection
   // Get the document reference
   const docRef = firestores.collection('Users').doc(userId);

   // Get the document
   const doc = await docRef.get();
 
   // Check if the document exists
   if (!doc.exists) {
     // If the document does not exist, create it
     await docRef.set({});
 
     // And create a new collection with the userId
     await firestores.collection(userId).doc("storage").set({});
     
     const userCollection = firestores.collection(userId);

     const storageDoc = userCollection.doc('storage');

     // Within that document, create (or update) 5 sub-collections each with a single document
     storageDoc.collection('Active').doc('i6e8NvXh9xgoseQ5zZBh').set({});
     storageDoc.collection('kids').doc('def').set({});
     storageDoc.collection('routines')
   }
}

export function Store(store, setStore) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const userId = firebase.auth().currentUser.uid;

  const storeRef = firebase.firestore().collection(userId).doc('storage').collection('store');
  useEffect(() => {
    const item = getDocs(storeRef).then(snapshot => {
      store = [];
      snapshot.docs.forEach(doc => {
        store.push({ ...doc.data(), id: doc.id });
      });

      setStore(store);
      setLoading(false);
    });

    // Unsubscribe from events when no longer in use
  });

  if (loading) {
    return <ActivityIndicator />;
  }

  // ...
}
export function updateActiveUser(name) {
  const data = {
    Name: name,
  };
  const userId = firebase.auth().currentUser.uid;

  const docRef = doc(firestores, userId, "storage", "Active", "i6e8NvXh9xgoseQ5zZBh");

  updateDoc(docRef, data)
    .then(console.log("Entire Document has been updated successfully"))
    .catch(error => {
      console.log(error);
    });
}

export function retrieveDays(setDays,  id, setMonths) {
  const userId = firebase.auth().currentUser.uid;

  const daysRef = doc(firestores, userId, "storage", "routines", id);

   function cap() {
    try {
      const docSnap =  getDoc(daysRef);
      if (docSnap.length > 0) {
        let x = docSnap.data().days;
        let y = docSnap.data().months;

        setDays(x);
        setMonths(y);
      }
    } catch (error) {
      console.log(error);
    }
  }
  cap();
}
export function retrieveMonths(setDays, id) {
  const userId = firebase.auth().currentUser.uid;

  const monthsRef = doc(firestores, userId, "storage", "routines", id);

  async function cap() {
    try {
      const docSnap = await getDoc(monthsRef);
      if (docSnap.exists()) {
        let x = docSnap.data().months;
        setDays(x);
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  }
  cap();
}
export function retrieveUser(store, setStore) {
  const userId = firebase.auth().currentUser.uid;

  const activeRef = firebase.firestore().collection(userId).doc('storage').collection('Active');
  useEffect(() => {
    const item = getDocs(activeRef).then(snapshot => {
      let stored = [];
      snapshot.docs.forEach(doc => {
        stored.push({ ...doc.data(), id: doc.id });
      });
      setStore(stored[0].Name);
    });
    // Unsubscribe from events when no longer in use
  });
}
export function Mins(minutes, setMinutes, name) {
  // const minRef = doc(firestores, "kids", name);
  const userId = firebase.auth().currentUser.uid;
  const minRef = doc(firestores, userId, "storage", "kids", name);
  async function cap() {
    try {
      const docSnap = await getDoc(minRef);
      if (docSnap.exists()) {
        let x = docSnap.data().minutes;
        setMinutes(x);
      } else {
        // console.log("Document does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  } 
  cap();

  
}

// onValue(minRef, (snapshot) => {
//   const mins = snapshot.val();
//   console.log(mins);
// });
export function Kids(kids, setKids) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const userId = firebase.auth().currentUser.uid;

  const kidsRef = firebase.firestore().collection(userId).doc('storage').collection('kids');
  useEffect(() => {
    const item = getDocs(kidsRef).then(snapshot => {
      kids = [];
      snapshot.docs.forEach(doc => {
        kids.push({ ...doc.data(), id: doc.id });
      });

      setKids(kids);
      setLoading(false);
    });

    // Unsubscribe from events when no longer in use
  });

  if (loading) {
    return <ActivityIndicator />;
  }

  // ...
}

export async function addKids(kid) {
  console.log(kid)
  const data = {
    name: kid,
    minutes: 0,
    MinutesAccumulated: 0,
    WeeklyMinutesEarned: 0,
    MinutesSpent: 0,
    WeeklyArray: [], 
  };

  const userId = firebase.auth().currentUser.uid;
  
  const kidDocRef = doc(firestores, userId, "storage","kids", kid);
  
  async function setKidDoc() {
    await setDoc(kidDocRef, data);
  }

  const kidDocSnap = await getDoc(kidDocRef);

  if (kidDocSnap.exists()) {
    console.log("Document data:", kidDocSnap.data());
  } else {
    // If the kid document does not exist, create it with an empty WeeklyArray field
    setKidDoc();
  }

  const routineRefs = firebase.firestore().collection(userId).doc('storage').collection('routines');
  const snapshot = await getDocs(routineRefs);
  const routines = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

  routines.forEach(routine => {
    const routineData = {
      timesCompleted: 0,
      averageTime: 0,
      streak: 0,
      lastCompleted: "",
      times: [],
    };

    const routineDocRef = doc(firestores, userId, "storage", "kids", kid, routine.name, "stats");
    setDoc(routineDocRef, routineData);
  });
}


export function addMins(minutes, total, name) {
  const userId = firebase.auth().currentUser.uid;
  const minsRef = doc(firestores, userId, "storage","kids", name);
  let accum = 0;
  let spen = 0;
  let week = 0;

  function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return weekNo;
  }

  const currentWeekNumber = getWeekNumber(new Date());
  console.log(currentWeekNumber)


  async function noCap() {
    const docSnap = await getDoc(minsRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      minutes = docSnap.data().minutes;
      accum = docSnap.data().MinutesAccumalated;
      spen = docSnap.data().MinutesSpent;
      week = docSnap.data().WeeklyMinutesEarned;
      let weeklyArray = docSnap.data().WeeklyArray || []; // Get the existing weekly array or create a new one if it doesn't exist yet
      
      // Calculate the new weekly total
      let newWeekTotal = (parseInt(weeklyArray[weeklyArray.length - 1]) || 0) + parseInt(total);
      
      // If we're in a new week, shift the weekly array to remove the oldest week and add the new week's total
      if (currentWeekNumber > (docSnap.data().LastWeekNumber || 0)) {
        if (weeklyArray.length == 10) {
           weeklyArray.shift(); // Remove the oldest week
        }
        weeklyArray.push(newWeekTotal); // Add the new week's total
      } else {
        // If we're still in the same week, just update the last entry in the array
        weeklyArray[weeklyArray.length - 1] = newWeekTotal;
      }
      minutes = parseInt(minutes) + parseInt(total);
    accum = parseInt(accum) + parseInt(total);
    spen = parseInt(spen) - parseInt(total);
    week = parseInt(week) + parseInt(total);
    
    if (parseInt(total) > 0) {
      await updateDoc(minsRef, {
        minutes: minutes,
        MinutesAccumalated: accum,
        WeeklyMinutesEarned: week,
        WeeklyArray: weeklyArray, // Here is the updated weekly array
      });     
    } else {
      await updateDoc(minsRef, {
        minutes: minutes,
        MinutesSpent: spen
      });  
    }
    } else {
      console.log("No such document!");
    }

    
  } 
      
  noCap();
}
export function getWeekly(name) {
  const [loading, setLoading] = useState(true);
  const [dataset, setDataset] = useState([]);

  const userId = firebase.auth().currentUser.uid;
  const weeklyPath = `${userId}/storage/kids/${name}`;

  useEffect(() => {
    console.log('Running getWeekly useEffect');
    const weeklyRef = doc(firestores, userId, "storage", "kids", name);
    async function snap() {
      const docSnap = await getDoc(weeklyRef);

      if (docSnap.exists()) {
        setDataset(docSnap.data().WeeklyArray)
        setLoading(false);
      }
    }

    snap();
  }, [weeklyPath]);

  return { dataset, loading };
}


export async function getRoutineStats(kidName, routineName) {
  const userId = firebase.auth().currentUser.uid;
  const db = firebase.firestore();

  try {
      const doc = await db
          .collection(userId)
          .doc('storage')
          .collection('kids')
          .doc(kidName)
          .collection(routineName)
          .doc('Stats')
          .get();
          
      if (doc.exists) {
          console.log("Document data:", doc.data());
      } else {
          console.log("No such document!");
      }
      
      return doc.data();
  } catch (error) {
      console.log("Error getting documents: ", error);
  }
}

export function useRoutines() {
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState([]);
  const userId = firebase.auth().currentUser.uid;

  const routinePath = `${userId}/storage/routines`;

  useEffect(() => {
    console.log('Running useRoutines useEffect');
    const routineRefs = firebase.firestore().collection(userId).doc('storage').collection('routines');
    getDocs(routineRefs).then(snapshot => {
      const routines = [];
      snapshot.docs.forEach(doc => {
        routines.push({ ...doc.data(), id: doc.id });
      });

      setStore(routines);
      setLoading(false);
    });
  }, [routinePath]);

  return { store, loading };
}
export function finishRoutine(minutesEarly, childName, routineName, et) {
  const userId = firebase.auth().currentUser.uid;
  const routineRef = doc(firestores, userId, "storage", "kids", childName, routineName, "Stats");
  
  // Convert et from "HH:MM" to minutes
  const etInMinutes = toMinutes(et);
  const finishTime = toHHMM(etInMinutes - minutesEarly);
  
  async function updateRoutine() {
    const docSnap = await getDoc(routineRef);

    let timesCompleted = 0;
    let averageTime = 0;
    let streak = 0;
    let lastCompleted = new Date().toLocaleDateString();
    let times = [];

    if (docSnap.exists()) {
      timesCompleted = docSnap.data().timesCompleted;
      averageTime = docSnap.data().averageTime;
      streak = docSnap.data().streak;
      times = docSnap.data().times || [];
    }

    timesCompleted += 1;
    averageTime = ((averageTime * (timesCompleted - 1) + minutesEarly)) / timesCompleted;
    streak += 1; 

    // Handle the last ten times
    if (times.length >= 10) {
      times.shift();
    }
    times.push(finishTime);

    await updateDoc(routineRef, {
      timesCompleted: timesCompleted,
      averageTime: averageTime,
      streak: streak,
      lastCompleted: lastCompleted,
      times: times
    });
  }

  updateRoutine();
}

function toMinutes(timeStr) {
  console.log(timeStr)
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function toHHMM(timeInMinutes) {
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}


// Helper function to check if two dates are on the same day
function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
    && d1.getDate() === d2.getDate();
}


export function Routines(store, setStore) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const userId = firebase.auth().currentUser.uid;
  const routineRefs = firebase.firestore().collection(userId).doc('storage').collection('routines');
  useEffect(() => {
    const item = getDocs(routineRefs).then(snapshot => {
      store = [];
      snapshot.docs.forEach(doc => {
        store.push({ ...doc.data(), id: doc.id });
      });

      setStore(store);
      setLoading(false);
    });

    // Unsubscribe from events when no longer in use
  });

  if (loading) {
    return <ActivityIndicator />;
  }

  // ...
}

export function getRoutineLength(collections, id) {
  const [isLoading, setIsLoading] = useState(false);
  const [x, setX] = useState(0) 
  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;

    const routineRef = collection(firestores, userId, 'storage', 'routines', id, collections);
    const order = query(routineRef);

    getDocs(order).then(snapshot => {
      const routines = [];
      snapshot.docs.forEach(doc => {
        routines.push({ ...doc.data(), id: doc.id });
      });

      // Call the callback function with the length of the routines array
      setX(routines.length);
     

      // Set loading state to false
      setIsLoading(false);
    });
  });

  return x;
}
export function rearrangeRoutine(collections, title, colID, id, im, up) {
  let x = up ? im - 1 : im + 1;
  const userId = firebase.auth().currentUser.uid;

  const routineDocRef = doc(firestores, userId, "storage","routines", colID, collections, id);
  const data = {
    indx: x,
    title: title,
  };
  const routineRef = collection(firestores, userId, 'storage', 'routines', colID, collections);
  const order = query(routineRef, orderBy("indx"));

  getDocs(order).then(snapshot => {
    const routines = [];
    snapshot.docs.forEach(doc => {
      routines.push({ ...doc.data(), id: doc.id });
    });
    const swap = routines[x-1];
    // console.log(swap);

    const data2 = {
      indx: up ? swap.indx + 1 : swap.indx - 1,
      title: swap.title,
    };

    setDoc(routineDocRef, data).catch(error => {
      console.log(error);
    });
    const routineDocRef2 = doc(firestores, userId, "storage", "routines", colID, collections, swap.id);
    setDoc(routineDocRef2, data2).catch(error => {
      console.log(error);
    });
  });
}

export async function RoutinesCollections(routines, setRoutines, collections, id) {
  const userId = firebase.auth().currentUser.uid;
  const routineRef = collection(firestores, userId, "storage", "routines", id, collections);
  const order = query(routineRef, orderBy("indx"));
  
  const snapshot = await getDocs(order);
  routines = [];
  snapshot.docs.forEach(doc => {
    routines.push({ ...doc.data(), id: doc.id });
  });
  setRoutines(routines);
}

export function updateTimes(textVal, title, graphic, id, collections) {
  x = textVal
  const userId = firebase.auth().currentUser.uid;

  const routineDocRef = doc(
    firestores,
    userId,
    "storage",
    "routines",
    "H2cyoQTxzZESf0YOFbqb",
    collections,
    id
  );
  const data = {
    time: x,
    title: title,
  };
  setDoc(routineDocRef, data).catch(error => {
    console.log(error);
  });
}
export function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function kidsRoutine(routineName) {
  const userId = firebase.auth().currentUser.uid;
  const kidsRef = firebase.firestore().collection(userId + "/storage/kids");
  let kidsArray = []

  // Fetch all kids
  await kidsRef.get().then((snapshot) => {
    snapshot.forEach((doc) => {
      kidsArray.push({ id: doc.id, data: doc.data() }); // assuming each document has a 'name' field
    });
  }).catch((error) => {
    console.error("Error fetching kids: ", error);
  });

  // Loop through kidsArray
  for (let kid of kidsArray) {
    // Check kid name and skip if it's 'def'
    if (kid.data.name !== 'def') {

      // Add the routine as a collection within the kid's doc
      const kidRoutineRef = firebase.firestore().collection(`${userId}/storage/kids/${kid.id}/${routineName}`);

      // Create a single document named 'Stats'
      await kidRoutineRef.doc('Stats').set({
        times: [],
        streak: 0,
        lastCompleted: "",
        averageTime: 0,
        timesCompleted: 0

      });
    }
  }
}

export async function deleteKidsRoutine(routineName) {
  const userId = firebase.auth().currentUser.uid;
  const kidsRef = firebase.firestore().collection(userId + "/storage/kids");
  let kidsArray = [];

  // Fetch all kids
  await kidsRef.get().then((snapshot) => {
    snapshot.forEach((doc) => {
      kidsArray.push({ id: doc.id, data: doc.data() }); // assuming each document has a 'name' field
    });
  }).catch((error) => {
    console.error("Error fetching kids: ", error);
  });

  // Loop through kidsArray
  for (let kid of kidsArray) {
    if (kid.data.name !== 'def') {
      // Get reference to the 'Stats' document within the routine collection
      const statsDocRef = firebase.firestore().doc(`${userId}/storage/kids/${kid.id}/${routineName}/Stats`);

      // Delete the 'Stats' document
      statsDocRef.delete().then(() => {
        console.log(`Deleted 'Stats' document from ${kid.data.name}'s ${routineName} routine.`);
      }).catch((error) => {
        console.error(`Error deleting 'Stats' document: `, error);
      });
    }
  }
}
export async function removeRequest(kidName, index) {
  // Current userId
  const userId = firebase.auth().currentUser.uid;

  // Point to the correct document
  const docRef = doc(firestores, userId, "storage", "kids", kidName);
  // Get the current state of the 'names' and 'minutes' arrays
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
      // If the document exists, get the current 'names' and 'minutes' arrays
      let currentNames = docSnap.data().names || [];
      let currentMinutes = docSnap.data().reqMinutes || [];

      // Check if index is valid
      if (index < currentNames.length && index < currentMinutes.length && index >= 0) {
          // Remove the item at the specified index from both arrays
          currentNames.splice(index, 1);
          currentMinutes.splice(index, 1);

          // Update the fields in the document
          await updateDoc(docRef, { names: currentNames, reqMinutes: currentMinutes });
      }
  }
}
export { firebase, db, colRef, auth, firestores, storage };
export default {
  Tasks,
  Mins,
  addMins,
  makeid,
  Store,
  Routines,
  RoutinesCollections,
  addKids,
  updateActiveUser,
  updateTimes,
  retrieveDays,
  retrieveMonths,
  retrieveUser,
  getRoutineLength,
  rearrangeRoutine,
  createCollectionWithUserId,
  finishRoutine,
  kidsRoutine, 
  deleteKidsRoutine,
  getWeekly,
  useRoutines,
  getRoutineStats,
  updateRequest,
  getRequests,
  removeRequest
};
