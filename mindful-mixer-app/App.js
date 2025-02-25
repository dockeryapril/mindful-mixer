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
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (rainSound) rainSound.unloadAsync();
      if (oceanSound) oceanSound.unloadAsync();
      if (birdsSound) birdsSound.unloadAsync();
    };
  }, [rainSound, oceanSound, birdsSound]);

  const playWithCrossfade = async () => {
    if (isPlaying) {
      if (rainSound) await rainSound.stopAsync();
      if (oceanSound) await oceanSound.stopAsync();
      if (birdsSound) await birdsSound.stopAsync();
      setRainSound(null);
      setOceanSound(null);
      setBirdsSound(null);
      setIsPlaying(false);
      return;
    }

    const { sound: rain1 } = await Audio.Sound.createAsync(require('./assets/rain.mp3'));
    const { sound: ocean1 } = await Audio.Sound.createAsync(require('./assets/ocean.mp3'));
    const { sound: birds1 } = await Audio.Sound.createAsync(require('./assets/birds.mp3'));

    setRainSound(rain1);
    setOceanSound(ocean1);
    setBirdsSound(birds1);
    setIsPlaying(true);

    rain1.setVolumeAsync(rainVolume);
    ocean1.setVolumeAsync(oceanVolume);
    birds1.setVolumeAsync(birdsVolume);

    await rain1.playAsync();
    await ocean1.playAsync();
    await birds1.playAsync();

    // Start crossfade based on each track's duration
    setTimeout(() => {
      scheduleCrossfade(rain1, ocean1, birds1);
    }, Math.min(rain1._durationMillis, ocean1._durationMillis, birds1._durationMillis) - 5000); // Adjust crossfade timing
  };

  const scheduleCrossfade = async (rainSound, oceanSound, birdsSound) => {
    // Adjust crossfade volume levels for all sounds
    const sounds = [rainSound, oceanSound, birdsSound];
    for (let i = 0; i < sounds.length; i++) {
      let sound = sounds[i];
      let volume = i === 0 ? rainVolume : i === 1 ? oceanVolume : birdsVolume;
      await sound.playAsync();

      for (let j = 0; j <= 30; j++) {
        let fadeOutVolume = ((30 - j) / 30) * volume;
        let fadeInVolume = (j / 30) * volume;
        await rainSound.setVolumeAsync(fadeOutVolume);
        await oceanSound.setVolumeAsync(fadeInVolume);
        await new Promise((resolve) => setTimeout(resolve, 150));  // Wait for 150ms between volume changes
      }
    }
    scheduleCrossfade(rainSound, oceanSound, birdsSound);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎶 Mindful Mixer 🎛️</Text>
      <Button
        title={isPlaying ? 'Stop All Sounds' : 'Play Sounds'}
        onPress={playWithCrossfade}
      />
      <Text style={styles.volumeLabel}>Rain Volume: {Math.round(rainVolume * 100)}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={rainVolume}
        onValueChange={async (value) => {
          setRainVolume(value);
          if (rainSound) await rainSound.setVolumeAsync(value);
        }}
      />
      <Text style={styles.volumeLabel}>Ocean Volume: {Math.round(oceanVolume * 100)}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={oceanVolume}
        onValueChange={async (value) => {
          setOceanVolume(value);
          if (oceanSound) await oceanSound.setVolumeAsync(value);
        }}
      />
      <Text style={styles.volumeLabel}>Birds Volume: {Math.round(birdsVolume * 100)}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={birdsVolume}
        onValueChange={async (value) => {
          setBirdsVolume(value);
          if (birdsSound) await birdsSound.setVolumeAsync(value);
        }}
      />
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
