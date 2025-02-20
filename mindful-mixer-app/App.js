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
    scheduleCrossfade(sound1, sound2);
  };

  const scheduleCrossfade = (sound1, sound2) => {
    sound1.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        await sound2.setVolumeAsync(0);
        await sound2.replayAsync();
        for (let i = 0; i <= 10; i++) {
          await sound2.setVolumeAsync((i / 10) * rainVolume);
          await sound1.setVolumeAsync(((10 - i) / 10) * rainVolume);
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
        scheduleCrossfade(sound2, sound1);
      }
    });
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
