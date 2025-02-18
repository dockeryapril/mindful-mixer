import React, { useState } from 'react';
import { Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [sound, setSound] = useState();

  const playSound = async () => {
    console.log('Button pressed, trying to load sound...');
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/rain.mp3')  // Ensure the path is correct here
      );
      setSound(sound);
      console.log('Sound loaded, playing sound...');
      await sound.playAsync();
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Mindful Mixer! 🌿🎧</Text>
      <Button title="Play Rain Sound" onPress={playSound} />
    </View>
  );
}
