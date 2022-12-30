// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";

import "firebase/compat/firestore";
import "firebase/compat/auth";
import { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  orderBy,
  query,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { ActivityIndicator } from "react-native";
import { getDatabase, set, update } from "firebase/database";
import { getStorage, uploadBytes, ref } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

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
const storage = getStorage();

const db = getDatabase();

const auth = getAuth();

const firestores = getFirestore();
const colRef = collection(firestores, "tasks");
const storeRef = collection(firestores, "store");
const routineRefs = collection(firestores, "routines");
const kidsRef = collection(firestores, "kids");
const activeRef = collection(firestores, "Active");

export function Tasks(tasks, setTasks) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount

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

export function Store(store, setStore) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount

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
  console.log("in use")
  const data = {
    Name: name,
  };
  const docRef = doc(firestores, "Active", "i6e8NvXh9xgoseQ5zZBh");

  updateDoc(docRef, data)
    .then(console.log("Entire Document has been updated successfully"))
    .catch(error => {
      console.log(error);
    });
}

export function retrieveDays(setDays,  id, setMonths) {
  const daysRef = doc(firestores, "routines", id);

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
  const monthsRef = doc(firestores, "routines", id);

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
  const minRef = doc(firestores, "kids", name);

  async function cap() {
    try {
      const docSnap = await getDoc(minRef);
      if (docSnap.exists()) {
        let x = docSnap.data().minutes;
        setMinutes(x);
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  }
  cap();

  // setMinutes(query(minRef, "minutes"));
  // useEffect(() => {
  //   const item = getDocs(minRef).then((snapshot) => {
  //     let mins = [];
  //     snapshot.docs.forEach((doc) => {
  //       mins.push({ ...doc.data(), id: doc.id });
  //     });
  //     let refer = mins[0];
  //     setMinutes(refer.minutes);

  //     setLoadings(false);
  //   });

  //   // Unsubscribe from events when no longer in use
  // });

  // if (loadings) {
  //   return <ActivityIndicator />;
  // }

  // ...
}

// onValue(minRef, (snapshot) => {
//   const mins = snapshot.val();
//   console.log(mins);
// });
export function Kids(kids, setKids) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount

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

export function addKids(kid) {
  const data = {
    name: kid,
    minutes: 0,
  };
  const docRef = doc(firestores, "kids", kid);
  const minsRef = doc(firestores, "kids", kid);
  async function setTheDoc() {
    await setDoc(doc(firestores, "kids", kid), data);
  }
  async function noCap() {
    const docSnap = await getDoc(minsRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case

      setTheDoc();
    }
  }
  noCap();
}

export function addMins(minutes, total, name) {
  const minsRef = doc(firestores, "kids", name);

  async function noCap() {
    const docSnap = await getDoc(minsRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      minutes = docSnap.data().minutes;
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    minutes = minutes + total;
    console.log(total);
    const data = {
      minutes: minutes,
      name: name,
    };

    setDoc(minsRef, data)
      .then(console.log("Entire Document has been updated successfully"))
      .catch(error => {
        console.log(error);
      });
  }
  noCap();
}
export function Routines(store, setStore) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount

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

export function RoutinesCollections(routines, setRoutines, collections, id) {
  const routineRef = collection(firestores, "routines", id, collections);
  const order = query(routineRef, orderBy("time"));
  useEffect(() => {
    const item = getDocs(order).then(snapshot => {
      routines = [];
      snapshot.docs.forEach(doc => {
        routines.push({ ...doc.data(), id: doc.id });

      });
      setRoutines(routines);

    });
    // Unsubscribe from events when no longer in use
  });
}
export function updateTimes(textVal, title, graphic, id, collections) {
  console.log(textVal);
  let x = parseInt(textVal);
  const routineDocRef = doc(
    firestores,
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
export { firebase, db, colRef, auth, firestores };
export default {
  Tasks,
  Mins,
  addMins,
  makeid,
  Store,
  storage,
  Routines,
  RoutinesCollections,
  addKids,
  updateActiveUser,
  updateTimes,
  retrieveDays,
  retrieveMonths,
  retrieveUser,
};
