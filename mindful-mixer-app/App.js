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
