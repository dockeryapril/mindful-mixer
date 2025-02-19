import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

export default function App() {
  const [rainSound, setRainSound] = useState(null);
  const [oceanSound, setOceanSound] = useState(null);
  const [birdsSound, setBirdsSound] = useState(null);
  const [rainVolume, setRainVolume] = useState(1);
  const [oceanVolume, setOceanVolume] = useState(1);
  const [birdsVolume, setBirdsVolume] = useState(1);

  const toggleSound = async (soundState, setSound, file) => {
    if (soundState) {
      await soundState.stopAsync();
      setSound(null);
    } else {
      const { sound } = await Audio.Sound.createAsync(file);
      setSound(sound);
      await sound.playAsync();
    }
  };

  const handleVolumeChange = async (sound, volume) => {
    if (sound) {
      await sound.setVolumeAsync(volume);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎶 Mindful Mixer 🎛️</Text>
      
      {/* Rain Sound */}
      <Button
        title={rainSound ? 'Stop Rain' : 'Play Rain'}
        onPress={() => toggleSound(rainSound, setRainSound, require('./assets/rain.mp3'))}
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
      <Text style={styles.volumeLabel}>Rain Volume: {Math.round(rainVolume * 100)}%</Text>
      
      {/* Ocean Sound */}
      <Button
        title={oceanSound ? 'Stop Ocean' : 'Play Ocean'}
        onPress={() => toggleSound(oceanSound, setOceanSound, require('./assets/ocean.mp3'))}
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
      <Text style={styles.volumeLabel}>Ocean Volume: {Math.round(oceanVolume * 100)}%</Text>
      
      {/* Birds Sound */}
      <Button
        title={birdsSound ? 'Stop Birds' : 'Play Birds'}
        onPress={() => toggleSound(birdsSound, setBirdsSound, require('./assets/birds.mp3'))}
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

