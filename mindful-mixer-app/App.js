import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
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

  const [isRainPlaying, setIsRainPlaying] = useState(false);
  const [isOceanPlaying, setIsOceanPlaying] = useState(false);
  const [isBirdsPlaying, setIsBirdsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (rainSound) rainSound.unloadAsync();
      if (rainSoundAlt) rainSoundAlt.unloadAsync();
      if (oceanSound) oceanSound.unloadAsync();
      if (oceanSoundAlt) oceanSoundAlt.unloadAsync();
      if (birdsSound) birdsSound.unloadAsync();
      if (birdsSoundAlt) birdsSoundAlt.unloadAsync();
    };
  }, [rainSound, rainSoundAlt, oceanSound, oceanSoundAlt, birdsSound, birdsSoundAlt]);

  const playWithCrossfade = async (soundType) => {
    let sound1, sound2;
    switch (soundType) {
      case 'rain':
        if (isRainPlaying) {
          if (rainSound) await rainSound.stopAsync();
          if (rainSoundAlt) await rainSoundAlt.stopAsync();
          setIsRainPlaying(false);
        } else {
          const { sound: s1 } = await Audio.Sound.createAsync(require('./assets/rain.mp3'));
          const { sound: s2 } = await Audio.Sound.createAsync(require('./assets/rain.mp3'));
          setRainSound(s1);
          setRainSoundAlt(s2);
          setIsRainPlaying(true);
          sound1 = s1;
          sound2 = s2;
          await sound1.setVolumeAsync(rainVolume);
          await sound2.setVolumeAsync(0);
          await sound1.playAsync();
          setTimeout(() => scheduleCrossfade(sound1, sound2, 'rain'), sound1._durationMillis - 5000);
        }
        break;

      case 'ocean':
        if (isOceanPlaying) {
          if (oceanSound) await oceanSound.stopAsync();
          if (oceanSoundAlt) await oceanSoundAlt.stopAsync();
          setIsOceanPlaying(false);
        } else {
          const { sound: s1 } = await Audio.Sound.createAsync(require('./assets/ocean.mp3'));
          const { sound: s2 } = await Audio.Sound.createAsync(require('./assets/ocean.mp3'));
          setOceanSound(s1);
          setOceanSoundAlt(s2);
          setIsOceanPlaying(true);
          sound1 = s1;
          sound2 = s2;
          await sound1.setVolumeAsync(oceanVolume);
          await sound2.setVolumeAsync(0);
          await sound1.playAsync();
          setTimeout(() => scheduleCrossfade(sound1, sound2, 'ocean'), sound1._durationMillis - 5000);
        }
        break;

      case 'birds':
        if (isBirdsPlaying) {
          if (birdsSound) await birdsSound.stopAsync();
          if (birdsSoundAlt) await birdsSoundAlt.stopAsync();
          setIsBirdsPlaying(false);
        } else {
          const { sound: s1 } = await Audio.Sound.createAsync(require('./assets/birds.mp3'));
          const { sound: s2 } = await Audio.Sound.createAsync(require('./assets/birds.mp3'));
          setBirdsSound(s1);
          setBirdsSoundAlt(s2);
          setIsBirdsPlaying(true);
          sound1 = s1;
          sound2 = s2;
          await sound1.setVolumeAsync(birdsVolume);
          await sound2.setVolumeAsync(0);
          await sound1.playAsync();
          setTimeout(() => scheduleCrossfade(sound1, sound2, 'birds'), sound1._durationMillis - 5000);
        }
        break;
    }
  };

  const scheduleCrossfade = async (sound1, sound2, soundType) => {
    await sound2.playAsync();
    for (let i = 0; i <= 30; i++) {
      const fadeOutVolume = ((30 - i) / 30) * (soundType === 'rain' ? rainVolume : soundType === 'ocean' ? oceanVolume : birdsVolume);
      const fadeInVolume = (i / 30) * (soundType === 'rain' ? rainVolume : soundType === 'ocean' ? oceanVolume : birdsVolume);
      await sound1.setVolumeAsync(fadeOutVolume);
      await sound2.setVolumeAsync(fadeInVolume);
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    await sound1.stopAsync();
    scheduleCrossfade(sound2, sound1, soundType);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎶 Mindful Mixer 🎛️</Text>

      {/* Rain Sound Controls */}
      <Button title={isRainPlaying ? 'Stop Rain' : 'Play Rain'} onPress={() => playWithCrossfade('rain')} />
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

      {/* Ocean Sound Controls *
