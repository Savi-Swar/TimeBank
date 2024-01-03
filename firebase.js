import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import { getDatabase, ref, set, get, onValue, update, off, remove } from "firebase/database";
import { useState, useEffect } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth/react-native"
import { registerForPushNotificationsAsync, sendPushNotification } from "./notifications";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";

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
export const cleanupExpiredAssignments = async (userId) => {
  const db = getDatabase();
  const assignmentsRef = ref(db, `Users/${userId}/assignment`);
  
  // Get the current date and ignore time components
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Get assignments data
  const snapshot = await get(assignmentsRef);
  const data = snapshot.val();

  if (data) {
    // Check each assignment
    for (let id in data) {
      const assignment = data[id];

      // Parse the due date of the assignment and ignore time components
      const dueDate = new Date(assignment.date);
      dueDate.setHours(0, 0, 0, 0);
      // If the due date of the assignment is before the current date, delete it
      if (dueDate < currentDate) {
        const assignmentRef = ref(db, `Users/${userId}/assignment/${id}`);
        await remove(assignmentRef);
      }
    }
  }
}


export const Assignments = (callback) => {
  const db = getDatabase();
  const userId = auth.currentUser.uid;

  const assignmentsRef = ref(db, `Users/${userId}/assignment`);

  // Attach a listener
  const listener = onValue(assignmentsRef, (snapshot) => {
    const data = snapshot.val();
    // Check if data is null before trying to iterate over it
    if (data) {
      const assignments = Object.keys(data).map((key) => ({
        ...data[key],
        id: key,
      }));
      callback(assignments); // pass data to callback to update state
    } else {
      callback([]); // pass empty array to callback if data is null
    }
  });
  // Cleanup expired assignments
  cleanupExpiredAssignments(userId);

  // Return cleanup function
  return () => {
    off(assignmentsRef, 'value', listener);
  };
};

export const completeAssignmentForKid = async (assignmentId, kidName) => {
  const userId = auth.currentUser.uid;
  const db = getDatabase();
  const assignmentRef = ref(db, `Users/${userId}/assignment/${assignmentId}`);

  // Get the current assignment data
  const snapshot = await get(assignmentRef);
  const assignment = snapshot.val();
  if (assignment && assignment.kids && assignment.kids.includes(kidName)) {
    // Remove the kid's name from the kids array
    const updatedKids = assignment.kids.filter(kid => kid !== kidName);

    // Update the assignment with the new kids array
    await update(assignmentRef, { kids: updatedKids });
  }
}



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
      tasks.sort((a, b) => a.minutes - b.minutes);

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
export async function updateRequest(kidName, reqMinutes, taskName, assignmentId) {
  // Current userId
  const userId = firebase.auth().currentUser.uid;

  // Point to the correct reference
  const db = getDatabase();
  const kidRef = ref(db, `Users/${userId}/kids/${kidName}`);

  // Get the current state of the 'requests' field
  const snapshot = await get(kidRef);

  if (snapshot.exists()) {
    // If the document exists, get the current arrays
    let currentNames = Array.isArray(snapshot.val().names) ? snapshot.val().names : [];
    let currentReqMinutes = Array.isArray(snapshot.val().reqMinutes) ? snapshot.val().reqMinutes : [];
    let currentAssignments = Array.isArray(snapshot.val().isAssignment) ? snapshot.val().isAssignment : [];

    // Prepend the new values to each array
    let updatedNames = [taskName, ...currentNames];
    let updatedReqMinutes = [reqMinutes, ...currentReqMinutes];
    let updatedAssignments = [assignmentId, ...currentAssignments]; // Add assignmentId, can be 'false' or actual ID

    // Update the fields in the reference
    await update(kidRef, { names: updatedNames, reqMinutes: updatedReqMinutes, isAssignment: updatedAssignments });
    const tokenRef = ref(db, `Users/${userId}/token`)
    const token =  await get(tokenRef);
    let message = kidName + " did " + taskName + " for " + reqMinutes + " minutes!"
    sendPushNotification(token, "Task Completed!", message);
  } else {
    // If the document does not exist, set each field to an array containing the new value
    await set(kidRef, { names: [taskName], reqMinutes: [reqMinutes], isAssignment: [assignmentId] });
  }
}

