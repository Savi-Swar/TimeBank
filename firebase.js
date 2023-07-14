import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import { getDatabase, ref, set, get, onValue, update, off } from "firebase/database";
import { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth/react-native"
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaUGJXtf1E8zDzxi3d98S4oW-IR7HgR_Q",
  authDomain: "timebank-2bf8a.firebaseapp.com",
  databaseURL: "https://timebank-2bf8a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "timebank-2bf8a",
  storageBucket: "timebank-2bf8a.appspot.com",
  messagingSenderId: "1057985279971",
  appId: "1:1057985279971:web:064ac7201d33f936c452d6",
  measurementId: "G-1XMB0MDWKC",
};

let firebaseApp = null;
if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
  initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  firebaseApp = firebase.app();
}

const storage = firebase.storage();
const db = getDatabase();
const auth = firebase.auth();


// ... (rest of your code)
export const signoutUser = () => {
  auth.signOut().then(()=>console.log("Signed Out"))
};
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
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser.uid;
  const tasksRef = ref(getDatabase(), `Users/${userId}/tasks`);

  useEffect(() => {
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      tasks = [];
      snapshot.forEach((childSnapshot) => {
        tasks.push({ ...childSnapshot.val(), id: childSnapshot.key });
      });

      setTasks(tasks);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup function
  }, []); 

  if (loading) {
    return <ActivityIndicator />;
  }

  // ...
}
export async function updateRequest(kidName, reqMinutes, taskName) {
  // Current userId
  const userId = firebase.auth().currentUser.uid;

  // Point to the correct reference
  const db = getDatabase();
  const kidRef = ref(db, `Users/${userId}/kids/${kidName}`);

  // Get the current state of the 'requests' field
  const snapshot = await get(kidRef);

  if (snapshot.exists()) {
    // If the document exists, get the current 'names', 'reqMinutes', and 'signs' arrays
    let currentNames = Array.isArray(snapshot.val().names) ? snapshot.val().names : [];
    let currentReqMinutes = Array.isArray(snapshot.val().reqMinutes) ? snapshot.val().reqMinutes : [];

    // Prepend the new values to each array
    let updatedNames = [taskName, ...currentNames];
    let updatedReqMinutes = [reqMinutes, ...currentReqMinutes];

    // Update the fields in the reference
    await update(kidRef, { names: updatedNames, reqMinutes: updatedReqMinutes});

  } else {
    // If the document does not exist, set each field to an array containing the new value
    await set(kidRef, { names: [taskName], reqMinutes: [reqMinutes]});
  }
}
export function getRequests(setNames, setMins, kidName) {
  const userId = firebase.auth().currentUser.uid;
  const db = getDatabase();
  const kidRef = ref(db, `Users/${userId}/kids/${kidName}`);
  
  // Attach a listener to the kidRef
  onValue(kidRef, (snapshot) => {
    if (snapshot.exists()) {
      let currentNames = Array.isArray(snapshot.val().names) ? snapshot.val().names : [];
      let currentReqMinutes = Array.isArray(snapshot.val().reqMinutes) ? snapshot.val().reqMinutes : [];
      setNames(currentNames);
      setMins(currentReqMinutes);
    } else {
      setNames([]);
      setMins([]);
    }
  });
}

export async function createRecordWithUserId(userId) {
  console.log("createRecordWithUserId is called with userId: ", userId);
  const [exist, setExist] = useState(false);
  try {
    // Define the initial structure of the data
    const initialData = {
      kids: {def: {minutes: 0, name: "def"}},
    };

    // Get a reference to the database service
    const db = getDatabase();
    const userRef = ref(db, `Users/${userId}`);
    // Check if the user exists
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        setExist(true)
      } 
    }).catch((error) => {
      console.error("Error fetching user: ", error);
    });
    if (!exist) {
      try {
        await set(userRef, initialData);
      } catch (error) {
        console.error("Error creating user: ", error);
      }
    }
  } catch (error) {
    console.error("Error in createRecordWithUserId function: ", error);
  }
}

export function Store(tasks, setTasks) {
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser.uid;
  const tasksRef = ref(getDatabase(), `Users/${userId}/store`);
  useEffect(() => {
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      tasks = [];
      snapshot.forEach((childSnapshot) => {
        tasks.push({ ...childSnapshot.val(), id: childSnapshot.key });
      });

      setTasks(tasks);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup function
  }, []); 

  if (loading) {
    return <ActivityIndicator />;
  }

  // ...
}

