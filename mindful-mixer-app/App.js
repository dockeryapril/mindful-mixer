import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider'; // Slider package for sound volume control

export default function App() {
  const [rainSound, setRainSound] = useState(null);
  const [oceanSound, setOceanSound] = useState(null);
  const [birdsSound, setBirdsSound] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0); // Timer state
  const [timer, setTimer] = useState(null);  // Timer ID

  // Function to play/pause sound
  const toggleSound = async (soundState, setSound, file, loop = false) => {
    if (soundState) {
      await soundState.stopAsync();
      setSound(null);
    } else {
      const { sound } = await Audio.Sound.createAsync(file, {
        shouldPlay: true,
        isLooping: loop, // Looping sound functionality
      });
      setSound(sound);
      await sound.playAsync();
    }
  };

  // Function to start the timer
  const startTimer = (durationInSeconds) => {
    setTimeRemaining(durationInSeconds);
    const timerID = setTimeout(() => {
      if (rainSound) rainSound.stopAsync(); // Stop the sound after the timer
      if (oceanSound) oceanSound.stopAsync();
      if (birdsSound) birdsSound.stopAsync();
      setRainSound(null);
      setOceanSound(null);
      setBirdsSound(null);
      setTimeRemaining(0);  // Reset time remaining
    }, durationInSeconds * 1000);

    setTimer(timerID);
  };

  // Function to cancel the timer
  const cancelTimer = () => {
    if (timer) {
      clearTimeout(timer);  // Clear the existing timer
      setTimer(null);
      setTimeRemaining(0);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎶 Mindful Mixer 🎛️</Text>

      {/* Rain sound toggle */}
      <Button
        title={rainSound ? 'Stop Rain' : 'Play Rain'}
        onPress={() => toggleSound(rainSound, setRainSound, require('./assets/rain.mp3'))}
      />

      {/* Ocean sound toggle */}
      <Button
        title={oceanSound ? 'Stop Ocean' : 'Play Ocean'}
        onPress={() => toggleSound(oceanSound, setOceanSound, require('./assets/ocean.mp3'))}
      />

      {/* Birds sound toggle */}
      <Button
        title={birdsSound ? 'Stop Birds' : 'Play Birds'}
        onPress={() => toggleSound(birdsSound, setBirdsSound, require('./assets/birds.mp3'))}
      />

      {/* Timer controls */}
      <Button
        title="Start Timer (15 min)"
        onPress={() => startTimer(15 * 60)}  // 15 minutes
      />

      {timeRemaining > 0 && (
        <Text>Time Remaining: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60}</Text>
      )}

      <Button
        title="Cancel Timer"
        onPress={cancelTimer}  // Add the cancel timer function here
      />

      {/* Slider for adjusting the sound volume */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        value={1}
        onValueChange={(value) => {
          // Adjust the volume for each sound individually
          if (rainSound) rainSound.setVolumeAsync(value);
          if (oceanSound) oceanSound.setVolumeAsync(value);
          if (birdsSound) birdsSound.setVolumeAsync(value);
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
    height: 40,
    marginTop: 20,
  },
});
