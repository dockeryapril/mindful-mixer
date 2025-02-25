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

  const [rainIsPlaying, setRainIsPlaying] = useState(false);
  const [oceanIsPlaying, setOceanIsPlaying] = useState(false);
  const [birdsIsPlaying, setBirdsIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (rainSound) rainSound.unloadAsync();
      if (oceanSound) oceanSound.unloadAsync();
      if (birdsSound) birdsSound.unloadAsync();
    };
  }, [rainSound, oceanSound, birdsSound]);

  const playSound = async (soundType) => {
    switch (soundType) {
      case 'rain':
        if (rainIsPlaying) {
          await rainSound.stopAsync();
          setRainIsPlaying(false);
        } else {
          const { sound } = await Audio.Sound.createAsync(require('./assets/rain.mp3'), {
            shouldPlay: true,
            isLooping: true,
          });
          setRainSound(sound);
          await sound.setVolumeAsync(rainVolume);
          setRainIsPlaying(true);
        }
        break;
      case 'ocean':
        if (oceanIsPlaying) {
          await oceanSound.stopAsync();
          setOceanIsPlaying(false);
        } else {
          const { sound } = await Audio.Sound.createAsync(require('./assets/ocean.mp3'), {
            shouldPlay: true,
            isLooping: true,
          });
          setOceanSound(sound);
          await sound.setVolumeAsync(oceanVolume);
          setOceanIsPlaying(true);
        }
        break;
      case 'birds':
        if (birdsIsPlaying) {
          await birdsSound.stopAsync();
          setBirdsIsPlaying(false);
        } else {
          const { sound } = await Audio.Sound.createAsync(require('./assets/birds.mp3'), {
            shouldPlay: true,
            isLooping: true,
          });
          setBirdsSound(sound);
          await sound.setVolumeAsync(birdsVolume);
          setBirdsIsPlaying(true);
        }
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎶 Mindful Mixer 🎛️</Text>

      {/* Rain Sound Button */}
      <Button
        title={rainIsPlaying ? 'Stop Rain' : 'Play Rain'}
        onPress={() => playSound('rain')}
      />
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
      <Text style={styles.volumeLabel}>Rain Volume: {Math.round(rainVolume * 100)}%</Text>

      {/* Ocean Sound Button */}
      <Button
        title={oceanIsPlaying ? 'Stop Ocean' : 'Play Ocean'}
        onPress={() => playSound('ocean')}
      />
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
      <Text style={styles.volumeLabel}>Ocean Volume: {Math.round(oceanVolume * 100)}%</Text>

      {/* Birds Sound Button */}
      <Button
        title={birdsIsPlaying ? 'Stop Birds' : 'Play Birds'}
        onPress={() => playSound('birds')}
      />
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
