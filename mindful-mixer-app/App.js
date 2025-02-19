import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider'; // Ensure correct import

export default function App() {
  const [rainSound, setRainSound] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0); // Time remaining in seconds
  const [timer, setTimer] = useState(null);  // Timer ID to clear if needed

  // Function to play/pause sound
  const toggleSound = async (soundState, setSound, file, loop = false) => {
    if (soundState) {
      await soundState.stopAsync();
      setSound(null);
    } else {
      const { sound } = await Audio.Sound.createAsync(file, {
        shouldPlay: true,
        isLooping: loop, // Looping the sound
      });
      setSound(sound);
      await sound.playAsync();
    }
  };

  // Timer functionality
  const startTimer = (durationInSeconds) => {
    setTimeRemaining(durationInSeconds);
    const timerID = setTimeout(() => {
      if (rainSound) rainSound.stopAsync();  // Stop the sound after the timer
      setRainSound(null);
      setTimeRemaining(0);  // Reset time remaining
    }, durationInSeconds * 1000);

    setTimer(timerID);
  };

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

      <Button
        title={rainSound ? 'Stop Rain' : 'Play Rain'}
        onPress={() => toggleSound(rainSound, setRainSound, require('./assets/rain.mp3'))}
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

      {/* Slider for sound volume */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        value={1}
        onValueChange={(value) => {
          if (rainSound) {
            rainSound.setVolumeAsync(value);  // Adjust volume dynamically
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItem
