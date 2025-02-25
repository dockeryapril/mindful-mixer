import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

export default function App() {
  const [rainSound, setRainSound] = useState(null);
  const [oceanSound, setOceanSound] = useState(null);
  const [birdsSound, setBirdsSound] = useState(null);
  const [rainVolume, setRainVolume] = useState(1);
  const [oceanVolume, setOceanVolume] = useState(1);
  const [birdsVolume, setBirdsVolume] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timer, setTimer] = useState(null);

  const playSound = async (file, setSound, volume) => {
    const { sound } = await Audio.Sound.createAsync(file, { shouldPlay: true, isLooping: true, volume });
    setSound(sound);
    await sound.playAsync();
  };

  const toggleSound = async (soundState, setSound, file, volume) => {
    if (soundState) {
      await soundState.stopAsync();
      await soundState.unloadAsync();
      setSound(null);
    } else {
      playSound(file, setSound, volume);
    }
  };

  const handleVolumeChange = async (sound, volume, setVolume) => {
    setVolume(volume);
    if (sound) await sound.setVolumeAsync(volume);
  };

  const startTimer = (seconds) => {
    setTimeRemaining(seconds);
    if (timer) clearInterval(timer);
    const newTimer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(newTimer);
          stopAllSounds();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(newTimer);
  };

  const stopAllSounds = async () => {
    if (rainSound) await rainSound.stopAsync();
    if (oceanSound) await oceanSound.stopAsync();
    if (birdsSound) await birdsSound.stopAsync();
    setRainSound(null);
    setOceanSound(null);
    setBirdsSound(null);
    setTimeRemaining(0);
  };

  useEffect(() => {
    return () => {
      if (rainSound) rainSound.unloadAsync();
      if (oceanSound) oceanSound.unloadAsync();
      if (birdsSound) birdsSound.unloadAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎶 Mindful Mixer 🎛️</Text>

      <Button title={rainSound ? 'Stop Rain' : 'Play Rain'} onPress={() => toggleSound(rainSound, setRainSound, require('./assets/rain.mp3'), rainVolume)} />
      <Slider style={styles.slider} minimumValue={0} maximumValue={1} value={rainVolume} onValueChange={(value) => handleVolumeChange(rainSound, value, setRainVolume)} />

      <Button title={oceanSound ? 'Stop Ocean' : 'Play Ocean'} onPress={() => toggleSound(oceanSound, setOceanSound, require('./assets/ocean.mp3'), oceanVolume)} />
      <Slider style={styles.slider} minimumValue={0} maximumValue={1} value={oceanVolume} onValueChange={(value) => handleVolumeChange(oceanSound, value, setOceanVolume)} />

      <Button title={birdsSound ? 'Stop Birds' : 'Play Birds'} onPress={() => toggleSound(birdsSound, setBirdsSound, require('./assets/birds.mp3'), birdsVolume)} />
      <Slider style={styles.slider} minimumValue={0} maximumValue={1} value={birdsVolume} onValueChange={(value) => handleVolumeChange(birdsSound, value, setBirdsVolume)} />

      <Button title="Start Timer (15 min)" onPress={() => startTimer(15 * 60)} />
      {timeRemaining > 0 && <Text style={styles.timerText}>Time Remaining: {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}</Text>}
      <Button title="Stop Sounds" onPress={stopAllSounds} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F7FF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#005f73',
  },
  slider: {
    width: 300,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 18,
    color: '#d62828',
    marginVertical: 10,
  },
});

CODE W/ BETTER FADING AND LOOPING

import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

export default function App() {
  const [rainSound, setRainSound] = useState(null);
  const [rainSoundAlt, setRainSoundAlt] = useState(null);
  const [rainVolume, setRainVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (rainSound) rainSound.unloadAsync();
      if (rainSoundAlt) rainSoundAlt.unloadAsync();
    };
  }, [rainSound, rainSoundAlt]);

  const playWithCrossfade = async () => {
    if (isPlaying) {
      if (rainSound) await rainSound.stopAsync();
      if (rainSoundAlt) await rainSoundAlt.stopAsync();
      setRainSound(null);
      setRainSoundAlt(null);
      setIsPlaying(false);
      return;
    }

    const { sound: sound1 } = await Audio.Sound.createAsync(require('./assets/rain.mp3'));
    const { sound: sound2 } = await Audio.Sound.createAsync(require('./assets/rain.mp3'));
    setRainSound(sound1);
    setRainSoundAlt(sound2);
    setIsPlaying(true);

    sound1.setVolumeAsync(rainVolume);
    sound2.setVolumeAsync(0);

    await sound1.playAsync();
    setTimeout(() => {
      scheduleCrossfade(sound1, sound2);
    }, sound1._durationMillis - 5000); // Start crossfade 5 seconds before end
  };

  const scheduleCrossfade = async (sound1, sound2) => {
    await sound2.playAsync();
    for (let i = 0; i <= 30; i++) {
      let fadeOutVolume = ((30 - i) / 30) * rainVolume;
      let fadeInVolume = (i / 30) * rainVolume;
      await sound1.setVolumeAsync(fadeOutVolume);
      await sound2.setVolumeAsync(fadeInVolume);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    await sound1.stopAsync();
    scheduleCrossfade(sound2, sound1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎶 Mindful Mixer 🎛️</Text>
      <Button
        title={isPlaying ? 'Stop Rain' : 'Play Rain with Crossfade'}
        onPress={playWithCrossfade}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={rainVolume}
        onValueChange={async (value) => {
          setRainVolume(value);
          if (rainSound) await rainSound.setVolumeAsync(value);
          if (rainSoundAlt) await rainSoundAlt.setVolumeAsync(value);
        }}
      />
      <Text style={styles.volumeLabel}>Rain Volume: {Math.round(rainVolume * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F7FF',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
    color: '#005f73',
  },
  slider: {
    width: 300,
    marginBottom: 20,
  },
  volumeLabel: {
    fontSize: 16,
    color: '#005f73',
  },
});

