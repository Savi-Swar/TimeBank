import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
let isSoundEffectsOn = true;
// Sound file paths
const soundPaths = {
  alert: require('./assets/audios/alert.mp3'),
  approve: require('./assets/audios/approve.mp3'),
  click: require('./assets/audios/click.mp3'),
  complete: require('./assets/audios/complete.mp3'),
  deny: require('./assets/audios/deny.mp3'),
  happyMusic: require('./assets/audios/HappyMusic.wav'),
  maximise: require('./assets/audios/maximise.mp3'),
  minimise: require('./assets/audios/minimise.mp3'),
  pop: require('./assets/audios/pop.mp3'),
  select: require('./assets/audios/select.mp3'),
  transition: require('./assets/audios/transition.mp3'),
  clock: require('./assets/audios/clock.mp3'),
};

function setSound(value) {
  isSoundEffectsOn = value;
}
// Preloading sounds
const sounds = {};
for (const key in soundPaths) {
  sounds[key] = new Audio.Sound();
}

async function loadSounds() {

  try {
    for (const key in sounds) {
      await sounds[key].loadAsync(soundPaths[key]);
      if (key === 'happyMusic') {
        await sounds[key].setIsLoopingAsync(true);
        await sounds[key].setVolumeAsync(0.5);
      }
      if (key === 'click') {
        await sounds[key].setVolumeAsync(0.33);
      }
    }
    console.log('Sounds loaded successfully');
  } catch (error) {
    console.log('Error loading sounds:', error);
  }
}

let areSoundEffectsEnabled = true;
const originalVolumes = {
  click: 0.33,
  alert: 1, // Add original volumes for each sound effect
  happyMusic: 0.5,
  maximise: 1,
  minimise: 1,
  pop: 1,
  select: 1,
  transition: 1,
  clock: 1,
  approve: 1,
  deny: 1,
  complete: 1,
};


async function playSound(soundKey, shouldPlay = true) {
  try {
    // Retrieve the sound object from the sounds dictionary
    const sound = sounds[soundKey];

    // Check if we should play or stop the sound
    if (shouldPlay) {
      // For non-music sounds, ensure they are rewound to the start before playing
      if (soundKey !== 'happyMusic') {
        if (isSoundEffectsOn) {
        // Check if the sound is currently playing and stop it
        const status = await sound.getStatusAsync();
        if (status.isPlaying) {
          await sound.stopAsync();
        }
        // Rewind to the start
        await sound.setPositionAsync(0);
        await sound.playAsync();

      }
    }
      // Play the sound
    } else {
      // If shouldPlay is false and it's not specific to stopping music, you might want to stop any sound
      // But if you're only controlling music with shouldPlay, add conditions as necessary
      await sound.stopAsync();
    }
  
  } catch (error) {
    console.log(`Error playing ${soundKey}:`, error);
  }
}



// Function to toggle sound effects
async function toggleSoundEffects() {
  setSound(!isSoundEffectsOn);
  for (const key in sounds) {
    if (key !== 'happyMusic') { // Exclude background music
      const volume = areSoundEffectsEnabled ? originalVolumes[key] : 0;
      await sounds[key].setVolumeAsync(volume);
    }
  }
}

async function unloadSounds() {
  try {
    for (const key in sounds) {
      await sounds[key].unloadAsync();
    }
    console.log('Sounds unloaded successfully');
  } catch (error) {
    console.error('Error unloading sounds:', error);
  }
}

// async function getStorage() {
//   const musicEnabledString = await AsyncStorage.getItem('musicEnabled');
//   const soundEffectsEnabledString = await AsyncStorage.getItem('soundEffectsEnabled');
  
//   // Convert string to boolean, defaulting to true if not set
//   const musicEnabled = musicEnabledString !== 'false';
//   const soundEffectsEnabled = soundEffectsEnabledString !== 'false';
  
//   return { musicEnabled, soundEffectsEnabled };
// }

export { loadSounds, playSound, unloadSounds, sounds, toggleSoundEffects, setSound };