import { Audio } from 'expo-av';

/**
 * Plays English pronunciation audio for a given word using cached audio URL or Google TTS fallback.
 * Utilizes expo-av which is already installed in the project.
 */
export const playPronunciation = async (word: string, customAudioUrl?: string) => {
  if (!word) return;
  try {
    // Configure audio mode to ensure sound plays correctly on both iOS and Android
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    // Use the VoiceAI backend TTS API for edge_tts voice. Defaulting to Android Emulator loopback IP.
    // If you are testing on a real device, replace 10.0.2.2 with your computer's local IP address.
    const url = customAudioUrl && customAudioUrl.trim() !== ''
      ? customAudioUrl
      : `http://10.0.2.2:8000/api/tts?text=${encodeURIComponent(word.trim())}&voice_id=sophia`;

    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true }
    );

    // Automatically unload from memory once playback finishes to prevent memory leaks
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.warn("Failed to play pronunciation audio:", error);
  }
};