export function getRequests(setNames, setMins, setIsAssignment, kidName) {
  const userId = firebase.auth().currentUser.uid;
  const db = getDatabase();
  const kidRef = ref(db, `Users/${userId}/kids/${kidName}`);
  
  // Attach a listener to the kidRef
  const unsubscribe = onValue(kidRef, (snapshot) => {
    if (snapshot.exists()) {
      let currentNames = Array.isArray(snapshot.val().names) ? snapshot.val().names : [];
      let currentReqMinutes = Array.isArray(snapshot.val().reqMinutes) ? snapshot.val().reqMinutes : [];
      let curIsAssignment = Array.isArray(snapshot.val().isAssignment) ? snapshot.val().isAssignment : [];
      setNames([...currentNames]);
      setMins([...currentReqMinutes]);
      setIsAssignment([...curIsAssignment]);
    } else {
      setNames([]);
      setMins([]);
      setIsAssignment([]);
    }
  });
 

  // Return the unsubscribe function
  return () => off(kidRef, unsubscribe);
}
export async function createRecordWithUserId(userId,display) {
  console.log("createRecordWithUserId is called with userId: ", userId);
  try {
    // Define the initial structure of the data

    const initialData = {
      kids: {def: {minutes: 0, name: "def"}},
      display: display,
      store: {
        "67mEQCVAszQvN8lOBy5u": {
          "id": "67mEQCVAszQvN8lOBy5u",
          "image": "WaffleSundae.jpeg",
          "minutes": "40",
          "title": "Waffle Sundae"
        },
        "67mEQCVAszQvN8lOBy89": {
          "id": "67mEQCVAszQvN8lOBy89",
          "image": "HappyMeal.jpeg",
          "minutes": "60",
          "title": "McDonalds"
        },
        "U03iUdjSlWJEuYfdN2Ue": {
          "id": "U03iUdjSlWJEuYfdN2Ue",
          "image": "Starbucks.webp",
          "minutes": "60",
          "title": "Starbucks"
        },
        "YvYaIlQ7zbPf1gu8ywXF": {
          "id": "YvYaIlQ7zbPf1gu8ywXF",
          "image": "Monopoly.jpeg",
          "minutes": "180",
          "title": "Monopoly game"
        },
      },
      tasks: {
        "UVZPzfu3VPwbwAq44H8R": {
          "id": "UVZPzfu3VPwbwAq44H8R",
          "image": "table.jpeg",
          "minutes": "2",
          "title": "Set Dinner Table"
        },
        "d6enbabcHy9OQ8xzeHfB": {
          "id": "d6enbabcHy9OQ8xzeHfB",
          "image": "Room.jpeg",
          "minutes": "10",
          "title": "Clean your room"
        },
        "vxL8tL245qKQmh3BTdWG": {
          "id": "vxL8tL245qKQmh3BTdWG",
          "image": "bed.jpeg",
          "minutes": "2",
          "title": "Make your bed"
        },
        "UVZPzfu3VPwbwAq44H8R": {
          "id": "UVZPzfu3VPwbwAq44H8R",
          "image": "table.jpeg",
          "minutes": "2",
          "title": "Set Dinner Table"
        },
        "vxL8tL245qKQmh3BTdWG": {
          "id": "vxL8tL245qKQmh3BTdWG",
          "image": "bed.jpeg",
          "minutes": "2",
          "title": "Make your bed"
        }
    }
  }

    // Get a reference to the database service
    const db = getDatabase();
    const userRef = ref(db, `Users/${userId}`);
    // Check if the user exists
    get(userRef).then((snapshot) => {
      if (!snapshot.exists()) {
        registerForPushNotificationsAsync(userRef);
        update(userRef, initialData).catch((error) => {
          console.error("Error creating user: ", error);
        });
      } 
    }).catch((error) => {
      console.error("Error fetching user: ", error);
    });
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
      tasks.sort((a, b) => a.minutes - b.minutes);

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
export async function useKids() {
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const tasksRef = ref(getDatabase(), `Users/${userId}/kids`);
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const fetchedKids = [];
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.val().name !== "def") {
          fetchedKids.push({ ...childSnapshot.val(), id: childSnapshot.key });
        }
      });

      setKids(fetchedKids);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup function
  }, [userId]); // Dependency on userId

  return { kids, loading };
}

