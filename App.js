import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [sound, setSound] = useState(null);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require('./assets/rain.mp3'));
    setSound(sound);
    await sound.playAsync();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>🎶 Mindful Mixer 🎶</Text>
      <Button title="Play Rain Sound" onPress={playSound} />
    </View>
  );
}
