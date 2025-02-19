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
      setTimeRemaining(0);  // Reset tim