export function kidData(tasks, setTasks, name) {
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser.uid;
  const tasksRef = ref(getDatabase(), `Users/${userId}/kids`);

  useEffect(() => {
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      tasks = [];
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.val().name == name) {
          tasks.push({ ...childSnapshot.val(), id: childSnapshot.key });
        }
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

export function Kids(tasks, setTasks) {
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser.uid;
  const tasksRef = ref(getDatabase(), `Users/${userId}/kids`);

  useEffect(() => {
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      tasks = [];
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.val().name != "def") {
          tasks.push({ ...childSnapshot.val(), id: childSnapshot.key });
        }
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

export async function deleteKid(kidName) {
  const userId = firebase.auth().currentUser.uid;
  const db = getDatabase();

  // Reference to the kid's data
  const kidRef = ref(db, `Users/${userId}/kids/${kidName}`);
  
  // Check if the kid exists
  const snapshot = await get(kidRef);
  if (!snapshot.exists()) {
    console.log('The kid does not exist!');
    Alert.alert("Error", "The kid does not exist!")
    return { success: false, message: 'Kid not found' };
  }

  // Kid exists, get the image URL
  const kidData = snapshot.val();
  const imageUrl = kidData.profilePic;

  // Delete the image from storage if URL exists
  if (imageUrl) {
    const storage = getStorage();
    const imageRef = storageRef(storage, imageUrl);

    try {
      await deleteObject(imageRef);
      console.log(`Deleted image for ${kidName}`);
    } catch (error) {
      console.error("Error deleting image:", error);
      return { success: false, message: 'Error deleting image' };
    }
  }

  // Now, delete the kid's data from the database
  try {
    await remove(kidRef);
    console.log('The kid has been deleted!');

    // Optionally, remove any other related data for the kid
    // For example, deleting the kid's routines, tasks, etc.
    // ...

    return { success: true, message: 'Kid deleted successfully' };
  } catch (error) {
    console.error("Error deleting kid:", error);
    return { success: false, message: 'Error deleting kid' };
  }
}

export async function addKids(kid ,url) {
  const userId = firebase.auth().currentUser.uid;
  const db = getDatabase();

  const kidRef = ref(db, `Users/${userId}/kids/${kid}`);
  
  // Check if the kid already exists
  const snapshot = await get(kidRef);
  if (snapshot.exists()) {
    console.log('The kid already exists!');
    return;
  }
  const format = (date) => {
    return [
      date.getFullYear(),
      date.getMonth() + 1, // JavaScript months are 0-indexed
      date.getDate()
    ].join('|');
  };

  const routineRef = ref(db, `Users/${userId}/routines`);
  const routineSnapshot = await get(routineRef);
  const routines = Object.values(routineSnapshot.val() || {});

  const now = new Date();
  // Adjust the day of the week so Monday is 0, Tuesday is 1, ..., Sunday is 6
  const dayOfWeek = (now.getDay() + 6) % 7; 

  // Calculate the start of the week (Monday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);

  // Calculate the end of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const weeklyArrayKey = `${format(startOfWeek)}__${format(endOfWeek)}`;

  const data = {
    name: kid,
    minutes: 0,
    MinutesAccumulated: 0,
    WeeklyMinutesEarned: 0,
    MinutesSpent: 0,
    WeeklyArray: {
      [weeklyArrayKey]: 0, // Default entry for the current week
    },
    profilePic: url
  };

  await set(kidRef, data);

  // add stats for all routines
  // for (const routine of routines) {
  //   const routineData = {
  //     timesCompleted: 0,
  //     averageTime: 0,
  //     lastCompleted: "",
  //     times: [],
  //   };
  //   const routineRef2 = ref(db, `Users/${userId}/kids/${kid}/${routine.title}`);
  //   await set(routineRef2, routineData);
  // };
}


export async function addMins(total, name) {
  const userId = firebase.auth().currentUser.uid;
  const database = getDatabase();

  const minsRef = ref(database, `Users/${userId}/kids/${name}`);

  // Helper functions to get start and end dates of the week
  const getWeekStartDate = (d) => {
    const t = new Date(d);
    const day = t.getDay();
    const diff = t.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(t.setDate(diff));
  };

  const getWeekEndDate = (d) => {
    const t = new Date(d);
    const day = t.getDay();
    const diff = t.getDate() - day + (day === 0 ? -6 : 1) + 6;
    return new Date(t.setDate(diff));
  };

  // Construct the key for the current week
  const startDate = getWeekStartDate(new Date());
  const endDate = getWeekEndDate(new Date());

  const formatKey = (date) => `${date.getFullYear()}|${date.getMonth() + 1}|${date.getDate()}`;

  const currentWeekKey = `${formatKey(startDate)}__${formatKey(endDate)}`;

  const updateWeeklyArray = async () => {
    const snapshot = await get(minsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      let minutes = data.minutes;
      let accum = data.MinutesAccumulated;
      let spen = data.MinutesSpent;
      let week = data.WeeklyMinutesEarned;
      let weeklyArray = data.WeeklyArray || {};

      // Update the minutes for the current week
      weeklyArray[currentWeekKey] = (weeklyArray[currentWeekKey] || 0) + parseInt(total, 10);

      // Keep only the latest 10 weeks
      const sortedKeys = Object.keys(weeklyArray).sort().reverse(); // Sort keys in descending order
      if (sortedKeys.length > 10) {
        delete weeklyArray[sortedKeys[10]]; // Remove the oldest week
      }

      // Update database
      const minutesUpdate = parseInt(minutes, 10) + parseInt(total, 10);
      accum = parseInt(accum, 10) + parseInt(total, 10);
      spen = parseInt(spen, 10) - parseInt(total, 10);
      week = weeklyArray[currentWeekKey];

      if (parseInt(total, 10) > 0) {
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

  await updateWeeklyArray();
}


export function getWeekly(name) {
  const [loading, setLoading] = useState(true);
  const [dataset, setDataset] = useState([]);
  const realtimeDb = getDatabase();

  const userId = firebase.auth().currentUser.uid;
  const weeklyPath = `Users/${userId}/kids/${name}`;

  useEffect(() => {
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
  const formattedRoutineName = routineName.replace(/\s+/g, '-'); // This will replace all spaces with dashes
  const userId = firebase.auth().currentUser.uid;
  const db = getDatabase();

  try {
      const routineStatsRef = ref(db, `Users/${userId}/kids/${kidName}/${formattedRoutineName}`);
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
export function useRoutineTitles() {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    const db = getDatabase();
    const routinesRef = ref(db, `Users/${userId}/routines`);

    const unsubscribe = onValue(routinesRef, snapshot => {
      const routinesData = snapshot.val();
      const routineTitles = routinesData ? Object.keys(routinesData).map(key => routinesData[key].title) : [];
      
      setTitles(routineTitles);
      setLoading(false);
    });

    // Cleanup function
    return () => off(routinesRef);

  }, []);

  return { titles, loading };
}

export async function finishRoutine(minutesEarly, childName, routineName, st, et) {
  const formattedRoutineName = routineName.replace(/\s+/g, '-'); // This will replace all spaces with dashes
  const userId = firebase.auth().currentUser.uid;
  const db = getDatabase();
  const routineRef = ref(db, `Users/${userId}/kids/${childName}/${formattedRoutineName}`);
  
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
        lastCompleted: "",
      };
    }

    data.timesCompleted += 1;
    data.averageTime = ((data.averageTime * (data.timesCompleted - 1) + minutesEarly)) / data.timesCompleted;
    data.lastCompleted = new Date().toLocaleDateString();

    // Handle the last ten times
    const timesRef = ref(db, `Users/${userId}/kids/${childName}/${formattedRoutineName}/times`);
    let timesData = [];
    const timesSnapshot = await get(timesRef);
    if (timesSnapshot.exists()) {
      timesData = timesSnapshot.val();
    }

    timesData.push(finishTime);
    if (timesData.length > 10) {
      timesData.shift();
    }

    

    await update(routineRef, {
      timesCompleted: data.timesCompleted,
      averageTime: data.averageTime,
      lastCompleted: data.lastCompleted,
      st: st,
      et: et,
    });

    await set(timesRef, timesData);

  } catch (error) {
    console.log(error);
  }
}


function toMinutes(timeStr) {
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
        let task = { ...childSnapshot.val(), id: childSnapshot.key };
        // console.log(task);
        // task.title = task.title.replace(/-/g, " ");  // replace dashes with spaces in title
        tasks.push(task);
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

export function getRoutineLength(id) {
  const [isLoading, setIsLoading] = useState(false);
  const [x, setX] = useState(0)

  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;
    setIsLoading(true);

    const db = getDatabase();
    const routinesRef = ref(db, `Users/${userId}/routines/${id}/steps`);
    
    const unsubscribe = onValue(routinesRef, snapshot => {
      const routinesData = snapshot.val();
      const routines = [];
      for (let key in routinesData) {
        routines.push({ ...routinesData[key], id: key });
      }
      setX(routines.length);
      setIsLoading(false);
    });

    // Make sure to unsubscribe from your realtime listener when component unmounts.
    return unsubscribe;

  }, []);  // The empty array ensures this runs once on mount and not on every re-render

  return x;
}



export function rearrangeRoutine(title, colID, id, im, up) {
  let x = up ? im - 1 : im + 1;
  const userId = firebase.auth().currentUser.uid;
  const db = getDatabase();
  
  const routineRef = ref(db, `Users/${userId}/routines/${colID}/steps`);
  const routineDocRef = ref(db, `Users/${userId}/routines/${colID}/steps/${id}`);
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

    if (routines.length > 0 && x > 0 && x <= routines.length) {
      const swap = routines[x - 1]; // Here's the corrected part

      const data2 = {
        indx: im,  // updated
        title: swap.title,
      };
    
      set(routineDocRef, data).catch(error => {
        console.log(error);
      });
    
      const routineDocRef2 = ref(db, `Users/${userId}/routines/${colID}/steps/${swap.id}`);
      set(routineDocRef2, data2).catch(error => {
        console.log(error);
      });
    } else {
      console.log("Invalid index or routines array is empty");
    }
  });
}




export async function RoutinesCollections(setRoutines, id) {
  const userId = firebase.auth().currentUser.uid;
  const db = getDatabase();
  const routineRef = ref(db, `Users/${userId}/routines/${id}/steps`);
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
        const kidRoutineRef = ref(db, `Users/${userId}/kids/${kidId}/${routineName}`);
        set(kidRoutineRef, {
          times: [],
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
        const statsDocRef = ref(db, `Users/${userId}/kids/${kidId}/${routineName}`);
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


export async function removeRequest(kidName, index) {
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
    let curIsAssignment = snapshot.val().isAssignment || [];
    // Check if index is valid
    if (index < currentNames.length && index < currentReqMinutes.length && index >= 0 && index < curIsAssignment.length) {
      // Remove the item at the specified index from both arrays
      currentNames.splice(index, 1);
      currentReqMinutes.splice(index, 1);
      curIsAssignment.splice(index, 1);

      // Update the fields in the reference
      await update(kidRef, { names: currentNames, reqMinutes: currentReqMinutes, isAssignment: curIsAssignment });
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
  createRecordWithUserId,
  Assignments,
  useKids,
  useRoutineTitles,
  kidData
  
};
