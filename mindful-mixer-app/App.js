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
