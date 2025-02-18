import React, { useState } from 'react';
import { Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [sound, setSound] = useState();

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/rain.mp3')  // Place your sound file in the assets folder
    );
    setSound(sound);
    await sound.playAsync();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Mindful Mixer! 🌿🎧</Text>
      <Button title="Play Nature Sound" onPress={playSound} />
    </View>
  );
}
