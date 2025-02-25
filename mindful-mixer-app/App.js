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
    switch (soundType)
