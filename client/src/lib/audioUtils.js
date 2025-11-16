// A simple utility to play sounds without needing audio files.
const playTone = (frequency = 440, duration = 100, volume = 0.1) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration / 1000);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (error) {
    console.error("Could not play audio:", error);
  }
};

export const playStartSound = () => playTone(523.25, 80, 0.1); // C5 tone
export const playStopSound = () => playTone(440, 80, 0.1); // A4 tone
export const playOpenSound = () => playTone(659.25, 50, 0.08); // E5 tone   