export async function Mins(minutes, setMinutes, name) {
  // Get current userId
  const userId = firebase.auth().currentUser.uid;
  // Point to the correct location in the realtime database
  const db = getDatabase();
  const minRef = ref(db, 'Users/' + userId + '/kids/' + name);

  // Get the value at this location
  try {
    const snapshot = await get(minRef);
    if (snapshot.exists()) {
      let x = snapshot.val().minutes;
      setMinutes(x);
    } else {
      // console.log("Data does not exist");
    }
  } catch (error) {
    console.log(error);
  }
}


// onValue(minRef, (snapshot) => {
//   const mins = snapshot.val();
//   console.log(mins);
// });
export function Kids(tasks, setTasks) {
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser.uid;
  const tasksRef = ref(getDatabase(), `Users/${userId}/kids`);

  useEffect(() => {
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      tasks = [];
      snapshot.forEach((childSnapshot) => {
        tasks.push({ ...childSnapshot.val(), id: childSnapshot.key });
      });

      setTasks(tasks);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup function
  }, []); 

  if (loading) {
    return <ActivityIndicator />;
  }

  // ...
}

export async function addKids(kid) {
  const data = {
    name: kid,
    minutes: 0,
    MinutesAccumulated: 0,
    WeeklyMinutesEarned: 0,
    MinutesSpent: 0,
    WeeklyArray: [], 
  };

  const userId = firebase.auth().currentUser.uid;
  const db = getDatabase();

  const kidRef = ref(db, `Users/${userId}/kids/${kid}`);
  console.log('userId:', userId);
  console.log('kid:', kid);
  await set(kidRef, data);
  const routineRef = ref(db, `Users/${userId}/routines`);
  const routineSnapshot = await get(routineRef);
  const routines = Object.values(routineSnapshot.val() || {});

  routines.forEach(async (routine) => {
    const routineData = {
      [routine.name]: {
        timesCompleted: 0,
        averageTime: 0,
        streak: 0,
        lastCompleted: "",
        times: [],
      }
    };

    const routineStatsRef = ref(db, `Users/${userId}/kids/${kid}/${routine.name}`);
    await set(routineStatsRef, routineData);
  });
}


