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
import ImagePickerExample from '../Components_v2/ImagePicker';
import BubbleText from '../Components_v2/BubbleText';
import { playSound, sounds, toggleSoundEffects } from '../audio';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Example
import { scale, verticalScale, moderateScale,moderateScaleFont } from '../scaling';

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
      playSound('pop');
      alert('Kid deleted successfully.');
      setIsDeleteKidModalVisible(false);
      fetchUsers(); // Refresh the user list
    } else {
      playSound("alert")
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
    playSound("maximise")
    setIsAddKidModalVisible(true);
  };

  const handleAddKid = async () => {
    // Assuming firebase.addKids(kidName) returns a Promise after completing the add operation
    await firebase.addKids(kidName, url); // Add the kid to Firebase
    setKidName(''); // Clear the kidName from state
    setIsAddKidModalVisible(false); // Close the modal
    playSound("minimise")

  
    // Now refetch users to update the list with the new kid
    await fetchUsers(); // Fetch the updated list of kids and users
  };

  const handleUserPress = (user) => {
    playSound("click")
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
      playSound("click")
      const userId = firebase.auth.currentUser.uid;
      await set(ref(getDatabase(), `/Users/${userId}/pass`), codeInput);
      await set(ref(getDatabase(), `/Users/${userId}/codeUsed`), true);
      setAccessCode(codeInput);
      setCodeSetup(true);
      setIsAccessCodeModalVisible(false);
      setCodeUsed(true);
    } else if (codeSetup && codeInput === accessCode) {
      playSound("approve")
      navigation.navigate('ParentMenu');
      setIsAccessCodeModalVisible(false);
    } else if (!codeSetup && codeInput === '') {
      setIsAccessCodeModalVisible(false);
      const userId = firebase.auth.currentUser.uid;
      await set(ref(getDatabase(), `/Users/${userId}/codeUsed`), false);
      setCodeUsed(false);
    } else {
      playSound("deny")
      alert('Invalid code input!');
    }
  };

  const handleResetCode = async () => {
    if (newCode.length !== 6) {
      playSound("deny")
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
      playSound("approve")
    } catch (error) {
      playSound("deny")
      alert('Invalid credentials. Please try again.');
    }
  };
  const handleSkipCode = async () => {
    playSound("click")
    setIsAccessCodeModalVisible(false)
    console.log("hey")
    const userId = firebase.auth.currentUser.uid;
    await set(ref(getDatabase(), `Users/${userId}/codeUsed`), false);
  }
  
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [isSoundEffectsOn, setIsSoundEffectsOn] = useState(true);
  // Toggle music
  const toggleMusic = () => {
    setIsMusicOn(!isMusicOn);
    playSound('select');
    // Logic to play/pause music
    if (isMusicOn) {
      sounds['happyMusic'].pauseAsync();
    } else {
      sounds['happyMusic'].playAsync();
    }
  };

  // Toggle sound effects
  const toggleSound = () => {
    if (isSoundEffectsOn) {
      playSound('select');
      setIsSoundEffectsOn(!isSoundEffectsOn);
      toggleSoundEffects();

    } else {
      toggleSoundEffects();
      setIsSoundEffectsOn(!isSoundEffectsOn);
      playSound('select');

    }
   

    // Add logic if needed to handle sound effects globally
  };
  // console.log(route.params.userId)
  const TextButton = ({ title, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={style}>
      <Text style={styles.textButton}>{title}</Text>
    </TouchableOpacity>
  );
  return (
    <ImageBackground  style={styles.background} source={require("../assets/backgrounds/terms_conditions.png")}>
      <ScrollView>
        <View>
          <View style={styles.soundControlContainer}>
            <TouchableOpacity onPress={toggleMusic}>
              <Icon name={isMusicOn ? 'music' : 'music-off'} size={scale(30)} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSound} style={styles.soundEffectIcon}>
              <Icon name={isSoundEffectsOn ? 'volume-high' : 'volume-off'} size={scale(30)} color="black" />
            </TouchableOpacity>
          </View>
            <View style={{alignItems: "center", top: verticalScale(100)}}>
                <Text style={styles.title}>Who's using the app?</Text>
                {users.map((user, index) => (
                    <TouchableOpacity key={index} style={styles.userBox} onPress={() => handleUserPress(user)}>
                    <Text style={styles.userName}>{user}</Text>
                    </TouchableOpacity>
                ))}
        </View>
        <View style = {{paddingHorizontal: scale(20), paddingVertical: verticalScale(20), alignItems: "center", top: verticalScale(80)}}>

            <BlankButton text="Add Kid" onPress={handleAddKids} />
            <BlankButton text="Delete Kid" onPress={() => setIsDeleteKidModalVisible(true)} />

            <BlankButton text="Reset Code" onPress={() => setResetModalVisible(true)} />
            <View style={{marginBottom: verticalScale(80)}}>
              <BlankButton text="Log Out" onPress={() => { navigation.navigate("Login"), firebase.signoutUser()}} />
            </View>
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
            <TextButton title="Confirm" onPress={handleCodeInput} />
            <TextButton title="Skip" onPress={handleSkipCode} />
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
            <TextButton title="Confirm" onPress={handleCodeInput} />
            <TextButton title="Back" onPress={() => {setIsParentModalVisible(false), playSound("minimise")}} />
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
            <BubbleText size = {moderateScaleFont(24,1)} text = {"Input Kid Name"}/>
            <View style ={{bottom:verticalScale(210)}}>
              <TextInput
                style={styles.textInput}
                onChangeText={setKidName}
                value={kidName}
                placeholder="Kid Name"
              />
            </View>
            <View style = {{bottom: verticalScale(350)}}>
              <BubbleText size = {moderateScaleFont(24,1)} text = {"Set Profile Image"}/>
              <View style={{bottom:verticalScale(100), right:scale(110)}}>
              <ImagePickerExample
                setImage={setImageLink}
                image={imageLink}
                url={url}
                setUrl={setUrl}
                source="edit"  // or source="add" depending on your need
              />
            </View>
            </View>
            <View style = {{bottom: verticalScale(300)}}>
            <TextButton title="Create Kid" onPress={handleAddKid} />
            <TextButton title="Back" onPress={() => {setIsAddKidModalVisible(false), playSound("minimise")}} />
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

            <TextButton title="Reset Code" onPress={handleResetCode} />
            <TextButton title="Back" onPress={() => {setResetModalVisible(false), playSound("minimise")}} />
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
                  <TextButton title="Delete Kid" onPress={handleDeleteKid} />
                  <TextButton title="Cancel" onPress={() => {setIsDeleteKidModalVisible(false), playSound("minimise")}} />
                </View>
              </View>
            </Modal>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: moderateScaleFont(24),
    fontWeight: 'bold',
    marginBottom: verticalScale(20),
  },
  container: {
    flex: 1,
    padding: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    fontSize: moderateScaleFont(16),
    color: '#007AFF',
    textAlign: 'center',
    paddingVertical: verticalScale(10),
  },
  userBox: {
    width: '80%',
    height: verticalScale(100),
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  userName: {
    fontSize: moderateScaleFont(18),
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(22),
  },
  soundControlContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: scale(10),
    position: 'absolute',
    top: verticalScale(35),
    right: scale(20),
  },
  soundEffectIcon: {
    marginLeft: scale(15),
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: scale(20),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: scale(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: scale(4),
    elevation: 5,
    height: verticalScale(300),
    width: scale(300),
  },
  modalViewBig: {
    marginHorizontal: scale(20),
    marginVertical: verticalScale(20),
    backgroundColor: "white",
    borderRadius: scale(20),
    paddingHorizontal: scale(35),
    paddingVertical: verticalScale(35),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: scale(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: scale(4),
    elevation: 5,
    height: verticalScale(500),
    width: '95%', 
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : verticalScale(-12),
    paddingLeft: scale(10),
    color: "#05375a",
    bottom: verticalScale(-30),
  },
  background: {
    flex: 1,
  },
});


export default ParentHome;