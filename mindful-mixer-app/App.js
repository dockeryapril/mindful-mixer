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
    switch (soundType) {
      case 'rain':
        if (isRainPlaying) {
          if (rainSound) await rainSound.stopAsync();
          if (rainSoundAlt) await rainSoundAlt.stopAsync();
          setIsRainPlaying(false);
        } else {
          const { sound: sound1 } = await Audio.Sound.createAsync(require('./assets/rain.mp3'));
          const { sound: sound2 } = await Audio.Sound.createAsync(require('./assets/rain.mp3'));
          setRainSound(sound1);
          setRainSoundAlt(sound2);
          setIsRainPlaying(true);
          await sound1.setVolumeAsync(rainVolume);
          await sound2.setVolumeAsync(0);
          await sound1.playAsync();
          setTimeout(() => {
            scheduleCrossfade(sound1, sound2);
          }, sound1._durationMillis - 5000); // Start crossfade 5 seconds before end
        }
        break;

      case 'ocean':
        if (isOceanPlaying) {
          if (oceanSound) await oceanSound.stopAsync();
          if (oceanSoundAlt) await oceanSoundAlt.stopAsync();
          setIsOceanPlaying(false);
        } else {
          const { sound: sound1 } = await Audio.Sound.createAsync(require('./assets/ocean.mp3'));
          const { sound: sound2 } = await Audio.Sound.createAsync(require('./assets/ocean.mp3'));
          setOceanSound(sound1);
          setOceanSoundAlt(sound2);
          setIsOceanPlaying(true);
          await sound1.setVolumeAsync(oceanVolume);
          await sound2.setVolumeAsync(0);
          await sound1.playAsync();
          setTimeout(() => {
            scheduleCrossfade(sound1, sound2);
          }, sound1._durationMillis - 5000);
        }
        break;

      case 'birds':
        if (isBirdsPlaying) {
          if (birdsSound) await birdsSound.stopAsync();
          if (birdsSoundAlt) await birdsSoundAlt.stopAsync();
          setIsBirdsPlaying(false);
        } else {
          const { sound: sound1 } = await Audio.Sound.createAsync(require('./assets/birds.mp3'));
          const { sound: sound2 } = await Audio.Sound.createAsync(require('./assets/birds.mp3'));
          setBirdsSound(sound1);
          setBirdsSoundAlt(sound2);
          setIsBirdsPlaying(true);
          await sound1.setVolumeAsync(birdsVolume);
          await sound2.setVolumeAsync(0);
          await sound1.playAsync();
          setTimeout(() => {
            scheduleCrossfade(sound1, sound2);
          }, sound1._durationMillis - 5000);
        }
        break;

      default:
        break;
    }
  };

  const scheduleCrossfade = async (sound1, sound2) => {
    await sound2.playAsync();
    for (let i = 0; i <= 30; i++) {
      let fadeOutVolume = ((30 - i) / 30) * (sound1 === rainSound ? rainVolume : sound1 === oceanSound ? oceanVolume : birdsVolume);
      let fadeInVolume = (i / 30) * (sound2 === rainSoundAlt ? rainVolume : sound2 === oceanSoundAlt ? oceanVolume : birdsVolume);
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

      {/* Ocean Sound Controls */}
      <Button title={isOceanPlaying ? 'Stop Ocean' : 'Play Ocean'} onPress={() => playWithCrossfade('ocean')} />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={oceanVolume}
        onValueChange={async (value) => {
          setOceanVolume(value);
          if (oceanSound) await oceanSound.setVolumeAsync(value);
          if (oceanSoundAlt) await oceanSoundAlt.setVolumeAsync(value);
        }}
      />
      <Text style={styles.volumeLabel}>Ocean Volume: {Math.round(oceanVolume * 100)}%</Text>

      {/* Birds Sound Controls */}
      <Button title={isBirdsPlaying ? 'Stop Birds' : 'Play Birds'} onPress={() => playWithCrossfade('birds')} />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={birdsVolume}
        onValueChange={async (value) => {
          setBirdsVolume(value);
          if (birdsSound) await birdsSound.setVolumeAsync(value);
          if (birdsSoundAlt) await birdsSoundAlt.setVolumeAsync(value);
        }}
      />
      <Text style={styles.volumeLabel}>Birds Volume: {Math.round(birdsVolume * 100)}%</Text>
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
