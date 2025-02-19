import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

export default function App() {
  const [rainSound, setRainSound] = useState(null);
  const [rainSoundAlt, setRainSoundAlt] = useState(null);
  const [oceanSound, setOceanSound] = useState(null);
  const [oceanSoundAlt, setOceanSoundAlt] = useState(null);
  const [birdsSound, setBirdsSound] = useState(null);
  const [birdsSoundAlt, setBirdsSoundAlt] = useState(null);
  const [rainVolume, setRainVolume] = useState(1);
  const [oceanVolume, setOceanVolume] = useState(1);
  const [birdsVolume, setBirdsVolume] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let timer;
    if (timerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            stopAllSounds();
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeRemaining, timerActive]);

  const loadAndLoopSound = async (file, setSound, setAltSound, volume) => {
    const { sound } = await Audio.Sound.createAsync(file);
    await sound.setIsLoopingAsync(false);
    await sound.setVolumeAsync(volume);
    setSound(sound);
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        if (setAltSound) {
          await sound.stopAsync();
          const { sound: newSound } = await Audio.Sound.createAsync(file);
          await newSound.setVolumeAsync(volume);
          await newSound.playAsync();
          setAltSound(newSound);
        }
      }
    });
    await sound.playAsync();
  };

  const toggleSound = async (soundState, setSound, setAltSound, file, volume) => {
    if (soundState) {
      await soundState.stopAsync();
      setSound(null);
      if (setAltSound) setAltSound(null);
    } else {
      loadAndLoopSound(file, setSound, setAltSound, volume);
    }
  };

  const handleVolumeChange = async (sound, volume) => {
    if (sound) {
      await sound.setVolumeAsync(volume);
    }
  };

  const startTimer = (seconds) => {
    setTimeRemaining(seconds);
    setTimerActive(true);
  };

  const stopAllSounds = async () => {
    if (rainSound) await rainSound.stopAsync();
    if (rainSoundAlt) await rainSoundAlt.stopAsync();
    if (oceanSound) await oceanSound.stopAsync();
    if (oceanSoundAlt) await oceanSoundAlt.stopAsync();
    if (birdsSound) await birdsSound.stopAsync();
    if (birdsSoundAlt) await birdsSoundAlt.stopAsync();
    setRainSound(null);
    setRainSoundAlt(null);
    setOceanSound(null);
    setOceanSoundAlt(null);
    setBirdsSound(null);
    setBirdsSoundAlt(null);
    setTimeRemaining(0);
    setTimerActive(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎶 Mindful Mixer 🎛️</Text>
      
      <Button
        title={rainSound ? 'Pause Rain' : 'Play Rain'}
        onPress={() => toggleSound(rainSound, setRainSound, setRainSoundAlt, require('./assets/rain.mp3'), rainVolume)}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={rainVolume}
        onValueChange={value => {
          setRainVolume(value);
          handleVolumeChange(rainSound, value);
        }}
      />
      
      <Button
        title={oceanSound ? 'Pause Ocean' : 'Play Ocean'}
        onPress={() => toggleSound(oceanSound, setOceanSound, setOceanSoundAlt, require('./assets/ocean.mp3'), oceanVolume)}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={oceanVolume}
        onValueChange={value => {
          setOceanVolume(value);
          handleVolumeChange(oceanSound, value);
        }}
      />
      
      <Button
        title={birdsSound ? 'Pause Birds' : 'Play Birds'}
        onPress={() => toggleSound(birdsSound, setBirdsSound, setBirdsSoundAlt, require('./assets/birds.mp3'), birdsVolume)}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={birdsVolume}
        onValueChange={value => {
          setBirdsVolume(value);
          handleVolumeChange(birdsSound, value);
        }}
      />

      <Button title="Start Timer (15 min)" onPress={() => startTimer(15 * 60)} />
      {timeRemaining > 0 && (
        <Text>Time Remaining: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60}</Text>
      )}
      <Button title="Cancel Timer" onPress={stopAllSounds} />
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
