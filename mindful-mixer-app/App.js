import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [rainSound, setRainSound] = useState(null);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎶 Mindful Mixer 🎛️</Text>
      <Button
        title={rainSound ? 'Stop Rain' : 'Play Rain'}
        onPress={() => toggleSound(rainSound, setRainSound, require('./assets/rain.mp3'))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container
