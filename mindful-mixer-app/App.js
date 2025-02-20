import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

export default function App() {
  const [rainSound, setRainSound] = useState(null);
  const [rainSoundAlt, setRainSoundAlt] = useState(null);
  const [rainVolume, setRainVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const overlapDuration = 5000; // 5 seconds crossfade overlap

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
      if (status.isLoaded && status.durationMillis && status.positionMillis) {
        if (status.positionMillis >= status.durationMillis - overlapDuration) {
          await sound2.replayAsync();
          smoothCrossfade(sound1, sound2);
        }
      }
    });
  };

  const smoothCrossfade = async (fadeOutSound, fadeInSound) => {
    const fadeDuration = 2000; // 2 seconds smooth transition
    const steps = 20;
    const stepInterval = fadeDuration / steps;

    for (let i = 0; i <= steps; i++) {
      let fadeOutVolume = ((steps - i) / steps) * rainVolume;
      let fadeInVolume = (i / steps) * rainVolume;
      await fadeOutSound.setVolumeAsync(fadeOutVolume);
      await fadeInSound.setVolumeAsync(fadeInVolume);
      await new Promise((resolve) => setTimeout(resolve, stepInterval));
    }

    scheduleCrossfade(fadeInSound, fadeOutSound);
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
