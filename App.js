import React, { useState } from 'react';
import { Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  console.log('Rendering App Component');  // Make sure App is rendering
  const [sound, setSound] = useState();

  const playSound = async () => {
    console.log('Button pressed, trying to load sound...');  // Check if function is triggered
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/rain.mp3')  // Make sure the file path is correct
    );
    setSound(sound);
    console.log('Sound loaded, playing sound...');  // Check if sound is playing
    await sound.playAsync();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Mindful Mixer! 🌿🎧</Text>
      <Button title="Play Rain Sound" onPress={playSound} />
    </View>
  );
}