export function addMins(minutes, total, name) {
  const userId = firebase.auth().currentUser.uid;
  const database = getDatabase();
  const minsRef = ref(database, `Users/${userId}/kids/${name}`);

  function getWeekStartDate(d) {
    const t = new Date(d);
    const day = t.getDay();
    const diff = t.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(t.setDate(diff));
  }

  function getWeekEndDate(d) {
    const t = new Date(d);
    const day = t.getDay();
    const diff = t.getDate() - day + (day === 0 ? -6 : 1) + 6;
    return new Date(t.setDate(diff));
  }

  const startDate = getWeekStartDate(new Date());
  const endDate = getWeekEndDate(new Date());

  const startMonth = startDate.getMonth() + 1;
  const startDay = startDate.getDate();
  const endMonth = endDate.getMonth() + 1;
  const endDay = endDate.getDate();

  const currentWeekKey = `${startMonth}/${startDay}-${endMonth}/${endDay}`;

  async function noCap() {
    const snapshot = await get(minsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      let minutes = data.minutes
      let accum = data.MinutesAccumulated;
      let spen = data.MinutesSpent;
      let week = data.WeeklyMinutesEarned;
      let weeklyArray = data.WeeklyArray || {}; 

      let newWeekTotal = (weeklyArray[currentWeekKey] || 0) + parseInt(total);
      weeklyArray[currentWeekKey] = newWeekTotal;

      const minutesUpdate = parseInt(minutes) + parseInt(total);
      accum = parseInt(accum) + parseInt(total);
      spen = parseInt(spen) - parseInt(total);
      week = parseInt(week) + parseInt(total);

      if (parseInt(total) > 0) {
        await update(minsRef, {
          minutes: minutesUpdate,
          MinutesAccumulated: accum,
          WeeklyMinutesEarned: week,
          WeeklyArray: weeklyArray
        });
      } else {
        await update(minsRef, {
          minutes: minutesUpdate,
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
  const realtimeDb = getDatabase();

  const userId = firebase.auth().currentUser.uid;
  const weeklyPath = `Users/${userId}/kids/${name}`;

  useEffect(() => {
    console.log('Running getWeekly useEffect');
    const weeklyRef = ref(realtimeDb, weeklyPath);

    const unsubscribe = onValue(weeklyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDataset(data.WeeklyArray);
        setLoading(false);
      }
    }, (error) => {
      console.log(error);
    });

    // Cleanup function
    return () => unsubscribe();
  }, [weeklyPath, realtimeDb]);

  return { dataset, loading };
}

export async function getRoutineStats(kidName, routineName) {
  const userId = firebase.auth().currentUser.uid;
  const db = getDatabase();

  try {
      const routineStatsRef = ref(db, `Users/${userId}/kids/${kidName}/${routineName}/Stats`);
      const snapshot = await get(routineStatsRef);

      if (snapshot.exists()) {
          console.log("Document data:", snapshot.val());
          return snapshot.val();
      } else {
          console.log("No such document!");
          return null;
      }
  } catch (error) {
      console.log("Error getting document: ", error);
  }
}

export function useRoutines() {
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState([]);
  const userId = firebase.auth().currentUser.uid;
  
  useEffect(() => {
    console.log('Running useRoutines useEffect');
    const db = getDatabase();
    const routinesRef = ref(db, `Users/${userId}/routines`);
    
    onValue(routinesRef, snapshot => {
      const data = snapshot.val();
      const routines = data ? Object.keys(data).map(key => ({ ...data[key], id: key })) : [];
      
      setStore(routines);
      setLoading(false);
    });

    return () => off(routinesRef);
  }, []);

  return { store, loading };
}

export async function finishRoutine(minutesEarly, childName, routineName, et) {
  const userId = firebase.auth().currentUser.uid;
  const db = getDatabase();
  const routineRef = ref(db, `Users/${userId}/kids/${childName}/${routineName}/Stats`);
  
  const etInMinutes = toMinutes(et);
  const finishTime = toHHMM(etInMinutes - minutesEarly);
  
  try {
    const snapshot = await get(routineRef);
    let data;

    if (snapshot.exists()) {
      data = snapshot.val();
    } else {
      data = {
        timesCompleted: 0,
        averageTime: 0,
        streak: 0,
        lastCompleted: "",
        times: [],
      };
    }

    data.timesCompleted += 1;
    data.averageTime = ((data.averageTime * (data.timesCompleted - 1) + minutesEarly)) / data.timesCompleted;
    data.streak += 1; 
    data.lastCompleted = new Date().toLocaleDateString();

    // Handle the last ten times
    if (data.times.length >= 10) {
      data.times.shift();
    }
    data.times.push(finishTime);

    await set(routineRef, data);
  } catch (error) {
    console.log(error);
  }
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

export function Routines(tasks, setTasks) {
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser.uid;
  const tasksRef = ref(getDatabase(), `Users/${userId}/routines`);

  useEffect(() => {
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      tasks = [];
      snapshot.forEach((childSnapshot) => {
        tasks.push({ ...childSnapshot.val(), id: childSnapshot.key });
      });

      setTasks(tasks);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup function
  }, []); 

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
    setIsLoading(true);

    const db = getDatabase();
    const routinesRef = ref(db, `Users/${userId}/routines/${id}/${collections}`);
    
    const listener = onValue(routinesRef, snapshot => {
      const routinesData = snapshot.val();
      const routines = [];
      for (let key in routinesData) {
        routines.push({ ...routinesData[key], id: key });
      }
      setX(routines.length);
      setIsLoading(false);
    });

    // Make sure to unsubscribe from your realtime listener when component unmounts.
    return () => listener.off();

  }, []);  // The empty array ensures this runs once on mount and not on every re-render

  return x;
}


export function rearrangeRoutine(collections, title, colID, id, im, up) {
  let x = up ? im - 1 : im + 1;
  console.log(`im: ${im}, x: ${x}, up: ${up}`);
  const userId = firebase.auth().currentUser.uid;
  const db = getDatabase();
  const routineRef = ref(db, `Users/${userId}/routines/${colID}/${collections}`);
  const routineDocRef = ref(db, `Users/${userId}/routines/${colID}/${collections}/${id}`);
  const data = {
    indx: x,
    title: title,
  };

  get(routineRef).then(snapshot => {
    const routines = [];
    snapshot.forEach(childSnapshot => {
      routines.push({ ...childSnapshot.val(), id: childSnapshot.key });
    });

    // Sort routines array by indx property
    routines.sort((a, b) => a.indx - b.indx);

    console.log(routines);
    if (routines.length > 0 && x > 0 && x <= routines.length) {
      const swap = routines[x - 1]; // Here's the corrected part
      console.log(swap);

      const data2 = {
        indx: im,  // updated
        title: swap.title,
      };
    
      set(routineDocRef, data).catch(error => {
        console.log(error);
      });
    
      const routineDocRef2 = ref(db, `Users/${userId}/routines/${colID}/${collections}/${swap.id}`);
      set(routineDocRef2, data2).catch(error => {
        console.log(error);
      });
    } else {
      console.log("Invalid index or routines array is empty");
    }
  });
}




export async function RoutinesCollections(setRoutines, collections, id) {
  const userId = firebase.auth().currentUser.uid;
  const db = getDatabase();
  const routineRef = ref(db, `Users/${userId}/routines/${id}/${collections}`);
  onValue(routineRef, (snapshot) => {
    const routines = [];
    snapshot.forEach(childSnapshot => {
      routines.push({ ...childSnapshot.val(), id: childSnapshot.key });
    });

    // Sort routines array by indx property
    routines.sort((a, b) => a.indx - b.indx);

    setRoutines(routines);
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
  const db = getDatabase();
  const kidsRef = ref(db, `Users/${userId}/kids`);

  onValue(kidsRef, (snapshot) => {
    const kids = snapshot.val();
    for (let kidId in kids) {
      const kid = kids[kidId];
      if (kid.name !== 'def') {
        const kidRoutineRef = ref(db, `Users/${userId}/kids/${kidId}/${routineName}/Stats`);
        set(kidRoutineRef, {
          times: [],
          streak: 0,
          lastCompleted: "",
          averageTime: 0,
          timesCompleted: 0
        });
      }
    }
  }, (error) => {
    console.error("Error fetching kids: ", error);
  });
}

export async function deleteKidsRoutine(routineName) {
  const userId = firebase.auth().currentUser.uid;
  const db = getDatabase();
  const kidsRef = ref(db, `Users/${userId}/kids`);

  onValue(kidsRef, (snapshot) => {
    const kids = snapshot.val();
    for (let kidId in kids) {
      const kid = kids[kidId];
      if (kid.name !== 'def') {
        const statsDocRef = ref(db, `Users/${userId}/kids/${kidId}/${routineName}/Stats`);
        remove(statsDocRef)
          .then(() => {
            console.log(`Deleted 'Stats' document from ${kid.name}'s ${routineName} routine.`);
          }).catch((error) => {
            console.error(`Error deleting 'Stats' document: `, error);
          });
      }
    }
  }, (error) => {
    console.error("Error fetching kids: ", error);
  });
}


export async function removeRequest(kidName, index, setLen) {
  // Current userId
  const userId = firebase.auth().currentUser.uid;

  // Point to the correct reference
  const db = getDatabase();
  const kidRef = ref(db, `Users/${userId}/kids/${kidName}`);

  // Get the current state of the 'names' and 'reqMinutes' arrays
  const snapshot = await get(kidRef);

  if (snapshot.exists()) {
    // If the document exists, get the current 'names' and 'reqMinutes' arrays
    let currentNames = snapshot.val().names || [];
    let currentReqMinutes = snapshot.val().reqMinutes || [];
    // Check if index is valid
    if (index < currentNames.length && index < currentReqMinutes.length && index >= 0) {
      // Remove the item at the specified index from both arrays
      currentNames.splice(index, 1);
      currentReqMinutes.splice(index, 1);
      setLen(currentNames.length);

      // Update the fields in the reference
      await update(kidRef, { names: currentNames, reqMinutes: currentReqMinutes });
    }
  }
}

export { firebase, db, auth, storage };
export default {
  Tasks,
  Mins,
  addMins,
  makeid,
  Store,
  Routines,
  RoutinesCollections,
  addKids,
  getRoutineLength,
  rearrangeRoutine,
  finishRoutine,
  kidsRoutine, 
  deleteKidsRoutine,
  getWeekly,
  useRoutines,
  getRoutineStats,
  updateRequest,
  getRequests,
  removeRequest,
  signoutUser,
  createRecordWithUserId
};
