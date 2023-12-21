import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, ImageBackground
} from 'react-native';
import {
  getDatabase, ref, onValue, set, get
} from 'firebase/database';
import * as firebase from '../firebase';
import AppButton from '../components/AppButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {signInWithEmailAndPassword } from "firebase/auth";
import BlankButton from '../Components_v2/BlankButton';
import { ScrollView } from 'react-native-gesture-handler';
import ImagePickerExample from '../components/ImagePicker';
import BubbleText from '../Components_v2/BubbleText';
function ParentHome({ navigation, route }) {
  const [users, setUsers] = useState([]);
  const [kids, setKids] = useState([]);
  const [isAccessCodeModalVisible, setIsAccessCodeModalVisible] = useState(false);
  const [isParentModal, setIsParentModalVisible] = useState(false);

  const [isAddKidModalVisible, setIsAddKidModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [kidName, setKidName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [codeSetup, setCodeSetup] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [newCode, setNewCode] = useState('');
  const [codeUsed, setCodeUsed] = useState(false); 
  const [imageLink, setImageLink] = useState(null);
  const [url, setUrl] = useState(null);
  const [isDeleteKidModalVisible, setIsDeleteKidModalVisible] = useState(false);
  const [deleteKidName, setDeleteKidName] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [])
  const fetchUsers = async () => {
    const userId = firebase.auth.currentUser.uid;
    const db = getDatabase();
    const nameRef = ref(db, `/Users/${userId}/display`);
    const codeRef = ref(db, `/Users/${userId}/pass`);
    const useRef = ref(db, `/Users/${userId}/codeUsed`);
    try {
    const nameSnapshot = await get(nameRef);
    const name = nameSnapshot.val();
    
    const codeSnapshot = await get(codeRef);
    const code = codeSnapshot.val();

    const useSnapshot = await get(useRef);
    const val = useSnapshot.val();

    if (code) {
      setAccessCode(code);
      setCodeSetup(true);
    } else if (val != false) {
      setIsAccessCodeModalVisible(true);
    }

    const isCodeUsed = codeSnapshot.val();
    if (isCodeUsed) {
      setCodeUsed(true);
    } else {
      setCodeUsed(false);
    }

    const tasksRef = ref(getDatabase(), `Users/${userId}/kids`);
    const tasksSnapshot = await get(tasksRef);

    let tasks = [];
    tasksSnapshot.forEach((childSnapshot) => {
      if (childSnapshot.val().name != 'def') {
        tasks.push({ ...childSnapshot.val(), id: childSnapshot.key });
      }
    });

    setKids(tasks);
    let names = [];
    for (let i = 0; i < tasks.length; i++) {
      names.push(tasks[i].name);
    }
    setUsers([name, ...names]);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
  };

  const handleDeleteKid = async () => {
    const success = await firebase.deleteKid(deleteKidName);
    if (success) {
      alert('Kid deleted successfully.');
      setIsDeleteKidModalVisible(false);
      fetchUsers(); // Refresh the user list
    } else {
      alert('Kid not found.');
    }
  };
  
  const storeUserDetails = async (name) => {
    try {
      await AsyncStorage.setItem('@active_kid', name);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddKids = () => {
    setIsAddKidModalVisible(true);
  };

  const handleAddKid = async () => {
    // Assuming firebase.addKids(kidName) returns a Promise after completing the add operation
    await firebase.addKids(kidName, url); // Add the kid to Firebase
    setKidName(''); // Clear the kidName from state
    setIsAddKidModalVisible(false); // Close the modal
  
    // Now refetch users to update the list with the new kid
    await fetchUsers(); // Fetch the updated list of kids and users
  };

  const handleUserPress = (user) => {
    if (user === users[0]) { 
      setCodeInput('');
      if (codeUsed) {
        setIsAccessCodeModalVisible(true);
      } else {
        navigation.navigate("ParentMenu")
      }
    } else {
      storeUserDetails(user);
      navigation.navigate('KidsNav');
    }
  };
  const handleCodeInput = async () => {
    if (!codeSetup && codeInput.length === 6) {
      const userId = firebase.auth.currentUser.uid;
      await set(ref(getDatabase(), `/Users/${userId}/pass`), codeInput);
      await set(ref(getDatabase(), `/Users/${userId}/codeUsed`), true);
      setAccessCode(codeInput);
      setCodeSetup(true);
      setIsAccessCodeModalVisible(false);
      setCodeUsed(true);
    } else if (codeSetup && codeInput === accessCode) {
      navigation.navigate('ParentMenu');
      setIsAccessCodeModalVisible(false);
    } else if (!codeSetup && codeInput === '') {
      setIsAccessCodeModalVisible(false);
      const userId = firebase.auth.currentUser.uid;
      await set(ref(getDatabase(), `/Users/${userId}/codeUsed`), false);
      setCodeUsed(false);
    } else {
      alert('Invalid code input!');
    }
  };

  const handleResetCode = async () => {
    if (newCode.length !== 6) {
      alert('New code must be 6 digits long.');
      return;
    }
    try {
      await signInWithEmailAndPassword(firebase.auth, resetEmail, resetPassword);
      const userId = firebase.auth.currentUser.uid;
      await set(ref(getDatabase(), `Users/${userId}/pass`), newCode);
      setAccessCode(newCode);
      setResetModalVisible(false);
      setCodeUsed(true)
      alert('Code reset successful.');
    } catch (error) {
      alert('Invalid credentials. Please try again.');
    }
  };
  const handleSkipCode = async () => {
    setIsAccessCodeModalVisible(false)
    console.log("hey")
    const userId = firebase.auth.currentUser.uid;
    await set(ref(getDatabase(), `Users/${userId}/codeUsed`), false);
  }
  
  // console.log(route.params.userId)
  return (
    <ImageBackground  style={styles.background} source={require("../assets/backgrounds/terms_conditions.png")}>
      <ScrollView>
        <View>
            <View style={{alignItems: "center", top: 100}}>
                <Text style={styles.title}>Who's using the app?</Text>
                {users.map((user, index) => (
                    <TouchableOpacity key={index} style={styles.userBox} onPress={() => handleUserPress(user)}>
                    <Text style={styles.userName}>{user}</Text>
                    </TouchableOpacity>
                ))}
        </View>
        <View style = {{padding: 20, alignItems: "center", top: 80}}>

            <BlankButton text="Add Kid" onPress={handleAddKids} />
            <BlankButton text="Delete Kid" onPress={() => setIsDeleteKidModalVisible(true)} />

            <BlankButton text="Reset Code" onPress={() => setResetModalVisible(true)} />
            <BlankButton text="Log Out" onPress={() => { navigation.navigate("Login"), firebase.signoutUser()}} />
        </View>
      </View>
      {/* Access Code Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={isAccessCodeModalVisible}
        onRequestClose={() => setIsAccessCodeModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.textInput}
              onChangeText={setCodeInput}
              value={codeInput}
              placeholder="Enter 6-digit code"
              keyboardType="numeric"
              maxLength={6}
            />
            <Button title="Confirm" onPress={handleCodeInput} />
            <Button title="Skip" onPress={handleSkipCode} />
          </View>
        </View>
      </Modal>
      {/* Access Parent Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={isParentModal}
        onRequestClose={() => setIsParentModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.textInput}
              onChangeText={setCodeInput}
              value={codeInput}
              placeholder="Enter 6-digit code"
              keyboardType="numeric"
              maxLength={6}
            />
            <Button title="Confirm" onPress={handleCodeInput} />
            <Button title="Back" onPress={() => setIsParentModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Add Kid Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={isAddKidModalVisible}
        onRequestClose={() => setIsAddKidModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalViewBig}>
            <BubbleText size = {24} text = {"Input Kid Name"}/>
            <View style ={{bottom:210}}>
              <TextInput
                style={styles.textInput}
                onChangeText={setKidName}
                value={kidName}
                placeholder="Kid Name"
              />
            </View>
            <View style = {{bottom: 350}}>
              <BubbleText size = {24} text = {"Set Profile Image"}/>
              <View style={{bottom:100, right:110}}>
              <ImagePickerExample
                setImage={setImageLink}
                image={imageLink}
                url={url}
                setUrl={setUrl}
                source="edit"  // or source="add" depending on your need
              />
            </View>
            </View>
            <View style = {{bottom: 300}}>
            <Button title="Create Kid" onPress={handleAddKid} />
            <Button title="Back" onPress={() => setIsAddKidModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Reset Code Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={resetModalVisible}
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.textInput}
              onChangeText={setResetEmail}
              value={resetEmail}
              placeholder="Enter email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.textInput}
              onChangeText={setResetPassword}
              value={resetPassword}
              placeholder="Enter password"
              secureTextEntry
            />
            <TextInput
              style={styles.textInput}
              onChangeText={setNewCode}
              value={newCode}
              placeholder="Set new 6-digit code"
              keyboardType="numeric"
              maxLength={6}
            />

            <Button title="Reset Code" onPress={handleResetCode} />
            <Button title="Back" onPress={() => setResetModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <Modal
              animationType="slide"
              transparent
              visible={isDeleteKidModalVisible}
              onRequestClose={() => setIsDeleteKidModalVisible(false)}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={setDeleteKidName}
                    value={deleteKidName}
                    placeholder="Enter Kid's Name to Delete"
                  />
                  <Button title="Delete Kid" onPress={handleDeleteKid} />
                  <Button title="Cancel" onPress={() => setIsDeleteKidModalVisible(false)} />
                </View>
              </View>
            </Modal>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    container: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    userBox: {
      width: '80%',
      height: 100,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 300,
        width: 300,
    },
    modalViewBig: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      height: 500,
      width: '95%',
  },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === "ios" ? 0 : -12,
        paddingLeft: 10,
        color: "#05375a",
        bottom: -30
    },
    background: {
        flex: 1
      },
});


export default ParentHome;