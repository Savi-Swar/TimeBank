import { Audio } from 'expo-av';

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
    console.error('Error loading sounds:', error);
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


async function playSound(soundKey) {
  try {
    await sounds[soundKey].replayAsync();
  } catch (error) {
    console.error(`Error playing ${soundKey}:`, error);
  }
}

// Function to toggle sound effects
async function toggleSoundEffects() {
  areSoundEffectsEnabled = !areSoundEffectsEnabled;
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

export { loadSounds, playSound, unloadSounds, sounds, toggleSoundEffects };